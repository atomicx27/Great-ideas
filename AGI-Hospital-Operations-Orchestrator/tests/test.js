const test = require('node:test');
const assert = require('node:assert');
const { synthesizeEmergencyPlan } = require('../script.js');

test('AGI-Hospital-Operations-Orchestrator logic', (t) => {
    const staffing = { surgeonsAvailable: 12 };
    const logistics = { bloodUnits: 50 };
    const patientFlow = { bedsCleared: 15 };

    const result = synthesizeEmergencyPlan(staffing, logistics, patientFlow);

    assert.strictEqual(result.codeStatus, "Code Orange - Mass Casualty");
    assert.ok(result.actions[0].includes('12'));
    assert.ok(result.actions[1].includes('50'));
    assert.ok(result.actions[2].includes('15'));
});