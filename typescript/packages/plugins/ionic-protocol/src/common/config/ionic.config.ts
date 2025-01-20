import { MODE, type Token, USDC, WETH, getTokensForNetwork } from "@goat-sdk/plugin-erc20";
import { type Address } from "viem";
import { mode, optimism } from "viem/chains";

export const ionicProtocolConfig: {
    [chainId: number]: IonicProtocolConfigProps;
} = {
    [mode.id]: {
        tokens: generateTokenConfig(mode.id, [
            {
                token: USDC,
                ionContract: "0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038",
            },
            {
                token: WETH,
                ionContract: "0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2",
            },
            {
                token: MODE,
                ionContract: "0x4341620757Bee7EB4553912FaFC963e59C949147",
            },
        ]),
        marketController: "0xfb3323e24743caf4add0fdccfb268565c0685556",
    },
    [optimism.id]: {
        tokens: generateTokenConfig(optimism.id, [
            {
                token: USDC,
                ionContract: "0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038",
            },
            {
                token: WETH,
                ionContract: "0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2",
            },
            {
                token: MODE,
                ionContract: "0x4341620757Bee7EB4553912FaFC963e59C949147",
            },
        ]),
        marketController: "0xfb3323e24743caf4add0fdccfb268565c0685556",
    },
};

export interface IonicProtocolConfigProps {
    tokens: {
        [symbol: string]: TokenConfig;
    };
    marketController: Address;
}

export interface TokenConfig {
    ionToken: {
        contractAddress: Address;
        decimals: number;
    };
    baseToken: {
        contractAddress: Address;
        decimals: number;
    };
}

/**
 * Generates token configuration for the specified chain.
 * @param chainId The chain ID for which to generate the configuration.
 * @param tokenData An array of tokens and their corresponding Ion contracts.
 * @returns A mapping of token symbols to their configurations.
 */
function generateTokenConfig(
    chainId: number,
    tokenData: { token: Token; ionContract: Address }[],
): { [symbol: string]: TokenConfig } {
    return tokenData.reduce(
        (config, { token, ionContract }) => {
            const [baseToken] = getTokensForNetwork(chainId, [token]);

            if (!baseToken) {
                throw new Error(`Base token configuration not found for ${token.symbol} on chain ${chainId}`);
            }

            config[token.symbol] = {
                ionToken: {
                    contractAddress: ionContract,
                    decimals: token.decimals,
                },
                baseToken: {
                    contractAddress: baseToken.contractAddress,
                    decimals: baseToken.decimals,
                },
            };
            return config;
        },
        {} as { [symbol: string]: TokenConfig },
    );
}
