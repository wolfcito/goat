import { PluginBase } from "@goat-sdk/core";
import { IonicProtocolService } from "./ionic-protocol.service";

export class IonicProtocolPlugin extends PluginBase {
    constructor() {
        super("ionic-protocol", [new IonicProtocolService()]);
    }

    supportsChain = () => true;
}

export function ionicprotocol() {
    return new IonicProtocolPlugin();
}
