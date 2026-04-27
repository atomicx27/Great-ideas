const test = require('node:test');
const assert = require('node:assert');
const { determineAlertLevel } = require('../script.js');

test('Automated-Weather-Alert-System logic', (t) => {
    let result = determineAlertLevel(75, 1.0);
    assert.strictEqual(result.level, 'Hurricane / Flash Flood Warning');
    assert.strictEqual(result.class, 'warning');

    result = determineAlertLevel(20, 5.5);
    assert.strictEqual(result.level, 'Hurricane / Flash Flood Warning');

    result = determineAlertLevel(60, 2.0);
    assert.strictEqual(result.level, 'Severe Storm Watch');
    assert.strictEqual(result.class, 'watch');

    result = determineAlertLevel(45, 0.5);
    assert.strictEqual(result.level, 'Wind / Rain Advisory');

    result = determineAlertLevel(10, 0.1);
    assert.strictEqual(result.level, 'All Clear');
});