import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { MARKET_CONTROLLER_ABI } from "@common/abi";
import {
    getValidatedNetwork,
    getMarketController,
} from "@common/utils/network-manager";
import { fetchTokenConfig } from "@common/utils/asset-manager";

export class PortfolioMonitorService {
    /**
     * Obtiene las métricas de salud del portafolio, como LTV, Health Factor y riesgo de liquidación.
     */
    async getPortfolioHealth(
        walletClient: EVMWalletClient
    ): Promise<PortfolioHealthResponse> {
        const network = getValidatedNetwork(walletClient);
        const marketController = getMarketController(network.id);

        // Obtiene la liquidez de la cuenta
        const accountLiquidity = await walletClient.read({
            address: marketController,
            abi: MARKET_CONTROLLER_ABI,
            functionName: "getAccountLiquidity",
            args: [walletClient.getAddress()],
        });

        console.log("Account liquidity:", { accountLiquidity });
        // Calcular el Health Factor
        const collateralValue = 0;
        const liquidity = 0;
        const shortfall = 0;
        // const { collateralValue, liquidity, shortfall } = accountLiquidity;

        const healthFactor =
            shortfall > 0
                ? collateralValue / shortfall // Riesgo de liquidación
                : collateralValue / Math.max(liquidity, 1);

        return {
            collateralValue,
            liquidity,
            shortfall,
            healthFactor,
            status:
                shortfall > 0
                    ? "At Risk" // Riesgo de liquidación
                    : healthFactor < 1.5
                    ? "Warning" // Factor de salud bajo
                    : "Healthy", // Salud financiera estable
        };
    }

    /**
     * Sugerencias para mejorar el portafolio según su salud actual.
     */
    getImprovementSuggestions(
        healthResponse: PortfolioHealthResponse
    ): string[] {
        const suggestions: string[] = [];

        if (healthResponse.shortfall > 0) {
            suggestions.push(
                "Your account is at risk of liquidation. Consider repaying debt or adding more collateral."
            );
        } else if (healthResponse.healthFactor < 1.5) {
            suggestions.push(
                "Your health factor is low. Adding more collateral or reducing your borrowing can improve it."
            );
        } else {
            suggestions.push("Your portfolio is in good health.");
        }

        return suggestions;
    }
}

/**
 * Interfaz de respuesta para la salud del portafolio.
 */
interface PortfolioHealthResponse {
    collateralValue: number; // Valor total del colateral en la cuenta
    liquidity: number; // Liquidez disponible para operaciones
    shortfall: number; // Déficit en caso de liquidación
    healthFactor: number; // Relación entre colateral y deuda
    status: "Healthy" | "Warning" | "At Risk"; // Estado de la salud financiera
}

/**
 * Interfaz de respuesta para la liquidez de la cuenta.
 */
interface AccountLiquidityResponse {
    collateralValue: number;
    liquidity: number;
    shortfall: number;
}
