const assert = require('node:assert');
const { parseMasterPlan, orchestrateReverseLogistics, assignLogisticsAgents, synthesizeResults } = require('../script.js');

const validPlan = JSON.stringify({
    tasks: [
        { agentName: "A1", items: ["I1"], instructions: "T1" }
    ]
});

let res = parseMasterPlan(validPlan);
assert.strictEqual(res.isValid, true);
assert.strictEqual(res.tasks.length, 1);
assert.strictEqual(res.tasks[0].agentName, "A1");

const invalidPlan = "not json";
res = parseMasterPlan(invalidPlan);
assert.strictEqual(res.isValid, false);

async function runAsyncTests() {
    const mockFetchLLM = async (provider, apiKey, sys, msg) => {
        if (sys.includes("Master Orchestrator")) {
            if (sys.includes("Synthesize")) {
                return "Mocked Final Processing Report";
            } else if (msg.includes("Batch:")) {
                return validPlan;
            }
        }
        if (sys.includes("specialized AI")) {
            return `Mocked logistics report for ${msg}`;
        }
        return "Unknown mock";
    };

    const config = { provider: 'test', apiKey: 'test' };

    const planResult = await orchestrateReverseLogistics("items", config, mockFetchLLM);
    assert.strictEqual(planResult.isValid, true);
    assert.strictEqual(planResult.tasks[0].agentName, "A1");

    const taskResult = await assignLogisticsAgents(planResult.tasks[0], config, mockFetchLLM);
    assert.ok(taskResult.includes("Mocked logistics report for Items: [\"I1\"]\nInstructions: T1"));

    const synthResult = await synthesizeResults("items", [{ agent: "A1", report: "Done" }], config, mockFetchLLM);
    assert.strictEqual(synthResult, "Mocked Final Processing Report");

    console.log('All AGI-Reverse-Logistics-Orchestrator tests passed!');
}

runAsyncTests().catch(err => {
    console.error(err);
    process.exit(1);
});
