# Agentic Legal Researcher

An autonomous single-agent system that simulates an entry-level legal researcher or paralegal.

## Idea
Legal professionals spend countless hours sifting through case law databases to find relevant precedents. This tool implements true "Agentic AI" workflows. Given a complex scenario, the agent acts autonomously: it uses live simulated tools (`queryCaseLaw`, `summarizePrecedent`) to gather facts, decides when it has enough context, and synthesizes the findings into a comprehensive legal brief. It features a Bring Your Own Key (BYOK) architecture, supporting OpenAI, Anthropic, and local Ollama integrations for processing sensitive data securely.