const test = require('node:test');
const assert = require('node:assert');
const { processSensorData } = require('../script.js');

test('Automated Bioreactor Controller - Optimal Conditions', (t) => {
    const result = processSensorData(37.5, 7.2, 50);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isOptimal, true);
    assert.strictEqual(result.actions[0], 'All parameters within optimal range. No action taken.');
});

test('Automated Bioreactor Controller - Temperature High', (t) => {
    const result = processSensorData(39.0, 7.2, 50);
    assert.strictEqual(result.isOptimal, false);
    assert.ok(result.actions.includes('Cooling system activated'));
});

test('Automated Bioreactor Controller - Multiple Adjustments', (t) => {
    const result = processSensorData(35.0, 6.5, 30);
    assert.strictEqual(result.isOptimal, false);
    assert.ok(result.actions.includes('Heating system activated'));
    assert.ok(result.actions.includes('Base buffer injected'));
    assert.ok(result.actions.includes('Aeration rate increased'));
});

test('Automated Bioreactor Controller - Invalid Types', (t) => {
    const result = processSensorData('37.5', 7.2, 50);
    assert.strictEqual(result.error, 'Invalid sensor data types');
});
