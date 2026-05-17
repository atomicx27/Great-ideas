const assert = require('node:assert');
const test = require('node:test');
const { BusRoutingAgent } = require('../script.js');

test('Agentic Bus Router', async (t) => {
    const agent = new BusRoutingAgent();

    await t.test('Should return thought process and decision', async () => {
        const result = await agent.handleObstruction("Test Obstruction");
        assert.ok(result.thoughtProcess.length > 0, 'Thought process should not be empty');
        assert.strictEqual(result.decision.action, 'Divert to Route B via Elm St.');
        assert.strictEqual(result.decision.confidence, '95%');
    });
});