const test = require('node:test');
const assert = require('node:assert');
const { generateEmails } = require('../script.js');

test('Automated Email Campaign Manager - Success', (t) => {
    const csv = "John Doe,Acme Corp,john@acme.com\nJane Smith,Globex,jane@globex.com";
    const template = "Hi {Name}, see you at {Company}.";

    const results = generateEmails(csv, template);

    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].success, true);
    assert.strictEqual(results[0].to, "john@acme.com");
    assert.strictEqual(results[0].body, "Hi John Doe, see you at Acme Corp.");

    assert.strictEqual(results[1].to, "jane@globex.com");
    assert.strictEqual(results[1].body, "Hi Jane Smith, see you at Globex.");
});

test('Automated Email Campaign Manager - Invalid CSV', (t) => {
    const csv = "John Doe,Acme Corp"; // Missing email
    const template = "Hi {Name}";

    const results = generateEmails(csv, template);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].success, false);
    assert.ok(results[0].error.includes("Invalid CSV line"));
});

test('Automated Email Campaign Manager - Empty', (t) => {
    const results = generateEmails("", "");
    assert.strictEqual(results.length, 0);
});
