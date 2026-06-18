const assert = require('node:assert');
const test = require('node:test');

global.fetchOpenAI = async () => JSON.stringify({
    analysis: "Mock analysis",
    decision: "Move forward 10m",
    scientificValue: 8
});

const { decideNextWaypoint } = require('../script.js');

test('Agentic-Martian-Rover-Explorer: parses AI response correctly', async (t) => {
    const result = await decideNextWaypoint("Some data", "openai", { apiKey: "test" });

    assert.strictEqual(result.analysis, "Mock analysis");
    assert.strictEqual(result.decision, "Move forward 10m");
    assert.strictEqual(result.scientificValue, 8);
});
