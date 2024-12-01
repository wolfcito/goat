# Goat Plugin for Eliza
Example plugin of how you can integrate [Goat](https://ohmygoat.dev/) tools and plugins with Eliza.

Adds capabilities to your agent to send and check balances of ETH and USDC. Add all the capabilities you need by adding more plugins!

## Setup
1. Copy this directory into your Eliza project
2. Configure your wallet in `wallet.ts` (key pair, smart wallet, etc. see all available wallets at [https://ohmygoat.dev/wallets](https://ohmygoat.dev/wallets))
3. Add the plugins you need in `index.ts` (uniswap, zora, polymarket, etc. see all available plugins at [https://ohmygoat.dev/chains-wallets-plugins](https://ohmygoat.dev/chains-wallets-plugins))
4. Select a chain in `index.ts` (see all available chains at [https://ohmygoat.dev/chains](https://ohmygoat.dev/chains))
5. Import and add the plugin to your Eliza agent
6. Delete the `.npmrc` file
7. Build the project
8. Add the necessary environment variables to set up your wallet and plugins
9. Run your agent!
