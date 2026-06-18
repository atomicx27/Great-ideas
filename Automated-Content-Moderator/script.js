// Deterministic moderation logic
const BANNED_WORDS = ['spam', 'scam', 'hate', 'violence', 'crypto', 'giveaway'];

function moderateContent(text) {
    if (!text || typeof text !== 'string') return { status: 'error', message: 'Invalid input' };

    const lowerText = text.toLowerCase();
    const matchedWords = [];

    for (const word of BANNED_WORDS) {
        if (lowerText.includes(word)) {
            matchedWords.push(word);
        }
    }

    if (matchedWords.length > 0) {
        return { status: 'flagged', matched: matchedWords };
    }
    return { status: 'safe' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const contentInput = document.getElementById('content-input');
        const resultsSection = document.getElementById('results-section');
        const resultOutput = document.getElementById('result-output');

        processBtn.addEventListener('click', () => {
            const text = contentInput.value;
            if (!text.trim()) return;

            processBtn.textContent = 'Analyzing...';
            processBtn.disabled = true;

            setTimeout(() => {
                const result = moderateContent(text);
                resultsSection.classList.remove('hidden');

                if (result.status === 'safe') {
                    resultOutput.innerHTML = `
                        <div class="badge safe">Content Safe</div>
                        <p>No prohibited keywords detected.</p>
                    `;
                } else if (result.status === 'flagged') {
                    resultOutput.innerHTML = `
                        <div class="badge flagged">Content Flagged</div>
                        <p>This content violates community guidelines.</p>
                        <div class="matched-keywords">Detected keywords: ${result.matched.join(', ')}</div>
                    `;
                }

                processBtn.textContent = 'Analyze Content';
                processBtn.disabled = false;
            }, 600);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { moderateContent };
}
