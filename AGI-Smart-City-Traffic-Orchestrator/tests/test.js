const { test } = require('node:test');
const assert = require('node:assert');
const { synthesizeTrafficPlan } = require('../script');

test('AGI-Smart-City-Traffic-Orchestrator - synthesizeTrafficPlan', (t) => {
    const result = synthesizeTrafficPlan({ lanesCleared: 2 }, { vehiclesRerouted: 5000 }, { busesDelayed: 12 });
    assert.strictEqual(result.crisisLevel, 'Level 4 - Major Arterial Blockage');
    assert.strictEqual(result.actions.length, 3);
    assert.match(result.actions[0], /2 priority lanes/);
    assert.match(result.actions[1], /5000 vehicles/);
    assert.match(result.actions[2], /12 buses/);
});
