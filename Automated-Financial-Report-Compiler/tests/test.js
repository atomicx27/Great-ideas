const test = require('node:test');
const assert = require('node:assert');
const { compileReport, generateReportHTML } = require('../script.js');

test('Automated-Financial-Report-Compiler logic', (t) => {
    const sales = [{ amount: 100 }, { amount: 200 }];
    const expenses = [{ amount: 50 }, { amount: 100 }];

    const report = compileReport(sales, expenses);

    assert.strictEqual(report.totalSales, 300);
    assert.strictEqual(report.totalExpenses, 150);
    assert.strictEqual(report.netIncome, 150);
    assert.strictEqual(report.profitMargin, '50.00');
});

test('generateReportHTML formatting', (t) => {
    const reportData = {
        totalSales: 1000000,
        totalExpenses: 600000,
        netIncome: 400000,
        profitMargin: '40.00'
    };

    const html = generateReportHTML(reportData);

    // Check for key elements and formatted values
    assert.ok(html.includes('<h3>Q3 Financial Summary</h3>'), 'Should contain the header');
    // Using regex to handle different locale thousands separators
    assert.match(html, /\$1.000.000/, 'Should format total sales with separators');
    assert.match(html, /\$600.000/, 'Should format total expenses with separators');
    assert.match(html, /\$400.000/, 'Should format net income with separators');
    assert.ok(html.includes('40.00%'), 'Should display the profit margin percentage');
});

test('generateReportHTML edge cases - zero sales', (t) => {
    const reportData = {
        totalSales: 0,
        totalExpenses: 500,
        netIncome: -500,
        profitMargin: '0.00'
    };

    const html = generateReportHTML(reportData);

    assert.match(html, /\$0/, 'Should display $0 for total sales');
    assert.match(html, /\$500/, 'Should display $500 for total expenses');
    assert.match(html, /\$-500/, 'Should display $-500 for net income');
    assert.ok(html.includes('0.00%'), 'Should display 0.00% profit margin');
});

test('generateReportHTML edge cases - net loss', (t) => {
    const reportData = {
        totalSales: 1000,
        totalExpenses: 2000,
        netIncome: -1000,
        profitMargin: '-100.00'
    };

    const html = generateReportHTML(reportData);

    assert.match(html, /\$1.000/, 'Should display total sales');
    assert.match(html, /\$2.000/, 'Should display total expenses');
    assert.match(html, /\$-1.000/, 'Should display negative net income');
    assert.ok(html.includes('-100.00%'), 'Should display negative profit margin');
});
