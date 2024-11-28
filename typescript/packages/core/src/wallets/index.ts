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
	EVMTypedData,
};

export { isEVMWalletClient, isSolanaWalletClient, isEVMSmartWalletClient };
