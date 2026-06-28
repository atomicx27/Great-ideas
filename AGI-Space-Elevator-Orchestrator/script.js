async function orchestrateElevatorSwarm(provider, apiKey, goal, fetchFunc) {
    const orchestratorPrompt = `You are the Master Orchestrator for the AGI Space Elevator Swarm.
Break down this goal into 3 distinct tasks for sub-agents: Logistics, Safety, and Engineering.
Return ONLY valid JSON matching this schema:
{
  "logistics_task": "task description",
  "safety_task": "task description",
  "engineering_task": "task description"
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
        throw new Error('Orchestrator failed to generate valid tasks.');
    }

    const subAgentPrompt = "You are a specialized sub-agent. Provide a brief (1-2 sentence) execution summary for your assigned task.";

    const runSubAgent = async (taskDesc) => {
        if (provider === 'openai') {
            return await fetchFunc.fetchOpenAI(apiKey, 'gpt-4o', subAgentPrompt, taskDesc);
        } else if (provider === 'anthropic') {
            return await fetchFunc.fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', subAgentPrompt, taskDesc);
        } else {
            return await fetchFunc.fetchOllama('http://localhost:11434', 'llama3', subAgentPrompt, taskDesc);
        }
    };

    const [logisticsRes, safetyRes, engRes] = await Promise.all([
        runSubAgent(tasks.logistics_task),
        runSubAgent(tasks.safety_task),
        runSubAgent(tasks.engineering_task)
    ]);

    return {
        tasks,
        results: {
            logistics: logisticsRes,
            safety: safetyRes,
            engineering: engRes
        }
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-swarm-btn');
        const logOutput = document.getElementById('swarm-log');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const goalInput = document.getElementById('goal-input');

        if (runBtn) {
            runBtn.addEventListener('click', async () => {
                const provider = providerSelect.value;
                const apiKey = apiKeyInput.value;
                const goal = goalInput.value.trim();

                if (!goal) {
                    logOutput.innerText = 'Error: Please provide a goal.';
                    return;
                }

                if ((provider === 'openai' || provider === 'anthropic') && !apiKey) {
                    logOutput.innerText = 'Error: API Key required for ' + provider;
                    return;
                }

                logOutput.innerText = '> Initializing AGI Swarm Master Orchestrator...\n> Analyzing goal...\n';

                try {
                    const result = await orchestrateElevatorSwarm(provider, apiKey, goal, window);

                    logOutput.innerText += `\n[Tasks Delegated]
- Logistics: ${result.tasks.logistics_task}
- Safety: ${result.tasks.safety_task}
- Engineering: ${result.tasks.engineering_task}

> Sub-agents executing in parallel...

[Swarm Results]
LOGISTICS AGENT: ${result.results.logistics}
SAFETY AGENT: ${result.results.safety}
ENGINEERING AGENT: ${result.results.engineering}

> Orchestration Complete.`;
                } catch (error) {
                    logOutput.innerText += `\n[CRITICAL ERROR]: ${error.message}`;
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateElevatorSwarm };
}
