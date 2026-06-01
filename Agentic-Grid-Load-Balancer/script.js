// Simulated Tools for the Agent to use
const gridTools = {
    checkWeatherForecast: async () => {
        return new Promise(resolve => setTimeout(() => {
            resolve({ cloudCover: '80%', windSpeed: '5mph', forecast: 'Imminent storm, solar drop expected' });
        }, 1000));
    },
    queryRealTimePricing: async () => {
        return new Promise(resolve => setTimeout(() => {
            resolve({ currentPrice: '$45/MWh', trend: 'Rising due to peak demand' });
        }, 1000));
    },
    executeGridAction: async (action) => {
        return new Promise(resolve => setTimeout(() => {
            resolve(`Action executed: ${action}`);
        }, 1500));
    }
};

async function fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage) {
    if (typeof fetchOpenAI === 'undefined' && typeof window !== 'undefined') {
        throw new Error('LLM API utilities not loaded.');
    }
    const apiModule = typeof window !== 'undefined' ? window : require('../shared/llm-api.js');

    if (provider === 'openai') {
        return await apiModule.fetchOpenAI(apiKey, model || 'gpt-4o-mini', systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
        return await apiModule.fetchAnthropic(apiKey, model || 'claude-3-haiku-20240307', systemPrompt, userMessage);
    } else if (provider === 'ollama') {
        return await apiModule.fetchOllama('http://localhost:11434', model || 'llama3', systemPrompt, userMessage);
    }
    throw new Error('Invalid provider');
}

async function runGridAgent(provider, apiKey, model, logCallback) {
    try {
        logCallback(`Thinking: Goal is to stabilize grid ahead of evening peak. Gathering weather context...`, 'log-thought');

        logCallback(`Executing Tool: checkWeatherForecast()`, 'log-action');
        const weather = await gridTools.checkWeatherForecast();
        logCallback(`Observation: Forecast shows ${weather.forecast}. Cloud cover at ${weather.cloudCover}, wind at ${weather.windSpeed}.`, 'log-info');

        logCallback(`Thinking: Need to check market pricing before making a decision.`, 'log-thought');

        logCallback(`Executing Tool: queryRealTimePricing()`, 'log-action');
        const pricing = await gridTools.queryRealTimePricing();
        logCallback(`Observation: Market price is ${pricing.currentPrice} and ${pricing.trend}.`, 'log-warning');

        logCallback(`Thinking: Asking LLM for optimal strategy based on context.`, 'log-thought');

        const systemPrompt = `You are an autonomous Agentic AI Grid Load Balancer. Your goal is to ensure grid stability and cost-efficiency.
Analyze the provided weather and pricing data, and return a JSON object with two keys:
1. "action": The exact action to take (e.g., "Discharge Battery Reserves at 50MW capacity")
2. "strategy": A brief explanation of why this action was chosen.
Respond ONLY with raw JSON, no markdown formatting.`;

        const userMessage = `Weather Data: ${JSON.stringify(weather)}\nPricing Data: ${JSON.stringify(pricing)}\nWhat is the optimal action?`;

        let llmResponseText;
        try {
            llmResponseText = await fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage);
        } catch (llmError) {
            logCallback(`LLM API Error: ${llmError.message}. Falling back to default deterministic logic.`, 'log-error');
            llmResponseText = '{"action":"Discharge Battery Reserves at 50MW capacity","strategy":"Preemptively discharged batteries to cover solar deficit, avoiding high market prices."}';
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(llmResponseText.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (parseError) {
             logCallback(`Failed to parse LLM JSON. Falling back.`, 'log-error');
             parsedResponse = { action: "Discharge Battery Reserves at 50MW capacity", strategy: "Fallback strategy deployed." };
        }

        logCallback(`Executing Tool: executeGridAction('${parsedResponse.action}')`, 'log-action');
        const result = await gridTools.executeGridAction(parsedResponse.action);

        logCallback(`Observation: ${result}`, 'log-success');

        return {
            status: "Grid Stabilized",
            strategy: parsedResponse.strategy,
            weatherContext: weather,
            pricingContext: pricing
        };

    } catch (error) {
        logCallback(`CRITICAL ERROR: ${error.message || error}`, 'log-error');
        throw error;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const apiKeyInput = document.getElementById('api-key');
        const modelInput = document.getElementById('model-name');
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const finalResultsContainer = document.getElementById('final-results');

        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyGroup.style.display = 'none';
                modelGroup.style.display = 'block';
            } else {
                apiKeyGroup.style.display = 'block';
                modelGroup.style.display = 'none';
            }
        });

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            // Safe DOM update as we are generating the timestamp and message securely
            p.textContent = `[T+${new Date().getSeconds()}s] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', async () => {
            outputLog.innerHTML = '';
            finalResultsContainer.innerHTML = '';
            finalResultsContainer.classList.add('hidden');
            runBtn.disabled = true;

            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;
            const model = modelInput.value;

            appendLog(`Initiating Agentic Load Balancer via ${provider}...`, 'log-info');

            try {
                const result = await runGridAgent(provider, apiKey, model, appendLog);

                // Assuming DOMPurify is loaded globally via CDN in HTML
                const sanitize = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize : (t) => t;

                finalResultsContainer.innerHTML = `
                    <h3>Agent Debrief</h3>
                    <ul>
                        <li><strong>Status:</strong> ${sanitize(result.status)}</li>
                        <li><strong>Strategy:</strong> ${sanitize(result.strategy)}</li>
                    </ul>
                `;
                finalResultsContainer.classList.remove('hidden');

            } catch (error) {
                appendLog(`Agent run aborted.`, 'log-error');
            } finally {
                runBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runGridAgent, gridTools, fetchLLMResponse };
}