function filterContent(text, bannedWords = ['badword', 'spam', 'scam']) {
    let lowerText = text.toLowerCase();
    for (const word of bannedWords) {
        if (lowerText.includes(word)) {
            return { approved: false, reason: `Contains banned word: ${word}` };
        }
    }
    return { approved: true, reason: 'Content passes basic filters.' };
}
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('content-form');
        const output = document.getElementById('result-output');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = document.getElementById('content').value;
            const result = filterContent(text);
            const statusClass = result.approved ? 'standard' : 'alert';
            const statusText = result.approved ? 'Approved' : 'Rejected';
            output.innerHTML = `<p class="${statusClass}">Status: ${statusText}<br>Reason: ${result.reason}</p>`;
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { filterContent };
