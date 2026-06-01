const test = require('node:test');
const assert = require('node:assert');
const { VerticalFarmAgent } = require('../script.js');

test('VerticalFarmAgent analyzeGrowth with mocked LLM', async () => {
    // Mock the global LLM function
    global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
        return JSON.stringify({
            action: "Decrease temperature by 2 degrees.",
            confidence: "98%",
            reason: "Temperature is slightly elevated."
        });
    };

    const agent = new VerticalFarmAgent();
    const data = { temp: 28, humidity: 60, light: 12000 };
    const { thoughtProcess, decision } = await agent.analyzeGrowth(data);

    assert.ok(thoughtProcess.length > 0);
    assert.strictEqual(decision.action, "Decrease temperature by 2 degrees.");
    assert.strictEqual(decision.confidence, "98%");

    // Clean up
    delete global.fetchOpenAI;
});

test('VerticalFarmAgent analyzeGrowth fallback logic', async () => {
    // Ensure fetchOpenAI is undefined
    delete global.fetchOpenAI;

    const agent = new VerticalFarmAgent();
    const data = { temp: 24, humidity: 85, light: 15000 };
    const { thoughtProcess, decision } = await agent.analyzeGrowth(data);

    assert.strictEqual(decision.action, "Increase ventilation by 20%.");
});
