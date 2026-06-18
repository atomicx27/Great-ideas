const assert = require('node:assert');
const { evaluateReturnRequest, negotiateReturnOptions } = require('../script.js');

// Test evaluateReturnRequest
let analysis = evaluateReturnRequest("- LTV: $2,450\n- Status: VIP");
assert.strictEqual(analysis.isValid, true);
assert.strictEqual(analysis.isVIP, true);
assert.strictEqual(analysis.estimatedLTV, 2450);

analysis = evaluateReturnRequest("");
assert.strictEqual(analysis.isValid, false);

// Test negotiateReturnOptions
async function runAsyncTests() {
    const mockFetchLLM = async (provider, apiKey, sys, msg) => {
        return `Mocked Agent Offer for LTV ${msg.includes('2,450') ? 'High' : 'Low'}`;
    };

    const config = {
        customerProfile: "- LTV: $2,450\n- Status: VIP",
        returnDetails: "Item broke.",
        provider: "openai",
        apiKey: "fake"
    };

    const result = await negotiateReturnOptions(config, mockFetchLLM);
    assert.ok(result.includes('Mocked Agent Offer for LTV High'));

    console.log('All Agentic-Return-Negotiator tests passed!');
}

runAsyncTests().catch(err => {
    console.error(err);
    process.exit(1);
});
