const { test } = require('node:test');
const assert = require('node:assert');
const { synthesizeMitigationStrategy } = require('../script');

test('AGI-Global-Food-Security-Orchestrator - synthesizeMitigationStrategy', (t) => {
    const result = synthesizeMitigationStrategy({ strainID: 'X-42' }, { vesselsRerouted: 15 }, { subsidyBillion: 2.5 });
    assert.strictEqual(result.severity, 'CRITICAL: 30% Wheat Yield Reduction Detected');
    assert.strictEqual(result.interventions.length, 3);
    assert.match(result.interventions[0], /X-42/);
    assert.match(result.interventions[1], /15 grain vessels/);
    assert.match(result.interventions[2], /\$2\.5B/);
});
