function monitorTemperature(temp) {
    if (temp < 121) return 'too_low';
    if (temp > 137) return 'too_high';
    return 'optimal';
}

function startSterilizationCycle(temp, time) {
    const tempStatus = monitorTemperature(temp);

    if (tempStatus === 'too_low') {
        return { success: false, log: 'Error: Temperature too low for effective sterilization (Minimum 121°C).' };
    }
    if (tempStatus === 'too_high') {
        return { success: false, log: 'Error: Temperature too high, risk of instrument damage (Maximum 137°C).' };
    }
    if (time < 15) {
        return { success: false, log: 'Error: Cycle time too short (Minimum 15 minutes).' };
    }

    return { success: true, log: `Cycle completed successfully at ${temp}°C for ${time} minutes.` };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-cycle-btn');
        const tempInput = document.getElementById('temp-input');
        const timeInput = document.getElementById('time-input');
        const cycleLog = document.getElementById('cycle-log');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const temp = parseFloat(tempInput.value);
                const time = parseFloat(timeInput.value);

                if (isNaN(temp) || isNaN(time)) {
                    cycleLog.innerText = 'Invalid input parameters.';
                    return;
                }

                const result = startSterilizationCycle(temp, time);
                cycleLog.innerText = result.log;
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTemperature, startSterilizationCycle };
}
