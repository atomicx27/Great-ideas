// Pure logic function for grading
function gradeExam(submissions, answerKey) {
    return submissions.map(sub => {
        let score = 0;
        const total = answerKey.length;

        for (let i = 0; i < total; i++) {
            if (sub.answers[i] === answerKey[i]) {
                score++;
            }
        }

        const percentage = (score / total) * 100;
        const status = percentage >= 60 ? 'Pass' : 'Fail';

        return {
            studentId: sub.studentId,
            score: score,
            total: total,
            percentage: percentage.toFixed(2),
            status: status
        };
    });
}

function generateResultsHTML(results) {
    let rows = results.map(r => `
        <tr>
            <td>${r.studentId}</td>
            <td>${r.score} / ${r.total}</td>
            <td>${r.percentage}%</td>
            <td class="${r.status.toLowerCase()}">${r.status}</td>
        </tr>
    `).join('');

    return `
        <h3>Grading Results</h3>
        <table class="results-table">
            <tr>
                <th>Student ID</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
            </tr>
            ${rows}
        </table>
    `;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const gradeBtn = document.getElementById('grade-exams-btn');
        const resultsOutput = document.getElementById('results-output');

        const answerKey = ['A', 'C', 'B', 'D', 'A'];

        const mockSubmissions = [
            { studentId: 'S001', answers: ['A', 'C', 'B', 'D', 'A'] }, // 100%
            { studentId: 'S002', answers: ['A', 'B', 'B', 'D', 'A'] }, // 80%
            { studentId: 'S003', answers: ['B', 'C', 'A', 'C', 'D'] }, // 20%
            { studentId: 'S004', answers: ['A', 'C', 'A', 'D', 'A'] }  // 80%
        ];

        gradeBtn.addEventListener('click', () => {
            resultsOutput.innerHTML = '<p>Grading submissions...</p>';

            setTimeout(() => {
                const results = gradeExam(mockSubmissions, answerKey);
                resultsOutput.innerHTML = generateResultsHTML(results);
            }, 600); // Simulate processing time
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gradeExam, generateResultsHTML };
}