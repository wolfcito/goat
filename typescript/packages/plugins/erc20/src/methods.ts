import type { EVMWalletClient } from "@goat-sdk/core";
import { formatUnits, parseUnits } from "viem";
import type { z } from "zod";
import { ERC20_ABI } from "./abi";
import type {
	getBalanceParametersSchema,
	transferParametersSchema,
} from "./parameters";
import type { ChainSpecificToken } from "./token";

export async function balanceOf(
	walletClient: EVMWalletClient,
	token: ChainSpecificToken,
	parameters: z.infer<typeof getBalanceParametersSchema>,
): Promise<string> {
	try {
		const resolvedWalletAddress = await walletClient.resolveAddress(
			parameters.wallet,
		);

		const rawBalance = await walletClient.read({
			address: token.contractAddress,
			abi: ERC20_ABI,
			functionName: "balanceOf",
			args: [resolvedWalletAddress],
		});

		return formatUnits(rawBalance.value as bigint, token.decimals);
	} catch (error) {
		throw Error(`Failed to fetch balance: ${error}`);
	}
}

export async function transfer(
	walletClient: EVMWalletClient,
	token: ChainSpecificToken,
	parameters: z.infer<typeof transferParametersSchema>,
): Promise<string> {
	try {
		const amountInBaseUnits = parseUnits(parameters.amount, token.decimals);

		const resolvedRecipientAddress = await walletClient.resolveAddress(
			parameters.to,
		);

		const hash = await walletClient.sendTransaction({
			to: token.contractAddress,
			abi: ERC20_ABI,
			functionName: "transfer",
			args: [resolvedRecipientAddress, amountInBaseUnits],
		});

		return hash.hash;
	} catch (error) {
		throw Error(`Failed to transfer: ${error}`);
	}
}
