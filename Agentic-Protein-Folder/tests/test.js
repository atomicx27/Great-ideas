const test = require('node:test');
const assert = require('node:assert');
const { runFoldingAgent } = require('../script.js');

test('Agentic-Protein-Folder simulation with mocked LLM', async (t) => {
    global.fetch = async () => {
        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: '{"prediction":"Alpha-helix formation predicted.","confidence":"89%"}' } }]
            })
        };
    };

    const logs = [];
    const logCallback = (msg, type) => logs.push({ msg, type });

    const result = await runFoldingAgent('openai', 'mock-key', 'mock-model', 'MKTLLLILVVCYHLAMF', logCallback);

    assert.strictEqual(result.status, 'Folding Complete');
    assert.strictEqual(result.prediction, 'Alpha-helix formation predicted.');
    assert.strictEqual(result.confidence, '89%');
    assert.ok(logs.length > 0);
    assert.ok(logs.find(l => l.msg.includes('Executing Tool: evaluateHydrophobicity()')));
});