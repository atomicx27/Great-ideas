const assert = require('node:assert');
const test = require('node:test');
const { runDiagnosisStep, simulatedTools } = require('../script.js');

test('Agentic Stasis Medic - runDiagnosisStep', async (t) => {
    const origMetab = simulatedTools.checkMetabolism;
    const origFluid = simulatedTools.checkFluidLevels;

    const noopLog = () => {};

    await t.test('Emergency wake on stress and low fluid', async () => {
        simulatedTools.checkMetabolism = () => 'Elevated cortisol levels';
        simulatedTools.checkFluidLevels = () => 'Cryo-fluid levels critically low.';
        const result = await runDiagnosisStep(noopLog);
        assert.ok(result.includes('emergency wake protocol'));
    });

    await t.test('Sedative on stress but ok fluid', async () => {
        simulatedTools.checkMetabolism = () => 'Elevated cortisol levels';
        simulatedTools.checkFluidLevels = () => 'Cryo-fluid levels nominal.';
        const result = await runDiagnosisStep(noopLog);
        assert.ok(result.includes('mild sedative'));
    });

    await t.test('Backup fluid on stable but low fluid', async () => {
        simulatedTools.checkMetabolism = () => 'Normal resting state';
        simulatedTools.checkFluidLevels = () => 'Cryo-fluid levels critically low.';
        const result = await runDiagnosisStep(noopLog);
        assert.ok(result.includes('backup fluid reservoir'));
    });

    await t.test('Standard monitoring on stable and nominal fluid', async () => {
        simulatedTools.checkMetabolism = () => 'Normal resting state';
        simulatedTools.checkFluidLevels = () => 'Cryo-fluid levels nominal.';
        const result = await runDiagnosisStep(noopLog);
        assert.ok(result.includes('standard monitoring'));
    });

    simulatedTools.checkMetabolism = origMetab;
    simulatedTools.checkFluidLevels = origFluid;
});
