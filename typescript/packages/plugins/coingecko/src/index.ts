import type { Chain, EVMWalletClient, Plugin } from "@goat-sdk/core";
import { getTools } from "./tools";

export function coingecko(credentials: {
	key: string;
}): Plugin<any> {
	return {
		name: "coingecko",
		supportsChain: () => true,
		supportsSmartWallets: () => true,
		getTools: async () => {
			return getTools({
				key: credentials.key,
			});
		},
	};
}
