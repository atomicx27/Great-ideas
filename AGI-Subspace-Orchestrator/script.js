// AGI Logic
async function orchestrateSubspaceGrid(nodes, fetchLLM, apiKey, provider) {
    const orchestratorPrompt = `You are the AGI Swarm Orchestrator. Assign routing tasks to agents Node-1, Node-2, and Node-3 based on these grid metrics: ${JSON.stringify(nodes)}. Return JSON array mapping {agent, targetNode, instruction}.`;

    try {
        const orchestrationResponse = await fetchLLM(
            provider,
            apiKey,
            'gpt-4o',
            'You coordinate network agents. Respond only in JSON.',
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

        const mockGrid = [
            { id: 'Node-1', congestion: 95, health: 'Critical' },
            { id: 'Node-2', congestion: 30, health: 'Optimal' },
            { id: 'Node-3', congestion: 80, health: 'Degraded' }
        ];

        function logMsg(target, msg) {
            const li = document.createElement('li');
            li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            target.appendChild(li);
            target.scrollTop = target.scrollHeight;
        }

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            gStatus.textContent = 'Grid Status: Reconfiguring Grid...';
            gStatus.style.color = 'var(--warning-color)';

            const provider = document.getElementById('provider-select').value;
            const key = document.getElementById('api-key').value;

            logMsg(oLog, `Initializing AGI grid orchestrator via ${provider}...`);

            const mockFetchLLM = async () => JSON.stringify([
                { agent: 'Node-1', targetNode: 'Node-1', instruction: 'Reroute traffic to relieve critical congestion' },
                { agent: 'Node-2', targetNode: 'Node-2', instruction: 'Absorb overflow traffic from Node-1' },
                { agent: 'Node-3', targetNode: 'Node-3', instruction: 'Perform diagnostic and packet recovery' }
            ]);


            let fetchToUse = mockFetchLLM;
            if (key && provider === 'openai' && typeof window.fetchOpenAI !== 'undefined') fetchToUse = window.fetchOpenAI;
            else if (key && provider === 'anthropic' && typeof window.fetchAnthropic !== 'undefined') fetchToUse = window.fetchAnthropic;
            else if (provider === 'ollama' && typeof window.fetchOllama !== 'undefined') {
                fetchToUse = (p, model, prompt, msg) => window.fetchOllama('http://localhost:11434', model, prompt, msg);
            }
            const result = await orchestrateSubspaceGrid(mockGrid, fetchToUse, key, provider);


            if (result.success) {
                logMsg(oLog, 'Swarm deployed. Agents initiating quadrant adjustments.');

                result.assignments.forEach(task => {
                    const agentId = `agent-${task.agent.toLowerCase()}`;
                    const agentCard = document.getElementById(agentId);
                    if(agentCard) {
                        const statusSpan = agentCard.querySelector('.agent-status');
                        const aLog = agentCard.querySelector('.agent-log');

                        statusSpan.textContent = 'Active';
                        statusSpan.style.color = 'var(--success-color)';
                        logMsg(aLog, `Assigned to ${task.targetNode}: ${task.instruction}`);

                        setTimeout(() => {
                            logMsg(aLog, `Routing adjustment complete for ${task.targetNode}.`);
                            statusSpan.textContent = 'Standby';
                            statusSpan.style.color = 'var(--warning-color)';
                        }, 2000 + Math.random() * 2000);
                    }
                });

                setTimeout(() => {
                    gStatus.textContent = 'Grid Status: Optimal Routing Established';
                    gStatus.style.color = 'var(--success-color)';
                    btn.disabled = false;
                }, 4500);

            } else {
                logMsg(oLog, `Error: ${result.error}`);
                gStatus.textContent = 'Grid Status: Error';
                gStatus.style.color = 'var(--danger-color)';
                btn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateSubspaceGrid };
}
