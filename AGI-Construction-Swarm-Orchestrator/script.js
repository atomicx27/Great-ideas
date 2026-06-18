async function manageConstructionSwarm(logisticsData, siteStatus, provider, apiKey) {
    const systemPrompt = `You are the AGI Construction Swarm Orchestrator.
Coordinate drones, material logistics, and crane operations in real-time.
Given logistics data and site status, provide simultaneous directives for all 3 sub-systems.`;

    const userMessage = `Logistics: ${logisticsData}\nSite Status: ${siteStatus}`;

    try {
        let response = "";

        if (typeof global !== 'undefined' && global.fetchLLM) {
            response = await global.fetchLLM(provider, apiKey, 'model', systemPrompt, userMessage);
        } else if (typeof window !== 'undefined' && window.fetchOpenAI && window.fetchAnthropic && window.fetchOllama) {
            if (provider === 'openai') {
                response = await window.fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
            } else if (provider === 'anthropic') {
                response = await window.fetchAnthropic(apiKey, 'claude-3-haiku-20240307', systemPrompt, userMessage);
            } else if (provider === 'ollama') {
                response = await window.fetchOllama('http://localhost:11434', 'llama3', systemPrompt, userMessage);
            }
        } else {
             response = "Mocked Directives:\n- Drones: Ground due to heavy winds.\n- Logistics: Reroute steel delivery to Bay 2.\n- Cranes: Secure Crane 1 immediately.";
        }

        return response;
    } catch (error) {
        throw new Error(`Orchestration failed: ${error.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const manageBtn = document.getElementById('manage-btn');
        const logisticsInput = document.getElementById('logistics-data');
        const statusInput = document.getElementById('site-status');
        const providerSelect = document.getElementById('provider');
        const apiKeyInput = document.getElementById('api-key');

        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const swarmPlanEl = document.getElementById('swarm-plan');

        manageBtn.addEventListener('click', async () => {
            const logistics = logisticsInput.value;
            const siteStatus = statusInput.value;
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key.");
                return;
            }

            manageBtn.disabled = true;
            statusText.innerText = "Status: Computing swarm directives...";
            resultsPanel.classList.add('hidden');

            try {
                const plan = await manageConstructionSwarm(logistics, siteStatus, provider, apiKey);

                swarmPlanEl.innerText = plan;
                statusText.innerText = "Status: Directives Deployed";
                resultsPanel.classList.remove('hidden');
            } catch (err) {
                statusText.innerText = `Error: ${err.message}`;
            } finally {
                manageBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { manageConstructionSwarm };
}