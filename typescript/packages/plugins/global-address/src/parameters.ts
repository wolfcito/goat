import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

/**
 * Schema for creating a global address.
 */
export class GlobalAddressParams extends createToolParameters(
    z.object({
        chainName: z
            .enum([
                "mainnet",
                "optimism",
                "polygon",
                "worldchain",
                "base",
                "mode",
                "arbitrum",
                "blast",
                "scroll",
                "zora",
            ])
            .describe("Name of the supported chain"),
        owner: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Owner must be a valid Ethereum address."),
    }),
) {}
