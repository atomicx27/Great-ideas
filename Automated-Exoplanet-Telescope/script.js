/**
 * Automated Exoplanet Telescope Logic
 */

let currentSector = 0;
const THRESHOLD_DIP = 0.02; // 2% dip indicates possible transit

function scanSector(sectorId) {
    // Simulates scanning a sector and returning coordinate range
    const startX = sectorId * 100;
    const endX = startX + 99;
    return `RA: ${startX} to ${endX}, DEC: +20 to +30`;
}

function calculateLightCurve(fluxData) {
    // Given an array of flux measurements (baseline 1.0), calculate average dip
    if (!fluxData || fluxData.length === 0) return 1.0;
    const minFlux = Math.min(...fluxData);
    return minFlux;
}

function detectTransit(minFlux) {
    // If flux drops below 1.0 - THRESHOLD_DIP, flag it
    const dip = 1.0 - minFlux;
    if (dip >= THRESHOLD_DIP) {
        return { detected: true, dipAmount: (dip * 100).toFixed(2) + '%' };
    }
    return { detected: false, dipAmount: '0%' };
}

// Generate mock flux data
function generateMockFlux() {
    const data = [];
    const hasTransit = Math.random() > 0.6;
    for (let i = 0; i < 20; i++) {
        let flux = 1.0 - (Math.random() * 0.005); // noise
        if (hasTransit && i > 8 && i < 12) {
            flux -= 0.025; // Introduce a dip
        }
        data.push(flux);
    }
    return data;
}

function logMessage(msg, type = '') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('scan-log');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${msg}`;
    container.insertBefore(entry, container.firstChild);
}

async function performScan() {
    if (typeof document === 'undefined') return;
    currentSector++;
    const sectorDisplay = document.getElementById('sector-display');
    const curveDisplay = document.getElementById('curve-display');
    const resultDisplay = document.getElementById('result-display');
    const btn = document.getElementById('scan-btn');

    btn.disabled = true;
    sectorDisplay.textContent = 'Scanning...';
    curveDisplay.textContent = '...';
    resultDisplay.textContent = '...';

    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const coords = scanSector(currentSector);
    sectorDisplay.textContent = `Sector ${currentSector} | ${coords}`;
    logMessage(`Scanned Sector ${currentSector}: ${coords}`);

    await new Promise(resolve => setTimeout(resolve, 600));

    const fluxData = generateMockFlux();
    const minFlux = calculateLightCurve(fluxData);
    curveDisplay.textContent = `Min Flux: ${minFlux.toFixed(4)}`;

    await new Promise(resolve => setTimeout(resolve, 600));

    const result = detectTransit(minFlux);
    if (result.detected) {
        resultDisplay.textContent = `TRANSIT DETECTED (Dip: ${result.dipAmount})`;
        resultDisplay.style.color = 'var(--success-color)';
        logMessage(`Candidate found in Sector ${currentSector}! Dip: ${result.dipAmount}`, 'success');
    } else {
        resultDisplay.textContent = 'No transits detected.';
        resultDisplay.style.color = 'var(--text-color)';
        logMessage(`Sector ${currentSector} clear.`);
    }

    btn.disabled = false;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('scan-btn');
        if (btn) btn.addEventListener('click', performScan);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scanSector, calculateLightCurve, detectTransit };
}
