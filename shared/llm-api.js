/**
 * Shared LLM API utility for OpenAI, Anthropic, and Ollama.
 */

async function fetchOpenAI(apiKey, model, systemPrompt, userMessage, options = {}) {
    const temperature = options.temperature !== undefined ? options.temperature : 0.7;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'OpenAI API Error');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

async function fetchAnthropic(apiKey, model, systemPrompt, userMessage, options = {}) {
    const max_tokens = options.max_tokens || 4096;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: max_tokens,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userMessage }
            ]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Anthropic API Error');
    }

    const data = await response.json();
    return data.content[0].text.trim();
}

async function fetchOllama(baseUrl, model, systemPrompt, userMessage, options = {}) {
    const url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const response = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error('Ollama API Error. Ensure Ollama is running and CORS is enabled.');
    }

    const data = await response.json();
    return data.message.content.trim();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchOpenAI, fetchAnthropic, fetchOllama };
}
