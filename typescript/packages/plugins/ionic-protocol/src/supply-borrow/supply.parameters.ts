import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class SupplyAssetParameters extends createToolParameters(
    z.object({
        poolId: z.string().describe("The ID of the pool to supply to"),
        asset: z.string().describe("The asset to supply (e.g. USDC, WETH)"),
        amount: z.string().describe("The amount to supply in base units"),
    })
) {}
