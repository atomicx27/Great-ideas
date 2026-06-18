const assert = require('assert');
const { assessTriage } = require('../script.js');

// Test 1: Critical
{
    const result = assessTriage('Patient has chest pain and dizziness.');
    assert.strictEqual(result.priority, 'CRITICAL');
    assert.strictEqual(result.matched, 'chest pain');
}

// Test 2: Urgent
{
    const result = assessTriage('Patient has a high fever since yesterday.');
    assert.strictEqual(result.priority, 'URGENT');
    assert.strictEqual(result.matched, 'fever');
}

// Test 3: Routine
{
    const result = assessTriage('Patient has a mild rash on arm.');
    assert.strictEqual(result.priority, 'ROUTINE');
}

console.log('Automated-Healthcare-Triage tests passed!');
