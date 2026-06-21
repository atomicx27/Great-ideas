const simulatedTools = {
    checkMetabolism: () => {
        const conds = ['Normal resting state', 'Elevated cortisol levels', 'Unexplained REM activity', 'Mild hypothermia'];
        const cond = conds[Math.floor(Math.random() * conds.length)];
        return `Metabolic sensors report: ${cond}.`;
    },
    checkFluidLevels: () => {
        const level = Math.floor(Math.random() * 100);
        if (level < 20) return 'Cryo-fluid levels critically low.';
        if (level < 50) return 'Cryo-fluid levels suboptimal.';
        return 'Cryo-fluid levels nominal.';
    }
};

async function runDiagnosisStep(logFn) {
    logFn("Agent objective: Diagnose and resolve stasis anomaly.");

    logFn("Agent querying metabolic sensors...");
    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: checkMetabolism()");
    const metabResult = simulatedTools.checkMetabolism();
    logFn(`Tool result: ${metabResult}`);

    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: checkFluidLevels()");
    const fluidResult = simulatedTools.checkFluidLevels();
    logFn(`Tool result: ${fluidResult}`);

    await new Promise(r => setTimeout(r, 1200));

    let decision = "";

    if (metabResult.includes('cortisol') || metabResult.includes('REM')) {
        if (fluidResult.includes('critically low')) {
            decision = "Patient experiencing active stress AND fluid levels critical. Initiating emergency wake protocol.";
        } else {
            decision = "Patient experiencing active stress. Administering mild sedative and lowering temperature by 1K.";
        }
    } else {
        if (fluidResult.includes('critically low')) {
            decision = "Patient stable but fluid critical. Activating backup fluid reservoir.";
        } else {
            decision = "Patient stable and fluid nominal. Continuing standard monitoring.";
        }
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const medicBtn = document.getElementById('medic-btn');
        const clearBtn = document.getElementById('clear-btn');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        medicBtn.addEventListener('click', async () => {
            medicBtn.disabled = true;
            appendLog("--- Diagnosis Sequence Engaged ---");
            await runDiagnosisStep(appendLog);
            medicBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runDiagnosisStep, simulatedTools };
}
