class HologramAgent {
    constructor(apiType, apiKey, model) {
        this.apiType = apiType;
        this.apiKey = apiKey;
        this.model = model;
        // In browser, global fetchOllama etc come from shared/llm-api.js
        this.fetchOllama = typeof fetchOllama !== 'undefined' ? fetchOllama : null;
    }

    async directPerformance(audienceSentiment) {
        const systemPrompt = "You are a Hologram Director. Provide a short direction for the hologram based on the audience sentiment.";
        const userMessage = `Audience sentiment: ${audienceSentiment}`;

        if (this.apiType === 'ollama') {
            if (this.fetchOllama) {
                return await this.fetchOllama('http://127.0.0.1:11434', this.model, systemPrompt, userMessage);
            } else {
                return "Mocked Ollama Response: Increase brightness and upbeat tempo.";
            }
        }
        return "Unsupported API";
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('runBtn');
        const output = document.getElementById('output');
        const status = document.getElementById('status');

        runBtn.addEventListener('click', async () => {
            status.textContent = "Status: Directing...";
            const agent = new HologramAgent('ollama', 'mock', 'llama3');
            try {
                const response = await agent.directPerformance('Bored');
                output.innerHTML = `<p>Direction: ${response}</p>`;
                status.textContent = "Status: Done";
            } catch (error) {
                output.innerHTML = `<p>Error: ${error.message}</p>`;
                status.textContent = "Status: Error";
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HologramAgent };
}
