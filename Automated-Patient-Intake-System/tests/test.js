const test = require('node:test');
const assert = require('node:assert');
const { determineRouting } = require('../script.js');

test('Automated-Patient-Intake-System logic', (t) => {
    let result = determineRouting(65, 'chest_pain');
    assert.strictEqual(result.department, 'Cardiology (Code Red)');
    assert.strictEqual(result.urgent, true);

    result = determineRouting(30, 'broken_bone');
    assert.strictEqual(result.department, 'Orthopedics');
    assert.strictEqual(result.urgent, false);

    result = determineRouting(3, 'fever');
    assert.strictEqual(result.department, 'Pediatrics (Urgent)');
    assert.strictEqual(result.urgent, true);
});