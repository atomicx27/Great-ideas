// Deterministic Logic
function categorizeEngram(intensity) {
    if (intensity < 30) {
        return { type: 'Procedural', class: 'type-procedural' };
    } else if (intensity < 70) {
        return { type: 'Semantic', class: 'type-semantic' };
    } else {
        return { type: 'Episodic', class: 'type-episodic' };
    }
}

function processEngrams(engrams) {
    return engrams.map(e => ({
        id: e.id,
        intensity: e.intensity,
        ...categorizeEngram(e.intensity)
    }));
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const engramLog = document.querySelector('#engram-log tbody');

        const mockEngrams = [
            { id: "ENG-01", intensity: 15 },
            { id: "ENG-02", intensity: 85 },
            { id: "ENG-03", intensity: 50 },
            { id: "ENG-04", intensity: 95 },
            { id: "ENG-05", intensity: 25 }
        ];

        scanBtn.addEventListener('click', () => {
            scanBtn.disabled = true;
            statusText.innerText = "Status: Indexing Engrams...";
            resultsPanel.classList.add('hidden');
            engramLog.innerHTML = '';

            setTimeout(() => {
                const results = processEngrams(mockEngrams);

                results.forEach(engram => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${engram.id}</td>
                        <td>${engram.intensity}</td>
                        <td class="${engram.class}">${engram.type}</td>
                    `;
                    engramLog.appendChild(row);
                });

                statusText.innerText = "Status: Indexing Complete";
                resultsPanel.classList.remove('hidden');
                scanBtn.disabled = false;
            }, 1000);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { categorizeEngram, processEngrams };
}
