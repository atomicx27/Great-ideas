// Core Logic (Testable)
function parseMasterPlan(planStr) {
    try {
        const data = JSON.parse(planStr);
        if (!data.agents || !Array.isArray(data.agents)) {
            throw new Error("Invalid structure");
        }
        return { isValid: true, agents: data.agents };
    } catch (e) {
        return { isValid: false, error: "Failed to parse JSON plan." };
    }
}

async function orchestrateHomeAutomation(goal, config, fetchLLMFn) {
    const sysPrompt = `You are the AGI Master Orchestrator for Home Automation.
Break down the user's high-level goal into specialized tasks.
Output ONLY valid JSON in this format:
{
  "agents": [
    { "name": "Environment Agent", "role": "Manage HVAC/Lighting", "task": "Set mood lighting and temp..." },
    { "name": "Procurement Agent", "role": "Order supplies", "task": "Order groceries..." }
  ]
}`;
    const response = await fetchLLMFn(config.provider, config.apiKey, sysPrompt, `Goal: ${goal}`);

    // Attempt to extract JSON from markdown if present
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    return parseMasterPlan(jsonStr);
}

async function dispatchAgentTask(agent, config, fetchLLMFn) {
    const sysPrompt = `You are a specialized AI: ${agent.name} (${agent.role}).
Execute your assigned task based on the user's overarching goal.
Provide a clear, brief status report of actions taken. Use markdown.`;

    return await fetchLLMFn(config.provider, config.apiKey, sysPrompt, `Task: ${agent.task}`);
}

async function synthesizeResults(goal, results, config, fetchLLMFn) {
     const sysPrompt = `You are the AGI Master Orchestrator.
Synthesize the outputs from your sub-agents into a final Executive Summary.
Confirm that the overarching goal has been met.`;

    const userMessage = `Original Goal: ${goal}\n\nAgent Reports:\n${JSON.stringify(results, null, 2)}`;
    return await fetchLLMFn(config.provider, config.apiKey, sysPrompt, userMessage);
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMasterPlan, orchestrateHomeAutomation, dispatchAgentTask, synthesizeResults };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btnRun = document.getElementById('btn-run');
        const goalInput = document.getElementById('agi-goal');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const apiKeyContainer = document.getElementById('api-key-container');

        const board = document.getElementById('orchestration-board');
        const agentsGrid = document.querySelector('.agents-grid');
        const template = document.getElementById('agent-card-template');
        const masterSummary = document.getElementById('master-summary');
        const summaryContent = document.getElementById('summary-content');

        providerSelect.addEventListener('change', (e) => {
            apiKeyContainer.classList.toggle('hidden', e.target.value === 'ollama');
        });

        async function fetchLLMWrapper(provider, apiKey, systemPrompt, userMessage) {
            if (provider === 'openai') {
                return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
            } else if (provider === 'anthropic') {
                return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', systemPrompt, userMessage);
            } else if (provider === 'ollama') {
                // Mock responses for Ollama based on the prompt content
                if (systemPrompt.includes("Master Orchestrator for Home Automation")) {
                    return JSON.stringify({
                        agents: [
                            { name: "Environment Control", role: "HVAC & Lighting", task: "Set temp to 70F, dim lights to 30%, start playlist." },
                            { name: "Logistics", role: "Grocery Delivery", task: "Order steaks, wine, and vegetables." }
                        ]
                    });
                } else if (systemPrompt.includes("Master Orchestrator. \nSynthesize")) {
                    return "### Final Review\nAll tasks completed successfully. The home is prepped and food is on the way.";
                } else {
                    return "Action executed successfully. Subsystems configured.";
                }
            }
            throw new Error("Unknown provider");
        }

        btnRun.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;
            const goal = goalInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key");
                return;
            }

            btnRun.disabled = true;
            btnRun.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Breaking down goal...';
            board.classList.remove('hidden');
            agentsGrid.innerHTML = '';
            masterSummary.classList.add('hidden');

            const config = { provider, apiKey };

            try {
                // 1. Master Agent breaks down goal
                const planResult = await orchestrateHomeAutomation(goal, config, fetchLLMWrapper);

                if (!planResult.isValid) {
                    throw new Error("Master Agent failed to generate a valid plan.");
                }

                btnRun.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Swarm Active...';

                // 2. Setup UI for Agents
                const agentUIs = [];
                planResult.agents.forEach((agent, index) => {
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector('.agent-card');
                    card.querySelector('.agent-name').textContent = agent.name;
                    card.querySelector('.agent-task').textContent = agent.task;

                    // Assign icon based on role loosely
                    const icon = card.querySelector('.agent-icon');
                    if (agent.role.toLowerCase().includes('environment') || agent.role.toLowerCase().includes('hvac')) icon.className = 'fa-solid agent-icon fa-temperature-half';
                    else if (agent.role.toLowerCase().includes('procurement') || agent.role.toLowerCase().includes('order')) icon.className = 'fa-solid agent-icon fa-cart-shopping';

                    agentsGrid.appendChild(clone);

                    // Re-query to get actual dom elements
                    agentUIs.push({
                        agentData: agent,
                        cardElement: agentsGrid.children[index],
                        statusEl: agentsGrid.children[index].querySelector('.agent-status'),
                        outputEl: agentsGrid.children[index].querySelector('.agent-output')
                    });
                });

                // 3. Dispatch tasks in parallel
                const agentPromises = agentUIs.map(async (ui) => {
                    ui.statusEl.textContent = 'Working';
                    ui.statusEl.className = 'agent-status working';

                    // Artificial stagger for visual effect
                    await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));

                    const result = await dispatchAgentTask(ui.agentData, config, fetchLLMWrapper);

                    ui.statusEl.textContent = 'Done';
                    ui.statusEl.className = 'agent-status done';
                    ui.outputEl.classList.remove('hidden');

                    const htmlResult = window.marked ? window.marked.parse(result) : result;
                    ui.outputEl.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlResult) : htmlResult;

                    return { name: ui.agentData.name, report: result };
                });

                const results = await Promise.all(agentPromises);

                // 4. Synthesize final result
                btnRun.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Synthesizing...';

                const finalSummary = await synthesizeResults(goal, results, config, fetchLLMWrapper);
                masterSummary.classList.remove('hidden');

                const htmlSummary = window.marked ? window.marked.parse(finalSummary) : finalSummary;
                summaryContent.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlSummary) : htmlSummary;

            } catch (err) {
                alert(`Orchestration Error: ${err.message}`);
            } finally {
                btnRun.disabled = false;
                btnRun.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run Another Goal';
            }
        });
    });
}
