const test = require('node:test');
const assert = require('node:assert');

// Mock LLM API functions globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => `Mock response from ${systemPrompt.split('.')[0]}`;
global.fetchAnthropic = async (apiKey, model, systemPrompt, userMessage) => `Mock response from ${systemPrompt.split('.')[0]}`;
global.fetchOllama = async (model, systemPrompt, userMessage) => `Mock response from ${systemPrompt.split('.')[0]}`;

const { runAgent } = require('../script.js');

test('AGI-Synthetic-Life-Orchestrator - runAgent', async (t) => {
    await t.test('Correctly calls OpenAI mock and returns result', async () => {
        const result = await runAgent('Test Agent', 'You are a test agent.', 'User message', 'fake_key', 'openai');
        assert.strictEqual(result, 'Mock response from You are a test agent');
    });

    await t.test('Correctly calls Ollama mock and returns result', async () => {
        const result = await runAgent('Test Agent', 'You are a test agent.', 'User message', '', 'ollama');
        assert.strictEqual(result, 'Mock response from You are a test agent');
    });

    await t.test('Rejects unsupported provider', async () => {
        await assert.rejects(
            runAgent('Test Agent', 'prompt', 'message', 'key', 'invalid'),
            { message: 'Unsupported provider' }
        );
    });
});
