const test = require('node:test');
const assert = require('node:assert');
const { SubAgent, AGIMasterOrchestrator } = require('../script.js');

// Mock global fetch
global.fetch = async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Mocked AGI Report' } }] })
});
global.fetchLLMResponse = async () => 'Mocked AGI Report';

test('AGI Materials Science Swarm - SubAgent Execution', async (t) => {
    const quantum = new SubAgent('quantum', 'Quantum Chemist', 'Atomic Structure');
    const result = await quantum.executeTask('test goal');

    assert.ok(result.includes('[Quantum Chemist]'), 'SubAgent should return specific output');
    assert.ok(quantum.logData.length > 0, 'SubAgent should log its process');
});

test('AGI Materials Science Swarm - Orchestrator Run', async (t) => {
    const orchestrator = new AGIMasterOrchestrator('openai', 'test-key');
    assert.strictEqual(orchestrator.agents.length, 3, 'Orchestrator should have 3 agents');

    const report = await orchestrator.runSwarm('test macro goal');
    assert.strictEqual(report, 'Mocked AGI Report', 'Orchestrator should return LLM report');
});