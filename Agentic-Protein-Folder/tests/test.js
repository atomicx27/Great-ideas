const test = require('node:test');
const assert = require('node:assert');

// Mock LLM API functions globally before requiring the script
global.fetchOpenAI = async () => '## Predicted Structure\nGlobular protein with alpha helices.';
global.fetchAnthropic = async () => '## Predicted Structure\nGlobular protein with alpha helices.';
global.fetchOllama = async () => '## Predicted Structure\nGlobular protein with alpha helices.';

const { predictFoldingStructure } = require('../script.js');

test('Agentic-Protein-Folder - predictFoldingStructure', async (t) => {
    await t.test('Correctly calls OpenAI mock and returns result', async () => {
        const result = await predictFoldingStructure('MKTLLLTLTVVQ', 'fake_key', 'openai');
        assert.strictEqual(result.includes('Globular protein'), true);
    });

    await t.test('Rejects invalid sequence', async () => {
        await assert.rejects(
            predictFoldingStructure('123', 'fake_key', 'openai'),
            { message: 'Sequence contains invalid amino acid characters.' }
        );
    });

    await t.test('Rejects empty or non-string sequence', async () => {
        await assert.rejects(
            predictFoldingStructure(null, 'fake_key', 'openai'),
            { message: 'Invalid amino acid sequence' }
        );
    });
});
