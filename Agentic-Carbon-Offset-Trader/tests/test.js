const test = require('node:test');
const assert = require('node:assert');
const { executeTradingAgent } = require('../script.js');

test('Agentic-Carbon-Offset-Trader execution flow', async (t) => {
    let logCount = 0;
    const mockLogger = (msg, type) => { logCount++; };

    const llmConfig = { provider: 'mock', apiKey: '' };
    const goal = 'Test offset 500 MT';

    const report = await executeTradingAgent(goal, llmConfig, mockLogger);

    assert.ok(report.includes('Trading Execution Report'));
    assert.ok(report.includes(goal));
    assert.ok(report.includes('Purchased 4950 MT of Forestry')); // Verifying fallback logic executed
    assert.ok(logCount > 5, 'Agent should generate multiple logs');
});