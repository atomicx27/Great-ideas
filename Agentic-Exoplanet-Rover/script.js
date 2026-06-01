/**
 * Agentic Exoplanet Rover Logic
 */

let apiConfig = { provider: 'openai', key: '' };

function getLLMConfig() {
    if (typeof document === 'undefined') return apiConfig;
    return {
        provider: document.getElementById('provider-select').value,
        key: document.getElementById('api-key-input').value
    };
}

async function callLLM(systemPrompt, userMessage) {
    const config = getLLMConfig();
    const model = config.provider === 'openai' ? 'gpt-3.5-turbo' :
                  config.provider === 'anthropic' ? 'claude-3-haiku-20240307' : 'llama3';

    try {
        if (config.provider === 'openai') {
            return await fetchOpenAI(config.key, model, systemPrompt, userMessage);
        } else if (config.provider === 'anthropic') {
            return await fetchAnthropic(config.key, model, systemPrompt, userMessage);
        } else if (config.provider === 'ollama') {
            return await fetchOllama(config.key || 'http://localhost:11434', model, systemPrompt, userMessage);
        }
    } catch (error) {
        throw new Error(`LLM Error: ${error.message}`);
    }
}

async function analyzeTerrain(terrainData) {
    const systemPrompt = `You are an autonomous rover navigation AI. Analyze the terrain data provided. Choose the safest route to target, avoiding hazards. Output your plan clearly in 1-2 sentences.`;
    return await callLLM(systemPrompt, `Terrain Data: ${JSON.stringify(terrainData)}`);
}

async function evaluateSample(sampleData) {
    const systemPrompt = `You are a planetary geologist AI on a rover. Evaluate the sample composition. Determine if it has high scientific value (e.g. organics, water ice, rare isotopes). Output 1-2 sentences evaluating the sample.`;
    return await callLLM(systemPrompt, `Sample Data: ${JSON.stringify(sampleData)}`);
}

function logMessage(msg, type = '') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('rover-log');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${msg}`;
    container.insertBefore(entry, container.firstChild);
}

async function runSurvey() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('survey-btn');
    const navDisplay = document.getElementById('nav-display');
    const sampleDisplay = document.getElementById('sample-display');

    if (!getLLMConfig().key && getLLMConfig().provider !== 'ollama') {
        logMessage('Please enter an API key.', 'error');
        return;
    }

    btn.disabled = true;
    navDisplay.textContent = 'Analyzing terrain...';
    sampleDisplay.textContent = 'Awaiting sample collection...';

    try {
        logMessage('Initiating terrain survey...');
        const terrain = {
            targetDistance: "120m",
            obstacles: ["Crater at 50m", "Loose regolith field at 80m"],
            inclination: "5 degrees"
        };

        const navPlan = await analyzeTerrain(terrain);
        navDisplay.innerHTML = DOMPurify.sanitize(navPlan.replace(/\n/g, '<br>'));
        logMessage('Navigation plan formulated.', 'success');

        sampleDisplay.textContent = 'Evaluating collected sample...';
        logMessage('Deploying spectrometer to evaluate sample at current site...');

        const sample = {
            spectrometry: ["silicates 60%", "hydrated minerals 30%", "unknown trace organics 10%"],
            radiationLevel: "low"
        };

        const evalResult = await evaluateSample(sample);
        sampleDisplay.innerHTML = DOMPurify.sanitize(evalResult.replace(/\n/g, '<br>'));
        logMessage('Sample evaluation complete.', 'success');

    } catch (error) {
        logMessage(error.message, 'error');
        navDisplay.textContent = 'Error occurred.';
        sampleDisplay.textContent = 'Error occurred.';
    } finally {
        btn.disabled = false;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('survey-btn');
        if (btn) btn.addEventListener('click', runSurvey);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeTerrain, evaluateSample, callLLM };
}
