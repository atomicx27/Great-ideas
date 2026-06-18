async function moderateContent(text, context, provider) {
    const prompt = `As an autonomous Content Moderation Agent, analyze the following text for a platform with the context: "${context}".\nText to analyze: "${text}"\nDetermine if this content is appropriate for this specific platform context. Provide your analysis in the following format:\nStatus: [Approved / Rejected / Needs Human Review]\nReasoning: [Your brief explanation]\nAction Taken: [e.g., Posted, Deleted, Flagged]`;
    try {
        const response = await fetchLLMResponse(provider, prompt);
        return response;
    } catch (error) {
        return "Error connecting to the LLM service.";
    }
}
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('moderation-form');
        const output = document.getElementById('analysis-output');
        const loading = document.getElementById('loading');
        const btn = document.getElementById('moderate-btn');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('content').value;
            const context = document.getElementById('context').value;
            const provider = document.getElementById('provider').value;
            loading.style.display = 'block';
            output.innerHTML = '';
            btn.disabled = true;
            const analysis = await moderateContent(text, context, provider);
            loading.style.display = 'none';
            output.innerHTML = `<div class="analysis-content"></div>`;
            output.querySelector(".analysis-content").textContent = analysis;
            btn.disabled = false;
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { moderateContent };
