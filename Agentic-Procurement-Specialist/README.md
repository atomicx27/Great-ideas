# Agentic Procurement Specialist

## Idea Overview
The Agentic Procurement Specialist is a step up into **Agentic AI**. Unlike a simple script that orders items when stock is low, this agent has a goal (maintain optimal stock levels within budget) and access to simulated "tools" (`checkInventory`, `checkSupplierPrices`, `placeOrder`). The agent autonomously decides which tools to call, inspects the results, and executes a procurement strategy.

## How it makes work easy and efficient
*   **Intelligent Purchasing:** It doesn't just buy the first item; it can be instructed to find the cheapest supplier.
*   **Autonomous Action:** Replaces the manual task of checking stock, logging into supplier portals, comparing prices, and submitting orders.
*   **Transparent Reasoning:** The agent shows its "thought process," allowing users to audit why certain purchasing decisions were made.

## Technologies Used
*   HTML5 / CSS3 for the UI
*   JavaScript (Vanilla) for connecting to LLM APIs (BYOK support for OpenAI, Anthropic, or local Ollama)
*   Simulated Tools to demonstrate agentic capabilities without requiring real API integrations for suppliers.