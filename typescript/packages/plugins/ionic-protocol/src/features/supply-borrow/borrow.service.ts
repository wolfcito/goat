import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { BorrowAssetParameters } from "./borrow.parameters";

import { MARKET_CONTROLLER_ABI, TOKEN_POOL_ABI } from "@common/abi";
import { fetchTokenConfig } from "@common/utils/asset-manager";
import { getMarketController, getValidatedNetwork } from "@common/utils/network-manager";
import { BorrowAllowedResponse, BorrowAssetServiceResponse } from "./borrow.types";

export class BorrowService {
    // according to the Comptroller.sol contract, these are the error codes and their corresponding messages
    // https://github.com/ionicprotocol/monorepo/blob/development/packages/contracts/contracts/compound/Comptroller.sol#L440
    private static readonly errorMessages: Record<number, string> = {
        1: "Market not listed.",
        2: "Price not available for the token.",
        3: "Borrower not whitelisted.",
        4: "Borrow cap reached for the market.",
        5: "Insufficient liquidity for the requested amount.",
    };

    async borrowAsset(
        walletClient: EVMWalletClient,
        params: BorrowAssetParameters,
    ): Promise<BorrowAssetServiceResponse> {
        const { asset, amount } = params;

        const network = getValidatedNetwork(walletClient);

        const tokenConfig = fetchTokenConfig(network.id, asset);

        const marketController = getMarketController(network.id);

        const borrowAllowed = (await walletClient.read({
            address: marketController,
            abi: MARKET_CONTROLLER_ABI,
            functionName: "borrowAllowed",
            args: [tokenConfig.ionToken.contractAddress, walletClient.getAddress(), amount],
        })) as BorrowAllowedResponse;

        if (borrowAllowed.value !== 0) {
            const errorMessage = BorrowService.errorMessages[borrowAllowed.value] || "Unknown error.";

            return {
                transactionHash: "",
                borrowedAsset: asset,
                borrowedAmount: amount,
                collateralAsset: undefined,
                poolAddress: tokenConfig.ionToken.contractAddress,
                message: `Borrow not allowed: ${errorMessage}`,
            };
        }

        const txn = await walletClient.sendTransaction({
            to: tokenConfig.ionToken.contractAddress,
            abi: TOKEN_POOL_ABI,
            functionName: "borrow",
            args: [amount],
        });

        return {
            transactionHash: txn.hash,
            borrowedAsset: asset,
            borrowedAmount: amount,
            collateralAsset: undefined,
            poolAddress: tokenConfig.ionToken.contractAddress,
            message: `Successfully borrowed ${amount} base units of ${asset}.`,
        };
    }
}
