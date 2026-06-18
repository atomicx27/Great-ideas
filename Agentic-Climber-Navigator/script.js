const simulatedTools = {
    checkDebrisRadar: () => {
        const statuses = ['Clear Path', 'Minor Debris Field Ahead', 'Major Debris Intercept Imminent'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    },
    checkAtmosphericDrag: () => {
        const conditions = ['Low Drag (Exosphere)', 'High Drag (Mesosphere)', 'Extreme Shear Winds'];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }
};

async function adjustClimberSpeed(logFn) {
    logFn("Agent objective: Optimize climber ascent speed while ensuring tether integrity.");

    logFn("Agent invoking tool: checkDebrisRadar()...");
    await new Promise(r => setTimeout(r, 1000));
    const radar = simulatedTools.checkDebrisRadar();
    logFn(`Tool result: ${radar}`);

    logFn("Agent invoking tool: checkAtmosphericDrag()...");
    await new Promise(r => setTimeout(r, 1000));
    const drag = simulatedTools.checkAtmosphericDrag();
    logFn(`Tool result: ${drag}`);

    await new Promise(r => setTimeout(r, 1200));

    let decision = "";

    if (radar.includes('Major Debris')) {
        decision = "CRITICAL: Debris intercept likely. Initiating emergency halt and requesting tether deflection maneuver.";
    } else if (radar.includes('Minor Debris')) {
        decision = "Slowing ascent to 200 km/h to allow micrometeoroid shields to adjust.";
    } else {
        if (drag.includes('Extreme')) {
            decision = "High shear winds detected. Maintaining current speed to minimize resonant vibrations in the tether.";
        } else if (drag.includes('High Drag')) {
            decision = "Atmospheric drag is high. Increasing power to laser propulsion receivers to maintain 500 km/h.";
        } else {
            decision = "Path is clear and drag is minimal. Accelerating to maximum safe speed (800 km/h).";
        }
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('navigate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            appendLog("--- Ascent Protocol Initiated ---");
            await adjustClimberSpeed(appendLog);
            startBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { adjustClimberSpeed, simulatedTools };
}
