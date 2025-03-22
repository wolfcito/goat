import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { solidityPackedKeccak256 } from "ethers";
import { Address, erc20Abi } from "viem";
import { ORDERLY_VAULT_ABI, getEvmUSDCAddress, getEvmVaultAddress } from "./abi/vaults.abi";
import {
    getAccountId,
    getBrokerId,
    getNetwork,
    getOrderlyKey,
    getPositions,
    settlePnlFromOrderly,
    withdrawUSDCFromOrderly,
} from "./helper/helper";
import { DepositOrderlyParams, WithdrawOrderlyParams } from "./parameters";

export class OrderlyNetworkService {
    @Tool({
        name: "deposit_orderly_evm",
        description: "Deposit USDC into Orderly Network",
    })
    async depositOrderly(
        walletClient: EVMWalletClient,
        parameters: DepositOrderlyParams,
    ): Promise<DepositOrderlyResponse> {
        const userAddress = walletClient.getAddress();
        const chain = walletClient.getChain();
        if (!chain.id) {
            throw new Error("Chain not configured in wallet client");
        }

        const usdcAmount = BigInt(parameters.amount);
        const brokerId = getBrokerId();

        const EVM_USDC_ADDRESS = getEvmUSDCAddress(chain.id);
        const EVM_VAULT_ADDRESS = getEvmVaultAddress(chain.id);

        const depositInput = {
            brokerHash: solidityPackedKeccak256(["string"], [brokerId]) as Address,
            tokenAmount: usdcAmount,
            tokenHash: solidityPackedKeccak256(["string"], ["USDC"]) as Address,
            accountId: getAccountId(userAddress) as Address,
        };

        try {
            const allowanceRaw = await walletClient.read({
                address: EVM_USDC_ADDRESS,
                abi: erc20Abi,
                functionName: "allowance",
                args: [userAddress, EVM_VAULT_ADDRESS],
            });
            const allowance = BigInt(allowanceRaw.value as string);

            if (allowance < usdcAmount) {
                await walletClient.sendTransaction({
                    to: EVM_USDC_ADDRESS,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [EVM_VAULT_ADDRESS, usdcAmount],
                });
            }

            const depositFeeRaw = await walletClient.read({
                address: EVM_VAULT_ADDRESS,
                abi: ORDERLY_VAULT_ABI,
                functionName: "getDepositFee",
                args: [userAddress, depositInput],
            });

            const depositFee = BigInt(depositFeeRaw.value as string);
            const tx = await walletClient.sendTransaction({
                to: EVM_VAULT_ADDRESS,
                abi: ORDERLY_VAULT_ABI,
                functionName: "deposit",
                args: [depositInput],
                value: depositFee,
            });

            return { hash: tx.hash, chain: chain.id };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Deposit failed: ${error.message}`);
            }
            throw new Error("Deposit failed with unknown error");
        }
    }

    @Tool({
        name: "withdraw_orderly_evm",
        description: "Withdraw USDC from Orderly Network",
    })
    async withdrawOrderly(
        walletClient: EVMWalletClient,
        parameters: WithdrawOrderlyParams,
    ): Promise<WithdrawOrderlyResponse> {
        const userAddress = walletClient.getAddress();
        const chain = walletClient.getChain();
        if (!chain.id) {
            throw new Error("Chain not configured in wallet client");
        }

        const usdcAmount = BigInt(parameters.amount);
        const brokerId = getBrokerId();
        const accountId = getAccountId(userAddress);
        const orderlyKey = await getOrderlyKey();
        const network = getNetwork();

        try {
            const positions = await getPositions(network, accountId, orderlyKey);

            const unsettledPnl = positions.rows.reduce((acc, position) => {
                return acc + position.unsettled_pnl;
            }, 0);

            if (unsettledPnl !== 0) {
                await settlePnlFromOrderly(chain.id, brokerId, accountId, orderlyKey, walletClient);
            }

            const { code, message, success } = await withdrawUSDCFromOrderly(
                chain.id,
                brokerId,
                accountId,
                orderlyKey,
                usdcAmount,
                walletClient,
            );
            return { amount: usdcAmount.toString(), chain: chain.id, code, message, success };
        } catch (error) {
            throw new Error(`Withdrawal failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}

interface WithdrawOrderlyResponse {
    amount: string;
    chain: number;
    code: number;
    message: string;
    success: boolean;
}

interface DepositOrderlyResponse {
    hash: string;
    chain: number;
}
