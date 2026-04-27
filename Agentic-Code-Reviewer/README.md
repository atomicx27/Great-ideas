# Agentic Code Reviewer

The Agentic Code Reviewer is a step up into **Agentic AI** in the Software Engineering domain. Unlike a static linter that just checks for missing semicolons, this agent understands context, intent, and modern best practices.

Given a block of code, it uses simulated tools to analyze the structure, identify logical flaws (like missing error handling), and autonomously generates a comprehensive, markdown-formatted code review with suggested refactoring. It features the BYOK (Bring Your Own Key) architecture for major cloud providers (OpenAI, Anthropic) or local execution via Ollama.

## Key Features

*   **Contextual Understanding:** Goes beyond syntax to evaluate logic and best practices.
*   **Autonomous Workflow:** The agent loops through analysis and synthesis stages.
*   **Secure Output Rendering:** Demonstrates using `marked.js` and `DOMPurify` to safely render dynamically generated markdown content, preventing XSS vulnerabilities.
*   **BYOK Architecture:** Supports OpenAI, Anthropic, and local Ollama integrations.