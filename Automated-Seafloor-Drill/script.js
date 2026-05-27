/**
 * Automated Seafloor Drill Logic
 */

const MAX_TEMP = 120; // Celsius
const WARNING_TEMP = 100;
const BASE_RPM = 1500;

function monitorTemperature(currentTemp) {
    if (currentTemp >= MAX_TEMP) {
        return { status: 'CRITICAL', msg: 'Max temperature exceeded.' };
    } else if (currentTemp >= WARNING_TEMP) {
        return { status: 'WARNING', msg: 'Approaching critical temperature.' };
    }
    return { status: 'NOMINAL', msg: 'Temperature normal.' };
}

function adjustRPM(materialDensity) {
    // density 1.0 (water/mud) -> 1500 RPM
    // density 3.0 (solid rock) -> 500 RPM
    // formula: RPM = BASE_RPM / density
    const targetRPM = Math.floor(BASE_RPM / Math.max(1, materialDensity));
    return targetRPM;
}

function triggerShutdown() {
    return {
        shutdown: true,
        action: 'EMERGENCY SHUTDOWN INITIATED: Retracting drill bit and cutting power.'
    };
}

let drillInterval;
let isDrilling = false;
let currentDepth = 0;
let currentTemp = 15;

function logMessage(msg, type = '') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('op-log');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${msg}`;
    container.insertBefore(entry, container.firstChild);
}

function updateUI(depth, rpm, temp, density, statusType = '') {
    if (typeof document === 'undefined') return;
    document.getElementById('depth-display').innerHTML = `Depth: ${depth.toFixed(1)}m<br>RPM: ${rpm}`;

    const tempDisplay = document.getElementById('temp-display');
    tempDisplay.innerHTML = `Temp: ${temp.toFixed(1)}°C`;

    if (statusType === 'CRITICAL') tempDisplay.style.color = 'var(--danger-color)';
    else if (statusType === 'WARNING') tempDisplay.style.color = 'var(--warning-color)';
    else tempDisplay.style.color = 'var(--text-color)';

    document.getElementById('density-display').textContent = `Density: ${density.toFixed(2)} g/cm³`;
}

function stopDrill(isEmergency = false) {
    isDrilling = false;
    clearInterval(drillInterval);
    if (typeof document !== 'undefined') {
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
    }
    if (isEmergency) {
        const shutdownData = triggerShutdown();
        logMessage(shutdownData.action, 'danger');
        updateUI(currentDepth, 0, currentTemp, 0, 'CRITICAL');
    } else {
        logMessage('Drilling paused.', 'warning');
        updateUI(currentDepth, 0, currentTemp, 0);
    }
}

function startDrill() {
    if (isDrilling) return;
    isDrilling = true;

    if (typeof document !== 'undefined') {
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
    }

    logMessage('Commencing drilling sequence...', 'success');

    drillInterval = setInterval(() => {
        currentDepth += 0.5;

        // Simulate changing material density as we go deeper
        const density = 1.0 + (Math.sin(currentDepth / 10) + 1); // fluctuates between 1 and 3
        const rpm = adjustRPM(density);

        // Heat generates faster at higher densities
        currentTemp += (density * 0.5);

        const tempCheck = monitorTemperature(currentTemp);

        updateUI(currentDepth, rpm, currentTemp, density, tempCheck.status);

        if (tempCheck.status === 'CRITICAL') {
            stopDrill(true);
        } else if (tempCheck.status === 'WARNING') {
            // Chance to cool down slightly if not critical
            logMessage(tempCheck.msg, 'warning');
            currentTemp -= 1.0;
        }

        if (currentDepth % 5 === 0 && isDrilling) {
            logMessage(`Reached depth ${currentDepth}m. Strata density: ${density.toFixed(2)}`);
        }

    }, 500); // 500ms per tick
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');

        if (startBtn) startBtn.addEventListener('click', startDrill);
        if (stopBtn) stopBtn.addEventListener('click', () => stopDrill(true));
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { monitorTemperature, adjustRPM, triggerShutdown };
}
