export interface ClaimResultProps {
    campaignId: string;
    detail: string;
    amount?: string;
    transactionHash?: string;
    chainId?: number;
    nameToken?: string;
    decimals?: number;
}

export interface MerklRewardResponse {
    chain: {
        id: number;
    };
    rewards: Array<{
        token: {
            address: string;
            symbol: string;
            decimals: number;
        };
        amount: string;
        proofs: string[];
        claimed: string;
    }>;
}

export interface TokenInfo {
    address: string;
    nameToken: string;
    decimals: number;
}
