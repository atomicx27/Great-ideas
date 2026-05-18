const assert = require('assert');
const { determineCaptureResponse } = require('../script.js');

try {
    const resultCritical = determineCaptureResponse(400, 95);
    assert.strictEqual(resultCritical.status, 'CRITICAL: Filter Saturated');
    assert.strictEqual(resultCritical.class, 'critical');

    const resultWarning1 = determineCaptureResponse(650, 50);
    assert.strictEqual(resultWarning1.status, 'WARNING: High CO2 Concentration');
    assert.strictEqual(resultWarning1.class, 'warning');

    const resultWarning2 = determineCaptureResponse(450, 80);
    assert.strictEqual(resultWarning2.status, 'ELEVATED: Maintenance Required Soon');
    assert.strictEqual(resultWarning2.class, 'warning');

    const resultNormal = determineCaptureResponse(350, 40);
    assert.strictEqual(resultNormal.status, 'NORMAL: Optimal Operation');
    assert.strictEqual(resultNormal.class, 'normal');

    console.log('Automated-Carbon-Capture-Controller tests passed.');
} catch (error) {
    console.error('Automated-Carbon-Capture-Controller tests failed:', error);
    process.exit(1);
}
