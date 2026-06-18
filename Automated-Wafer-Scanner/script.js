// Deterministic Logic
function analyzeWaferDefects(defects) {
    let processed = [];
    let highSeverityCount = 0;

    for (let defect of defects) {
        let severity = 'Low';
        let className = 'severity-low';

        // Rule-based classification based on size
        if (defect.size >= 10 && defect.size < 50) {
            severity = 'Medium';
            className = 'severity-medium';
        } else if (defect.size >= 50) {
            severity = 'High';
            className = 'severity-high';
            highSeverityCount++;
        }

        processed.push({ ...defect, severity, className });
    }

    // Wafer fails if there are any high severity defects, or more than 5 total defects
    const passed = highSeverityCount === 0 && defects.length <= 5;

    return { processed, passed };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalDefectsEl = document.getElementById('total-defects');
        const waferStatusEl = document.getElementById('wafer-status');
        const defectLog = document.querySelector('#defect-log tbody');

        scanBtn.addEventListener('click', () => {
            scanBtn.disabled = true;
            statusText.innerText = "Status: Scanning Wafer...";
            resultsPanel.classList.add('hidden');
            defectLog.innerHTML = '';
            waferStatusEl.innerText = 'Pending';
            waferStatusEl.className = '';

            // Generate mock data
            const mockDefects = [];
            const numDefects = Math.floor(Math.random() * 8); // 0 to 7 defects
            for (let i = 0; i < numDefects; i++) {
                mockDefects.push({
                    id: `DEF-${Math.floor(Math.random() * 10000)}`,
                    coords: `(${Math.floor(Math.random() * 300)}, ${Math.floor(Math.random() * 300)})`,
                    size: Math.floor(Math.random() * 100)
                });
            }

            setTimeout(() => {
                const results = analyzeWaferDefects(mockDefects);

                totalDefectsEl.innerText = mockDefects.length;
                waferStatusEl.innerText = results.passed ? 'PASS' : 'FAIL';
                waferStatusEl.className = results.passed ? 'status-pass' : 'status-fail';

                results.processed.forEach(defect => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${defect.id}</td>
                        <td>${defect.coords}</td>
                        <td class="${defect.className}">${defect.severity} (Size: ${defect.size})</td>
                    `;
                    defectLog.appendChild(row);
                });

                statusText.innerText = "Status: Scan Complete";
                resultsPanel.classList.remove('hidden');
                scanBtn.disabled = false;
            }, 800);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeWaferDefects };
}
