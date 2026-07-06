// AGI Logic
async function orchestrateDarkMatterNetwork(sectors, fetchLLM, apiKey, provider) {
    const orchestratorPrompt = `You are the AGI Swarm Orchestrator. Assign tasks to agents Alpha, Beta, and Gamma to tune these sectors: ${JSON.stringify(sectors)}. Return JSON array mapping {agent, sectorId, instruction}.`;

    try {
        const orchestrationResponse = await fetchLLM(
            provider,
            apiKey,
            'gpt-4o', // Model is placeholder
            'You coordinate agents. Respond only in JSON.',
            orchestratorPrompt
        );

        let assignments = JSON.parse(orchestrationResponse);
        return { success: true, assignments };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// DOM Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const gStatus = document.getElementById('global-status');
        const oLog = document.getElementById('orchestrator-log');

        const mockSectors = [
            { id: 'Sec-1', density: 85 },
            { id: 'Sec-2', density: 42 },
            { id: 'Sec-3', density: 91 }
        ];

        function logMsg(target, msg) {
            const li = document.createElement('li');
            li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            target.appendChild(li);
            target.scrollTop = target.scrollHeight;
        }

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            gStatus.textContent = 'Global Status: Orchestrating Swarm...';
            gStatus.style.color = 'var(--warning-color)';

            const provider = document.getElementById('provider-select').value;
            const key = document.getElementById('api-key').value;

            logMsg(oLog, `Initializing AGI orchestrator via ${provider}...`);

            // Mock LLM fetch for UI demonstration
            const mockFetchLLM = async () => JSON.stringify([
                { agent: 'Alpha', sectorId: 'Sec-1', instruction: 'Stabilize high density flux' },
                { agent: 'Beta', sectorId: 'Sec-2', instruction: 'Monitor medium density variance' },
                { agent: 'Gamma', sectorId: 'Sec-3', instruction: 'Initiate critical containment protocol' }
            ]);


            let fetchToUse = mockFetchLLM;
            if (key && provider === 'openai' && typeof window.fetchOpenAI !== 'undefined') fetchToUse = window.fetchOpenAI;
            else if (key && provider === 'anthropic' && typeof window.fetchAnthropic !== 'undefined') fetchToUse = window.fetchAnthropic;
            else if (provider === 'ollama' && typeof window.fetchOllama !== 'undefined') {
                fetchToUse = (p, model, prompt, msg) => window.fetchOllama('http://localhost:11434', model, prompt, msg);
            }
            const result = await orchestrateDarkMatterNetwork(mockSectors, fetchToUse, key, provider);


            if (result.success) {
                logMsg(oLog, 'Orchestration plan formulated. Dispatching to agents.');

                result.assignments.forEach(task => {
                    const agentCard = document.getElementById(`agent-${task.agent.toLowerCase()}`);
                    if(agentCard) {
                        const statusSpan = agentCard.querySelector('.agent-status');
                        const aLog = agentCard.querySelector('.agent-log');

                        statusSpan.textContent = 'Active';
                        statusSpan.style.color = 'var(--success-color)';
                        logMsg(aLog, `Received task for ${task.sectorId}: ${task.instruction}`);

                        // Simulate agent working
                        setTimeout(() => {
                            logMsg(aLog, `Task completed for ${task.sectorId}.`);
                            statusSpan.textContent = 'Standby';
                            statusSpan.style.color = 'var(--warning-color)';
                        }, 2000 + Math.random() * 2000);
                    }
                });

                setTimeout(() => {
                    gStatus.textContent = 'Global Status: Sector Containment Complete';
                    gStatus.style.color = 'var(--success-color)';
                    btn.disabled = false;
                }, 4500);

            } else {
                logMsg(oLog, `Error: ${result.error}`);
                gStatus.textContent = 'Global Status: Error';
                gStatus.style.color = 'var(--danger-color)';
                btn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateDarkMatterNetwork };
}
