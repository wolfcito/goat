import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";

import {
    BorrowAssetParameters,
    BorrowAssetServiceResponse,
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
        parameters: SupplyAssetParameters
    ): Promise<SupplyAssetServiceResponse> {
        return this.supplyService.supplyAsset(walletClient, parameters);
    }

    @Tool({
        name: "ionic_protocol_asset_borrow",
        description:
            "Allows borrowing a specified asset from an Ionic Protocol pool by verifying network and asset configurations before executing the transaction.",
    })
    async borrowAsset(
        walletClient: EVMWalletClient,
        parameters: BorrowAssetParameters
    ): Promise<BorrowAssetServiceResponse> {
        return this.borrowService.borrowAsset(walletClient, parameters);
    }
}
