const { test } = require('node:test');
const assert = require('node:assert');
const { runAgentStep, simulatedTools } = require('../script');

test('Agentic-Pollution-Tracker - Tool Mocking', async (t) => {
    // Mock the tools to ensure deterministic output for testing
    const originalCurrents = simulatedTools.checkCurrents;
    const originalScan = simulatedTools.scanMicroplastics;

    const logs = [];
    const logFn = (msg) => logs.push(msg);

    // Test case 1: High density
    simulatedTools.checkCurrents = () => 'Currents are flowing North at 5 knots.';
    simulatedTools.scanMicroplastics = () => 'High microplastic density detected nearby.';

    let decision = await runAgentStep(logFn);
    assert.ok(decision.includes('Deploying collection nets'), 'Should deploy nets for high density');

    // Test case 2: Low density
    simulatedTools.checkCurrents = () => 'Currents are flowing South at 2 knots.';
    simulatedTools.scanMicroplastics = () => 'Low microplastic density detected nearby.';

    decision = await runAgentStep(logFn);
    assert.ok(decision.includes('Following currents'), 'Should follow currents for low density');

    // Restore originals (good practice)
    simulatedTools.checkCurrents = originalCurrents;
    simulatedTools.scanMicroplastics = originalScan;
});