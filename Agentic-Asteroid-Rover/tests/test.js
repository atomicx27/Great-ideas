const assert = require('node:assert');
const test = require('node:test');
const { runRoverMission, tools, environment } = require('../script.js');

test('Agentic Asteroid Rover Tools', async (t) => {
    environment.sector = 0;
    environment.cargo = [];

    await t.test('moveRover increments sector', () => {
        tools.moveRover();
        assert.strictEqual(environment.sector, 1);
    });

    await t.test('analyzeSample identifies composition correctly', () => {
        environment.sector = 3; // Platinum
        const result = tools.analyzeSample();
        assert.strictEqual(result.includes('Platinum'), true);
    });

    await t.test('drillSample extracts valuable ore', () => {
        environment.sector = 3; // Platinum
        const result = tools.drillSample();
        assert.strictEqual(environment.cargo.includes('Platinum'), true);
        assert.strictEqual(result.includes('Successfully extracted'), true);
    });

    await t.test('drillSample rejects dust', () => {
        environment.sector = 0; // Dust
        const result = tools.drillSample();
        assert.strictEqual(result.includes('failed'), true);
    });
});

test('Agentic Asteroid Rover Loop Simulation', async (t) => {
    let logs = [];
    const mockCallback = (type, text) => {
        logs.push({ type, text });
    };

    await runRoverMission('Ice', mockCallback);

    assert.strictEqual(environment.sector, 4); // Ice is in sector 4
    assert.strictEqual(environment.cargo.includes('Ice'), true);
    assert.strictEqual(logs[logs.length-1].text.includes('Mission Accomplished'), true);
});
