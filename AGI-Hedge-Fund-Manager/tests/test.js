const test = require('node:test');
const assert = require('node:assert');
const { synthesizeReports } = require('../script.js');

test('AGI-Hedge-Fund-Manager logic', (t) => {
    const quant = { signal: 'BUY' };
    const macro = { inflationExpectation: 'HIGH' };
    const risk = { volatility: 'HIGH' };

    const result = synthesizeReports(quant, macro, risk);

    assert.strictEqual(result.strategy, "Hybrid Market Neutral");
    assert.strictEqual(result.allocation["Renewable ETF"], "40%");
    assert.strictEqual(result.allocation["Oil Majors Short"], "40%");
    assert.strictEqual(result.allocation["Cash/Treasuries"], "20%");
});