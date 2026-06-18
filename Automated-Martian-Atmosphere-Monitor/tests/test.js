const assert = require('node:assert');
const test = require('node:test');
const { calculatePressureStatus } = require('../script.js');

test('Automated-Martian-Atmosphere-Monitor: calculates status correctly', (t) => {
    // Test SAFE
    let result = calculatePressureStatus(800, -50);
    assert.strictEqual(result.status, "SAFE");

    // Test WARNING CO2
    result = calculatePressureStatus(2500, -50);
    assert.strictEqual(result.status, "WARNING");

    // Test WARNING Temp
    result = calculatePressureStatus(800, -90);
    assert.strictEqual(result.status, "WARNING");

    // Test CRITICAL CO2
    result = calculatePressureStatus(6000, -50);
    assert.strictEqual(result.status, "CRITICAL");

    // Test CRITICAL Temp
    result = calculatePressureStatus(800, -120);
    assert.strictEqual(result.status, "CRITICAL");
});
