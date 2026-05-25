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
async function synthesizeLifeBlueprint(provider, apiKey, model, genomePairs, primarySubstrate, generations) {
    const systemPrompt = `You are the Master Orchestrator AGI for a Synthetic Biology Lab. Your job is to synthesize the sub-agent outputs into a cohesive final blueprint.
Respond ONLY with a JSON object containing two keys:
1. "blueprintStatus": A short string describing the blueprint status (e.g., "Viable Synthetic Organism Designed")
2. "actions": An array of string actions taken by the agents.
Do not include markdown or extra text.`;

    const userMessage = `Sub-agent reports:
Genome Agent: Synthesized minimal viable chromosome with ${genomePairs} base pairs.
Metabolism Agent: Engineered pathway to consume ${primarySubstrate}.
Evolution Agent: Predicted stability for ${generations} generations in isolated bioreactor.
Synthesize this into a cohesive final blueprint JSON.`;

    let planData;
    try {
        const responseText = await fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage);
        planData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("LLM Error, falling back:", error);
        planData = {
            blueprintStatus: "Viable Synthetic Organism Designed (Fallback)",
            actions: [
                `Genome: Synthesized minimal viable chromosome with ${genomePairs} base pairs.`,
                `Metabolism: Engineered pathway to consume ${primarySubstrate}.`,
                `Evolution: Predicted stability for ${generations} generations in isolated bioreactor.`
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
            genome: { card: document.getElementById('agent-genome'), status: document.querySelector('#agent-genome .agent-status'), output: document.querySelector('#agent-genome .agent-output') },
            metabolic: { card: document.getElementById('agent-metabolic'), status: document.querySelector('#agent-metabolic .agent-status'), output: document.querySelector('#agent-metabolic .agent-output') },
            evo: { card: document.getElementById('agent-evo'), status: document.querySelector('#agent-evo .agent-status'), output: document.querySelector('#agent-evo .agent-output') }
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

            masterStatus.textContent = "Analyzing high-level synthetic goals...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const genomeSteps = ["Mapping essential genes from Mycoplasma genitalium", "Trimming non-essential regulatory sequences", "Assembling 473-gene minimal set"];
            const metabolicSteps = ["Analyzing PET plastic degradation pathways", "Optimizing ISMEH expression", "Balancing ATP/NADPH ratios"];
            const evoSteps = ["Simulating horizontal gene transfer risks", "Running 1M generation Monte Carlo simulation", "Confirming genetic kill-switch stability"];

            await Promise.all([
                simulateAgentProcessing('genome', genomeSteps),
                simulateAgentProcessing('metabolic', metabolicSteps),
                simulateAgentProcessing('evo', evoSteps)
            ]);

            masterStatus.textContent = "Synthesizing Final Organism Blueprint...";

            const result = await synthesizeLifeBlueprint(provider, apiKey, model, 531000, "PET Plastics", 1000000);

            masterStatus.textContent = "Blueprint Ready. Preparing for synthesis.";
            synthesisNode.style.display = 'block';

            // Safe use of DOMPurify
            const sanitize = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize : (t) => t;

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#2ecc71; font-weight:bold;">${sanitize(result.blueprintStatus)}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${sanitize(a)}</li>`).join('')}
                </ul>
                <p><em>Organism validated for safe, contained deployment.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeLifeBlueprint, fetchLLMResponse };
}