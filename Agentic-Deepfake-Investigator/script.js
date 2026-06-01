async function extractForensicFeatures(videoUrl) {
    // Simulated external tool call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                url: videoUrl,
                facialArtifactsFound: true,
                lipSyncScore: 45, // out of 100
                lightingConsistency: "Poor",
                metadata: {
                    software: "Unknown Custom Encoder",
                    creationDate: "2024-05-10"
                }
            });
        }, 1000);
    });
}

async function investigateVideo(apiKey, videoUrl, logCallback) {
    logCallback(`[Agent] Initiating investigation for: ${videoUrl}`);

    logCallback(`[Agent] Calling external tool: extractForensicFeatures()`);
    const features = await extractForensicFeatures(videoUrl);
    logCallback(`[Agent] Tool returned: Facial Artifacts: ${features.facialArtifactsFound}, Lip Sync: ${features.lipSyncScore}/100, Lighting: ${features.lightingConsistency}`);

    logCallback(`[Agent] Synthesizing data with LLM analysis...`);

    const systemPrompt = "You are an autonomous Deepfake Investigation Agent. Analyze the provided forensic features of a video and generate a concise, professional report (in Markdown) determining if the video is a deepfake. Highlight the key evidence.";
    const userMessage = `Forensic Data:\n${JSON.stringify(features, null, 2)}`;

    try {
        let report;
        if (typeof fetchOpenAI !== 'undefined') {
            report = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage);
        } else {
            // Fallback for isolated testing environments
            report = "**Simulated Report:** Based on the forensic data, this video is highly likely a deepfake due to poor lighting consistency and low lip-sync scores.";
        }
        logCallback(`[Agent] Analysis complete.`);
        return report;
    } catch (error) {
        logCallback(`[Error] LLM API Call Failed: ${error.message}`);
        throw error;
    }
}

async function startInvestigation() {
    const apiKey = document.getElementById('apiKey').value;
    const videoUrl = document.getElementById('videoUrl').value;
    const resultsArea = document.getElementById('resultsArea');
    const logDiv = document.getElementById('investigationLog');
    const reportDiv = document.getElementById('finalReport');

    if (!apiKey || !videoUrl) {
        alert("Please provide both an API Key and a Video URL.");
        return;
    }

    resultsArea.classList.remove('hidden');
    logDiv.innerHTML = '';
    reportDiv.innerHTML = '<p>Generating report...</p>';

    const addLog = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    };

    try {
        const reportMarkdown = await investigateVideo(apiKey, videoUrl, addLog);

        // Parse and sanitize markdown
        if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            const rawHtml = marked.parse(reportMarkdown);
            reportDiv.innerHTML = DOMPurify.sanitize(rawHtml);
        } else {
            reportDiv.textContent = reportMarkdown;
        }
    } catch (error) {
        reportDiv.innerHTML = `<p style="color: red;">Investigation failed: ${error.message}</p>`;
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('investigateBtn').addEventListener('click', startInvestigation);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { investigateVideo, extractForensicFeatures };
}
