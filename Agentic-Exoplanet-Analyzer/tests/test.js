const test = require('node:test');
const assert = require('node:assert');
const { ExoplanetAgent } = require('../script.js');

test('ExoplanetAgent analyzeTransit with mocked LLM', async () => {
    global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
        return JSON.stringify({
            classification: "Super-Earth",
            confidence: "92%",
            reason: "Transit depth and duration indicate a rocky planet."
        });
    };

    const agent = new ExoplanetAgent();
    const data = { depth: 0.15, duration: 8 };
    const { thoughtProcess, decision } = await agent.analyzeTransit(data);

    assert.ok(thoughtProcess.length > 0);
    assert.strictEqual(decision.classification, "Super-Earth");
    assert.strictEqual(decision.confidence, "92%");

    delete global.fetchOpenAI;
});

test('ExoplanetAgent analyzeTransit fallback logic terrestrial', async () => {
    delete global.fetchOpenAI;

    const agent = new ExoplanetAgent();
    const data = { depth: 0.05, duration: 10 };
    const { thoughtProcess, decision } = await agent.analyzeTransit(data);

    assert.ok(decision.classification.includes("Terrestrial"));
});

test('ExoplanetAgent analyzeTransit fallback logic gas giant', async () => {
    delete global.fetchOpenAI;

    const agent = new ExoplanetAgent();
    const data = { depth: 1.5, duration: 6 };
    const { thoughtProcess, decision } = await agent.analyzeTransit(data);

    assert.ok(decision.classification.includes("Gas Giant"));
});
