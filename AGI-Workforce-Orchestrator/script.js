// Simulated Sub-Agent Tasks
const agentTasks = {
    recruitment: async (goal, config, updateUi) => {
        updateUi('running', 'Analyzing talent pools in target regions...');
        await new Promise(r => setTimeout(r, 1200));
        updateUi('running', 'Drafting localized job descriptions...');

        let output = "- Identified key tech hubs in target regions.\n- Drafted 5 distinct role profiles.\n- Recommended $2M budget allocation for sourcing.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Recruitment Agent, briefly outline a sourcing strategy for: ${goal}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    },
    onboarding: async (goal, config, updateUi) => {
        updateUi('running', 'Designing 30-60-90 day plans...');
        await new Promise(r => setTimeout(r, 1500));
        updateUi('running', 'Allocating hardware logistics...');

        let output = "- Scaled IT provisioning pipeline by 3x.\n- Standardized technical onboarding curriculum.\n- Assigned buddy system pairs.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Onboarding Agent, briefly outline an integration plan for: ${goal}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    },
    culture: async (goal, config, updateUi) => {
        updateUi('running', 'Evaluating cultural integration risks...');
        await new Promise(r => setTimeout(r, 1000));
        updateUi('running', 'Planning cross-regional events...');

        let output = "- Flagged timezone communication bottlenecks.\n- Proposed asynchronous work policy update.\n- Scheduled virtual offsites.";

        if (typeof fetchLLMResponse !== 'undefined') {
            try {
                const prompt = `As the Culture Agent, briefly outline a retention strategy for: ${goal}`;
                const res = await fetchLLMResponse(prompt, config);
                if (res) output = res;
            } catch(e) {}
        }

        updateUi('done', output);
        return output;
    }
};

async function executeMasterOrchestrator(goal, llmConfig, uiCallbacks) {
    uiCallbacks.masterUpdate("Orchestrating swarm...\n");

    // Execute sub-agents in parallel
    const agentPromises = [
        agentTasks.recruitment(goal, llmConfig, uiCallbacks.recruitment),
        agentTasks.onboarding(goal, llmConfig, uiCallbacks.onboarding),
        agentTasks.culture(goal, llmConfig, uiCallbacks.culture)
    ];

    const results = await Promise.all(agentPromises);

    uiCallbacks.masterUpdate("Sub-agents complete. Synthesizing Master Strategy...\n\n");

    let finalStrategy = `[MASTER SYNTHESIS FOR: ${goal}]\n\n`;
    finalStrategy += `1. RECRUITMENT PHASE:\n${results[0]}\n\n`;
    finalStrategy += `2. ONBOARDING PHASE:\n${results[1]}\n\n`;
    finalStrategy += `3. CULTURE & RETENTION:\n${results[2]}\n\n`;
    finalStrategy += `RECOMMENDATION: Proceed with execution. Core risks mitigated across all domains.`;

    if (typeof fetchLLMResponse !== 'undefined') {
        try {
            const prompt = `Synthesize an executive summary based on these agent reports for the goal: ${goal}. Reports: ${JSON.stringify(results)}`;
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
        const goalInput = document.getElementById('goal-input');
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
            recruitment: createAgentCallback('node-recruitment'),
            onboarding: createAgentCallback('node-onboarding'),
            culture: createAgentCallback('node-culture'),
            masterUpdate: (text) => { masterOutput.textContent = text; }
        };

        executeBtn.addEventListener('click', async () => {
            const goal = goalInput.value;
            const llmConfig = {
                provider: providerSelect.value,
                apiKey: apiKeyInput.value
            };

            executeBtn.disabled = true;

            // Reset UI
            ['node-recruitment', 'node-onboarding', 'node-culture'].forEach(id => {
                document.querySelector(`#${id} .status`).className = 'status idle';
                document.querySelector(`#${id} .status`).textContent = 'Idle';
                document.querySelector(`#${id} .output`).textContent = '';
            });

            await executeMasterOrchestrator(goal, llmConfig, callbacks);

            executeBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { executeMasterOrchestrator, agentTasks };
}