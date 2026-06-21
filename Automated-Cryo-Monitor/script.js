// Deterministic Logic
function analyzeVitals(pods) {
    let criticalCount = 0;
    const processed = [];

    for (let pod of pods) {
        let condition = 'Stable';
        let className = 'comp-nominal';
        let critical = false;

        // Rule-based classification based on heart rate and temp
        if (pod.temp > 80 || pod.temp < 70) {
            condition = 'Temp Warning';
            className = 'comp-warning';
        }
        if (pod.hr > 10 || pod.hr < 2) {
            condition = 'HR Warning';
            className = 'comp-warning';
        }

        if (pod.temp > 90 || pod.temp < 60 || pod.hr > 15 || pod.hr < 1) {
            condition = 'Critical: Wake Protocol Initiated';
            className = 'comp-critical';
            critical = true;
        }

        if (critical) criticalCount++;

        processed.push({ ...pod, condition, className });
    }

    return { processed, criticalCount };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalSegmentsEl = document.getElementById('total-pods');
        const criticalAlertsEl = document.getElementById('critical-alerts');
        const vitalsLog = document.querySelector('#vitals-log tbody');

        const mockData = [
            { id: "POD-101", hr: 4, temp: 75 },
            { id: "POD-102", hr: 12, temp: 77 },
            { id: "POD-103", hr: 5, temp: 95 },
            { id: "POD-104", hr: 3, temp: 74 },
            { id: "POD-105", hr: 0.5, temp: 75 }
        ];

        scanBtn.addEventListener('click', () => {
            scanBtn.disabled = true;
            statusText.innerText = "Status: Scanning Vitals...";
            resultsPanel.classList.add('hidden');
            vitalsLog.innerHTML = '';

            setTimeout(() => {
                const results = analyzeVitals(mockData);

                totalSegmentsEl.innerText = mockData.length;
                criticalAlertsEl.innerText = results.criticalCount;

                results.processed.forEach(pod => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pod.id}</td>
                        <td>${pod.hr}</td>
                        <td>${pod.temp}</td>
                        <td class="${pod.className}">${pod.condition}</td>
                    `;
                    vitalsLog.appendChild(row);
                });

                statusText.innerText = "Status: Scan Complete";
                resultsPanel.classList.remove('hidden');
                scanBtn.disabled = false;
            }, 1200);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeVitals };
}
