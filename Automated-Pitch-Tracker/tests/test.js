const test = require('node:test');
const assert = require('node:assert');
const { generatePitches, evaluatePitch, ZONE } = require('../script.js');

test('Automated Pitch Tracker - Pitch Generation', (t) => {
    const pitches = generatePitches(5);
    assert.strictEqual(pitches.length, 5, 'Should generate 5 pitches');
    assert.ok(pitches[0].speed >= 80 && pitches[0].speed <= 100, 'Speed should be within realistic range');
});

test('Automated Pitch Tracker - Zone Evaluation', (t) => {
    const strike = { x: 0, y: 2.5 };
    const ballHigh = { x: 0, y: 4.0 };
    const ballOutside = { x: 1.5, y: 2.5 };

    assert.strictEqual(evaluatePitch(strike), 'Strike', 'Should evaluate as Strike');
    assert.strictEqual(evaluatePitch(ballHigh), 'Ball', 'Should evaluate high pitch as Ball');
    assert.strictEqual(evaluatePitch(ballOutside), 'Ball', 'Should evaluate outside pitch as Ball');
});