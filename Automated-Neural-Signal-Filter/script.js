// Deterministic Logic
function filterSignals(signals, threshold) {
    const processed = [];
    let keptCount = 0;

    for (let sig of signals) {
        if (sig.frequency >= threshold) {
            processed.push({ ...sig, action: 'Kept', className: 'action-keep' });
            keptCount++;
        } else {
            processed.push({ ...sig, action: 'Dropped (Noise)', className: 'action-drop' });
        }
    }

    return { processed, keptCount };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const filterBtn = document.getElementById('filter-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const rawCountEl = document.getElementById('raw-count');
        const filteredCountEl = document.getElementById('filtered-count');
        const signalLog = document.querySelector('#signal-log tbody');

        const mockSignals = [
            { id: "CH-01", frequency: 12 },
            { id: "CH-02", frequency: 45 },
            { id: "CH-03", frequency: 8 },
            { id: "CH-04", frequency: 60 },
            { id: "CH-05", frequency: 22 }
        ];

        filterBtn.addEventListener('click', () => {
            const threshold = parseFloat(document.getElementById('hz-threshold').value);

            if (isNaN(threshold)) {
                alert("Please enter a valid threshold.");
                return;
            }

            filterBtn.disabled = true;
            statusText.innerText = "Status: Filtering Array...";
            resultsPanel.classList.add('hidden');
            signalLog.innerHTML = '';

            setTimeout(() => {
                const results = filterSignals(mockSignals, threshold);

                rawCountEl.innerText = mockSignals.length;
                filteredCountEl.innerText = results.keptCount;

                results.processed.forEach(sig => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${sig.id}</td>
                        <td>${sig.frequency} Hz</td>
                        <td class="${sig.className}">${sig.action}</td>
                    `;
                    signalLog.appendChild(row);
                });

                statusText.innerText = "Status: Filtering Complete";
                resultsPanel.classList.remove('hidden');
                filterBtn.disabled = false;
            }, 800);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { filterSignals };
}
