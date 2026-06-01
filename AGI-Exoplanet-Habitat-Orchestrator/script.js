/**
 * AGI Exoplanet Habitat Orchestrator Logic
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

async function manageLifeSupport(telemetry) {
    const prompt = `You are the Life Support Sub-Agent. Analyze the telemetry. Keep output to 1 concise sentence summarizing oxygen/temp status and any action taken.`;
    return await callLLM(prompt, `Telemetry: ${JSON.stringify(telemetry.lifeSupport)}`);
}

async function allocateResources(telemetry) {
    const prompt = `You are the Resource Allocation Sub-Agent. Analyze power and water. Keep output to 1 concise sentence summarizing routing changes.`;
    return await callLLM(prompt, `Telemetry: ${JSON.stringify(telemetry.resources)}`);
}

async function monitorIntegrity(telemetry) {
    const prompt = `You are the Structural Integrity Sub-Agent. Analyze exterior hull stress. Keep output to 1 concise sentence summarizing status and deployment of repair bots if needed.`;
    return await callLLM(prompt, `Telemetry: ${JSON.stringify(telemetry.structural)}`);
}

async function synthesizeGovernorDecision(lifeSupportLog, resourceLog, structuralLog) {
    const prompt = `You are the AGI Governor of an Exoplanet Habitat. Review the reports from your sub-agents. Provide a 2-3 sentence holistic command decision prioritizing habitat survival and operational efficiency based on their reports.`;
    const userMsg = `
    Life Support: ${lifeSupportLog}
    Resources: ${resourceLog}
    Structural: ${structuralLog}
    `;
    return await callLLM(prompt, userMsg);
}

async function runOrchestration() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('orchestrate-btn');

    if (!getLLMConfig().key && getLLMConfig().provider !== 'ollama') {
        alert('Please enter an API key.');
        return;
    }

    const displays = {
        life: document.getElementById('life-display'),
        resource: document.getElementById('resource-display'),
        structure: document.getElementById('structure-display'),
        governor: document.getElementById('governor-display')
    };

    btn.disabled = true;
    for (let key in displays) {
        displays[key].textContent = 'Processing...';
    }

    const mockTelemetry = {
        lifeSupport: { oxygen: "98%", temp: "22C", scrubbers: "nominal" },
        resources: { solarPower: "85%", batteryReserve: "99%", waterRecycling: "active" },
        structural: { hullMicroFractures: "Sector 4", radiationShielding: "95%" }
    };

    try {
        // Run sub-agents in parallel
        const [lifeReport, resourceReport, structuralReport] = await Promise.all([
            manageLifeSupport(mockTelemetry),
            allocateResources(mockTelemetry),
            monitorIntegrity(mockTelemetry)
        ]);

        displays.life.innerHTML = DOMPurify.sanitize(lifeReport.replace(/\n/g, '<br>'));
        displays.resource.innerHTML = DOMPurify.sanitize(resourceReport.replace(/\n/g, '<br>'));
        displays.structure.innerHTML = DOMPurify.sanitize(structuralReport.replace(/\n/g, '<br>'));

        displays.governor.textContent = 'Synthesizing sub-agent reports...';

        // Governor synthesis
        const governorCommand = await synthesizeGovernorDecision(lifeReport, resourceReport, structuralReport);
        displays.governor.innerHTML = DOMPurify.sanitize(governorCommand.replace(/\n/g, '<br>'));

    } catch (error) {
        displays.governor.textContent = `Error: ${error.message}`;
    } finally {
        btn.disabled = false;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        if (btn) btn.addEventListener('click', runOrchestration);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { manageLifeSupport, allocateResources, monitorIntegrity, synthesizeGovernorDecision, callLLM };
}
