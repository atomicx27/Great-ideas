function synthesizeTrafficPlan(emergency, routing, transit) {
    return {
        crisisLevel: "Level 4 - Major Arterial Blockage",
        actions: [
            `Emergency: ${emergency.lanesCleared} priority lanes established.`,
            `Routing: ${routing.vehiclesRerouted} vehicles rerouted via surface streets.`,
            `Transit: ${transit.busesDelayed} buses put on hold; metro frequency increased.`
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
            routing: { card: document.getElementById('agent-routing'), status: document.querySelector('#agent-routing .agent-status'), output: document.querySelector('#agent-routing .agent-output') },
            transit: { card: document.getElementById('agent-transit'), status: document.querySelector('#agent-transit .agent-status'), output: document.querySelector('#agent-transit .agent-output') }
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

            masterStatus.textContent = "Analyzing Gridlock Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const emergencySteps = ["Identifying accident zone", "Clearing path for 3 ambulances", "Coordinating with fire department"];
            const routingSteps = ["Analyzing traffic density", "Adjusting 50 traffic light cycles", "Rerouting GPS navigation systems"];
            const transitSteps = ["Locating trapped buses", "Pausing departures from Central Station", "Increasing subway frequency by 20%"];

            await Promise.all([
                simulateAgentProcessing('emergency', emergencySteps),
                simulateAgentProcessing('routing', routingSteps),
                simulateAgentProcessing('transit', transitSteps)
            ]);

            masterStatus.textContent = "Synthesizing City-Wide Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Protocols.";
            synthesisNode.style.display = 'block';

            const result = synthesizeTrafficPlan(
                { lanesCleared: 2 },
                { vehiclesRerouted: 5000 },
                { busesDelayed: 12 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#c0392b; font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>City traffic grid stabilizing.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeTrafficPlan };
}
