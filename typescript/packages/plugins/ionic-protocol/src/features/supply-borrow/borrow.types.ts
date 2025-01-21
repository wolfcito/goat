export interface BorrowAssetServiceResponse {
    transactionHash: string;
    borrowedAsset: string;
    borrowedAmount: string;
    collateralAsset?: string;
    poolAddress: string;
    message: string;
}

export type BorrowAllowedResponse = {
    value: number;
};
