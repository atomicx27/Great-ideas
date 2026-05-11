const test = require('node:test');
const assert = require('node:assert');
const { generateVtt, formatTime } = require('../script.js');

test('formatTime correctly formats seconds', (t) => {
    assert.strictEqual(formatTime(0), '00:00:00.000');
    assert.strictEqual(formatTime(65), '00:01:05.000');
    assert.strictEqual(formatTime(3600), '01:00:00.000');
});

test('generateVtt generates correct VTT structure', (t) => {
    const input = "Line one.\nLine two.";
    const result = generateVtt(input, 5);

    assert.ok(result.startsWith('WEBVTT'));
    assert.ok(result.includes('00:00:00.000 --> 00:00:05.000'));
    assert.ok(result.includes('Line one.'));
    assert.ok(result.includes('00:00:05.000 --> 00:00:10.000'));
    assert.ok(result.includes('Line two.'));
});

test('generateVtt handles empty input', (t) => {
    const result = generateVtt("   \n  ", 3);
    assert.strictEqual(result, '');
});