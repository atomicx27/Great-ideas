function simulateAgentExecution(agentType, crisis) {
    const responses = {
        water: "Divert emergency flow from reservoir Alpha; restrict agricultural allocations by 30%.",
        wildlife: "Initiate emergency relocation of endangered amphibians to captive breeding centers.",
        community: "Deploy mobile water stations; subsidize farmers for lost yields."
    };
    return responses[agentType];
}

function synthesizeStrategy(water, wildlife, community) {
    return `EXECUTIVE ECOLOGICAL MITIGATION STRATEGY:
- Water Resources: ${water}
- Wildlife Mgmt: ${wildlife}
- Community Impact: ${community}

SYNERGY PLAN: Use the 30% restricted agricultural water allocation to sustain the relocated amphibian centers locally, reducing transport stress, while ensuring subsidies offset farmer income loss.`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const executeBtn = document.getElementById('orchestrate-btn');
        const crisisInput = document.getElementById('crisis-input');
        const finalOutput = document.getElementById('final-output');

        const agents = ['water', 'wildlife', 'community'];

        executeBtn.addEventListener('click', () => {
            const crisis = crisisInput.value.trim() || 'Default Crisis';
            executeBtn.disabled = true;
            finalOutput.textContent = 'Orchestrator is deploying sub-agents...';

            let completedAgents = 0;
            const agentResults = {};

            agents.forEach(agent => {
                const box = document.getElementById(`agent-${agent}`);
                const status = document.getElementById(`status-${agent}`);

                box.classList.add('active');
                status.textContent = 'Analyzing environmental variables...';

                setTimeout(() => {
                    agentResults[agent] = simulateAgentExecution(agent, crisis);
                    status.textContent = 'Assessment Complete.';
                    box.classList.remove('active');
                    completedAgents++;

                    if (completedAgents === agents.length) {
                        finalOutput.textContent = 'Synthesizing parallel ecological outputs...';
                        setTimeout(() => {
                            const finalPlan = synthesizeStrategy(
                                agentResults.water,
                                agentResults.wildlife,
                                agentResults.community
                            );
                            finalOutput.textContent = finalPlan;
                            executeBtn.disabled = false;
                        }, 1200);
                    }
                }, 1500 + Math.random() * 2000);
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { simulateAgentExecution, synthesizeStrategy };
}
