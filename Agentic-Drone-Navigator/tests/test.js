const test = require('node:test');
const assert = require('node:assert');
const { DroneNavigatorAgent } = require('../script.js');

test('Agentic-Drone-Navigator logic', async (t) => {
    const agent = new DroneNavigatorAgent();
    const result = await agent.analyzeAndReroute("Test-Dest-1");

    assert.strictEqual(result.thoughtProcess.length, 6);
    assert.ok(result.thoughtProcess[0].includes("Test-Dest-1"));
    assert.strictEqual(result.decision.action, "Increase altitude by 150m and reroute via Sector 8.");
    assert.strictEqual(result.decision.confidence, "98.5%");
});