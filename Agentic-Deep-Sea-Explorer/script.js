/**
 * Agentic Deep Sea Explorer Logic
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

async function classifyAnomaly(sonarData) {
    const systemPrompt = `You are a marine biology AI. Analyze the sonar data describing an anomaly. Classify it (e.g., biological, geological, wreckage) and provide a 1-sentence reasoning.`;
    return await callLLM(systemPrompt, `Sonar Data: ${JSON.stringify(sonarData)}`);
}

async function plotTrajectory(navData) {
    const systemPrompt = `You are an AUV navigation AI. Based on the environment and anomaly location, plot a safe approach trajectory and suggest sensor/lighting adjustments (e.g. UV, floodlights, stealth mode). Keep it to 2 concise sentences.`;
    return await callLLM(systemPrompt, `Nav Data: ${JSON.stringify(navData)}`);
}

function logMessage(msg, type = '') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('auv-log');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${msg}`;
    container.insertBefore(entry, container.firstChild);
}

async function runDive() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('dive-btn');
    const sonarDisplay = document.getElementById('sonar-display');
    const navDisplay = document.getElementById('nav-display');

    if (!getLLMConfig().key && getLLMConfig().provider !== 'ollama') {
        logMessage('Please enter an API key.', 'error');
        return;
    }

    btn.disabled = true;
    sonarDisplay.textContent = 'Pinging sonar...';
    navDisplay.textContent = 'Calculating trajectory...';

    try {
        logMessage('Initiating deep dive protocol...');
        const sonarMock = {
            shape: "tubular cluster",
            movement: "undulating",
            depth: "3500m",
            tempGradient: "+15C deviation"
        };

        const classification = await classifyAnomaly(sonarMock);
        sonarDisplay.innerHTML = DOMPurify.sanitize(classification.replace(/\n/g, '<br>'));
        logMessage('Anomaly classified.', 'success');

        const navMock = {
            currentDepth: "3450m",
            targetDepth: "3500m",
            hazards: "Hydrothermal vents nearby, low visibility"
        };

        const trajectory = await plotTrajectory(navMock);
        navDisplay.innerHTML = DOMPurify.sanitize(trajectory.replace(/\n/g, '<br>'));
        logMessage('Trajectory and sensors adjusted. Proceeding to target.', 'success');

    } catch (error) {
        logMessage(error.message, 'error');
        sonarDisplay.textContent = 'Error occurred.';
        navDisplay.textContent = 'Error occurred.';
    } finally {
        btn.disabled = false;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('dive-btn');
        if (btn) btn.addEventListener('click', runDive);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { classifyAnomaly, plotTrajectory, callLLM };
}
