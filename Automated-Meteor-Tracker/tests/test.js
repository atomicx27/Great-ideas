const assert = require('node:assert');
const test = require('node:test');
const { calculateImpactProbability } = require('../script.js');

test('Automated-Meteor-Tracker: calculateImpactProbability deterministic rules', (t) => {
    // Low risk: speed=10, mass=5000, angle=20
    // Score: 0 + 0 + 0 = 0
    let res1 = calculateImpactProbability(10, 5000, 20);
    assert.strictEqual(res1.classification, 'LOW');
    assert.strictEqual(res1.probability, 0);

    // High risk: speed=50, mass=100000, angle=80
    // Score: 30 + 40 + 30 = 100
    let res2 = calculateImpactProbability(50, 100000, 80);
    assert.strictEqual(res2.classification, 'HIGH');
    assert.strictEqual(res2.probability, 100);

    // Medium risk: speed=20, mass=20000, angle=45
    // Score: 10 + 20 + 15 = 45
    let res3 = calculateImpactProbability(20, 20000, 45);
    assert.strictEqual(res3.classification, 'MEDIUM');
    assert.strictEqual(res3.probability, 45);
});
