const test = require('node:test');
const assert = require('node:assert');
const { runAgent } = require('../script.js');

// Mock fetch globally
global.fetch = async (url, options) => {
    return {
        ok: true,
        json: async () => ({
            choices: [{ message: { content: 'Mocked Agent Result' } }],
            content: [{ text: 'Mocked Agent Result' }],
            message: { content: 'Mocked Agent Result' }
        })
    };
};

// Mock llm-api.js functions globally
global.fetchOpenAI = async () => 'Mocked Agent Result';
global.fetchAnthropic = async () => 'Mocked Agent Result';
global.fetchOllama = async () => 'Mocked Agent Result';

test('AGI Fusion Power Orchestrator - runAgent', async (t) => {
    const result = await runAgent('TestAgent', 'System prompt', 'User message', 'fake-key', 'openai');
    assert.strictEqual(result, 'Mocked Agent Result');
});

test('AGI Fusion Power Orchestrator - unsupported provider', async (t) => {
    try {
        await runAgent('TestAgent', 'System prompt', 'User message', 'fake-key', 'unsupported');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.strictEqual(err.message, 'Unsupported provider');
    }
});
