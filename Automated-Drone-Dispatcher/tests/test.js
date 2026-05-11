const test = require('node:test');
const assert = require('node:assert');
const { determineDispatch } = require('../script.js');

test('Automated-Drone-Dispatcher logic', (t) => {
    let result = determineDispatch(1.5, 5);
    assert.strictEqual(result.droneClass, 'Lightweight Quadcopter');
    assert.strictEqual(result.status, 'Approved');

    result = determineDispatch(4.0, 20);
    assert.strictEqual(result.droneClass, 'Medium Hexacopter');
    assert.strictEqual(result.status, 'Approved');

    result = determineDispatch(12.0, 45);
    assert.strictEqual(result.droneClass, 'Heavy-Duty Octocopter');
    assert.strictEqual(result.status, 'Approved');

    result = determineDispatch(20.0, 10);
    assert.strictEqual(result.droneClass, 'None');
    assert.strictEqual(result.status, 'Rejected');

    result = determineDispatch(-1, 10);
    assert.strictEqual(result.status, 'Rejected');
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