// --- DOM Elements ---
const metricTraffic = document.getElementById('metric-traffic');
const metricLatency = document.getElementById('metric-latency');
const metricCpu = document.getElementById('metric-cpu');
const metricNodes = document.getElementById('metric-nodes');
const metricAnomalies = document.getElementById('metric-anomalies');
const metricAuth = document.getElementById('metric-auth');

const dynamicNodesContainer = document.getElementById('dynamic-nodes-container');

const sandboxOverlay = document.getElementById('sandbox-overlay');
const simOpt1 = document.getElementById('sim-opt-1');
const simOpt2 = document.getElementById('sim-opt-2');
const simOpt3 = document.getElementById('sim-opt-3');

const brainState = document.getElementById('brain-state');
const executionLog = document.getElementById('execution-log');

const byodModal = document.getElementById('byod-modal');
const jsonInput = document.getElementById('json-input');
const jsonError = document.getElementById('json-error');

// --- State ---
let isSimulating = false;
let currentState = null;

// Default initial state
const defaultState = {
    telecom: { traffic: "Normal", latency: "15ms" },
    cloud: { cpu: "32%", nodes: 8 },
    cyber: { anomalies: "None", authFails: "Low" },
    nodes: [
        { id: "core", name: "Core Router", status: "ok" },
        { id: "app1", name: "App Cluster Alpha", status: "ok" },
        { id: "db1", name: "DB Cluster Beta", status: "ok" },
        { id: "edge", name: "Edge Gateway", status: "ok" }
    ],
    anomalyDetected: false
};

