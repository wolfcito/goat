export const getAddressPrompt = `
This tool returns the address of the Solana wallet.
`;

export const getSOLBalancePrompt = `
This tool returns the SOL balance of a Solana wallet.
- address (string, optional): The address to get the balance of, defaults to the address of the wallet
`;

export const sendSOLPrompt = `
This tool sends SOL to an address on a Solana chain.
- to (string): The address to send SOL to
- amount (string): The amount of SOL to send
`;
