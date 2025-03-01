import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ethers } from "ethers";

import { CAMPAIGN_ABI, CAMPAIGN_ADDRESS } from "./abi/hedgey.abi";
import { MERKL_CAMPAIGN_ABI, MERKL_CAMPAIGN_ADDRESS } from "./abi/merkl.abi";
import { CheckClaimParams, ClaimResultProps } from "./parameters";

const HEDGEY_PROOF_URL = "https://api.hedgey.finance/token-claims/proof";
const HEDGEY_CLAIM_URL = "https://app.hedgey.finance/claim/";
const HEDGEY_CAMPAIGNS_URL = "https://mode-contentful.vercel.app/news.json";
const MERKL_REVIEW_URL = "https://api.merkl.xyz/v4/users";

export class HedgeyService {
    @Tool({
        name: "claim_hedgey_tokens",
        description: "Claim staking rewards or Hedgey tokens on Optimism",
    })
    async claimHedgeyTokens(walletClient: EVMWalletClient, parameters: CheckClaimParams): Promise<ClaimResultProps[]> {
        try {
            const newsResponse = await fetch(HEDGEY_CAMPAIGNS_URL);
            const newsArray = await newsResponse.json();

            const campaignIds: string[] = newsArray
                ?.map((entry: { fields: { link?: { "en-US": string } } }) => {
                    const link = entry.fields.link?.["en-US"];
                    return link ? link.split(HEDGEY_CLAIM_URL)[1] : undefined;
                })
                .filter((campaignId: string | undefined): campaignId is string => campaignId !== undefined);

            const userAddress = walletClient.getAddress();
            const network = walletClient.getChain();

            if (!network?.id) {
                throw new Error("Unable to determine chain ID from wallet client");
            }

            const claimableCampaigns: { campaignId: string; claimAmount: string; proof: string[] }[] = [];

            const results: ClaimResultProps[] = [];

            for (const campaignId of campaignIds) {
                const proofResponse = await fetch(`${HEDGEY_PROOF_URL}/${campaignId}/${userAddress}`);
                if (!proofResponse.ok) {
                    const errorText = await proofResponse.text();
                    throw new Error(`API error: ${proofResponse.status} ${proofResponse.statusText}: ${errorText}`);
                }
                const data = await proofResponse.json();
                if (!data.canClaim) {
                    results.push({
                        campaignId,
                        detail: "No claimable tokens available",
                    });
                } else {
                    claimableCampaigns.push({
                        campaignId,
                        claimAmount: data.amount,
                        proof: data.proof,
                    });
                }
            }

            if (claimableCampaigns.length > 0) {
                const campaignIdsBytes16: string[] = [];
                const proofs: string[][] = [];
                const claimAmounts: string[] = [];

                for (const claim of claimableCampaigns) {
                    const bytes16Campaign = ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes(claim.campaignId), 16);
                    campaignIdsBytes16.push(bytes16Campaign);
                    proofs.push(claim.proof);
                    claimAmounts.push(claim.claimAmount);
                }

                const txResponse = await walletClient.sendTransaction({
                    to: CAMPAIGN_ADDRESS as `0x${string}`,
                    abi: CAMPAIGN_ABI,
                    functionName: "claimMultiple",
                    args: [campaignIdsBytes16, proofs, claimAmounts],
                });

                for (const claim of claimableCampaigns) {
                    results.push({
                        campaignId: claim.campaignId,
                        detail: "Claimed",
                        amount: claim.claimAmount,
                        transactionHash: txResponse.hash,
                    });
                }
            }

            if (results.length === 0) {
                return [
                    {
                        campaignId: "",
                        detail: "No claimable tokens available",
                    },
                ];
            }

            return results;
        } catch (error) {
            throw new Error(`Failed to claim tokens: ${error}`);
        }
    }

    @Tool({
        name: "claim_merkl_tokens",
        description: "Claim protocol incentives for Merkl rewards for a given address and chain",
    })
    async claimMerklRewards(walletClient: EVMWalletClient, parameters: CheckClaimParams): Promise<ClaimResultProps[]> {
        try {
            const userAddress = parameters.address ?? walletClient.getAddress();
            const network = walletClient.getChain();
            if (!network?.id) {
                throw new Error("Unable to determine chain ID from wallet client");
            }
            const chainId = network.id;
            const rewardsUrl = `${MERKL_REVIEW_URL}/${userAddress}/rewards?chainId=${chainId}`;

            const rewardsResponse = await fetch(rewardsUrl);
            if (!rewardsResponse.ok) {
                const errorText = await rewardsResponse.text();
                throw new Error(
                    `Merkl rewards API error: ${rewardsResponse.status} ${rewardsResponse.statusText}: ${errorText}`,
                );
            }
            const rewardsData = await rewardsResponse.json();

            const users: string[] = [];
            const tokens: string[] = [];
            const amounts: string[] = [];
            const proofs: string[][] = [];

            for (const rewardsObj of rewardsData) {
                if (rewardsObj.chain.id !== chainId) continue;
                for (const reward of rewardsObj.rewards) {
                    users.push(userAddress);
                    tokens.push(reward.token.address);
                    amounts.push(reward.amount);
                    proofs.push(reward.proofs);
                }
            }

            if (tokens.length === 0) {
                return [
                    {
                        campaignId: "",
                        detail: "No claimable tokens available",
                    },
                ];
            }

            const txResponse = await walletClient.sendTransaction({
                to: MERKL_CAMPAIGN_ADDRESS as `0x${string}`,
                abi: MERKL_CAMPAIGN_ABI,
                functionName: "claim",
                args: [users, tokens, amounts, proofs],
            });

            const results: ClaimResultProps[] = [];

            for (let i = 0; i < tokens.length; i++) {
                results.push({
                    campaignId: tokens[i],
                    detail: "Claimed",
                    amount: amounts[i],
                    transactionHash: txResponse.hash,
                });
            }
            return results;
        } catch (error) {
            throw new Error(`Failed to claim Merkl tokens: ${error}`);
        }
    }
}
