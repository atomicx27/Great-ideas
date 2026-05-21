const test = require('node:test');
const assert = require('node:assert');
const { MaterialDiscovererAgent, Tools } = require('../script.js');

// Mock global fetch for testing
global.fetch = async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Mocked LLM Report' } }] })
});

// Mock fetchLLMResponse since it's injected in the browser
global.fetchLLMResponse = async () => 'Mocked LLM Report';

test('Agentic Material Discoverer - Tools functionality', async (t) => {
    const searchResult = await Tools.searchDatabase('test query');
    assert.ok(searchResult.includes('DB_RESULT:'), 'Tool should return mocked DB result');

    const simResult = await Tools.simulateProperties('Carbon');
    assert.ok(simResult.includes('SIMULATION_RESULT:'), 'Tool should return mocked Simulation result');

    const toxResult = await Tools.checkToxicity('Carbon');
    assert.ok(toxResult.includes('TOXICITY_RESULT:'), 'Tool should return mocked Toxicity result');
});

test('Agentic Material Discoverer - Agent Run Loop', async (t) => {
    const agent = new MaterialDiscovererAgent('openai', 'test-key');
    const report = await agent.run('test properties');

    assert.ok(agent.thoughtLog.length > 0, 'Agent should log thoughts');
    assert.ok(agent.toolLog.length > 0, 'Agent should log tools used');
    assert.strictEqual(report, 'Mocked LLM Report', 'Agent should return generated report');
});