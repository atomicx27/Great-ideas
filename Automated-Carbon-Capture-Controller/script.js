function determineCaptureResponse(co2Level, filterSaturation) {
    if (filterSaturation >= 90) {
        return { status: 'CRITICAL: Filter Saturated', class: 'critical', action: 'System offline. Replace filters immediately.' };
    }
    if (co2Level >= 600) {
        return { status: 'WARNING: High CO2 Concentration', class: 'warning', action: 'Increasing fan speed to 100%.' };
    }
    if (co2Level >= 400 && filterSaturation >= 75) {
        return { status: 'ELEVATED: Maintenance Required Soon', class: 'warning', action: 'Fan speed at 75%. Schedule filter replacement.' };
    }
    return { status: 'NORMAL: Optimal Operation', class: 'normal', action: 'Fan speed at 50%. Operating normally.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('capture-form');
        const outputCard = document.getElementById('output-card');
        const alertOutput = document.getElementById('alert-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const co2Level = parseFloat(document.getElementById('co2-level').value);
            const filterSaturation = parseFloat(document.getElementById('filter-status').value);
            const result = determineCaptureResponse(co2Level, filterSaturation);

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
    module.exports = { determineCaptureResponse };
}
