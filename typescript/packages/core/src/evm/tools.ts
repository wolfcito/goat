import type { z } from "zod";

import type { Tool } from "../tools";
import type { EVMWalletClient } from "../wallets";
import { getAddress, getBalance, sendETH } from "./methods";
import {
	getAddressParametersSchema,
	getETHBalanceParametersSchema,
	sendETHParametersSchema,
} from "./parameters";
import {
	getAddressPrompt,
	getEthBalancePrompt,
	sendETHPrompt,
} from "./prompts";

export type EVMTool = {
	name: string;
	description: string;
	parametersSchema: z.ZodSchema;
	method: (
		walletClient: EVMWalletClient,
		parameters: z.infer<z.ZodSchema>,
	) => string | Promise<string>;
};

export const unwrappedTools: EVMTool[] = [
	{
		name: "get_address",
		description: getAddressPrompt,
		parametersSchema: getAddressParametersSchema,
		method: getAddress,
	},
	{
		name: "get_eth_balance",
		description: getEthBalancePrompt,
		parametersSchema: getETHBalanceParametersSchema,
		method: getBalance,
	},
	{
		name: "send_eth",
		description: sendETHPrompt,
		parametersSchema: sendETHParametersSchema,
		method: sendETH,
	},
];

export function getEVMTools(walletClient: EVMWalletClient): Tool[] {
	const tools: Tool[] = unwrappedTools.map(
		({ method: func, name, description, parametersSchema }) => {
			const method = async (parameters: z.infer<typeof parametersSchema>) => {
				const validatedParams = parametersSchema.parse(parameters);
				return await func(walletClient, validatedParams);
			};

			return {
				name,
				description,
				parameters: parametersSchema,
				method,
			};
		},
	);

	return tools;
}
