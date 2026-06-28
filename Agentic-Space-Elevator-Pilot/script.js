async function pilotElevatorAgent(provider, apiKey, tension, windSpeed, fetchFunc) {
    const systemPrompt = `You are an autonomous Agentic Space Elevator Pilot.
Your goal is to adjust the elevator's speed (reduce, maintain, or stop) based on sensor data to ensure safe operation.
Return ONLY a valid JSON object matching this schema:
{
  "action": "reduce_speed" | "maintain_speed" | "emergency_stop",
  "reasoning": "brief explanation"
}`;
    const userMessage = `Current Sensors - Tension: ${tension} kN, Wind Speed: ${windSpeed} km/h`;

    let response;
    if (provider === 'openai') {
        response = await fetchFunc.fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
        response = await fetchFunc.fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', systemPrompt, userMessage);
    } else {
        response = await fetchFunc.fetchOllama('http://localhost:11434', 'llama3', systemPrompt, userMessage);
    }

    // Try to parse JSON from response
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse JSON');
    } catch (e) {
        return { action: 'emergency_stop', reasoning: `Fallback due to error: ${e.message}` };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-pilot-btn');
        const logOutput = document.getElementById('pilot-log');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const tensionInput = document.getElementById('tension-input');
        const windInput = document.getElementById('wind-input');

        if (runBtn) {
            runBtn.addEventListener('click', async () => {
                const provider = providerSelect.value;
                const apiKey = apiKeyInput.value;
                const tension = parseFloat(tensionInput.value);
                const wind = parseFloat(windInput.value);

                if (isNaN(tension) || isNaN(wind)) {
                    logOutput.innerText = 'Error: Invalid sensor inputs.';
                    return;
                }

                if ((provider === 'openai' || provider === 'anthropic') && !apiKey) {
                    logOutput.innerText = 'Error: API Key required for ' + provider;
                    return;
                }

                logOutput.innerText = 'Agent Pilot initializing...\nAnalyzing telemetry...';

                try {
                    const result = await pilotElevatorAgent(provider, apiKey, tension, wind, window);
                    logOutput.innerText += `\n\nDecision: ${result.action}\nReasoning: ${result.reasoning}`;
                } catch (error) {
                    logOutput.innerText += `\n\nError: ${error.message}`;
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pilotElevatorAgent };
}
