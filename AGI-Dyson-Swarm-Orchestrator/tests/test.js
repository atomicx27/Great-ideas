const assert = require('node:assert');
const test = require('node:test');

// Mock global fetch for testing
global.fetchOpenAI = async () => JSON.stringify([
    { agentRole: "Mock Thermal", taskDescription: "Mock task", expectedOutput: "Mock output 1" },
    { agentRole: "Mock Structural", taskDescription: "Mock task 2", expectedOutput: "Mock output 2" }
]);

const { orchestrateSwarmTopology } = require('../script.js');

test('AGI-Dyson-Swarm-Orchestrator: parses AI array response correctly', async (t) => {
    const result = await orchestrateSwarmTopology("Optimize something", "openai", { apiKey: "test" });

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].agentRole, "Mock Thermal");
    assert.strictEqual(result[1].agentRole, "Mock Structural");
});
