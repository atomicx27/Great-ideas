const assert = require('assert');
const { determineCalibrationResponse } = require('../script.js');

try {
    const resultCritical = determineCalibrationResponse(2.5, 20);
    assert.strictEqual(resultCritical.status, 'CRITICAL: Initiating Full Recalibration');
    assert.strictEqual(resultCritical.class, 'critical');

    const resultWarning = determineCalibrationResponse(1.5, 50);
    assert.strictEqual(resultWarning.status, 'WARNING: Suboptimal Performance');
    assert.strictEqual(resultWarning.class, 'warning');

    const resultNormal = determineCalibrationResponse(0.5, 80);
    assert.strictEqual(resultNormal.status, 'NORMAL: Qubit Stable');
    assert.strictEqual(resultNormal.class, 'normal');

    console.log('Automated-Quantum-Qubit-Calibrator tests passed.');
} catch (error) {
    console.error('Automated-Quantum-Qubit-Calibrator tests failed:', error);
    process.exit(1);
}
