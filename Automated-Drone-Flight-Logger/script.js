function processTelemetry(data) {
    let level = 'info';
    let message = `Speed: ${data.speed}m/s, Alt: ${data.altitude}m, Bat: ${data.battery}%`;

    if (data.battery < 20) {
        level = 'error';
        message += ' - CRITICAL BATTERY';
    } else if (data.speed > 25) {
        level = 'warn';
        message += ' - OVERSPEED DETECTED';
    } else if (data.altitude > 120) {
        level = 'warn';
        message += ' - ALTITUDE LIMIT EXCEEDED';
    }

    return {
        timestamp: new Date().toISOString().substring(11, 19),
        level: level,
        message: message
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const simulateBtn = document.getElementById('simulate-flight-btn');
        const logOutput = document.getElementById('log-output');

        simulateBtn.addEventListener('click', () => {
            logOutput.innerHTML = ''; // Clear previous

            const simulatedDataPoints = [
                { speed: 10, altitude: 50, battery: 95 },
                { speed: 15, altitude: 80, battery: 90 },
                { speed: 26, altitude: 100, battery: 85 }, // Overspeed
                { speed: 20, altitude: 130, battery: 80 }, // Altitude
                { speed: 12, altitude: 40, battery: 15 },  // Critical Battery
                { speed: 5, altitude: 10, battery: 10 }
            ];

            let delay = 0;
            simulatedDataPoints.forEach(data => {
                setTimeout(() => {
                    const log = processTelemetry(data);
                    const div = document.createElement('div');
                    div.className = 'log-entry';
                    div.innerHTML = `<span class="log-time">[${log.timestamp}]</span> <span class="log-level-${log.level}">[${log.level.toUpperCase()}]</span> ${log.message}`;
                    logOutput.appendChild(div);
                    logOutput.scrollTop = logOutput.scrollHeight;
                }, delay);
                delay += 500;
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processTelemetry };
}