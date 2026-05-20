const test = require('node:test');
const assert = require('node:assert');
const { synthesizemRNA } = require('../script.js');

test('Automated-Gene-Synthesizer - synthesizemRNA', async (t) => {
    await t.test('Correctly translates a valid DNA sequence', () => {
        const result = synthesizemRNA('ATCG');
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.mRNA, 'UAGC');
    });

    await t.test('Handles lower case inputs', () => {
        const result = synthesizemRNA('atcg');
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.mRNA, 'UAGC');
    });

    await t.test('Returns error for invalid characters', () => {
        const result = synthesizemRNA('ATXG');
        assert.strictEqual(result.error, "Invalid base 'X' at position 3");
    });

    await t.test('Returns error for non-string input', () => {
        const result = synthesizemRNA(null);
        assert.strictEqual(result.error, 'Invalid DNA sequence');
    });
});
