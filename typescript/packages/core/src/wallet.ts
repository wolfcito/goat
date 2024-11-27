import type { Abi } from "abitype";
import type { TransactionInstruction } from "@solana/web3.js";

export type SignedMessage = {
    signedMessage: string;
};

export type Balance = {
    value: bigint;
};

/**
 * @param type - "evm" or "solana", extend this union as needed (e.g., "sui")
 * @param id - Chain ID, optional for EVM
 */
export type Chain = {
    type: "evm" | "solana";
    id?: number;
};

export interface WalletClient {
    getAddress: () => string;
    getChain: () => Chain;
    signMessage: (message: string) => Promise<SignedMessage>;
    nativeTokenBalanceOf: (address: string) => Promise<Balance>;
}

/**
 * //////////////////////////////////////////////////////////////////
 * Type Guards
 * //////////////////////////////////////////////////////////////////
 */
export function isEVMWalletClient(
    wallet: WalletClient
): wallet is EVMWalletClient {
    return wallet.getChain().type === "evm";
}

export function isSolanaWalletClient(
    wallet: WalletClient
): wallet is SolanaWalletClient {
    return wallet.getChain().type === "solana";
}


 ////////////////////////////////////////////////////////////////////
 // EVM
 ////////////////////////////////////////////////////////////////////
export type EVMTransaction = {
    to: string;
    functionName?: string;
    args?: unknown[];
    value?: bigint;
    abi?: Abi;
};

export type EVMReadRequest = {
    address: string;
    functionName: string;
    args?: unknown[];
    abi: Abi;
};

export type EVMTransactionResult = {
    hash: string;
    status: string;
};

export type EVMReadResult = {
    value: unknown;
};

export interface EVMWalletClient extends WalletClient {
    sendTransaction: (
        transaction: EVMTransaction
    ) => Promise<EVMTransactionResult>;
    read: (request: EVMReadRequest) => Promise<EVMReadResult>;
    resolveAddress: (address: string) => Promise<`0x${string}`>;
}


 ////////////////////////////////////////////////////////////////////
 // Solana
 ////////////////////////////////////////////////////////////////////
export type SolanaTransaction = {
    instructions: TransactionInstruction[];
};

export type SolanaReadRequest = {
    accountAddress: string;
};

export type SolanaReadResult = {
    value: unknown;
};

export type SolanaTransactionResult = {
    hash: string;
};

export interface SolanaWalletClient extends WalletClient {
    sendTransaction: (
        transaction: SolanaTransaction
    ) => Promise<SolanaTransactionResult>;
    read: (request: SolanaReadRequest) => Promise<SolanaReadResult>;
}
