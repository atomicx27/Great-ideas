const test = require('node:test');
const assert = require('node:assert');
const { tools, formulateFlightPlan } = require('../script.js');

test('Agentic-Drone-Navigator logic', (t) => {
    let result = formulateFlightPlan("Clear skies.", "Clear path.");
    assert.strictEqual(result, "Direct Route.");

    result = formulateFlightPlan("High winds detected at 500ft altitude.", "Clear path.");
    assert.strictEqual(result, "Lowering altitude to 200ft to avoid high winds. ");

    result = formulateFlightPlan("Clear skies.", "Dynamic obstacle detected: Construction crane at coordinates 34.2, -118.3.");
    assert.strictEqual(result, "Direct Route.Rerouting 500m East to avoid construction crane.");

    result = formulateFlightPlan("High winds detected at 500ft altitude.", "Dynamic obstacle detected: Construction crane at coordinates 34.2, -118.3.");
    assert.strictEqual(result, "Lowering altitude to 200ft to avoid high winds. Rerouting 500m East to avoid construction crane.");
});