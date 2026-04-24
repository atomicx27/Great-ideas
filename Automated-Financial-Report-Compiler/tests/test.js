const test = require('node:test');
const assert = require('node:assert');
const { compileReport } = require('../script.js');

test('Automated-Financial-Report-Compiler logic', (t) => {
    const sales = [{ amount: 100 }, { amount: 200 }];
    const expenses = [{ amount: 50 }, { amount: 100 }];

    const report = compileReport(sales, expenses);

    assert.strictEqual(report.totalSales, 300);
    assert.strictEqual(report.totalExpenses, 150);
    assert.strictEqual(report.netIncome, 150);
    assert.strictEqual(report.profitMargin, '50.00');
});