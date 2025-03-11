import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ConstructableNodeToken, Uploader } from "@irys/upload";
import {
    Arbitrum,
    Avalanche,
    BNB,
    BaseEth,
    Bera,
    Chainlink,
    Ethereum,
    Iotex,
    LineaEth,
    Matic,
    ScrollEth,
    USDCEth,
    USDCPolygon,
} from "@irys/upload-ethereum";
import { IrysDeployParams } from "./parameters";

export class IrysXyzService {
    /**
     * Plugin 1: Deploy/integrate an Irys plug-in on GOAT.
     */
    @Tool({
        name: "deploy_irys_plugin",
        description: "Deploy and integrate an Irys plug-in on GOAT for onchain storage operations",
    })
    async deployIrysPlugin(walletClient: EVMWalletClient, parameters: IrysDeployParams): Promise<IrysDeployResponse> {
        try {
            // The token is obtained from the parameter; by default 'ethereum' is used
            const tokenParam = parameters.token?.toLowerCase() || "ethereum";

            const tokenMapping: {
                [key: string]: ConstructableNodeToken;
            } = {
                ethereum: Ethereum,
                matic: Matic,
                bnb: BNB,
                avalanche: Avalanche,
                baseeth: BaseEth,
                usdceth: USDCEth,
                arbitrum: Arbitrum,
                chainlink: Chainlink,
                usdcpolygon: USDCPolygon,
                bera: Bera,
                scrolleth: ScrollEth,
                lineaeth: LineaEth,
                iotex: Iotex,
            };

            const tokenConstructor = tokenMapping[tokenParam];
            if (!tokenConstructor) {
                return { detail: `Token '${tokenParam}' not supported` };
            }

            // The uploader instance is created using the selected token.
            const irysUploader = await Uploader(tokenConstructor).withWallet(
                process.env.WALLET_PRIVATE_KEY as `0x${string}`,
            );
            const irysAddress = irysUploader.address;
            return {
                detail: `Irys plugin deployed successfully with address ${irysAddress}`,
                irysAddress,
            };
        } catch (error) {
            return {
                detail: `Failed to deploy Irys plugin: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            };
        }
    }
}

export interface IrysDeployResponse {
    detail: string;
    irysAddress?: string;
}
