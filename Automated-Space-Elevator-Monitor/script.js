function monitorTension(tensionValue) {
    if (tensionValue > 100000) {
        return "Critical Tension";
    } else if (tensionValue > 80000) {
        return "High Tension";
    }
    return "Normal Tension";
}

function checkWeatherConditions(windSpeed, debrisRisk) {
    if (windSpeed > 150 || debrisRisk > 0.8) {
        return "Halt Operations";
    }
    return "Operations Normal";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('runBtn');
        const output = document.getElementById('output');
        const status = document.getElementById('status');

        runBtn.addEventListener('click', () => {
            status.textContent = "Status: Checking...";
            const tension = monitorTension(105000);
            const weather = checkWeatherConditions(160, 0.9);
            output.innerHTML = `<p>Tension: ${tension}</p><p>Status: ${weather}</p>`;
            status.textContent = "Status: Done";
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTension, checkWeatherConditions };
}
