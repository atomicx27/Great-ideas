const test = require('node:test');
const assert = require('node:assert');
const { scanSector, calculateLightCurve, detectTransit } = require('../script.js');

test('Automated-Exoplanet-Telescope logic', async (t) => {
    await t.test('scanSector generates correct coordinate ranges', () => {
        const result = scanSector(1);
        assert.strictEqual(result, 'RA: 100 to 199, DEC: +20 to +30');
        const result2 = scanSector(5);
        assert.strictEqual(result2, 'RA: 500 to 599, DEC: +20 to +30');
    });

    await t.test('calculateLightCurve calculates correct min flux', () => {
        assert.strictEqual(calculateLightCurve([]), 1.0);
        assert.strictEqual(calculateLightCurve([1.0, 0.99, 0.98, 1.0]), 0.98);
        assert.strictEqual(calculateLightCurve([1.0, 0.95, 1.0]), 0.95);
    });

    await t.test('detectTransit flags transits correctly based on 2% threshold', () => {
        // No transit (1.0 - 0.99 = 0.01 < 0.02)
        const result1 = detectTransit(0.99);
        assert.strictEqual(result1.detected, false);

        // Transit detected (1.0 - 0.97 = 0.03 >= 0.02)
        const result2 = detectTransit(0.97);
        assert.strictEqual(result2.detected, true);
        assert.strictEqual(result2.dipAmount, '3.00%');

        // Exact threshold (1.0 - 0.98 = 0.02)
        // JavaScript float math: 1.0 - 0.98 = 0.020000000000000018
        // Let's pass 0.98 exact
        const result3 = detectTransit(0.98);
        assert.strictEqual(result3.detected, true);
        assert.strictEqual(result3.dipAmount, '2.00%');
    });
});
