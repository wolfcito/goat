import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class BorrowAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The symbol of the asset to borrow to the pool e.g., WETH, USDC, USDT."),
        amount: z.string().describe("The amount to borrow, specified in token units."),
    }),
) {}
