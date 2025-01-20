import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class SupplyAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The symbol of the asset to supply to the pool e.g., WETH, USDC, USDT."),
        amount: z.string().describe("The amount to supply, specified in token units."),
    }),
) {}
