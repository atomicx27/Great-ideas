const test = require('node:test');
const assert = require('node:assert');
const { synthesizeMiningStrategy } = require('../script.js');

test('AGI-Asteroid-Mining-Orchestrator logic', (t) => {
    const result = synthesizeMiningStrategy(
        { targetName: "16 Psyche-B", estimatedYield: 15000 },
        { droneCount: 500, timelineDays: 45 },
        { returnTransitDays: 120 }
    );

    assert.strictEqual(result.missionStatus, "Supply Chain Established: PGM-Class Main Belt");
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes("16 Psyche-B"));
    assert.ok(result.actions[1].includes("500 drones"));
    assert.ok(result.actions[2].includes("120 days"));
});
