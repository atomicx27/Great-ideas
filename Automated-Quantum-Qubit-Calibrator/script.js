function determineCalibrationResponse(errorRate, coherenceTime) {
    if (errorRate > 2.0 || coherenceTime < 30) {
        return { status: 'CRITICAL: Initiating Full Recalibration', class: 'critical', action: 'Taking qubit offline for microwave pulse tuning.' };
    }
    if (errorRate > 1.0 || coherenceTime < 60) {
        return { status: 'WARNING: Suboptimal Performance', class: 'warning', action: 'Applying dynamic decoupling sequences.' };
    }
    return { status: 'NORMAL: Qubit Stable', class: 'normal', action: 'Continuing standard quantum operations.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('calibration-form');
        const outputCard = document.getElementById('output-card');
        const alertOutput = document.getElementById('alert-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const errorRate = parseFloat(document.getElementById('error-rate').value);
            const coherenceTime = parseFloat(document.getElementById('coherence-time').value);
            const result = determineCalibrationResponse(errorRate, coherenceTime);

            alertOutput.innerHTML = `
                <div class="alert-level ${result.class}">
                    <p style="margin:0; padding-bottom:5px;">${result.status}</p>
                    <hr style="border-color: currentColor; opacity: 0.3; margin: 5px 0;">
                    <p style="margin:0;">Action taken: <strong>${result.action}</strong></p>
                </div>`;
            outputCard.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineCalibrationResponse };
}
