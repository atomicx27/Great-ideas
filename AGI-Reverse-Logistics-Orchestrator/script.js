// Core Logic (Testable)
function parseMasterPlan(planStr) {
    try {
        const data = JSON.parse(planStr);
        if (!data.tasks || !Array.isArray(data.tasks)) {
            throw new Error("Invalid structure");
        }
        return { isValid: true, tasks: data.tasks };
    } catch (e) {
        return { isValid: false, error: "Failed to parse JSON plan." };
    }
}

async function orchestrateReverseLogistics(batchData, config, fetchLLMFn) {
    const sysPrompt = `You are the AGI Master Orchestrator for Reverse Logistics.
Analyze the incoming batch of returned items.
Determine which specialized sub-agent (e.g., Refurbishment Agent, Liquidation Agent, Restocking Agent) should handle which item(s).
Output ONLY valid JSON in this format:
{
  "tasks": [
    { "agentName": "Refurbishment Agent", "items": ["RET-001"], "instructions": "Evaluate repair cost..." }
  ]
}`;
    const response = await fetchLLMFn(config.provider, config.apiKey, sysPrompt, `Batch: ${batchData}`);

    // Attempt to extract JSON from markdown if present
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    return parseMasterPlan(jsonStr);
}

async function assignLogisticsAgents(task, config, fetchLLMFn) {
    const sysPrompt = `You are a specialized AI Logistics Agent: ${task.agentName}.
Process your assigned items according to the instructions.
Determine the final destination (e.g., Warehouse A, E-waste facility, Secondary Market).
Provide a clear status report of actions taken. Use markdown.`;

    return await fetchLLMFn(config.provider, config.apiKey, sysPrompt, `Items: ${JSON.stringify(task.items)}\nInstructions: ${task.instructions}`);
}

async function synthesizeResults(batchData, results, config, fetchLLMFn) {
     const sysPrompt = `You are the AGI Master Orchestrator.
Synthesize the routing decisions from your sub-agents into a Final Processing Report.
Calculate the estimated recovered value based on agent actions.`;

    const userMessage = `Original Batch:\n${batchData}\n\nAgent Reports:\n${JSON.stringify(results, null, 2)}`;
    return await fetchLLMFn(config.provider, config.apiKey, sysPrompt, userMessage);
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMasterPlan, orchestrateReverseLogistics, assignLogisticsAgents, synthesizeResults };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btnRun = document.getElementById('btn-run');
        const batchInput = document.getElementById('return-batch');
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
                if (systemPrompt.includes("Master Orchestrator for Reverse Logistics")) {
                    return JSON.stringify({
                        tasks: [
                            { agentName: "Repair & Refurb", items: ["RET-001"], instructions: "Assess motherboard repair cost vs salvage value." },
                            { agentName: "Restocking", items: ["RET-002"], instructions: "Route to primary warehouse for immediate resale." },
                            { agentName: "Liquidation", items: ["RET-003"], instructions: "Route to bulk auction pallet." }
                        ]
                    });
                } else if (systemPrompt.includes("Synthesize")) {
                    return "### Final Processing Report\n- **Recovered Value:** $650 (Est)\n- **Restocking:** 1 Item\n- **Refurbishment:** 1 Item\n- **Liquidation:** 1 Item\nAll items routed successfully.";
                } else {
                    return `Task complete. Item processed according to standard operating procedures.`;
                }
            }
            throw new Error("Unknown provider");
        }

        btnRun.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;
            const batchData = batchInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key");
                return;
            }

            btnRun.disabled = true;
            btnRun.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing Batch...';
            board.classList.remove('hidden');
            agentsGrid.innerHTML = '';
            masterSummary.classList.add('hidden');

            const config = { provider, apiKey };

            try {
                // 1. Master Agent breaks down goal
                const planResult = await orchestrateReverseLogistics(batchData, config, fetchLLMWrapper);

                if (!planResult.isValid) {
                    throw new Error("Master Agent failed to generate a valid plan.");
                }

                btnRun.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Swarm Active...';

                // 2. Setup UI for Agents
                const agentUIs = [];
                planResult.tasks.forEach((task, index) => {
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector('.agent-card');
                    card.querySelector('.agent-name').textContent = task.agentName;
                    card.querySelector('.agent-task').textContent = task.instructions;

                    const icon = card.querySelector('.agent-icon');
                    if (task.agentName.toLowerCase().includes('refurb') || task.agentName.toLowerCase().includes('repair')) icon.className = 'fa-solid agent-icon fa-screwdriver-wrench';
                    else if (task.agentName.toLowerCase().includes('restock')) icon.className = 'fa-solid agent-icon fa-boxes-stacked';
                    else if (task.agentName.toLowerCase().includes('liquid')) icon.className = 'fa-solid agent-icon fa-tags';
                    else icon.className = 'fa-solid agent-icon fa-truck-fast';

                    agentsGrid.appendChild(clone);

                    agentUIs.push({
                        taskData: task,
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

                    const result = await assignLogisticsAgents(ui.taskData, config, fetchLLMWrapper);

                    ui.statusEl.textContent = 'Done';
                    ui.statusEl.className = 'agent-status done';
                    ui.outputEl.classList.remove('hidden');

                    const htmlResult = window.marked ? window.marked.parse(result) : result;
                    ui.outputEl.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlResult) : htmlResult;

                    return { agent: ui.taskData.agentName, items: ui.taskData.items, report: result };
                });

                const results = await Promise.all(agentPromises);

                // 4. Synthesize final result
                btnRun.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Synthesizing...';

                const finalSummary = await synthesizeResults(batchData, results, config, fetchLLMWrapper);
                masterSummary.classList.remove('hidden');

                const htmlSummary = window.marked ? window.marked.parse(finalSummary) : finalSummary;
                summaryContent.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlSummary) : htmlSummary;

            } catch (err) {
                alert(`Orchestration Error: ${err.message}`);
            } finally {
                btnRun.disabled = false;
                btnRun.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Process Another Batch';
            }
        });
    });
}
