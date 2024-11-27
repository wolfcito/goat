export const getAddressPrompt = `
This tool returns the address of the EVM wallet.
`;

export const getEthBalancePrompt = `
This tool returns the ETH balance of an EVM wallet.
- address (string, optional): The address to get the balance of, defaults to the address of the wallet
`;

export const sendETHPrompt = `
This tool sends ETH to an address on an EVM chain.
- to (string): The address to send ETH to
- amount (string): The amount of ETH to send
`;
