import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class DepositOrderlyParams extends createToolParameters(
    z.object({
        amount: z.string().describe("The amount of input tokens to swap in base units"),
    }),
) {}

export class WithdrawOrderlyParams extends createToolParameters(
    z.object({
        amount: z.string().describe("The amount of input tokens to swap in base units"),
    }),
) {}

export class CreateOrderOrderlyParams extends createToolParameters(
    z.object({
        symbol: z.string().describe("El símbolo es obligatorio"),
        order_type: z.enum(["MARKET", "LIMIT"]),
        order_price: z.string().optional(),
        order_quantity: z.string().describe("La cantidad es obligatoria"),
        side: z.enum(["BUY", "SELL"]),
    }),
) {}

export class ClosePositionOrderlyParams extends createToolParameters(
    z.object({
        symbol: z.string().describe("El símbolo es obligatorio"),
        position_qty: z.number().refine((qty) => qty !== 0, "La cantidad debe ser distinta de cero"),
    }),
) {}
