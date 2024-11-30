import {
    type EVMReadRequest,
    type EVMTransaction,
    type EVMTypedData,
    type EVMWalletClient,
    isEVMWalletClient,
} from "./evm";
import {
    type EVMSmartWalletClient,
    isEVMSmartWalletClient,
} from "./evm-smart-wallet";
import {
    type SolanaReadRequest,
    type SolanaTransaction,
    type SolanaWalletClient,
    isSolanaWalletClient,
} from "./solana";

import type { Balance, Chain, Signature, WalletClient } from "./core";
import {
    type ChainForWalletClient,
    isEVMChain,
    isSolanaChain,
    type AnyEVMWalletClient,
} from "./utils";

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
    ChainForWalletClient,
    EVMTypedData,
};

export {
    isEVMWalletClient,
    isSolanaWalletClient,
    isEVMSmartWalletClient,
    isEVMChain,
    isSolanaChain,
    type AnyEVMWalletClient,
};
