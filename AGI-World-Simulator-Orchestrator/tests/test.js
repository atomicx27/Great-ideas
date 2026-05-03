const test = require('node:test');
const assert = require('node:assert');
const { synthesizeSimulationEnvironment } = require('../script.js');

test('AGI-World-Simulator-Orchestrator logic', (t) => {
    const result = synthesizeSimulationEnvironment(
        { gravity: 0.38, windSpeed: 120 },
        { anomalies: 45, solarSol: 142 },
        { resolution: "8K", syntheticLabels: 124000 }
    );

    assert.strictEqual(result.environmentID, "SIM-MARTIAN-STORM-V4");
    assert.strictEqual(result.components.length, 3);
    assert.ok(result.components[0].includes("0.38g gravity"));
    assert.ok(result.components[1].includes("45 dynamic anomalies"));
    assert.ok(result.components[2].includes("124000 synthetic"));
});