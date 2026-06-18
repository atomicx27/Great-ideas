const test = require('node:test');
const assert = require('node:assert');
const { synthesizeFabStrategy } = require('../script.js');

test('AGI-Semiconductor-Fab-Orchestrator logic', (t) => {
    const result = synthesizeFabStrategy(
        { resolution: 2, alignmentError: 0.5 },
        { substrate: "Silicon-28", runtimeDays: 45 },
        { wafersPerHour: 120 }
    );

    assert.strictEqual(result.productionStatus, "Global Fab Synchronization Active: High-Yield Mode");
    assert.strictEqual(result.directives.length, 3);
    assert.ok(result.directives[0].includes("2nm"));
    assert.ok(result.directives[0].includes("0.5nm"));
    assert.ok(result.directives[1].includes("Silicon-28"));
    assert.ok(result.directives[1].includes("45 days"));
    assert.ok(result.directives[2].includes("120 wafers per hour"));
});
