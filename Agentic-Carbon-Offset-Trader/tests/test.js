const test = require('node:test');
const assert = require('node:assert');
const { runTradingAgent } = require('../script.js');

test('Agentic-Carbon-Offset-Trader logic', async (t) => {
    const logs = [];
    const logCallback = (msg, type) => logs.push({msg, type});

    // Test successful trade (Reforestation)
    const result1 = await runTradingAgent(1000, 50, logCallback);
    assert.strictEqual(result1.status, 'Success');
    assert.strictEqual(result1.project, 'reforestation');
    assert.strictEqual(result1.totalCost, 50 * 15);

    // Test fallback to renewables due to budget constraint
    const logs2 = [];
    const logCallback2 = (msg, type) => logs2.push({msg, type});
    const result2 = await runTradingAgent(600, 50, logCallback2);
    assert.strictEqual(result2.status, 'Success');
    assert.strictEqual(result2.project, 'renewableEnergy');
    assert.strictEqual(result2.totalCost, 50 * 8);

    // Test failure due to insufficient budget
    const logs3 = [];
    const logCallback3 = (msg, type) => logs3.push({msg, type});
    try {
        await runTradingAgent(100, 50, logCallback3);
        assert.fail("Should have thrown error");
    } catch (e) {
        assert.ok(e.message.includes("Insufficient budget"));
    }
});