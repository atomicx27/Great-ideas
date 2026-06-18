const test = require('node:test');
const assert = require('node:assert');
const { filterContent } = require('../script.js');
test('Content Filter - Approves clean text', () => {
    const result = filterContent('This is a great product!');
    assert.strictEqual(result.approved, true);
});
test('Content Filter - Rejects banned words', () => {
    const result = filterContent('This is a scam do not buy');
    assert.strictEqual(result.approved, false);
    assert.ok(result.reason.includes('scam'));
});
test('Content Filter - Case insensitive', () => {
    const result = filterContent('SPAM email');
    assert.strictEqual(result.approved, false);
});
