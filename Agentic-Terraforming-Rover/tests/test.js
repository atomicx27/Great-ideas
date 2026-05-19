const assert = require('assert');
const { test } = require('node:test');
const { runRoverMission, tools, environment } = require('../script.js');

test('Rover should find and seed Phosphorus in Sector 2', async () => {
    // Reset env
    environment.sector = 0;
    environment.seeded = [];

    const logs = [];
    const uiCallback = (type, text) => {
        logs.push({ type, text });
    };

    await runRoverMission('Phosphorus', uiCallback);

    assert.strictEqual(environment.sector, 2);
    assert.ok(environment.seeded.includes('Phosphorus'));
    assert.ok(logs.some(l => l.text.includes('Seeded target nutrient: Phosphorus')));
});

test('Rover should abort if nutrient not found', async () => {
    // Reset env
    environment.sector = 0;
    environment.seeded = [];

    const logs = [];
    const uiCallback = (type, text) => {
        logs.push({ type, text });
    };

    // 'Unobtainium' is not in the grid
    await runRoverMission('Unobtainium', uiCallback);

    assert.strictEqual(environment.sector, 15); // It moves 15 times
    assert.strictEqual(environment.seeded.length, 0);
    assert.ok(logs.some(l => l.text.includes('Mission aborted')));
});
