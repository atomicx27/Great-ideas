async function runTaxAgent(goal, provider) {
    const prompt = `As the Tax Optimization Sub-Agent, analyze the following client scenario and provide 2 key strategies to minimize tax burden: ${goal}`;
    return await fetchLLMResponse(provider, prompt);
}
async function runRealEstateAgent(goal, provider) {
    const prompt = `As the Real Estate Sub-Agent, analyze the following client scenario and provide 2 key recommendations for real estate allocation: ${goal}`;
    return await fetchLLMResponse(provider, prompt);
}
async function runLegalAgent(goal, provider) {
    const prompt = `As the Legal & Trust Sub-Agent, analyze the following client scenario and provide 2 key steps for establishing multi-generational wealth vehicles: ${goal}`;
    return await fetchLLMResponse(provider, prompt);
}
async function synthesizeStrategy(goal, taxOutput, realEstateOutput, legalOutput, provider) {
    const prompt = `As the Master Wealth Orchestrator, synthesize the findings from your sub-agents into a cohesive Executive Wealth Strategy for the client's scenario: "${goal}".\nTax Strategies:\n${taxOutput}\nReal Estate Strategies:\n${realEstateOutput}\nLegal Strategies:\n${legalOutput}\nProvide a unified, structured Executive Summary highlighting the critical timeline and resolving any overlapping concerns.`;
    return await fetchLLMResponse(provider, prompt);
}
async function orchestrateWealthManagement(goal, provider, updateUI = () => {}) {
    updateUI('master', 'Breaking down scenario and spawning sub-agents...');
    const [taxOutput, realEstateOutput, legalOutput] = await Promise.all([
        runTaxAgent(goal, provider).then(res => { updateUI('agent-tax', res); return res; }),
        runRealEstateAgent(goal, provider).then(res => { updateUI('agent-realestate', res); return res; }),
        runLegalAgent(goal, provider).then(res => { updateUI('agent-legal', res); return res; })
    ]);
    updateUI('master', 'Synthesizing Sub-Agent Findings...');
    const finalStrategy = await synthesizeStrategy(goal, taxOutput, realEstateOutput, legalOutput, provider);
    updateUI('synthesis', finalStrategy);
    return finalStrategy;
}
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('start-swarm-btn');
        const container = document.getElementById('swarm-container');
        const masterStatus = document.getElementById('master-status');
        const synthesisNode = document.getElementById('synthesis-node');
        const finalStrategy = document.getElementById('final-strategy');

        function updateUI(node, data) {
            if (node === 'master') {
                masterStatus.textContent = data;
            } else if (node === 'synthesis') {
                masterStatus.textContent = "Strategy Complete.";
                synthesisNode.style.display = 'block';
                finalStrategy.textContent = data;
                btn.disabled = false;
            } else if (node.startsWith('agent-')) {
                const card = document.getElementById(node);
                card.querySelector('.loader').classList.add('hidden');
                card.querySelector('.agent-status').textContent = 'Completed';
                const output = card.querySelector('.agent-output');
                output.style.display = 'block';
                output.textContent = data;
            }
        }

        function resetUI() {
            container.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.textContent = '';
            document.querySelectorAll('.agent-card').forEach(card => {
                card.querySelector('.loader').classList.remove('hidden');
                card.querySelector('.agent-status').textContent = 'Processing...';
                const output = card.querySelector('.agent-output');
                output.style.display = 'none';
                output.textContent = '';
            });
        }

        btn.addEventListener('click', async () => {
            const goal = document.getElementById('agi-goal').value;
            const provider = document.getElementById('master-provider').value;
            btn.disabled = true;
            resetUI();
            await orchestrateWealthManagement(goal, provider, updateUI);
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { orchestrateWealthManagement, runTaxAgent, runRealEstateAgent, runLegalAgent, synthesizeStrategy };
