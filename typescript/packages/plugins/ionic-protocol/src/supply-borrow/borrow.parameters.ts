import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class BorrowAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The asset to borrow (e.g. USDC, WETH)"),
        amount: z.string().describe("The amount to borrow in base units"),
    })
) {}
