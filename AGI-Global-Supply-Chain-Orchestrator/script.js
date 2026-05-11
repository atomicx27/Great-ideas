document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-swarm-btn');
    const swarmContainer = document.getElementById('swarm-container');
    const synthesisNode = document.getElementById('synthesis-node');
    const masterStatus = document.getElementById('master-status');
    const finalStrategy = document.getElementById('final-strategy');

    const agents = {
        logistics: { card: document.getElementById('agent-logistics'), status: document.querySelector('#agent-logistics .agent-status'), output: document.querySelector('#agent-logistics .agent-output') },
        risk: { card: document.getElementById('agent-risk'), status: document.querySelector('#agent-risk .agent-status'), output: document.querySelector('#agent-risk .agent-output') },
        demand: { card: document.getElementById('agent-demand'), status: document.querySelector('#agent-demand .agent-status'), output: document.querySelector('#agent-demand .agent-output') }
    };

    function appendAgentLog(agentKey, message) {
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        agents[agentKey].output.appendChild(p);
        agents[agentKey].output.scrollTop = agents[agentKey].output.scrollHeight;
    }

    function setAgentState(agentKey, isActive, statusText) {
        agents[agentKey].status.textContent = statusText;
        if (isActive) {
            agents[agentKey].card.classList.add('active');
        } else {
            agents[agentKey].card.classList.remove('active');
        }
    }

    const simulateAgentProcessing = async (agentKey, task, steps) => {
        setAgentState(agentKey, true, "Processing...");
        for (let step of steps) {
            await new Promise(r => setTimeout(r, Math.random() * 1500 + 500));
            appendAgentLog(agentKey, step);
        }
        setAgentState(agentKey, false, "Task Complete");
        return `Report from ${agentKey}`;
    };

    startBtn.addEventListener('click', async () => {
        const goal = document.getElementById('agi-goal').value;
        const provider = document.getElementById('master-provider').value;

        // Reset UI
        startBtn.disabled = true;
        swarmContainer.style.display = 'flex';
        synthesisNode.style.display = 'none';
        finalStrategy.innerHTML = '';
        Object.keys(agents).forEach(k => {
            agents[k].output.innerHTML = '';
            setAgentState(k, false, "Pending...");
        });

        masterStatus.textContent = `[${provider.toUpperCase()}] Master Deconstructing Goal...`;

        await new Promise(r => setTimeout(r, 2000));
        masterStatus.textContent = "Spawning Sub-Agents for Parallel Execution";

        // Define parallel tasks
        const logisticsSteps = [
            "Analyzing Suez Canal blockage data.",
            "Calculating reroute costs via Cape of Good Hope.",
            "Checking air freight availability for high-margin items.",
            "Drafting logistics reroute plan."
        ];

        const riskSteps = [
            "Assessing political instability near alternative ports.",
            "Evaluating financial impact of delayed Q4 inventory.",
            "Checking supplier contractual penalties for delays.",
            "Compiling risk mitigation matrix."
        ];

        const demandSteps = [
            "Analyzing historical Q4 sales data.",
            "Adjusting forecast based on silicon shortage impact on competitor stock.",
            "Identifying priority SKUs to fulfill first.",
            "Finalizing demand priority list."
        ];

        // Execute agents in parallel
        await Promise.all([
            simulateAgentProcessing('logistics', 'Reroute shipping', logisticsSteps),
            simulateAgentProcessing('risk', 'Assess delay impact', riskSteps),
            simulateAgentProcessing('demand', 'Prioritize SKUs', demandSteps)
        ]);

        masterStatus.textContent = "Synthesizing Sub-Agent Reports...";
        await new Promise(r => setTimeout(r, 2000));

        // Final Synthesis
        masterStatus.textContent = "Orchestration Complete. Strategy Ready.";
        synthesisNode.style.display = 'block';

        finalStrategy.innerHTML = `
            <p><strong>Executive Summary:</strong> To optimize Q4 launches amidst current constraints, the Swarm recommends a hybrid fulfillment strategy.</p>
            <ul>
                <li><strong>Logistics:</strong> Shift top 15% margin SKUs to air freight. Reroute remaining bulk sea freight via Cape of Good Hope.</li>
                <li><strong>Demand Priority:</strong> Allocate existing silicon inventory strictly to flagship models to maximize revenue.</li>
                <li><strong>Risk Mitigation:</strong> Prepare PR statements regarding potential delays for lower-tier models and review supplier force majeure clauses.</li>
            </ul>
        `;

        startBtn.disabled = false;
    });
});