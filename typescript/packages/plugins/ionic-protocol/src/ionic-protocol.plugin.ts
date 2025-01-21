import { type Chain, PluginBase } from "@goat-sdk/core";
import { mode, optimism } from "viem/chains";
import { IonicProtocolService } from "./ionic-protocol.service";

const SUPPORTED_CHAINS = [mode, optimism];
export class IonicProtocolPlugin extends PluginBase {
    constructor() {
        super("ionicprotocol", [new IonicProtocolService()]);
    }

    supportsChain = (chain: Chain) =>
        chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export function ionicprotocol() {
    return new IonicProtocolPlugin();
}
