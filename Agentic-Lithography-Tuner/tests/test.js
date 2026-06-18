const { test } = require('node:test');
const assert = require('node:assert');
const { simulateReActLithographyTuning, simulatedTools } = require('../script');

test('Agentic-Lithography-Tuner - Tool Mocking', async (t) => {
    const originalInterfero = simulatedTools.useInterferometer;
    const originalDose = simulatedTools.useDoseControl;

    const logs = [];
    const logFn = (msg) => logs.push(msg);

    // Test Case 1: Optical error
    simulatedTools.useInterferometer = () => 'Interferometer scan indicates: Astigmatism.';

    let decision = await simulateReActLithographyTuning(logFn);
    assert.ok(decision.includes('Applying Zernike polynomial corrections'), 'Should apply corrections for optical error');

    // Test Case 2: Perfect alignment, bad dose
    simulatedTools.useInterferometer = () => 'Interferometer scan indicates: Perfect Alignment.';
    simulatedTools.useDoseControl = () => 'Test exposure indicates: Underexposed.';

    decision = await simulateReActLithographyTuning(logFn);
    assert.ok(decision.includes('Adjusting EUV source power'), 'Should adjust power if exposure is not optimal');

    // Test Case 3: Perfect alignment, optimal dose
    simulatedTools.useInterferometer = () => 'Interferometer scan indicates: Perfect Alignment.';
    simulatedTools.useDoseControl = () => 'Test exposure indicates: Optimal Exposure.';

    decision = await simulateReActLithographyTuning(logFn);
    assert.ok(decision.includes('Locking parameters'), 'Should lock parameters if everything is optimal');

    // Restore
    simulatedTools.useInterferometer = originalInterfero;
    simulatedTools.useDoseControl = originalDose;
});
