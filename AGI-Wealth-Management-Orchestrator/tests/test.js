const test = require('node:test');
const assert = require('node:assert');
global.fetchLLMResponse = async (provider, prompt) => {
    if (prompt.includes('Tax Optimization Sub-Agent')) return "Mock Tax Strategy";
    if (prompt.includes('Real Estate Sub-Agent')) return "Mock RE Strategy";
    if (prompt.includes('Legal & Trust Sub-Agent')) return "Mock Legal Strategy";
    if (prompt.includes('Master Wealth Orchestrator')) return "Mock Master Synthesis";
    return "Generic Mock";
};
const { orchestrateWealthManagement } = require('../script.js');
test('AGI Wealth Orchestrator - Full swarm lifecycle', async () => {
    let uiUpdates = [];
    const mockUpdateUI = (node, data) => uiUpdates.push(node);
    const finalStrategy = await orchestrateWealthManagement('Test Goal', 'openai', mockUpdateUI);
    assert.strictEqual(finalStrategy, 'Mock Master Synthesis');
    assert.ok(uiUpdates.includes('master'));
    assert.ok(uiUpdates.includes('agent-tax'));
    assert.ok(uiUpdates.includes('agent-realestate'));
    assert.ok(uiUpdates.includes('agent-legal'));
    assert.ok(uiUpdates.includes('synthesis'));
});
