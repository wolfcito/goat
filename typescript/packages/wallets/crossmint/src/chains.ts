import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    bsc,
    mainnet,
    sepolia,
    optimism,
    optimismSepolia,
    polygon,
    zora,
    zoraSepolia,
    type Chain,
    polygonAmoy,
} from "viem/chains";

export type SupportedEVMChains =
    | "arbitrum"
    | "arbitrum-sepolia"
    | "base"
    | "base-sepolia"
    | "bsc"
    | "ethereum"
    | "ethereum-sepolia"
    | "optimism"
    | "optimism-sepolia"
    | "polygon"
    | "polygon-amoy"
    | "zora"
    | "zora-sepolia";

export type SupportedSmartWalletChains =
    | "polygon"
    | "polygon-amoy"
    | "base"
    | "base-sepolia"
    | "arbitrum"
    | "arbitrum-sepolia"
    | "optimism"
    | "optimism-sepolia";

export function getViemChain(chain: SupportedEVMChains): Chain {
    const chainMap: Record<SupportedEVMChains, Chain> = {
        arbitrum: arbitrum,
        "arbitrum-sepolia": arbitrumSepolia,
        base: base,
        "base-sepolia": baseSepolia,
        bsc: bsc,
        ethereum: mainnet,
        "ethereum-sepolia": sepolia,
        optimism: optimism,
        "optimism-sepolia": optimismSepolia,
        polygon: polygon,
        "polygon-amoy": polygonAmoy,
        zora: zora,
        "zora-sepolia": zoraSepolia,
    };

    const viemChain = chainMap[chain];
    if (!viemChain) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    return viemChain;
}

export function getEnv(chain: SupportedEVMChains): "staging" | "production" {
    const testnets: SupportedEVMChains[] = [
        "arbitrum-sepolia",
        "base-sepolia",
        "ethereum-sepolia",
        "optimism-sepolia",
        "polygon-amoy",
        "zora-sepolia",
    ];

    return testnets.includes(chain) ? "staging" : "production";
}
