const test = require('node:test');
const assert = require('node:assert');
const { inspectProduct } = require('../script.js');

test('Automated Quality Control Scanner tests', async (t) => {
    await t.test('passes valid product', () => {
        const result = inspectProduct(75.0, 10.0);
        assert.strictEqual(result.passed, true);
    });

    await t.test('fails low temperature', () => {
        const result = inspectProduct(50.0, 10.0);
        assert.strictEqual(result.passed, false);
        assert.match(result.message, /Temperature.*out of bounds/);
    });

    await t.test('fails high temperature', () => {
        const result = inspectProduct(90.0, 10.0);
        assert.strictEqual(result.passed, false);
        assert.match(result.message, /Temperature.*out of bounds/);
    });

    await t.test('fails low size', () => {
        const result = inspectProduct(70.0, 9.0);
        assert.strictEqual(result.passed, false);
        assert.match(result.message, /Size.*out of bounds/);
    });

    await t.test('fails high size', () => {
        const result = inspectProduct(70.0, 11.0);
        assert.strictEqual(result.passed, false);
        assert.match(result.message, /Size.*out of bounds/);
    });

    await t.test('fails multiple constraints', () => {
        const result = inspectProduct(90.0, 11.0);
        assert.strictEqual(result.passed, false);
        assert.match(result.message, /Temperature.*out of bounds/);
        assert.match(result.message, /Size.*out of bounds/);
    });
});
