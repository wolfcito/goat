# Goat Coingecko Plugin 🐐 - TypeScript

Coingecko plugin for Goat. Allows you to create tools for interacting with the CoinGecko API.

## Installation
```
npm install @goat-sdk/plugin-coingecko
```

## Usage
    
```typescript
import { coingecko } from "@goat-sdk/plugin-coingecko";

const plugin = coingecko({ key: process.env.COINGECKO_API_KEY as string });

// Get trending coins
const trendingCoins = await plugin.getTrendingCoins();
console.log("Trending coins:", trendingCoins);

// Get Bonk price in USD with additional market data
const bonkPrice = await plugin.getCoinPrice({
    coinId: "bonk",
    vsCurrency: "usd",
    include_market_cap: true,
    include_24hr_vol: true,
    include_24hr_change: true
});
console.log("Bonk price data:", bonkPrice);
```

## Goat

<div align="center">
Go out and eat some grass.

[Docs](https://ohmygoat.dev) | [Examples](https://github.com/goat-sdk/goat/tree/main/typescript/examples) | [Discord](https://discord.gg/goat-sdk)</div>

## Goat 🐐
Goat 🐐 (Great Onchain Agent Toolkit) is an open-source library enabling AI agents to interact with blockchain protocols and smart contracts via their own wallets.
