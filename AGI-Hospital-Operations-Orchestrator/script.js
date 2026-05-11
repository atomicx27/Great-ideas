// Swarm logic for testing
function synthesizeEmergencyPlan(staffing, logistics, patientFlow) {
    return {
        codeStatus: "Code Orange - Mass Casualty",
        actions: [
            `Staffing: ${staffing.surgeonsAvailable} Trauma Surgeons activated.`,
            `Logistics: ${logistics.bloodUnits} units O-Negative blood secured.`,
            `Patient Flow: ${patientFlow.bedsCleared} ICU beds cleared in Ward B.`
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
            staffing: { card: document.getElementById('agent-staffing'), status: document.querySelector('#agent-staffing .agent-status'), output: document.querySelector('#agent-staffing .agent-output') },
            logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') },
            patient: { card: document.getElementById('agent-patient'), status: document.querySelector('#agent-patient .agent-status'), output: document.querySelector('#agent-patient .agent-output') }
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

            masterStatus.textContent = "Analyzing Crisis Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const staffingSteps = ["Paging on-call trauma teams", "Sending emergency text blast to off-duty nurses", "Confirming 12 surgeons en route"];
            const logisticsSteps = ["Checking blood bank inventory", "Contacting regional Red Cross for O-Negative resupply", "Prepping 5 additional operating rooms"];
            const patientSteps = ["Identifying stable patients for early discharge", "Converting PACU into temporary ICU", "Cleared 15 beds in Ward B"];

            await Promise.all([
                simulateAgentProcessing('staffing', staffingSteps),
                simulateAgentProcessing('logistics', logisticsSteps),
                simulateAgentProcessing('patient', patientSteps)
            ]);

            masterStatus.textContent = "Synthesizing Emergency Action Plan...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Action Plan Ready. Executing Protocols.";
            synthesisNode.style.display = 'block';

            const result = synthesizeEmergencyPlan(
                { surgeonsAvailable: 12 },
                { bloodUnits: 50 },
                { bedsCleared: 15 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#e74c3c; font-weight:bold;">${result.codeStatus}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>All teams report to designated crisis stations.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeEmergencyPlan };
}