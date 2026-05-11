const test = require('node:test');
const assert = require('node:assert');
const { tools, planEvacuationRoute } = require('../script.js');

test('Agentic-Evacuation-Route-Planner logic', (t) => {
    const bridgeClosed = tools.check_bridge_status('Main St Bridge');
    assert.ok(bridgeClosed.includes('Closed'));

    const bridgeOpen = tools.check_bridge_status('Highway 9 Bridge');
    assert.ok(bridgeOpen.includes('Open'));

    const floodValley = tools.check_flood_levels('valley road');
    assert.ok(floodValley.includes('Impassable'));

    const floodHills = tools.check_flood_levels('hill road');
    assert.ok(floodHills.includes('Clear'));

    const floodPlan = planEvacuationRoute('Flooding in the valley');
    assert.ok(floodPlan.includes('Highway 9'));

    const normalPlan = planEvacuationRoute('Normal evacuation drill');
    assert.ok(normalPlan.includes('Main St'));
});