const assert = require('node:assert');
const test = require('node:test');
const { evaluateWaterQuality } = require('../script.js');

test('Automated-Water-Quality-Monitor deterministic logic', async (t) => {
    await t.test('Safe water conditions', () => {
        const result = evaluateWaterQuality(7.0, 2.0);
        assert.strictEqual(result.isSafe, true);
        assert.match(result.messages[0], /within safe range/);
        assert.match(result.messages[1], /within safe limits/);
    });

    await t.test('Unsafe pH triggers alert', () => {
        const result = evaluateWaterQuality(6.0, 2.0);
        assert.strictEqual(result.isSafe, false);
        assert.match(result.messages[0], /ALERT: pH level/);
    });

    await t.test('Unsafe turbidity triggers alert', () => {
        const result = evaluateWaterQuality(7.0, 6.0);
        assert.strictEqual(result.isSafe, false);
        assert.match(result.messages[1], /ALERT: Turbidity/);
    });
});
