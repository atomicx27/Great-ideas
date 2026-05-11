const { test } = require('node:test');
const assert = require('node:assert');
const { generateMatches } = require('../script');

test('Automated-Matchmaking-System - generateMatches', (t) => {
    const queue = [1000, 1050, 2000, 2020, 3000];
    const result = generateMatches(queue, 100);

    assert.strictEqual(result.matches.length, 2);
    assert.deepStrictEqual(result.matches[0], [1000, 1050]);
    assert.deepStrictEqual(result.matches[1], [2000, 2020]);
    assert.deepStrictEqual(result.remaining, [3000]);
});