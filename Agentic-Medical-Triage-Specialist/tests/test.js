const test = require('node:test');
const assert = require('node:assert');
const { tools, generateTriageScore } = require('../script.js');

test('Agentic-Medical-Triage-Specialist logic', (t) => {
    const history = tools.check_patient_history('123');
    assert.strictEqual(history.allergies, 'Penicillin');

    const followup = tools.ask_followup_question('fever');
    assert.ok(followup.includes('101 F'));

    const resultUrgent = generateTriageScore('lower right abdomen pain', true);
    assert.ok(resultUrgent.includes('Priority 1'));

    const resultNormal = generateTriageScore('headache', false);
    assert.ok(resultNormal.includes('Priority 3'));
});