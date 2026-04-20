# AGI Task Swarm Orchestrator

## Idea Overview
The AGI Task Swarm Orchestrator simulates early-stage Artificial General Intelligence (AGI) mechanics applied to workflow automation. Standard LLMs require highly specific, step-by-step prompts to accomplish complex tasks. This tool shifts the paradigm: you provide a highly ambiguous, overarching goal, and the **Master Orchestrator Agent** autonomously decides how to solve it.

The workflow:
1.  **Decomposition:** The Orchestrator breaks the main goal down into 3-5 distinct, parallel tasks.
2.  **Swarm Execution:** It spawns independent "Sub-Agents" to execute each task simultaneously.
3.  **Synthesis:** The Orchestrator collects the outputs from the swarm and compiles a final, cohesive master document.

Like all AI tools in this repository, it features a **Bring Your Own Key (BYOK)** architecture (OpenAI, Anthropic, Ollama).

## How it makes work easy and efficient
*   **Tackles Ambiguity:** Humans no longer need to figure out *how* to solve a problem, only *what* the problem is.
*   **Massive Time Savings via Parallelism:** By spawning sub-agents that run simultaneously via asynchronous API calls, a complex 30-minute synthesis task is completed in seconds.
*   **Transparent Orchestration:** The UI visually maps out the spawning of agents, providing a mesmerizing and transparent look into multi-agent systems.
*   **High-Quality Synthesis:** Because each sub-agent is focused solely on one slice of the problem, the final aggregated output is far more detailed than a single LLM prompt could generate.

## Technologies Used
*   HTML5 / CSS3 (Grid/Flexbox for a dynamic, multi-threaded UI visualization)
*   JavaScript (Vanilla) for advanced asynchronous logic, Promise.all() parallel execution, JSON parsing from LLM outputs, and state management.
*   APIs: OpenAI SDK equivalents, Anthropic Messages API, Ollama REST API.
