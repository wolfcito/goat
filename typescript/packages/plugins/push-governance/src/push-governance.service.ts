import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { DELEGATE_ADDRESS, PUSH_ABI } from "./abi/push.abi";
import { DelegateParams, GetPushTokenAddressParams } from "./parameters";

export class PushGovernanceService {
    @Tool({
        name: "delegate_voting_power",
        description: "Delegate your voting power to a specified address",
    })
    async delegateVotingPower(walletClient: EVMWalletClient, parameters: DelegateParams): Promise<string> {
        try {
            const { delegateAddress } = parameters;

            const network = walletClient.getChain();
            if (!network?.id) {
                throw new Error("Unable to determine chain ID from wallet client");
            }

            const address = this.getContractAddress(network.id);

            const { hash } = await walletClient.sendTransaction({
                to: address,
                abi: PUSH_ABI,
                functionName: "delegate",
                args: [delegateAddress ?? walletClient.getAddress()],
            });

            return hash;
        } catch (error) {
            throw new Error(`Failed to delegate voting power: ${error}`);
        }
    }

    @Tool({
        name: "get_push_token_address",
        description: "Get the address of the PUSH token.",
    })
    async getPushTokenAddress(parameters: GetPushTokenAddressParams): Promise<Token> {
        const tokens: Record<string, Token> = {
            PUSH: {
                decimals: 18,
                symbol: "PUSH",
                name: "PUSH",
                chains: {
                    1: {
                        contractAddress: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
                    },
                },
            },
        };

        const token = tokens[parameters.symbol.toUpperCase()];
        if (!token) {
            throw new Error(`Token ${parameters.symbol} not found`);
        }
        return token;
    }

    private getContractAddress(chainId: number): string {
        const address = DELEGATE_ADDRESS[chainId];
        if (!address) {
            throw new Error(`Delegate contract not available for chainId: ${chainId}`);
        }
        return address;
    }
}

interface Token {
    decimals: number;
    symbol: string;
    name: string;
    chains: Record<number, { contractAddress: `0x${string}` }>;
}
