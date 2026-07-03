const { describe, it } = require('node:test');
const assert = require('node:assert');
const { orchestrateElevatorSwarm } = require('../script.js');

describe('AGI-Space-Elevator-Orchestrator tests', () => {
    global.document = {
        getElementById: () => null,
        createElement: () => ({ innerHTML: '', className: '' })
    };

    it('should orchestrate elevator swarm via Ollama', async () => {
        const summary = await orchestrateElevatorSwarm('ollama', 'Maximize throughput');
        assert.ok(summary.includes('OLLAMA'));
        assert.ok(summary.includes('Coordinated 3 elevator domains'));
    });

    it('should orchestrate elevator swarm via OpenAI', async () => {
        const summary = await orchestrateElevatorSwarm('openai', 'Maximize throughput');
        assert.ok(summary.includes('OPENAI'));
    });
});
