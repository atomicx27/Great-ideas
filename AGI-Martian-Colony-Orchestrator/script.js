async function orchestrateColonyExpansion(population, resources, provider, options) {
    const systemPrompt = `You are the Master AGI Orchestrator for the Martian Colony expansion project.
You must analyze the population growth target and resource constraints.
Break down the expansion into distinct sub-tasks for specialized AI agents.
Output a JSON array where each object represents a task for a sub-agent.
Each task object must have:
- 'agentRole': The role of the sub-agent (e.g., 'Life Support Engineer', 'Habitat Architect').
- 'taskDescription': What the agent needs to do.
- 'expectedOutput': What the agent should deliver.`;

    const userMessage = `Target Population Increase: +${population}\nResource Constraints: ${resources}`;

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
            const pop = document.getElementById('pop-input').value;
            const res = document.getElementById('res-input').value;

            if (provider !== 'ollama' && !apiKey) {
                appendLog('Error: API Key is required.', 'log-error');
                return;
            }

            outputLog.innerHTML = '';
            orchestrateBtn.disabled = true;

            appendLog(`Initializing AGI Colony Master Orchestrator. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Target: Expand by ${pop} colonists under constraint: "${res}"`, 'log-info');
            appendLog(`Thinking: Decomposing logistics, life support, and structural tasks...`, 'log-thought');

            try {
                const subTasks = await orchestrateColonyExpansion(pop, res, provider, { apiKey, model, temperature: 0.7 });

                appendLog(`Observation: Task decomposition successful. Generated ${subTasks.length} parallel swarms.`, 'log-success');

                // Simulate parallel execution visually
                await Promise.all(subTasks.map(async (task, index) => {
                    await new Promise(r => setTimeout(r, index * 800));
                    appendLog(`Spawning Swarm: ${task.agentRole}...`, 'log-action');
                    appendLog(`Task: ${task.taskDescription}`, 'log-subagent');

                    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
                    appendLog(`[${task.agentRole}] Delivery: ${task.expectedOutput}`, 'log-subagent');
                    appendLog(`[${task.agentRole}] Completed.`, 'log-success');
                }));

                appendLog(`Thinking: All infrastructure blueprints received. Synthesizing expansion matrix.`, 'log-thought');
                setTimeout(() => {
                    appendLog(`Action: Blueprints uploaded to autonomous construction rovers.`, 'log-success');
                    appendLog(`Expansion Planning Complete.`, 'log-success');
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
    module.exports = { orchestrateColonyExpansion };
}
