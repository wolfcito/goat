import { Signature } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { API } from "@orderly.network/types";
import bs58 from "bs58";
import { match } from "ts-pattern";
import { Address, encodeAbiParameters, encodePacked, keccak256 } from "viem";
import { getPublicKey, sign } from "./cripto";

export function getBrokerId(): string {
    const brokerId = process.env.ORDERLY_BROKER_ID;
    if (!brokerId) {
        throw new Error("ORDERLY_BROKER_ID is not set");
    }
    return brokerId;
}

export function getNetwork(): "mainnet" | "testnet" {
    const network = process.env.ORDERLY_NETWORK as "mainnet" | "testnet";
    if (!network) {
        throw new Error("ORDERLY_NETWORK is not set");
    }
    return network;
}

export function getChainMode(): "solana" | "evm" {
    const chainMode = process.env.ORDERLY_CHAIN_MODE as "solana" | "evm";
    if (!chainMode) {
        throw new Error("ORDERLY_CHAIN_MODE is not set");
    }
    return chainMode;
}

export function getAccountId(evmAddress?: string): string {
    const brokerId = getBrokerId();

    const chainMode = getChainMode();

    let address: string;

    if (chainMode === "evm") {
        if (!evmAddress) {
            throw new Error("Se requiere una dirección EVM para calcular el accountId");
        }
        address = evmAddress;
    } else {
        throw new Error("Unsupported chain mode");
    }

    return keccak256(
        encodeAbiParameters(
            [{ type: "address" }, { type: "bytes32" }],
            [address as Address, keccak256(encodePacked(["string"], [brokerId]))],
        ),
    );
}

export async function getOrderlyKey(): Promise<Uint8Array> {
    const orderlyKey = process.env.ORDERLY_PRIVATE_KEY as `ed25519:${string}` | undefined;
    if (!orderlyKey) {
        throw new Error("ORDERLY_PRIVATE_KEY is not set");
    }
    return bs58.decode(orderlyKey.substring(8));
}

export async function getPositions(
    network: "mainnet" | "testnet",
    accountId: string,
    orderlyKey: Uint8Array,
): Promise<API.PositionAggregated & { rows: API.Position[] }> {
    const res = await signAndSendRequest(accountId, orderlyKey, `${getBaseUrlFromNetwork(network)}/v1/positions`);

    if (!res.ok) {
        throw new Error(`Could not fetch positions: ${await res.text()}`);
    }
    const json = (await res.json()) as {
        success: boolean;
        message?: string;
        data: API.PositionAggregated & { rows: API.Position[] };
    };
    if (!json.success) {
        throw new Error(json.message);
    }
    return json.data;
}

