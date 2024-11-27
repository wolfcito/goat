import { custodialFactory } from "./custodial";
import { smartWalletFactory } from "./smart-wallet";
import { faucetFactory } from "./faucet";

function crossmint(apiKey: string) {
    return {
        custodial: custodialFactory(apiKey),
        smartwallet: smartWalletFactory(apiKey),
        faucet: faucetFactory(apiKey),
    };
}

export { crossmint };
