async function evaluateStructuralIntegrity(sensorData, provider, apiKey) {
    const systemPrompt = `You are an Agentic Construction Site Inspector. Analyze the structural sensor telemetry data.
Determine if the structure is safe or if there are integrity issues. Output a concise report flagging any critical anomalies.`;

    const userMessage = `Sensor Telemetry: ${sensorData}`;

    try {
        let response = "";

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
             response = "Mocked Report: Tilt of 1.5 degrees detected. Flagging column B for immediate manual inspection.";
        }

        return response;
    } catch (error) {
        throw new Error(`Inspection failed: ${error.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const inspectBtn = document.getElementById('inspect-btn');
        const sensorDataInput = document.getElementById('sensor-data');
        const providerSelect = document.getElementById('provider');
        const apiKeyInput = document.getElementById('api-key');

        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const inspectionReportEl = document.getElementById('inspection-report');

        inspectBtn.addEventListener('click', async () => {
            const data = sensorDataInput.value;
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key.");
                return;
            }

            inspectBtn.disabled = true;
            statusText.innerText = "Status: Inspecting structure...";
            resultsPanel.classList.add('hidden');

            try {
                const report = await evaluateStructuralIntegrity(data, provider, apiKey);

                inspectionReportEl.innerText = report;
                statusText.innerText = "Status: Inspection Complete";
                resultsPanel.classList.remove('hidden');
            } catch (err) {
                statusText.innerText = `Error: ${err.message}`;
            } finally {
                inspectBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { evaluateStructuralIntegrity };
}