const test = require('node:test');
const assert = require('node:assert');
const { synthesizeEnergyPlan } = require('../script.js');

test('AGI-National-Energy-Orchestrator logic', (t) => {
    const solar = { outputMW: 400 };
    const wind = { outputMW: 300 };
    const battery = { dischargeMW: 200 };

    const result = synthesizeEnergyPlan(solar, wind, battery);

    assert.strictEqual(result.gridStatus, 'Stabilized');
    assert.ok(result.actions[0].includes('400MW'));
    assert.ok(result.actions[1].includes('300MW'));
    assert.ok(result.actions[2].includes('200MW'));
});