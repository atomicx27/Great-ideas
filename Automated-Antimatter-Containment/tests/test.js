const assert = require('assert');
const { checkContainmentStatus } = require('../script.js');

try {
    const resultSafe = checkContainmentStatus(1.5, 4.0);
    assert.strictEqual(resultSafe.status, 'SAFE');

    const resultWarning = checkContainmentStatus(1.5, 15.0);
    assert.strictEqual(resultWarning.status, 'WARNING');

    const resultCritical = checkContainmentStatus(0.2, 4.0);
    assert.strictEqual(resultCritical.status, 'CRITICAL');

    console.log("TAP version 13\n1..3\nok 1 - Safe containment\nok 2 - Warning containment\nok 3 - Critical containment");
} catch (e) {
    console.error(e);
    process.exit(1);
}
