const assert = require('node:assert');
const test = require('node:test');
const { orchestrateSwarm, runZoningAgent, runTrafficAgent, runEnvironmentAgent } = require('../script.js');

test('AGI Urban Planning Orchestrator - Swarm Logic', async (t) => {

    await t.test('Sub-agent: Zoning outputs correct recommendation', async () => {
        const result = await runZoningAgent("test goal");
        assert.ok(result.includes('60% high-density residential'));
    });

    await t.test('Sub-agent: Traffic outputs correct recommendation', async () => {
        const result = await runTrafficAgent("test goal");
        assert.ok(result.includes('Light Rail Transit'));
    });

    await t.test('Sub-agent: Environment outputs correct recommendation', async () => {
        const result = await runEnvironmentAgent("test goal");
        assert.ok(result.includes('green roofs'));
    });

    await t.test('Master Orchestrator synthesizes output', async () => {
        const goal = "Build a better city.";
        const result = await orchestrateSwarm(goal);

        // Output should contain the goal and all three sub-agent results
        assert.ok(result.includes(goal));
        assert.ok(result.includes('60% high-density residential'));
        assert.ok(result.includes('Light Rail Transit'));
        assert.ok(result.includes('green roofs'));
        assert.ok(result.includes('Conflict detected')); // Orchestrator synthesis note
    });
});