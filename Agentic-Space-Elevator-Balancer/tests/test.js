const { describe, it } = require('node:test');
const assert = require('node:assert');
const { balanceTetherTension } = require('../script.js');

describe('Agentic-Space-Elevator-Balancer tests', () => {
    global.document = {
        getElementById: () => null
    };

    it('should balance tension via Ollama', async () => {
        const response = await balanceTetherTension('ollama', 'High winds');
        assert.ok(response.includes('Mocked balancing strategy (Ollama)'));
    });

    it('should balance tension via OpenAI', async () => {
        const response = await balanceTetherTension('openai', 'High winds');
        assert.ok(response.includes('Mocked balancing strategy (OpenAI)'));
    });
});
