const test = require('node:test');
const assert = require('node:assert');
const { monitorTelemetry } = require('../script.js');

test('Automated Spacecraft Telemetry Monitor tests', async (t) => {
    await t.test('passes valid telemetry', () => {
        const result = monitorTelemetry(21.0, 85, 101.3);
        assert.strictEqual(result.nominal, true);
    });

    await t.test('fails low oxygen', () => {
        const result = monitorTelemetry(19.0, 85, 101.3);
        assert.strictEqual(result.nominal, false);
        assert.match(result.messages[0], /Oxygen levels low/);
    });

    await t.test('fails low battery', () => {
        const result = monitorTelemetry(21.0, 30, 101.3);
        assert.strictEqual(result.nominal, false);
        assert.match(result.messages[0], /Battery level low/);
    });

    await t.test('fails abnormal pressure', () => {
        const result = monitorTelemetry(21.0, 85, 110.0);
        assert.strictEqual(result.nominal, false);
        assert.match(result.messages[0], /Cabin pressure anomalous/);
    });

    await t.test('fails multiple constraints', () => {
        const result = monitorTelemetry(15.0, 10, 80.0);
        assert.strictEqual(result.nominal, false);
        assert.strictEqual(result.messages.length, 3);
    });
});
