async function orchestrateGlobalTelesurgery(provider, apiKey, goal, fetchFunc) {
    const orchestratorPrompt = `You are the Master Orchestrator for AGI Telesurgery.
Break down this procedure goal into 3 tasks for sub-agents: Network (latency), Robotics (kinematics), and Medical (patient safety).
Return ONLY valid JSON matching this schema:
{
  "network_task": "task desc",
  "robotics_task": "task desc",
  "medical_task": "task desc"
}`;

    let orchestratorResponse;
    if (provider === 'openai') {
        orchestratorResponse = await fetchFunc.fetchOpenAI(apiKey, 'gpt-4o', orchestratorPrompt, goal);
    } else if (provider === 'anthropic') {
        orchestratorResponse = await fetchFunc.fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', orchestratorPrompt, goal);
    } else {
        orchestratorResponse = await fetchFunc.fetchOllama('http://localhost:11434', 'llama3', orchestratorPrompt, goal);
    }

    let tasks;
    try {
        const match = orchestratorResponse.match(/\{[\s\S]*\}/);
        tasks = JSON.parse(match[0]);
    } catch (e) {
        throw new Error('Orchestrator failed to parse tasks.');
    }

    const subAgentPrompt = "You are a specialized surgical sub-agent. Provide a brief 1-sentence execution status.";

    const runSubAgent = async (taskDesc) => {
        if (provider === 'openai') {
            return await fetchFunc.fetchOpenAI(apiKey, 'gpt-4o', subAgentPrompt, taskDesc);
        } else if (provider === 'anthropic') {
            return await fetchFunc.fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', subAgentPrompt, taskDesc);
        } else {
            return await fetchFunc.fetchOllama('http://localhost:11434', 'llama3', subAgentPrompt, taskDesc);
        }
    };

    const [netRes, robRes, medRes] = await Promise.all([
        runSubAgent(tasks.network_task),
        runSubAgent(tasks.robotics_task),
        runSubAgent(tasks.medical_task)
    ]);

    return {
        tasks,
        results: { network: netRes, robotics: robRes, medical: medRes }
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('run-swarm-btn');
        const logOutput = document.getElementById('swarm-log');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const goalInput = document.getElementById('goal-input');

        if (btn) {
            btn.addEventListener('click', async () => {
                const provider = providerSelect.value;
                const apiKey = apiKeyInput.value;
                const goal = goalInput.value.trim();

                if ((provider === 'openai' || provider === 'anthropic') && !apiKey) {
                    logOutput.innerText = 'Error: API Key required.';
                    return;
                }

                logOutput.innerText = '> Initializing Telesurgery Orchestrator...\n';

                try {
                    const result = await orchestrateGlobalTelesurgery(provider, apiKey, goal, window);
                    logOutput.innerText += `
[Delegated Tasks]
Network: ${result.tasks.network_task}
Robotics: ${result.tasks.robotics_task}
Medical: ${result.tasks.medical_task}

[Agent Reports]
NET: ${result.results.network}
ROB: ${result.results.robotics}
MED: ${result.results.medical}

> Procedure running smoothly.`;
                } catch (error) {
                    logOutput.innerText += `\n[ERROR]: ${error.message}`;
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateGlobalTelesurgery };
}
