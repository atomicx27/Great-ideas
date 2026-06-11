function calculateDeploymentAngle(orbitRadius, solarWindSpeed) {
    // Deterministic rules for Dyson Swarm panel angle
    // Orbit radius (AU): closer to sun requires steeper angle to deflect radiation pressure
    // Solar wind speed (km/s): higher speed requires steeper angle

    let baseAngle = 45; // default angle

    // Adjust for orbit radius
    if (orbitRadius < 0.5) {
        baseAngle += 15;
    } else if (orbitRadius > 1.0) {
        baseAngle -= 10;
    }

    // Adjust for solar wind
    if (solarWindSpeed > 700) {
        baseAngle += 10;
    } else if (solarWindSpeed < 300) {
        baseAngle -= 5;
    }

    // Clamp between 0 and 90 degrees
    let optimalAngle = Math.max(0, Math.min(90, baseAngle));

    let structuralStress = "NOMINAL";
    if (solarWindSpeed > 800 || orbitRadius < 0.3) {
        structuralStress = "CRITICAL";
    } else if (solarWindSpeed > 500) {
        structuralStress = "ELEVATED";
    }

    return { optimalAngle, structuralStress };
}

function handleCalculate() {
    if (typeof document === 'undefined') return; // For testing

    const radiusInput = document.getElementById('radius-input').value;
    const windInput = document.getElementById('solar-wind-input').value;
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    const orbitRadius = parseFloat(radiusInput);
    const solarWindSpeed = parseFloat(windInput);

    if (isNaN(orbitRadius) || isNaN(solarWindSpeed) || orbitRadius <= 0 || solarWindSpeed <= 0) {
        resultsDisplay.innerHTML = '<span class="error-text">Error: Invalid parameters.</span>';
        return;
    }

    statusText.textContent = "Status: Calculating...";
    statusText.style.color = "#fbbf24";
    resultsDisplay.innerHTML = "Computing optimal geometry...<br>";

    setTimeout(() => {
        const result = calculateDeploymentAngle(orbitRadius, solarWindSpeed);

        let stressClass = "";
        if (result.structuralStress === "CRITICAL") stressClass = "error-text";
        else if (result.structuralStress === "NOMINAL") stressClass = "success-text";

        resultsDisplay.innerHTML += `
            > Optimization complete.<br>
            > Optimal Deployment Angle: ${result.optimalAngle} degrees<br>
            > Estimated Structural Stress: <span class="${stressClass}">${result.structuralStress}</span>
        `;

        statusText.textContent = "Status: Computed successfully";
        statusText.style.color = "#4ade80";
    }, 600);
}

if (typeof document !== 'undefined') {
    document.getElementById('calc-btn').addEventListener('click', handleCalculate);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateDeploymentAngle };
}
