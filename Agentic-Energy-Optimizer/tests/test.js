const assert = require('node:assert');
const { analyzeEnergyUsage, optimizeEnergyConsumption } = require('../script.js');

// Test analyzeEnergyUsage
const validData = JSON.stringify([
    { "appliance": "HVAC", "usage_kwh": 40 },
    { "appliance": "Fridge", "usage_kwh": 10 }
]);

let analysis = analyzeEnergyUsage(validData);
assert.strictEqual(analysis.isValid, true);
assert.strictEqual(analysis.totalUsage, 50);
assert.strictEqual(analysis.peakAppliance, 'HVAC');

const invalidData = "[ { bad_json: } ]";
analysis = analyzeEnergyUsage(invalidData);
assert.strictEqual(analysis.isValid, false);

// Test optimizeEnergyConsumption (with mocked LLM function)
async function runAsyncTests() {
    const mockFetchLLM = async (provider, apiKey, sys, msg) => {
        return `Mocked plan for ${provider} with total ${msg.includes('50 kWh') ? 'correct' : 'incorrect'} usage.`;
    };

    const config = {
        usageData: validData,
        preferences: "Save money",
        provider: "openai",
        apiKey: "fake_key"
    };

    const result = await optimizeEnergyConsumption(config, mockFetchLLM);
    assert.ok(result.includes('Mocked plan for openai'));
    assert.ok(result.includes('correct usage'));

    console.log('All Agentic-Energy-Optimizer tests passed!');
}

runAsyncTests().catch(err => {
    console.error(err);
    process.exit(1);
});
