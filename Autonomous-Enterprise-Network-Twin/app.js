// --- DOM Elements ---
const metricTraffic = document.getElementById('metric-traffic');
const metricLatency = document.getElementById('metric-latency');
const metricCpu = document.getElementById('metric-cpu');
const metricNodes = document.getElementById('metric-nodes');
const metricAnomalies = document.getElementById('metric-anomalies');
const metricAuth = document.getElementById('metric-auth');

const dynamicNodesContainer = document.getElementById('dynamic-nodes-container');
const sandboxOverlay = document.getElementById('sandbox-overlay');
const brainState = document.getElementById('brain-state');
const executionLog = document.getElementById('execution-log');

const byodModal = document.getElementById('byod-modal');
const jsonInput = document.getElementById('json-input');
const jsonError = document.getElementById('json-error');

const llmModal = document.getElementById('llm-modal');
const llmProviderSel = document.getElementById('llm-provider');
const apiKeyGroup = document.getElementById('api-key-group');
const ollamaUrlGroup = document.getElementById('ollama-url-group');
const apiKeyInput = document.getElementById('api-key');
const ollamaUrlInput = document.getElementById('ollama-url');

const dvrScrubber = document.getElementById('dvr-scrubber');
const dvrStatus = document.getElementById('dvr-status');
const twinPanel = document.querySelector('.twin-panel');
const strategySelector = document.getElementById('strategy-selector');

// --- State & Config ---
let isSimulating = false;
let currentState = null;
let telemetryInterval = null;

// Time Travel DVR
const MAX_HISTORY = 60;
let stateHistory = [];
let isHistoricalView = false;

let llmConfig = { provider: 'simulation', key: '', url: 'http://localhost:11434' };

const defaultState = {
    telecom: { traffic: "Normal", latency: "15ms", numericTraffic: 45, numericCpu: 32 },
    cloud: { cpu: "32%", nodes: 8 },
    cyber: { anomalies: "None", authFails: "Low" },
    nodes: [
        { id: "core", name: "Core Router", status: "ok" },
        { id: "app1", name: "App Cluster Alpha", status: "ok" },
        { id: "db1", name: "DB Cluster Beta", status: "ok" },
        { id: "edge", name: "Edge Gateway", status: "ok" }
    ],
    anomalyDetected: false,
    anomalyMessage: "",
    timestamp: Date.now()
};

// --- Charts Setup ---
const tCtx = document.getElementById('telecomChart').getContext('2d');
const cCtx = document.getElementById('cloudChart').getContext('2d');
let tData = Array(15).fill(45);
let cData = Array(15).fill(32);
let tChart, cChart;

function initCharts() {
    const commonOpts = {
        responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
        scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } },
        plugins: { legend: { display: false } }
    };
    tChart = new Chart(tCtx, {
        type: 'line',
        data: { labels: Array(15).fill(''), datasets: [{ data: tData, borderColor: '#3b82f6', borderWidth: 2, tension: 0.3 }] },
        options: commonOpts
    });
    cChart = new Chart(cCtx, {
        type: 'line',
        data: { labels: Array(15).fill(''), datasets: [{ data: cData, borderColor: '#8b5cf6', borderWidth: 2, tension: 0.3 }] },
        options: commonOpts
    });
}

function updateTick() {
    if(!currentState || isHistoricalView) return; // Freeze if in historical mode

    // Add noise to base value
    let targetT = currentState.telecom.numericTraffic;
    let targetC = currentState.telecom.numericCpu;

    let nextT = targetT + (Math.random() * 10 - 5);
    let nextC = targetC + (Math.random() * 6 - 3);

    tData.push(Math.max(0, Math.min(100, nextT))); tData.shift();
    cData.push(Math.max(0, Math.min(100, nextC))); cData.shift();

    tChart.update(); cChart.update();

    // Record History
    recordStateHistory();
}

function recordStateHistory() {
    // Deep clone current state and append timestamp
    let snap = JSON.parse(JSON.stringify(currentState));
    snap.timestamp = Date.now();

    stateHistory.push(snap);
    if(stateHistory.length > MAX_HISTORY) stateHistory.shift();

    // Keep scrubber at max if live
    dvrScrubber.max = stateHistory.length - 1;
    if(!isHistoricalView) {
        dvrScrubber.value = stateHistory.length - 1;
    }
}

