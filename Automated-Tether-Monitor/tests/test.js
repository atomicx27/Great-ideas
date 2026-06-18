const assert = require('node:assert');
const test = require('node:test');
const { monitorTetherTension } = require('../script.js');

test('Automated Tether Monitor - monitorTetherTension', async (t) => {
    await t.test('Identifies Safe condition correctly', () => {
        const result = monitorTetherTension(50);
        assert.strictEqual(result.status, 'Safe');
        assert.strictEqual(result.triggerSafetyProtocol, false);
    });

    await t.test('Identifies Warning condition correctly', () => {
        const result = monitorTetherTension(90);
        assert.strictEqual(result.status, 'Warning');
        assert.strictEqual(result.triggerSafetyProtocol, false);
        assert.ok(result.message.includes('Reducing climber acceleration'));
    });

    await t.test('Identifies Critical condition correctly', () => {
        const result = monitorTetherTension(105);
        assert.strictEqual(result.status, 'Critical');
        assert.strictEqual(result.triggerSafetyProtocol, true);
        assert.ok(result.message.includes('emergency payload jettison'));
    });
});
