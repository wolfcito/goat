import { formatUnits, parseEther } from "viem";
import type { z } from "zod";
import type { EVMWalletClient } from "../wallets";
import type {
	getAddressParametersSchema,
	getETHBalanceParametersSchema,
	sendETHParametersSchema,
} from "./parameters";

export function getAddress(
	walletClient: EVMWalletClient,
	parameters: z.infer<typeof getAddressParametersSchema>,
): string {
	return walletClient.getAddress();
}

export async function getBalance(
	walletClient: EVMWalletClient,
	parameters: z.infer<typeof getETHBalanceParametersSchema>,
): Promise<string> {
	try {
		const address = walletClient.resolveAddress(
			parameters.address ?? getAddress(walletClient, {}),
		);

		const balance = await walletClient.balanceOf(address.toString());

		return formatUnits(balance.value, balance.decimals);
	} catch (error) {
		throw new Error(`Failed to fetch balance: ${error}`);
	}
}

export async function sendETH(
	walletClient: EVMWalletClient,
	parameters: z.infer<typeof sendETHParametersSchema>,
): Promise<string> {
	try {
		const amount = parseEther(parameters.amount);
		const tx = await walletClient.sendTransaction({
			to: parameters.to,
			value: amount,
		});

		return tx.hash;
	} catch (error) {
		throw new Error(`Failed to send ETH: ${error}`);
	}
}
