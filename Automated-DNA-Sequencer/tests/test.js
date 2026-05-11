const { test } = require('node:test');
const assert = require('node:assert');
const { alignSequences } = require('../script');

test('Automated-DNA-Sequencer - alignSequences exact match', (t) => {
    const r = alignSequences('ATCG', 'ATCG');
    assert.strictEqual(r.score, 4);
    assert.strictEqual(r.vizAlign, '||||');
});

test('Automated-DNA-Sequencer - alignSequences partial match', (t) => {
    const r = alignSequences('ATCG', 'ATCC');
    assert.strictEqual(r.score, 3);
    assert.strictEqual(r.vizAlign, '||| ');
});