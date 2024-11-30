import type { EVMWalletClient } from "./evm";
import type { SolanaWalletClient } from "./solana";
import type { Chain, EVMChain, SolanaChain, WalletClient } from "./core";
import type { EVMSmartWalletClient } from "./evm-smart-wallet";

export type ChainForWalletClient<TWalletClient extends WalletClient> =
    TWalletClient extends EVMWalletClient
        ? EVMChain
        : TWalletClient extends SolanaWalletClient
        ? SolanaChain
        : Chain;

export function isEVMChain(chain: Chain): chain is EVMChain {
    return chain.type === "evm";
}

export function isSolanaChain(chain: Chain): chain is SolanaChain {
    return chain.type === "solana";
}

export type AnyEVMWalletClient = EVMWalletClient | EVMSmartWalletClient;