// --- Init ---
function init() {
    // BYOD
    document.getElementById('btn-custom-data').addEventListener('click', () => { byodModal.classList.remove('hidden'); jsonError.classList.add('hidden'); });
    document.getElementById('close-byod-modal').addEventListener('click', () => byodModal.classList.add('hidden'));
    document.getElementById('btn-load-json').addEventListener('click', handleCustomData);

    // LLM Settings
    document.getElementById('btn-llm-settings').addEventListener('click', () => llmModal.classList.remove('hidden'));
    document.getElementById('close-llm-modal').addEventListener('click', () => llmModal.classList.add('hidden'));

    llmProviderSel.addEventListener('change', (e) => {
        const val = e.target.value;
        apiKeyGroup.classList.toggle('hidden', val === 'simulation' || val === 'ollama');
        ollamaUrlGroup.classList.toggle('hidden', val !== 'ollama');
    });

    document.getElementById('btn-save-llm').addEventListener('click', () => {
        llmConfig.provider = llmProviderSel.value;
        llmConfig.key = apiKeyInput.value;
        llmConfig.url = ollamaUrlInput.value;
        llmModal.classList.add('hidden');
        logMsg(`SYSTEM: AGI Provider updated to ${llmConfig.provider.toUpperCase()}`, "system");
    });

    // Scenarios
    document.getElementById('scenario-congestion').addEventListener('click', () => triggerScenario('congestion'));
    document.getElementById('scenario-attack').addEventListener('click', () => triggerScenario('attack'));
    document.getElementById('scenario-reset').addEventListener('click', resetState);

    // DVR Events
    dvrScrubber.addEventListener('input', handleDvrScrub);

    initCharts();
    applyState(defaultState);

    // Prefill some history
    for(let i=0; i<10; i++) recordStateHistory();

    telemetryInterval = setInterval(updateTick, 1000);
}

function handleDvrScrub(e) {
    const idx = parseInt(e.target.value);
    const maxIdx = stateHistory.length - 1;

    if(idx < maxIdx) {
        isHistoricalView = true;
        dvrStatus.innerText = `PAST: -${maxIdx - idx}s`;
        dvrStatus.className = 'dvr-historical';
        twinPanel.classList.add('historical-mode');
        renderStateUI(stateHistory[idx]); // Render without triggering AGI
    } else {
        isHistoricalView = false;
        dvrStatus.innerText = 'LIVE';
        dvrStatus.className = 'dvr-live';
        twinPanel.classList.remove('historical-mode');
        renderStateUI(currentState);
    }
}

function logMsg(msg, type) {
    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    executionLog.appendChild(div);
    executionLog.scrollTop = executionLog.scrollHeight;
}

function setBrainState(stateStr, className) {
    brainState.innerText = stateStr;
    brainState.className = className;
}

// --- Rendering ---
function applyState(state) {
    currentState = JSON.parse(JSON.stringify(state));
    renderStateUI(currentState);

    // Only process anomaly if we are LIVE
    if (currentState.anomalyDetected && !isSimulating && !isHistoricalView) {
        processAnomaly(currentState);
    }
}

function renderStateUI(state) {
    metricTraffic.innerText = state.telecom.traffic;
    metricTraffic.className = `val ${getValClass(state.telecom.traffic)}`;
    metricLatency.innerText = state.telecom.latency;
    metricLatency.className = `val ${getValClass(state.telecom.latency)}`;
    metricCpu.innerText = state.cloud.cpu;
    metricCpu.className = `val ${getValClass(state.cloud.cpu)}`;
    metricNodes.innerText = state.cloud.nodes;
    metricAnomalies.innerText = state.cyber.anomalies;
    metricAnomalies.className = `val ${getValClass(state.cyber.anomalies)}`;
    metricAuth.innerText = state.cyber.authFails;
    metricAuth.className = `val ${getValClass(state.cyber.authFails)}`;

    dynamicNodesContainer.innerHTML = '';
    state.nodes.forEach(node => {
        const div = document.createElement('div');
        div.className = `dyn-node status-${node.status}`;
        div.id = `node-${node.id}`;

        const spanId = document.createElement("span");
        spanId.className="dyn-node-id";
        spanId.textContent = node.id.toUpperCase();

        const spanName = document.createElement("span");
        spanName.textContent = node.name;

        div.appendChild(spanId);
        div.appendChild(spanName);
        dynamicNodesContainer.appendChild(div);
    });
}

function getValClass(val) {
    val = String(val).toLowerCase();
    if (val.includes('high') || val.includes('spike') || val.includes('critical') || val.includes('ddos') || (parseInt(val) > 80)) return 'danger';
    if (val.includes('warn') || (parseInt(val) > 60)) return 'warn';
    return 'ok';
}

