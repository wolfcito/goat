import type { Chain, EVMWalletClient, Plugin } from "@goat-sdk/core";
import { getTools } from "./tools";
	
export function coingecko(): Plugin<any> {
	return {
		name: "coingecko",
		supportsChain: () => true,
		supportsSmartWallets: () => true,
		getTools: async () => {
			return getTools();
		},
	};
}
