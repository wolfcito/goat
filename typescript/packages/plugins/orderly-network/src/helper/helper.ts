import { Address, encodeAbiParameters, encodePacked, keccak256 } from "viem";

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

export async function getAccountId(evmAddress?: string): Promise<string> {
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
