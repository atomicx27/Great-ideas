const { test } = require('node:test');
const assert = require('node:assert');
const { determineAction, tools } = require('../script');

test('Agentic-Autonomous-Vehicle - determineAction', (t) => {
    assert.strictEqual(determineAction('Pedestrian waiting on curb'), 'Action: Apply Brakes. Yield to pedestrian.');
    assert.strictEqual(determineAction('Clear road ahead'), 'Action: Maintain Speed.');
});

test('Agentic-Autonomous-Vehicle - tools', (t) => {
    assert.strictEqual(tools.read_lidar(), 'Distance to object: 5 meters');
    assert.strictEqual(tools.read_camera(), 'Object identified: Pedestrian on curb');
});
