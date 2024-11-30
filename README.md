

<div align="center">
Go out and eat some grass.

[Docs](https://ohmygoat.dev) | [Examples](https://github.com/goat-sdk/goat/tree/main/typescript/examples) | [Discord](https://discord.gg/2F8zTVnnFz)</div>

## Goat 🐐
Goat 🐐 (Great Onchain Agent Toolkit) is an open-source framework for connecting AI agents to any onchain app.

**Problem**: 

Today, there are thousands of agents, built across 5+ frameworks (Langchain, Vercel's AI SDK, Eliza, etc) using multiple languages (TypeScript, Python).

These agents can connect to various wallets, but programming even a simple onchain action (sending tokens, using a DeFi protocol) requires rebuilding support for each combination of framework, language, and wallet provider.

**Solution**: 

Goat solves this by providing an open-source, provider-agnostic framework that abstracts away all these combinations.

**Write an onchain action once, and it works across all frameworks, wallets, and languages, supporting both Solana and EVM chains**.

### Key features
1. **Works Everywhere**: Compatible with Langchain, Vercel’s AI SDK, Eliza, and more.
2. **Wallet Agnostic**: Supports all wallets, from key pairs to Crossmint and Coinbase.
3. **Multi-Chain**: Supports EVM chains and Solana (more coming 👀).
4. **Customizable**: Use or build plugins for any protocol (Polymarket, Uniswap, etc).

### How it works
Goat plugs into your agents tool calling capabilities adding all the functions your agent needs to interact with blockchain protocols. 

High-level, here's how it works:

#### Configure the wallet you want to use
```typescript
// ... Code to connect your wallet (e.g createWalletClient from viem)
const wallet = ...

const tools = getOnChainTools({
  wallet: viem(wallet),
})
```

#### Add the plugins you need to interact with the protocols you want
```typescript
const wallet = ...

const tools = getOnChainTools({
  wallet: viem(wallet),
  plugins: [
    sendETH(),
    erc20({ tokens: [USDC, PEPE] }),
    faucet(),
    polymarket(),
    // ...
  ],
})
```

#### Connect it to your agent framework of choice
```typescript
// ... Code to connect your wallet (e.g createWalletClient from viem)
const wallet = ...

const tools = getOnChainTools({
  wallet: viem(wallet),
  plugins: [ 
    sendETH(),
    erc20({ tokens: [USDC, PEPE] }), 
    faucet(), 
    polymarket(), 
    // ...
  ],
})

// Vercel's AI SDK
const result = await generateText({
    model: openai("gpt-4o-mini"),
    tools: tools,
    maxSteps: 5,
    prompt: "Send 420 ETH to ohmygoat.eth",
});
```

See [here](https://github.com/goat-sdk/goat/tree/main/typescript/examples) for more examples.
