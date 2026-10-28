class SubAgent {
    constructor(role, apiType, fetchApi) {
        this.role = role;
        this.apiType = apiType;
        this.fetchApi = fetchApi;
    }
    async executeTask(context) {
        const prompt = `You are a ${this.role}. React to context: ${context}`;
        if (this.fetchApi) {
            return await this.fetchApi('http://127.0.0.1:11434', 'llama3', prompt, "Analyze and plan.");
        }
        return `Mocked ${this.role} response`;
    }
}

class MasterOrchestrator {
    constructor(apiType) {
        this.apiType = apiType;
        const fetchMethod = typeof fetchOllama !== 'undefined' ? fetchOllama : null;
        this.agents = [
            new SubAgent("Logistics Coordinator", apiType, fetchMethod),
            new SubAgent("Safety Engineer", apiType, fetchMethod),
            new SubAgent("Meteorologist", apiType, fetchMethod)
        ];
    }

    async coordinateOperations(missionDetails) {
        const results = await Promise.all(this.agents.map(agent => agent.executeTask(missionDetails)));
        return results.join(" | ");
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('runBtn');
        const output = document.getElementById('output');
        const status = document.getElementById('status');

        runBtn.addEventListener('click', async () => {
            status.textContent = "Status: Coordinating...";
            const orchestrator = new MasterOrchestrator('ollama');
            try {
                const response = await orchestrator.coordinateOperations('Launch 10 tons of cargo during solar flare warning');
                output.innerHTML = `<p>Operations Plan: ${response}</p>`;
                status.textContent = "Status: Done";
            } catch (error) {
                output.innerHTML = `<p>Error: ${error.message}</p>`;
                status.textContent = "Status: Error";
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterOrchestrator, SubAgent };
}
