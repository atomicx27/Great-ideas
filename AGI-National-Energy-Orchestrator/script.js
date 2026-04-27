// Swarm logic for testing
function synthesizeEnergyPlan(solar, wind, battery) {
    return {
        gridStatus: "Stabilized",
        actions: [
            `Solar: Output adjusted to ${solar.outputMW}MW.`,
            `Wind: Output adjusted to ${wind.outputMW}MW.`,
            `Battery: Discharging at ${battery.dischargeMW}MW.`
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
            solar: { card: document.getElementById('agent-solar'), status: document.querySelector('#agent-solar .agent-status'), output: document.querySelector('#agent-solar .agent-output') },
            wind: { card: document.getElementById('agent-wind'), status: document.querySelector('#agent-wind .agent-status'), output: document.querySelector('#agent-wind .agent-output') },
            battery: { card: document.getElementById('agent-battery'), status: document.querySelector('#agent-battery .agent-status'), output: document.querySelector('#agent-battery .agent-output') }
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

            masterStatus.textContent = "Analyzing Grid Parameters...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying Swarm for Parallel Execution";

            const solarSteps = ["Analyzing cloud cover data", "Predicting next 4 hours output", "Setting max output to 400MW"];
            const windSteps = ["Analyzing storm trajectory", "Curtailing coastal turbines due to high wind", "Setting safe output to 300MW"];
            const batterySteps = ["Checking reserve levels", "Calculating required deficit coverage", "Setting discharge rate to 200MW"];

            await Promise.all([
                simulateAgentProcessing('solar', solarSteps),
                simulateAgentProcessing('wind', windSteps),
                simulateAgentProcessing('battery', batterySteps)
            ]);

            masterStatus.textContent = "Synthesizing National Energy Plan...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Plan Ready. Executing Strategy.";
            synthesisNode.style.display = 'block';

            const result = synthesizeEnergyPlan(
                { outputMW: 400 },
                { outputMW: 300 },
                { dischargeMW: 200 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:#2ecc71; font-weight:bold;">${result.gridStatus}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <p><em>Grid balanced and secure.</em></p>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeEnergyPlan };
}