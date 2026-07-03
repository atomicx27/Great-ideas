const { describe, it } = require('node:test');
const assert = require('node:assert');
const { routePodAgentically } = require('../script.js');

describe('Agentic-Hyperloop-Router tests', () => {
    global.document = {
        getElementById: () => null
    };

    it('should route via Ollama successfully', async () => {
        const response = await routePodAgentically('ollama', 'Chicago');
        assert.ok(response.includes('Mocked routing plan (Ollama)'));
    });

    it('should route via OpenAI successfully', async () => {
        const response = await routePodAgentically('openai', 'Chicago');
        assert.ok(response.includes('Mocked routing plan (OpenAI)'));
    });
});
