const assert = require('node:assert');
const test = require('node:test');
const { runAscentStep, simulatedTools } = require('../script.js');

test('Agentic Climber Pilot - runAscentStep', async (t) => {
    // Save original tool implementations
    const origWeather = simulatedTools.checkWeather;
    const origStrain = simulatedTools.checkTetherStrain;

    const noopLog = () => {};

    await t.test('Halts on bad weather and critical strain', async () => {
        simulatedTools.checkWeather = () => 'High stratospheric winds';
        simulatedTools.checkTetherStrain = () => 'Tether tension critical.';
        const result = await runAscentStep(noopLog);
        assert.ok(result.includes('emergency halt'));
    });

    await t.test('Reduces velocity on bad weather but safe strain', async () => {
        simulatedTools.checkWeather = () => 'Approaching orbital debris';
        simulatedTools.checkTetherStrain = () => 'Tether tension nominal.';
        const result = await runAscentStep(noopLog);
        assert.ok(result.includes('Reducing climber ascent velocity'));
    });

    await t.test('Halts on clear weather but critical strain', async () => {
        simulatedTools.checkWeather = () => 'Clear skies';
        simulatedTools.checkTetherStrain = () => 'Tether tension critical.';
        const result = await runAscentStep(noopLog);
        assert.ok(result.includes('Halting ascent'));
    });

    await t.test('Maintains max velocity on clear weather and safe strain', async () => {
        simulatedTools.checkWeather = () => 'Clear skies';
        simulatedTools.checkTetherStrain = () => 'Tether tension nominal.';
        const result = await runAscentStep(noopLog);
        assert.ok(result.includes('maximum safe ascent velocity'));
    });

    // Restore original tools
    simulatedTools.checkWeather = origWeather;
    simulatedTools.checkTetherStrain = origStrain;
});
