// Swarm logic for testing
function synthesizeReliefPlan(evac, logistics, medical) {
    return {
        operationStatus: "Active Deployment",
        actions: [
            `Evac: Routing ${evac.peopleRouted} citizens via Hwy 9.`,
            `Logistics: Deployed ${logistics.waterPallets} pallets of water.`,
            `Medical: Dispatched ${medical.ambulances} ambulances to Sector B.`
        ]
    };
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            evac: { card: document.getElementById('agent-evac'), status: document.querySelector('#agent-evac .agent-status'), output: document.querySelector('#agent-evac .agent-output') },
            logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') },
            medical: { card: document.getElementById('agent-medical'), status: document.querySelector('#agent-medical .agent-status'), output: document.querySelector('#agent-medical .agent-output') }
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

            masterStatus.textContent = "Analyzing Disaster Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Relief Swarm";

            const evacSteps = ["Analyzing flood maps", "Identifying Hwy 9 as clear", "Routing 5000 people"];
            const logisticsSteps = ["Checking FEMA inventory", "Loading trucks at Depot A", "Secured 200 water pallets"];
            const medicalSteps = ["Monitoring 911 call clusters", "Identifying Sector B as high triage", "Dispatching 15 ambulances"];

            await Promise.all([
                simulateAgentProcessing('evac', evacSteps),
                simulateAgentProcessing('logistics', logisticsSteps),
                simulateAgentProcessing('medical', medicalSteps)
            ]);

            masterStatus.textContent = "Synthesizing Relief Plan...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Plan Ready. Executing Operations.";
            synthesisNode.style.display = 'block';

            const result = synthesizeReliefPlan(
                { peopleRouted: 5000 },
                { waterPallets: 200 },
                { ambulances: 15 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#d32f2f; font-weight:bold;">${result.operationStatus}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>All teams synchronized and deployed.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeReliefPlan };
}