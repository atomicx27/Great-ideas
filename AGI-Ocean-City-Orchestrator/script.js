/**
 * AGI Ocean City Orchestrator Logic
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
    const model = config.provider === 'openai' ? 'gpt-4o' :
                  config.provider === 'anthropic' ? 'claude-3-opus-20240229' : 'llama3';

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

async function manageBallast(weatherData) {
    const prompt = `You are the Structural Ballasting Agent for a floating city. Analyze incoming weather. Output 1 sentence describing how you are adjusting buoyancy/ballast to maintain stability.`;
    return await callLLM(prompt, `Weather: ${JSON.stringify(weatherData)}`);
}

async function scaleDesalination(powerData) {
    const prompt = `You are the Desalination Control Agent. Analyze current city power availability during a storm. Output 1 sentence deciding whether to scale up/down freshwater production.`;
    return await callLLM(prompt, `Power: ${JSON.stringify(powerData)}`);
}

async function routeTraffic(maritimeData) {
    const prompt = `You are the Oceanic Traffic Agent. Analyze approaching vessels during a storm. Output 1 sentence on whether to open docks, reroute, or lock down.`;
    return await callLLM(prompt, `Traffic: ${JSON.stringify(maritimeData)}`);
}

async function synthesizeGovernorDecision(reports) {
    const prompt = `You are the Prime AGI Governor of Ocean City. Review the sub-agent reports during a Category 5 Typhoon simulation. Provide a 2-3 sentence holistic command decision that ensures citizen safety, structural survival, and power management.`;
    const userMsg = `Reports: \nBallast: ${reports.ballast}\nDesalination: ${reports.desal}\nTraffic: ${reports.traffic}`;
    return await callLLM(prompt, userMsg);
}

async function simulateTyphoon() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('storm-btn');

    if (!getLLMConfig().key && getLLMConfig().provider !== 'ollama') {
        alert('Please enter an API key.');
        return;
    }

    const displays = {
        ballast: document.getElementById('ballast-display'),
        desal: document.getElementById('desal-display'),
        traffic: document.getElementById('traffic-display'),
        governor: document.getElementById('governor-display')
    };

    btn.disabled = true;
    for (let key in displays) {
        displays[key].textContent = 'Processing...';
    }

    const scenario = {
        weather: { windSpeed: "220 km/h", waveHeight: "15m", status: "Category 5 Typhoon" },
        power: { gridCapacity: "70%", priority: "Structural Integrity and Shields" },
        maritime: { approaching: ["Supply Barge A", "Evac Ferry B"], dockStatus: "Exposed" }
    };

    try {
        const [ballastReport, desalReport, trafficReport] = await Promise.all([
            manageBallast(scenario.weather),
            scaleDesalination(scenario.power),
            routeTraffic(scenario.maritime)
        ]);

        displays.ballast.innerHTML = DOMPurify.sanitize(ballastReport.replace(/\n/g, '<br>'));
        displays.desal.innerHTML = DOMPurify.sanitize(desalReport.replace(/\n/g, '<br>'));
        displays.traffic.innerHTML = DOMPurify.sanitize(trafficReport.replace(/\n/g, '<br>'));

        displays.governor.textContent = 'Synthesizing prime directive...';

        const reports = { ballast: ballastReport, desal: desalReport, traffic: trafficReport };
        const governorCommand = await synthesizeGovernorDecision(reports);

        displays.governor.innerHTML = DOMPurify.sanitize(governorCommand.replace(/\n/g, '<br>'));

    } catch (error) {
        displays.governor.textContent = `Error: ${error.message}`;
    } finally {
        btn.disabled = false;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('storm-btn');
        if (btn) btn.addEventListener('click', simulateTyphoon);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { manageBallast, scaleDesalination, routeTraffic, synthesizeGovernorDecision, callLLM };
}
