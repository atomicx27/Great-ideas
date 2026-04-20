# AI Meeting Summarizer

## Idea Overview
The AI Meeting Summarizer addresses one of the most tedious aspects of corporate life: processing meeting transcripts and writing up notes. By pasting raw, unstructured transcripts from tools like Zoom, Microsoft Teams, or Google Meet, this application uses LLMs to automatically extract the core summary, key decisions, and formatted action items.

Just like the AI Email Copilot, this tool features a **Bring Your Own Key (BYOK)** architecture with robust provider flexibility:
*   **OpenAI (ChatGPT):** State-of-the-art text comprehension.
*   **Anthropic (Claude):** Industry-leading context windows, perfect for extremely long transcripts.
*   **Ollama (Local LLMs):** Absolute data privacy. Process highly confidential board meeting or HR transcripts completely offline without sending any data over the internet.

## How it makes work easy and efficient
*   **Saves Hours of Manual Work:** Distills a 60-minute meeting transcript into a 3-minute read instantly.
*   **Improved Accountability:** Automatically identifies and formats Action Items along with their owners, ensuring tasks don't slip through the cracks.
*   **Data Security:** The Ollama integration allows heavily regulated industries to leverage AI summarization securely.
*   **Clarity from Chaos:** Cleans up messy cross-talk and raw speech-to-text artifacts into polished, professional documentation.

## Technologies Used
*   HTML5 / CSS3 (Responsive, professional document-style UI)
*   JavaScript (Vanilla) for asynchronous API fetching and state management.
*   APIs: OpenAI SDK equivalents, Anthropic Messages API, Ollama REST API.
