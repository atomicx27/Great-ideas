// Deterministic Logic
function processSonarData(depths) {
    let hazards = 0;
    const processed = [];

    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i];
        let status = 'Safe';
        let className = 'safe';

        // Rule-based hazard detection
        if (depth < 50) {
            status = 'Hazard - Shallows';
            className = 'danger';
            hazards++;
        } else if (i > 0 && Math.abs(depth - depths[i - 1]) > 100) {
            status = 'Hazard - Steep Drop/Rise';
            className = 'warning';
            hazards++;
        }

        processed.push({ depth, status, className });
    }

    return { processed, hazards };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalPointsEl = document.getElementById('total-points');
        const totalHazardsEl = document.getElementById('total-hazards');
        const depthLog = document.getElementById('depth-log');

        const mockData = [200, 210, 205, 45, 60, 300, 310, 305, 450, 460];

        startBtn.addEventListener('click', () => {
            startBtn.disabled = true;
            statusText.innerText = "Status: Scanning...";
            resultsPanel.classList.add('hidden');
            depthLog.innerHTML = '';

            setTimeout(() => {
                const results = processSonarData(mockData);

                totalPointsEl.innerText = mockData.length;
                totalHazardsEl.innerText = results.hazards;

                results.processed.forEach((point, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>Point ${index + 1}: ${point.depth}m</span>
                        <span class="badge ${point.className}">${point.status}</span>
                    `;
                    depthLog.appendChild(li);
                });

                statusText.innerText = "Status: Scan Complete";
                resultsPanel.classList.remove('hidden');
                startBtn.disabled = false;
            }, 1000);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { processSonarData };
}
