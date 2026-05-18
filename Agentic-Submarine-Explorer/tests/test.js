const assert = require('node:assert');
const test = require('node:test');
const { runAgentMission, tools, environment } = require('../script.js');

test('Agentic Submarine Explorer Tools', async (t) => {
    await t.test('adjustDepth tool updates environment correctly', () => {
        tools.adjustDepth(1000);
        assert.strictEqual(environment.depth, 1000);
    });

    await t.test('propel tool updates environment correctly', () => {
        environment.x = 0;
        tools.propel(10);
        assert.strictEqual(environment.x, 10);
    });

    await t.test('scanEnvironment detects obstacle', () => {
        environment.x = 18;
        environment.depth = 550; // Obstacle is at 20, 500
        const result = tools.scanEnvironment();
        assert.strictEqual(result.includes('Warning'), true);
    });

    await t.test('scanEnvironment reports clear path', () => {
        environment.x = 100;
        environment.depth = 100;
        const result = tools.scanEnvironment();
        assert.strictEqual(result.includes('Path clear'), true);
    });
});

test('Agentic Submarine Agent Loop Simulation', async (t) => {
    let logs = [];
    const mockCallback = (type, text) => {
        logs.push({ type, text });
    };

    environment.obstacles = []; // clear obstacles for simple test
    await runAgentMission(10, 100, mockCallback);

    // Check if it reached the target
    assert.strictEqual(environment.x, 10);
    assert.strictEqual(environment.depth, 100);
    assert.strictEqual(logs[logs.length-1].text, 'Mission Accomplished. Target reached.');
});
