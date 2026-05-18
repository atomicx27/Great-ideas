// Pure logic function for screening resumes
function screenResumes(resumes, keywords) {
    const requiredKeywords = keywords.map(k => k.trim().toLowerCase());

    return resumes.map(resume => {
        const text = resume.content.toLowerCase();
        let matchCount = 0;

        requiredKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                matchCount++;
            }
        });

        const matchPercentage = (matchCount / requiredKeywords.length) * 100;
        // Deterministic rule: requires at least 60% keyword match
        const status = matchPercentage >= 60 ? 'Pass' : 'Fail';

        return {
            candidateId: resume.id,
            name: resume.name,
            matchPercentage: matchPercentage.toFixed(0),
            status: status
        };
    });
}

function generateResultsHTML(results) {
    let rows = results.map(r => `
        <tr>
            <td>${r.candidateId}</td>
            <td>${r.name}</td>
            <td>${r.matchPercentage}%</td>
            <td class="${r.status.toLowerCase()}">${r.status}</td>
        </tr>
    `).join('');

    return `
        <h3>Screening Results</h3>
        <table class="results-table">
            <tr>
                <th>ID</th>
                <th>Candidate Name</th>
                <th>Match %</th>
                <th>Status</th>
            </tr>
            ${rows}
        </table>
    `;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const screenBtn = document.getElementById('screen-btn');
        const resultsOutput = document.getElementById('results-output');
        const keywordsInput = document.getElementById('required-keywords');

        const mockResumes = [
            { id: 'C001', name: 'Alice Smith', content: 'Experienced frontend developer skilled in HTML, CSS, JavaScript, and React.' },
            { id: 'C002', name: 'Bob Jones', content: 'Backend engineer with 5 years of Python, Django, and SQL experience.' },
            { id: 'C003', name: 'Charlie Brown', content: 'Fullstack dev knowing JavaScript, Node.js, Express, HTML, and basic CSS.' },
            { id: 'C004', name: 'Diana Prince', content: 'Project manager, good at Jira, Scrum, Agile methodologies.' }
        ];

        screenBtn.addEventListener('click', () => {
            resultsOutput.innerHTML = '<p>Screening resumes...</p>';
            const keywords = keywordsInput.value.split(',');

            setTimeout(() => {
                const results = screenResumes(mockResumes, keywords);
                resultsOutput.innerHTML = generateResultsHTML(results);
            }, 500); // Simulate processing time
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { screenResumes, generateResultsHTML };
}