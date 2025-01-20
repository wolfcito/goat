import { TokenConfig, ionicProtocolConfig } from "@common/config";
import { Logger } from "@common/utils/logger";

export function fetchTokenConfig(
    networkId: number,
    tokenSymbol: string
): TokenConfig {
    const networkConfig = ionicProtocolConfig[networkId];
    if (!networkConfig) {
        Logger.error(
            `Network configuration not found for network ID ${networkId}`
        );
        throw new Error(
            `Network configuration not found for network ID ${networkId}`
        );
    }

    const tokenConfig = networkConfig.tokens[tokenSymbol];
    if (!tokenConfig) {
        Logger.error(
            `Token ${tokenSymbol} not found in network ID ${networkId}`
        );
        throw new Error(
            `Token ${tokenSymbol} not found in network ID ${networkId}`
        );
    }

    return tokenConfig;
}
