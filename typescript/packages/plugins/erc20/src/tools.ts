import { balanceOf, transfer } from "./methods";
import {
    getBalanceParametersSchema,
    transferParametersSchema,
} from "./parameters";

import type { DeferredTool, EVMWalletClient } from "@goat-sdk/core";
import type { z } from "zod";
import type { ChainSpecificToken } from "./token";

export function getTools(
    tokenList: ChainSpecificToken[]
): DeferredTool<EVMWalletClient>[] {
    const tools: DeferredTool<EVMWalletClient>[] = [];

    for (const token of tokenList) {
        const balanceTool: DeferredTool<EVMWalletClient> = {
            name: `get_${token.symbol}_balance`,
            description: `This {{tool}} gets the balance of ${token.symbol}`,
            parameters: getBalanceParametersSchema,
            method: (
                walletClient: EVMWalletClient,
                parameters: z.infer<typeof getBalanceParametersSchema>
            ) => balanceOf(walletClient, token, parameters),
        };

        const transferTool: DeferredTool<EVMWalletClient> = {
            name: `transfer_${token.symbol}`,
            description: `This {{tool}} transfers ${token.symbol} to the specified address`,
            parameters: transferParametersSchema,
            method: (
                walletClient: EVMWalletClient,
                parameters: z.infer<typeof transferParametersSchema>
            ) => transfer(walletClient, token, parameters),
        };

        tools.push(balanceTool, transferTool);
    }

    return tools;
}
