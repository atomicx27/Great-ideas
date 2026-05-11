const test = require('node:test');
const assert = require('node:assert');
const { determineCoolingResponse } = require('../script.js');

test('Automated Data Center Cooling Logic', async (t) => {
    await t.test('handles critical', () => {
        const res = determineCoolingResponse(90);
        assert.strictEqual(res.status, 'CRITICAL: Initiating Emergency Shutdown');
        assert.strictEqual(res.fanSpeed, '0% (Shutdown)');
    });

    await t.test('handles warning high', () => {
        const res = determineCoolingResponse(75);
        assert.strictEqual(res.status, 'WARNING: High Temp');
        assert.strictEqual(res.fanSpeed, '100% (Max RPM)');
    });

    await t.test('handles warning elevated', () => {
        const res = determineCoolingResponse(50);
        assert.strictEqual(res.status, 'ELEVATED: Increasing Airflow');
        assert.strictEqual(res.fanSpeed, '75%');
    });

    await t.test('handles normal', () => {
        const res = determineCoolingResponse(25);
        assert.strictEqual(res.status, 'NORMAL: Optimal Operating Temp');
        assert.strictEqual(res.fanSpeed, '30% (Idle)');
    });
});
