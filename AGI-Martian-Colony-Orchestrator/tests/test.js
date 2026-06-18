const assert = require('node:assert');
const test = require('node:test');

global.fetchOpenAI = async () => JSON.stringify([
    { agentRole: "Mock Logistics", taskDescription: "Logistics task", expectedOutput: "Logistics output" },
    { agentRole: "Mock Life Support", taskDescription: "Life support task", expectedOutput: "Life support output" }
]);

const { orchestrateColonyExpansion } = require('../script.js');

test('AGI-Martian-Colony-Orchestrator: parses AI array correctly', async (t) => {
    const result = await orchestrateColonyExpansion(50, "Some constraints", "openai", { apiKey: "test" });

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].agentRole, "Mock Logistics");
    assert.strictEqual(result[1].agentRole, "Mock Life Support");
});
