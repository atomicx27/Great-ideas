// Deterministic Logic
function analyzeSpectra(asteroids) {
    let viableCount = 0;
    const processed = [];

    for (let ast of asteroids) {
        let composition = 'Unknown';
        let className = 'comp-unknown';
        let viable = false;

        // Rule-based classification based on spectral signature values
        if (ast.spectrum >= 100 && ast.spectrum < 300) {
            composition = 'Water-Ice';
            className = 'comp-ice';
            viable = true; // Ice is highly valuable for fuel
        } else if (ast.spectrum >= 300 && ast.spectrum < 600) {
            composition = 'Silicate';
            className = 'comp-silicate';
        } else if (ast.spectrum >= 600 && ast.spectrum <= 900) {
            composition = 'Heavy Iron/Nickel';
            className = 'comp-iron';
            viable = true; // Metals are valuable for construction
        }

        if (viable) viableCount++;

        processed.push({ ...ast, composition, className });
    }

    return { processed, viableCount };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalObjectsEl = document.getElementById('total-objects');
        const viableTargetsEl = document.getElementById('viable-targets');
        const asteroidLog = document.querySelector('#asteroid-log tbody');

        const mockData = [
            { id: "AX-101", spectrum: 250 },
            { id: "BX-204", spectrum: 450 },
            { id: "CX-909", spectrum: 800 },
            { id: "DX-111", spectrum: 950 },
            { id: "EX-333", spectrum: 150 }
        ];

        scanBtn.addEventListener('click', () => {
            scanBtn.disabled = true;
            statusText.innerText = "Status: Scanning Sector 7G...";
            resultsPanel.classList.add('hidden');
            asteroidLog.innerHTML = '';

            setTimeout(() => {
                const results = analyzeSpectra(mockData);

                totalObjectsEl.innerText = mockData.length;
                viableTargetsEl.innerText = results.viableCount;

                results.processed.forEach(ast => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${ast.id}</td>
                        <td>${ast.spectrum} Hz</td>
                        <td class="${ast.className}">${ast.composition}</td>
                    `;
                    asteroidLog.appendChild(row);
                });

                statusText.innerText = "Status: Scan Complete";
                resultsPanel.classList.remove('hidden');
                scanBtn.disabled = false;
            }, 1200);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeSpectra };
}
