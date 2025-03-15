import { Tool } from "@goat-sdk/core";
import { WalletClientBase } from "@goat-sdk/core";
import { ExampleParameters } from "./parameters";

export class OrderlyNetworkService {
    @Tool({
        name: "orderly_network_example",
        description: "An example method in OrderlyNetworkService",
    })
    async doSomething(walletClient: WalletClientBase, parameters: ExampleParameters) {
        // Implementation goes here
        return "Hello from OrderlyNetworkService!";
    }
}
