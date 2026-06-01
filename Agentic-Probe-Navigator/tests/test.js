const test = require('node:test');
const assert = require('node:assert');

// Mock fetchOpenAI globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (userMessage.includes('Obstacle detected')) {
        return 'Adjust pitch by -5 degrees to avoid obstacle.';
    }
    if (userMessage.includes('Speed drop')) {
        return 'Engage main thrusters for 3 seconds to compensate.';
    }
    return 'Maintain current trajectory.';
};

const { navigateProbe } = require('../script.js');

test('navigateProbe returns expected adjustment for obstacle', async (t) => {
    const data = "Obstacle detected 100m ahead.";
    const result = await navigateProbe(data);
    assert.strictEqual(result, 'Adjust pitch by -5 degrees to avoid obstacle.');
});

test('navigateProbe returns expected adjustment for speed drop', async (t) => {
    const data = "Speed drop of 10m/s detected.";
    const result = await navigateProbe(data);
    assert.strictEqual(result, 'Engage main thrusters for 3 seconds to compensate.');
});

test('navigateProbe handles empty data', async (t) => {
    const result = await navigateProbe("");
    assert.strictEqual(result, 'Error: No sensor data provided.');
});
