import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class IrysDeployParams extends createToolParameters(
    z.object({
        token: z.string().optional().describe("Nombre del token a usar (e.g. 'ethereum', 'matic', 'bnb', etc.)"),
    }),
) {}
