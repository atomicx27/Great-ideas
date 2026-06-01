const assert = require('node:assert');
const test = require('node:test');
const { buildMasterPrompt, fetchMasterLLMResponse, simulateSubAgents } = require('../script.js');

test('AGI-Planetary-Defense-Orchestrator: buildMasterPrompt incorporates inputs', (t) => {
    const scenario = "Incoming comet fragment.";
    const outputs = "[Tracking]: Locked.\n[Deflection]: Ready.";
    const prompt = buildMasterPrompt(scenario, outputs);

    assert.ok(prompt.includes(scenario));
    assert.ok(prompt.includes(outputs));
    assert.ok(prompt.includes('Master Orchestrator AGI'));
});

test('AGI-Planetary-Defense-Orchestrator: fetchMasterLLMResponse uses global mock', async (t) => {
    global.window = {
        fetchMasterLLMMock: async (provider, apiKey, scenario, outputs) => {
            return `Master strategy synthesized via ${provider} for scenario: ${scenario}`;
        }
    };

    const res = await fetchMasterLLMResponse('anthropic', 'key', 'Comet', 'Outputs');
    assert.strictEqual(res, 'Master strategy synthesized via anthropic for scenario: Comet');

    delete global.window;
});

test('AGI-Planetary-Defense-Orchestrator: simulateSubAgents returns combined output', async (t) => {
    const outputs = await simulateSubAgents('scenario', { innerHTML: '', scrollTop: 0 }); // Mocking resultsDisplay
    assert.ok(outputs.includes('[Tracking Swarm Lead]'));
    assert.ok(outputs.includes('[Deflection Commander]'));
    assert.ok(outputs.includes('[Evacuation Coordinator]'));
});
