/**
 * Monitors telemetry data and returns status based on thresholds.
 * @param {Object} data - The telemetry data (e.g., { temperature: 100, radiation: 10 })
 * @returns {Object} - The status object { alert: boolean, message: string }
 */
function monitorTelemetry(data) {
    if (!data) return { alert: true, message: 'No telemetry data received.' };

    let alerts = [];

    if (data.temperature !== undefined && data.temperature > 100) {
        alerts.push(`High Temperature Alert: ${data.temperature}°C`);
    }

    if (data.radiation !== undefined && data.radiation > 15) {
        alerts.push(`High Radiation Alert: ${data.radiation}mSv`);
    }

    if (alerts.length > 0) {
        return { alert: true, message: alerts.join(' | ') };
    }

    return { alert: false, message: 'All systems nominal.' };
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const monitorBtn = document.getElementById('monitorBtn');
        const tempInput = document.getElementById('temperature');
        const radInput = document.getElementById('radiation');
        const statusOutput = document.getElementById('statusOutput');

        if (monitorBtn) {
            monitorBtn.addEventListener('click', () => {
                const data = {
                    temperature: parseFloat(tempInput.value),
                    radiation: parseFloat(radInput.value)
                };

                const status = monitorTelemetry(data);

                statusOutput.textContent = status.message;
                statusOutput.className = 'status-box ' + (status.alert ? 'danger' : 'success');
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTelemetry };
}
