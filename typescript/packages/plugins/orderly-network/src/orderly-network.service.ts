import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { solidityPackedKeccak256 } from "ethers";
import { Address, erc20Abi } from "viem";
import { ORDERLY_VAULT_ABI, getEvmUSDCAddress, getEvmVaultAddress } from "./abi/vaults.abi";
import { getAccountId, getBrokerId } from "./helper/helper";
import { DepositOrderlyParams } from "./parameters";

export class OrderlyNetworkService {
    @Tool({
        name: "deposit_orderly_evm",
        description: "Deposit USDC into Orderly Network",
    })
    async depositOrderly(
        walletClient: EVMWalletClient,
        parameters: DepositOrderlyParams,
    ): Promise<{ hash: string; chain: number }> {
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
            accountId: (await getAccountId(walletClient.getAddress())) as Address,
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
}
