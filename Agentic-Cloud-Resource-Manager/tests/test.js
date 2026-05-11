const test = require('node:test');
const assert = require('node:assert');
const { tools, resolveScalingEvent } = require('../script.js');

test('Agentic Cloud Resource Manager Logic', async (t) => {
    await t.test('check_cpu_load tool works', () => {
        assert.strictEqual(tools.check_cpu_load('us-east-1'), "CPU Load at 95% on Web Tier.");
        assert.strictEqual(tools.check_cpu_load('eu-west'), "CPU Load normal (40%).");
    });

    await t.test('scale_instances tool works', () => {
        assert.strictEqual(tools.scale_instances('DB Tier', 2), "Successfully deployed 2 new instances to DB Tier.");
    });

    await t.test('resolves scaling event', () => {
        assert.strictEqual(resolveScalingEvent('Huge spike on us-east-1'), "Action completed: Scaled up Web Tier by 5 instances to handle load.");
    });

    await t.test('ignores non-spikes', () => {
        assert.strictEqual(resolveScalingEvent('Normal traffic on eu-west'), "Action completed: Monitored event, no scaling necessary.");
    });
});
