const test = require('node:test');
const assert = require('node:assert');
const { executeMasterOrchestrator } = require('../script.js');

test('AGI-Workforce-Orchestrator parallel execution', async (t) => {
    let masterUpdates = [];
    let agentFlags = { recruitment: false, onboarding: false, culture: false };

    const mockCallbacks = {
        recruitment: (status, msg) => { if (status === 'done') agentFlags.recruitment = true; },
        onboarding: (status, msg) => { if (status === 'done') agentFlags.onboarding = true; },
        culture: (status, msg) => { if (status === 'done') agentFlags.culture = true; },
        masterUpdate: (msg) => { masterUpdates.push(msg); }
    };

    const llmConfig = { provider: 'mock', apiKey: '' };

    const finalOutput = await executeMasterOrchestrator('Test Scale', llmConfig, mockCallbacks);

    // Verify all agents completed
    assert.ok(agentFlags.recruitment, 'Recruitment agent did not finish');
    assert.ok(agentFlags.onboarding, 'Onboarding agent did not finish');
    assert.ok(agentFlags.culture, 'Culture agent did not finish');

    // Verify master synthesis incorporates agent outputs
    assert.ok(finalOutput.includes('RECRUITMENT PHASE:'));
    assert.ok(finalOutput.includes('ONBOARDING PHASE:'));
    assert.ok(finalOutput.includes('CULTURE & RETENTION:'));
});