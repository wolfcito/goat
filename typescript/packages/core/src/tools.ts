import type { z } from "zod";
import { getEVMTools } from "./evm/tools";
import type { Plugin } from "./plugins";
import {
    isEVMWalletClient,
    isSolanaWalletClient,
    isEVMSmartWalletClient,
    type WalletClient,
} from "./wallets";
import { getSolanaTools } from "./solana/tools";

export type Tool = {
    name: string;
    description: string;
    parameters: z.ZodSchema;
    method: (parameters: z.infer<z.ZodSchema>) => string | Promise<string>;
};

export type GetToolsParams<TWalletClient extends WalletClient> = {
    wallet: TWalletClient;
    plugins?: (Plugin<TWalletClient> | Plugin<WalletClient>)[];
};

export async function getTools<TWalletClient extends WalletClient>({
    wallet,
    plugins = [],
}: GetToolsParams<TWalletClient>) {
    const tools: Tool[] = [];

    if (isEVMWalletClient(wallet)) {
        tools.push(...getEVMTools(wallet));
    } else if (isSolanaWalletClient(wallet)) {
        tools.push(...getSolanaTools(wallet));
    } else {
        throw new Error(`Unsupported chain type: ${wallet.getChain().type}`);
    }

    for (const plugin of plugins) {
        if (!plugin.supportsChain(wallet.getChain())) {
            console.warn(
                `Plugin ${plugin.name} does not support chain ${wallet.getChain().type}. Skipping.`
            );
            continue;
        }

        if (!plugin.supportsSmartWallets() && isEVMSmartWalletClient(wallet)) {
            console.warn(
                `Plugin ${plugin.name} does not support smart wallets. Skipping.`
            );
            continue;
        }

        tools.push(...(await plugin.getTools(wallet)));
    }

    return tools;
}
