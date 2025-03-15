import { PluginBase } from "@goat-sdk/core";
import { OrderlyNetworkService } from "./orderly-network.service";

export class OrderlyNetworkPlugin extends PluginBase {
    constructor() {
        super("orderly-network", [new OrderlyNetworkService()]);
    }

    supportsChain = () => true;
}

export function orderlynetwork() {
    return new OrderlyNetworkPlugin();
}
