class ElevatorAgent {
    constructor(apiType, apiKey, model) {
        this.apiType = apiType;
        this.apiKey = apiKey;
        this.model = model;
        // In browser, global fetchOllama etc come from shared/llm-api.js
        this.fetchOllama = typeof fetchOllama !== 'undefined' ? fetchOllama : null;
    }

    async manageSchedule(payloadDetails) {
        const systemPrompt = "You are a Space Elevator Operator. Provide an optimal schedule for the payload considering dynamic priorities.";
        const userMessage = `Payload Details: ${payloadDetails}`;

        if (this.apiType === 'ollama') {
            if (this.fetchOllama) {
                return await this.fetchOllama('http://127.0.0.1:11434', this.model, systemPrompt, userMessage);
            } else {
                return "Mocked Ollama Response: Schedule payload for launch at 0800 hours.";
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
            status.textContent = "Status: Scheduling...";
            const agent = new ElevatorAgent('ollama', 'mock', 'llama3');
            try {
                const response = await agent.manageSchedule('5 tons of building materials, low priority');
                output.innerHTML = `<p>Schedule Plan: ${response}</p>`;
                status.textContent = "Status: Done";
            } catch (error) {
                output.innerHTML = `<p>Error: ${error.message}</p>`;
                status.textContent = "Status: Error";
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElevatorAgent };
}
