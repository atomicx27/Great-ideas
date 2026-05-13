# Agentic Carbon Offset Trader

The Agentic Carbon Offset Trader represents a step up into **Agentic AI** in the Climate Tech domain.

Rather than executing a static calculation, this autonomous agent is given a complex financial and environmental goal (e.g., "Offset 5,000 MT CO2e using a mix of Forestry and Direct Air Capture under a $150,000 budget"). It autonomously decides which "tools" (simulated market APIs) to use to gather live pricing data. It then dynamically synthesizes this data to solve the optimization problem and executes the necessary trades to balance the portfolio.

It supports the Bring Your Own Key (BYOK) architecture, allowing integration with OpenAI, Anthropic, or local execution via Ollama.