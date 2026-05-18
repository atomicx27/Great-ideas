// Simulated Tools and Environment
const environment = {
    x: 0,
    depth: 0,
    obstacles: [ { x: 20, depth: 500 }, { x: 40, depth: 800 } ]
};

const tools = {
    scanEnvironment: () => {
        for (let obs of environment.obstacles) {
            if (Math.abs(environment.x - obs.x) <= 10 && Math.abs(environment.depth - obs.depth) <= 100) {
                return `Warning: Obstacle detected ahead at X:${obs.x}, Depth:${obs.depth}`;
            }
        }
        return "Path clear.";
    },
    adjustDepth: (targetDepth) => {
        environment.depth = targetDepth;
        return `Depth adjusted to ${targetDepth}m.`;
    },
    propel: (distance) => {
        environment.x += distance;
        return `Propelled forward by ${distance} units.`;
    }
};

// Agent Logic
async function runAgentMission(targetX, targetDepth, uiCallback) {
    let step = 0;
    const maxSteps = 15;
    environment.x = 0;
    environment.depth = 0;

    while (step < maxSteps) {
        step++;
        if (environment.x >= targetX && environment.depth >= targetDepth) {
            uiCallback('thought', 'Mission Accomplished. Target reached.');
            break;
        }

        uiCallback('thought', `Analyzing telemetry... Current: (${environment.x}, ${environment.depth}). Target: (${targetX}, ${targetDepth})`);

        // Check depth first
        if (environment.depth < targetDepth) {
            uiCallback('action', `Calling tool: adjustDepth(${targetDepth})`);
            const obs = tools.adjustDepth(targetDepth);
            uiCallback('observation', obs);
            continue;
        }

        // Scan before moving
        uiCallback('action', `Calling tool: scanEnvironment()`);
        const scanRes = tools.scanEnvironment();
        uiCallback('observation', scanRes);

        if (scanRes.includes("Warning")) {
            uiCallback('thought', 'Obstacle detected. Need to evade by adjusting depth.');
            const evadeDepth = environment.depth - 200; // go up to evade
            uiCallback('action', `Calling tool: adjustDepth(${evadeDepth})`);
            const evadeRes = tools.adjustDepth(evadeDepth);
            uiCallback('observation', evadeRes);
        } else {
            const moveDist = Math.min(10, targetX - environment.x);
            uiCallback('action', `Calling tool: propel(${moveDist})`);
            const moveRes = tools.propel(moveDist);
            uiCallback('observation', moveRes);
        }
    }

    if(step >= maxSteps) {
        uiCallback('thought', 'Mission aborted: Max steps reached.');
    }
}

// UI Integration
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const launchBtn = document.getElementById('launch-btn');
        const targetInput = document.getElementById('target-coord');
        const thoughtLog = document.getElementById('thought-log');
        const currentLoc = document.getElementById('current-loc');
        const currentStatus = document.getElementById('current-status');

        function appendLog(type, text) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            const prefix = type === 'thought' ? '🤔 Think: ' : type === 'action' ? '🛠️ Act: ' : '👁️ Observe: ';
            div.innerText = prefix + text;
            thoughtLog.appendChild(div);
            thoughtLog.scrollTop = thoughtLog.scrollHeight;

            currentLoc.innerText = `${environment.x}, ${environment.depth}`;
        }

        launchBtn.addEventListener('click', async () => {
            const val = targetInput.value.split(',');
            if(val.length !== 2) return alert('Enter format: X, Depth');

            const targetX = parseInt(val[0].trim());
            const targetDepth = parseInt(val[1].trim());

            launchBtn.disabled = true;
            thoughtLog.innerHTML = '';
            currentStatus.innerText = 'Mission Active';

            // Wrap agent loop to add UI delays
            const uiCallback = async (type, text) => {
                appendLog(type, text);
                await new Promise(r => setTimeout(r, 800)); // artificial delay for visualization
            };

            // Using a modified async run to allow await inside callback simulation
            async function runSimulated() {
                 let step = 0;
                 environment.x = 0; environment.depth = 0;
                 while (step < 15) {
                     step++;
                     if (environment.x >= targetX && environment.depth >= targetDepth) {
                         await uiCallback('thought', 'Mission Accomplished. Target reached.');
                         break;
                     }
                     await uiCallback('thought', `Analyzing telemetry... Current: (${environment.x}, ${environment.depth}). Target: (${targetX}, ${targetDepth})`);

                     if (environment.depth < targetDepth) {
                         await uiCallback('action', `Calling tool: adjustDepth(${targetDepth})`);
                         const obs = tools.adjustDepth(targetDepth);
                         await uiCallback('observation', obs);
                         continue;
                     }

                     await uiCallback('action', `Calling tool: scanEnvironment()`);
                     const scanRes = tools.scanEnvironment();
                     await uiCallback('observation', scanRes);

                     if (scanRes.includes("Warning")) {
                         await uiCallback('thought', 'Obstacle detected. Evading...');
                         const evadeDepth = environment.depth - 200;
                         await uiCallback('action', `Calling tool: adjustDepth(${evadeDepth})`);
                         const evadeRes = tools.adjustDepth(evadeDepth);
                         await uiCallback('observation', evadeRes);
                     } else {
                         const moveDist = Math.min(10, targetX - environment.x);
                         await uiCallback('action', `Calling tool: propel(${moveDist})`);
                         const moveRes = tools.propel(moveDist);
                         await uiCallback('observation', moveRes);
                     }
                 }
                 launchBtn.disabled = false;
                 currentStatus.innerText = 'Mission Complete/Aborted';
            }
            runSimulated();
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { runAgentMission, tools, environment };
}
