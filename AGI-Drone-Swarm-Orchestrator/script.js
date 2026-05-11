function synthesizeSwarmStrategy(logistics, atc, maintenance) {
    return {
        goal: "Optimize 500 deliveries during a sudden storm.",
        strategy: [
            `Logistics: Priority routing enabled. ${logistics.deferred} non-essential deliveries deferred.`,
            `ATC: Altitudes staggered by ${atc.staggerMeters}m to prevent collisions in low visibility.`,
            `Maintenance: Recalling ${maintenance.lowBatteryDrones} drones below 40% battery to base to prevent storm drain.`
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
            logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') },
            atc: { card: document.getElementById('agent-atc'), status: document.querySelector('#agent-atc .agent-status'), output: document.querySelector('#agent-atc .agent-output') },
            maintenance: { card: document.getElementById('agent-maintenance'), status: document.querySelector('#agent-maintenance .agent-status'), output: document.querySelector('#agent-maintenance .agent-output') }
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
            setAgentState(agentKey, true, "Processing...");
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
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

            masterStatus.textContent = "Orchestrator: Directive received - Optimize 500 deliveries during storm.";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Orchestrator: Deconstructing directive. Spawning specialized sub-agents.";

            const logisticsSteps = ["Analyzing 500 delivery manifests...", "Identifying 120 critical medical/food supplies.", "Deferring 380 standard packages."];
            const atcSteps = ["Monitoring wind shear at 100-500ft...", "Calculating optimal safe altitudes.", "Staggering vertical lanes by 50m."];
            const maintenanceSteps = ["Polling fleet battery telemetry...", "Predicting storm headwind battery drain.", "Flagging 45 drones for immediate recall."];

            await Promise.all([
                simulateAgentProcessing('logistics', logisticsSteps),
                simulateAgentProcessing('atc', atcSteps),
                simulateAgentProcessing('maintenance', maintenanceSteps)
            ]);

            masterStatus.textContent = "Orchestrator: Sub-agents complete. Synthesizing holistic fleet strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Orchestrator: Swarm Strategy Finalized. Deploying instructions to fleet.";
            synthesisNode.style.display = 'block';

            const result = synthesizeSwarmStrategy(
                { deferred: 380 },
                { staggerMeters: 50 },
                { lowBatteryDrones: 45 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Primary Goal:</strong> ${result.goal}</p>
                <ul>
                    ${result.strategy.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <p><em>Executing fleet-wide adjustments...</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeSwarmStrategy };
}