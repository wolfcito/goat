import { Tool } from "@goat-sdk/core";
import { WalletClientBase } from "@goat-sdk/core";
import { ExampleParameters } from "./parameters";

export class IonicProtocolService {
    @Tool({
        name: "ionic_protocol_example",
        description: "An example method in IonicProtocolService",
    })
    async doSomething(
        walletClient: WalletClientBase,
        parameters: ExampleParameters
    ) {
        // Implementation goes here
        return "Hello from IonicProtocolService!";
    }
}
