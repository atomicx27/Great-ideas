function scanDarkMatter(lensingIndex, bgRadiation) {
    if (lensingIndex > 5.0 && bgRadiation < 10) {
        return { type: 'HIGH_CONCENTRATION', message: 'Massive dark matter clump detected. Navigational hazard.' };
    } else if (lensingIndex > 2.0) {
        return { type: 'MODERATE_CONCENTRATION', message: 'Moderate dark matter presence. Routine logging.' };
    }
    return { type: 'LOW_CONCENTRATION', message: 'Trace amounts of dark matter detected.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('scan-btn');
        const lensingInput = document.getElementById('lensing-index');
        const bgInput = document.getElementById('bg-radiation');
        const display = document.getElementById('results-display');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', () => {
            const lensing = parseFloat(lensingInput.value);
            const bg = parseFloat(bgInput.value);

            if (isNaN(lensing) || isNaN(bg)) {
                display.textContent = 'Error: Invalid parameters.';
                return;
            }

            const result = scanDarkMatter(lensing, bg);
            display.textContent = `Status: ${result.type}`;
            statusText.textContent = result.message;

            display.className = 'status-display fade-in';
            if (result.type === 'HIGH_CONCENTRATION') {
                display.classList.add('alert-high');
            } else if (result.type === 'MODERATE_CONCENTRATION') {
                display.classList.add('alert-medium');
            } else {
                display.classList.add('alert-low');
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { scanDarkMatter };
}
