const assert = require('node:assert');
const test = require('node:test');
const { synthesizeResponseStrategy } = require('../script.js');

test('AGI Wildfire Response Orchestrator', async (t) => {
    await t.test('Should synthesize correct strategy from sub-agent data', () => {
        const evacData = { evacRoute: "Hwy 9 Outbound", citizensCleared: "12,500" };
        const suppressionData = { airTankers: 6, dropZone: "Eastern" };
        const logisticsData = { supplyTrucks: 15, waterPumps: 8 };

        const result = synthesizeResponseStrategy(evacData, suppressionData, logisticsData);

        assert.strictEqual(result.crisisLevel, "Level 1 - Mega-Fire Convergence");
        assert.strictEqual(result.actions.length, 3);
        assert.ok(result.actions[0].includes("12,500 citizens safely evacuated"));
        assert.ok(result.actions[1].includes("6 air tankers deployed"));
        assert.ok(result.actions[2].includes("15 supply trucks rerouted"));
    });
});