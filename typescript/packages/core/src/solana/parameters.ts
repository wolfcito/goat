import { z } from "zod";

export const getAddressParametersSchema = z.object({});

export const getSOLBalanceParametersSchema = z.object({
    address: z.optional(z.string()),
});

export const sendSOLParametersSchema = z.object({
    to: z.string(),
    amount: z.string(),
});
