import type { Tool } from "./tools";
import type { WalletClient } from "./wallet";

/**
 * Plugin interface that can be chain-specific or chain-agnostic.
 * Defaults to WalletClient for chain-agnostic plugins.
 */
export interface Plugin<TWalletClient extends WalletClient = WalletClient> {
    name: string;
    getTools: (wallet: TWalletClient) => Promise<Tool[]>;
}
