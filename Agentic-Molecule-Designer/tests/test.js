const { test } = require('node:test');
const assert = require('node:assert');
const { simulateAffinityCalculation } = require('../script');

test('Agentic-Molecule-Designer - simulateAffinityCalculation', (t) => {
    const affinity = simulateAffinityCalculation('C1=CC=C(C=C1)C(=O)O');
    // Length is 19. 19*5 = 95. Random is 0-9. Min(99, 95+rand) should be >= 95 and <= 99.
    assert.ok(affinity >= 95 && affinity <= 99);
});