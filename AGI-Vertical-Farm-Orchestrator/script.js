async function orchestrateFarmSwarm(goal, simulateSubAgent) {
    try {
        // Run sub-agents concurrently
        const [climateResult, harvestResult] = await Promise.all([
            simulateSubAgent('climate', 'Optimizing HVAC & LED profiles', 2000, "Energy consumption reduced by 15% via dynamic LED pulsing and optimized airflow in Sector 4."),
            simulateSubAgent('harvest', 'Scheduling automated pickers', 2500, "Harvesting scheduled for optimal phytonutrient peak. Yield projected to increase by 8%.")
        ]);

        return `ORCHESTRATION COMPLETE\n\nGoal: ${goal}\n\nSub-Agent Reports:\n- Climate Agent: ${climateResult}\n- Harvest Agent: ${harvestResult}\n\nStatus: Swarm aligned. Execution proceeding.`;
    } catch (error) {
        throw new Error(`Orchestration failed: ${error}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-orchestrator-btn');
        const outputLog = document.getElementById('output-log');
        const goalInput = document.getElementById('goal-input');

        const agents = {
            master: document.getElementById('agent-master'),
            climate: document.getElementById('agent-climate'),
            harvest: document.getElementById('agent-harvest')
        };

        function setAgentStatus(agentKey, statusText, stateClass) {
            const el = agents[agentKey];
            el.className = `agent-card ${stateClass}`;
            el.querySelector('.status').textContent = statusText;
        }

        const simulateSubAgent = (key, taskName, delay, result) => {
            return new Promise(resolve => {
                setAgentStatus(key, `Working: ${taskName}...`, 'status-active');
                setTimeout(() => {
                    setAgentStatus(key, 'Task Complete', 'status-complete');
                    resolve(result);
                }, delay);
            });
        };

        startBtn.addEventListener('click', async () => {
            const goal = goalInput.value;
            outputLog.innerHTML = '';
            startBtn.disabled = true;

            Object.keys(agents).forEach(k => setAgentStatus(k, 'Waiting', ''));

            setAgentStatus('master', 'Analyzing Goal...', 'status-active');
            await new Promise(r => setTimeout(r, 1000));

            setAgentStatus('master', 'Orchestrating Sub-Agents...', 'status-active');

            try {
                const finalReport = await orchestrateFarmSwarm(goal, simulateSubAgent);

                setAgentStatus('master', 'Synthesizing Data...', 'status-active');
                await new Promise(r => setTimeout(r, 1000));

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateFarmSwarm };
}
