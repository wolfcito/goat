import type { DeferredTool } from "@goat-sdk/core";
import type { z } from "zod";

import {
    getTrendingCoinsParametersSchema,
    getCoinPriceParametersSchema,
} from "./parameters";

// Define methods to interact with CoinGecko API
async function fetchTrendingCoins() {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchCoinPrice(coinId: string, vsCurrency: string) {
    const params = new URLSearchParams({
        ids: coinId,
        vs_currencies: vsCurrency,
    });
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export function getTools(credentials: {
	key: string;
}): DeferredTool<any>[] {
    const tools: DeferredTool<any>[] = [];

    const getTrendingCoinsTool: DeferredTool<any> = {
        name: 'get_trending_coins',
        description: 'This tool fetches the list of trending coins from CoinGecko',
        parameters: getTrendingCoinsParametersSchema,
        method: async () => fetchTrendingCoins(),
    };

    const getCoinPriceTool: DeferredTool<any> = {
        name: 'get_coin_price',
        description: 'This tool fetches the price of a specific coin from CoinGecko',
        parameters: getCoinPriceParametersSchema,
        method: async (
            _client: any,
            parameters: z.infer<typeof getCoinPriceParametersSchema>
        ) => fetchCoinPrice(parameters.coinId, parameters.vsCurrency),
    };

    tools.push(
        getTrendingCoinsTool,
        getCoinPriceTool
    );

    return tools;
}
