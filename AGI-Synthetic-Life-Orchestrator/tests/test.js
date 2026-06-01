const test = require('node:test');
const assert = require('node:assert');
const { synthesizeLifeBlueprint } = require('../script.js');

test('AGI-Synthetic-Life-Orchestrator synthesis with mocked LLM', async (t) => {
    global.fetch = async () => {
        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: '{"blueprintStatus":"Viable Synthetic Organism Designed","actions":["Genome: 531000", "Metabolism: PET Plastics", "Evolution: 1000000"]}' } }]
            })
        };
    };

    const result = await synthesizeLifeBlueprint('openai', 'mock-key', 'mock-model', 531000, "PET Plastics", 1000000);

    assert.strictEqual(result.blueprintStatus, 'Viable Synthetic Organism Designed');
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes('531000'));
    assert.ok(result.actions[1].includes('PET Plastics'));
    assert.ok(result.actions[2].includes('1000000'));
});