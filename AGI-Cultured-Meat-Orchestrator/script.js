// AGI Master Orchestrator logic
async function runAgent(agentName, systemPrompt, userMessage, apiKey, provider) {
    let result = '';

    if (provider === 'openai') {
        result = await fetchOpenAI(apiKey, 'gpt-4o-mini', systemPrompt, userMessage, { temperature: 0.5 });
    } else if (provider === 'anthropic') {
        result = await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { temperature: 0.5 });
    } else if (provider === 'ollama') {
        result = await fetchOllama('llama3', systemPrompt, userMessage, { temperature: 0.5 });
    } else {
        throw new Error('Unsupported provider');
    }

    return result;
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const apiKeyInput = document.getElementById('api-key');
        const providerSelect = document.getElementById('llm-provider');
        const goalInput = document.getElementById('meat-goal');
        const orchestrateBtn = document.getElementById('orchestrate-btn');
        const statusDisplay = document.getElementById('status-display');
        const finalSynthesisBlock = document.getElementById('final-synthesis');
        const synthesisOutput = document.getElementById('synthesis-output');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        function updateAgentUI(id, status, resultHtml = null) {
            const card = document.getElementById(id);
            const statusDiv = card.querySelector('.agent-status');
            const outputDiv = card.querySelector('.agent-output');

            statusDiv.textContent = status;
            statusDiv.className = 'agent-status';

            if (status === 'Running...') statusDiv.classList.add('running');
            else if (status === 'Complete') statusDiv.classList.add('complete');
            else if (status.startsWith('Error')) statusDiv.classList.add('error');

            if (resultHtml) {
                outputDiv.innerHTML = DOMPurify.sanitize(marked.parse(resultHtml));
            }
        }

        orchestrateBtn.addEventListener('click', async () => {
            const goal = goalInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            const provider = providerSelect.value;

            if (!goal) {
                alert('Please enter a goal.');
                return;
            }
            if (provider !== 'ollama' && !apiKey) {
                alert('API key is required for cloud providers.');
                return;
            }

            orchestrateBtn.disabled = true;
            statusDisplay.textContent = 'Orchestrating Swarm Agents...';
            statusDisplay.style.backgroundColor = '#fcf3cf';
            statusDisplay.style.color = '#b7950b';
            finalSynthesisBlock.style.display = 'none';
            synthesisOutput.innerHTML = '';

            appendLog(`AGI Orchestrator initialized for goal: ${goal}`);

            const agentConfigs = [
                {
                    id: 'agent-bioreactor',
                    name: 'Bioreactor Engineer',
                    prompt: 'You are the Bioreactor Engineer Agent. Based on the user\'s goal, output a brief design for the bioreactor scaling, scaffolding needs, and media cycling.'
                },
                {
                    id: 'agent-genetics',
                    name: 'Cell Genetics Lead',
                    prompt: 'You are the Cell Genetics Lead Agent. Based on the user\'s goal, describe the cell line requirements (e.g., immortalization strategy, target traits).'
                },
                {
                    id: 'agent-market',
                    name: 'Market Logistics',
                    prompt: 'You are the Market Logistics Agent. Based on the user\'s goal, identify potential regulatory hurdles, supply chain needs, and unit economics.'
                }
            ];

            try {
                // Run sub-agents in parallel
                const agentPromises = agentConfigs.map(async (config) => {
                    updateAgentUI(config.id, 'Running...');
                    appendLog(`Dispatched ${config.name}...`);
                    try {
                        const result = await runAgent(config.name, config.prompt, `Goal: ${goal}`, apiKey, provider);
                        updateAgentUI(config.id, 'Complete', result);
                        appendLog(`${config.name} completed.`);
                        return `### ${config.name} Report\n${result}`;
                    } catch (e) {
                        updateAgentUI(config.id, `Error: ${e.message}`);
                        appendLog(`${config.name} failed: ${e.message}`);
                        throw e;
                    }
                });

                const agentReports = await Promise.all(agentPromises);

                // Master Synthesis
                appendLog(`Synthesizing final AGI report...`);
                statusDisplay.textContent = 'Synthesizing Sub-Agent Reports...';

                const masterPrompt = 'You are the AGI Master Orchestrator. Synthesize the following sub-agent reports into a cohesive, comprehensive summary of the proposed cultured meat commercialization plan. Address conflicting constraints if any.';
                const masterMessage = `User Goal: ${goal}\n\n${agentReports.join('\n\n')}`;

                const synthesisResult = await runAgent('Master', masterPrompt, masterMessage, apiKey, provider);

                synthesisOutput.innerHTML = DOMPurify.sanitize(marked.parse(synthesisResult));
                finalSynthesisBlock.style.display = 'block';

                statusDisplay.textContent = 'Multi-Agent Simulation Complete!';
                statusDisplay.style.backgroundColor = '#d4edda';
                statusDisplay.style.color = '#155724';
                appendLog(`AGI Orchestration successful.`);
            } catch (error) {
                statusDisplay.textContent = `Simulation Error: ${error.message}`;
                statusDisplay.style.backgroundColor = '#fce4e4';
                statusDisplay.style.color = '#c0392b';
                appendLog(`Orchestrator failed: ${error.message}`);
            } finally {
                orchestrateBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { runAgent };
}
