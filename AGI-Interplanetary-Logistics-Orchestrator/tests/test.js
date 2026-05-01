const test = require('node:test');
const assert = require('node:assert');
const { synthesizeMissionPlan } = require('../script.js');

test('AGI Interplanetary Logistics Orchestrator Logic', async (t) => {
    await t.test('synthesizes plan correctly', () => {
        const plan = synthesizeMissionPlan({ tons: 500 }, { window: 'T+24' }, { modules: 10 });
        assert.strictEqual(plan.missionStatus, "GO for Launch");
        assert.ok(plan.actions[0].includes('500 tons'));
        assert.ok(plan.actions[1].includes('T+24'));
        assert.ok(plan.actions[2].includes('10 habitation modules'));
    });
});
