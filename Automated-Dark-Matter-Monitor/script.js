// Deterministic Logic
function monitorDarkMatterDensity(regions) {
    let anomalies = 0;
    const processed = [];

    for (let r of regions) {
        let densityLevel = 'Unknown';
        let className = 'density-unknown';

        if (r.density < 20) {
            densityLevel = 'Low';
            className = 'density-low';
        } else if (r.density >= 20 && r.density <= 70) {
            densityLevel = 'Medium';
            className = 'density-med';
        } else if (r.density > 70) {
            densityLevel = 'High (Anomaly)';
            className = 'density-high';
            anomalies++;
        }

        processed.push({ ...r, densityLevel, className });
    }

    return { processed, anomalies };
}

// DOM Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsList = document.getElementById('results-list');

        const mockData = [
            { id: 'Sec-A1', density: 12 },
            { id: 'Sec-B2', density: 45 },
            { id: 'Sec-C3', density: 88 },
            { id: 'Sec-D4', density: 18 }
        ];

        scanBtn.addEventListener('click', () => {
            statusText.textContent = 'Status: Scanning...';
            statusText.style.color = 'var(--warning-color)';
            scanBtn.disabled = true;
            scanBtn.classList.add('running');
            resultsList.innerHTML = '';

            setTimeout(() => {
                const results = monitorDarkMatterDensity(mockData);

                results.processed.forEach(r => {
                    const li = document.createElement('li');
                    li.className = r.className;
                    li.textContent = `Region ${r.id}: Density ${r.density} (${r.densityLevel})`;
                    resultsList.appendChild(li);
                });

                statusText.textContent = `Status: Scan Complete. ${results.anomalies} anomalies found.`;
                statusText.style.color = 'var(--success-color)';
                scanBtn.disabled = false;
                scanBtn.classList.remove('running');
            }, 1500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorDarkMatterDensity };
}
