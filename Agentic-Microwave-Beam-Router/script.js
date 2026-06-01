function buildSystemPrompt() {
    return `You are an Agentic Microwave Beam Router for an Orbital Power Megastructure.
Your task is to analyze real-time weather data and requested power load, and determine the optimal microwave frequency (e.g., 2.45 GHz or 5.8 GHz) and focal width to transmit power to the surface rectenna.
Consider atmospheric scattering and civilian safety margins.
Provide a concise analysis and a step-by-step routing adjustment.
Format your output in Markdown.`;
}

async function fetchLLMResponse(provider, apiKey, weather, power) {
    const systemPrompt = buildSystemPrompt();
    const userMessage = `Telemetry:\n- Weather: ${weather}\n- Target Load: ${power} GW\n\nPlease formulate the beam routing configuration.`;

    // Mocking for tests
    if (typeof window !== 'undefined' && window.fetchLLMResponseMock) {
        return window.fetchLLMResponseMock(provider, apiKey, weather, power);
    }

    if (provider === 'openai') {
        return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage, { temperature: 0.3 });
    } else if (provider === 'anthropic') {
        return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { max_tokens: 1000 });
    } else if (provider === 'ollama') {
        return await fetchOllama(apiKey, 'llama3', systemPrompt, userMessage);
    }
    throw new Error("Unknown provider");
}

async function handleRoute() {
    if (typeof document === 'undefined') return;

    const weather = document.getElementById('weather-input').value;
    const power = document.getElementById('power-input').value;
    const provider = document.getElementById('llm-provider').value;
    const apiKey = document.getElementById('api-key').value;
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (!apiKey) {
        alert("Please enter an API Key or Ollama URL.");
        return;
    }

    statusText.textContent = "Status: Agentic loop simulating...";
    statusText.style.color = "#ffaa00";
    resultsDisplay.innerHTML = `<div style="color:#aaa;">[Agentic Loop] Querying ${provider} with telemetry...</div>`;

    try {
        const responseText = await fetchLLMResponse(provider, apiKey, weather, power);
        const parsedHTML = DOMPurify.sanitize(marked.parse(responseText));

        resultsDisplay.innerHTML += `
            <div style="margin-top: 15px; border-top: 1px dashed #333; padding-top: 15px;">
                ${parsedHTML}
            </div>
        `;
        statusText.textContent = "Status: Beam Routing Locked";
        statusText.style.color = "#cc66ff";
    } catch (err) {
        resultsDisplay.innerHTML += `<div style="color:red; margin-top:10px;">[Error] ${err.message}</div>`;
        statusText.textContent = "Status: Simulation Failed";
        statusText.style.color = "red";
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('route-btn').addEventListener('click', handleRoute);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildSystemPrompt, fetchLLMResponse };
}
