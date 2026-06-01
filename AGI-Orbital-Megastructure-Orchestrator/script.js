const SUB_AGENTS = [
    { id: 'mining', name: 'Asteroid Mining Lead', colorClass: 'agent-mining' },
    { id: 'assembly', name: 'Orbital Assembly Commander', colorClass: 'agent-assembly' },
    { id: 'logistics', name: 'Energy Logistics Coordinator', colorClass: 'agent-logistics' }
];

function buildMasterPrompt(projectDesc, subAgentOutputs) {
    return `You are the Master Orchestrator AGI for Orbital Megastructure Engineering.
The user has provided the following macro-goal:
"${projectDesc}"

Your specialized sub-agents have processed the constraints in parallel and provided the following findings:
${subAgentOutputs}

Your task is to synthesize these competing supply chain, physics, and scheduling constraints into a cohesive, actionable macro-engineering blueprint.
Identify any bottlenecks between the agents' plans and resolve them.
Output the final global strategy in Markdown format.`;
}

async function fetchMasterLLMResponse(provider, apiKey, projectDesc, subAgentOutputs) {
    const systemPrompt = "You are the Master AGI Orchestrator for Megastructure Engineering. Format your final strategy in Markdown.";
    const userMessage = buildMasterPrompt(projectDesc, subAgentOutputs);

    // Mocking for tests
    if (typeof window !== 'undefined' && window.fetchMasterLLMMock) {
        return window.fetchMasterLLMMock(provider, apiKey, projectDesc, subAgentOutputs);
    }

    if (provider === 'openai') {
        return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage, { temperature: 0.4 });
    } else if (provider === 'anthropic') {
        return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { max_tokens: 1500 });
    } else if (provider === 'ollama') {
        return await fetchOllama(apiKey, 'llama3', systemPrompt, userMessage);
    }
    throw new Error("Unknown provider");
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function simulateSubAgents(projectDesc, resultsDisplay) {
    let outputs = "";

    // Run sub-agents in parallel using Promise.all to map the delays and UI updates
    await Promise.all(SUB_AGENTS.map(async (agent) => {
        // Stagger the start slightly for visual effect
        const randomDelay = Math.floor(Math.random() * 1000) + 500;
        await delay(randomDelay);

        let output = "";
        if (agent.id === 'mining') {
            output = "[Simulated] Silicate and Iron-Nickel yields from NEOs mapped. 70% capacity will cause a 2-year bottleneck in strut fabrication. Recommend capturing a smaller C-type asteroid to supplement.";
        } else if (agent.id === 'assembly') {
            output = "[Simulated] Swarm drone collision avoidance matrices compiled. 5,000 km² assembly will require orbital drydocks to be positioned in high Earth orbit to avoid debris.";
        } else if (agent.id === 'logistics') {
            output = "[Simulated] Microwave transmission arrays configured. Initial generated power must be routed 60% back to the mining fleet to accelerate extraction, 40% to Earth.";
        }

        outputs += `\n[${agent.name}]: ${output}\n`;

        // Append to UI immediately as they finish
        if (typeof document !== 'undefined') {
            resultsDisplay.innerHTML += `
                <div class="agent-log ${agent.colorClass}">
                    <strong>[${agent.name}]:</strong> Constraints processed. Awaiting synthesis.
                </div>
            `;
            resultsDisplay.scrollTop = resultsDisplay.scrollHeight;
        }
    }));

    return outputs;
}

async function handleOrchestrate() {
    if (typeof document === 'undefined') return;

    const projectDesc = document.getElementById('project-input').value;
    const provider = document.getElementById('llm-provider').value;
    const apiKey = document.getElementById('api-key').value;
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (!apiKey) {
        alert("Please enter an API Key or Ollama URL.");
        return;
    }

    statusText.textContent = "Status: Spawning Sub-Agents...";
    statusText.style.color = "#ffaa00";
    resultsDisplay.innerHTML = `<div style="color:#aaa;">[Master Orchestrator] Initializing Megastructure Engineering Swarm...</div>`;

    try {
        // Step 1: Simulate Sub-Agents
        const subAgentOutputs = await simulateSubAgents(projectDesc, resultsDisplay);

        // Step 2: Master Synthesis
        statusText.textContent = "Status: Master Synthesizing Logistics...";
        statusText.style.color = "#00ddff";

        resultsDisplay.innerHTML += `<div class="agent-log master-log" style="color:#aaa;">[Master Orchestrator] Sub-agent data received. Querying ${provider} for final macro-engineering blueprint...</div>`;
        resultsDisplay.scrollTop = resultsDisplay.scrollHeight;

        const responseText = await fetchMasterLLMResponse(provider, apiKey, projectDesc, subAgentOutputs);
        const parsedHTML = DOMPurify.sanitize(marked.parse(responseText));

        resultsDisplay.innerHTML += `
            <div class="agent-log master-log">
                <strong>[Master Executive Blueprint]</strong>
                ${parsedHTML}
            </div>
        `;

        statusText.textContent = "Status: Blueprint Finalized & Deployed";
        statusText.style.color = "#00ddff";
        resultsDisplay.scrollTop = resultsDisplay.scrollHeight;

    } catch (err) {
        resultsDisplay.innerHTML += `<div style="color:red; margin-top:10px;">[Error] ${err.message}</div>`;
        statusText.textContent = "Status: Orchestration Failed";
        statusText.style.color = "red";
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('orchestrate-btn').addEventListener('click', handleOrchestrate);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildMasterPrompt, fetchMasterLLMResponse, simulateSubAgents };
}
