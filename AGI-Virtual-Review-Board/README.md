# AGI Virtual Review Board

## Idea Overview
The AGI Virtual Review Board applies early-stage Artificial General Intelligence (AGI) concepts—specifically, multi-agent collaboration and persona simulation—to the corporate review process.

Before sharing a major proposal, contract, or strategy document, professionals usually seek cross-departmental feedback. This tool automates that. You paste your document, select which "Expert Personas" you want to review it (e.g., The Strict Legal Counsel, The Frugal CFO, The Creative Marketer, The Pragmatic Engineer), and initialize the board.

A swarm of independent LLM instances analyzes the document simultaneously, each adopting a specific persona. A "Master Synthesizer" agent then reviews all the critiques, identifying common themes, resolving conflicts, and presenting a unified Executive Summary.

Like all AI tools in this repository, it features a **Bring Your Own Key (BYOK)** architecture (OpenAI, Anthropic, Ollama).

## How it makes work easy and efficient
*   **Instant Red Teaming:** Discover critical flaws in your proposals before you ever present them to human stakeholders.
*   **Parallel Processing:** Getting feedback from Legal, Finance, and Marketing might take 3 weeks of scheduling in the real world. This AGI swarm does it in 30 seconds via parallel API execution.
*   **Diverse Perspectives:** Prevents "echo chamber" thinking by forcing the AI to evaluate the document from highly specific, often conflicting, professional angles.
*   **Master Synthesis:** You don't just get raw feedback; the orchestrator agent digests the varying opinions into a clean, prioritized list of action items.

## Technologies Used
*   HTML5 / CSS3 (Dashboard UI for visualizing concurrent agent tasks)
*   JavaScript (Vanilla) for complex multi-agent prompt engineering, `Promise.all()` parallel execution, and state management.
*   APIs: OpenAI SDK equivalents, Anthropic Messages API, Ollama REST API.
