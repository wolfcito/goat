import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { http, createWalletClient } from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { modeTestnet } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";

import { viem } from "@goat-sdk/wallet-viem";

import { globalAddress } from "@goat-sdk/plugin-global-address";

require("dotenv").config();

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: modeTestnet,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [globalAddress()],
    });

    const prompt =
        "Create a global address for 0x9D2C3fac3245Dd74A0655393d7b9a28492E4A712 using Mode Network as the destination chain.";
    console.log("\n=========================================\n");
    console.log("Supported Chains: mainnet, optimism, polygon, worldchain, base, mode, arbitrum, blast, scroll, zora");
    console.log("\n=========================================\n");
    console.log("🤖 Processing prompt:", prompt);
    console.log("===========================================\n");

    console.log("\n-------------------\n");
    console.log("TOOLS CALLED");
    console.log("\n-------------------\n");

    console.log("\n-------------------\n");
    console.log("RESPONSE");
    console.log("\n-------------------\n");
    try {
        const result = await generateText({
            model: openai("gpt-4o-mini"),
            tools: tools,
            maxSteps: 5,
            prompt: prompt,
        });
        console.log("\n📊 FINAL RESPONSE");
        console.log("-------------------");
        console.log(result.text);
    } catch (error) {
        console.log("\n❌ ERROR");
        console.log("-------------------");
        console.error(error);
    }
    console.log("\n-------------------\n");
})();
