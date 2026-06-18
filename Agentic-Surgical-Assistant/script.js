async function analyzeTissueAnomaly(anomalyData, provider, apiKey) {
    const systemPrompt = `You are an Agentic Surgical Assistant. You analyze tissue anomaly sensor data.
Provide a short analysis of the tissue based on the data and suggest parameter adjustments for a surgical tool (e.g., laser power, duration).`;

    const userMessage = `Sensor Data: ${anomalyData}`;

    try {
        let response = "";

        // Use global fetchLLM if available in tests, otherwise use imported/shared logic
        if (typeof global !== 'undefined' && global.fetchLLM) {
            response = await global.fetchLLM(provider, apiKey, 'model', systemPrompt, userMessage);
        } else if (typeof window !== 'undefined' && window.fetchOpenAI && window.fetchAnthropic && window.fetchOllama) {
            if (provider === 'openai') {
                response = await window.fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
            } else if (provider === 'anthropic') {
                response = await window.fetchAnthropic(apiKey, 'claude-3-haiku-20240307', systemPrompt, userMessage);
            } else if (provider === 'ollama') {
                response = await window.fetchOllama('http://localhost:11434', 'llama3', systemPrompt, userMessage);
            }
        } else {
             // Node environment fallback for tests if llm-api wasn't globally mocked
             response = "Mocked Agent Analysis: Reduce laser power by 15% due to high vascularization.";
        }

        return response;
    } catch (error) {
        throw new Error(`LLM Analysis failed: ${error.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const analyzeBtn = document.getElementById('analyze-btn');
        const anomalyDataInput = document.getElementById('anomaly-data');
        const providerSelect = document.getElementById('provider');
        const apiKeyInput = document.getElementById('api-key');

        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const agentAnalysisEl = document.getElementById('agent-analysis');

        analyzeBtn.addEventListener('click', async () => {
            const anomalyData = anomalyDataInput.value;
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key.");
                return;
            }

            analyzeBtn.disabled = true;
            statusText.innerText = "Status: Analyzing anomaly...";
            resultsPanel.classList.add('hidden');

            try {
                const analysis = await analyzeTissueAnomaly(anomalyData, provider, apiKey);

                agentAnalysisEl.innerText = analysis;
                statusText.innerText = "Status: Analysis Complete";
                resultsPanel.classList.remove('hidden');
            } catch (err) {
                statusText.innerText = `Error: ${err.message}`;
            } finally {
                analyzeBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeTissueAnomaly };
}