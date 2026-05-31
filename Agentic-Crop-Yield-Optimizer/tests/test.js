const assert = require('node:assert');
const { test, mock } = require('node:test');
const { analyzeCropHealth, decideOptimalTreatment } = require('../script.js');

test('analyzeCropHealth returns combined data object', async () => {
    const input = "low pH";
    const result = await analyzeCropHealth(input);
    assert.strictEqual(result.currentData, "low pH");
    assert.ok(result.historicalTrend.includes("Nitrogen deficiency"));
});

test('decideOptimalTreatment coordinates external tool and LLM', async () => {
    const mockLogs = [];
    const logger = (msg) => mockLogs.push(msg);

    // Mock global fetchOpenAI
    global.fetchOpenAI = mock.fn(async () => {
        return "**Mock Plan:** Increase Nitrogen.";
    });

    const plan = await decideOptimalTreatment('fake-key', 'data', logger);

    assert.strictEqual(plan, "**Mock Plan:** Increase Nitrogen.");
    assert.ok(mockLogs.some(l => l.includes('Initiating health analysis')));
    assert.strictEqual(global.fetchOpenAI.mock.calls.length, 1);

    delete global.fetchOpenAI;
});
