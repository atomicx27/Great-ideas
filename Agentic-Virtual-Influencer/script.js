async function generatePostContent(topic, apiKey) {
    if (!apiKey) throw new Error("API Key is required");

    const systemPrompt = "You are a trendy virtual influencer. Generate a highly engaging social media caption about the given topic. Include 3 relevant emojis and 3 hashtags. Keep it under 280 characters.";
    const userMessage = `Topic: ${topic}`;

    // Utilizing shared fetchOpenAI from llm-api.js
    const response = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage, { temperature: 0.9 });
    return response;
}

if (typeof document !== 'undefined') {
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value.trim();
        const topic = document.getElementById('topic').value.trim();
        const outputEl = document.getElementById('output');

        if (!apiKey || !topic) {
            outputEl.textContent = 'Please enter an API Key and a Topic.';
            return;
        }

        outputEl.textContent = 'Generating engaging content...';

        try {
            const content = await generatePostContent(topic, apiKey);
            if (typeof DOMPurify !== 'undefined') {
                 outputEl.innerHTML = DOMPurify.sanitize(content.replace(/\n/g, '<br>'));
            } else {
                 outputEl.textContent = content; // Fallback
            }
        } catch (e) {
            outputEl.textContent = `Error: ${e.message}`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generatePostContent };
}