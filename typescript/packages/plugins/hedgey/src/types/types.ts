export interface ClaimResultProps {
    campaignId: string;
    detail: string;
    amount?: string;
    transactionHash?: string;
}

export interface NewsEntryProps {
    fields: {
        link?: {
            "en-US"?: string;
        };
    };
}

export interface HedgeyProofResponse {
    canClaim: boolean;
    amount: string;
    proof: string[];
}

export interface MerklRewardResponse {
    chain: {
        id: number;
    };
    rewards: Array<{
        token: {
            address: string;
        };
        amount: string;
        proofs: string[];
    }>;
}
