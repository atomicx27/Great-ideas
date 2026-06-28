const { test } = require('node:test');
const assert = require('node:assert');
const { pilotElevatorAgent } = require('../script.js');

test('Agentic-Space-Elevator-Pilot: Mocked LLM Success', async () => {
    const mockFetchFunc = {
        fetchOllama: async () => '{"action": "maintain_speed", "reasoning": "conditions are good"}'
    };

    const result = await pilotElevatorAgent('ollama', '', 50000, 50, mockFetchFunc);
    assert.strictEqual(result.action, 'maintain_speed');
    assert.strictEqual(result.reasoning, 'conditions are good');
});

test('Agentic-Space-Elevator-Pilot: Mocked LLM Error Handling', async () => {
    const mockFetchFunc = {
        fetchOpenAI: async () => 'Invalid non-JSON response'
    };

    const result = await pilotElevatorAgent('openai', 'key', 90000, 160, mockFetchFunc);
    assert.strictEqual(result.action, 'emergency_stop');
    assert.ok(result.reasoning.includes('Fallback'));
});
