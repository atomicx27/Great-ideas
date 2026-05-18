function evaluateSensorData(temperature, aqi) {
    // Deterministic rules for fire detection
    if (temperature > 120 || aqi > 150) {
        return { alert: true, message: "DANGER: Thresholds exceeded. Auto-alert dispatched." };
    }
    return { alert: false, message: "Status: All metrics within normal range." };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let temp = 75;
        let aqi = 12;

        const btn = document.getElementById('trigger-fire-btn');
        const tempVal = document.getElementById('temp-val');
        const smokeVal = document.getElementById('smoke-val');
        const indicator = document.getElementById('alert-indicator');
        const status = document.getElementById('status-message');

        function updateUI() {
            tempVal.textContent = `${temp}°F`;
            smokeVal.textContent = `${aqi} AQI`;

            const result = evaluateSensorData(temp, aqi);

            if (result.alert) {
                indicator.textContent = 'FIRE DETECTED';
                indicator.className = 'danger';
                status.textContent = result.message;
            } else {
                indicator.textContent = 'SAFE';
                indicator.className = 'safe';
                status.textContent = result.message;
            }
        }

        btn.addEventListener('click', () => {
            btn.disabled = true;

            // Simulate sudden spike
            temp = 145;
            aqi = 320;
            updateUI();

            // Reset after 5 seconds
            setTimeout(() => {
                temp = 75;
                aqi = 12;
                btn.disabled = false;
                updateUI();
            }, 5000);
        });

        updateUI();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateSensorData };
}