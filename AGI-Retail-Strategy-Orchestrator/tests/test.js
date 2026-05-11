const assert = require('node:assert');
const test = require('node:test');
const { synthesizeStrategy, simulateAgentExecution } = require('../script.js');

test('AGI-Retail-Strategy-Orchestrator synthesis logic', async (t) => {
    await t.test('Correctly simulates agent execution', () => {
        const marketing = simulateAgentExecution('marketing', 'test');
        assert.match(marketing, /social media campaigns/);
    });

    await t.test('Correctly synthesizes strategy', () => {
        const m = "M-Action";
        const l = "L-Action";
        const p = "P-Action";
        const result = synthesizeStrategy(m, l, p);

        assert.match(result, /M-Action/);
        assert.match(result, /L-Action/);
        assert.match(result, /P-Action/);
        assert.match(result, /SYNERGY PLAN/);
    });
});
