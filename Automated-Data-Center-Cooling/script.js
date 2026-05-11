function determineCoolingResponse(temperature) {
    if (temperature >= 85) {
        return { status: 'CRITICAL: Initiating Emergency Shutdown', class: 'critical', fanSpeed: '0% (Shutdown)' };
    }
    if (temperature >= 70) {
        return { status: 'WARNING: High Temp', class: 'warning', fanSpeed: '100% (Max RPM)' };
    }
    if (temperature >= 40) {
        return { status: 'ELEVATED: Increasing Airflow', class: 'warning', fanSpeed: '75%' };
    }
    return { status: 'NORMAL: Optimal Operating Temp', class: 'normal', fanSpeed: '30% (Idle)' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('cooling-form');
        const outputCard = document.getElementById('output-card');
        const alertOutput = document.getElementById('alert-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const temp = parseFloat(document.getElementById('temp').value);
            const result = determineCoolingResponse(temp);

            alertOutput.innerHTML = `
                <div class="alert-level ${result.class}">
                    <p style="margin:0; padding-bottom:5px;">${result.status}</p>
                    <hr style="border-color: currentColor; opacity: 0.3; margin: 5px 0;">
                    <p style="margin:0;">Fan Speed set to: <strong>${result.fanSpeed}</strong></p>
                </div>`;
            outputCard.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineCoolingResponse };
}
