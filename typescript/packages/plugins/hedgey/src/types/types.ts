export interface ClaimHedgeyRewardsResponse {
    campaignId: string;
    detail: string;
    amount?: string;
    transactionHash?: string;
    chain?: number;
    tokenName?: string;
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
