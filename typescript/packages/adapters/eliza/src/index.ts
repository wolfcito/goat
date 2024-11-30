import {
    type WalletClient,
    type Plugin,
    getDeferredTools,
    parametersToJsonExample,
    addParametersToDescription,
} from "@goat-sdk/core";

import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@ai16z/eliza";
import { composeContext, generateObject } from "@ai16z/eliza";
import type { ChainForWalletClient } from "@goat-sdk/core";

type GetOnChainActionsParams<TWalletClient extends WalletClient> = {
    chain: ChainForWalletClient<TWalletClient>;
    getWalletClient: (runtime: IAgentRuntime) => Promise<TWalletClient>;
    plugins: Plugin<TWalletClient>[];
    supportsSmartWallets?: boolean;
};

export async function getOnChainActions<TWalletClient extends WalletClient>({
    getWalletClient,
    plugins,
    chain,
    supportsSmartWallets,
}: GetOnChainActionsParams<TWalletClient>): Promise<Action[]> {
    const tools = await getDeferredTools<TWalletClient>({
        plugins,
        wordForTool: "action",
        chain,
        supportsSmartWallets,
    });

    const actions: Action[] = tools.map((tool) => {
        return {
            name: tool.name.toUpperCase(),
            similes: [],
            description: tool.description,
            validate: async (runtime: IAgentRuntime, message: Memory) => {
                return true;
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state: State,
                _options: { [key: string]: unknown },
                callback?: HandlerCallback
            ): Promise<boolean> => {
                const walletClient = await getWalletClient(runtime);

                let currentState =
                    state ?? (await runtime.composeState(message));
                currentState = await runtime.updateRecentMessageState(
                    currentState
                );

                // Compose context for parameter extraction
                const contextTemplate = `Respond with a JSON markdown block containing only the extracted values for action "${tool.name
                }". Use null for any values that cannot be determined.

Example response:
\`\`\`json
${parametersToJsonExample(tool.parameters)}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information for the action "${
                    tool.name
                }":
${addParametersToDescription("", tool.parameters)}
`;

                const context = composeContext({
                    state: currentState,
                    template: contextTemplate,
                });

                // Generate parameters using AI
                const parameters = await generateObject({
                    runtime,
                    context,
                    modelClass: ModelClass.SMALL,
                });

                // Validate parameters using the tool's schema
                const parsedParameters = tool.parameters.safeParse(parameters);

                if (!parsedParameters.success) {
                    if (callback) {
                        callback({
                            text: `Invalid parameters for action ${tool.name}: ${parsedParameters.error.message}`,
                            content: { error: parsedParameters.error.message },
                        });
                    }
                    return false;
                }

                // Execute the tool's method
                try {
                    const result = await tool.method(
                        walletClient,
                        parsedParameters.data
                    );

                    if (callback) {
                        callback({
                            text: `Action ${tool.name} executed successfully.`,
                            content: result,
                        });
                    }

                    return true;
                } catch (error: unknown) {
                    if (callback) {
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        callback({
                            text: `Error executing action ${tool.name}: ${errorMessage}`,
                            content: { error: errorMessage },
                        });
                    }
                    return false;
                }
            },
            examples: [],
        } as Action;
    });

    return actions;
}
