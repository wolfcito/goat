

<div align="center">

[Docs](https://ohmygoat.dev) | [Examples](https://github.com/goat-sdk/goat/tree/main/typescript/examples) | [Chains](https://ohmygoat.dev/chains-wallets-plugins) | [Plugins](https://ohmygoat.dev/chains-wallets-plugins#plugins) | [Discord](https://discord.gg/goat-sdk)

GOAT is free software, MIT licensed, sponsored by [Crossmint](https://www.crossmint.com)

![NPM Downloads](https://img.shields.io/npm/dm/%40goat-sdk%2Fcore)
![GitHub License](https://img.shields.io/github/license/goat-sdk/goat)

![Static Badge](https://img.shields.io/badge/v20.12.2-1?label=typescript&color=blue)
![PyPI - Python Version](https://img.shields.io/pypi/pyversions/goat-sdk)


</div>

# GOAT 🐐 (Great Onchain Agent Toolkit)
GOAT is a library that adds more than +200 onchain tools to your AI agent. Allow your agent to use any DeFi protocol, mint NFTs, buy and sell assets, and much more.
Supports
* **+200 tools**
* **Provider agnostic**
* **Works across all major agent frameworks, chains and  wallets types**

### Tools


### Chains
* **All** EVM chains (Base, Polygon, Mode, Sei, etc.)
* Solana  
* Aptos  
* Chromia  
* Fuel  
* Sui 
* Starknet 
* Zilliqa 

### Plugins




### Installation
1. Install the core package
```bash
npm install @goat-sdk/goat
```
2. Depending on the type of wallet you want to use, install the corresponding wallet:

For Solana:
```bash
npm install @goat-sdk/wallet-solana
```

For EVM:
```bash
npm install @goat-sdk/wallet-evm @goat-sdk/wallet-evm-viem
```

3. Install the plugins for the protocols you need (see all available plugins [here](https://ohmygoat.dev/chains-wallets-plugins#plugins))

4. Install the adapter for the agent framework you want to use (see all available adapters [here](https://ohmygoat.dev/chains-wallets-plugins#adapters))


### Usage






![goat](https://github.com/user-attachments/assets/f6aa46ce-5684-4136-be29-7867acab3f27)

### How it works
GOAT plugs into your agents tool calling capabilities adding all the functions your agent needs to interact with the blockchain. 

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
