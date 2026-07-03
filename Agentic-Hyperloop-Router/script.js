let isRouting = false;

// Attempt to use shared fetchers if in browser, otherwise mock for tests
let internalFetchOllama, internalFetchOpenAI, internalFetchAnthropic;
if (typeof window !== 'undefined' && window.fetchOllama) {
    internalFetchOllama = window.fetchOllama;
    internalFetchOpenAI = window.fetchOpenAI;
    internalFetchAnthropic = window.fetchAnthropic;
} else {
    // Mock for Node.js tests
    internalFetchOllama = async () => 'Mocked routing plan (Ollama)';
    internalFetchOpenAI = async () => 'Mocked routing plan (OpenAI)';
    internalFetchAnthropic = async () => 'Mocked routing plan (Anthropic)';
}

async function fetchLLMResponse(provider, destination) {
    const systemPrompt = "You are an autonomous hyperloop routing agent. Analyze the destination and provide a secure, optimal route considering simulated pressure tube traffic and maintenance.";
    const userMessage = `Destination: ${destination}`;

    log(`Calling LLM API via ${provider}...`);
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

async function routePodAgentically(provider, destination) {
    if (isRouting) return null;
    isRouting = true;
    updateOutput("Agent is analyzing routes...");
    log("Started routing evaluation.");

    const response = await fetchLLMResponse(provider, destination);

    updateOutput(response);
    log("Routing complete.");
    isRouting = false;
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
        document.getElementById('route-btn').addEventListener('click', () => {
            const provider = document.getElementById('provider').value;
            const destination = document.getElementById('destination').value;
            routePodAgentically(provider, destination);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { routePodAgentically, fetchLLMResponse };
}
