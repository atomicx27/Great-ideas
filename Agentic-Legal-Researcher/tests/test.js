const assert = require('node:assert');
const test = require('node:test');
const { runAgent, tools } = require('../script.js');

test('Agentic Legal Researcher - Tools and Agent Flow', async (t) => {

    await t.test('Tool: queryCaseLaw handles autonomous robot keyword', () => {
        const result = tools.queryCaseLaw('liability for autonomous drone');
        assert.ok(result.includes('Smith v. RoboDeliveries'));
        assert.ok(result.includes('Doe v. DroneCorp'));
    });

    await t.test('Tool: queryCaseLaw handles standard queries', () => {
        const result = tools.queryCaseLaw('slip and fall in supermarket');
        assert.ok(result.includes('Palsgraf'));
    });

    await t.test('Agent execution logic without API key falls back to mock', async () => {
        const query = "Is a company liable for an autonomous delivery robot?";
        const result = await runAgent(query, 'openai', '');

        assert.ok(result.includes('Executive Legal Brief'));
        assert.ok(result.includes('Smith v. RoboDeliveries'));
        assert.ok(result.includes('strict liability'));
    });
});