const assert = require('node:assert');
const test = require('node:test');
const { processSonarData } = require('../script.js');

test('Automated Sonar Mapper - processSonarData', async (t) => {
    await t.test('Identifies safe depths correctly', () => {
        const input = [200, 210, 205];
        const result = processSonarData(input);

        assert.strictEqual(result.hazards, 0);
        assert.strictEqual(result.processed.length, 3);
        assert.strictEqual(result.processed[0].status, 'Safe');
        assert.strictEqual(result.processed[0].className, 'safe');
    });

    await t.test('Identifies shallow hazards', () => {
        const input = [200, 45, 210];
        const result = processSonarData(input);

        assert.strictEqual(result.hazards, 2); // 45 is shallow, and 210 is a steep rise from 45 (165 diff)
        assert.strictEqual(result.processed[1].status, 'Hazard - Shallows');
        assert.strictEqual(result.processed[1].className, 'danger');
    });

    await t.test('Identifies steep drop hazards', () => {
        const input = [200, 350, 360];
        const result = processSonarData(input);

        assert.strictEqual(result.hazards, 1);
        assert.strictEqual(result.processed[1].status, 'Hazard - Steep Drop/Rise');
        assert.strictEqual(result.processed[1].className, 'warning');
    });
});
