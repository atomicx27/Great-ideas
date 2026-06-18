const { test } = require('node:test');
const assert = require('node:assert');
const { adjustClimberSpeed, simulatedTools } = require('../script');

test('Agentic-Climber-Navigator - Tool Mocking', async (t) => {
    const originalRadar = simulatedTools.checkDebrisRadar;
    const originalDrag = simulatedTools.checkAtmosphericDrag;

    const logs = [];
    const logFn = (msg) => logs.push(msg);

    // Test Case 1: Major Debris
    simulatedTools.checkDebrisRadar = () => 'Major Debris Intercept Imminent';
    simulatedTools.checkAtmosphericDrag = () => 'Low Drag (Exosphere)';

    let decision = await adjustClimberSpeed(logFn);
    assert.ok(decision.includes('Initiating emergency halt'), 'Should halt for major debris');

    // Test Case 2: Minor Debris
    simulatedTools.checkDebrisRadar = () => 'Minor Debris Field Ahead';
    simulatedTools.checkAtmosphericDrag = () => 'Low Drag (Exosphere)';

    decision = await adjustClimberSpeed(logFn);
    assert.ok(decision.includes('Slowing ascent to 200 km/h'), 'Should slow for minor debris');

    // Test Case 3: Clear path, High Drag
    simulatedTools.checkDebrisRadar = () => 'Clear Path';
    simulatedTools.checkAtmosphericDrag = () => 'High Drag (Mesosphere)';

    decision = await adjustClimberSpeed(logFn);
    assert.ok(decision.includes('Increasing power'), 'Should increase power for high drag');

    // Restore
    simulatedTools.checkDebrisRadar = originalRadar;
    simulatedTools.checkAtmosphericDrag = originalDrag;
});
