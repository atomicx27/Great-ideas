const test = require('node:test');
const assert = require('node:assert');
const { TacticalCoachAgent, Tools } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Mocked Coach Report' } }] })
});
global.fetchLLMResponse = async () => 'Mocked Coach Report';

test('Agentic Tactical Coach - Tools functionality', async (t) => {
    const tend = await Tools.queryOpponentTendencies('test');
    assert.ok(tend.includes('DB_RESULT:'), 'Should return mocked tendency');

    const fatigue = await Tools.analyzePlayerFatigue();
    assert.ok(fatigue.includes('SENSOR_RESULT:'), 'Should return mocked fatigue data');
});

test('Agentic Tactical Coach - Agent Run Loop', async (t) => {
    const coach = new TacticalCoachAgent('openai', 'test-key');
    const report = await coach.generatePlay('test situation');

    assert.ok(coach.thoughtLog.length > 0, 'Agent should log thoughts');
    assert.ok(coach.toolLog.length > 0, 'Agent should log tools used');
    assert.strictEqual(report, 'Mocked Coach Report', 'Agent should return generated report');
});