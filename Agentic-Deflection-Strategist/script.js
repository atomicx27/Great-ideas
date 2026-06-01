function buildSystemPrompt() {
    return `You are an Agentic Deflection Strategist AI for Planetary Defense.
Your task is to analyze an incoming asteroid threat and recommend the optimal deflection strategy.
Options include: Kinetic Impactor, Gravity Tractor, Nuclear Ablation, or Ion Beam Shepherd.
Consider the asteroid's composition, size, and time to impact.
Provide a concise analysis, a step-by-step strategy, and a final recommendation.
Format your output in Markdown.`;
}

async function fetchLLMResponse(provider, apiKey, comp, size, time) {
    const systemPrompt = buildSystemPrompt();
    const userMessage = `Asteroid Threat Profile:\n- Composition: ${comp}\n- Diameter: ${size} meters\n- Time to Impact: ${time} Years\n\nPlease formulate a deflection strategy.`;

    // Allow mocking for tests
    if (typeof window !== 'undefined' && window.fetchLLMResponseMock) {
        return window.fetchLLMResponseMock(provider, apiKey, comp, size, time);
    }

    if (provider === 'openai') {
        return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage, { temperature: 0.4 });
    } else if (provider === 'anthropic') {
        return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { max_tokens: 1000 });
    } else if (provider === 'ollama') {
        return await fetchOllama(apiKey, 'llama3', systemPrompt, userMessage);
    }
    throw new Error("Unknown provider");
}

async function handleStrategize() {
    if (typeof document === 'undefined') return;

    const comp = document.getElementById('comp-input').value;
    const size = document.getElementById('size-input').value;
    const time = document.getElementById('time-input').value;
    const provider = document.getElementById('llm-provider').value;
    const apiKey = document.getElementById('api-key').value;
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (!apiKey) {
        alert("Please enter an API Key or Ollama URL.");
        return;
    }

    statusText.textContent = "Status: Agentic loop simulating...";
    statusText.style.color = "#ffcc00";
    resultsDisplay.innerHTML = `<div style="color:#aaa;">[Agentic Loop] Querying ${provider} with threat profile...</div>`;

    try {
        const responseText = await fetchLLMResponse(provider, apiKey, comp, size, time);
        const parsedHTML = DOMPurify.sanitize(marked.parse(responseText));

        resultsDisplay.innerHTML += `
            <div style="margin-top: 15px; border-top: 1px dashed #333; padding-top: 15px;">
                ${parsedHTML}
            </div>
        `;
        statusText.textContent = "Status: Strategy Synthesized";
        statusText.style.color = "#00ccff";
    } catch (err) {
        resultsDisplay.innerHTML += `<div style="color:red; margin-top:10px;">[Error] ${err.message}</div>`;
        statusText.textContent = "Status: Simulation Failed";
        statusText.style.color = "red";
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('strategize-btn').addEventListener('click', handleStrategize);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildSystemPrompt, fetchLLMResponse };
}
