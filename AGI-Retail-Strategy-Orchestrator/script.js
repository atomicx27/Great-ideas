function simulateAgentExecution(agentType, goal) {
    const responses = {
        marketing: "Run localized social media campaigns focusing on exclusivity.",
        logistics: "Reroute through secondary ports and air-freight premium items.",
        pricing: "Increase base price by 15% to offset air-freight costs."
    };
    return responses[agentType];
}

function synthesizeStrategy(marketing, logistics, pricing) {
    return `EXECUTIVE SUMMARY:
- Marketing: ${marketing}
- Logistics: ${logistics}
- Pricing: ${pricing}

SYNERGY PLAN: Ensure marketing messaging highlights the premium nature of the air-freighted stock to justify the 15% price increase, turning the logistical challenge into an exclusivity selling point.`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const executeBtn = document.getElementById('orchestrate-btn');
        const goalInput = document.getElementById('goal-input');
        const finalOutput = document.getElementById('final-output');

        const agents = ['marketing', 'logistics', 'pricing'];

        executeBtn.addEventListener('click', () => {
            const goal = goalInput.value.trim() || 'Default Goal';
            executeBtn.disabled = true;
            finalOutput.textContent = 'Orchestrator is spawning sub-agents...';

            let completedAgents = 0;
            const agentResults = {};

            agents.forEach(agent => {
                const box = document.getElementById(`agent-${agent}`);
                const status = document.getElementById(`status-${agent}`);

                box.classList.add('active');
                status.textContent = 'Analyzing goal constraints...';

                setTimeout(() => {
                    agentResults[agent] = simulateAgentExecution(agent, goal);
                    status.textContent = 'Task Complete.';
                    box.classList.remove('active');
                    completedAgents++;

                    if (completedAgents === agents.length) {
                        finalOutput.textContent = 'Synthesizing parallel outputs...';
                        setTimeout(() => {
                            const finalPlan = synthesizeStrategy(
                                agentResults.marketing,
                                agentResults.logistics,
                                agentResults.pricing
                            );
                            finalOutput.textContent = finalPlan;
                            executeBtn.disabled = false;
                        }, 1000);
                    }
                }, 1500 + Math.random() * 1500); // random delay between 1.5s and 3s
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { simulateAgentExecution, synthesizeStrategy };
}
