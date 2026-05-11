const test = require('node:test');
const assert = require('node:assert');
const { synthesizeBaseStrategy } = require('../script.js');

test('AGI Lunar Base Orchestrator tests', async (t) => {
    await t.test('synthesizes multi-agent output correctly', () => {
        const lifeData = { o2Reserves: 90, survivalWindow: 48 };
        const energyData = { powerRerouted: 500 };
        const commsData = { signalIntegrity: 88 };

        const result = synthesizeBaseStrategy(lifeData, energyData, commsData);

        assert.match(result.crisisLevel, /Level 1/);
        assert.strictEqual(result.actions.length, 3);
        assert.match(result.actions[0], /90% backup O2/);
        assert.match(result.actions[0], /48 hrs/);
        assert.match(result.actions[1], /500kW rerouted/);
        assert.match(result.actions[2], /88%/);
    });
});
