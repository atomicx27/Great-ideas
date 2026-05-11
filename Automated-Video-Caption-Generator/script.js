function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');

    return `${hStr}:${mStr}:${sStr}.000`;
}

function generateVtt(transcriptText, secondsPerLine) {
    if (!transcriptText.trim()) return '';

    const lines = transcriptText.split('\n').filter(line => line.trim().length > 0);
    let vtt = 'WEBVTT\n\n';

    let currentSeconds = 0;

    lines.forEach((line, index) => {
        const startTime = formatTime(currentSeconds);
        const endTime = formatTime(currentSeconds + secondsPerLine);

        vtt += `${index + 1}\n`;
        vtt += `${startTime} --> ${endTime}\n`;
        vtt += `${line.trim()}\n\n`;

        currentSeconds += secondsPerLine;
    });

    return vtt.trim();
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const generateBtn = document.getElementById('generate-btn');
        const inputArea = document.getElementById('transcript-input');
        const secPerLineInput = document.getElementById('sec-per-line');
        const outputArea = document.getElementById('vtt-output');

        generateBtn.addEventListener('click', () => {
            const text = inputArea.value;
            const seconds = parseInt(secPerLineInput.value, 10) || 3;

            const vttResult = generateVtt(text, seconds);
            outputArea.textContent = vttResult;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateVtt, formatTime };
}