const { test } = require('node:test');
const assert = require('node:assert');
const { monitorTension, monitorWind, processElevatorData } = require('../script.js');

test('Automated-Space-Elevator-Monitor: Tension Logic', () => {
    assert.strictEqual(monitorTension(50000), 'safe');
    assert.strictEqual(monitorTension(70000), 'warning');
    assert.strictEqual(monitorTension(90000), 'danger');
});

test('Automated-Space-Elevator-Monitor: Wind Logic', () => {
    assert.strictEqual(monitorWind(50), 'safe');
    assert.strictEqual(monitorWind(120), 'warning');
    assert.strictEqual(monitorWind(160), 'danger');
});

test('Automated-Space-Elevator-Monitor: Combined Processing', () => {
    const safeData = processElevatorData(50000, 50);
    assert.strictEqual(safeData.status, 'safe');
    assert.strictEqual(safeData.message, 'System operating nominally.');

    const warningData = processElevatorData(70000, 50);
    assert.strictEqual(warningData.status, 'warning');
    assert.ok(warningData.message.includes('High tension detected'));

    const dangerData = processElevatorData(90000, 160);
    assert.strictEqual(dangerData.status, 'danger');
    assert.ok(dangerData.message.includes('Immediate shutdown'));
});
