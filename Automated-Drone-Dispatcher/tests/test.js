const test = require('node:test');
const assert = require('node:assert');
const { assignDrone } = require('../script.js');

test('Automated-Drone-Dispatcher logic', (t) => {
    let result = assignDrone(1, 5);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.message, 'Assigned Drone: Light-Scout-D1');

    result = assignDrone(4, 20);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.message, 'Assigned Drone: Standard-Carrier-D2');

    result = assignDrone(8, 40);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.message, 'Assigned Drone: Heavy-Lifter-D3');

    result = assignDrone(12, 10);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Error: Package exceeds maximum weight capacity of 10kg.');

    result = assignDrone(5, 60);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Error: Delivery distance exceeds maximum range of 50km.');
});