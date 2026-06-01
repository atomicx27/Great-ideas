function monitorNutrients(ph, ec) {
    let level = 'info';
    let message = `pH: ${ph.toFixed(1)}, EC: ${ec.toFixed(1)} mS/cm`;

    if (ph < 5.5 || ph > 6.5) {
        level = 'warn';
        message += ' - pH OUT OF BOUNDS';
    }

    if (ec < 1.0) {
        level = 'warn';
        message += ' - EC TOO LOW';
    } else if (ec > 3.0) {
        level = 'error';
        message += ' - EC CRITICAL HIGH';
    }

    return {
        timestamp: new Date().toISOString().substring(11, 19),
        level: level,
        message: message
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const simulateBtn = document.getElementById('simulate-btn');
        const logOutput = document.getElementById('log-output');

        simulateBtn.addEventListener('click', () => {
            logOutput.innerHTML = '';

            const simulatedDataPoints = [
                { ph: 6.0, ec: 1.5 },
                { ph: 5.8, ec: 1.8 },
                { ph: 5.2, ec: 2.0 }, // pH out of bounds
                { ph: 6.1, ec: 0.8 }, // EC too low
                { ph: 6.5, ec: 3.5 }  // EC critical high
            ];

            let delay = 0;
            simulatedDataPoints.forEach(data => {
                setTimeout(() => {
                    const log = monitorNutrients(data.ph, data.ec);
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
    module.exports = { monitorNutrients };
}
