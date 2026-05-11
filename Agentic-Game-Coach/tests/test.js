const { test } = require('node:test');
const assert = require('node:assert');
const { analyzeReplayData } = require('../script');

test('Agentic-Game-Coach - analyzeReplayData', (t) => {
    const feedback1 = analyzeReplayData({ visionScore: 5, csPerMin: 5, deaths: 6 });
    assert.ok(feedback1.includes('vision'));
    assert.ok(feedback1.includes('farm'));
    assert.ok(feedback1.includes('death'));

    const feedback2 = analyzeReplayData({ visionScore: 15, csPerMin: 8, deaths: 2 });
    assert.strictEqual(feedback2, "Excellent performance. Maintain current strategy.");
});