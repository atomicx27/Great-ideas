const test = require('node:test');
const assert = require('node:assert');
const { conductInterviewAgent } = require('../script.js');

test('Agentic-Interview-Conductor execution flow', async (t) => {
    let logCount = 0;
    const mockLogger = (msg, type) => { logCount++; };

    // Simulate LLM failing to use fallback topics immediately
    const llmConfig = { provider: 'mock', apiKey: '' };

    const report = await conductInterviewAgent('Test Engineer', llmConfig, mockLogger);

    assert.ok(report.includes('# Interview Report: Test Engineer'));
    assert.ok(report.includes('### Topic: React')); // Checking fallback topics
    assert.ok(report.includes('Final Decision:'));
    assert.ok(logCount > 5, 'Agent should generate multiple thought/action logs');
});