// --- Init ---
function init() {
    document.getElementById('btn-custom-data').addEventListener('click', () => { byodModal.classList.remove('hidden'); jsonError.classList.add('hidden'); });
    document.querySelector('.close-btn').addEventListener('click', () => byodModal.classList.add('hidden'));

    document.getElementById('btn-load-json').addEventListener('click', handleCustomData);

    document.getElementById('scenario-congestion').addEventListener('click', () => triggerScenario('congestion'));
    document.getElementById('scenario-attack').addEventListener('click', () => triggerScenario('attack'));
    document.getElementById('scenario-reset').addEventListener('click', resetState);

    // Initial render
    applyState(defaultState);
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

// --- Dynamic Rendering ---
function applyState(state) {
    currentState = JSON.parse(JSON.stringify(state)); // deep copy

    // Update Metrics
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

    // Render Nodes
    dynamicNodesContainer.innerHTML = '';
    state.nodes.forEach(node => {
        const div = document.createElement('div');
        div.className = `dyn-node status-${node.status}`;
        div.id = `node-${node.id}`;
        const spanId = document.createElement("span"); spanId.className="dyn-node-id"; spanId.textContent = node.id.toUpperCase(); const spanName = document.createElement("span"); spanName.textContent = node.name; div.appendChild(spanId); div.appendChild(spanName);
        dynamicNodesContainer.appendChild(div);
    });

    if (state.anomalyDetected && !isSimulating) {
        processAnomaly(state);
    }
}

function getValClass(val) {
    val = String(val).toLowerCase();
    if (val.includes('high') || val.includes('spike') || val.includes('critical') || val.includes('ddos') || (parseInt(val) > 80)) return 'danger';
    if (val.includes('warn') || (parseInt(val) > 60)) return 'warn';
    return 'ok';
}

// --- Custom Data Handling ---
function handleCustomData() {
    try {
        const raw = jsonInput.value;
        const parsed = JSON.parse(raw);

        // Basic validation
        if(!parsed.telecom || !parsed.cloud || !parsed.cyber || !parsed.nodes) {
            throw new Error("Missing required fields");
        }

        byodModal.classList.add('hidden');
        jsonError.classList.add('hidden');

        logMsg("INGESTION: Custom BYOD JSON payload received and validated.", "detect");
        applyState(parsed);

    } catch(e) {
        jsonError.classList.remove('hidden');
        jsonError.innerText = "Invalid JSON structure. Ensure all keys exist.";
    }
}

// --- AGI Loop ---
async function processAnomaly(state) {
    isSimulating = true;
    logMsg(`AGI TRIGGER: Anomaly flagged by ingestion layer. Msg: "${state.anomalyMessage || 'Unknown'}"`, "detect");

    let opts = [];
    let winnerIndex = 0;

    if(state.cyber.anomalies.toLowerCase().includes('ddos') || state.cyber.anomalies.toLowerCase() !== 'none') {
        opts = [
            { text: "Scenario A: Scale Infra -> Impact: High Cost, Attack continues.", ok: false },
            { text: "Scenario B: Null-Route at Edge -> Impact: Blocks attack, secures core.", ok: true },
            { text: "Scenario C: Reboot Nodes -> Impact: Downtime, ineffective.", ok: false }
        ];
        winnerIndex = 1;
    } else {
        // Assume congestion/scaling issue
        opts = [
            { text: "Scenario A: Throttle Users -> Impact: High friction.", ok: false },
            { text: "Scenario B: Auto-Scale App Nodes -> Impact: Solves load.", ok: true },
            { text: "Scenario C: Reroute Traffic -> Impact: Shifts bottleneck.", ok: false }
        ];
        winnerIndex = 1;
    }

    await runSimulationSequence(opts, winnerIndex);

    setBrainState("STATUS: EXECUTING", "state-executing");

    // Execute remediation based on scenario
    if(winnerIndex === 1 && opts[1].text.includes('Null-Route')) {
        logMsg("EXECUTION: Injecting BGP null-route rules at edge gateway.", "exec");
        state.cyber.anomalies = "None";
        state.telecom.traffic = "Normal";
        state.nodes.forEach(n => { if(n.status === 'attacked') n.status = 'isolated'; });
    } else {
        logMsg("EXECUTION: Provisioning additional container nodes.", "exec");
        state.cloud.cpu = "45%";
        state.telecom.latency = "20ms";
        state.cloud.nodes += 4;
        state.nodes.forEach(n => { if(n.status === 'stressed') n.status = 'scaled'; });
    }

    await wait(1500);

    state.anomalyDetected = false;
    applyState(state);

    logMsg("LEARNING: Execution successful. Infrastructure stabilized. Neural weights updated.", "learn");
    setBrainState("STATUS: OBSERVING", "state-idle");
    isSimulating = false;
}

// --- Demo Scenarios ---
async function triggerScenario(type) {
    if (isSimulating) return;

    let newState = JSON.parse(JSON.stringify(defaultState));
    newState.anomalyDetected = true;

    if (type === 'congestion') {
        newState.telecom.traffic = "High (Spike)";
        newState.telecom.latency = "85ms";
        newState.cloud.cpu = "92%";
        newState.nodes[1].status = "stressed"; // app1
        newState.anomalyMessage = "Volumetric spike degrading App Cluster Alpha CPU.";
    } else if (type === 'attack') {
        newState.cyber.anomalies = "DDoS Signature";
        newState.telecom.traffic = "CRITICAL";
        newState.cyber.authFails = "Spike";
        newState.nodes[0].status = "attacked"; // core router
        newState.anomalyMessage = "DDoS signature matched targeting Core Router.";
    }

    applyState(newState);
}

function resetState() {
    if(isSimulating) return;
    executionLog.innerHTML = '<div class="log-entry system">System Online. AENT unified model synchronized.</div>';
    applyState(defaultState);
}

// --- Sim Helper ---
async function runSimulationSequence(opts, winnerIndex) {
    setBrainState("STATUS: SIMULATING", "state-thinking");
    sandboxOverlay.classList.remove('hidden');

    for(let i=0; i<3; i++) {
        const el = document.getElementById(`sim-opt-${i+1}`);
        el.innerText = opts[i] ? opts[i].text : "";
        el.className = 'sim-option';
    }

    logMsg("DIGITAL TWIN: Cloning current state... spawning sandbox environments.", "sim");
    await wait(1000);

    for(let i=0; i<opts.length; i++) {
        const el = document.getElementById(`sim-opt-${i+1}`);
        el.classList.add('evaluating');
        await wait(800);
        el.classList.remove('evaluating');
    }

    const winnerEl = document.getElementById(`sim-opt-${winnerIndex+1}`);
    winnerEl.classList.add('selected');
    logMsg(`AGI BRAIN: Optimal path selected: ${opts[winnerIndex].text.split('->')[0].trim()}`, "sim");
    await wait(1500);

    sandboxOverlay.classList.add('hidden');
}

const wait = (ms) => new Promise(res => setTimeout(res, ms));

init();
