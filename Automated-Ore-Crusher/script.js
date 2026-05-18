function evaluateCrusherStatus(hopper, temp) {
    if (temp >= 300) {
        return { status: 'halted', message: 'CRITICAL TEMP. Auto-shutdown engaged to prevent meltdown.' };
    }
    if (hopper >= 100) {
        return { status: 'halted', message: 'Hopper full. Awaiting transport drone for offload.' };
    }
    return { status: 'active', message: 'Crushing active.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let hopper = 0;
        let temp = 50;

        const statusEl = document.getElementById('status');
        const hopperEl = document.getElementById('hopper');
        const tempEl = document.getElementById('temp');
        const crushBtn = document.getElementById('crush-btn');
        const resetBtn = document.getElementById('reset-btn');

        function updateUI() {
            hopperEl.textContent = hopper;
            tempEl.textContent = temp;

            const evaluation = evaluateCrusherStatus(hopper, temp);
            statusEl.textContent = 'Status: ' + evaluation.message;

            if (evaluation.status === 'halted') {
                statusEl.className = 'status-box alert';
                crushBtn.disabled = true;
            } else {
                statusEl.className = 'status-box ok';
                crushBtn.disabled = false;
            }
        }

        crushBtn.addEventListener('click', () => {
            hopper = Math.min(100, hopper + 35);
            temp = Math.min(400, temp + 85);
            updateUI();
        });

        resetBtn.addEventListener('click', () => {
            hopper = 0;
            temp = 50;
            updateUI();
        });

        updateUI();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateCrusherStatus };
}