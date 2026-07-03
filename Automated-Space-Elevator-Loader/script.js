const MAX_PAYLOAD_KG = 20000;
let currentPayload = 0;

function calculatePayloadWeight(additionalWeight) {
    return currentPayload + additionalWeight;
}

function loadCargo(weightKg) {
    if (weightKg <= 0) {
        log("Invalid cargo weight.");
        return false;
    }

    const projectedWeight = calculatePayloadWeight(weightKg);
    if (projectedWeight > MAX_PAYLOAD_KG) {
        log(`Load failed: Capacity exceeded. Max: ${MAX_PAYLOAD_KG}kg, Attempted: ${projectedWeight}kg.`);
        return false;
    }

    currentPayload = projectedWeight;
    log(`Successfully loaded ${weightKg}kg. Current total: ${currentPayload}kg.`);
    updateUI();
    return true;
}

function updateUI() {
    if (typeof document === 'undefined') return;
    const statusPanel = document.getElementById('status-panel');
    if (statusPanel) {
        statusPanel.textContent = `Current Payload: ${currentPayload} kg / ${MAX_PAYLOAD_KG} kg`;
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
        document.getElementById('load-btn').addEventListener('click', () => {
            const weightInput = document.getElementById('cargo-weight');
            const weight = parseInt(weightInput.value, 10);
            if (!isNaN(weight)) {
                loadCargo(weight);
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculatePayloadWeight, loadCargo, MAX_PAYLOAD_KG, getCurrentPayload: () => currentPayload, resetPayload: () => currentPayload = 0 };
}
