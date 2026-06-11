const assert = require('node:assert');
const test = require('node:test');

// Mock global fetch for testing
global.fetchOpenAI = async () => JSON.stringify({
    diagnosis: "Mock diagnosis",
    actionPlan: "Mock plan",
    estimatedDowntime: "1 hour"
});
global.fetchAnthropic = async () => JSON.stringify({
    diagnosis: "Mock Anthropic diagnosis",
    actionPlan: "Mock Anthropic plan",
    estimatedDowntime: "2 hours"
});

const { troubleshootPanelFailure } = require('../script.js');

test('Agentic-Dyson-Swarm-Engineer: parses AI responses correctly', async (t) => {
    const result = await troubleshootPanelFailure("ERR-123", "openai", { apiKey: "test" });

    assert.strictEqual(result.diagnosis, "Mock diagnosis");
    assert.strictEqual(result.actionPlan, "Mock plan");
    assert.strictEqual(result.estimatedDowntime, "1 hour");
});

test('Agentic-Dyson-Swarm-Engineer: routes to correct provider', async (t) => {
    const result = await troubleshootPanelFailure("ERR-123", "anthropic", { apiKey: "test" });

    assert.strictEqual(result.diagnosis, "Mock Anthropic diagnosis");
});
