/**
 * Autonomous SDR Agent loop.
 */
async function runSdrAgent(config, prospectContext, productValue, logger) {
    logger("Agent initialized. Goal: Draft personalized outreach.");

    // Step 1: Research/Information Extraction
    logger("Action: Calling LLM to extract prospect pain points and recent events.");
    const parsePrompt = `
    Prospect Context: ${prospectContext}

    Extract key recent events and potential pain points for this prospect. Format as JSON.
    {"events": ["event1"], "pain_points": ["pain1"]}
    `;

    let extractedDataStr = "";
    try {
        if (config.provider === 'openai') {
            extractedDataStr = await fetchOpenAI(config.key, config.model, "You are a research bot. Respond only with JSON.", parsePrompt);
        } else if (config.provider === 'anthropic') {
            extractedDataStr = await fetchAnthropic(config.key, config.model, "You are a research bot. Respond only with JSON.", parsePrompt);
        } else {
            extractedDataStr = await fetchOllama(config.key, config.model, "You are a research bot. Respond only with JSON.", parsePrompt);
        }
    } catch (e) {
        logger(`Error researching: ${e.message}`);
        throw e;
    }

    logger("Observation: Extracted prospect research data.");

    // Step 2: Synthesis and Drafting
    logger("Action: Drafting highly personalized email using extracted data and product value proposition.");
    const draftPrompt = `
    Prospect Research: ${extractedDataStr}
    Our Product Value: ${productValue}

    Write a highly personalized, concise cold email (under 150 words). Start by referencing their recent events, relate it to a potential pain point, and pitch our product as the solution. Use a compelling subject line.
    `;

    let finalDraft = "";
    try {
        if (config.provider === 'openai') {
            finalDraft = await fetchOpenAI(config.key, config.model, "You are a top-performing Sales Development Rep.", draftPrompt);
        } else if (config.provider === 'anthropic') {
            finalDraft = await fetchAnthropic(config.key, config.model, "You are a top-performing Sales Development Rep.", draftPrompt);
        } else {
            finalDraft = await fetchOllama(config.key, config.model, "You are a top-performing Sales Development Rep.", draftPrompt);
        }
    } catch (e) {
        logger(`Error drafting: ${e.message}`);
        throw e;
    }

    logger("Goal Accomplished: Draft complete.");
    return finalDraft;
}

if (typeof document !== 'undefined') {
    document.getElementById('draft-btn').addEventListener('click', async () => {
        const provider = document.getElementById('provider').value;
        const key = document.getElementById('apiKey').value;
        const model = document.getElementById('model').value;
        const prospectContext = document.getElementById('prospectContext').value;
        const productValue = document.getElementById('productValue').value;
        const logBox = document.getElementById('agent-log');
        const resultBox = document.getElementById('result');

        logBox.innerHTML = '';
        resultBox.innerHTML = 'Drafting...';

        const logger = (msg) => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logBox.appendChild(div);
            logBox.scrollTop = logBox.scrollHeight;
        };

        try {
            const result = await runSdrAgent({ provider, key, model }, prospectContext, productValue, logger);
            resultBox.innerHTML = DOMPurify.sanitize(marked.parse(result));
        } catch (e) {
            resultBox.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runSdrAgent };
}
