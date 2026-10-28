function monitorHologramState(powerLevel, stabilityIndex) {
    if (powerLevel < 50 || stabilityIndex < 0.8) {
        return "Warning: Hologram unstable";
    }
    return "Hologram stable";
}

function triggerAlerts(state) {
    if (state.includes("Warning")) {
        return "Alert triggered: Technician dispatched";
    }
    return "No alerts";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('runBtn');
        const output = document.getElementById('output');
        const status = document.getElementById('status');

        runBtn.addEventListener('click', () => {
            status.textContent = "Status: Monitoring...";
            const state = monitorHologramState(40, 0.9);
            const alert = triggerAlerts(state);
            output.innerHTML = `<p>${state}</p><p>${alert}</p>`;
            status.textContent = "Status: Done";
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorHologramState, triggerAlerts };
}
