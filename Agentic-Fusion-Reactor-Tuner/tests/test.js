const test = require('node:test');
const assert = require('node:assert');
const { runTuningSimulation } = require('../script.js');

// Mock fetch globally
global.fetch = async (url, options) => {
    return {
        ok: true,
        json: async () => ({
            choices: [{ message: { content: 'Mocked Tuning Result' } }],
            content: [{ text: 'Mocked Tuning Result' }],
            message: { content: 'Mocked Tuning Result' }
        })
    };
};

// Mock llm-api.js functions globally
global.fetchOpenAI = async () => 'Mocked Tuning Result';
global.fetchAnthropic = async () => 'Mocked Tuning Result';
global.fetchOllama = async () => 'Mocked Tuning Result';

test('Agentic Fusion Reactor Tuner - valid input', async (t) => {
    const result = await runTuningSimulation('Increase Q-factor', 'fake-key', 'openai');
    assert.strictEqual(result, 'Mocked Tuning Result');
});

test('Agentic Fusion Reactor Tuner - invalid input', async (t) => {
    try {
        await runTuningSimulation('', 'fake-key', 'openai');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.strictEqual(err.message, 'Invalid target output');
    }
});
