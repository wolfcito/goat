# Crossmint Wallet Implementation for GOAT SDK

This package provides Crossmint wallet integration for the GOAT SDK, supporting both EVM Smart Wallets and Solana Custodial Wallets.

## Features

- EVM Smart Wallet support
- Solana Custodial Wallet support
- Async API client for Crossmint interactions
- Support for multiple authentication methods (email, phone, user ID)
- Transaction and signature management
- Balance queries and ENS resolution

## Installation

```bash
poetry add goat-sdk-wallet-crossmint
```

## Usage

```python
from goat_wallets.crossmint import smart_wallet_factory, custodial_factory
from crossmint.common_sdk_base import CrossmintApiClient

# Initialize Crossmint client
crossmint_client = CrossmintApiClient(...)

# Create Smart Wallet
smart_wallet = await smart_wallet_factory(crossmint_client)({
    "chain": "ethereum",
    "provider": "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
    "signer": {"secretKey": "0x..."}
})

# Create Custodial Wallet
custodial_wallet = await custodial_factory(crossmint_client)({
    "chain": "solana",
    "connection": solana_connection,
    "email": "user@example.com"
})
```

## License

MIT License
