const test = require('node:test');
const assert = require('node:assert');
const { executeClimateOrchestrator } = require('../script.js');

test('AGI-Climate-Mitigation-Orchestrator parallel execution', async (t) => {
    let masterUpdates = [];
    let agentFlags = { weather: false, agri: false, policy: false };

    const mockCallbacks = {
        weather: (status, msg) => { if (status === 'done') agentFlags.weather = true; },
        agri: (status, msg) => { if (status === 'done') agentFlags.agri = true; },
        policy: (status, msg) => { if (status === 'done') agentFlags.policy = true; },
        masterUpdate: (msg) => { masterUpdates.push(msg); }
    };

    const llmConfig = { provider: 'mock', apiKey: '' };

    const finalOutput = await executeClimateOrchestrator('Test Crisis', llmConfig, mockCallbacks);

    // Verify all agents completed
    assert.ok(agentFlags.weather, 'Weather agent did not finish');
    assert.ok(agentFlags.agri, 'Agri agent did not finish');
    assert.ok(agentFlags.policy, 'Policy agent did not finish');

    // Verify master synthesis incorporates agent outputs
    assert.ok(finalOutput.includes('CLIMATOLOGY FORECAST:'));
    assert.ok(finalOutput.includes('AGRI-ECONOMIC IMPACT:'));
    assert.ok(finalOutput.includes('POLICY INTERVENTION:'));
});