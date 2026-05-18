/**
 * Master Orchestrator for AGI Workforce Planning.
 */
async function runSubAgent(config, agentName, roleContext, goal, updateStatus) {
    updateStatus(`${agentName} initializing...`);

    const prompt = `
    You are the ${agentName} Sub-Agent.
    Context: ${roleContext}
    Goal: ${goal}

    Provide a specific, tactical 3-point plan to achieve your portion of the goal. Keep it concise.
    `;

    try {
        updateStatus(`${agentName} processing...`);
        let response = "";

        // Artificial delay for visualization in UI
        if (typeof window !== 'undefined') await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));

        if (config.provider === 'openai') {
            response = await fetchOpenAI(config.key, config.model, "You are a specialized HR sub-agent.", prompt);
        } else if (config.provider === 'anthropic') {
            response = await fetchAnthropic(config.key, config.model, "You are a specialized HR sub-agent.", prompt);
        } else {
            response = await fetchOllama(config.key, config.model, "You are a specialized HR sub-agent.", prompt);
        }

        updateStatus(`${agentName} complete.`);
        return response;
    } catch (e) {
        updateStatus(`Error: ${e.message}`);
        throw e;
    }
}

async function runMasterOrchestrator(config, goal, updateAgentStatus) {
    updateAgentStatus('master', 'Breaking down goal and spawning sub-agents...');

    // Spawn agents in parallel
    const agents = [
        {
            id: 'recruiting',
            name: 'Recruiting',
            context: 'Focus on hiring new talent to meet the new goal.'
        },
        {
            id: 'training',
            name: 'Training',
            context: 'Focus on upskilling existing employees to adapt to the new goal.'
        },
        {
            id: 'restructuring',
            name: 'Restructuring',
            context: 'Focus on reorganizing departments and managing layoffs/transfers if necessary.'
        }
    ];

    const agentPromises = agents.map(agent =>
        runSubAgent(
            config,
            agent.name,
            agent.context,
            goal,
            (status) => updateAgentStatus(agent.id, status)
        )
    );

    const results = await Promise.all(agentPromises);

    updateAgentStatus('master', 'Sub-agents finished. Synthesizing final strategy...');

    const synthesisPrompt = `
    High-Level Goal: ${goal}

    Recruiting Agent Output:
    ${results[0]}

    Training Agent Output:
    ${results[1]}

    Restructuring Agent Output:
    ${results[2]}

    Synthesize these parallel plans into a single, cohesive, unified Master Strategy Document. Resolve any conflicts and present a clear timeline. Use Markdown.
    `;

    let finalStrategy = "";
    if (config.provider === 'openai') {
        finalStrategy = await fetchOpenAI(config.key, config.model, "You are the AGI Master Orchestrator (Chief HR Officer).", synthesisPrompt);
    } else if (config.provider === 'anthropic') {
        finalStrategy = await fetchAnthropic(config.key, config.model, "You are the AGI Master Orchestrator (Chief HR Officer).", synthesisPrompt);
    } else {
        finalStrategy = await fetchOllama(config.key, config.model, "You are the AGI Master Orchestrator (Chief HR Officer).", synthesisPrompt);
    }

    return finalStrategy;
}

if (typeof document !== 'undefined') {
    document.getElementById('orchestrate-btn').addEventListener('click', async () => {
        const provider = document.getElementById('provider').value;
        const key = document.getElementById('apiKey').value;
        const model = document.getElementById('model').value;
        const goal = document.getElementById('goal').value;
        const resultBox = document.getElementById('result');

        resultBox.innerHTML = 'Orchestrating...';

        const updateStatus = (agentId, msg) => {
            if (agentId === 'master') {
                resultBox.innerHTML = `<em>${msg}</em>`;
                return;
            }
            const el = document.querySelector(`#agent-${agentId} .status`);
            const card = document.getElementById(`agent-${agentId}`);
            if (el) {
                el.innerHTML += `<div>> ${msg}</div>`;
                el.scrollTop = el.scrollHeight;
            }
            if (msg.includes('processing')) card.classList.add('working');
            if (msg.includes('complete') || msg.includes('Error')) card.classList.remove('working');
        };

        // Reset UI
        ['recruiting', 'training', 'restructuring'].forEach(id => {
            document.querySelector(`#agent-${id} .status`).innerHTML = '';
            document.getElementById(`agent-${id}`).classList.remove('working');
        });

        try {
            const result = await runMasterOrchestrator({ provider, key, model }, goal, updateStatus);
            resultBox.innerHTML = DOMPurify.sanitize(marked.parse(result));
        } catch (e) {
            resultBox.innerHTML = `<span style="color:red">Master Error: ${e.message}</span>`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runMasterOrchestrator };
}
