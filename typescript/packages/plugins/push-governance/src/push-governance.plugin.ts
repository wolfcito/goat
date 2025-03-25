import { Chain, PluginBase } from "@goat-sdk/core";
import { mainnet } from "viem/chains";
import { PushGovernanceService } from "./push-governance.service";
const SUPPORTED_CHAINS = [mainnet];

export class PushGovernancePlugin extends PluginBase {
    constructor() {
        super("push-governance", [new PushGovernanceService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export function pushgovernance() {
    return new PushGovernancePlugin();
}
