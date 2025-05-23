import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ERC20_ABI } from "./abi";
import {
    ApproveParameters,
    ConvertFromBaseUnitParameters,
    ConvertToBaseUnitParameters,
    GetTokenAllowanceParameters,
    GetTokenBalanceParameters,
    GetTokenInfoBySymbolParameters,
    GetTokenTotalSupplyParameters,
    RevokeApprovalParameters,
    TransferFromParameters,
    TransferParameters,
} from "./parameters";
import { Token } from "./token";

export class Erc20Service {
    private tokens: Token[];

    constructor({ tokens }: { tokens?: Token[] } = {}) {
        this.tokens = tokens ?? [];
    }

    @Tool({
        description: "Get the ERC20 token info by its symbol, including the contract address, decimals, and name",
    })
    async getTokenInfoBySymbol(walletClient: EVMWalletClient, parameters: GetTokenInfoBySymbolParameters) {
        const token = this.tokens.find((token) =>
            [token.symbol, token.symbol.toLowerCase()].includes(parameters.symbol),
        );

        if (!token) {
            throw Error(`Token with symbol ${parameters.symbol} not found`);
        }

        const chain = walletClient.getChain();

        const contractAddress = token.chains[chain.id]?.contractAddress;

        if (!contractAddress) {
            throw Error(`Token with symbol ${parameters.symbol} not found on chain ${chain.id}`);
        }

        return {
            symbol: token?.symbol,
            contractAddress,
            decimals: token?.decimals,
            name: token?.name,
        };
    }

    @Tool({
        description: "Get the balance of an ERC20 token in base units. Convert to decimal units before returning.",
    })
    async getTokenBalance(walletClient: EVMWalletClient, parameters: GetTokenBalanceParameters) {
        try {
            const rawBalance = await walletClient.read({
                address: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [parameters.wallet],
            });

            return String(rawBalance.value);
        } catch (error) {
            throw Error(`Failed to fetch balance: ${error}`);
        }
    }

    @Tool({
        description: "Transfer an amount of an ERC20 token to an address",
    })
    async transfer(walletClient: EVMWalletClient, parameters: TransferParameters) {
        try {
            const to = parameters.to as `0x${string}`;

            const hash = await walletClient.sendTransaction({
                to: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [to, parameters.amount],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to transfer: ${error}`);
        }
    }

    @Tool({
        description: "Get the total supply of an ERC20 token",
    })
    async getTokenTotalSupply(walletClient: EVMWalletClient, parameters: GetTokenTotalSupplyParameters) {
        try {
            const rawTotalSupply = await walletClient.read({
                address: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "totalSupply",
            });

            return rawTotalSupply.value;
        } catch (error) {
            throw Error(`Failed to fetch total supply: ${error}`);
        }
    }

    @Tool({
        description: "Get the allowance of an ERC20 token",
    })
    async getTokenAllowance(walletClient: EVMWalletClient, parameters: GetTokenAllowanceParameters) {
        try {
            const owner = parameters.owner as `0x${string}`;
            const spender = parameters.spender as `0x${string}`;

            const rawAllowance = await walletClient.read({
                address: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "allowance",
                args: [owner, spender],
            });
            return String(rawAllowance.value);
        } catch (error) {
            throw Error(`Failed to fetch allowance: ${error}`);
        }
    }

    @Tool({
        description: "Approve an amount of an ERC20 token to an address",
    })
    async approve(walletClient: EVMWalletClient, parameters: ApproveParameters) {
        try {
            const spender = parameters.spender as `0x${string}`;

            const hash = await walletClient.sendTransaction({
                to: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [spender, parameters.amount],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to approve: ${error}`);
        }
    }

    @Tool({
        description: "Revoke approval for an ERC20 token to an address",
    })
    async revokeApproval(walletClient: EVMWalletClient, parameters: RevokeApprovalParameters) {
        try {
            const spender = parameters.spender as `0x${string}`;

            const hash = await walletClient.sendTransaction({
                to: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [spender, 0],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to revoke approval: ${error}`);
        }
    }

    @Tool({
        description: "Transfer an amount of an ERC20 token from an address to another address",
    })
    async transferFrom(walletClient: EVMWalletClient, parameters: TransferFromParameters) {
        try {
            const from = parameters.from as `0x${string}`;
            const to = parameters.to as `0x${string}`;

            const hash = await walletClient.sendTransaction({
                to: parameters.tokenAddress,
                abi: ERC20_ABI,
                functionName: "transferFrom",
                args: [from, to, parameters.amount],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to transfer from: ${error}`);
        }
    }

    @Tool({
        description: "Convert an amount of an ERC20 token to its base unit",
    })
    async convertToBaseUnit(parameters: ConvertToBaseUnitParameters) {
        const { amount, decimals } = parameters;
        const baseUnit = amount * 10 ** decimals;
        return String(baseUnit);
    }

    @Tool({
        description: "Convert an amount of an ERC20 token from its base unit to its decimal unit",
    })
    async convertFromBaseUnit(parameters: ConvertFromBaseUnitParameters) {
        const { amount, decimals } = parameters;
        const decimalUnit = amount / 10 ** decimals;
        return String(decimalUnit);
    }
}
