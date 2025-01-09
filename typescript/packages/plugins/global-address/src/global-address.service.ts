import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import {
    CreateGlobalAddressParams,
    FLEX,
    TOKEN_TYPE,
    createCall,
    createGlobalAddress,
} from "@zerodev/global-address";

import { Chain, erc20Abi } from "viem";
import { ZodError } from "zod";

import {
    arbitrum,
    base,
    blast,
    mainnet,
    mode,
    optimism,
    polygon,
    scroll,
    worldchain,
    zora,
} from "viem/chains";
import { GlobalAddressParams } from "./parameters";

const chains: Chain[] = [
    mainnet,
    optimism,
    polygon,
    worldchain,
    base,
    mode,
    arbitrum,
    blast,
    scroll,
    zora,
];

const chainNameMap: Record<string, string> = {
    mainnet: mainnet.name,
    optimism: optimism.name,
    polygon: polygon.name,
    worldchain: worldchain.name,
    base: base.name,
    mode: mode.name,
    arbitrum: arbitrum.name,
    blast: blast.name,
    scroll: scroll.name,
    zora: zora.name,
};

export class GlobalAddressService {
    @Tool({
        name: "create_global_address",
        description: `Creates a global deposit address for the following supported chains (mapping alias -> actual chainName): mainnet = ${mainnet.name}, optimism = ${optimism.name}, polygon = ${polygon.name}, worldchain = ${worldchain.name}, base = ${base.name}, mode = ${mode.name}, arbitrum = ${arbitrum.name}, blast = ${blast.name}, scroll= ${scroll.name}, zora = ${zora.name}.`,
    })
    async createGlobalAddress(
        walletClient: EVMWalletClient,
        parameters: GlobalAddressParams
    ): Promise<{
        globalAddress: string;
        estimatedFees: unknown;
        logs: string;
    }> {
        try {
            let srcTokens = this.getAllSupportedChains();

            const slippage = 5000;
            const { owner, chainName } = parameters;
            const destChain = this.getChainByName(chainName);

            if (destChain === undefined) {
                console.error("Chain not supported");

                return {
                    globalAddress: "0x",
                    estimatedFees: 0,
                    logs: "Unsupported chain",
                };
            }

            srcTokens = srcTokens?.filter(
                (entry) => entry.chain.id !== destChain.id
            );

            const logs = `Creating global address for ${destChain.name} chain`;

            const erc20Call = createCall({
                target: FLEX.TOKEN_ADDRESS,
                value: 0n,
                abi: erc20Abi,
                functionName: "transfer",
                args: [owner as `0x${string}`, FLEX.AMOUNT],
            });

            const nativeCall = createCall({
                target: owner as `0x${string}`,
                value: FLEX.NATIVE_AMOUNT,
            });

            const { globalAddress, estimatedFees } = await createGlobalAddress({
                destChain: destChain,
                owner: owner as `0x${string}`,
                slippage,
                actions: {
                    ERC20: {
                        action: [erc20Call],
                        fallBack: [],
                    },
                    WRAPPED_NATIVE: {
                        action: [erc20Call],
                        fallBack: [],
                    },
                    NATIVE: {
                        action: [nativeCall],
                        fallBack: [],
                    },
                },
                srcTokens: srcTokens,
            });

            return { globalAddress, estimatedFees, logs };
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(
                    `Validation Error: ${error.errors
                        .map((e) => e.message)
                        .join(", ")}`
                );
            }
            throw new Error(
                `Failed to create global address: ${(error as Error).message}`
            );
        }
    }

    getAllSupportedChains(): CreateGlobalAddressParams["srcTokens"] {
        const tokenTypes: TOKEN_TYPE[] = ["ERC20", "NATIVE", "WRAPPED_NATIVE"];

        const srcTokens: {
            tokenType: TOKEN_TYPE;
            chain: Chain;
            minAmount?: bigint;
        }[] = chains.flatMap((chain) => {
            if (chain.name.toLowerCase() === "polygon") {
                return tokenTypes
                    .filter((tokenType) => tokenType !== "NATIVE")
                    .map((tokenType) => ({ tokenType, chain }));
            }

            return tokenTypes.map((tokenType) => ({ tokenType, chain }));
        });

        return srcTokens;
    }

    getChainByName(chainName: string): Chain | undefined {
        const actualChainName = chainNameMap[chainName.toLowerCase()];
        if (!actualChainName) return undefined;

        return chains.find(
            (chain) =>
                chain.name.toLowerCase() === actualChainName.toLowerCase()
        );
    }
}
