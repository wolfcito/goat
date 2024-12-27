import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class GetBalanceParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        account: z.string().describe("The account address"),
        token: z.string().describe("The token address")
    })
) {}

export class GetAllowanceParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        token: z.string().describe("The token address"),
        owner: z.string().describe("The owner address"),
        spender: z.string().describe("The spender address")
    })
) {}

export class GetQuoteParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        tokenIn: z.string().describe("The input token address"),
        tokenOut: z.string().describe("The output token address"),
        order: z.object({
            type: z.enum(["sell", "buy"]),
            sellAmount: z.string().describe("Amount in basis points (e.g., 1000000 for 1 USDC)")
        }).describe("Order details"),
        slippagePercentage: z.number().describe("Maximum allowed slippage"),
        gasSpeed: z.object({
            speed: z.enum(["instant", "fast", "standard", "slow"])
        }).optional(),
        config: z.object({
            sort: z.object({
                by: z.string()
            })
        }).optional()
    })
) {}

export class ExecuteSwapParameters extends GetQuoteParameters {} 