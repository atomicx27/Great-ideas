const assert = require('node:assert');
const { test } = require('node:test');
const { scanMetadata, analyzeFrameRate, calculateDeepfakeScore } = require('../script.js');

test('scanMetadata should flag unusual file types', () => {
    const result = scanMetadata(1000, 'image/jpeg');
    assert.strictEqual(result.score, 15);
    assert.ok(result.logs.some(log => log.includes('Unusual file format')));
});

test('scanMetadata should flag large file sizes', () => {
    const result = scanMetadata(60000000, 'video/mp4');
    assert.strictEqual(result.score, 10);
    assert.ok(result.logs.some(log => log.includes('Abnormally large file size')));
});

test('analyzeFrameRate should flag non-standard fps', () => {
    const result = analyzeFrameRate(10, 315); // 31.5 fps
    assert.strictEqual(result.score, 20);
    assert.ok(result.logs.some(log => log.includes('Non-standard framerate')));
});

test('analyzeFrameRate should flag irregular fps', () => {
    const result = analyzeFrameRate(10, 100); // 10 fps
    assert.strictEqual(result.score, 25);
    assert.ok(result.logs.some(log => log.includes('Irregular framerate')));
});

test('calculateDeepfakeScore should cap score at 100 and set correct verdict', () => {
    const result1 = calculateDeepfakeScore(100, 100);
    assert.strictEqual(result1.finalScore, 100);
    assert.strictEqual(result1.verdict, 'Highly Suspicious - Deepfake Likely');

    const result2 = calculateDeepfakeScore(10, 20); // 10 + 20 + 10 (base) = 40
    assert.strictEqual(result2.finalScore, 40);
    assert.strictEqual(result2.verdict, 'Suspicious - Manual Review Recommended');

    const result3 = calculateDeepfakeScore(0, 0); // 0 + 0 + 10 (base) = 10
    assert.strictEqual(result3.finalScore, 10);
    assert.strictEqual(result3.verdict, 'Likely Authentic');
});
