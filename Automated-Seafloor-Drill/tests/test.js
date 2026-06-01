const test = require('node:test');
const assert = require('node:assert');
const { monitorTemperature, adjustRPM, triggerShutdown } = require('../script.js');

test('Automated-Seafloor-Drill logic', async (t) => {
    await t.test('monitorTemperature identifies status correctly', () => {
        assert.strictEqual(monitorTemperature(50).status, 'NOMINAL');
        assert.strictEqual(monitorTemperature(105).status, 'WARNING');
        assert.strictEqual(monitorTemperature(125).status, 'CRITICAL');
        assert.strictEqual(monitorTemperature(120).status, 'CRITICAL');
    });

    await t.test('adjustRPM calculates RPM based on density', () => {
        // Base is 1500
        assert.strictEqual(adjustRPM(1), 1500);
        assert.strictEqual(adjustRPM(2), 750);
        assert.strictEqual(adjustRPM(3), 500);
        assert.strictEqual(adjustRPM(0.5), 1500); // Math.max(1, 0.5) = 1
    });

    await t.test('triggerShutdown returns correct action', () => {
        const result = triggerShutdown();
        assert.strictEqual(result.shutdown, true);
        assert.ok(result.action.includes('EMERGENCY SHUTDOWN'));
    });
});
