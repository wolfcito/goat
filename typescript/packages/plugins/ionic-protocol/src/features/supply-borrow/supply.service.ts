import { EVMWalletClient } from "@goat-sdk/wallet-evm";

import { TOKEN_POOL_ABI } from "@common/abi";

import { Logger } from "@common/utils/logger";

import { fetchTokenConfig } from "@common/utils/asset-manager";
import { getValidatedNetwork } from "@common/utils/network-manager";
import { erc20Abi } from "viem";
import { SupplyAssetParameters } from "./supply.parameters";
import { SupplyAssetServiceResponse } from "./supply.types";

export class SupplyService {
    async supplyAsset(
        walletClient: EVMWalletClient,
        params: SupplyAssetParameters,
    ): Promise<SupplyAssetServiceResponse> {
        const { asset, amount } = params;

        try {
            const network = getValidatedNetwork(walletClient);

            const ionAsset = asset.startsWith("ion") ? asset.replace(/^ion/, "") : asset;

            const tokenConfig = fetchTokenConfig(network.id, ionAsset);

            const allowanceResult = await walletClient.read({
                address: tokenConfig.baseToken.contractAddress,
                abi: erc20Abi,
                functionName: "allowance",
                args: [walletClient.getAddress(), tokenConfig.ionToken.contractAddress],
            });

            const allowance = BigInt(allowanceResult.value as string);

            if (allowance < BigInt(amount)) {
                Logger.info(
                    `Allowance is insufficient (${allowance}). Approving ${amount} for ${tokenConfig.ionToken.contractAddress}...`,
                );

                await walletClient.sendTransaction({
                    to: tokenConfig.baseToken.contractAddress,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [tokenConfig.ionToken.contractAddress, amount],
                });

                Logger.info(`Approval successful for ${amount} to ${tokenConfig.ionToken.contractAddress}.`);
            }

            Logger.info("Supplying asset to the pool...");
            const mintTx = await walletClient.sendTransaction({
                to: tokenConfig.ionToken.contractAddress,
                abi: TOKEN_POOL_ABI,
                functionName: "mint",
                args: [BigInt(amount)],
            });

            return {
                transactionHash: mintTx.hash,
                suppliedAsset: asset,
                suppliedAmount: amount,
                poolAddress: tokenConfig.ionToken.contractAddress,
                message: `Successfully supplied ${amount} base units of ${asset} to the Ionic Protocol pool.`,
            };
        } catch (error) {
            throw new Error(`Failed to supply ${asset}. Details: ${error}`);
        }
    }
}
