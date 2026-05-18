function synthesizeResponseStrategy(evacData, suppressionData, logisticsData) {
    return {
        crisisLevel: "Level 1 - Mega-Fire Convergence",
        actions: [
            `Evacuation: Route ${evacData.evacRoute} secured. ${evacData.citizensCleared} citizens safely evacuated ahead of the fire front.`,
            `Suppression: ${suppressionData.airTankers} air tankers deployed to coordinate retardant drops along the ${suppressionData.dropZone} ridge.`,
            `Logistics: ${logisticsData.supplyTrucks} supply trucks rerouted to basecamp. ${logisticsData.waterPumps} high-capacity water pumps secured for defensive lines.`
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
            evac: { card: document.getElementById('agent-evac'), status: document.querySelector('#agent-evac .agent-status'), output: document.querySelector('#agent-evac .agent-output') },
            suppression: { card: document.getElementById('agent-suppression'), status: document.querySelector('#agent-suppression .agent-status'), output: document.querySelector('#agent-suppression .agent-output') },
            logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') }
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

            masterStatus.textContent = "Analyzing Mega-Fire Perimeter Convergence...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Mitigation";

            const evacSteps = ["Analyzing traffic bottlenecks on Hwy 9", "Reversing lane directions for outbound flow", "Confirming 12,500 citizens cleared from red zone"];
            const suppressionSteps = ["Calculating wind vectors at altitude", "Dispatching 6 VLAT air tankers", "Targeting Eastern Ridge for primary retardant drop"];
            const logisticsSteps = ["Identifying secure supply routes away from smoke", "Rerouting 15 supply trucks to secondary basecamp", "Procuring 8 high-capacity water pumps from regional reserves"];

            await Promise.all([
                simulateAgentProcessing('evac', evacSteps),
                simulateAgentProcessing('suppression', suppressionSteps),
                simulateAgentProcessing('logistics', logisticsSteps)
            ]);

            masterStatus.textContent = "Synthesizing Regional Response Strategy...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Strategy Ready. Executing Master Directives.";
            synthesisNode.style.display = 'block';

            const result = synthesizeResponseStrategy(
                { evacRoute: "Hwy 9 Outbound", citizensCleared: "12,500" },
                { airTankers: 6, dropZone: "Eastern" },
                { supplyTrucks: 15, waterPumps: 8 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:var(--accent-red); font-weight:bold;">${result.crisisLevel}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Perimeter defense active. Monitoring containment lines.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeResponseStrategy };
}