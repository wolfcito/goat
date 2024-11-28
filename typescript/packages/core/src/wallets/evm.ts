import type { Abi, TypedData } from "abitype";
import type { Signature, WalletClient } from "./core";
import type { TypedDataDefinition } from "./typed-data";

export function isEVMWalletClient(
    wallet: WalletClient
): wallet is EVMWalletClient {
    return wallet.getChain().type === "evm";
}

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
    signTypedData: <
        TTypedData extends TypedData | Record<string, unknown>,
        TPrimaryType extends keyof TTypedData | "EIP712Domain"
    >(
        data: TypedDataDefinition<TTypedData, TPrimaryType>
    ) => Promise<Signature>;
}
