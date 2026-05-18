function getGateState(trainApproaching) {
    if (trainApproaching) {
        return 'closed';
    }
    return 'open';
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let trainApproaching = false;

        const btn = document.getElementById('train-approach-btn');
        const indicator = document.getElementById('gate-indicator');
        const status = document.getElementById('status-message');

        function updateUI() {
            const state = getGateState(trainApproaching);
            if (state === 'closed') {
                indicator.textContent = 'CLOSED';
                indicator.className = 'closed';
                status.textContent = 'Status: Train Passing';
            } else {
                indicator.textContent = 'OPEN';
                indicator.className = 'open';
                status.textContent = 'Status: Clear';
            }
        }

        btn.addEventListener('click', () => {
            trainApproaching = true;
            btn.disabled = true;
            updateUI();

            // Simulate train passing after 5 seconds
            setTimeout(() => {
                trainApproaching = false;
                btn.disabled = false;
                updateUI();
            }, 5000);
        });

        updateUI();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getGateState };
}