const test = require('node:test');
const assert = require('node:assert');
const { evaluateMetrics, Q_SCORE_THRESHOLD, ERROR_RATE_THRESHOLD } = require('../script.js');

test('Automated DNA Sequencer Monitor Core Logic', async (t) => {

    await t.test('Metrics within acceptable range return ok status', () => {
        const qScore = 35; // Above 30
        const errorRate = 1.0; // Below 1.5
        const result = evaluateMetrics(qScore, errorRate);
        assert.strictEqual(result.status, 'ok');
        assert.strictEqual(result.message, 'Metrics within acceptable range.');
    });

    await t.test('Low Q-score triggers alert', () => {
        const qScore = 28; // Below 30
        const errorRate = 1.0;
        const result = evaluateMetrics(qScore, errorRate);
        assert.strictEqual(result.status, 'alert');
        assert.ok(result.message.includes('Low Q-Score detected'));
    });

    await t.test('High error rate triggers alert', () => {
        const qScore = 35;
        const errorRate = 2.0; // Above 1.5
        const result = evaluateMetrics(qScore, errorRate);
        assert.strictEqual(result.status, 'alert');
        assert.ok(result.message.includes('High Error Rate detected'));
    });

    await t.test('Both bad metrics triggers alert (Q-score prioritised)', () => {
        const qScore = 25;
        const errorRate = 3.0;
        const result = evaluateMetrics(qScore, errorRate);
        assert.strictEqual(result.status, 'alert');
        // Because of the order of conditionals in the logic, Q-score is evaluated first.
        assert.ok(result.message.includes('Low Q-Score detected'));
    });
});