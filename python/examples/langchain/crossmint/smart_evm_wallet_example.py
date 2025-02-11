import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

from goat_adapters.langchain import get_on_chain_tools
from goat_plugins.erc20 import erc20, ERC20PluginOptions
from goat_plugins.erc20.token import USDC, PEPE
from goat_wallets.evm.send_eth import send_eth
from goat_wallets.crossmint import crossmint

crossmint = crossmint(os.getenv("CROSSMINT_API_KEY"))

crossmint_wallet = crossmint["smartwallet"]({
    "address": "0x60096F6E9143DbfdeB12aB81C81eD560584B2954",
    "signer": "0x0b76745250FEF8fBa8e597b84CdaE46B5aC03573",
    "provider": "https://base-mainnet.g.alchemy.com/v2/demo",
    "ensProvider": "https://base-mainnet.g.alchemy.com/v2/demo",
    "chain": "base",
})

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini")

async def main():
    
    # Get the prompt template
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant"),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ]
    )

    # Initialize tools with Solana wallet
    tools = get_on_chain_tools(
        wallet=crossmint_wallet,
        plugins=[
            send_eth(),
            erc20(options=ERC20PluginOptions(tokens=[USDC, PEPE])),
        ],
    )
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent, tools=tools, handle_parsing_errors=True, verbose=True
    )

    while True:
        user_input = input("\nYou: ").strip()

        if user_input.lower() == "quit":
            print("Goodbye!")
            break

        try:
            response = agent_executor.invoke(
                {
                    "input": user_input,
                }
            )

            print("\nAssistant:", response["output"])
        except Exception as e:
            print("\nError:", str(e))


if __name__ == "__main__":
    asyncio.run(main())
