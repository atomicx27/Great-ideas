const test = require('node:test');
const assert = require('node:assert');
const { monitorTelemetry } = require('../script.js');

test('monitorTelemetry returns alert for high temperature', (t) => {
    const data = { temperature: 105, radiation: 5 };
    const result = monitorTelemetry(data);
    assert.strictEqual(result.alert, true);
    assert.ok(result.message.includes('High Temperature'));
});

test('monitorTelemetry returns alert for high radiation', (t) => {
    const data = { temperature: 80, radiation: 20 };
    const result = monitorTelemetry(data);
    assert.strictEqual(result.alert, true);
    assert.ok(result.message.includes('High Radiation'));
});

test('monitorTelemetry returns normal status for safe values', (t) => {
    const data = { temperature: 90, radiation: 10 };
    const result = monitorTelemetry(data);
    assert.strictEqual(result.alert, false);
    assert.strictEqual(result.message, 'All systems nominal.');
});

test('monitorTelemetry handles missing data gracefully', (t) => {
    const result = monitorTelemetry();
    assert.strictEqual(result.alert, true);
    assert.ok(result.message.includes('No telemetry data'));
});
