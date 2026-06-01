const test = require('node:test');
const assert = require('node:assert');
const { classifyAnomaly, plotTrajectory } = require('../script.js');

test('Agentic-Deep-Sea-Explorer LLM Logic', async (t) => {

// Mock fetchOpenAI directly for unit tests to prevent undefined errors
global.fetchOpenAI = async (key, model, prompt, userMessage) => {
    const fakeBody = JSON.stringify({ messages: [{content: prompt}] });
    const response = await global.fetch('mock', { body: fakeBody });
    const data = await response.json();
    return data.choices[0].message.content;
};
    global.fetch = async (url, options) => {
        const body = JSON.parse(options.body);
        const prompt = body.messages[0].content;

        let mockResponse = '';
        if (prompt.includes('marine biology AI')) {
            mockResponse = 'Classification: Biological (Tube Worms). Reasoning: Undulating movement near a thermal gradient suggests chemosynthetic life.';
        } else if (prompt.includes('AUV navigation AI')) {
            mockResponse = 'Approaching at 1m/s from below the vent plume. Activating thermal imaging and floodlights to penetrate low visibility.';
        }

        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: mockResponse } }]
            })
        };
    };

    await t.test('classifyAnomaly returns correct classification', async () => {
        const result = await classifyAnomaly({ shape: "tubular cluster" });
        assert.strictEqual(result, 'Classification: Biological (Tube Worms). Reasoning: Undulating movement near a thermal gradient suggests chemosynthetic life.');
    });

    await t.test('plotTrajectory returns correct navigation plan', async () => {
        const result = await plotTrajectory({ hazards: "vents" });
        assert.strictEqual(result, 'Approaching at 1m/s from below the vent plume. Activating thermal imaging and floodlights to penetrate low visibility.');
    });
});
