function synthesizeMitigationStrategy(climate, logistics, economic) {
    return {
        severity: "CRITICAL: 30% Wheat Yield Reduction Detected",
        interventions: [
            `Climate Adaptation: Initiating emergency planting of drought-resistant strain ${climate.strainID} in secondary regions.`,
            `Supply Chain: Rerouting ${logistics.vesselsRerouted} grain vessels to vulnerable ports in Sub-Saharan Africa.`,
            `Economic Stability: Releasing $${economic.subsidyBillion}B in targeted subsidies to prevent localized price spikes.`
        ]
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            climate: { card: document.getElementById('agent-climate'), status: document.querySelector('#agent-climate .agent-status'), output: document.querySelector('#agent-climate .agent-output') },
            logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') },
            economic: { card: document.getElementById('agent-economic'), status: document.querySelector('#agent-economic .agent-status'), output: document.querySelector('#agent-economic .agent-output') }
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

        const simulateAgentProcessing = async (agentKey, steps) => {
            setAgentState(agentKey, true, "Processing Data...");
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 1200 + 500));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Analysis Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Initializing...");
            });

            masterStatus.textContent = "Orchestrator: Alert! Massive drought detected in primary wheat-producing regions.";
            await new Promise(r => setTimeout(r, 2000));
            masterStatus.textContent = "Orchestrator: Deconstructing crisis. Spawning domain-specific sub-agents.";

            const climateSteps = ["Analyzing satellite moisture data...", "Projecting 90-day rainfall: -45% deviation.", "Identifying viable drought-resistant strain X-42 for late planting."];
            const logisticsSteps = ["Auditing global strategic grain reserves...", "Identifying 15 vessels in transit over Pacific.", "Calculating optimal reroutes to deficit regions."];
            const economicSteps = ["Simulating wheat futures market shock...", "Projecting 200% price surge in developing nations.", "Drafting emergency subsidy release parameters."];

            await Promise.all([
                simulateAgentProcessing('climate', climateSteps),
                simulateAgentProcessing('logistics', logisticsSteps),
                simulateAgentProcessing('economic', economicSteps)
            ]);

            masterStatus.textContent = "Orchestrator: Sub-agents complete. Synthesizing holistic mitigation strategy...";
            await new Promise(r => setTimeout(r, 2000));

            masterStatus.textContent = "Orchestrator: Strategy Finalized. Ready for executive execution.";
            synthesisNode.style.display = 'block';

            const result = synthesizeMitigationStrategy(
                { strainID: "X-42" },
                { vesselsRerouted: 15 },
                { subsidyBillion: 2.5 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Threat Assessment:</strong> <span style="color:#d32f2f; font-weight:bold;">${result.severity}</span></p>
                <ul>
                    ${result.interventions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Action plan distributed to international agricultural coalition.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeMitigationStrategy };
}
