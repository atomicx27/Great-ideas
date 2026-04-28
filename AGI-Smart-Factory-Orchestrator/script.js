function synthesizeFactoryPlan(supply, production, maintenance) {
    return {
        crisisLevel: "Level 1 - Assembly Power Failure",
        actions: [
            `Supply Chain: ${supply.divertedBatches} batches diverted to Warehouse B.`,
            `Production: ${production.rebalancedLoad}% workload shifted to secondary lines.`,
            `Maintenance: ${maintenance.dronesDispatched} repair drones dispatched to Main Breaker.`
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
            supply: { card: document.getElementById('agent-supply'), status: document.querySelector('#agent-supply .agent-status'), output: document.querySelector('#agent-supply .agent-output') },
            production: { card: document.getElementById('agent-production'), status: document.querySelector('#agent-production .agent-status'), output: document.querySelector('#agent-production .agent-output') },
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

            masterStatus.textContent = "Analyzing Factory Disruption Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const supplySteps = ["Halting inbound shipments to Bay 1", "Rerouting 14 pallets to Warehouse B", "Notifying upstream vendors of delay"];
            const productionSteps = ["Spinning up secondary lines 2 & 3", "Transferring Q3 critical orders to Line 2", "Adjusting robotic arm speeds"];
            const maintenanceSteps = ["Isolating main breaker grid", "Dispatching 3 diagnostic drones", "Estimating repair time: 45 mins"];

            await Promise.all([
                simulateAgentProcessing('supply', supplySteps),
                simulateAgentProcessing('production', productionSteps),
                simulateAgentProcessing('maintenance', maintenanceSteps)
            ]);

            masterStatus.textContent = "Synthesizing Factory Recovery Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Protocols.";
            synthesisNode.style.display = 'block';

            const result = synthesizeFactoryPlan(
                { divertedBatches: 14 },
                { rebalancedLoad: 85 },
                { dronesDispatched: 3 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#eb3b5a; font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Factory operations stabilizing.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeFactoryPlan };
}
