async function orchestrateAntimatterProduction(goal, apiKey = 'mock-key') {
    const llmFetch = typeof fetchOpenAI !== 'undefined' ? fetchOpenAI : require('../shared/llm-api.js').fetchOpenAI;

    const systemPrompt = "You are a sub-agent of an AGI Orchestrator managing antimatter production.";

    const trappingPrompt = `Goal: ${goal}. Design the magnetic confinement parameters for the Penning Trap. Keep it brief.`;
    const coolingPrompt = `Goal: ${goal}. Define the laser cooling sequence to reach sub-Kelvin temperatures. Keep it brief.`;
    const synthesisPrompt = `Goal: ${goal}. Outline the recombination protocol for antiprotons and positrons. Keep it brief.`;

    try {
        const [trappingRes, coolingRes, synthesisRes] = await Promise.all([
            llmFetch(apiKey, 'gpt-4o', systemPrompt, trappingPrompt),
            llmFetch(apiKey, 'gpt-4o', systemPrompt, coolingPrompt),
            llmFetch(apiKey, 'gpt-4o', systemPrompt, synthesisPrompt)
        ]);

        return { trappingRes, coolingRes, synthesisRes };
    } catch (e) {
        throw new Error(`Orchestration failed: ${e.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            trapping: { card: document.getElementById('agent-trapping'), status: document.querySelector('#agent-trapping .agent-status'), output: document.querySelector('#agent-trapping .agent-output') },
            cooling: { card: document.getElementById('agent-cooling'), status: document.querySelector('#agent-cooling .agent-status'), output: document.querySelector('#agent-cooling .agent-output') },
            synthesis: { card: document.getElementById('agent-synthesis'), status: document.querySelector('#agent-synthesis .agent-status'), output: document.querySelector('#agent-synthesis .agent-output') }
        };

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

        startBtn.addEventListener('click', async () => {
            const goal = document.getElementById('production-goal').value;
            const apiKey = localStorage.getItem('openai_api_key') || 'mock-key';

            startBtn.disabled = true;
            masterStatus.textContent = "Status: Orchestrator Active. Spawning Swarm...";
            swarmContainer.style.display = 'grid';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            for (let key in agents) {
                agents[key].output.innerHTML = '';
                setAgentState(key, true, 'Computing...');
            }

            try {
                const results = await orchestrateAntimatterProduction(goal, apiKey);

                appendAgentLog('trapping', results.trappingRes);
                setAgentState('trapping', false, 'Task Complete');

                appendAgentLog('cooling', results.coolingRes);
                setAgentState('cooling', false, 'Task Complete');

                appendAgentLog('synthesis', results.synthesisRes);
                setAgentState('synthesis', false, 'Task Complete');

                masterStatus.textContent = "Status: Swarm Tasks Complete. Synthesizing Master Strategy...";

                setTimeout(() => {
                    synthesisNode.style.display = 'block';
                    finalStrategy.innerHTML = `
                        <p><strong>Trapping Strategy:</strong> Parameters initialized.</p>
                        <p><strong>Cooling Strategy:</strong> Sub-Kelvin reached.</p>
                        <p><strong>Synthesis Protocol:</strong> Antimatter successfully produced.</p>
                        <p><strong>Orchestrator Conclusion:</strong> ${goal} goal achieved.</p>
                    `;
                    masterStatus.textContent = "Status: Supply Chain Established.";
                    startBtn.disabled = false;
                }, 1000);

            } catch (err) {
                masterStatus.textContent = `Status: Error - ${err.message}`;
                startBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateAntimatterProduction };
}
