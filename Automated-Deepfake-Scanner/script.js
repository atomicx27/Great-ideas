function scanMetadata(fileSize, fileType) {
    let score = 0;
    const logs = [];
    logs.push("Scanning metadata...");

    if (fileType !== 'video/mp4' && fileType !== 'video/x-msvideo') {
        score += 15;
        logs.push("Warning: Unusual file format detected.");
    } else {
        logs.push("File format appears standard.");
    }

    if (fileSize > 50000000) { // > 50MB for a short clip
        score += 10;
        logs.push("Warning: Abnormally large file size might indicate uncompressed manipulation.");
    }

    return { score, logs };
}

function analyzeFrameRate(duration, totalFrames) {
    let score = 0;
    const logs = [];
    logs.push("Analyzing frame consistency...");

    const fps = totalFrames / duration;
    if (fps < 23.97 || fps > 60.1) {
        score += 25;
        logs.push(`Warning: Irregular framerate (${fps.toFixed(2)} fps).`);
    } else if (Math.abs(fps - 30) > 1 && Math.abs(fps - 60) > 1 && Math.abs(fps - 24) > 1) {
        score += 20;
        logs.push(`Warning: Non-standard framerate (${fps.toFixed(2)} fps).`);
    } else {
        logs.push("Framerate consistency check passed.");
    }

    return { score, logs };
}

function calculateDeepfakeScore(metadataScore, frameScore) {
    let finalScore = metadataScore + frameScore;

    // Base heuristic: 10% chance of compression artifacts
    finalScore += 10;

    if (finalScore > 100) finalScore = 100;

    let verdict = "Likely Authentic";
    if (finalScore >= 60) {
        verdict = "Highly Suspicious - Deepfake Likely";
    } else if (finalScore >= 35) {
        verdict = "Suspicious - Manual Review Recommended";
    }

    return { finalScore, verdict };
}

async function startScan() {
    const fileInput = document.getElementById('videoInput');
    const resultsArea = document.getElementById('resultsArea');
    const scanLog = document.getElementById('scanLog');
    const scoreSpan = document.getElementById('finalScore');
    const verdictP = document.getElementById('verdict');

    if (!fileInput.files.length) {
        alert("Please select a simulated video file first.");
        return;
    }

    resultsArea.classList.remove('hidden');
    scanLog.innerHTML = '';
    scoreSpan.textContent = '...';
    verdictP.textContent = 'Scanning in progress...';

    const file = fileInput.files[0];

    // Simulate some latency for the UI
    const addLog = (text) => {
        const p = document.createElement('p');
        p.textContent = `> ${text}`;
        scanLog.appendChild(p);
        scanLog.scrollTop = scanLog.scrollHeight;
    };

    addLog(`Initiating scan for: ${file.name}`);
    await new Promise(r => setTimeout(r, 500));

    const metaRes = scanMetadata(file.size, file.type);
    metaRes.logs.forEach(addLog);
    await new Promise(r => setTimeout(r, 800));

    // Simulate duration and frames based on file size for demo
    const simulatedDuration = file.size / 100000;
    const simulatedFrames = simulatedDuration * (file.size % 2 === 0 ? 30.5 : 30.0);

    const frameRes = analyzeFrameRate(simulatedDuration, simulatedFrames);
    frameRes.logs.forEach(addLog);
    await new Promise(r => setTimeout(r, 800));

    const final = calculateDeepfakeScore(metaRes.score, frameRes.score);

    addLog(`Scan complete. Final Score calculated.`);
    scoreSpan.textContent = final.finalScore;
    verdictP.textContent = final.verdict;

    if (final.finalScore >= 60) {
        verdictP.style.color = "var(--danger-color)";
    } else if (final.finalScore >= 35) {
        verdictP.style.color = "orange";
    } else {
        verdictP.style.color = "var(--safe-color)";
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('scanBtn').addEventListener('click', startScan);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scanMetadata, analyzeFrameRate, calculateDeepfakeScore };
}
