const assert = require('node:assert');
const { parseMasterPlan, orchestrateHomeAutomation, dispatchAgentTask, synthesizeResults } = require('../script.js');

// Test parseMasterPlan
const validPlan = JSON.stringify({
    agents: [
        { name: "A1", role: "R1", task: "T1" }
    ]
});
let res = parseMasterPlan(validPlan);
assert.strictEqual(res.isValid, true);
assert.strictEqual(res.agents.length, 1);
assert.strictEqual(res.agents[0].name, "A1");

const invalidPlan = "not json";
res = parseMasterPlan(invalidPlan);
assert.strictEqual(res.isValid, false);

// Test Async LLM flows
async function runAsyncTests() {
    const mockFetchLLM = async (provider, apiKey, sys, msg) => {
        if (sys.includes("Master Orchestrator")) {
            if (sys.includes("Synthesize")) {
                return "Mocked Final Synthesis";
            } else if (msg.includes("Goal:")) {
                return validPlan; // Simulate breaking down goal
            }
        }
        if (sys.includes("specialized AI")) {
            return `Mocked agent report for ${msg}`;
        }
        return "Unknown mock";
    };

    const config = { provider: 'test', apiKey: 'test' };

    // Test orchestrateHomeAutomation
    const planResult = await orchestrateHomeAutomation("Do things", config, mockFetchLLM);
    assert.strictEqual(planResult.isValid, true);
    assert.strictEqual(planResult.agents[0].name, "A1");

    // Test dispatchAgentTask
    const taskResult = await dispatchAgentTask(planResult.agents[0], config, mockFetchLLM);
    assert.ok(taskResult.includes("Mocked agent report for Task: T1"));

    // Test synthesizeResults
    const synthResult = await synthesizeResults("Do things", [{ name: "A1", report: "Done" }], config, mockFetchLLM);
    assert.strictEqual(synthResult, "Mocked Final Synthesis");

    console.log('All AGI-Home-Automation-Orchestrator tests passed!');
}

runAsyncTests().catch(err => {
    console.error(err);
    process.exit(1);
});
