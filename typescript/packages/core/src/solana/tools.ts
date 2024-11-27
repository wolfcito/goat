import type { z } from "zod";

import type { Tool } from "../tools";
import type { SolanaWalletClient } from "../wallet";
import { getAddress, getBalance, sendSOL } from "./methods";
import {
    getAddressParametersSchema,
    getSOLBalanceParametersSchema,
    sendSOLParametersSchema,
} from "./parameters";
import {
    getAddressPrompt,
    getSOLBalancePrompt,
    sendSOLPrompt,
} from "./prompts";

export type SolanaTool = {
    name: string;
    description: string;
    parametersSchema: z.ZodSchema;
    method: (
        walletClient: SolanaWalletClient,
        parameters: z.infer<z.ZodSchema>
    ) => string | Promise<string>;
};

export const unwrappedTools: SolanaTool[] = [
    {
        name: "get_address",
        description: getAddressPrompt,
        parametersSchema: getAddressParametersSchema,
        method: getAddress,
    },
    {
        name: "get_sol_balance",
        description: getSOLBalancePrompt,
        parametersSchema: getSOLBalanceParametersSchema,
        method: getBalance,
    },
    {
        name: "send_sol",
        description: sendSOLPrompt,
        parametersSchema: sendSOLParametersSchema,
        method: sendSOL,
    },
];

export function getSolanaTools(walletClient: SolanaWalletClient): Tool[] {
    const tools: Tool[] = unwrappedTools.map(
        ({ method: func, name, description, parametersSchema }) => {
            const method = async (
                parameters: z.infer<typeof parametersSchema>
            ) => {
                const validatedParams = parametersSchema.parse(parameters);
                return await func(walletClient, validatedParams);
            };

            return {
                name,
                description,
                parameters: parametersSchema,
                method,
            };
        }
    );

    return tools;
}
