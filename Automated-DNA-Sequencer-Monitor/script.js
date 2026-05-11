// Threshold constants
const Q_SCORE_THRESHOLD = 30; // Minimum acceptable Q-score
const ERROR_RATE_THRESHOLD = 1.5; // Maximum acceptable error rate (%)

// Core logic function
function evaluateMetrics(qScore, errorRate) {
    if (qScore < Q_SCORE_THRESHOLD) {
        return { status: 'alert', message: `Low Q-Score detected: ${qScore.toFixed(1)} (Threshold: ${Q_SCORE_THRESHOLD})` };
    }
    if (errorRate > ERROR_RATE_THRESHOLD) {
        return { status: 'alert', message: `High Error Rate detected: ${errorRate.toFixed(2)}% (Threshold: ${ERROR_RATE_THRESHOLD}%)` };
    }
    return { status: 'ok', message: 'Metrics within acceptable range.' };
}

// UI Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const qScoreEl = document.getElementById('q-score');
        const errorRateEl = document.getElementById('error-rate');
        const statusMessage = document.getElementById('status-message');
        const alertLog = document.getElementById('alert-log');

        let monitorInterval;

        function logAlert(message, type = 'normal') {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            const time = new Date().toLocaleTimeString();
            entry.textContent = `[${time}] ${message}`;
            alertLog.prepend(entry);
        }

        function updateUI(qScore, errorRate, evaluation) {
            qScoreEl.textContent = qScore.toFixed(1);
            errorRateEl.textContent = errorRate.toFixed(2);

            statusMessage.className = `status ${evaluation.status}`;
            statusMessage.textContent = evaluation.message;

            if (evaluation.status === 'alert') {
                logAlert(evaluation.message, 'warning');
                stopMonitor(); // Auto-stop on alert
                logAlert('Run paused due to quality alert.', 'warning');
            }
        }

        function simulateReading() {
            // Simulate realistic metrics, occasionally dropping to trigger alerts
            const isFailing = Math.random() < 0.1;

            let currentQScore, currentErrorRate;

            if (isFailing) {
                currentQScore = 25 + Math.random() * 4; // 25-29 (Failing)
                currentErrorRate = 1.6 + Math.random() * 0.5; // 1.6-2.1 (Failing)
            } else {
                currentQScore = 32 + Math.random() * 8; // 32-40 (Passing)
                currentErrorRate = 0.5 + Math.random() * 0.9; // 0.5-1.4 (Passing)
            }

            const evaluation = evaluateMetrics(currentQScore, currentErrorRate);
            updateUI(currentQScore, currentErrorRate, evaluation);
        }

        function startMonitor() {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusMessage.className = 'status ok';
            statusMessage.textContent = 'Monitoring started...';
            logAlert('Started sequencer monitoring.');

            simulateReading(); // Initial read
            monitorInterval = setInterval(simulateReading, 2000); // Read every 2 seconds
        }

        function stopMonitor() {
            clearInterval(monitorInterval);
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusMessage.className = 'status';
            statusMessage.textContent = 'System idle.';
            logAlert('Monitoring stopped.');
        }

        startBtn.addEventListener('click', startMonitor);
        stopBtn.addEventListener('click', stopMonitor);
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateMetrics, Q_SCORE_THRESHOLD, ERROR_RATE_THRESHOLD };
}