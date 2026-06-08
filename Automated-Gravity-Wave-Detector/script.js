function evaluateWaveAmplitude(amplitude, frequency) {
    if (amplitude > 10.0 && frequency > 50) {
        return { type: 'MERGER_EVENT', message: 'Massive binary merger detected. Alerting observatories.' };
    } else if (amplitude > 1.0) {
        return { type: 'CANDIDATE', message: 'Candidate wave event detected. Analyzing background noise.' };
    }
    return { type: 'NOISE', message: 'Below detection threshold. Likely background noise.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('scan-btn');
        const ampInput = document.getElementById('amplitude-input');
        const freqInput = document.getElementById('frequency-input');
        const display = document.getElementById('results-display');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', () => {
            const amp = parseFloat(ampInput.value);
            const freq = parseFloat(freqInput.value);

            const result = evaluateWaveAmplitude(amp, freq);

            let html = `<p>Amplitude: ${amp} x10^-21 strain</p>`;
            html += `<p>Frequency: ${freq} Hz</p>`;

            if (result.type === 'MERGER_EVENT') {
                html += `<p class="threat-high">ALERT: ${result.message}</p>`;
                statusText.textContent = 'Status: Merger Event Detected';
                statusText.style.color = 'var(--danger-color)';
            } else if (result.type === 'CANDIDATE') {
                html += `<p style="color: #ffaa00">INFO: ${result.message}</p>`;
                statusText.textContent = 'Status: Candidate Event';
                statusText.style.color = '#ffaa00';
            } else {
                html += `<p class="threat-low">${result.message}</p>`;
                statusText.textContent = 'Status: Scanning...';
                statusText.style.color = 'var(--safe-color)';
            }

            display.innerHTML = html;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateWaveAmplitude };
}
