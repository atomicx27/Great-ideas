async function orchestrateSurgicalProcedure(patientVitals, surgicalStep, provider, apiKey) {
    const systemPrompt = `You are the AGI Master Surgical Orchestrator.
You must coordinate multiple sub-systems (Robotic Arms, Anesthesiology, Vitals Monitoring).
Based on the patient's vitals and current surgical step, provide specific directives for each sub-system to execute simultaneously.`;

    const userMessage = `Vitals: ${patientVitals}\nCurrent Step: ${surgicalStep}`;

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
             response = "Mocked Directives:\n- Robotic Arms: Proceed with incision.\n- Anesthesiology: Maintain current drip.\n- Vitals: Monitor HR closely.";
        }

        return response;
    } catch (error) {
        throw new Error(`Orchestration failed: ${error.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchestrateBtn = document.getElementById('orchestrate-btn');
        const vitalsInput = document.getElementById('patient-vitals');
        const stepInput = document.getElementById('surgical-step');
        const providerSelect = document.getElementById('provider');
        const apiKeyInput = document.getElementById('api-key');

        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const orchestratorPlanEl = document.getElementById('orchestrator-plan');

        orchestrateBtn.addEventListener('click', async () => {
            const vitals = vitalsInput.value;
            const step = stepInput.value;
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key.");
                return;
            }

            orchestrateBtn.disabled = true;
            statusText.innerText = "Status: Orchestrating swarm...";
            resultsPanel.classList.add('hidden');

            try {
                const plan = await orchestrateSurgicalProcedure(vitals, step, provider, apiKey);

                orchestratorPlanEl.innerText = plan;
                statusText.innerText = "Status: Coordination Directives Issued";
                resultsPanel.classList.remove('hidden');
            } catch (err) {
                statusText.innerText = `Error: ${err.message}`;
            } finally {
                orchestrateBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { orchestrateSurgicalProcedure };
}