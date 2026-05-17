const assert = require('node:assert');
const test = require('node:test');
const { synthesizeTransitStrategy } = require('../script.js');

test('AGI Transit System Orchestrator', async (t) => {
    await t.test('Should synthesize correct strategy from sub-agent data', () => {
        const trainData = { affectedLines: "Blue & Red", trainsRerouted: 12 };
        const busData = { dispatchedBuses: 45 };
        const passengerData = { alertsSent: "150,000", throttledStations: 5 };

        const result = synthesizeTransitStrategy(trainData, busData, passengerData);

        assert.strictEqual(result.crisisLevel, "Level 1 - Major Transit Hub Flooding");
        assert.strictEqual(result.actions.length, 3);
        assert.ok(result.actions[0].includes("12 trains safely reversed"));
        assert.ok(result.actions[1].includes("45 articulated buses dispatched"));
        assert.ok(result.actions[2].includes("150,000 push notifications sent"));
    });
});