import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class BorrowAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The symbol of the asset to borrow to the pool e.g., WETH, USDC, MODE."),
        amount: z.string().describe("The initial amount of the asset to borrow in base units"),
    }),
) {}
