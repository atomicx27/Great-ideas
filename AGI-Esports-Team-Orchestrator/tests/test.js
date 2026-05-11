const { test } = require('node:test');
const assert = require('node:assert');
const { synthesizeEsportsStrategy } = require('../script');

test('AGI-Esports-Team-Orchestrator - synthesizeEsportsStrategy', (t) => {
    const result = synthesizeEsportsStrategy(
        { priorityPicks: ['Hero A', 'Hero B'] },
        { focusArea: 'Late Game' },
        { budgetIncrease: '100k' }
    );
    assert.strictEqual(result.readinessLevel, 'High - Tournament Ready');
    assert.ok(result.actions[0].includes('Hero A, Hero B'));
    assert.ok(result.actions[1].includes('Late Game'));
    assert.ok(result.actions[2].includes('100k'));
});