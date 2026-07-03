const { describe, it } = require('node:test');
const assert = require('node:assert');
const { orchestrateSwarm } = require('../script.js');

describe('AGI-Hyperloop-Orchestrator tests', () => {
    global.document = {
        getElementById: () => null,
        createElement: () => ({ innerHTML: '', className: '' })
    };

    it('should orchestrate swarm via Ollama', async () => {
        const summary = await orchestrateSwarm('ollama', 'Test goal');
        assert.ok(summary.includes('OLLAMA'));
        assert.ok(summary.includes('Evaluated 3 domains'));
    });

    it('should orchestrate swarm via OpenAI', async () => {
        const summary = await orchestrateSwarm('openai', 'Test goal');
        assert.ok(summary.includes('OPENAI'));
    });
});
