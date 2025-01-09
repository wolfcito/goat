# Goat Plugin global Address 🐐 🌎 - TypeScript

## Installation

```bash
pnpm install @goat-sdk/plugin-global-address
```

## Description

Global Address is a great way to onboard funds to L2/L3s from CEXs, fiat onramps, and other chains.

### **Generate a global address**

Create a global address for a receiver on a target chain.

### **Send funds from anywhere**

Send funds (from CEXs/onramps/wallets) to the global address, on ANY chain.

### **Receive on target chain**

The receiver gets funds on the target chain.

## Usage

```typescript
import { globalAddress } from "@goat-sdk/plugin-global-address";

const tools = await getOnChainTools({
    wallet: viem(wallet),
    plugins: [
        globalAddress(),
        // ... other plugins
    ],
});
```

## Supported Chains

-   mainnet
-   optimism
-   polygon
-   worldchain
-   base
-   mode
-   arbitrum
-   blast
-   scroll
-   zora

## Links

-   [Global Address Tool](https://global-address.zerodev.app/)
