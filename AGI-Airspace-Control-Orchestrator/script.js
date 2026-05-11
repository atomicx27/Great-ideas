function synthesizeAirspaceStrategy(emergencyCorridors, deliverySwarm, airTaxi) {
    return {
        crisisLevel: "Level 1 - City-Wide Grid Failure (Airspace Impacted)",
        actions: [
            `Emergency Corridors: ${emergencyCorridors.clearedRoutes} vital routes cleared. Response time improved by ${emergencyCorridors.efficiencyGain}%.`,
            `Delivery Swarm: ${deliverySwarm.groundedDrones} non-essential drones grounded. ${deliverySwarm.reroutedDrones} essential medical deliveries rerouted via low-altitude safe zones.`,
            `Air Taxi Management: ${airTaxi.divertedFlights} passenger flights diverted to backup vertiports. Zero airborne conflicts reported.`
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
            emergency: { card: document.getElementById('agent-emergency'), status: document.querySelector('#agent-emergency .agent-status'), output: document.querySelector('#agent-emergency .agent-output') },
            delivery: { card: document.getElementById('agent-delivery'), status: document.querySelector('#agent-delivery .agent-status'), output: document.querySelector('#agent-delivery .agent-output') },
            taxi: { card: document.getElementById('agent-taxi'), status: document.querySelector('#agent-taxi .agent-status'), output: document.querySelector('#agent-taxi .agent-output') }
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

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Pending...");
            });

            masterStatus.textContent = "Analyzing Grid Failure Impact on Airspace...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Resolution";

            const emergencySteps = ["Scanning for active medevac transponders", "Clearing altitude 100m-200m", "Locking priority corridors to hospitals"];
            const deliverySteps = ["Issuing RTB (Return to Base) for 4,200 commercial drones", "Identifying 300 critical medical deliveries", "Rerouting criticals below 50m ceiling"];
            const taxiSteps = ["Detecting 45 airborne passenger eVTOLs", "Identifying online backup vertiports", "Broadcasting diversion vectors safely"];

            await Promise.all([
                simulateAgentProcessing('emergency', emergencySteps),
                simulateAgentProcessing('delivery', deliverySteps),
                simulateAgentProcessing('taxi', taxiSteps)
            ]);

            masterStatus.textContent = "Synthesizing City-Wide Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Master Directives.";
            synthesisNode.style.display = 'block';

            const result = synthesizeAirspaceStrategy(
                { clearedRoutes: 12, efficiencyGain: 40 },
                { groundedDrones: 4200, reroutedDrones: 300 },
                { divertedFlights: 45 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:var(--accent-red); font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Airspace stabilized. Monitoring grid recovery progress.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeAirspaceStrategy };
}