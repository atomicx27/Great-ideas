// Deterministic Logic
function analyzeStrain(segments) {
    let criticalCount = 0;
    const processed = [];

    for (let seg of segments) {
        let condition = 'Nominal';
        let className = 'comp-nominal';
        let critical = false;

        // Rule-based classification based on strain values
        if (seg.strain >= 80 && seg.strain < 90) {
            condition = 'Warning';
            className = 'comp-warning';
        } else if (seg.strain >= 90) {
            condition = 'Critical';
            className = 'comp-critical';
            critical = true;
        }

        if (critical) criticalCount++;

        processed.push({ ...seg, condition, className });
    }

    return { processed, criticalCount };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalSegmentsEl = document.getElementById('total-segments');
        const criticalAlertsEl = document.getElementById('critical-alerts');
        const strainLog = document.querySelector('#strain-log tbody');

        const mockData = [
            { id: "SEG-001", strain: 45 },
            { id: "SEG-002", strain: 85 },
            { id: "SEG-003", strain: 95 },
            { id: "SEG-004", strain: 60 },
            { id: "SEG-005", strain: 92 }
        ];

        scanBtn.addEventListener('click', () => {
            scanBtn.disabled = true;
            statusText.innerText = "Status: Scanning Tether...";
            resultsPanel.classList.add('hidden');
            strainLog.innerHTML = '';

            setTimeout(() => {
                const results = analyzeStrain(mockData);

                totalSegmentsEl.innerText = mockData.length;
                criticalAlertsEl.innerText = results.criticalCount;

                results.processed.forEach(seg => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${seg.id}</td>
                        <td>${seg.strain}%</td>
                        <td class="${seg.className}">${seg.condition}</td>
                    `;
                    strainLog.appendChild(row);
                });

                statusText.innerText = "Status: Scan Complete";
                resultsPanel.classList.remove('hidden');
                scanBtn.disabled = false;
            }, 1200);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeStrain };
}
