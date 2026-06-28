async function assistSurgeryAgent(provider, apiKey, heartRate, bloodPressure, fetchFunc) {
    const systemPrompt = `You are an Agentic Surgical Assistant Robot.
Analyze the patient's vitals and provide a recommendation.
Return ONLY valid JSON matching this schema:
{
  "status": "critical" | "stable",
  "recommendation": "detailed medical recommendation"
}`;
    const userMessage = `Vitals - HR: ${heartRate} bpm, BP: ${bloodPressure}`;

    let response;
    if (provider === 'openai') {
        response = await fetchFunc.fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
        response = await fetchFunc.fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', systemPrompt, userMessage);
    } else {
        response = await fetchFunc.fetchOllama('http://localhost:11434', 'llama3', systemPrompt, userMessage);
    }

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        throw new Error('Failed to parse agent response.');
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('assist-btn');
        const logOutput = document.getElementById('assist-log');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const hrInput = document.getElementById('hr-input');
        const bpInput = document.getElementById('bp-input');

        if (btn) {
            btn.addEventListener('click', async () => {
                const provider = providerSelect.value;
                const apiKey = apiKeyInput.value;
                const hr = hrInput.value;
                const bp = bpInput.value;

                if ((provider === 'openai' || provider === 'anthropic') && !apiKey) {
                    logOutput.innerText = 'Error: API Key required.';
                    return;
                }

                logOutput.innerText = 'Analyzing vitals...';

                try {
                    const result = await assistSurgeryAgent(provider, apiKey, hr, bp, window);
                    logOutput.innerText = `Status: ${result.status.toUpperCase()}\nRecommendation: ${result.recommendation}`;
                } catch (error) {
                    logOutput.innerText = `Error: ${error.message}`;
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { assistSurgeryAgent };
}
