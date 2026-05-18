const { test } = require('node:test');
const assert = require('node:assert');
const { runProspectorStep, simulatedTools } = require('../script');

test('Agentic-Asteroid-Prospector - Tool Mocking', async (t) => {
    // Mock tools for deterministic tests
    const originalSpectro = simulatedTools.useSpectrometer;
    const originalDrill = simulatedTools.useCoreDrill;

    const logs = [];
    const logFn = (msg) => logs.push(msg);

    // Test Case 1: Low value surface trace
    simulatedTools.useSpectrometer = () => 'Spectroscopic analysis indicates high concentrations of Iron/Nickel.';

    let decision = await runProspectorStep(logFn);
    assert.ok(decision.includes('Conserving drill battery'), 'Should conserve drill if no high-value trace');

    // Test Case 2: High value trace, good core
    simulatedTools.useSpectrometer = () => 'Spectroscopic analysis indicates high concentrations of Platinum Group.';
    simulatedTools.useCoreDrill = () => 'Core sample yields extreme purity. Highly lucrative target.';

    decision = await runProspectorStep(logFn);
    assert.ok(decision.includes('Planting claiming beacon'), 'Should plant beacon if trace and core are good');

    // Test Case 3: High value trace, bad core
    simulatedTools.useSpectrometer = () => 'Spectroscopic analysis indicates high concentrations of Platinum Group.';
    simulatedTools.useCoreDrill = () => 'Core sample mostly slag and ice. Low value target.';

    decision = await runProspectorStep(logFn);
    assert.ok(decision.includes('Moving to next asteroid'), 'Should move on if core is bad despite surface trace');

    // Restore
    simulatedTools.useSpectrometer = originalSpectro;
    simulatedTools.useCoreDrill = originalDrill;
});