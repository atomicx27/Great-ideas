function calculateRiggingParameters(flux, area, phase) {
    // Deterministic rules for sail rigging
    // Tension base on area and thermal load (flux)
    // Optimal angle based on orbital phase

    let baseTension = (area * 0.05) + (flux * 0.1);

    // Adjust angle based on phase. Ideal facing sun is 0/360.
    let optimalAngle = 0;
    if (phase > 90 && phase < 270) {
        // Edge-on to reduce drag/pressure when moving towards sun
        optimalAngle = 90;
        baseTension *= 0.5; // lower tension when edge-on
    } else {
        // Slight angle to optimize thrust vector
        optimalAngle = phase > 180 ? 15 : -15;
    }

    return { tension: baseTension.toFixed(2), angle: optimalAngle };
}

function handleDeployment() {
    if (typeof document === 'undefined') return;

    const flux = parseFloat(document.getElementById('solar-flux').value);
    const area = parseFloat(document.getElementById('sail-area').value);
    const phase = parseFloat(document.getElementById('orbit-phase').value);
    const resultsDisplay = document.getElementById('results-display');
    const statusText = document.getElementById('status-text');

    if (isNaN(flux) || isNaN(area) || isNaN(phase)) {
        resultsDisplay.innerHTML = '<span style="color:red;">Error: Invalid sensor input.</span>';
        return;
    }

    statusText.textContent = "Status: Calculating mechanics...";
    statusText.style.color = "#00ffcc";
    resultsDisplay.innerHTML = "Computing strut tension and yaw vectors...<br>";

    setTimeout(() => {
        const result = calculateRiggingParameters(flux, area, phase);

        resultsDisplay.innerHTML += `
            > Deployment Math OK.<br>
            > Strut Tension: <span class="param-val">${result.tension} kN</span><br>
            > Yaw Angle: <span class="param-val">${result.angle}°</span><br>
            > Command sent to rigging drones.
        `;

        statusText.textContent = "Status: Rigging Locked";
    }, 600);
}

if (typeof document !== 'undefined') {
    document.getElementById('deploy-btn').addEventListener('click', handleDeployment);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateRiggingParameters };
}
