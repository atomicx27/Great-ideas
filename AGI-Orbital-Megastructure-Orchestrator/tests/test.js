const assert = require('node:assert');
const test = require('node:test');
const { buildMasterPrompt, fetchMasterLLMResponse, simulateSubAgents } = require('../script.js');

test('AGI-Orbital-Megastructure-Orchestrator: buildMasterPrompt incorporates inputs', (t) => {
    const projectDesc = "Build a habitat.";
    const outputs = "[Mining]: Iron acquired.";
    const prompt = buildMasterPrompt(projectDesc, outputs);

    assert.ok(prompt.includes(projectDesc));
    assert.ok(prompt.includes(outputs));
    assert.ok(prompt.includes('Master Orchestrator AGI'));
});

test('AGI-Orbital-Megastructure-Orchestrator: fetchMasterLLMResponse uses global mock', async (t) => {
    global.window = {
        fetchMasterLLMMock: async (provider, apiKey, desc, outputs) => {
            return `Megastructure blueprint via ${provider} for: ${desc}`;
        }
    };

    const res = await fetchMasterLLMResponse('anthropic', 'key', 'Dyson Sphere', 'Outputs');
    assert.strictEqual(res, 'Megastructure blueprint via anthropic for: Dyson Sphere');

    delete global.window;
});

test('AGI-Orbital-Megastructure-Orchestrator: simulateSubAgents returns combined output', async (t) => {
    const outputs = await simulateSubAgents('desc', { innerHTML: '', scrollTop: 0 }); // Mocking resultsDisplay
    assert.ok(outputs.includes('[Asteroid Mining Lead]'));
    assert.ok(outputs.includes('[Orbital Assembly Commander]'));
    assert.ok(outputs.includes('[Energy Logistics Coordinator]'));
});
