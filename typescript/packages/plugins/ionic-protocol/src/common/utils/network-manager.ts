import { ionicProtocolConfig } from "@common/config";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { Logger } from "./logger";

export function getMarketController(networkId: number): string {
    const marketController = ionicProtocolConfig[networkId]?.marketController;
    if (!marketController) {
        Logger.error(`Market controller not found for network ${networkId}`);
        throw new Error(`Market controller not found for network ${networkId}`);
    }
    return marketController;
}

export function getValidatedNetwork(walletClient: EVMWalletClient) {
    const network = walletClient.getChain();
    if (!network?.id) {
        Logger.error("Unable to determine chain ID from wallet client");
        throw new Error("Unable to determine chain ID from wallet client");
    }
    return network;
}
