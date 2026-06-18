const assert = require('assert');
const { processEngrams } = require('../script.js');

const input = [
    { id: "1", intensity: 10 },
    { id: "2", intensity: 50 },
    { id: "3", intensity: 90 }
];

const result = processEngrams(input);

assert.strictEqual(result[0].type, 'Procedural');
assert.strictEqual(result[1].type, 'Semantic');
assert.strictEqual(result[2].type, 'Episodic');

console.log('Automated-Neural-Memory-Indexer tests passed!');
