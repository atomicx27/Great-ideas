// Swarm Logic Simulation
async function simulateAgentTask(agentName, steps, callback) {
    callback(agentName, 'status', 'working');

    for (let i=0; i<steps.length; i++) {
        callback(agentName, 'log', steps[i]);
        // Fast execution for testing/logic, UI slows it down if needed
        await new Promise(resolve => setTimeout(resolve, typeof window !== 'undefined' ? 1000 : 10));
    }

    callback(agentName, 'status', 'done');
    return `${agentName} data collected.`;
}

async function orchestrateSwarm(goal, uiCallbacks) {
    uiCallbacks.orchestrator("Goal registered. Breaking down tasks...");
    await new Promise(r => setTimeout(r, typeof window !== 'undefined' ? 1500 : 10));

    uiCallbacks.orchestrator("Deploying Mapper, Biologist, and Chemist agents in parallel.");
    uiCallbacks.showSwarm();

    const mapperTask = simulateAgentTask('mapper', [
        "Initializing 3D sonar scan...",
        "Mapping trench walls...",
        "Identifying thermal vent locations..."
    ], uiCallbacks.agentUpdate);

    const bioTask = simulateAgentTask('biologist', [
        "Deploying micro-nets...",
        "Capturing extremophile DNA...",
        "Sequencing local fauna..."
    ], uiCallbacks.agentUpdate);

    const chemTask = simulateAgentTask('chemist', [
        "Sampling water pH...",
        "Detecting hydrogen sulfide levels...",
        "Analyzing mineral composition..."
    ], uiCallbacks.agentUpdate);

    // Parallel Execution
    await Promise.all([mapperTask, bioTask, chemTask]);

    uiCallbacks.orchestrator("All agents reported back. Synthesizing data...");
    await new Promise(r => setTimeout(r, typeof window !== 'undefined' ? 1500 : 10));

    const finalReport = `### Executive Research Summary\n\n**Goal:** ${goal}\n\n**Findings:**\n- **Topography:** Found 3 major active thermal vents along the eastern ridge.\n- **Biology:** Detected novel extremophile bacteria thriving at 400°C.\n- **Chemistry:** High concentrations of hydrogen sulfide and iron confirmed around vent sites.\n\n**Conclusion:** The site presents a highly active, unmapped hydrothermal ecosystem.`;

    uiCallbacks.showReport(finalReport);
    uiCallbacks.orchestrator("Synthesis complete. Report generated.");

    return finalReport;
}

// UI Binding
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const deployBtn = document.getElementById('deploy-swarm-btn');
        const goalInput = document.getElementById('research-goal');
        const orchLog = document.getElementById('orchestrator-log');
        const swarmDash = document.getElementById('swarm-dashboard');
        const synthesisPanel = document.getElementById('synthesis-panel');
        const finalReportEl = document.getElementById('final-report');

        const agentsUI = {
            mapper: { log: document.getElementById('log-mapper'), ind: document.querySelector('#agent-mapper .status-indicator') },
            biologist: { log: document.getElementById('log-biologist'), ind: document.querySelector('#agent-biologist .status-indicator') },
            chemist: { log: document.getElementById('log-chemist'), ind: document.querySelector('#agent-chemist .status-indicator') }
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

            await orchestrateSwarm(goal, uiCallbacks);

            deployBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { orchestrateSwarm, simulateAgentTask };
}
