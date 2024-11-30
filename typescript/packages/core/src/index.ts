import type { Plugin } from "./plugins/plugins";
import { sendETH } from "./plugins/send-eth";
import { sendSOL } from "./plugins/send-sol";
import {
    type GetToolsParams,
    type Tool,
    getTools,
    type DeferredTool,
    getDeferredTools,
    type GetDeferredToolsParams,
} from "./tools";
import { addParametersToDescription } from "./utils";
import type {
    Balance,
    Chain,
    EVMReadRequest,
    EVMSmartWalletClient,
    EVMTransaction,
    EVMTypedData,
    EVMWalletClient,
    Signature,
    SolanaReadRequest,
    SolanaTransaction,
    SolanaWalletClient,
    WalletClient,
    isEVMSmartWalletClient,
    isEVMWalletClient,
    isSolanaWalletClient,
} from "./wallets";

export {
    getTools,
    getDeferredTools,
    sendETH,
    sendSOL,
    addParametersToDescription,
    type Tool,
    type DeferredTool,
    type GetToolsParams,
    type GetDeferredToolsParams,
    type Plugin,
    type WalletClient,
    type EVMTransaction,
    type EVMReadRequest,
    type EVMWalletClient,
    type EVMSmartWalletClient,
    type SolanaTransaction,
    type SolanaReadRequest,
    type SolanaWalletClient,
    type Signature,
    type Balance,
    type EVMTypedData,
    type isEVMWalletClient,
    type isEVMSmartWalletClient,
    type isSolanaWalletClient,
    type Chain,
};
