import {
    type EVMWalletClient,
    type EVMTransaction,
    type EVMReadRequest,
    isEVMWalletClient,
} from "./evm";
import {
    type SolanaWalletClient,
    type SolanaTransaction,
    type SolanaReadRequest,
    isSolanaWalletClient,
} from "./solana";
import {
    type EVMSmartWalletClient,
    isEVMSmartWalletClient,
} from "./evm-smart-wallet";

import type { WalletClient, Chain, Signature, Balance } from "./core";

export type {
    EVMWalletClient,
    SolanaWalletClient,
    WalletClient,
    Chain,
    EVMTransaction,
    EVMReadRequest,
    SolanaTransaction,
    SolanaReadRequest,
    Signature,
    Balance,
    EVMSmartWalletClient,
};

export {
    isEVMWalletClient,
    isSolanaWalletClient,
    isEVMSmartWalletClient,
};
