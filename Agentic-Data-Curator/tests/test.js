const test = require('node:test');
const assert = require('node:assert');
const { DataCuratorAgent } = require('../script.js');

test('Agentic-Data-Curator logic', async (t) => {
    const agent = new DataCuratorAgent();
    const result = await agent.curateSample("Test-Img-01");

    assert.strictEqual(result.thoughtProcess.length, 6);
    assert.ok(result.thoughtProcess[0].includes("Test-Img-01"));
    assert.strictEqual(result.decision.confidence, "94.2%");
    assert.ok(result.decision.action.includes("mask to remove glare"));
});