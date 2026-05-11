function synthesizeBaseStrategy(lifeSupport, energy, comms) {
    return {
        crisisLevel: "Level 1 - Critical Subsystem Failure",
        actions: [
            `Life Support: ${lifeSupport.o2Reserves}% backup O2 engaged. Estimated survival window: ${lifeSupport.survivalWindow} hrs.`,
            `Energy: ${energy.powerRerouted}kW rerouted from hydroponics to critical systems.`,
            `Communications: Emergency telemetry burst sent to Earth. Signal integrity: ${comms.signalIntegrity}%.`
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
            life: { card: document.getElementById('agent-life'), status: document.querySelector('#agent-life .agent-status'), output: document.querySelector('#agent-life .agent-output') },
            energy: { card: document.getElementById('agent-energy'), status: document.querySelector('#agent-energy .agent-status'), output: document.querySelector('#agent-energy .agent-output') },
            comms: { card: document.getElementById('agent-comms'), status: document.querySelector('#agent-comms .agent-status'), output: document.querySelector('#agent-comms .agent-output') }
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

            masterStatus.textContent = "Analyzing Lunar Base Anomaly...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const lifeSteps = ["Detecting primary scrubber failure", "Sealing Sector 4 bulkheads", "Activating localized backup O2 scrubbers"];
            const energySteps = ["Identifying power draw spike", "Shedding non-essential hydroponic loads", "Rerouting 450kW to Sector 1 Life Support"];
            const commsSteps = ["Aligning high-gain antenna", "Bypassing local interference", "Encrypting and bursting emergency SOS packet"];

            await Promise.all([
                simulateAgentProcessing('life', lifeSteps),
                simulateAgentProcessing('energy', energySteps),
                simulateAgentProcessing('comms', commsSteps)
            ]);

            masterStatus.textContent = "Synthesizing Base Recovery Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Protocols.";
            synthesisNode.style.display = 'block';

            const result = synthesizeBaseStrategy(
                { o2Reserves: 85, survivalWindow: 72 },
                { powerRerouted: 450 },
                { signalIntegrity: 92 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#ff4136; font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Lunar Base stabilized. Awaiting Earth Command response.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeBaseStrategy };
}
