const test = require('node:test');
const assert = require('node:assert');
const { tools, formatAgentOutput } = require('../script.js');

test('Agentic-Investment-Analyst logic', (t) => {
    const priceData = tools.get_stock_price('AAPL');
    assert.strictEqual(priceData.price, 175.50);

    const newsData = tools.fetch_latest_news('AAPL');
    assert.strictEqual(newsData.length, 2);

    const output = formatAgentOutput('AAPL', priceData, newsData);
    assert.ok(output.includes('HOLD'));
    assert.ok(output.includes('175.5'));
});