const test = require('node:test');
const assert = require('node:assert');
const { synthesizeEnergyPlan } = require('../script.js');

test('AGI-National-Energy-Orchestrator synthesis with mocked LLM', async (t) => {
    global.fetch = async () => {
        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: '{"gridStatus":"Stabilized","actions":["Solar: 400MW", "Wind: 300MW", "Battery: 200MW"]}' } }]
            })
        };
    };

    const result = await synthesizeEnergyPlan('openai', 'mock-key', 'mock-model', 400, 300, 200);

    assert.strictEqual(result.gridStatus, 'Stabilized');
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes('400MW'));
    assert.ok(result.actions[1].includes('300MW'));
    assert.ok(result.actions[2].includes('200MW'));
});