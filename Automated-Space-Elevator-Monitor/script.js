function monitorTension(tension) {
    if (tension > 80000) return 'danger';
    if (tension > 60000) return 'warning';
    return 'safe';
}

function monitorWind(windSpeed) {
    if (windSpeed > 150) return 'danger';
    if (windSpeed > 100) return 'warning';
    return 'safe';
}

function processElevatorData(tension, windSpeed) {
    const tStatus = monitorTension(tension);
    const wStatus = monitorWind(windSpeed);

    let finalStatus = 'safe';
    let message = 'System operating nominally.';

    if (tStatus === 'danger' || wStatus === 'danger') {
        finalStatus = 'danger';
        message = 'CRITICAL ALERT: Immediate shutdown recommended. ';
        if (tStatus === 'danger') message += 'Tension limit exceeded. ';
        if (wStatus === 'danger') message += 'Wind speed limit exceeded.';
    } else if (tStatus === 'warning' || wStatus === 'warning') {
        finalStatus = 'warning';
        message = 'WARNING: Parameters approaching limits. ';
        if (tStatus === 'warning') message += 'High tension detected. ';
        if (wStatus === 'warning') message += 'High wind speeds detected.';
    }

    return { status: finalStatus, message: message.trim() };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const checkBtn = document.getElementById('check-status-btn');
        const tensionInput = document.getElementById('tension-input');
        const windInput = document.getElementById('wind-input');
        const output = document.getElementById('status-output');

        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                const tension = parseFloat(tensionInput.value);
                const wind = parseFloat(windInput.value);

                if (isNaN(tension) || isNaN(wind)) {
                    output.innerHTML = '<span class="status-danger">Please enter valid numeric values for all fields.</span>';
                    return;
                }

                const result = processElevatorData(tension, wind);
                output.innerHTML = `<span class="status-${result.status}">${result.message}</span>`;
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTension, monitorWind, processElevatorData };
}
