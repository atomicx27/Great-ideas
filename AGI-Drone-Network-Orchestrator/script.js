if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-orchestrator-btn');
        const outputLog = document.getElementById('output-log');
        const crisisInput = document.getElementById('crisis-input');

        // Agent DOM elements
        const agents = {
            master: document.getElementById('agent-master'),
            nav: document.getElementById('agent-nav'),
            fleet: document.getElementById('agent-fleet'),
            comms: document.getElementById('agent-comms')
        };

        function setAgentStatus(agentKey, statusText, stateClass) {
            const el = agents[agentKey];
            el.className = `agent-card ${stateClass}`;
            el.querySelector('.status').textContent = statusText;
        }

        // Simulate parallel execution of sub-agents
        const simulateSubAgent = (key, taskName, delay, result) => {
            return new Promise(resolve => {
                setAgentStatus(key, `Executing: ${taskName}...`, 'status-active');
                setTimeout(() => {
                    setAgentStatus(key, 'Task Complete', 'status-complete');
                    resolve(result);
                }, delay);
            });
        };

        startBtn.addEventListener('click', async () => {
            const goal = crisisInput.value;
            outputLog.innerHTML = '';
            startBtn.disabled = true;

            // Reset UI
            Object.keys(agents).forEach(k => setAgentStatus(k, 'Waiting', ''));

            setAgentStatus('master', 'Deconstructing Goal...', 'status-active');

            try {
                // Simulate Master Orchestrator thought process delay
                await new Promise(r => setTimeout(r, 1500));

                setAgentStatus('master', 'Orchestrating Swarm...', 'status-active');

                // Fire off sub-agents in parallel
                const [navResult, fleetResult, commsResult] = await Promise.all([
                    simulateSubAgent('nav', 'Activating IMUs', 2500, "All drones switched to Inertial Measurement Units. GPS dependency disabled."),
                    simulateSubAgent('fleet', 'Calculating Safe Vectors', 3500, "Calculated collision-free altitude stratification vectors for 450 active drones."),
                    simulateSubAgent('comms', 'Drafting Alerts', 2000, "Customer notifications dispatched detailing minor delivery delays due to airspace anomaly.")
                ]);

                setAgentStatus('master', 'Synthesizing Data...', 'status-active');

                // Simulate Master synthesizing results
                await new Promise(r => setTimeout(r, 1500));

                const finalReport = `EXECUTIVE SUMMARY: CRISIS MITIGATED\n\nGoal: ${goal}\n\nOutputs:\n- Navigation: ${navResult}\n- Rerouting: ${fleetResult}\n- Comms: ${commsResult}\n\nStatus: Network stabilized. Awaiting GPS signal restoration.`;

                outputLog.textContent = finalReport;
                setAgentStatus('master', 'Standby', 'status-complete');

            } catch (error) {
                outputLog.textContent = `CRITICAL FAILURE: ${error}`;
                setAgentStatus('master', 'Failed', '');
            } finally {
                startBtn.disabled = false;
            }
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}