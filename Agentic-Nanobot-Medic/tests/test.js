const test = require('node:test');
const assert = require('node:assert');

// Mock fetchOpenAI globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (userMessage.includes('rapid heart rate')) {
        return 'Deploy 50 beta-blocker nanobots to cardiac region.';
    }
    if (userMessage.includes('internal bleeding')) {
        return 'Deploy 200 coagulant nanobots to laceration site immediately.';
    }
    return 'Administer general diagnostic sweep.';
};

const { diagnoseAndTreat } = require('../script.js');

test('diagnoseAndTreat returns expected plan for rapid heart rate', async (t) => {
    const data = "Patient exhibits rapid heart rate.";
    const result = await diagnoseAndTreat(data);
    assert.strictEqual(result, 'Deploy 50 beta-blocker nanobots to cardiac region.');
});

test('diagnoseAndTreat returns expected plan for internal bleeding', async (t) => {
    const data = "Patient exhibits internal bleeding in abdomen.";
    const result = await diagnoseAndTreat(data);
    assert.strictEqual(result, 'Deploy 200 coagulant nanobots to laceration site immediately.');
});

test('diagnoseAndTreat handles empty data', async (t) => {
    const result = await diagnoseAndTreat("  ");
    assert.strictEqual(result, 'Error: No symptoms provided.');
});
