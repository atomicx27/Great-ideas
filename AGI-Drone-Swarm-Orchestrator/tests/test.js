const test = require('node:test');
const assert = require('node:assert');
const { synthesizeSwarmStrategy } = require('../script.js');

test('AGI-Drone-Swarm-Orchestrator logic', (t) => {
    const result = synthesizeSwarmStrategy(
        { deferred: 380 },
        { staggerMeters: 50 },
        { lowBatteryDrones: 45 }
    );

    assert.strictEqual(result.goal, "Optimize 500 deliveries during a sudden storm.");
    assert.strictEqual(result.strategy.length, 3);
    assert.ok(result.strategy[0].includes("380"));
    assert.ok(result.strategy[1].includes("50m"));
    assert.ok(result.strategy[2].includes("45"));
});