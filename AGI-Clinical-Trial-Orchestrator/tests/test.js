const test = require('node:test');
const assert = require('node:assert');
const { synthesizeTrialProtocol } = require('../script.js');

test('AGI-Clinical-Trial-Orchestrator logic', (t) => {
    const result = synthesizeTrialProtocol(
        { cohortSize: 250, sites: 15 },
        { approvalWeeks: 4 },
        { powerPercent: 80, alpha: 0.05 }
    );

    assert.strictEqual(result.goal, "Launch Phase II oncology trial for Drug X-1.");
    assert.strictEqual(result.protocol.length, 3);
    assert.ok(result.protocol[0].includes("250"));
    assert.ok(result.protocol[0].includes("15"));
    assert.ok(result.protocol[1].includes("4"));
    assert.ok(result.protocol[2].includes("80%"));
    assert.ok(result.protocol[2].includes("0.05"));
});