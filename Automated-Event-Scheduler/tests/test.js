const assert = require('node:assert');
const { test } = require('node:test');
const { findOverlap } = require('../script.js');

test('finds common schedule overlaps', () => {
    const expected = ["10", "14"];
    const result = findOverlap("Mock schedules");
    assert.deepStrictEqual(result, expected);
});
