import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { buildSDK } from "@balmy/sdk";
import {
    GetBalanceParameters,
    GetAllowanceParameters,
    GetQuoteParameters,
    ExecuteSwapParameters
} from "./parameters";

export class BalmyService {
    private sdk;

    constructor() {
        this.sdk = buildSDK({});
    }

    @Tool({
        description: "Get token balances for an account"
    })
    async getBalances(walletClient: EVMWalletClient, parameters: GetBalanceParameters) {
        return await this.sdk.balanceService.getBalances({
            tokens: [{
                chainId: parameters.chainId,
                account: parameters.account,
                token: parameters.token
            }]
        });
    }

    @Tool({
        description: "Get token allowance for an account"
    })
    async getAllowance(walletClient: EVMWalletClient, parameters: GetAllowanceParameters) {
        return await this.sdk.allowanceService.getAllowanceInChain({
            chainId: parameters.chainId,
            token: parameters.token,
            owner: parameters.owner,
            spender: parameters.spender
        });
    }

    @Tool({
        description: "Get quotes for a token swap"
    })
    async getQuote(walletClient: EVMWalletClient, parameters: GetQuoteParameters) {
        
        const request: QuoteRequest = {
            chainId: parameters.chainId,
            sellToken: parameters.tokenIn,
            buyToken: parameters.tokenOut,
            order: parameters.order,
            slippagePercentage: parameters.slippagePercentage,
            gasSpeed: parameters.gasSpeed,
            config: parameters.config
        }
        
        return await this.sdk.quoteService.getQuotes({
            request: request,
            config: {
                timeout: "10s"
            }
        });
    }

    @Tool({
        description: "Execute a swap using the best quote"
    })
    async executeSwap(walletClient: EVMWalletClient, parameters: ExecuteSwapParameters) {
        const quotes = await this.getQuote(walletClient, parameters);
        const bestQuote = quotes[0];
        return await walletClient.sendTransaction(bestQuote.tx as `0x${string}`);
    }
} 