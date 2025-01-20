import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";

import {
    BorrowService,
    SupplyAssetParameters,
    SupplyAssetServiceResponse,
    SupplyService,
} from "@features/supply-borrow";

export class IonicProtocolService {
    private readonly supplyService: SupplyService;
    private readonly borrowService: BorrowService;

    constructor() {
        this.supplyService = new SupplyService();
        this.borrowService = new BorrowService();
    }

    @Tool({
        name: "ionic_protocol_asset_supply",
        description:
            "Allows users to supply a specified asset to an Ionic Protocol pool. Validates the asset configuration for the current network and executes the supply transaction.",
    })
    async supplyAsset(
        walletClient: EVMWalletClient,
        parameters: SupplyAssetParameters,
    ): Promise<SupplyAssetServiceResponse> {
        return this.supplyService.supplyAsset(walletClient, parameters);
    }

    @Tool({
        name: "ionic_protocol_asset_borrow",
        description:
            "Allows users to borrow a specified asset to an Ionic Protocol pool. Validates the asset configuration for the current network and executes the borrow transaction.",
    })
    async borrowAsset(walletClient: EVMWalletClient, parameters: SupplyAssetParameters): Promise<string> {
        return this.borrowService.borrowAsset(walletClient, parameters);
    }
}
