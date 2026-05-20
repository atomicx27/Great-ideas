const assert = require('assert');
const { test } = require('node:test');
const { runTuningSession, tools, environment } = require('../script.js');

test('should auto-tune to Pinch motion', async () => {
    // Reset env
    environment.adjustmentLevel = 0;
    environment.motionState = "Rest";

    const logs = [];
    const uiCallback = (type, text) => {
        logs.push({ type, text });
    };

    await runTuningSession('Pinch', uiCallback);

    assert.strictEqual(environment.adjustmentLevel, 2);
    assert.strictEqual(environment.motionState, 'Pinch');
    assert.ok(logs.some(l => l.text.includes('calibrated perfectly')));
});

test('should auto-tune to Point motion', async () => {
    // Reset env
    environment.adjustmentLevel = 0;
    environment.motionState = "Rest";

    const logs = [];
    const uiCallback = (type, text) => {
        logs.push({ type, text });
    };

    await runTuningSession('Point', uiCallback);

    assert.strictEqual(environment.adjustmentLevel, 5);
    assert.strictEqual(environment.motionState, 'Point');
});
