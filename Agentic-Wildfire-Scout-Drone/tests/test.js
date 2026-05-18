const assert = require('node:assert');
const test = require('node:test');
const { ScoutDroneAgent } = require('../script.js');

test('Agentic Wildfire Scout Drone', async (t) => {
    const agent = new ScoutDroneAgent();

    await t.test('Should return thought process and decision', async () => {
        const result = await agent.analyzeFireFront("Test Zone");
        assert.ok(result.thoughtProcess.length > 0, 'Thought process should not be empty');
        assert.strictEqual(result.decision.action, "Issue 'Red Flag' Evacuation Order for Sector 4.");
        assert.strictEqual(result.decision.confidence, '98%');
    });
});