// Deterministic Logic
function calculatePrintJob(material, design) {
    const materialData = {
        'titanium': { duration: 120, failRate: 0.05 },
        'aluminum': { duration: 60, failRate: 0.01 },
        'carbon_fiber': { duration: 90, failRate: 0.1 }
    };

    const designData = {
        'strut': { multiplier: 1.0 },
        'panel': { multiplier: 1.5 },
        'bracket': { multiplier: 0.8 }
    };

    const baseDuration = materialData[material].duration;
    const multiplier = designData[design].multiplier;
    const totalDuration = baseDuration * multiplier;

    // Deterministic pseudo-random for testing predictability
    const isSuccess = (materialData[material].failRate < 0.06);

    return {
        duration: totalDuration,
        status: isSuccess ? 'Success' : 'Failed - Calibrate Extruder',
        class: isSuccess ? 'status-success' : 'status-error'
    };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const printBtn = document.getElementById('print-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const printLog = document.querySelector('#print-log tbody');
        const materialSelect = document.getElementById('material');
        const designSelect = document.getElementById('design');

        let jobId = 1;

        printBtn.addEventListener('click', () => {
            const material = materialSelect.value;
            const design = designSelect.value;

            printBtn.disabled = true;
            statusText.innerText = `Status: Printing ${design} with ${material}...`;

            setTimeout(() => {
                const result = calculatePrintJob(material, design);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${String(jobId).padStart(4, '0')}</td>
                    <td>${material}</td>
                    <td>${design}</td>
                    <td>${result.duration} mins</td>
                    <td class="${result.class}">${result.status}</td>
                `;
                printLog.insertBefore(row, printLog.firstChild);

                jobId++;
                statusText.innerText = "Status: Idle";
                resultsPanel.classList.remove('hidden');
                printBtn.disabled = false;
            }, 800);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { calculatePrintJob };
}
