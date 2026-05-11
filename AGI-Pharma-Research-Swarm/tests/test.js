const { test } = require('node:test');
const assert = require('node:assert');
const { synthesizePharmaPlan } = require('../script');

test('AGI-Pharma-Research-Swarm - synthesizePharmaPlan', (t) => {
    const result = synthesizePharmaPlan(
        { cohortSize: 100 },
        { primaryRisk: 'None' },
        { yield: 90 }
    );
    assert.strictEqual(result.status, 'Ready for Pre-Clinical Review');
    assert.ok(result.actions[0].includes('100'));
    assert.ok(result.actions[1].includes('None'));
    assert.ok(result.actions[2].includes('90'));
});