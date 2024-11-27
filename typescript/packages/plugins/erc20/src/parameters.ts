import { z } from "zod";

export const getBalanceParametersSchema = z.object({
	wallet: z.string(),
});

export const transferParametersSchema = z.object({
	to: z.string(),
	amount: z.string(),
});
