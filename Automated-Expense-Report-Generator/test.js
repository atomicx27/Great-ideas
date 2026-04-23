const test = require('node:test');
const assert = require('node:assert');
const { categorizeExpense } = require('./script.js');

test('categorizeExpense rules', async (t) => {
    await t.test('categorizes Uber as Transportation', () => {
        assert.strictEqual(categorizeExpense('Uber'), 'Transportation');
        assert.strictEqual(categorizeExpense('uber'), 'Transportation');
    });

    await t.test('categorizes Lyft as Transportation', () => {
        assert.strictEqual(categorizeExpense('Lyft'), 'Transportation');
    });

    await t.test('categorizes Airlines as Transportation', () => {
        assert.strictEqual(categorizeExpense('Delta Airlines'), 'Transportation');
    });

    await t.test('categorizes Starbucks as Meals & Entertainment', () => {
        assert.strictEqual(categorizeExpense('Starbucks'), 'Meals & Entertainment');
    });

    await t.test('categorizes Restaurant as Meals & Entertainment', () => {
        assert.strictEqual(categorizeExpense('Local Restaurant'), 'Meals & Entertainment');
    });

    await t.test('categorizes Hotel as Lodging', () => {
        assert.strictEqual(categorizeExpense('Grand Hotel'), 'Lodging');
    });

    await t.test('categorizes Marriott as Lodging', () => {
        assert.strictEqual(categorizeExpense('Marriott'), 'Lodging');
    });

    await t.test('categorizes Office as Supplies', () => {
        assert.strictEqual(categorizeExpense('Office Depot'), 'Supplies');
    });

    await t.test('categorizes unknown as Other', () => {
        assert.strictEqual(categorizeExpense('Amazon'), 'Other');
        assert.strictEqual(categorizeExpense('Unknown Vendor'), 'Other');
    });
});
