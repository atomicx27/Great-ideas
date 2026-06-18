// Deterministic Logic
function monitorTetherTension(tensionGpa) {
    const MAX_SAFE_TENSION = 100; // GPa
    const WARNING_THRESHOLD = 85;

    let status = 'Safe';
    let message = 'Tension within normal operating parameters.';
    let cssClass = 'safe';
    let triggerSafetyProtocol = false;

    if (tensionGpa > MAX_SAFE_TENSION) {
        status = 'Critical';
        message = 'CRITICAL OVERLOAD: Initiating emergency payload jettison.';
        cssClass = 'critical';
        triggerSafetyProtocol = true;
    } else if (tensionGpa > WARNING_THRESHOLD) {
        status = 'Warning';
        message = 'WARNING: High tension detected. Reducing climber acceleration.';
        cssClass = 'warning';
    }

    return { status, message, cssClass, triggerSafetyProtocol };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const monitorBtn = document.getElementById('monitor-btn');
        const systemStatusEl = document.getElementById('system-status');
        const gaugeFill = document.getElementById('gauge-fill');
        const gaugeValue = document.getElementById('gauge-value');
        const alertMessage = document.getElementById('alert-message');

        monitorBtn.addEventListener('click', () => {
            monitorBtn.disabled = true;
            systemStatusEl.innerText = "System Status: Scanning...";
            alertMessage.innerText = "";
            alertMessage.className = "";

            // Simulate reading
            const tension = Math.floor(Math.random() * 120); // 0 to 120 GPa
            const fillPercentage = Math.min((tension / 120) * 100, 100);

            setTimeout(() => {
                const results = monitorTetherTension(tension);

                gaugeFill.style.width = `${fillPercentage}%`;
                gaugeValue.innerText = `${tension} GPa`;

                if (results.cssClass === 'safe') {
                    gaugeFill.style.backgroundColor = '#2ecc71';
                } else if (results.cssClass === 'warning') {
                    gaugeFill.style.backgroundColor = '#f1c40f';
                } else {
                    gaugeFill.style.backgroundColor = '#e74c3c';
                }

                systemStatusEl.innerText = `System Status: ${results.status}`;
                alertMessage.innerText = results.message;
                alertMessage.className = results.cssClass;

                monitorBtn.disabled = false;
            }, 600);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { monitorTetherTension };
}
