class SubAgent {
    constructor(role, apiType, fetchApi) {
        this.role = role;
        this.apiType = apiType;
        this.fetchApi = fetchApi;
    }
    async executeTask(context) {
        const prompt = `You are a ${this.role}. React to context: ${context}`;
        if (this.fetchApi) {
            return await this.fetchApi('http://127.0.0.1:11434', 'llama3', prompt, "Go!");
        }
        return `Mocked ${this.role} response`;
    }
}

class Orchestrator {
    constructor(apiType) {
        this.apiType = apiType;
        const fetchMethod = typeof fetchOllama !== 'undefined' ? fetchOllama : null;
        this.agents = [
            new SubAgent("Lighting Expert", apiType, fetchMethod),
            new SubAgent("Audio Engineer", apiType, fetchMethod)
        ];
    }

    async orchestrateShow(showContext) {
        const results = await Promise.all(this.agents.map(agent => agent.executeTask(showContext)));
        return results.join(" | ");
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('runBtn');
        const output = document.getElementById('output');
        const status = document.getElementById('status');

        runBtn.addEventListener('click', async () => {
            status.textContent = "Status: Orchestrating...";
            const orchestrator = new Orchestrator('ollama');
            try {
                const response = await orchestrator.orchestrateShow('High energy rock concert');
                output.innerHTML = `<p>Show Plan: ${response}</p>`;
                status.textContent = "Status: Done";
            } catch (error) {
                output.innerHTML = `<p>Error: ${error.message}</p>`;
                status.textContent = "Status: Error";
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Orchestrator, SubAgent };
}
