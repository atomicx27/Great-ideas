const test = require('node:test');
const assert = require('node:assert');
const { checkTelemetry } = require('../script.js');

test('Automated-Drone-Telemetry-Monitor logic', (t) => {
    const mockDrones = [
        { id: 'D1', battery: 80, signal: 80, temperature: 50 },
        { id: 'D2', battery: 10, signal: 80, temperature: 50 }, // Alert
        { id: 'D3', battery: 80, signal: 20, temperature: 90 }  // Alert
    ];

    const results = checkTelemetry(mockDrones);

    assert.strictEqual(results.length, 3);

    assert.strictEqual(results[0].droneId, 'D1');
    assert.strictEqual(results[0].status, 'Normal');

    assert.strictEqual(results[1].droneId, 'D2');
    assert.strictEqual(results[1].status, 'Alert');
    assert.match(results[1].alertMessage, /Low Battery/);

    assert.strictEqual(results[2].droneId, 'D3');
    assert.strictEqual(results[2].status, 'Alert');
    assert.match(results[2].alertMessage, /Weak Signal/);
    assert.match(results[2].alertMessage, /High Temp/);
});