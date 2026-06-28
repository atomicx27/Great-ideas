const { test } = require('node:test');
const assert = require('node:assert');
const { assistSurgeryAgent } = require('../script.js');

test('Agentic-Surgical-Assistant-Robot: Mocked LLM Success', async () => {
    const mockFetchFunc = {
        fetchOllama: async () => '{"status": "critical", "recommendation": "Administer fluids."}'
    };

    const result = await assistSurgeryAgent('ollama', '', '120', '90/60', mockFetchFunc);
    assert.strictEqual(result.status, 'critical');
    assert.strictEqual(result.recommendation, 'Administer fluids.');
});
