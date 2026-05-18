const test = require('node:test');
const assert = require('node:assert');
const { runMiningAgent } = require('../script.js');

test('Agentic-Mining-Drone-Pilot logic', async (t) => {
    const logs = [];
    const logCallback = (msg, type) => logs.push({msg, type});

    const result = await runMiningAgent("Test-Asteroid", 100, logCallback);

    assert.strictEqual(result.status, 'Complete');
    assert.strictEqual(result.extractedKg, 100);
    assert.ok(logs.length > 5);

    // Check if tools were called via logs
    assert.ok(logs.find(l => l.msg.includes('pingSurfaceRadar')));
    assert.ok(logs.find(l => l.msg.includes('fireStabilizationThrusters')));
    assert.ok(logs.find(l => l.msg.includes('deployAnchoringDrill')));
});