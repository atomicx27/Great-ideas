const assert = require('node:assert');
const { test, mock } = require('node:test');
const { investigateVideo, extractForensicFeatures } = require('../script.js');

test('extractForensicFeatures should return simulated object', async () => {
    const url = 'http://test.com/vid.mp4';
    const features = await extractForensicFeatures(url);
    assert.strictEqual(features.url, url);
    assert.strictEqual(features.facialArtifactsFound, true);
    assert.ok(features.lipSyncScore < 50);
});

test('investigateVideo should orchestrate tool and LLM call correctly', async () => {
    const mockLogs = [];
    const logCallback = (msg) => mockLogs.push(msg);

    // Mock global fetchOpenAI
    global.fetchOpenAI = mock.fn(async () => {
        return "**Mock Report:** The video is a deepfake.";
    });

    const report = await investigateVideo('fake-api-key', 'test-url', logCallback);

    assert.ok(mockLogs.some(log => log.includes('Initiating investigation')));
    assert.ok(mockLogs.some(log => log.includes('Calling external tool')));
    assert.strictEqual(report, "**Mock Report:** The video is a deepfake.");
    assert.strictEqual(global.fetchOpenAI.mock.calls.length, 1);

    // Cleanup
    delete global.fetchOpenAI;
});
