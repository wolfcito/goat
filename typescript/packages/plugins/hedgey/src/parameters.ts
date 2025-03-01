import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class CheckClaimParams extends createToolParameters(
    z.object({
        address: z.string().optional().describe("given address"),
        campaignId: z.string().optional().describe("uuid of the campaign"),
    }),
) {}
