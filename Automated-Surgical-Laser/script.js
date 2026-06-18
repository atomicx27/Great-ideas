function calculateAblationDepth(tissueType, laserPower, duration) {
    // Deterministic rules based on tissue density and absorption
    const tissueFactors = {
        'epidermis': 0.8,
        'dermis': 0.5,
        'subcutaneous': 1.2,
        'muscle': 0.3
    };

    const factor = tissueFactors[tissueType] || 0.5;

    // Depth in millimeters = (Power * Duration * Factor) / 10
    const depth = (laserPower * duration * factor) / 10;

    return Number(depth.toFixed(2));
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const tissueTypeSelect = document.getElementById('tissue-type');
        const laserPowerInput = document.getElementById('laser-power');
        const durationInput = document.getElementById('duration');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const ablationDepthEl = document.getElementById('ablation-depth');

        calculateBtn.addEventListener('click', () => {
            calculateBtn.disabled = true;
            statusText.innerText = "Status: Calculating...";
            resultsPanel.classList.add('hidden');

            const tissueType = tissueTypeSelect.value;
            const laserPower = parseFloat(laserPowerInput.value);
            const duration = parseFloat(durationInput.value);

            setTimeout(() => {
                const depth = calculateAblationDepth(tissueType, laserPower, duration);

                ablationDepthEl.innerText = `${depth} mm`;

                statusText.innerText = "Status: Complete";
                resultsPanel.classList.remove('hidden');
                calculateBtn.disabled = false;
            }, 600);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { calculateAblationDepth };
}
