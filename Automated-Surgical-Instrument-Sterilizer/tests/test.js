const { test } = require('node:test');
const assert = require('node:assert');
const { startSterilizationCycle } = require('../script.js');

test('Automated-Surgical-Instrument-Sterilizer: Optimal conditions', () => {
    const result = startSterilizationCycle(134, 18);
    assert.strictEqual(result.success, true);
    assert.ok(result.log.includes('successfully'));
});

test('Automated-Surgical-Instrument-Sterilizer: Temperature too low', () => {
    const result = startSterilizationCycle(120, 20);
    assert.strictEqual(result.success, false);
    assert.ok(result.log.includes('too low'));
});

test('Automated-Surgical-Instrument-Sterilizer: Time too short', () => {
    const result = startSterilizationCycle(134, 10);
    assert.strictEqual(result.success, false);
    assert.ok(result.log.includes('too short'));
});
