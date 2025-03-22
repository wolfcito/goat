import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class DepositOrderlyParams extends createToolParameters(
    z.object({
        amount: z.string().describe("The amount of input tokens to deposit in base units"),
    }),
) {}

export class WithdrawOrderlyParams extends createToolParameters(
    z.object({
        amount: z.string().describe("The amount of input tokens to withdraw in base units"),
    }),
) {}

export class CreateOrderOrderlyParams extends createToolParameters(
    z.object({
        symbol: z.string().describe("The symbol is required"),
        order_type: z.enum(["MARKET", "LIMIT"]),
        order_price: z.string().optional(),
        order_quantity: z.string().describe("The quantity is required"),
        side: z.enum(["BUY", "SELL"]),
    }),
) {}

export class ClosePositionOrderlyParams extends createToolParameters(
    z.object({
        symbol: z.string().describe("The symbol is required"),
        position_qty: z.number().refine((qty) => qty !== 0, "The quantity must be different from zero"),
    }),
) {}
