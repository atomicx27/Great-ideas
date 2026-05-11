// Deterministic validation logic
function monitorTelemetry(oxygen, battery, pressure) {
    let alerts = [];

    if (oxygen <= 19.5) {
        alerts.push(`CRITICAL: Oxygen levels low (${oxygen}%)`);
    }
    if (battery <= 40) {
        alerts.push(`WARNING: Battery level low (${battery}%)`);
    }
    if (pressure < 90 || pressure > 105) {
        alerts.push(`CRITICAL: Cabin pressure anomalous (${pressure} kPa)`);
    }

    if (alerts.length > 0) {
        return { nominal: false, messages: alerts };
    }

    return { nominal: true, messages: ["ALL SYSTEMS NOMINAL."] };
}

// Browser UI Logic
if (typeof document !== 'undefined') {
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('telemetry-form');
        const output = document.getElementById('status-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const ox = parseFloat(document.getElementById('oxygen').value);
            const bat = parseInt(document.getElementById('battery').value);
            const pres = parseFloat(document.getElementById('pressure').value);

            const result = monitorTelemetry(ox, bat, pres);

            output.innerHTML = '';
            result.messages.forEach(msg => {
                const p = document.createElement('p');
                p.textContent = msg;
                p.className = result.nominal ? 'nominal' : 'critical';
                output.appendChild(p);
            });

            showToast(result.nominal ? "Telemetry Scan: Nominal" : "Telemetry Scan: Alert Triggered");
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTelemetry };
}
