const test = require('node:test');
const assert = require('node:assert');
const { synthesizeResolution } = require('../script.js');

test('AGI Global Compute Orchestrator Logic', async (t) => {
    await t.test('synthesizes resolution correctly', () => {
        const plan = synthesizeResolution({ trafficGB: 200 }, { newPrimaryRegion: 'AP-East' }, { instances: 100 });
        assert.strictEqual(plan.resolutionStatus, "Outage Resolved. Services Restored.");
        assert.ok(plan.actions[0].includes('200GB/s'));
        assert.ok(plan.actions[1].includes('AP-East'));
        assert.ok(plan.actions[2].includes('100 spot instances'));
    });
});
