// --- State & Config ---
let isAttackMode = false;
let trafficData = Array(20).fill(45); // Initial baseline traffic (Gbps)
let timeLabels = Array.from({length: 20}, (_, i) => i);
let chartInstance = null;

let activeServers = 4;
let blockedIps = 0;
let simulationInterval = null;

// --- DOM Elements ---
const trafficChartEl = document.getElementById('trafficChart').getContext('2d');
const telecomStatus = document.getElementById('telecom-status');
const cloudStatus = document.getElementById('cloud-status');
const cyberStatus = document.getElementById('cyber-status');

const currentLoadVal = document.getElementById('current-load-val');
const latencyVal = document.getElementById('latency-val');
const instanceCountVal = document.getElementById('instance-count-val');
const cpuVal = document.getElementById('cpu-val');
const blockedIpsVal = document.getElementById('blocked-ips-val');
const threatLevelVal = document.getElementById('threat-level-val');

const serverGrid = document.getElementById('server-grid');
const threatLog = document.getElementById('threat-log');
const agiLog = document.getElementById('agi-log');

// --- Initialization ---
function init() {
    initChart();
    renderServers();
    startSimulation();

    document.getElementById('simulate-attack-btn').addEventListener('click', triggerAttack);
    document.getElementById('reset-btn').addEventListener('click', resetSimulation);
}

