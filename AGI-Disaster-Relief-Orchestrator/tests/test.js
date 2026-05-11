const test = require('node:test');
const assert = require('node:assert');
const { synthesizeReliefPlan } = require('../script.js');

test('AGI-Disaster-Relief-Orchestrator logic', (t) => {
    const evac = { peopleRouted: 5000 };
    const logistics = { waterPallets: 200 };
    const medical = { ambulances: 15 };

    const result = synthesizeReliefPlan(evac, logistics, medical);

    assert.strictEqual(result.operationStatus, 'Active Deployment');
    assert.ok(result.actions[0].includes('5000'));
    assert.ok(result.actions[1].includes('200'));
    assert.ok(result.actions[2].includes('15'));
});