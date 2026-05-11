const test = require('node:test');
const assert = require('node:assert');
const { EvasionAgent } = require('../script.js');

test('Agentic Space Debris Evader tests', async (t) => {
    await t.test('agent analyzes threat and returns evasion decision', async () => {
        const agent = new EvasionAgent();
        const result = await agent.analyzeThreat("TEST-OBJ-01");

        assert.ok(result.thoughtProcess.length > 0, 'Thought process should have entries');
        assert.ok(result.decision.action.includes('RCS burn'), 'Decision should recommend a burn');
        assert.strictEqual(result.decision.confidence, '99.9%');
    });

    await t.test('tools return expected data strings', () => {
        const agent = new EvasionAgent();
        assert.match(agent.tools.pingActiveRadar(), /Relative velocity/);
        assert.match(agent.tools.calculateTrajectory(), /Closest approach/);
        assert.match(agent.tools.checkFuelReserves(), /Propellant/);
    });
});
