async function orchestrateDeepSpace(mission, simulateSubAgent) {
    try {
        const [navResult, spectroResult, commsResult] = await Promise.all([
            simulateSubAgent('nav', 'Calculating orbital insertion vectors', 2500, "Orbital trajectory locked. Thruster burn scheduled."),
            simulateSubAgent('spectro', 'Deploying observation array', 3000, "Sensors online. Beginning atmospheric spectral analysis."),
            simulateSubAgent('comms', 'Establishing quantum relay link', 2000, "Comms relay stable. Ping latency nominal.")
        ]);

        return `MISSION BRIEFING UPDATE\n\nGoal: ${mission}\n\nSub-Agent Status:\n- Nav-Agent: ${navResult}\n- Spectro-Agent: ${spectroResult}\n- Comms-Agent: ${commsResult}\n\nOverall Status: All systems green. Proceeding with observation phase.`;
    } catch (error) {
        throw new Error(`Orchestration failed: ${error}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-orchestrator-btn');
        const outputLog = document.getElementById('output-log');
        const missionInput = document.getElementById('mission-input');

        const agents = {
            master: document.getElementById('agent-master'),
            nav: document.getElementById('agent-nav'),
            spectro: document.getElementById('agent-spectro'),
            comms: document.getElementById('agent-comms')
        };

        function setAgentStatus(agentKey, statusText, stateClass) {
            const el = agents[agentKey];
            el.className = `agent-card ${stateClass}`;
            el.querySelector('.status').textContent = statusText;
        }

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
            const mission = missionInput.value;
            outputLog.innerHTML = '';
            startBtn.disabled = true;

            Object.keys(agents).forEach(k => setAgentStatus(k, 'Waiting', ''));

            setAgentStatus('master', 'Deconstructing Mission...', 'status-active');
            await new Promise(r => setTimeout(r, 1200));

            setAgentStatus('master', 'Deploying Swarm...', 'status-active');

            try {
                const finalReport = await orchestrateDeepSpace(mission, simulateSubAgent);

                setAgentStatus('master', 'Synthesizing Telemetry...', 'status-active');
                await new Promise(r => setTimeout(r, 1200));

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
    module.exports = { orchestrateDeepSpace };
}
