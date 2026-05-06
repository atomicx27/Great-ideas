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
});