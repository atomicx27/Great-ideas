async function fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage) {
    if (typeof fetchOpenAI === 'undefined' && typeof window !== 'undefined') {
        throw new Error('LLM API utilities not loaded.');
    }
    const apiModule = typeof window !== 'undefined' ? window : require('../shared/llm-api.js');

    if (provider === 'openai') {
        return await apiModule.fetchOpenAI(apiKey, model || 'gpt-4o-mini', systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
        return await apiModule.fetchAnthropic(apiKey, model || 'claude-3-haiku-20240307', systemPrompt, userMessage);
    } else if (provider === 'ollama') {
        return await apiModule.fetchOllama('http://localhost:11434', model || 'llama3', systemPrompt, userMessage);
    }
    throw new Error('Invalid provider');
}

// Swarm logic for testing
async function synthesizeEnergyPlan(provider, apiKey, model, solarOutput, windOutput, batteryOutput) {
    const systemPrompt = `You are the Master Orchestrator AGI for a National Energy Grid. Your job is to synthesize the sub-agent outputs into a cohesive final plan.
Respond ONLY with a JSON object containing two keys:
1. "gridStatus": A short string describing the grid status (e.g., "Stabilized")
2. "actions": An array of string actions taken by the agents.
Do not include markdown or extra text.`;

    const userMessage = `Sub-agent reports:
Solar Agent: Output adjusted to ${solarOutput}MW.
Wind Agent: Output adjusted to ${windOutput}MW.
Battery Agent: Discharging at ${batteryOutput}MW.
Synthesize this into a cohesive final strategy JSON.`;

    let planData;
    try {
        const responseText = await fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage);
        planData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("LLM Error, falling back:", error);
        planData = {
            gridStatus: "Stabilized (Fallback)",
            actions: [
                `Solar: Output adjusted to ${solarOutput}MW.`,
                `Wind: Output adjusted to ${windOutput}MW.`,
                `Battery: Discharging at ${batteryOutput}MW.`
            ]
        };
    }

    return planData;
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const apiKeyInput = document.getElementById('api-key');
        const modelInput = document.getElementById('model-name');

        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            solar: { card: document.getElementById('agent-solar'), status: document.querySelector('#agent-solar .agent-status'), output: document.querySelector('#agent-solar .agent-output') },
            wind: { card: document.getElementById('agent-wind'), status: document.querySelector('#agent-wind .agent-status'), output: document.querySelector('#agent-wind .agent-output') },
            battery: { card: document.getElementById('agent-battery'), status: document.querySelector('#agent-battery .agent-status'), output: document.querySelector('#agent-battery .agent-output') }
        };

        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyGroup.style.display = 'none';
                modelGroup.style.display = 'block';
            } else {
                apiKeyGroup.style.display = 'block';
                modelGroup.style.display = 'none';
            }
        });

        function appendAgentLog(agentKey, message) {
            const p = document.createElement('p');
            p.textContent = `> ${message}`;
            agents[agentKey].output.appendChild(p);
            agents[agentKey].output.scrollTop = agents[agentKey].output.scrollHeight;
        }

        function setAgentState(agentKey, isActive, statusText) {
            agents[agentKey].status.textContent = statusText;
            if (isActive) {
                agents[agentKey].card.classList.add('active');
            } else {
                agents[agentKey].card.classList.remove('active');
            }
        }

        const simulateAgentProcessing = async (agentKey, steps) => {
            setAgentState(agentKey, true, "Processing...");
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 1000 + 400));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;
            const model = modelInput.value;

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Pending...");
            });

            masterStatus.textContent = "Analyzing Grid Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const solarSteps = ["Analyzing cloud cover data", "Predicting next 4 hours output", "Setting max output to 400MW"];
            const windSteps = ["Analyzing storm trajectory", "Curtailing coastal turbines due to high wind", "Setting safe output to 300MW"];
            const batterySteps = ["Checking reserve levels", "Calculating required deficit coverage", "Setting discharge rate to 200MW"];

            await Promise.all([
                simulateAgentProcessing('solar', solarSteps),
                simulateAgentProcessing('wind', windSteps),
                simulateAgentProcessing('battery', batterySteps)
            ]);

            masterStatus.textContent = "Synthesizing National Energy Plan via AGI...";

            const result = await synthesizeEnergyPlan(provider, apiKey, model, 400, 300, 200);

            masterStatus.textContent = "Plan Ready. Executing Strategy.";
            synthesisNode.style.display = 'block';

            // Safe use of DOMPurify
            const sanitize = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize : (t) => t;

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#2ecc71; font-weight:bold;">${sanitize(result.gridStatus)}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${sanitize(a)}</li>`).join('')}
                </ul>
                <p><em>Grid balanced and secure.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeEnergyPlan, fetchLLMResponse };
}