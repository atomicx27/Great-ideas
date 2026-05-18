const assert = require('assert');
const { tools, resolveTradingEvent } = require('../script.js');

try {
    const priceRes = tools.check_market_price(500);
    assert.strictEqual(priceRes, 'Current market price is $12.50/ton for 500 volume.');

    const tradeRes = tools.execute_trade(500, 12.50);
    assert.strictEqual(tradeRes, 'Successfully purchased 500 tons at $12.5/ton.');

    const resolveRes = resolveTradingEvent('Offset 500 tons CO2 under $15/ton');
    assert.strictEqual(resolveRes, 'Trading completed: Offset 500 tons of CO2 within budget constraint.');

    console.log('Agentic-Carbon-Credit-Trader tests passed.');
} catch (error) {
    console.error('Agentic-Carbon-Credit-Trader tests failed:', error);
    process.exit(1);
}
