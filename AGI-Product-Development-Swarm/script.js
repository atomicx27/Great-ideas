document.addEventListener('DOMContentLoaded', () => {
    // Settings UI
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings');
    const settingsPanel = document.getElementById('settings-panel');

    settingsBtn.addEventListener('click', () => settingsPanel.classList.remove('hidden'));
    closeSettings.addEventListener('click', () => settingsPanel.classList.add('hidden'));

    // Swarm UI
    const goalInput = document.getElementById('goal-input');
    const launchBtn = document.getElementById('launch-btn');
    const swarmDashboard = document.getElementById('swarm-dashboard');
    const orchestratorText = document.getElementById('orchestrator-text');
    const finalOutputSection = document.getElementById('final-output-section');
    const finalOutput = document.getElementById('final-output');

    // Agent Elements
    const agents = {
        research: { log: document.getElementById('log-research'), indicator: document.querySelector('#agent-research .status-indicator') },
        design: { log: document.getElementById('log-design'), indicator: document.querySelector('#agent-design .status-indicator') },
        engineering: { log: document.getElementById('log-engineering'), indicator: document.querySelector('#agent-engineering .status-indicator') }
    };

    function updateAgentStatus(agentKey, status, message) {
        const agent = agents[agentKey];
        agent.log.innerText = message + '\n\n' + agent.log.innerText;

        agent.indicator.className = 'status-indicator';
        if (status) agent.indicator.classList.add(status);
    }

    async function simulateAgentWork(agentKey, steps) {
        updateAgentStatus(agentKey, 'working', 'Agent started.');

        for (let step of steps) {
            await new Promise(r => setTimeout(r, Math.random() * 1500 + 1000)); // Random delay 1-2.5s
            updateAgentStatus(agentKey, 'working', step);
        }

        updateAgentStatus(agentKey, 'done', 'Task completed successfully.');
        return `${agentKey} output generated.`;
    }

    launchBtn.addEventListener('click', async () => {
        const goal = goalInput.value.trim();
        if (!goal) return;

        swarmDashboard.classList.remove('hidden');
        finalOutputSection.classList.add('hidden');
        launchBtn.disabled = true;

        // Phase 1: Master Orchestrator Analysis
        orchestratorText.innerText = `Analyzing goal: "${goal}"... Breaking down into sub-tasks.`;
        await new Promise(r => setTimeout(r, 2000));

        orchestratorText.innerText = "Spawning specialized sub-agents. Executing tasks in parallel.";

        // Phase 2: Parallel Swarm Execution
        const researchTask = simulateAgentWork('research', [
            "Scraping competitor websites...",
            "Identifying market gaps...",
            "Compiling user persona data..."
        ]);

        const designTask = simulateAgentWork('design', [
            "Generating wireframes based on initial prompt...",
            "Selecting color palette...",
            "Creating component library..."
        ]);

        const engTask = simulateAgentWork('engineering', [
            "Setting up project boilerplate...",
            "Configuring database schema...",
            "Writing API endpoints..."
        ]);

        // Wait for all agents to finish (Parallel execution simulation)
        await Promise.all([researchTask, designTask, engTask]);

        // Phase 3: Synthesis
        orchestratorText.innerText = "All agents completed. Synthesizing final product architecture...";
        await new Promise(r => setTimeout(r, 2000));

        orchestratorText.innerText = "Product Development Cycle Complete.";
        finalOutput.innerText = `[FINAL ARCHITECTURE FOR: ${goal}]\n\n- Competitor Analysis: Complete\n- UI/UX Wireframes: Generated\n- Codebase Repository: Initialized\n- Database Schema: Deployed\n\nStatus: Ready for human review.`;
        finalOutputSection.classList.remove('hidden');
        launchBtn.disabled = false;
    });
});