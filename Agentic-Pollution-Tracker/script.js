const simulatedTools = {
    checkCurrents: () => {
        const directions = ['North', 'South', 'East', 'West'];
        const strength = Math.floor(Math.random() * 10) + 1; // knots
        return `Currents are flowing ${directions[Math.floor(Math.random() * directions.length)]} at ${strength} knots.`;
    },
    scanMicroplastics: () => {
        const density = Math.floor(Math.random() * 100);
        if (density > 75) return 'High microplastic density detected nearby.';
        if (density > 30) return 'Moderate microplastic density detected nearby.';
        return 'Low microplastic density detected nearby.';
    }
};

async function runAgentStep(logFn) {
    logFn("Agent objective: Find optimal cleanup path based on currents and pollution density.");

    // Simulate thinking/tool execution delay
    logFn("Agent deciding which tools to use...");
    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: checkCurrents()");
    const currents = simulatedTools.checkCurrents();
    logFn(`Tool result: ${currents}`);

    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: scanMicroplastics()");
    const density = simulatedTools.scanMicroplastics();
    logFn(`Tool result: ${density}`);

    await new Promise(r => setTimeout(r, 1000));

    // Simple decision logic based on simulated results
    let decision = "Proceed straight ahead.";
    if (density.includes('High') || density.includes('Moderate')) {
        decision = `Deploying collection nets and tracking towards density source against currents (${currents}).`;
    } else {
        decision = `Following currents (${currents}) to locate new pollution pockets.`;
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-btn');
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
            appendLog("--- Starting New Cycle ---");
            await runAgentStep(appendLog);
            startBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAgentStep, simulatedTools };
}