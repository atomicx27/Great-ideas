const assert = require('node:assert');
const test = require('node:test');
const { runMasterOrchestrator } = require('../script.js');

test('AGI Crew Revival Orchestrator - Synthesis', async (t) => {
    const logs = {
        power: () => {},
        medical: () => {},
        logistics: () => {},
        master: () => {}
    };

    const result = await runMasterOrchestrator('Test directive', logs);

    assert.ok(result.includes('10 batches'));
    assert.ok(result.includes('7.2 hours'));
    assert.ok(result.includes('habitat cafeteria'));
});
