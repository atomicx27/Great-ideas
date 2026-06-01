const test = require('node:test');
const assert = require('node:assert');
const { analyzeTerrain, evaluateSample } = require('../script.js');

test('Agentic-Exoplanet-Rover LLM Logic', async (t) => {

// Mock fetchOpenAI directly for unit tests to prevent undefined errors
global.fetchOpenAI = async (key, model, prompt, userMessage) => {
    const fakeBody = JSON.stringify({ messages: [{content: prompt}] });
    const response = await global.fetch('mock', { body: fakeBody });
    const data = await response.json();
    return data.choices[0].message.content;
};
    // Mock global fetch for callLLM (defaults to openai in script.js when no DOM)
    global.fetch = async (url, options) => {
        const body = JSON.parse(options.body);
        const prompt = body.messages[0].content;

        let mockResponse = '';
        if (prompt.includes('autonomous rover navigation AI')) {
            mockResponse = 'I will navigate around the crater at 50m to safely reach the target.';
        } else if (prompt.includes('planetary geologist AI')) {
            mockResponse = 'The sample contains hydrated minerals and trace organics, making it a high priority target for return.';
        }

        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: mockResponse } }]
            })
        };
    };

    await t.test('analyzeTerrain processes data and returns navigation plan', async () => {
        const terrain = { targetDistance: "120m", obstacles: ["Crater at 50m"] };
        const result = await analyzeTerrain(terrain);
        assert.strictEqual(result, 'I will navigate around the crater at 50m to safely reach the target.');
    });

    await t.test('evaluateSample processes data and returns evaluation', async () => {
        const sample = { spectrometry: ["hydrated minerals", "trace organics"] };
        const result = await evaluateSample(sample);
        assert.strictEqual(result, 'The sample contains hydrated minerals and trace organics, making it a high priority target for return.');
    });
});
