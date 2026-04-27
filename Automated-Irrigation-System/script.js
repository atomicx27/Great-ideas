function evaluateMoisture(moistureLevel, threshold = 30) {
    if (moistureLevel < threshold) {
        return { pumpOn: true, message: `Moisture (${moistureLevel}%) below threshold (${threshold}%). Activating pump.` };
    }
    return { pumpOn: false, message: `Moisture (${moistureLevel}%) is adequate. Pump remains off.` };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const checkBtn = document.getElementById('check-btn');
        const moistureInput = document.getElementById('moisture-level');
        const pumpStatus = document.getElementById('pump-status');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const p = document.createElement('p');
            p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(p);
        }

        checkBtn.addEventListener('click', () => {
            const level = parseInt(moistureInput.value, 10);
            if (isNaN(level)) return;

            const result = evaluateMoisture(level);

            appendLog(result.message);

            if (result.pumpOn) {
                pumpStatus.className = 'status pump-on';
                pumpStatus.textContent = 'Pump: ON (Watering...)';
            } else {
                pumpStatus.className = 'status pump-off';
                pumpStatus.textContent = 'Pump: OFF';
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateMoisture };
}
