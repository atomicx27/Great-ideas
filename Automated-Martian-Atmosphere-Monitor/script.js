function calculatePressureStatus(co2Level, temperature) {
    // Deterministic rules for Martian habitat safety
    // CO2 > 5000 is critical, > 2000 is warning
    // Temp < -100 is critical stress on seals, < -80 is warning

    let status = "SAFE";
    let action = "Continue normal operations.";

    if (co2Level > 5000 || temperature < -100) {
        status = "CRITICAL";
        action = "Evacuate sector and seal bulkheads immediately.";
    } else if (co2Level > 2000 || temperature < -80) {
        status = "WARNING";
        action = "Increase scrubber output and enable thermal reserves.";
    }

    return { status, action };
}

function runDiagnostics() {
    if (typeof document === 'undefined') return;

    const co2Input = parseFloat(document.getElementById('co2-input').value);
    const tempInput = parseFloat(document.getElementById('temp-input').value);
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (isNaN(co2Input) || isNaN(tempInput)) {
        resultsDisplay.innerHTML = '<span class="error-text">Error: Sensor malfunction.</span>';
        return;
    }

    statusText.textContent = "System: Analyzing...";
    statusText.style.color = "#fbbf24";
    resultsDisplay.innerHTML = "Processing telemetry logs...<br>";

    setTimeout(() => {
        const result = calculatePressureStatus(co2Input, tempInput);

        let statusClass = "success-text";
        if (result.status === "CRITICAL") statusClass = "error-text";
        else if (result.status === "WARNING") statusClass = "warning-text";

        resultsDisplay.innerHTML += `
            > Diagnostics complete.<br>
            > Habitat Status: <span class="${statusClass}">${result.status}</span><br>
            > Recommended Protocol: ${result.action}
        `;

        statusText.textContent = "System: Diagnostics Complete";
        statusText.style.color = "#4ade80";
    }, 500);
}

if (typeof document !== 'undefined') {
    document.getElementById('scan-btn').addEventListener('click', runDiagnostics);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculatePressureStatus };
}
