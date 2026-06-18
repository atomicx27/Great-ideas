const test = require('node:test');
const assert = require('node:assert');

global.fetchLLMResponse = async (provider, prompt) => {
    if (prompt.includes('Threat Intelligence Sub-Agent')) return "Mock Threat Strategy";
    if (prompt.includes('Policy & Legal Sub-Agent')) return "Mock Policy Strategy";
    if (prompt.includes('Crisis Communications Sub-Agent')) return "Mock Comms Strategy";
    if (prompt.includes('Master Safety Orchestrator')) return "Mock Master Safety Synthesis";
    return "Generic Mock";
};

const { orchestrateSafetySwarm } = require('../script.js');

test('AGI Safety Orchestrator - Full swarm lifecycle', async () => {
    let uiUpdates = [];
    const mockUpdateUI = (node, data) => uiUpdates.push(node);

    const finalPlan = await orchestrateSafetySwarm('Test Incident', 'openai', mockUpdateUI);

    assert.strictEqual(finalPlan, 'Mock Master Safety Synthesis');
    assert.ok(uiUpdates.includes('master'));
    assert.ok(uiUpdates.includes('agent-threat'));
    assert.ok(uiUpdates.includes('agent-policy'));
    assert.ok(uiUpdates.includes('agent-comms'));
    assert.ok(uiUpdates.includes('synthesis'));
});
