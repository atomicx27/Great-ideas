function evaluateSkimmerStatus(battery, capacity) {
    if (battery <= 20) {
        return { status: 'returning', message: 'Low battery. Returning to dock to recharge.' };
    }
    if (capacity >= 100) {
        return { status: 'returning', message: 'Bin full. Returning to dock to unload.' };
    }
    return { status: 'active', message: 'Skimming active.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let battery = 100;
        let capacity = 0;

        const statusEl = document.getElementById('status');
        const batteryEl = document.getElementById('battery');
        const capacityEl = document.getElementById('capacity');
        const simBtn = document.getElementById('simulate-btn');
        const resetBtn = document.getElementById('reset-btn');

        function updateUI() {
            batteryEl.textContent = battery;
            capacityEl.textContent = capacity;

            const evaluation = evaluateSkimmerStatus(battery, capacity);
            statusEl.textContent = 'Status: ' + evaluation.message;

            if (evaluation.status === 'returning') {
                statusEl.className = 'status-box alert';
                simBtn.disabled = true;
            } else {
                statusEl.className = 'status-box ok';
                simBtn.disabled = false;
            }
        }

        simBtn.addEventListener('click', () => {
            battery = Math.max(0, battery - 15);
            capacity = Math.min(100, capacity + 25);
            updateUI();
        });

        resetBtn.addEventListener('click', () => {
            battery = 100;
            capacity = 0;
            updateUI();
        });

        updateUI();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateSkimmerStatus };
}