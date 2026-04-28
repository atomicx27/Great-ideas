const test = require('node:test');
const assert = require('node:assert');
const { synthesizeFactoryPlan } = require('../script.js');

test('AGI Smart Factory Orchestrator tests', async (t) => {
    await t.test('synthesizes multi-agent output correctly', () => {
        const supplyData = { divertedBatches: 10 };
        const prodData = { rebalancedLoad: 60 };
        const maintData = { dronesDispatched: 2 };

        const result = synthesizeFactoryPlan(supplyData, prodData, maintData);

        assert.match(result.crisisLevel, /Level 1/);
        assert.strictEqual(result.actions.length, 3);
        assert.match(result.actions[0], /10 batches/);
        assert.match(result.actions[1], /60%/);
        assert.match(result.actions[2], /2 repair drones/);
    });
});
