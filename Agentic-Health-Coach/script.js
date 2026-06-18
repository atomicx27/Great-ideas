async function generateHealthAdvice(sleepData, apiKey) {
    if (!apiKey) throw new Error("API Key is required");

    const systemPrompt = "You are an expert health coach. Analyze the user's sleep data and provide 3 actionable tips to improve their sleep quality.";
    const userMessage = `My sleep data: ${JSON.stringify(sleepData)}`;

    // Utilizing shared fetchOpenAI from llm-api.js
    const response = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage, { temperature: 0.7 });
    return response;
}

if (typeof document !== 'undefined') {
    document.getElementById('coachBtn').addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value.trim();
        const sleepDataStr = document.getElementById('sleepData').value.trim();
        const outputEl = document.getElementById('output');

        if (!apiKey) {
            outputEl.textContent = 'Please enter an API Key.';
            return;
        }

        let sleepData;
        try {
            sleepData = JSON.parse(sleepDataStr);
        } catch (e) {
            outputEl.textContent = 'Invalid Sleep Data JSON.';
            return;
        }

        outputEl.textContent = 'Generating personalized advice...';

        try {
            const advice = await generateHealthAdvice(sleepData, apiKey);
            if (typeof DOMPurify !== 'undefined') {
                 outputEl.innerHTML = DOMPurify.sanitize(advice.replace(/\n/g, '<br>'));
            } else {
                 outputEl.textContent = advice; // Fallback
            }
        } catch (e) {
            outputEl.textContent = `Error: ${e.message}`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateHealthAdvice };
}