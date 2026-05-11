const test = require('node:test');
const assert = require('node:assert');
const { synthesizeAirspaceStrategy } = require('../script.js');

test('AGI-Airspace-Control-Orchestrator logic', (t) => {
    const result = synthesizeAirspaceStrategy(
        { clearedRoutes: 12, efficiencyGain: 40 },
        { groundedDrones: 4200, reroutedDrones: 300 },
        { divertedFlights: 45 }
    );

    assert.strictEqual(result.crisisLevel, "Level 1 - City-Wide Grid Failure (Airspace Impacted)");
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes("12 vital routes"));
    assert.ok(result.actions[1].includes("4200 non-essential"));
    assert.ok(result.actions[2].includes("45 passenger flights"));
});