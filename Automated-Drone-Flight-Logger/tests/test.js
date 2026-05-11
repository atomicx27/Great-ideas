const test = require('node:test');
const assert = require('node:assert');
const { processTelemetry } = require('../script.js');

test('processTelemetry normal operation', (t) => {
    const data = { speed: 10, altitude: 50, battery: 90 };
    const result = processTelemetry(data);
    assert.strictEqual(result.level, 'info');
    assert.ok(result.message.includes('Speed: 10m/s'));
});

test('processTelemetry critical battery', (t) => {
    const data = { speed: 10, altitude: 50, battery: 15 };
    const result = processTelemetry(data);
    assert.strictEqual(result.level, 'error');
    assert.ok(result.message.includes('CRITICAL BATTERY'));
});

test('processTelemetry overspeed', (t) => {
    const data = { speed: 26, altitude: 50, battery: 90 };
    const result = processTelemetry(data);
    assert.strictEqual(result.level, 'warn');
    assert.ok(result.message.includes('OVERSPEED DETECTED'));
});

test('processTelemetry altitude exceeded', (t) => {
    const data = { speed: 10, altitude: 125, battery: 90 };
    const result = processTelemetry(data);
    assert.strictEqual(result.level, 'warn');
    assert.ok(result.message.includes('ALTITUDE LIMIT EXCEEDED'));
});