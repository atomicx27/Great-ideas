const assert = require('node:assert');
const test = require('node:test');
const { runMasterOrchestrator } = require('../script.js');

test('AGI Space Elevator Orchestrator - Synthesis', async (t) => {
    const logs = {
        weather: () => {},
        maintenance: () => {},
        cargo: () => {},
        master: () => {}
    };

    const result = await runMasterOrchestrator('Test directive', logs);

    assert.ok(result.includes('Climber Alpha (Medical)'));
    assert.ok(result.includes('Halt Climber Beta'));
    assert.ok(result.includes('Segment 405'));
});
