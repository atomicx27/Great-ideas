const test = require('node:test');
const assert = require('node:assert');
const { orchestrateElevatorSystem } = require('../script.js');

test('AGI-Space-Elevator-Orchestrator logic', (t) => {
    const result = orchestrateElevatorSystem(
        { tensionGpa: 82.4, dampenerNode: 45 },
        { counterweightShiftKm: 1.2 },
        { activeClimbers: 4, nextDepartureMin: 15 }
    );

    assert.strictEqual(result.systemStatus, "Elevator System Fully Synchronized: Ascending Operations Active");
    assert.strictEqual(result.directives.length, 3);
    assert.ok(result.directives[0].includes("82.4 GPa"));
    assert.ok(result.directives[0].includes("node 45"));
    assert.ok(result.directives[1].includes("1.2 km"));
    assert.ok(result.directives[2].includes("4 climbers active"));
    assert.ok(result.directives[2].includes("15 minutes"));
});
