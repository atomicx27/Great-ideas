# AI Email Copilot

## Idea Overview
The AI Email Copilot is a web-based, standalone application that brings advanced language models directly into your daily communication workflow. Drafting polite, professional, and clear emails takes immense amounts of time for knowledge workers. This tool automates the process by generating drafts based on short bullet points or summarizing long email threads.

Crucially, it is built with **provider flexibility**. Users can seamlessly switch between different LLM engines:
*   **OpenAI (ChatGPT):** High quality, general purpose.
*   **Anthropic (Claude):** Excellent for long context and nuanced tone.
*   **Ollama (Local LLMs):** Run models entirely locally on your machine for 100% data privacy (no data is sent to the cloud).

## How it makes work easy and efficient
*   **Eliminates Writer's Block:** Turn "tell boss project is late because of vendor" into a polished, professional 3-paragraph email in seconds.
*   **Tone Adjustment:** Easily tweak drafts to be more formal, friendly, or concise.
*   **Data Security:** By allowing local LLMs (via Ollama), employees dealing with sensitive data (finance, healthcare, legal) can still use AI without violating company data sharing policies.
*   **Cost Control:** "Bring your own key" (BYOK) means users control their own usage, or use free local models.

## Technologies Used
*   HTML5 / CSS3 (Modern, clean, Outlook/Gmail-inspired UI)
*   JavaScript (Vanilla) for asynchronous API fetching and state management.
*   APIs: OpenAI SDK equivalents, Anthropic Messages API, Ollama REST API.
