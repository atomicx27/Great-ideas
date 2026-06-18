const assert = require('assert');
const { evaluateWaveAmplitude } = require('../script.js');

try {
    const resMerger = evaluateWaveAmplitude(15.0, 100);
    assert.strictEqual(resMerger.type, 'MERGER_EVENT');

    const resCandidate = evaluateWaveAmplitude(2.0, 10);
    assert.strictEqual(resCandidate.type, 'CANDIDATE');

    const resNoise = evaluateWaveAmplitude(0.5, 100);
    assert.strictEqual(resNoise.type, 'NOISE');

    console.log("TAP version 13\n1..3\nok 1 - Merger event logic\nok 2 - Candidate logic\nok 3 - Noise logic");
} catch (e) {
    console.error(e);
    process.exit(1);
}
