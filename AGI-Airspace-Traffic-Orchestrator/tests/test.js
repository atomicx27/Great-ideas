const test = require('node:test');
const assert = require('node:assert');
const { synthesizeAirspaceStrategy } = require('../script.js');

test('synthesizeAirspaceStrategy formats correctly', (t) => {
    const atc = { dronesGrounded: 5, dronesRerouted: 10 };
    const weather = { downdraftSpeed: 50, duration: 20 };
    const emergency = { medEvacEta: 2 };

    const result = synthesizeAirspaceStrategy(atc, weather, emergency);

    assert.ok(result.threatLevel.includes('CRITICAL'));
    assert.strictEqual(result.strategy.length, 3);
    assert.ok(result.strategy[0].includes('50m/s'));
    assert.ok(result.strategy[1].includes('5 drones grounded'));
    assert.ok(result.strategy[1].includes('10 commercial drones rerouted'));
    assert.ok(result.strategy[2].includes('2 mins'));
});