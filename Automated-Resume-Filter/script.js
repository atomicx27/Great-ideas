/**
 * Deterministically filters a resume against required keywords.
 * @param {string} resumeText - The content of the resume.
 * @param {string} keywordsString - Comma-separated required keywords.
 * @returns {object} The match result including score and matched/missing keywords.
 */
function filterResume(resumeText, keywordsString) {
    if (!resumeText || !keywordsString) {
        return { score: 0, matched: [], missing: [] };
    }

    const keywords = keywordsString.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw);
    const resumeLower = resumeText.toLowerCase();

    const matched = [];
    const missing = [];

    for (const keyword of keywords) {
        if (resumeLower.includes(keyword)) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    }

    const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

    return {
        score,
        matched,
        missing
    };
}

if (typeof document !== 'undefined') {
    document.getElementById('filter-btn').addEventListener('click', () => {
        const keywords = document.getElementById('keywords').value;
        const resume = document.getElementById('resume').value;
        const resultBox = document.getElementById('result');

        const result = filterResume(resume, keywords);

        let statusClass = 'match-low';
        let statusText = 'Low Match';

        if (result.score >= 80) {
            statusClass = 'match-high';
            statusText = 'High Match';
        } else if (result.score >= 50) {
            statusClass = 'match-medium';
            statusText = 'Medium Match';
        }

        resultBox.className = `result-box ${statusClass}`;
        resultBox.innerHTML = `
            <strong>Status:</strong> ${statusText} (${result.score}%)<br><br>
            <strong>Matched Keywords:</strong> ${result.matched.join(', ') || 'None'}<br>
            <strong>Missing Keywords:</strong> ${result.missing.join(', ') || 'None'}
        `;
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterResume };
}
