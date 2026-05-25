const test = require('node:test');
const assert = require('node:assert');
const { runOptimization } = require('../script.js');

// Mock fetch globally
global.fetch = async (url, options) => {
    return {
        ok: true,
        json: async () => ({
            choices: [{ message: { content: 'Mocked Agent Optimization Result' } }],
            content: [{ text: 'Mocked Agent Optimization Result' }],
            message: { content: 'Mocked Agent Optimization Result' }
        })
    };
};

// Mock llm-api.js functions globally
global.fetchOpenAI = async () => 'Mocked Agent Optimization Result';
global.fetchAnthropic = async () => 'Mocked Agent Optimization Result';
global.fetchOllama = async () => 'Mocked Agent Optimization Result';

test('Agentic Cell Line Optimizer - valid input', async (t) => {
    const result = await runOptimization('High marbling', 'fake-key', 'openai');
    assert.strictEqual(result, 'Mocked Agent Optimization Result');
});

test('Agentic Cell Line Optimizer - invalid input', async (t) => {
    try {
        await runOptimization('', 'fake-key', 'openai');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.strictEqual(err.message, 'Invalid target traits');
    }
});
