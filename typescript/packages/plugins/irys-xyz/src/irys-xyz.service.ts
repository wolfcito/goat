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
    async deployIrysPlugin(walletClient: EVMWalletClient, parameters: IrysDeployParams): Promise<string> {
        try {
            const irysUploader = await this.getIrysUploaderForToken(parameters.token);
            const irysAddress = irysUploader.address;
            return `Irys plugin deployed successfully with address ${irysAddress}`;
        } catch (error) {
            return `Failed to deploy Irys plugin: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        }
    }

    /**
     * Plugin 2: Fund Irys account.
     */
    @Tool({
        name: "fund_irys_account",
        description: "Fund your account on the Irys network using the specified token",
    })
    async fundIrysAccount(
        walletClient: EVMWalletClient,
        parameters: { token?: string; amount: number },
    ): Promise<string> {
        try {
            const irysUploader = await this.getIrysUploaderForToken(parameters.token);
            const atomicAmount = irysUploader.utils.toAtomic(parameters.amount);
            const fundTx = await irysUploader.fund(atomicAmount);
            return `Successfully funded ${irysUploader.utils.fromAtomic(
                fundTx.quantity,
            )} ${irysUploader.token}. Transaction ID: ${fundTx.id}`;
        } catch (error) {
            return `Failed to fund Irys account: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        }
    }

    /**
     * Plugin 3: Upload textual data.
     */
    @Tool({
        name: "upload_data",
        description: "Upload textual data to the Irys network",
    })
    async uploadData(
        walletClient: EVMWalletClient,
        parameters: { token?: string; data: string; tags?: Array<{ name: string; value: string }> },
    ): Promise<string> {
        try {
            const irysUploader = await this.getIrysUploaderForToken(parameters.token);
            const receipt = await irysUploader.upload(parameters.data, { tags: parameters.tags });
            return `Data uploaded successfully. Transaction ID: ${receipt.id}`;
        } catch (error) {
            return `Failed to upload data: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        }
    }

    /**
     * Plugin 4: Upload a file.
     */
    @Tool({
        name: "upload_file",
        description: "Upload a file to the Irys network",
    })
    async uploadFile(
        walletClient: EVMWalletClient,
        parameters: { token?: string; filePath: string; tags?: Array<{ name: string; value: string }> },
    ): Promise<string> {
        try {
            const irysUploader = await this.getIrysUploaderForToken(parameters.token);
            const receipt = await irysUploader.uploadFile(parameters.filePath, { tags: parameters.tags });
            return `File uploaded successfully. Transaction ID: ${receipt.id}`;
        } catch (error) {
            return `Failed to upload file: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        }
    }

    /**
     * Plugin 5: Upload a folder.
     */
    @Tool({
        name: "upload_folder",
        description: "Upload an entire folder to the Irys network",
    })
    async uploadFolder(
        walletClient: EVMWalletClient,
        parameters: {
            token?: string;
            folderPath: string;
            indexFile?: string;
            batchSize?: number;
            keepDeleted?: boolean;
        },
    ): Promise<string> {
        try {
            const irysUploader = await this.getIrysUploaderForToken(parameters.token);
            const receipt = await irysUploader.uploadFolder(parameters.folderPath, {
                indexFile: parameters.indexFile,
                batchSize: parameters.batchSize,
                keepDeleted: parameters.keepDeleted,
            });
            return `Folder uploaded successfully. Manifest ID: ${receipt}`;
        } catch (error) {
            return `Failed to upload folder: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        }
    }

    private async getIrysUploaderForToken(tokenParam?: string) {
        // The token is obtained from the parameter; by default 'ethereum' is used.
        const tokenName = tokenParam?.toLowerCase() ?? "ethereum";
        // Mapping dictionary between names and imported tokens.
        const tokenMapping: { [key: string]: ConstructableNodeToken } = {
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
        const tokenConstructor = tokenMapping[tokenName];
        if (!tokenConstructor) {
            throw new Error(`Token '${tokenName}' not supported`);
        }
        return await Uploader(tokenConstructor).withWallet(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
    }
}
