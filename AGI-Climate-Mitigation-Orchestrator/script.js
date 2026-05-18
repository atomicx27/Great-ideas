// Simulated Sub-Agent Tasks
const agentTasks = {
    weather: async (crisis, config, updateUi) => {
        updateUi('running', 'Simulating atmospheric models...');
        await new Promise(r => setTimeout(r, 1400));
        updateUi('running', 'Projecting rainfall deficits...');

        let output = "- Projected 40% reduction in average rainfall.\n- High probability of sustained heatwaves extending into October.\n- Elevated risk of severe soil degradation.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Climate Modeler Agent, briefly outline the meteorological impact of: ${crisis}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    },
    agri: async (crisis, config, updateUi) => {
        updateUi('running', 'Analyzing crop yield vulnerabilities...');
        await new Promise(r => setTimeout(r, 1100));
        updateUi('running', 'Simulating supply chain disruptions...');

        let output = "- Projected 30% drop in wheat and olive yields.\n- Recommended immediate shift to drought-resistant seed varieties.\n- Identified alternative supply chains in Northern regions.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Agri-Economics Agent, briefly outline the agricultural and economic impact of: ${crisis}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    },
    policy: async (crisis, config, updateUi) => {
        updateUi('running', 'Evaluating regional relief budgets...');
        await new Promise(r => setTimeout(r, 1600));
        updateUi('running', 'Drafting emergency water rationing frameworks...');

        let output = "- Proposed tiered water restriction laws for agriculture.\n- Outlined $500M emergency relief fund allocation.\n- Recommended cross-border resource sharing agreements.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Policy & Relief Agent, briefly outline a mitigation policy strategy for: ${crisis}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    }
};

async function executeClimateOrchestrator(crisis, llmConfig, uiCallbacks) {
    uiCallbacks.masterUpdate("Initializing Climate Mitigation Swarm...\n");

    // Execute sub-agents in parallel
    const agentPromises = [
        agentTasks.weather(crisis, llmConfig, uiCallbacks.weather),
        agentTasks.agri(crisis, llmConfig, uiCallbacks.agri),
        agentTasks.policy(crisis, llmConfig, uiCallbacks.policy)
    ];

    const results = await Promise.all(agentPromises);

    uiCallbacks.masterUpdate("Sub-agents complete. Synthesizing Master Strategy...\n\n");

    let finalStrategy = `[GLOBAL MITIGATION STRATEGY]\n\n`;
    finalStrategy += `1. CLIMATOLOGY FORECAST:\n${results[0]}\n\n`;
    finalStrategy += `2. AGRI-ECONOMIC IMPACT:\n${results[1]}\n\n`;
    finalStrategy += `3. POLICY INTERVENTION:\n${results[2]}\n\n`;
    finalStrategy += `ACTION PLAN: Initiate emergency water rationing frameworks immediately while distributing drought-resistant seed subsidies to affected regions.`;

    if (typeof fetchLLMResponse !== 'undefined') {
        try {
            const prompt = `Synthesize an executive summary based on these agent reports for the crisis: "${crisis}". Reports: ${JSON.stringify(results)}`;
            const res = await fetchLLMResponse(prompt, llmConfig);
            if (res) finalStrategy = res;
        } catch(e) {}
    }

    uiCallbacks.masterUpdate(finalStrategy);
    return finalStrategy;
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const executeBtn = document.getElementById('execute-btn');
        const crisisInput = document.getElementById('crisis-input');
        const masterOutput = document.querySelector('#master-output .content');

        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');

        const createAgentCallback = (nodeId) => {
            const statusEl = document.querySelector(`#${nodeId} .status`);
            const outputEl = document.querySelector(`#${nodeId} .output`);

            return (status, text) => {
                statusEl.className = `status ${status}`;
                statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                outputEl.textContent = text;
            };
        };

        const callbacks = {
            weather: createAgentCallback('node-weather'),
            agri: createAgentCallback('node-agri'),
            policy: createAgentCallback('node-policy'),
            masterUpdate: (text) => { masterOutput.textContent = text; }
        };

        executeBtn.addEventListener('click', async () => {
            const crisis = crisisInput.value;
            const llmConfig = {
                provider: providerSelect.value,
                apiKey: apiKeyInput.value
            };

            executeBtn.disabled = true;

            // Reset UI
            ['node-weather', 'node-agri', 'node-policy'].forEach(id => {
                document.querySelector(`#${id} .status`).className = 'status idle';
                document.querySelector(`#${id} .status`).textContent = 'Idle';
                document.querySelector(`#${id} .output`).textContent = '';
            });

            await executeClimateOrchestrator(crisis, llmConfig, callbacks);

            executeBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { executeClimateOrchestrator, agentTasks };
}