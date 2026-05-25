function transcribeDNAtoMRNA(dnaSequence) {
    if (!dnaSequence || typeof dnaSequence !== 'string') {
        throw new Error("Invalid DNA Sequence.");
    }

    // Convert to uppercase and replace bases according to transcription rules:
    // DNA -> mRNA
    // G -> C
    // C -> G
    // T -> A
    // A -> U
    let mrna = '';
    const sequence = dnaSequence.toUpperCase();

    for (let i = 0; i < sequence.length; i++) {
        const base = sequence[i];
        switch (base) {
            case 'G': mrna += 'C'; break;
            case 'C': mrna += 'G'; break;
            case 'T': mrna += 'A'; break;
            case 'A': mrna += 'U'; break;
            default:
                throw new Error(`Invalid base '${base}' found in DNA sequence.`);
        }
    }

    return mrna;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const transcribeBtn = document.getElementById('transcribe-btn');
        const dnaInput = document.getElementById('dna-sequence');
        const resultsOutput = document.getElementById('results-output');
        const mrnaOutput = document.getElementById('mrna-output');

        transcribeBtn.addEventListener('click', () => {
            try {
                const dna = dnaInput.value;
                const mrna = transcribeDNAtoMRNA(dna);

                resultsOutput.classList.remove('hidden');
                mrnaOutput.textContent = mrna;
                mrnaOutput.style.color = "var(--accent-green)";
            } catch (error) {
                resultsOutput.classList.remove('hidden');
                mrnaOutput.textContent = error.message;
                mrnaOutput.style.color = "var(--accent-orange)";
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { transcribeDNAtoMRNA };
}