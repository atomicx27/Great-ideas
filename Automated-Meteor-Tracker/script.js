function calculateImpactProbability(speed, mass, angle) {
    // Deterministic rules for impact probability calculation
    // Speed: higher speed increases risk
    // Mass: higher mass increases risk
    // Angle: angles closer to 90 (direct impact) increase risk

    let riskScore = 0;

    if (speed > 30) riskScore += 30;
    else if (speed > 15) riskScore += 10;

    if (mass > 50000) riskScore += 40;
    else if (mass > 10000) riskScore += 20;

    if (angle > 70) riskScore += 30;
    else if (angle > 30) riskScore += 15;

    let probability = Math.min(riskScore, 100);

    let classification = "LOW";
    if (probability > 75) classification = "HIGH";
    else if (probability > 40) classification = "MEDIUM";

    return { probability, classification };
}

function performScan() {
    if (typeof document === 'undefined') return; // For testing

    const speed = parseFloat(document.getElementById('speed-input').value);
    const mass = parseFloat(document.getElementById('mass-input').value);
    const angle = parseFloat(document.getElementById('angle-input').value);
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (isNaN(speed) || isNaN(mass) || isNaN(angle)) {
        resultsDisplay.innerHTML = '<span class="threat-high">Error: Invalid sensor input.</span>';
        return;
    }

    statusText.textContent = "Status: Calculating...";
    statusText.style.color = "#ffaa00";
    resultsDisplay.innerHTML = "Processing radar telemetry...<br>";

    setTimeout(() => {
        const result = calculateImpactProbability(speed, mass, angle);

        let threatClass = result.classification === "HIGH" ? "threat-high" : (result.classification === "LOW" ? "threat-low" : "");

        resultsDisplay.innerHTML += `
            > Trajectory computed.<br>
            > Est. Impact Probability: ${result.probability}%<br>
            > Threat Level: <span class="${threatClass}">${result.classification}</span>
        `;

        statusText.textContent = "Status: Tracking Active";
        statusText.style.color = "#33cc33";
    }, 800);
}

if (typeof document !== 'undefined') {
    document.getElementById('scan-btn').addEventListener('click', performScan);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateImpactProbability };
}
