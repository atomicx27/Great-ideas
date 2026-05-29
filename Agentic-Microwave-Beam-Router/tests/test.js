const assert = require('node:assert');
const test = require('node:test');
const { buildSystemPrompt, fetchLLMResponse } = require('../script.js');

test('Agentic-Microwave-Beam-Router: buildSystemPrompt', (t) => {
    const prompt = buildSystemPrompt();
    assert.ok(prompt.includes('Agentic Microwave Beam Router'));
    assert.ok(prompt.includes('frequency'));
});

test('Agentic-Microwave-Beam-Router: fetchLLMResponse uses global mock', async (t) => {
    global.window = {
        fetchLLMResponseMock: async (provider, apiKey, weather, power) => {
            return `Mocked routing for ${weather} at ${power}GW via ${provider}.`;
        }
    };

    const res = await fetchLLMResponse('openai', 'key', 'Clear Skies', '3.0');
    assert.strictEqual(res, 'Mocked routing for Clear Skies at 3.0GW via openai.');

    delete global.window;
});
