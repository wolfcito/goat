import { balanceOf, transfer } from "./methods";
import {
	getBalanceParametersSchema,
	transferParametersSchema,
} from "./parameters";

import type { EVMWalletClient, Tool } from "@goat-sdk/core";
import type { z } from "zod";
import type { ChainSpecificToken } from "./token";

export function getTools(
	walletClient: EVMWalletClient,
	tokenList: ChainSpecificToken[],
): Tool[] {
	const tools: Tool[] = [];

	for (const token of tokenList) {
		const balanceTool: Tool = {
			name: `get_${token.symbol}_balance`,
			description: `This tool gets the balance of ${token.symbol}`,
			parameters: getBalanceParametersSchema,
			method: (parameters: z.infer<typeof getBalanceParametersSchema>) =>
				balanceOf(walletClient, token, parameters),
		};

		const transferTool: Tool = {
			name: `transfer_${token.symbol}`,
			description: `This tool transfers ${token.symbol} to the specified address`,
			parameters: transferParametersSchema,
			method: (parameters: z.infer<typeof transferParametersSchema>) =>
				transfer(walletClient, token, parameters),
		};

		tools.push(balanceTool, transferTool);
	}

	return tools;
}
