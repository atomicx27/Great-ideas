function synthesizeMissionPlan(fuel, trajectory, cargo) {
    return {
        missionStatus: "GO for Launch",
        actions: [
            `Propellant: Synthesized ${fuel.tons} tons of LH2/LOX.`,
            `Trajectory: Calculated optimal Hohmann transfer (Window: ${trajectory.window}).`,
            `Cargo: Secured ${cargo.modules} habitation modules.`
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
            fuel: { card: document.getElementById('agent-fuel'), status: document.querySelector('#agent-fuel .agent-status'), output: document.querySelector('#agent-fuel .agent-output') },
            trajectory: { card: document.getElementById('agent-trajectory'), status: document.querySelector('#agent-trajectory .agent-status'), output: document.querySelector('#agent-trajectory .agent-output') },
            cargo: { card: document.getElementById('agent-cargo'), status: document.querySelector('#agent-cargo .agent-status'), output: document.querySelector('#agent-cargo .agent-output') }
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
                await new Promise(r => setTimeout(r, Math.random() * 800 + 300)); // slightly faster for quick testing
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'grid';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Pending...");
            });

            masterStatus.textContent = "Deconstructing Mission Request...";
            await new Promise(r => setTimeout(r, 1000));
            masterStatus.textContent = "Deploying Logistics Swarm";

            const fuelSteps = ["Analyzing payload mass", "Calculating delta-V requirements", "Allocating 250 tons LH2/LOX"];
            const trajSteps = ["Running orbital mechanics sims", "Checking space weather", "Locking Hohmann transfer window"];
            const cargoSteps = ["Auditing Lunar Base manifest", "Balancing payload mass", "Securing 3 habitation modules"];

            await Promise.all([
                simulateAgentProcessing('fuel', fuelSteps),
                simulateAgentProcessing('trajectory', trajSteps),
                simulateAgentProcessing('cargo', cargoSteps)
            ]);

            masterStatus.textContent = "Synthesizing Mission Architecture...";
            await new Promise(r => setTimeout(r, 1200));

            masterStatus.textContent = "Mission Architecture Ready.";
            synthesisNode.style.display = 'block';

            const result = synthesizeMissionPlan(
                { tons: 250 },
                { window: 'T+48:00:00' },
                { modules: 3 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#10b981; font-weight:bold;">${result.missionStatus}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>All sub-agents synchronized. Master Orchestrator approves launch sequence.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeMissionPlan };
}
