import { z } from "zod";

export const getAddressParametersSchema = z.object({});

export const getETHBalanceParametersSchema = z.object({
    address: z.optional(z.string()),
});

export const sendETHParametersSchema = z.object({
    to: z.string(),
    amount: z.string(),
});
