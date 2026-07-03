let isGateOpen = false;

function checkGateStatus() {
    return isGateOpen;
}

function openGate() {
    isGateOpen = true;
    updateUI();
    log("Gate opened.");
}

function closeGate() {
    isGateOpen = false;
    updateUI();
    log("Gate closed.");
}

function dispatchPod() {
    if (!checkGateStatus()) {
        log("Cannot dispatch. Gate is closed.");
        return false;
    }
    log("Pod dispatched successfully.");
    closeGate();
    return true;
}

function updateUI() {
    if (typeof document === 'undefined') return;
    const statusEl = document.getElementById('gate-status');
    if (statusEl) {
        if (isGateOpen) {
            statusEl.textContent = 'Gate Open';
            statusEl.className = 'gate-status gate-open';
        } else {
            statusEl.textContent = 'Gate Closed';
            statusEl.className = 'gate-status gate-closed';
        }
    }
}

function log(message) {
    if (typeof document === 'undefined') return;
    const logEl = document.getElementById('log');
    if (logEl) {
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logEl.prepend(p);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateUI();
        document.getElementById('dispatch-btn').addEventListener('click', () => {
            openGate();
            setTimeout(dispatchPod, 1000);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkGateStatus, dispatchPod, openGate, closeGate };
}
