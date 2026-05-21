const test = require('node:test');
const assert = require('node:assert');
const { SubAgent, AGIGeneralManager } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Mocked Strategy Report' } }] })
});
global.fetchLLMResponse = async () => 'Mocked Strategy Report';

test('AGI Sports Franchise Orchestrator - SubAgent Execution', async (t) => {
    const scouting = new SubAgent('scouting', 'Scouting', 'Talent');
    const result = await scouting.executeTask('test goal');

    assert.ok(result.includes('[Scouting Director]'), 'SubAgent should return specific output');
    assert.ok(scouting.logData.length > 0, 'SubAgent should log its process');
});

test('AGI Sports Franchise Orchestrator - Orchestrator Run', async (t) => {
    const gm = new AGIGeneralManager('openai', 'test-key');
    assert.strictEqual(gm.agents.length, 3, 'GM should have 3 agents');

    const report = await gm.runSwarm('test macro goal');
    assert.strictEqual(report, 'Mocked Strategy Report', 'GM should return LLM report');
});