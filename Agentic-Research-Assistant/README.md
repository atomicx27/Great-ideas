# Agentic Research Assistant

## Idea Overview
The Agentic Research Assistant moves beyond traditional generative AI by introducing **Agentic AI Workflows**. Instead of just returning a static answer based on pre-training data (which is prone to hallucinations), this tool acts as an autonomous agent.

When given a prompt, it:
1.  **Plans:** Decides what information it needs to find.
2.  **Acts (Tool Use):** Calls a live external API (Wikipedia) to fetch real, factual data.
3.  **Synthesizes:** Combines the live data to formulate a comprehensive, cited report.

Like previous tools in this repository, it features a **Bring Your Own Key (BYOK)** architecture, supporting OpenAI, Anthropic, and local execution via Ollama for ultimate privacy.

## How it makes work easy and efficient
*   **Automated Research:** Eliminates the manual process of opening multiple tabs, searching wikis, reading, and synthesizing information.
*   **Reduced Hallucinations:** By grounding the LLM's final response in real-time data fetched from Wikipedia, the output is significantly more accurate and trustworthy.
*   **Transparent "Thought" Process:** The UI displays exactly what the agent is thinking and doing at each step, building trust with the user.
*   **Data Security:** The Ollama integration allows for completely private, offline synthesis of the fetched public data.

## Technologies Used
*   HTML5 / CSS3 (Dynamic, step-by-step processing UI)
*   JavaScript (Vanilla) for complex asynchronous agent loops, API tool calling, and state management.
*   APIs: Wikipedia REST API (for live tools), OpenAI SDK equivalents, Anthropic Messages API, Ollama REST API.
