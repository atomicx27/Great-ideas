async function decideNextWaypoint(sensorData, provider, options) {
    const systemPrompt = `You are the autonomous navigation agent of a Martian Rover.
Analyze the provided sensor data.
You must decide the safest and most scientifically valuable next action.
Output a JSON object containing:
- 'analysis': Your reasoning based on the sensor data.
- 'decision': Your final action command (e.g., 'Turn right 45 degrees and proceed 15m').
- 'scientificValue': A rating of the target from 1 to 10.`;

    const userMessage = `Sensor Feed: ${sensorData}`;

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
        const exploreBtn = document.getElementById('explore-btn');
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

        exploreBtn.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = document.getElementById('api-key').value;
            const model = document.getElementById('model-name').value;
            const sensorData = document.getElementById('sensor-data-input').value;

            if (provider !== 'ollama' && !apiKey) {
                appendLog('Error: API Key is required.', 'log-error');
                return;
            }

            outputLog.innerHTML = '';
            exploreBtn.disabled = true;

            appendLog(`Initializing Autonomous Nav Agent. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Processing Sensor Feed: "${sensorData}"`, 'log-info');
            appendLog(`Thinking: Analyzing obstacles and scientific targets...`, 'log-thought');

            try {
                const result = await decideNextWaypoint(sensorData, provider, { apiKey, model, temperature: 0.4 });

                appendLog(`Analysis: ${result.analysis}`, 'log-thought');
                appendLog(`Observation: High-value target identified (Value: ${result.scientificValue}/10).`, 'log-success');
                appendLog(`Action Commanded: ${result.decision}`, 'log-action');
                appendLog(`Thinking: Translating command to motor controllers. Executing movement.`, 'log-thought');
                appendLog(`Routine Complete. Awaiting next sensor update.`, 'log-success');

            } catch (error) {
                appendLog(`Navigation Error: ${error.message}`, 'log-error');
            } finally {
                exploreBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { decideNextWaypoint };
}
