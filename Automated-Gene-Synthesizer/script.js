function synthesizemRNA(dnaSequence) {
    if (!dnaSequence || typeof dnaSequence !== 'string') {
        return { error: 'Invalid DNA sequence' };
    }

    dnaSequence = dnaSequence.toUpperCase();
    const validBases = ['A', 'T', 'C', 'G'];
    let mRNA = '';

    for (let i = 0; i < dnaSequence.length; i++) {
        const base = dnaSequence[i];
        if (!validBases.includes(base)) {
            return { error: `Invalid base '${base}' at position ${i + 1}` };
        }

        // Transcription rules: A->U, T->A, C->G, G->C
        switch(base) {
            case 'A': mRNA += 'U'; break;
            case 'T': mRNA += 'A'; break;
            case 'C': mRNA += 'G'; break;
            case 'G': mRNA += 'C'; break;
        }
    }

    return { success: true, mRNA: mRNA };
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const inputField = document.getElementById('dna-input');
        const synthesizeBtn = document.getElementById('synthesize-btn');
        const outputStatus = document.getElementById('output-status');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        synthesizeBtn.addEventListener('click', () => {
            const dna = inputField.value.trim();
            appendLog(`Initiating synthesis for DNA sequence: ${dna}`);

            const result = synthesizemRNA(dna);

            if (result.error) {
                outputStatus.textContent = `Error: ${result.error}`;
                outputStatus.style.backgroundColor = '#fce4e4';
                outputStatus.style.color = '#c0392b';
                appendLog(`Synthesis Failed: ${result.error}`);
            } else {
                outputStatus.textContent = `Success! mRNA: ${result.mRNA}`;
                outputStatus.style.backgroundColor = '#d4edda';
                outputStatus.style.color = '#155724';
                appendLog(`Synthesis Complete. Result: ${result.mRNA}`);
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { synthesizemRNA };
}
