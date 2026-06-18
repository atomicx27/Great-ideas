const assert = require('node:assert');
const { processReturnItem, calculateRefundAmount } = require('../script.js');

// Test basic approval
let item = { category: 'clothing', price: 50, daysSince: 10, condition: 'unopened' };
let decision = processReturnItem(item);
assert.strictEqual(decision.approved, true);
assert.strictEqual(calculateRefundAmount(item), 50);

// Test perishable rejection
item = { category: 'perishable', price: 20, daysSince: 1, condition: 'unopened' };
decision = processReturnItem(item);
assert.strictEqual(decision.approved, false);
assert.strictEqual(calculateRefundAmount(item), 0);

// Test electronics restocking fee
item = { category: 'electronics', price: 100, daysSince: 5, condition: 'opened_good' };
decision = processReturnItem(item);
assert.strictEqual(decision.approved, true);
assert.strictEqual(calculateRefundAmount(item), 85); // 15% fee

// Test time limit
item = { category: 'clothing', price: 50, daysSince: 40, condition: 'unopened' };
decision = processReturnItem(item);
assert.strictEqual(decision.approved, false);

// Test defective full refund
item = { category: 'electronics', price: 100, daysSince: 20, condition: 'defective' };
decision = processReturnItem(item);
assert.strictEqual(decision.approved, true);
assert.strictEqual(calculateRefundAmount(item), 100);

console.log('All Automated-Return-Processor tests passed!');
