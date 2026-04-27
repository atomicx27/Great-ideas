document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById('provider-select');
    const apiKeyGroup = document.getElementById('api-key-group');
    const modelGroup = document.getElementById('model-group');
    const runBtn = document.getElementById('run-swarm-btn');
    const orchestratorView = document.getElementById('orchestrator-view');
    const agentsGrid = document.getElementById('agents-grid');
    const finalOutput = document.getElementById('final-output');
    const goalPrompt = document.getElementById('goal-prompt');

    // UI Logic for Provider Selection
    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'ollama') {
            apiKeyGroup.style.display = 'none';
            modelGroup.style.display = 'block';
        } else {
            apiKeyGroup.style.display = 'block';
            modelGroup.style.display = 'none';
        }
    });

    const subAgents = [
        { id: 'math', name: 'Mathematics Expert', icon: 'fa-calculator', type: 'math', role: 'Focus on quantitative analysis, data interpretation, and mathematical modeling related to the goal.' },
        { id: 'science', name: 'Science Expert', icon: 'fa-flask', type: 'science', role: 'Focus on empirical principles, physical phenomena, and scientific method related to the goal.' },
        { id: 'literature', name: 'Literature & Comm Expert', icon: 'fa-book', type: 'literature', role: 'Focus on historical context, societal impact, reading materials, and communication skills related to the goal.' }
    ];

    function createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = `agent-card ${agent.type}`;
        card.id = `card-${agent.id}`;
        card.innerHTML = `
            <div class="agent-header">
                <i class="fa-solid ${agent.icon}"></i> ${agent.name}
            </div>
            <div class="agent-status" id="status-${agent.id}">Waiting for assignment...</div>
            <div class="agent-output" id="output-${agent.id}"></div>
        `;
        agentsGrid.appendChild(card);
    }

    // Simulated API Call
    async function simulateLLMCall(systemPrompt, userPrompt, delay = 2000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let response = `Based on my expertise, here are the key curriculum components for:\n"${userPrompt}"\n\n`;
                if (systemPrompt.includes('quantitative')) {
                    response += "1. Calculate energy output of solar panels (W = V x A).\n2. Graph energy consumption over time.\n3. Statistical analysis of carbon emissions.";
                } else if (systemPrompt.includes('empirical')) {
                    response += "1. Build a basic circuit to understand electricity flow.\n2. Study the physics of wind turbines.\n3. Chemical reactions in batteries.";
                } else if (systemPrompt.includes('historical')) {
                    response += "1. Read case studies on the Industrial Revolution.\n2. Debate the socio-economic impacts of transitioning to green energy.\n3. Write a persuasive essay on conservation.";
                } else if (systemPrompt.includes('Master Orchestrator')) {
                    response = `### Synthesized STEM Curriculum: Sustainable Energy (4 Weeks)\n\n#### Week 1: Foundations\n- **Science**: Build a basic circuit to understand electricity flow.\n- **Math**: Intro to energy metrics.\n- **Lit**: Read historical impacts of early energy sources.\n\n#### Week 2: Deep Dive into Renewables\n- **Science**: Study the physics of wind turbines.\n- **Math**: Calculate energy output of solar panels (W = V x A).\n- **Lit**: Debate socio-economic impacts.\n\n#### Week 3 & 4: Application & Synthesis\n[Further integration of the sub-agent outputs...]\n\n*This curriculum effectively balances quantitative analysis, scientific inquiry, and societal context.*`;
                }
                resolve(response);
            }, delay + Math.random() * 2000); // Add randomness to simulate parallel processing
        });
    }

    runBtn.addEventListener('click', async () => {
        const goal = goalPrompt.value;
        const provider = providerSelect.value;

        // Reset UI
        orchestratorView.classList.remove('hidden');
        agentsGrid.innerHTML = '';
        finalOutput.innerHTML = 'Master Orchestrator is assigning tasks... <i class="fa-solid fa-spinner spinner"></i>';
        runBtn.disabled = true;

        subAgents.forEach(agent => createAgentCard(agent));

        try {
            // Spawn sub-agents in parallel
            const agentPromises = subAgents.map(async (agent) => {
                const statusEl = document.getElementById(`status-${agent.id}`);
                const outputEl = document.getElementById(`output-${agent.id}`);

                statusEl.innerHTML = `Analyzing goal... <i class="fa-solid fa-spinner spinner"></i>`;

                // Simulate BYOK API call
                const response = await simulateLLMCall(agent.role, goal);

                // Secure DOM update using textContent
                statusEl.innerHTML = `<span style="color: green;">Task Complete <i class="fa-solid fa-check"></i></span>`;
                outputEl.textContent = response;

                return { name: agent.name, response: response };
            });

            // Wait for all sub-agents to finish
            const agentResults = await Promise.all(agentPromises);

            finalOutput.innerHTML = 'All sub-agents complete. Synthesizing final curriculum... <i class="fa-solid fa-spinner spinner"></i>';

            // Master Orchestrator Synthesis
            const synthesisPrompt = `You are the Master Orchestrator. Synthesize the following expert inputs into a cohesive curriculum for the goal: "${goal}"`;
            const finalResult = await simulateLLMCall(synthesisPrompt, JSON.stringify(agentResults), 3000);

            // Secure DOM update
            finalOutput.textContent = finalResult;

        } catch (error) {
            finalOutput.textContent = `Error during swarm execution: ${error}`;
        } finally {
            runBtn.disabled = false;
        }
    });
});