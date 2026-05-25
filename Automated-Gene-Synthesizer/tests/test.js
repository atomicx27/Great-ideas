const test = require('node:test');
const assert = require('node:assert');
const { transcribeDNAtoMRNA } = require('../script.js');

test('Automated-Gene-Synthesizer transcription', (t) => {
    // Valid DNA sequence
    const result = transcribeDNAtoMRNA("ATCGGCTA");
    assert.strictEqual(result, "UAGCCGAU");

    // Invalid DNA sequence
    assert.throws(() => transcribeDNAtoMRNA("ATXG"), /Invalid base 'X'/);
});