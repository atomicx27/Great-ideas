const test = require('node:test');
const assert = require('node:assert');
const { processAudioStream } = require('../script.js');

test('Automated-Podcast-Editor logic', (t) => {
    const mockChunks = [
        { time: 1, volume: 50 },
        { time: 2, volume: 5 }, // Below threshold
        { time: 3, volume: 90 }
    ];

    const result = processAudioStream(mockChunks, 10);

    assert.strictEqual(result.stats.originalLength, 3);
    assert.strictEqual(result.stats.newLength, 2);
    assert.strictEqual(result.stats.silenceRemoved, 1);

    // Check normalization (50 * 1.2 = 60)
    assert.strictEqual(result.processedData[0].volume, 60);
    // Check normalization cap (90 * 1.2 = 108, capped at 100)
    assert.strictEqual(result.processedData[1].volume, 100);
});