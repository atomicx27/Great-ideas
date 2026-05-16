// Swarm Logic Simulation
async function simulateAgentTask(agentName, steps, callback) {
    callback(agentName, 'status', 'working');

    for (let i=0; i<steps.length; i++) {
        callback(agentName, 'log', steps[i]);
        await new Promise(resolve => setTimeout(resolve, typeof window !== 'undefined' ? 900 : 10));
    }

    callback(agentName, 'status', 'done');
    return `${agentName} operational phase complete.`;
}

async function orchestrateMiningSwarm(goal, uiCallbacks) {
    uiCallbacks.orchestrator("Directive received. Computing logistical breakdown...");
    await new Promise(r => setTimeout(r, typeof window !== 'undefined' ? 1500 : 10));

    uiCallbacks.orchestrator("Initiating Scanners, Miners, and Transport agents simultaneously.");
    uiCallbacks.showSwarm();

    const scannerTask = simulateAgentTask('scanner', [
        "Deploying micro-satellites...",
        "Running spectral analysis on Asteroid Belt Region 4...",
        "Targeting high-yield veins..."
    ], uiCallbacks.agentUpdate);

    const minerTask = simulateAgentTask('miner', [
        "Landing surface drones...",
        "Establishing drilling perimeters...",
        "Extracting raw ore into localized hoppers..."
    ], uiCallbacks.agentUpdate);

    const transportTask = simulateAgentTask('transport', [
        "Aligning orbital trajectories...",
        "Docking with surface hoppers...",
        "Initiating payload transfer to Shipyard..."
    ], uiCallbacks.agentUpdate);

    await Promise.all([scannerTask, minerTask, transportTask]);

    uiCallbacks.orchestrator("All swarm elements synchronized. Generating final manifest...");
    await new Promise(r => setTimeout(r, typeof window !== 'undefined' ? 1500 : 10));

    const finalReport = `### Logistics Manifest\n\n**Directive:** ${goal}\n\n**Operational Results:**\n- **Scanned Sectors:** 45\n- **Target Veins Locked:** 12\n- **Extracted Tonnage:** 620 Tons\n- **Delivered Payload:** 100% to Shipyard Alpha\n\n**Status:** Directive Achieved. Swarm returning to standby.`;

    uiCallbacks.showReport(finalReport);
    uiCallbacks.orchestrator("Manifest finalized. Operations concluded.");

    return finalReport;
}

// UI Binding
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const deployBtn = document.getElementById('deploy-btn');
        const goalInput = document.getElementById('mining-goal');
        const orchLog = document.getElementById('orchestrator-log');
        const swarmDash = document.getElementById('swarm-dashboard');
        const synthesisPanel = document.getElementById('synthesis-panel');
        const finalReportEl = document.getElementById('final-report');

        const agentsUI = {
            scanner: { log: document.getElementById('log-scanner'), ind: document.querySelector('#agent-scanner .status-indicator') },
            miner: { log: document.getElementById('log-miner'), ind: document.querySelector('#agent-miner .status-indicator') },
            transport: { log: document.getElementById('log-transport'), ind: document.querySelector('#agent-transport .status-indicator') }
        };

        const uiCallbacks = {
            orchestrator: (msg) => orchLog.innerText = msg,
            showSwarm: () => swarmDash.classList.remove('hidden'),
            showReport: (text) => {
                finalReportEl.innerText = text;
                synthesisPanel.classList.remove('hidden');
            },
            agentUpdate: (agent, type, value) => {
                const ui = agentsUI[agent];
                if (type === 'status') {
                    ui.ind.className = 'status-indicator ' + value;
                    if (value === 'working') ui.log.innerText = '';
                } else if (type === 'log') {
                    ui.log.innerText += '> ' + value + '\n';
                }
            }
        };

        deployBtn.addEventListener('click', async () => {
            const goal = goalInput.value.trim();
            if (!goal) return;

            deployBtn.disabled = true;
            synthesisPanel.classList.add('hidden');

            await orchestrateMiningSwarm(goal, uiCallbacks);

            deployBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { orchestrateMiningSwarm, simulateAgentTask };
}
