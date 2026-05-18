function synthesizeTransitStrategy(trainData, busData, passengerData) {
    return {
        crisisLevel: "Level 1 - Major Transit Hub Flooding",
        actions: [
            `Subway Network: Lines ${trainData.affectedLines} suspended. ${trainData.trainsRerouted} trains safely reversed to unaffected terminals.`,
            `Bus Fleet: ${busData.dispatchedBuses} articulated buses dispatched from depot to establish a "bus bridge" around the flooded zone.`,
            `Passenger Flow: ${passengerData.alertsSent} push notifications sent. Turnstile ingress throttled at ${passengerData.throttledStations} stations to prevent platform overcrowding.`
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
            train: { card: document.getElementById('agent-train'), status: document.querySelector('#agent-train .agent-status'), output: document.querySelector('#agent-train .agent-output') },
            bus: { card: document.getElementById('agent-bus'), status: document.querySelector('#agent-bus .agent-status'), output: document.querySelector('#agent-bus .agent-output') },
            passenger: { card: document.getElementById('agent-passenger'), status: document.querySelector('#agent-passenger .agent-status'), output: document.querySelector('#agent-passenger .agent-output') }
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
                await new Promise(r => setTimeout(r, Math.random() * 800 + 400));
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

            masterStatus.textContent = "Analyzing Flood Reports at Central Station...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Network Resolution";

            const trainSteps = ["Detecting water on tracks at Central", "Suspending Blue and Red lines", "Reversing 12 inbound trains to prior stations"];
            const busSteps = ["Calculating passenger displacement volume", "Identifying 45 available articulated buses at North Depot", "Deploying bus bridge route circumventing flooded zone"];
            const passengerSteps = ["Analyzing API access logs for app users in sector", "Broadcasting 150,000 emergency reroute push notifications", "Locking turnstiles at 5 adjacent stations to prevent crush load"];

            await Promise.all([
                simulateAgentProcessing('train', trainSteps),
                simulateAgentProcessing('bus', busSteps),
                simulateAgentProcessing('passenger', passengerSteps)
            ]);

            masterStatus.textContent = "Synthesizing City-Wide Transit Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Master Directives.";
            synthesisNode.style.display = 'block';

            const result = synthesizeTransitStrategy(
                { affectedLines: "Blue & Red", trainsRerouted: 12 },
                { dispatchedBuses: 45 },
                { alertsSent: "150,000", throttledStations: 5 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:var(--accent-red); font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Network stabilized. Monitoring flood drainage progress.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeTransitStrategy };
}