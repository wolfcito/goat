import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { SupplyAssetParameters } from "./supply.parameters";
import { poolAbi } from "../../common/abis/pool.abi";

export class SupplyService {
    @Tool({
        name: "ionic_supply_asset",
        description: "Supply an asset to an Ionic Protocol pool",
    })
    async supplyAsset(
        wallet: EVMWalletClient,
        params: SupplyAssetParameters
    ): Promise<string> {
        const { asset, amount } = params;
        const chain = await wallet.getChain();
        const tokenAddress =
            ionicProtocolAddresses[chain.id]?.assets?.[asset]?.address;

        if (!tokenAddress) {
            throw new Error(
                `Token address not found for ${asset} on chain ${chain.id}`
            );
        }

        const txn = await wallet.sendTransaction({
            to: tokenAddress,
            abi: poolAbi,
            functionName: "mint",
            args: [BigInt(amount)],
        });

        return txn.hash;
    }
}
