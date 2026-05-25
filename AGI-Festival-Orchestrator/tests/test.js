const assert = require('node:assert');
const { test } = require('node:test');
const { orchestrateFestival } = require('../script.js');

test('orchestrates festival swarm', async () => {
    const mockFetch = async () => "- Logistics: Traffic routed\n- Security: Ready";
    const expected = ["- Logistics: Traffic routed", "- Security: Ready"];
    const result = await orchestrateFestival("Mock Fest Goal", mockFetch);
    assert.deepStrictEqual(result, expected);
});
