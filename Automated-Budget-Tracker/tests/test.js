const test = require('node:test');
const assert = require('node:assert');
const { categorizeExpense } = require('../script.js');
test('Budget Tracker - Rent is fixed essential', () => {
    const result = categorizeExpense(1200, 'rent');
    assert.strictEqual(result.category, 'Fixed Essential');
    assert.strictEqual(result.warning, false);
});
test('Budget Tracker - High groceries triggers warning', () => {
    const result = categorizeExpense(600, 'groceries');
    assert.strictEqual(result.category, 'Variable Essential');
    assert.strictEqual(result.warning, true);
});
test('Budget Tracker - Normal entertainment is fine', () => {
    const result = categorizeExpense(50, 'entertainment');
    assert.strictEqual(result.category, 'Discretionary');
    assert.strictEqual(result.warning, false);
});
