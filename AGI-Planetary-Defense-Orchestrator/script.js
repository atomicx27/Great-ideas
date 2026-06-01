const SUB_AGENTS = [
    { id: 'tracking', name: 'Tracking Swarm Lead', colorClass: 'agent-tracking' },
    { id: 'deflection', name: 'Deflection Commander', colorClass: 'agent-deflection' },
    { id: 'evacuation', name: 'Evacuation Coordinator', colorClass: 'agent-evacuation' }
];

function buildMasterPrompt(scenario, subAgentOutputs) {
    return `You are the Master Orchestrator AGI for Planetary Defense.
The user has provided the following macro-goal/crisis scenario:
"${scenario}"

Your specialized sub-agents have processed the constraints in parallel and provided the following findings:
${subAgentOutputs}

Your task is to synthesize these competing constraints into a cohesive, actionable executive defense strategy.
Identify any conflicts between the agents' plans and resolve them.
Output the final global strategy in Markdown format.`;
}

async function fetchMasterLLMResponse(provider, apiKey, scenario, subAgentOutputs) {
    const systemPrompt = "You are the Master AGI Orchestrator for Planetary Defense. Format your final strategy in Markdown.";
    const userMessage = buildMasterPrompt(scenario, subAgentOutputs);

    // Mocking for tests
    if (typeof window !== 'undefined' && window.fetchMasterLLMMock) {
        return window.fetchMasterLLMMock(provider, apiKey, scenario, subAgentOutputs);
    }

    if (provider === 'openai') {
        return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage, { temperature: 0.5 });
    } else if (provider === 'anthropic') {
        return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { max_tokens: 1500 });
    } else if (provider === 'ollama') {
        return await fetchOllama(apiKey, 'llama3', systemPrompt, userMessage);
    }
    throw new Error("Unknown provider");
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function simulateSubAgents(scenario, resultsDisplay) {
    let outputs = "";

    // Run sub-agents in parallel using Promise.all to map the delays and UI updates
    await Promise.all(SUB_AGENTS.map(async (agent) => {
        // Stagger the start slightly for visual effect
        const randomDelay = Math.floor(Math.random() * 1000) + 500;
        await delay(randomDelay);

        let output = "";
        if (agent.id === 'tracking') {
            output = "[Simulated] Swarm fragmented into 12 main bodies. Impact probabilities confirmed for 4 high-density population centers. Trajectories locked.";
        } else if (agent.id === 'deflection') {
            output = "[Simulated] Global kinetic impactor arsenal depleted by 40%. Requesting nuclear authorization for 3 largest fragments to guarantee ablation.";
        } else if (agent.id === 'evacuation') {
            output = "[Simulated] Coastal evacuation routes in Sector 4 will bottleneck in 14 days. Require immediate military airbridge support to clear population.";
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

    const scenario = document.getElementById('scenario-input').value;
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
    resultsDisplay.innerHTML = `<div style="color:#aaa;">[Master Orchestrator] Initializing Multi-Agent Swarm...</div>`;

    try {
        // Step 1: Simulate Sub-Agents
        const subAgentOutputs = await simulateSubAgents(scenario, resultsDisplay);

        // Step 2: Master Synthesis
        statusText.textContent = "Status: Master Synthesizing Constraints...";
        statusText.style.color = "#ff2255";

        resultsDisplay.innerHTML += `<div class="agent-log master-log" style="color:#aaa;">[Master Orchestrator] Sub-agent data received. Querying ${provider} for final synthesis...</div>`;
        resultsDisplay.scrollTop = resultsDisplay.scrollHeight;

        const responseText = await fetchMasterLLMResponse(provider, apiKey, scenario, subAgentOutputs);
        const parsedHTML = DOMPurify.sanitize(marked.parse(responseText));

        resultsDisplay.innerHTML += `
            <div class="agent-log master-log">
                <strong>[Master Executive Strategy]</strong>
                ${parsedHTML}
            </div>
        `;

        statusText.textContent = "Status: Global Strategy Deployed";
        statusText.style.color = "#ff2255";
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
