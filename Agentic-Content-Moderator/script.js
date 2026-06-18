async function analyzeContent(apiKey, text) {
    if (!text || typeof text !== 'string') return 'Error: Invalid input';

    const systemPrompt = `You are an expert Content Moderator.
Your job is to analyze the user's content and determine if it violates community guidelines (spam, hate speech, violence, illegal activities).
You must also understand context (e.g., discussing a topic academically vs. promoting it).
Format your response in Markdown, including:
- **Decision:** [Safe / Flagged / Needs Review]
- **Reasoning:** [Brief explanation]
- **Context Analysis:** [Explanation of context considered]`;

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
        const contentInput = document.getElementById('content-input');
        const resultsSection = document.getElementById('results-section');
        const resultOutput = document.getElementById('result-output');

        processBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            const text = contentInput.value.trim();

            if (!apiKey || !text) {
                alert('Please enter both an API key and content.');
                return;
            }

            processBtn.textContent = 'Analyzing...';
            processBtn.disabled = true;

            const result = await analyzeContent(apiKey, text);

            resultsSection.classList.remove('hidden');
            resultOutput.innerHTML = DOMPurify.sanitize(marked.parse(result));

            processBtn.textContent = 'Analyze with LLM';
            processBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeContent };
}
