let isBalancing = false;

// Attempt to use shared fetchers if in browser, otherwise mock for tests
let internalFetchOllama, internalFetchOpenAI, internalFetchAnthropic;
if (typeof window !== 'undefined' && window.fetchOllama) {
    internalFetchOllama = window.fetchOllama;
    internalFetchOpenAI = window.fetchOpenAI;
    internalFetchAnthropic = window.fetchAnthropic;
} else {
    // Mock for Node.js tests
    internalFetchOllama = async () => 'Mocked balancing strategy (Ollama)';
    internalFetchOpenAI = async () => 'Mocked balancing strategy (OpenAI)';
    internalFetchAnthropic = async () => 'Mocked balancing strategy (Anthropic)';
}

async function fetchLLMResponse(provider, weatherData) {
    const systemPrompt = "You are an autonomous space elevator balancer agent. Analyze the atmospheric data and provide a strategy to adjust crawler speeds to maintain tether tension.";
    const userMessage = `Atmospheric Data: ${weatherData}`;

    log(`Consulting balancer agent via ${provider}...`);
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

async function balanceTetherTension(provider, weatherData) {
    if (isBalancing) return null;
    isBalancing = true;
    updateOutput("Agent is computing structural adjustments...");
    log("Started balancing evaluation.");

    const response = await fetchLLMResponse(provider, weatherData);

    updateOutput(response);
    log("Balancing adjustments applied.");
    isBalancing = false;
    return response;
}

function updateOutput(text) {
    const el = document.getElementById('agent-output');
    if (el) el.textContent = text;
}

function log(message) {
    const logEl = document.getElementById('log');
    if (logEl) {
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logEl.prepend(p);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('balance-btn').addEventListener('click', () => {
            const provider = document.getElementById('provider').value;
            const weatherData = document.getElementById('weather-data').value;
            balanceTetherTension(provider, weatherData);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { balanceTetherTension, fetchLLMResponse };
}
