const assert = require('node:assert');
const test = require('node:test');
const { synthesizeStrategy, simulateAgentExecution } = require('../script.js');

test('AGI-Ecosystem-Preservation-Orchestrator synthesis logic', async (t) => {
    await t.test('Correctly simulates water agent execution', () => {
        const water = simulateAgentExecution('water', 'drought');
        assert.match(water, /reservoir Alpha/);
    });

    await t.test('Correctly synthesizes strategy', () => {
        const w = "WaterAction";
        const wl = "WildlifeAction";
        const c = "CommunityAction";
        const result = synthesizeStrategy(w, wl, c);

        assert.match(result, /WaterAction/);
        assert.match(result, /WildlifeAction/);
        assert.match(result, /CommunityAction/);
        assert.match(result, /SYNERGY PLAN/);
    });
});
