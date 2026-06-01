const assert = require('node:assert');
const { test } = require('node:test');
const { planEvent } = require('../script.js');

test('plans event based on reqs', async () => {
    const mockFetch = async () => "- Venue: confirmed\n- Caterer: pending";
    const expected = ["- Venue: confirmed", "- Caterer: pending"];
    const result = await planEvent("Mock Reqs", mockFetch);
    assert.deepStrictEqual(result, expected);
});
