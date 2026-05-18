const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('script.js syntax check', (t) => {
    const scriptPath = path.join(__dirname, '../script.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    // Basic check that fetchUserData is NOT in the file
    assert.strictEqual(content.includes('async function fetchUserData'), false, 'fetchUserData should be removed');
});

test('index.html presence check', (t) => {
    const indexPath = path.join(__dirname, '../index.html');
    assert.strictEqual(fs.existsSync(indexPath), true, 'index.html should exist');
});
