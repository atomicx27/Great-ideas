/**
 * AGI Interstellar Mission Orchestrator
 */

const NAV_PROMPT = "You are the Navigation Agent. Assess the situation and provide navigation-related recommendations.";
const LIFE_SUPPORT_PROMPT = "You are the Life Support Agent. Assess the situation and provide life-support-related recommendations (e.g., power allocation to shielding vs life support).";
const COMMANDER_PROMPT = "You are the Commander Agent. Review the input from the specialized agents and output a single, decisive mission directive.";

/**
 * Orchestrates multiple agents to determine final mission directive.
 * @param {string} missionStatus - Current mission status
 * @param {function} updateLogFn - Callback to update individual logs (agentName, message)
 * @returns {Promise<string>} - Final directive
 */
async function orchestrateMission(missionStatus, updateLogFn = () => {}) {
    if (!missionStatus || missionStatus.trim() === '') {
        throw new Error("No mission status provided.");
    }

    const fetchFn = (typeof fetchOpenAI !== 'undefined') ? fetchOpenAI : (typeof global !== 'undefined' && global.fetchOpenAI ? global.fetchOpenAI : null);

    if (!fetchFn) {
        throw new Error("fetchOpenAI is not defined.");
    }

    const apiKey = "dummy-api-key";

    try {
        // Parallel execution of specialized agents
        const [navResponse, lifeSupportResponse] = await Promise.all([
            fetchFn(apiKey, "gpt-4", NAV_PROMPT, `Status: ${missionStatus}`, { temperature: 0.3 }).then(res => {
                updateLogFn('nav', res);
                return res;
            }),
            fetchFn(apiKey, "gpt-4", LIFE_SUPPORT_PROMPT, `Status: ${missionStatus}`, { temperature: 0.3 }).then(res => {
                updateLogFn('lifeSupport', res);
                return res;
            })
        ]);

        const commanderInput = `Navigation Agent says: ${navResponse}\nLife Support Agent says: ${lifeSupportResponse}\nCurrent Status: ${missionStatus}`;

        const finalDirective = await fetchFn(apiKey, "gpt-4", COMMANDER_PROMPT, commanderInput, { temperature: 0.1 });

        updateLogFn('commander', finalDirective);
        return finalDirective;
    } catch (error) {
        updateLogFn('commander', `Orchestration Error: ${error.message}`);
        throw error;
    }
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchestrateBtn = document.getElementById('orchestrateBtn');
        const statusInput = document.getElementById('missionStatus');
        const navLog = document.getElementById('navLog');
        const lifeSupportLog = document.getElementById('lifeSupportLog');
        const commanderLog = document.getElementById('commanderLog');

        function updateLog(agent, msg) {
            if (agent === 'nav') navLog.textContent = msg;
            if (agent === 'lifeSupport') lifeSupportLog.textContent = msg;
            if (agent === 'commander') commanderLog.textContent = msg;
        }

        if (orchestrateBtn) {
            orchestrateBtn.addEventListener('click', async () => {
                const data = statusInput.value;
                if (!data) return;

                orchestrateBtn.disabled = true;
                orchestrateBtn.textContent = 'Orchestrating...';
                updateLog('nav', 'Consulting Navigation Agent...');
                updateLog('lifeSupport', 'Consulting Life Support Agent...');
                updateLog('commander', 'Awaiting specialized agent inputs...');

                try {
                    await orchestrateMission(data, updateLog);
                } catch (e) {
                    console.error(e);
                } finally {
                    orchestrateBtn.disabled = false;
                    orchestrateBtn.textContent = 'Orchestrate Mission';
                }
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateMission };
}