// --- Chart Setup ---
function initChart() {
    chartInstance = new Chart(trafficChartEl, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Network Traffic (Gbps)',
                data: trafficData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
                y: { min: 0, max: 500, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// --- Render Helpers ---
function renderServers() {
    serverGrid.innerHTML = '';
    for(let i=0; i < activeServers; i++) {
        const div = document.createElement('div');
        div.className = 'server-node active';
        div.innerText = `S-${i+1}`;
        serverGrid.appendChild(div);
    }
}

function addLog(message, type = 'system') {
    const el = document.createElement('div');
    el.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString();
    el.innerText = `[${time}] ${message}`;
    agiLog.appendChild(el);
    agiLog.scrollTop = agiLog.scrollHeight;
}

function addThreat(ip) {
    const el = document.createElement('div');
    el.className = 'threat-entry block';
    el.innerText = `> BLOCKED Malicious IP: ${ip}`;
    threatLog.prepend(el);
    if(threatLog.children.length > 20) threatLog.lastChild.remove();
}

// --- Simulation Loop ---
function startSimulation() {
    if(simulationInterval) clearInterval(simulationInterval);

    simulationInterval = setInterval(() => {
        updateTraffic();
        updateMetrics();
        analyzeState(); // The AGI Brain
    }, 1000);
}

function updateTraffic() {
    let newTraffic = 45 + (Math.random() * 10 - 5); // baseline fluctuation

    if (isAttackMode || mitigationStep > 0) {
        // Massive spike during attack
        newTraffic += (Math.random() * 150 + 200);
    }

    trafficData.push(newTraffic);
    trafficData.shift();

    chartInstance.update();
    currentLoadVal.innerText = `${Math.round(newTraffic)} Gbps`;
}

function updateMetrics() {
    const currentLoad = trafficData[trafficData.length - 1];

    if (isAttackMode || mitigationStep > 0) {
        // High latency during attack until mitigated
        const currentLatency = parseInt(latencyVal.innerText);
        if (currentLatency < 200) latencyVal.innerText = `${currentLatency + Math.floor(Math.random() * 30 + 10)} ms`;

        // High CPU
        cpuVal.innerText = `${Math.min(99, Math.floor((currentLoad / (activeServers * 20)) * 100))}%`;
    } else {
        // Normal metrics
        latencyVal.innerText = `${12 + Math.floor(Math.random() * 5)} ms`;
        cpuVal.innerText = `${Math.min(85, Math.floor((currentLoad / (activeServers * 50)) * 100))}%`;
    }
}

// --- AGI Core Logic ---
let mitigationStep = 0;

function analyzeState() {
    const currentLoad = trafficData[trafficData.length - 1];

    if (isAttackMode || mitigationStep > 0) {
        if (mitigationStep === 0) {
            telecomStatus.className = 'status-indicator danger';
            telecomStatus.innerText = 'Critical Spike';
            cyberStatus.className = 'status-indicator danger';
            cyberStatus.innerText = 'DDoS Detected';
            threatLevelVal.innerText = 'CRITICAL';

            addLog("ABNORMALITY DETECTED: Volumetric traffic spike +400% on Core Router A.", "critical");
            mitigationStep = 1;
        }
        else if (mitigationStep === 1) {
            addLog("ANALYSIS: Pattern matches Volumetric DDoS attack. Origin: Multiple foreign ASNs.", "detect");
            addLog("ACTION: Engaging autonomous mitigation protocols.", "action");
            mitigationStep = 2;
        }
        else if (mitigationStep === 2) {
            cloudStatus.className = 'status-indicator warning';
            cloudStatus.innerText = 'Scaling Out';
            addLog("ACTION (CLOUD): Spinning up 16 temporary edge servers to absorb junk traffic.", "action");

            // Visual scale up
            const oldServers = activeServers;
            activeServers = 20;
            for(let i=oldServers; i<activeServers; i++) {
                const div = document.createElement('div');
                div.className = 'server-node spinning-up';
                div.innerText = `S-${i+1}`;
                serverGrid.appendChild(div);
            }
            instanceCountVal.innerText = activeServers;
            mitigationStep = 3;
        }
        else if (mitigationStep === 3) {
            // Convert spinning to active
            document.querySelectorAll('.spinning-up').forEach(el => el.className = 'server-node active');
            cloudStatus.className = 'status-indicator online';
            cloudStatus.innerText = 'Scaled (Mitigation)';

            addLog("ACTION (CYBER): Applying dynamic BGP blackholing and IP rate-limiting at edge.", "action");
            mitigationStep = 4;
        }
        else if (mitigationStep >= 4 && mitigationStep < 15) {
            // Actively blocking
            const blockedThisTick = Math.floor(Math.random() * 500 + 100);
            blockedIps += blockedThisTick;
            blockedIpsVal.innerText = blockedIps.toLocaleString();

            addThreat(`${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x.x`);
            addThreat(`${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x.x`);

            // Traffic starts dropping due to blocks
            isAttackMode = false; // Stop the artificial spike generator
            addLog(`UPDATE: Blocked ${blockedThisTick} malicious packets. Network stabilizing.`, "detect");
            mitigationStep++;
        }
        else if (mitigationStep === 15) {
            telecomStatus.className = 'status-indicator warning';
            telecomStatus.innerText = 'Recovering';
            cyberStatus.className = 'status-indicator online';
            cyberStatus.innerText = 'Attack Mitigated';
            threatLevelVal.innerText = 'Elevated';

            addLog("STATUS: DDoS attack fully mitigated. Zero downtime achieved. Monitoring for secondary waves.", "system");
            mitigationStep = 16;
        }
    }
}

// --- Controls ---
function triggerAttack() {
    if(isAttackMode || mitigationStep > 0) return;
    document.getElementById('simulate-attack-btn').disabled = true;
    isAttackMode = true;
    addLog("USER OVERRIDE: Simulated DDoS attack initiated via testing interface.", "system");
}

function resetSimulation() {
    isAttackMode = false;
    mitigationStep = 0;
    activeServers = 4;
    blockedIps = 0;
    trafficData = Array(20).fill(45);

    chartInstance.data.datasets[0].data = trafficData;
    chartInstance.update();

    renderServers();

    telecomStatus.className = 'status-indicator online';
    telecomStatus.innerText = 'Normal Traffic';
    cloudStatus.className = 'status-indicator online';
    cloudStatus.innerText = 'Optimized';
    cyberStatus.className = 'status-indicator online';
    cyberStatus.innerText = 'Secure';

    currentLoadVal.innerText = '45 Gbps';
    latencyVal.innerText = '12 ms';
    instanceCountVal.innerText = '4';
    cpuVal.innerText = '35%';
    blockedIpsVal.innerText = '0';
    threatLevelVal.innerText = 'Low';

    threatLog.innerHTML = '';
    agiLog.innerHTML = '<div class="log-entry system">[SYSTEM] Simulation Reset. Monitoring all layers.</div>';

    document.getElementById('simulate-attack-btn').disabled = false;
}

// Start
init();
