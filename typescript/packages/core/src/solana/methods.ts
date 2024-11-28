import { formatUnits, parseUnits } from "viem";
import type { z } from "zod";
import type { SolanaWalletClient } from "../wallets";
import type {
    getAddressParametersSchema,
    getSOLBalanceParametersSchema,
    sendSOLParametersSchema,
} from "./parameters";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export function getAddress(
    walletClient: SolanaWalletClient,
    parameters: z.infer<typeof getAddressParametersSchema>
): string {
    return walletClient.getAddress();
}

export async function getBalance(
    walletClient: SolanaWalletClient,
    parameters: z.infer<typeof getSOLBalanceParametersSchema>
): Promise<string> {
    try {
        const balance = await walletClient.balanceOf(
            parameters.address ?? getAddress(walletClient, {})
        );

        return formatUnits(balance.value, balance.decimals);
    } catch (error) {
        throw new Error(`Failed to fetch balance: ${error}`);
    }
}

export async function sendSOL(
    walletClient: SolanaWalletClient,
    parameters: z.infer<typeof sendSOLParametersSchema>
): Promise<string> {
    try {
        const { to, amount } = parameters;

        const senderAddress = walletClient.getAddress();
        const lamports = parseUnits(amount, 9);

        const transferInstruction = SystemProgram.transfer({
            fromPubkey: new PublicKey(senderAddress),
            toPubkey: new PublicKey(to),
            lamports,
        });

        const txResult = await walletClient.sendTransaction({
            instructions: [transferInstruction],
        });

        return txResult.hash;
    } catch (error) {
        throw new Error(`Failed to send SOL: ${error}`);
    }
}
