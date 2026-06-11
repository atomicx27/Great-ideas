async function troubleshootPanelFailure(errorCode, provider, options) {
    const systemPrompt = `You are an Agentic Dyson Swarm Engineer.
You act autonomously to diagnose and resolve issues with orbital mirror arrays.
You are given an error code or telemetry data.
You must analyze it, formulate a repair strategy, and output a JSON object containing:
- 'diagnosis': Your analysis of the problem.
- 'actionPlan': A step-by-step repair plan.
- 'estimatedDowntime': The estimated time the panel will be offline (e.g., '2 hours').`;

    const userMessage = `Analyze and troubleshoot the following error: ${errorCode}`;

    let responseText = "";
    if (provider === 'openai') {
        responseText = await fetchOpenAI(options.apiKey, options.model || 'gpt-3.5-turbo', systemPrompt, userMessage, options);
    } else if (provider === 'anthropic') {
        responseText = await fetchAnthropic(options.apiKey, options.model || 'claude-3-haiku-20240307', systemPrompt, userMessage, options);
    } else if (provider === 'ollama') {
        responseText = await fetchOllama('http://localhost:11434', options.model || 'llama3', systemPrompt, userMessage, options);
    } else {
        throw new Error("Invalid provider");
    }

    try {
        // Simple extraction for testing/mocking resilience
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        return JSON.parse(jsonStr);
    } catch (e) {
        throw new Error(`Failed to parse agent response: ${responseText}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const troubleshootBtn = document.getElementById('troubleshoot-btn');
        const outputLog = document.getElementById('output-log');

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
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        troubleshootBtn.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = document.getElementById('api-key').value;
            const model = document.getElementById('model-name').value;
            const errorCode = document.getElementById('error-code-input').value;

            if (provider !== 'ollama' && !apiKey) {
                appendLog('Error: API Key is required.', 'log-error');
                return;
            }

            outputLog.innerHTML = '';
            troubleshootBtn.disabled = true;

            appendLog(`Initializing Agentic Engineer. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Targeting Issue: ${errorCode}`, 'log-info');
            appendLog(`Thinking: I need to analyze the telemetry and formulate a repair strategy.`, 'log-thought');
            appendLog(`Executing API Request to LLM...`, 'log-action');

            try {
                const result = await troubleshootPanelFailure(errorCode, provider, { apiKey, model, temperature: 0.5 });

                appendLog(`Observation: Diagnosis received.`, 'log-success');
                appendLog(`Diagnosis: ${result.diagnosis}`, 'log-info');
                appendLog(`Action Plan: ${result.actionPlan}`, 'log-info');
                appendLog(`Est. Downtime: ${result.estimatedDowntime}`, 'log-info');
                appendLog(`Thinking: The repair strategy is sound. Commencing automated deployment of maintenance drones.`, 'log-thought');
                appendLog(`Action: Deployed drones to segment. Task complete.`, 'log-success');

            } catch (error) {
                appendLog(`Agent Error: ${error.message}`, 'log-error');
            } finally {
                troubleshootBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { troubleshootPanelFailure };
}