function base64EncodeURL(byteArray: Uint8Array) {
    return btoa(
        Array.from(new Uint8Array(byteArray))
            .map((val) => {
                return String.fromCharCode(val);
            })
            .join(""),
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function getBaseUrlFromNetwork(network: "mainnet" | "testnet"): string {
    return network === "mainnet" ? "https://api.orderly.org" : "https://testnet-api.orderly.org";
}

export async function signAndSendRequest(
    accountId: string,
    orderlyKey: Uint8Array,
    input: string | URL,
    init?: RequestInit,
): Promise<Response> {
    try {
        const timestamp = Date.now();
        const encoder = new TextEncoder();
        const url = input instanceof URL ? input : new URL(input);

        let message = `${String(timestamp)}${init?.method ?? "GET"}${url.pathname}${url.search}`;
        if (init?.body) {
            message += init.body;
        }
        const orderlySignature = sign(encoder.encode(message), orderlyKey);

        return fetch(input, {
            headers: {
                "Content-Type":
                    init?.method !== "GET" && init?.method !== "DELETE"
                        ? "application/json"
                        : "application/x-www-form-urlencoded",
                "orderly-timestamp": String(timestamp),
                "orderly-account-id": accountId,
                "orderly-key": `ed25519:${bs58.encode(getPublicKey(orderlyKey))}`,
                "orderly-signature": base64EncodeURL(orderlySignature),
                ...(init?.headers ?? {}),
            },
            ...(init ?? {}),
        });
    } catch (error) {
        throw new Error(`Failed to sign and send request: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function settlePnlFromOrderly(
    chainId: number,
    brokerId: string,
    accountId: string,
    orderlyKey: Uint8Array,
    walletClient: EVMWalletClient,
): Promise<void> {
    const network = getNetwork();

    const nonceRes = await signAndSendRequest(
        accountId,
        orderlyKey,
        `${getBaseUrlFromNetwork(network)}/v1/settle_nonce`,
    );
    const nonceJson = await nonceRes.json();
    const settleNonce = nonceJson.data.settle_nonce as string;

    const chainMode = getChainMode();

    let message: SettlePnlMessage;
    let signature: Signature;
    let address: string;

    if (chainMode === "evm") {
        const settlePnlMessage = {
            brokerId,
            chainId,
            settleNonce,
            timestamp: String(Date.now()),
        };

        message = settlePnlMessage;

        signature = await walletClient.signTypedData({
            message: settlePnlMessage,
            primaryType: "SettlePnl",
            types: MESSAGE_TYPES,
            domain: getOnChainDomain(network, chainId),
        });
        address = walletClient.getAddress();
    } else {
        throw new Error("Chain mode not supported in this snippet");
    }

    const res = await signAndSendRequest(accountId, orderlyKey, `${getBaseUrlFromNetwork(network)}/v1/settle_pnl`, {
        method: "POST",
        body: JSON.stringify({
            message,
            signature: signature.signature,
            userAddress: address,
            verifyingContract: getVerifyingAddress(network),
        }),
    });
    const settlePnlJson = await res.json();
    console.log("settlePnlJson", { settlePnlJson });
    if (!settlePnlJson.success) {
        throw new Error(settlePnlJson.message);
    }
}

export async function withdrawUSDCFromOrderly(
    chainId: number,
    brokerId: string,
    accountId: string,
    orderlyKey: Uint8Array,
    amount: bigint,
    walletClient: EVMWalletClient,
): Promise<{ success: boolean; message: string; code: number }> {
    const network = getNetwork();

    const nonceRes = await signAndSendRequest(
        accountId,
        orderlyKey,
        `${getBaseUrlFromNetwork(network)}/v1/withdraw_nonce`,
    );

    const nonceJson = await nonceRes.json();

    const withdrawNonce = nonceJson.data.withdraw_nonce as string;

    const chainMode = getChainMode();

    let message: WithdrawMessage;
    let signature: Signature;
    let address: string;

    if (chainMode === "evm") {
        const withdrawMessage = {
            brokerId,
            chainId,
            receiver: walletClient.getAddress(),
            token: "USDC",
            amount: Number(amount),
            timestamp: String(Date.now()),
            withdrawNonce: String(withdrawNonce),
        };
        message = withdrawMessage;

        signature = await walletClient.signTypedData({
            message: withdrawMessage,
            primaryType: "Withdraw",
            types: MESSAGE_TYPES,
            domain: getOnChainDomain(network, chainId),
        });
        address = walletClient.getAddress();
    } else {
        throw new Error("Unsupported chain mode");
    }

    const res = await signAndSendRequest(
        accountId,
        orderlyKey,
        `${getBaseUrlFromNetwork(network)}/v1/withdraw_request`,
        {
            method: "POST",
            body: JSON.stringify({
                message,
                signature: signature.signature,
                userAddress: address,
                verifyingContract: getVerifyingAddress(network),
            }),
        },
    );
    const withdrawJson = await res.json();
    console.log("withdrawJson", { withdrawJson });
    if (!withdrawJson.success) {
        throw new Error(withdrawJson.message);
    }
    return { success: withdrawJson.success, message: withdrawJson.message, code: withdrawJson.code };
}

export function getOnChainDomain(network: "mainnet" | "testnet", chainId: number): EIP712Domain {
    return {
        name: "Orderly",
        version: "1",
        chainId: chainId,
        verifyingContract: getVerifyingAddress(network) as `0x${string}`,
    };
}

export function getVerifyingAddress(network: "mainnet" | "testnet"): string {
    return match(network)
        .with("mainnet", () => "0x6F7a338F2aA472838dEFD3283eB360d4Dff5D203")
        .with("testnet", () => "0x1826B75e2ef249173FC735149AE4B8e9ea10abff")
        .exhaustive();
}

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
}

interface SettlePnlMessage {
    brokerId: string;
    chainId: number;
    settleNonce: string;
    timestamp: string;
}

interface WithdrawMessage {
    brokerId: string;
    chainId: number;
    receiver: string;
    token: string;
    amount: number;
    timestamp: string;
    withdrawNonce: string;
}

export const MESSAGE_TYPES = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ],
    Registration: [
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "timestamp", type: "uint64" },
        { name: "registrationNonce", type: "uint256" },
    ],
    AddOrderlyKey: [
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "orderlyKey", type: "string" },
        { name: "scope", type: "string" },
        { name: "timestamp", type: "uint64" },
        { name: "expiration", type: "uint64" },
    ],
    Withdraw: [
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "receiver", type: "address" },
        { name: "token", type: "string" },
        { name: "amount", type: "uint256" },
        { name: "withdrawNonce", type: "uint64" },
        { name: "timestamp", type: "uint64" },
    ],
    SettlePnl: [
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "settleNonce", type: "uint64" },
        { name: "timestamp", type: "uint64" },
    ],
    DelegateSigner: [
        { name: "delegateContract", type: "address" },
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "timestamp", type: "uint64" },
        { name: "registrationNonce", type: "uint256" },
        { name: "txHash", type: "bytes32" },
    ],
    DelegateAddOrderlyKey: [
        { name: "delegateContract", type: "address" },
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "orderlyKey", type: "string" },
        { name: "scope", type: "string" },
        { name: "timestamp", type: "uint64" },
        { name: "expiration", type: "uint64" },
    ],
    DelegateWithdraw: [
        { name: "delegateContract", type: "address" },
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "receiver", type: "address" },
        { name: "token", type: "string" },
        { name: "amount", type: "uint256" },
        { name: "withdrawNonce", type: "uint64" },
        { name: "timestamp", type: "uint64" },
    ],
    DelegateSettlePnl: [
        { name: "delegateContract", type: "address" },
        { name: "brokerId", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "settleNonce", type: "uint64" },
        { name: "timestamp", type: "uint64" },
    ],
};
