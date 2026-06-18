async function analyzePatientContext(apiKey, text) {
    if (!text || typeof text !== 'string') return 'Error: Invalid input';

    const systemPrompt = `You are an expert Clinical Triage Agent.
Your job is to analyze the patient's symptoms, age, and medical history.
Take into account risk factors (e.g., chest pain in an older patient with diabetes vs. a healthy 20-year-old).
Format your response in Markdown, including:
- **Triage Level:** [Level 1 (Resuscitation) to Level 5 (Non-urgent)]
- **Clinical Reasoning:** [Why this level was chosen based on the context]
- **Recommended Action:** [Next steps for the patient]`;

    try {
        const response = await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, text, { temperature: 0.2 });
        return response;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const apiKeyInput = document.getElementById('api-key');
        const contextInput = document.getElementById('context-input');
        const resultsSection = document.getElementById('results-section');
        const resultOutput = document.getElementById('result-output');

        processBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            const text = contextInput.value.trim();

            if (!apiKey || !text) {
                alert('Please enter both an API key and patient context.');
                return;
            }

            processBtn.textContent = 'Analyzing...';
            processBtn.disabled = true;

            const result = await analyzePatientContext(apiKey, text);

            resultsSection.classList.remove('hidden');
            resultOutput.innerHTML = DOMPurify.sanitize(marked.parse(result));

            processBtn.textContent = 'Analyze Context';
            processBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzePatientContext };
}
