const test = require('node:test');
const assert = require('node:assert');
const { gradeExam } = require('../script.js');

test('Automated-Exam-Scorer logic', (t) => {
    const answerKey = ['A', 'B', 'C'];
    const submissions = [
        { studentId: 'S1', answers: ['A', 'B', 'C'] }, // 3/3
        { studentId: 'S2', answers: ['A', 'A', 'C'] }, // 2/3
        { studentId: 'S3', answers: ['C', 'C', 'A'] }  // 0/3
    ];

    const results = gradeExam(submissions, answerKey);

    assert.strictEqual(results.length, 3);

    assert.strictEqual(results[0].studentId, 'S1');
    assert.strictEqual(results[0].score, 3);
    assert.strictEqual(results[0].status, 'Pass');

    assert.strictEqual(results[1].studentId, 'S2');
    assert.strictEqual(results[1].score, 2);
    assert.strictEqual(results[1].status, 'Pass');

    assert.strictEqual(results[2].studentId, 'S3');
    assert.strictEqual(results[2].score, 0);
    assert.strictEqual(results[2].status, 'Fail');
});