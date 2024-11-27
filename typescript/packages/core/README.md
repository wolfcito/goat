

<div align="center">
Go out and eat some grass.

[Docs](https://ohmygoat.dev) | [Examples](https://github.com/goat-sdk/goat/tree/main/typescript/examples) | [Discord](https://discord.gg/2F8zTVnnFz)</div>

## Goat 🐐
Goat 🐐 (Great Onchain Agent Toolkit) is an open-source library enabling AI agents to interact with blockchain protocols and smart contracts via their own wallets.

### Key features
1. **Works everywhere**: Integrate with Langchain, Vercel’s AI SDK, Eliza, and other leading agent frameworks in TypeScript (Python coming soon 👀).
2. **Smart Wallet Ready**: Use from basic key pair wallets to advanced smart wallets from Crossmint and Coinbase.
3. **EVM, Solana, and more**: Interact with any EVM based chain and Solana (more chains coming soon 👀).
4. **Limitless Customization**: Leverage community-built plugins for popular protocols like Polymarket, Uniswap, and more, or design your own to connect with any protocol out there.

### How it works
Goat plugs into your agents tool calling capabilities adding all the functions your agent needs to interact with blockchain protocols. 

High-level, here's how it goes:

#### Configure the wallet you want to use
```typescript
// ... Code to connect your wallet (e.g createWalletClient from viem)
const wallet = ...

const tools = getOnChainTools({
  wallet: viem(wallet), // smartwallet(wallet), solana(wallet), etc.
})
```

#### Add all the plugins you need to interact with the protocols you want
```typescript
// ... Code to connect your wallet (e.g createWalletClient from viem)
const wallet = ...

const tools = getOnChainTools({
  wallet: viem(wallet),  // smartwallet(wallet), solana(wallet), etc.
  plugins: [
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
  wallet: viem(wallet),  // smartwallet(wallet), solana(wallet), etc.
  plugins: [ 
    erc20({ 
      tokens: [USDC, PEPE],
     }), 
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
