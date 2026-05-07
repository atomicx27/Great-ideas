function evaluateWaterQuality(ph, turbidity) {
    let isSafe = true;
    const messages = [];

    if (ph < 6.5 || ph > 8.5) {
        isSafe = false;
        messages.push(`ALERT: pH level (${ph}) is outside safe range (6.5 - 8.5).`);
    } else {
        messages.push(`pH level (${ph}) is within safe range.`);
    }

    if (turbidity >= 5) {
        isSafe = false;
        messages.push(`ALERT: Turbidity (${turbidity} NTU) exceeds safe limit (< 5 NTU).`);
    } else {
        messages.push(`Turbidity (${turbidity} NTU) is within safe limits.`);
    }

    return { isSafe, messages };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const checkBtn = document.getElementById('check-btn');
        const phInput = document.getElementById('ph-level');
        const turbidityInput = document.getElementById('turbidity');
        const statusDisplay = document.getElementById('status-display');
        const logArea = document.getElementById('log');

        function appendLog(msg) {
            const p = document.createElement('p');
            p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logArea.prepend(p);
        }

        checkBtn.addEventListener('click', () => {
            const ph = parseFloat(phInput.value);
            const turbidity = parseFloat(turbidityInput.value);

            if (isNaN(ph) || isNaN(turbidity)) {
                appendLog("Error: Invalid sensor input.");
                return;
            }

            const result = evaluateWaterQuality(ph, turbidity);

            if (result.isSafe) {
                statusDisplay.className = 'status-safe';
                statusDisplay.textContent = 'Status: WATER QUALITY SAFE';
            } else {
                statusDisplay.className = 'status-alert';
                statusDisplay.textContent = 'Status: CONTAMINATION ALERT';
            }

            result.messages.forEach(msg => appendLog(msg));
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateWaterQuality };
}
