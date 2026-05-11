const test = require('node:test');
const assert = require('node:assert');
const { tools, mitigateAnomaly } = require('../script.js');

test('Agentic Satellite Maintainer Logic', async (t) => {
    await t.test('diagnostic tool works', () => {
        assert.strictEqual(tools.run_diagnostic('Solar Array B'), "Voltage regulator fault detected.");
        assert.strictEqual(tools.run_diagnostic('Thruster'), "All systems nominal.");
    });

    await t.test('reboot tool works', () => {
        assert.strictEqual(tools.reboot_system('Sensors'), "Reboot sequence completed for Sensors. Nominal operation restored.");
    });

    await t.test('mitigates known anomaly', () => {
        assert.strictEqual(mitigateAnomaly('Power drop in Solar Array B'), "Action completed: Rebooted voltage regulator on Solar Array B.");
    });

    await t.test('handles unknown anomaly', () => {
        assert.strictEqual(mitigateAnomaly('Random jitter'), "No actionable anomalies found.");
    });
});
