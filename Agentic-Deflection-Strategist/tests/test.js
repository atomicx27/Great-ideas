const assert = require('node:assert');
const test = require('node:test');
const { buildSystemPrompt, fetchLLMResponse } = require('../script.js');

test('Agentic-Deflection-Strategist: buildSystemPrompt', (t) => {
    const prompt = buildSystemPrompt();
    assert.ok(prompt.includes('Agentic Deflection Strategist AI'));
    assert.ok(prompt.includes('Kinetic Impactor'));
});

test('Agentic-Deflection-Strategist: fetchLLMResponse uses global mock', async (t) => {
    // Mock global window object for test
    global.window = {
        fetchLLMResponseMock: async (provider, apiKey, comp, size, time) => {
            return `Mocked strategy for ${comp} asteroid of size ${size}m arriving in ${time} years via ${provider}.`;
        }
    };

    const res = await fetchLLMResponse('openai', 'key', 'Silicate', '500', '10');
    assert.strictEqual(res, 'Mocked strategy for Silicate asteroid of size 500m arriving in 10 years via openai.');

    // Cleanup
    delete global.window;
});
