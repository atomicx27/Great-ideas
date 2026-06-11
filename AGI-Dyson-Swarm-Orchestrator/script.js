async function orchestrateSwarmTopology(goal, provider, options) {
    const systemPrompt = `You are the Master AGI Orchestrator for a Dyson Swarm project.
You must analyze the following high-level goal and break it down into specialized sub-tasks for parallel AI agents.
Output a JSON array where each object represents a task for a sub-agent.
Each task object must have:
- 'agentRole': The role of the sub-agent (e.g., 'Thermal Analyst', 'Structural Engineer').
- 'taskDescription': What the agent needs to do.
- 'expectedOutput': What the agent should deliver.`;

    const userMessage = `Break down this goal: ${goal}`;

    let responseText = "";
    if (provider === 'openai') {
        responseText = await fetchOpenAI(options.apiKey, options.model || 'gpt-4-turbo', systemPrompt, userMessage, options);
    } else if (provider === 'anthropic') {
        responseText = await fetchAnthropic(options.apiKey, options.model || 'claude-3-opus-20240229', systemPrompt, userMessage, options);
    } else if (provider === 'ollama') {
        responseText = await fetchOllama('http://localhost:11434', options.model || 'llama3', systemPrompt, userMessage, options);
    } else {
        throw new Error("Invalid provider");
    }

    try {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        return JSON.parse(jsonStr);
    } catch (e) {
        throw new Error(`Failed to parse Orchestrator response: ${responseText}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const orchestrateBtn = document.getElementById('orchestrate-btn');
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

        orchestrateBtn.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = document.getElementById('api-key').value;
            const model = document.getElementById('model-name').value;
            const goal = document.getElementById('goal-input').value;

            if (provider !== 'ollama' && !apiKey) {
                appendLog('Error: API Key is required.', 'log-error');
                return;
            }

            outputLog.innerHTML = '';
            orchestrateBtn.disabled = true;

            appendLog(`Initializing Master AGI Orchestrator. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Target Goal: "${goal}"`, 'log-info');
            appendLog(`Thinking: I must decompose this complex goal into discrete tasks for my sub-agents.`, 'log-thought');
            appendLog(`Action: Consulting LLM to generate swarm architecture...`, 'log-action');

            try {
                const subTasks = await orchestrateSwarmTopology(goal, provider, { apiKey, model, temperature: 0.7 });

                appendLog(`Observation: Task decomposition successful. Generated ${subTasks.length} parallel tasks.`, 'log-success');

                // Simulate parallel execution visually
                await Promise.all(subTasks.map(async (task, index) => {
                    // Stagger the start slightly for visual effect
                    await new Promise(r => setTimeout(r, index * 800));
                    appendLog(`Spawning Agent: ${task.agentRole}...`, 'log-action');
                    appendLog(`Task: ${task.taskDescription}`, 'log-subagent');

                    // Simulate processing time
                    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
                    appendLog(`[${task.agentRole}] Delivery: ${task.expectedOutput}`, 'log-subagent');
                    appendLog(`[${task.agentRole}] Completed.`, 'log-success');
                }));

                appendLog(`Thinking: All sub-agent reports received. Synthesizing final optimal topology.`, 'log-thought');
                setTimeout(() => {
                    appendLog(`Action: New deployment vectors transmitted to orbital construction hubs.`, 'log-success');
                    appendLog(`Orchestration Complete.`, 'log-success');
                    orchestrateBtn.disabled = false;
                }, 1500);

            } catch (error) {
                appendLog(`Orchestration Error: ${error.message}`, 'log-error');
                orchestrateBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateSwarmTopology };
}