function handleCustomData() {
    try {
        const raw = jsonInput.value;
        const parsed = JSON.parse(raw);
        if(!parsed.telecom || !parsed.cloud || !parsed.cyber || !parsed.nodes) throw new Error();
        // default numerics for charts if not provided
        if(!parsed.telecom.numericTraffic) parsed.telecom.numericTraffic = parsed.anomalyDetected ? 95 : 45;
        if(!parsed.telecom.numericCpu) parsed.telecom.numericCpu = parsed.anomalyDetected ? 90 : 32;

        byodModal.classList.add('hidden');
        jsonError.classList.add('hidden');
        logMsg("INGESTION: Custom BYOD JSON payload received.", "detect");

        // Jump to live when loading data
        isHistoricalView = false;
        dvrStatus.innerText = 'LIVE';
        dvrStatus.className = 'dvr-live';
        twinPanel.classList.remove('historical-mode');

        applyState(parsed);
    } catch(e) {
        jsonError.classList.remove('hidden');
        jsonError.innerText = "Invalid JSON structure.";
    }
}

// --- LLM API Logic ---
async function fetchLLMSimulation(state) {
    const strategy = strategySelector.value;
    const prompt = `You are the AGI Brain of an Enterprise Network Twin.
An anomaly was detected: ${state.anomalyMessage}
Current State: Telecom Traffic=${state.telecom.traffic}, Cloud CPU=${state.cloud.cpu}, Cyber=${state.cyber.anomalies}.
Optimization Priority: ${strategy.toUpperCase()} (Crucial: Select the scenario that best aligns with this priority).

Provide 3 simulation scenarios (A, B, C) with brief Impact statements.
Format EXACTLY as:
Scenario A: [Action] -> Impact: [Result]
Scenario B: [Action] -> Impact: [Result]
Scenario C: [Action] -> Impact: [Result]
OPTIMAL: [A, B, or C]
EXECUTION: [Brief instruction for remediation]`;

    if(llmConfig.provider === 'openai' && llmConfig.key) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${llmConfig.key}`},
            body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{role: 'user', content: prompt}] })
        });
        const data = await res.json();
        return parseLLMResponse(data.choices[0].message.content);
    }
    else if(llmConfig.provider === 'anthropic' && llmConfig.key) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-api-key': llmConfig.key, 'anthropic-version': '2023-06-01'},
            body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 500, messages: [{role: 'user', content: prompt}] })
        });
        const data = await res.json();
        return parseLLMResponse(data.content[0].text);
    }
    else if(llmConfig.provider === 'ollama') {
        const res = await fetch(`${llmConfig.url}/api/generate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ model: 'llama3', prompt: prompt, stream: false })
        });
        const data = await res.json();
        return parseLLMResponse(data.response);
    }

    // Fallback Mock Logic reflecting Strategy
    let isAttack = state.cyber.anomalies.toLowerCase().includes('ddos') || state.cyber.anomalies.toLowerCase() !== 'none';
    let wIdx = 1;
    let sOpts = [];

    if(isAttack) {
        sOpts = [
            "Scenario A: Scale Infra -> Impact: Cost explosion, Attack persists",
            "Scenario B: Block Malicious IPs -> Impact: Blocks attack cleanly",
            "Scenario C: Disconnect all Edge nodes -> Impact: High downtime, max security"
        ];
        wIdx = (strategy === 'security') ? 2 : 1;
    } else {
        sOpts = [
            "Scenario A: Throttle Users -> Impact: High friction, zero cost",
            "Scenario B: Auto-Scale App Nodes -> Impact: Solves load, moderate cost",
            "Scenario C: Migrate to Premium Tier -> Impact: Max performance, max cost"
        ];
        if(strategy === 'cost') wIdx = 0;
        else if(strategy === 'balanced') wIdx = 1;
        else wIdx = 2; // Security/Performance
    }

    return {
        scenarios: sOpts,
        winnerIndex: wIdx,
        execution: "Injecting remediation rules via AENT orchestrator API."
    };
}

function parseLLMResponse(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const scenarios = lines.filter(l => l.startsWith('Scenario')).slice(0,3);
    const optLine = lines.find(l => l.startsWith('OPTIMAL:'));
    const execLine = lines.find(l => l.startsWith('EXECUTION:'));

    let winnerIndex = 1;
    if(optLine) {
        if(optLine.includes('A')) winnerIndex = 0;
        else if(optLine.includes('C')) winnerIndex = 2;
    }

    // Fallbacks if parsing fails
    while(scenarios.length < 3) scenarios.push(`Scenario ${String.fromCharCode(65+scenarios.length)}: Evaluating... -> Impact: Unknown`);

    return { scenarios, winnerIndex, execution: execLine ? execLine.replace('EXECUTION:', '').trim() : "Executing optimal path." };
}

