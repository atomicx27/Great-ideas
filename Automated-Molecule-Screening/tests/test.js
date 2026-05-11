const test = require('node:test');
const assert = require('node:assert');
const { screenMolecule } = require('../script.js');

test('Automated-Molecule-Screening logic', (t) => {
    let result = screenMolecule(450, 4.5);
    assert.strictEqual(result.status, 'Approved');

    result = screenMolecule(550, 4.5);
    assert.strictEqual(result.status, 'Rejected');
    assert.ok(result.message.includes('Weight > 500'));

    result = screenMolecule(450, 5.5);
    assert.strictEqual(result.status, 'Rejected');
    assert.ok(result.message.includes('logP > 5'));

    result = screenMolecule(550, 5.5);
    assert.strictEqual(result.status, 'Rejected');
    assert.ok(result.message.includes('Weight > 500 and logP > 5'));

    result = screenMolecule(-10, 2);
    assert.strictEqual(result.status, 'Rejected');
});