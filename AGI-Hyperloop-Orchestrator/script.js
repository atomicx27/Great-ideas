let isOrchestrating = false;

// Attempt to use shared fetchers if in browser, otherwise mock for tests
let internalFetchOllama, internalFetchOpenAI, internalFetchAnthropic;
if (typeof window !== 'undefined' && window.fetchOllama) {
    internalFetchOllama = window.fetchOllama;
    internalFetchOpenAI = window.fetchOpenAI;
    internalFetchAnthropic = window.fetchAnthropic;
} else {
    // Mock for Node.js tests
    internalFetchOllama = async () => 'Mocked agent response (Ollama)';
    internalFetchOpenAI = async () => 'Mocked agent response (OpenAI)';
    internalFetchAnthropic = async () => 'Mocked agent response (Anthropic)';
}

async function fetchAgentResponse(provider, role, goal) {
    const systemPrompt = `You are a hyperloop sub-agent specialized in: ${role}. Provide an analysis based on the global objective.`;
    const userMessage = `Global Goal: ${goal}`;

    try {
        if (provider === 'ollama') {
            return await internalFetchOllama('http://127.0.0.1:11434', 'llama3', systemPrompt, userMessage);
        } else if (provider === 'openai') {
            return await internalFetchOpenAI('mock-key', 'gpt-4', systemPrompt, userMessage);
        } else if (provider === 'anthropic') {
            return await internalFetchAnthropic('mock-key', 'claude-3-sonnet', systemPrompt, userMessage);
        }
        return "Unknown provider.";
    } catch (e) {
        return `Error: ${e.message}`;
    }
}

async function spawnRoutingAgents(provider, goal) {
    const roles = ["Weather Forecaster", "Traffic Analyzer", "Maintenance Scheduler"];
    const swarmContainer = document.getElementById('swarm-container');
    if (swarmContainer) swarmContainer.innerHTML = '';

    const tasks = roles.map(async (role) => {
        // UI placeholder
        let agentDiv;
        if (swarmContainer) {
            agentDiv = document.createElement('div');
            agentDiv.className = 'sub-agent';
            agentDiv.innerHTML = `<h3>${role}</h3><p>Analyzing...</p>`;
            swarmContainer.appendChild(agentDiv);
        }

        const response = await fetchAgentResponse(provider, role, goal);

        if (agentDiv) {
            agentDiv.innerHTML = `<h3>${role}</h3><p>${response}</p>`;
        }

        return { role, response };
    });

    return await Promise.all(tasks);
}

async function orchestrateSwarm(provider, goal) {
    if (isOrchestrating) return null;
    isOrchestrating = true;

    const summaryEl = document.getElementById('master-summary');
    if (summaryEl) summaryEl.textContent = 'Master Orchestrator is coordinating sub-agents...';

    const results = await spawnRoutingAgents(provider, goal);

    const finalSummary = `Master Summary: Evaluated ${results.length} domains. Optimal continental schedule generated based on ${provider.toUpperCase()}.`;

    if (summaryEl) {
        summaryEl.textContent = finalSummary;
    }

    isOrchestrating = false;
    return finalSummary;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('orchestrate-btn').addEventListener('click', () => {
            const provider = document.getElementById('provider').value;
            const goal = document.getElementById('global-goal').value;
            orchestrateSwarm(provider, goal);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateSwarm, spawnRoutingAgents, fetchAgentResponse };
}
