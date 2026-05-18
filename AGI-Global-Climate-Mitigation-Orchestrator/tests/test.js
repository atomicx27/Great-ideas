const test = require('node:test');
const assert = require('node:assert');
const { synthesizeClimateStrategy } = require('../script.js');

test('AGI-Global-Climate-Mitigation-Orchestrator logic', (t) => {
    const result = synthesizeClimateStrategy(
        { initialTax: 50, maxTax: 150 },
        { coalPlantsClosed: 420, renewableGWAdded: 850 },
        { hectaresPlanted: 150, carbonDrawdown: 3.5 }
    );

    assert.strictEqual(result.goalStatus, "Net-Zero 2050 Master Plan Synthesized");
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes("$50/ton"));
    assert.ok(result.actions[1].includes("420 coal facilities"));
    assert.ok(result.actions[2].includes("150M hectares"));
});