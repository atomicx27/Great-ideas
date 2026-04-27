# AGI Software Architecture Swarm

The AGI Software Architecture Swarm represents the leap into **Artificial General Intelligence (AGI)** within the Software Engineering domain. It uses multi-agent orchestration to tackle complex, ambiguous engineering tasks.

A "Master Orchestrator" receives a high-level product requirement (e.g., "Build a scalable chat app"). It spawns specialized sub-agents (Frontend Architect, Backend Architect, Database Architect) to design their respective layers simultaneously. The Master then synthesizes their parallel outputs, resolving technical conflicts, to produce a cohesive Software Architecture Document.

## Key Features

*   **Multi-Agent Orchestration:** Simulates an AGI brain coordinating multiple specialized models.
*   **Parallel Processing:** Sub-agents work simultaneously, visualized in the UI.
*   **Secure Markdown Rendering:** Uses `marked.js` and `DOMPurify` to safely render dynamic, formatted outputs from the LLM swarm.
*   **BYOK Architecture:** Supports configurable API connections for major cloud providers or local execution via Ollama.