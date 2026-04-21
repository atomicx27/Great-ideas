// --- DOM Elements ---
const metricTraffic = document.getElementById('metric-traffic');
const metricLatency = document.getElementById('metric-latency');
const metricCpu = document.getElementById('metric-cpu');
const metricNodes = document.getElementById('metric-nodes');
const metricAnomalies = document.getElementById('metric-anomalies');
const metricAuth = document.getElementById('metric-auth');

const hubNode = document.querySelector('.hub-node');
const paths = document.querySelectorAll('.path');
const node1 = document.querySelector('.node-1');

const sandboxOverlay = document.getElementById('sandbox-overlay');
const simOpt1 = document.getElementById('sim-opt-1');
const simOpt2 = document.getElementById('sim-opt-2');
const simOpt3 = document.getElementById('sim-opt-3');

const brainState = document.getElementById('brain-state');
const executionLog = document.getElementById('execution-log');

// --- State ---
let isSimulating = false;

// --- Init & Base Loop ---
function init() {
    document.getElementById('scenario-congestion').addEventListener('click', () => triggerScenario('congestion'));
    document.getElementById('scenario-attack').addEventListener('click', () => triggerScenario('attack'));
    document.getElementById('scenario-reset').addEventListener('click', resetState);

    // Normal pulse
    paths.forEach(p => p.classList.add('traffic'));
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

// --- Scenarios ---
async function triggerScenario(type) {
    if (isSimulating) return;
    isSimulating = true;

    if (type === 'congestion') {
        // 1. Ingestion detects issue
        metricTraffic.innerText = 'High (Spike)'; metricTraffic.className = 'val warn';
        metricLatency.innerText = '85ms'; metricLatency.className = 'val warn';
        metricCpu.innerText = '92%'; metricCpu.className = 'val danger';

        hubNode.classList.add('stressed');
        paths[0].classList.replace('traffic', 'traffic-heavy');

        logMsg("INGESTION: Detected massive telecom traffic spike to App Cluster Alpha. CPU reaching critical.", "detect");

        // 2. AGI Thinks & Simulates
        await runSimulationSequence([
            { el: simOpt1, text: "Scenario A: Throttle Traffic -> Impact: High user friction.", ok: false },
            { el: simOpt2, text: "Scenario B: Auto-Scale App Node -> Impact: Low Cost, fixes CPU.", ok: true },
            { el: simOpt3, text: "Scenario C: Reroute via Edge -> Impact: Moderate latency.", ok: false }
        ], 1); // Selects index 1 (Opt 2)

        // 3. Execute
        setBrainState("STATUS: EXECUTING", "state-executing");
        logMsg("EXECUTION: Firing API to orchestrator to provision 4 new containers for App Cluster Alpha.", "exec");

        node1.classList.add('active-scale');
        metricNodes.innerText = '12';

        await wait(1500);

        // 4. Learn & Resolve
        metricCpu.innerText = '45%'; metricCpu.className = 'val ok';
        metricLatency.innerText = '20ms'; metricLatency.className = 'val ok';
        paths[0].classList.replace('traffic-heavy', 'traffic');
        hubNode.classList.remove('stressed');

        logMsg("LEARNING: Simulation prediction matched reality. CPU stabilized at 45%. Model weights updated.", "learn");
        setBrainState("STATUS: OBSERVING", "state-idle");
        isSimulating = false;

    } else if (type === 'attack') {
        // 1. Ingestion
        metricAnomalies.innerText = 'DDoS Sig Match'; metricAnomalies.className = 'val danger';
        metricTraffic.innerText = 'CRITICAL VOL'; metricTraffic.className = 'val danger';
        metricAuth.innerText = 'Spike'; metricAuth.className = 'val warn';

        hubNode.classList.add('attacked');
        paths.forEach(p => p.classList.replace('traffic', 'traffic-heavy'));

        logMsg("INGESTION: Cybersecurity layer flagged volumetric anomaly matching DDoS signature targeting Core Router.", "detect");

        // 2. Sim
        await runSimulationSequence([
            { el: simOpt1, text: "Scenario A: Scale Infra -> Impact: Cost explosion, attack persists.", ok: false },
            { el: simOpt2, text: "Scenario B: Isolate Cluster Beta -> Impact: Breaks lateral movement, drops benign DB traffic.", ok: false },
            { el: simOpt3, text: "Scenario C: Inject BGP Null-Route & Shift to Edge WAF -> Impact: Attack neutralized, minimal latency.", ok: true }
        ], 2);

        // 3. Execute
        setBrainState("STATUS: EXECUTING", "state-executing");
        logMsg("EXECUTION: Updating SDN controller to inject BGP null-routes for attacker ASNs. Rerouting clean traffic through Edge Gateway.", "exec");

        paths[0].classList.replace('traffic-heavy', 'traffic-blocked');
        paths[1].classList.replace('traffic-heavy', 'traffic-blocked');

        await wait(1500);

        // 4. Learn
        metricAnomalies.innerText = 'None'; metricAnomalies.className = 'val ok';
        metricTraffic.innerText = 'Normal (Filtered)'; metricTraffic.className = 'val ok';
        hubNode.classList.remove('attacked');
        paths.forEach(p => p.className = 'path traffic');

        logMsg("LEARNING: Attack isolated at edge. Zero internal downtime. AENT threat model updated with new IP signatures.", "learn");
        setBrainState("STATUS: OBSERVING", "state-idle");
        isSimulating = false;
    }
}

async function runSimulationSequence(opts, winnerIndex) {
    setBrainState("STATUS: SIMULATING", "state-thinking");
    sandboxOverlay.classList.remove('hidden');

    // Reset options
    opts.forEach(o => { o.el.innerText = o.text; o.el.className = 'sim-option'; });

    logMsg("DIGITAL TWIN: Cloning current state... spawning sandbox environments.", "sim");
    await wait(1000);

    // Evaluate
    for(let i=0; i<opts.length; i++) {
        opts[i].el.classList.add('evaluating');
        await wait(800);
        opts[i].el.classList.remove('evaluating');
    }

    // Select
    opts[winnerIndex].el.classList.add('selected');
    logMsg(`AGI BRAIN: Optimal path found. Selecting: ${opts[winnerIndex].text.split('->')[0].trim()}`, "sim");
    await wait(1500);

    sandboxOverlay.classList.add('hidden');
}

function resetState() {
    if(isSimulating) return;

    metricTraffic.innerText = 'Normal'; metricTraffic.className = 'val ok';
    metricLatency.innerText = '15ms'; metricLatency.className = 'val ok';
    metricCpu.innerText = '32%'; metricCpu.className = 'val ok';
    metricNodes.innerText = '8';
    metricAnomalies.innerText = 'None'; metricAnomalies.className = 'val ok';
    metricAuth.innerText = 'Low'; metricAuth.className = 'val ok';

    hubNode.className = 'hub-node';
    node1.classList.remove('active-scale');
    paths.forEach(p => p.className = 'path traffic');

    executionLog.innerHTML = '<div class="log-entry system">System Online. AENT unified model synchronized.</div>';
}

const wait = (ms) => new Promise(res => setTimeout(res, ms));

init();
