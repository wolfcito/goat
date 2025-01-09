import { type Chain, PluginBase } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { GlobalAddressService } from "./global-address.service";

export class GlobalAddressPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("globalAddress", [new GlobalAddressService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";
}

export const globalAddress = () => new GlobalAddressPlugin();
