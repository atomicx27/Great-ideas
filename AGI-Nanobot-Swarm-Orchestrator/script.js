/**
 * AGI Nanobot Swarm Orchestrator
 */

const TARGETING_PROMPT = "You are the Targeting Agent. Analyze the patient condition and determine exactly where the nanobot swarm should concentrate.";
const PAYLOAD_PROMPT = "You are the Payload Agent. Analyze the patient condition and determine what specific medication or action the nanobots should deliver.";
const LEADER_PROMPT = "You are the Swarm Leader Agent. Synthesize the input from the Targeting and Payload agents into a single, cohesive, executable directive for the nanobot swarm.";

/**
 * Orchestrates multiple agents to determine final swarm directive.
 * @param {string} patientCondition - Current patient condition
 * @param {function} updateLogFn - Callback to update individual logs (agentName, message)
 * @returns {Promise<string>} - Final directive
 */
async function orchestrateSwarm(patientCondition, updateLogFn = () => {}) {
    if (!patientCondition || patientCondition.trim() === '') {
        throw new Error("No patient condition provided.");
    }

    const fetchFn = (typeof fetchOpenAI !== 'undefined') ? fetchOpenAI : (typeof global !== 'undefined' && global.fetchOpenAI ? global.fetchOpenAI : null);

    if (!fetchFn) {
        throw new Error("fetchOpenAI is not defined.");
    }

    const apiKey = "dummy-api-key";

    try {
        // Parallel execution of specialized agents
        const [targetResponse, payloadResponse] = await Promise.all([
            fetchFn(apiKey, "gpt-4", TARGETING_PROMPT, `Condition: ${patientCondition}`, { temperature: 0.3 }).then(res => {
                updateLogFn('targeting', res);
                return res;
            }),
            fetchFn(apiKey, "gpt-4", PAYLOAD_PROMPT, `Condition: ${patientCondition}`, { temperature: 0.3 }).then(res => {
                updateLogFn('payload', res);
                return res;
            })
        ]);

        const leaderInput = `Targeting Agent plan: ${targetResponse}\nPayload Agent plan: ${payloadResponse}\nPatient Condition: ${patientCondition}`;

        const finalDirective = await fetchFn(apiKey, "gpt-4", LEADER_PROMPT, leaderInput, { temperature: 0.1 });

        updateLogFn('leader', finalDirective);
        return finalDirective;
    } catch (error) {
        updateLogFn('leader', `Orchestration Error: ${error.message}`);
        throw error;
    }
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchestrateBtn = document.getElementById('orchestrateBtn');
        const conditionInput = document.getElementById('patientCondition');
        const targetingLog = document.getElementById('targetingLog');
        const payloadLog = document.getElementById('payloadLog');
        const leaderLog = document.getElementById('leaderLog');

        function updateLog(agent, msg) {
            if (agent === 'targeting') targetingLog.textContent = msg;
            if (agent === 'payload') payloadLog.textContent = msg;
            if (agent === 'leader') leaderLog.textContent = msg;
        }

        if (orchestrateBtn) {
            orchestrateBtn.addEventListener('click', async () => {
                const data = conditionInput.value;
                if (!data) return;

                orchestrateBtn.disabled = true;
                orchestrateBtn.textContent = 'Deploying...';
                updateLog('targeting', 'Consulting Targeting Agent...');
                updateLog('payload', 'Consulting Payload Agent...');
                updateLog('leader', 'Awaiting specialized agent inputs...');

                try {
                    await orchestrateSwarm(data, updateLog);
                } catch (e) {
                    console.error(e);
                } finally {
                    orchestrateBtn.disabled = false;
                    orchestrateBtn.textContent = 'Deploy Swarm Intelligence';
                }
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateSwarm };
}
