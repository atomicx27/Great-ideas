function alignSequences(seq1, seq2) {
    let score = 0;
    let alignment = '';

    const minLen = Math.min(seq1.length, seq2.length);
    for (let i = 0; i < minLen; i++) {
        if (seq1[i] === seq2[i]) {
            score++;
            alignment += '|';
        } else {
            alignment += ' ';
        }
    }

    return {
        score: score,
        percentMatch: ((score / Math.max(seq1.length, seq2.length)) * 100).toFixed(2),
        viz1: seq1,
        vizAlign: alignment,
        viz2: seq2
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const seq1Input = document.getElementById('sequence1');
        const seq2Input = document.getElementById('sequence2');
        const resultsDiv = document.getElementById('results');
        const scoreSpan = document.getElementById('alignment-score');
        const vizDiv = document.getElementById('alignment-visualization');

        processBtn.addEventListener('click', () => {
            const s1 = seq1Input.value.toUpperCase();
            const s2 = seq2Input.value.toUpperCase();

            if (!s1 || !s2) return;

            const result = alignSequences(s1, s2);

            scoreSpan.textContent = `${result.score} matches (${result.percentMatch}%)`;
            vizDiv.textContent = `${result.viz1}\n${result.vizAlign}\n${result.viz2}`;

            resultsDiv.classList.remove('hidden');
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { alignSequences };
}