// --- AGI Loop ---
async function processAnomaly(state) {
    isSimulating = true;
    logMsg(`AGI TRIGGER: Anomaly flagged. Msg: "${state.anomalyMessage || 'Unknown'}"`, "detect");
    logMsg(`STRATEGY TUNING: Applying user priority [${strategySelector.value.toUpperCase()}] to simulation weighting.`, "system");

    setBrainState("STATUS: SIMULATING", "state-thinking");
    sandboxOverlay.classList.remove('hidden');
    logMsg(`DIGITAL TWIN: Spawning sandbox. Querying ${llmConfig.provider.toUpperCase()} model for scenarios...`, "sim");

    // Reset overlay UI
    for(let i=0; i<3; i++) {
        const el = document.getElementById(`sim-opt-${i+1}`);
        el.innerText = `Scenario ${String.fromCharCode(65+i)}: Evaluating...`;
        el.className = 'sim-option';
    }

    let llmResult;
    try {
        llmResult = await fetchLLMSimulation(state);
    } catch(e) {
        logMsg(`SYSTEM ERROR: LLM connection failed. Falling back to simulation logic. (${e.message})`, "system");
        llmConfig.provider = 'simulation';
        llmResult = await fetchLLMSimulation(state);
    }

    // Render LLM Results
    for(let i=0; i<3; i++) {
        const el = document.getElementById(`sim-opt-${i+1}`);
        el.innerText = llmResult.scenarios[i];
        el.classList.add('evaluating');
        await wait(500);
        el.classList.remove('evaluating');
    }

    const winnerEl = document.getElementById(`sim-opt-${llmResult.winnerIndex+1}`);
    winnerEl.classList.add('selected');
    logMsg(`AGI BRAIN: Optimal path selected aligning with business strategy.`, "sim");
    await wait(2000);

    sandboxOverlay.classList.add('hidden');

    setBrainState("STATUS: EXECUTING", "state-executing");
    logMsg(`EXECUTION: ${llmResult.execution}`, "exec");

    // Remediate state based on type of anomaly
    if(state.cyber.anomalies !== "None" && state.cyber.anomalies !== "") {
        state.cyber.anomalies = "None";
        state.telecom.traffic = "Normal";
        state.telecom.numericTraffic = 45;
        state.nodes.forEach(n => { if(n.status === 'attacked') n.status = 'isolated'; });
    } else {
        state.cloud.cpu = "45%";
        state.telecom.latency = "20ms";
        state.telecom.numericCpu = 45;
        state.cloud.nodes += 4;
        state.nodes.forEach(n => { if(n.status === 'stressed') n.status = 'scaled'; });
    }

    await wait(1500);

    state.anomalyDetected = false;
    applyState(state);

    logMsg("LEARNING: Execution applied to live infra. Real-time metrics normalizing.", "learn");
    setBrainState("STATUS: OBSERVING", "state-idle");
    isSimulating = false;
}

// --- Demo Triggers ---
function triggerScenario(type) {
    if (isSimulating || isHistoricalView) return;

    let newState = JSON.parse(JSON.stringify(defaultState));
    newState.anomalyDetected = true;

    if (type === 'congestion') {
        newState.telecom.traffic = "High (Spike)";
        newState.telecom.numericTraffic = 95;
        newState.telecom.latency = "85ms";
        newState.cloud.cpu = "92%";
        newState.telecom.numericCpu = 92;
        newState.nodes[1].status = "stressed"; // app1
        newState.anomalyMessage = "Volumetric spike degrading App Cluster Alpha CPU.";
    } else if (type === 'attack') {
        newState.cyber.anomalies = "DDoS Signature";
        newState.telecom.traffic = "CRITICAL";
        newState.telecom.numericTraffic = 100;
        newState.cyber.authFails = "Spike";
        newState.nodes[0].status = "attacked"; // core
        newState.anomalyMessage = "DDoS signature matched targeting Core Router.";
    }

    applyState(newState);
}

function resetState() {
    if(isSimulating) return;
    isHistoricalView = false;
    dvrStatus.innerText = 'LIVE';
    dvrStatus.className = 'dvr-live';
    twinPanel.classList.remove('historical-mode');

    executionLog.innerHTML = '<div class="log-entry system">System Online. AENT unified model synchronized.</div>';
    tData = Array(15).fill(45);
    cData = Array(15).fill(32);
    applyState(defaultState);
}

const wait = (ms) => new Promise(res => setTimeout(res, ms));

init();
