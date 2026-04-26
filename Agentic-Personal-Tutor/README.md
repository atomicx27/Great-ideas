# Agentic Personal Tutor

The Agentic Personal Tutor is a step up into **Agentic AI** in the Education domain. Unlike traditional linear learning modules, this agent has a goal (ensure the student understands a topic) and access to "tools" (simulated APIs like `askStudentQuestion`, `evaluateUnderstanding`, `provideCorrection`).

The agent autonomously decides which tools to call, inspects the student's answers, evaluates their understanding, and provides targeted corrections until the learning goal is achieved. It features the BYOK (Bring Your Own Key) architecture for major cloud providers (OpenAI, Anthropic) or local execution via Ollama.

## Key Features

*   **Autonomous Workflow:** The agent loops through "Thought, Action, Observation" cycles to achieve its goal.
*   **Tool Integration:** Simulates using external tools to interact with the student and evaluate answers.
*   **BYOK Architecture:** Supports OpenAI, Anthropic, and local Ollama integrations.