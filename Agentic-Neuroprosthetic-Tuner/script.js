// Simulated Tools and Environment
const environment = {
    adjustmentLevel: 0,
    motionState: "Rest",
    optimalAdjustment: {
        "Grasp": 3,
        "Point": 5,
        "Pinch": 2
    }
};

const tools = {
    increaseGain: () => {
        environment.adjustmentLevel++;
        return `Increased signal gain to level ${environment.adjustmentLevel}.`;
    },
    decreaseGain: () => {
        if(environment.adjustmentLevel > 0) environment.adjustmentLevel--;
        return `Decreased signal gain to level ${environment.adjustmentLevel}.`;
    },
    testMotorFunction: (target) => {
        if (environment.adjustmentLevel === environment.optimalAdjustment[target]) {
            environment.motionState = target;
            return `Motor feedback optimal. ${target} motion achieved smoothly.`;
        } else if (environment.adjustmentLevel < environment.optimalAdjustment[target]) {
            environment.motionState = "Weak/Incomplete";
            return `Motor feedback weak. Motion incomplete.`;
        } else {
            environment.motionState = "Tremor/Overshoot";
            return `Motor feedback too strong. Tremor detected.`;
        }
    }
};

// Agent Logic
async function runTuningSession(targetMotion, uiCallback) {
    let step = 0;
    const maxSteps = 15;
    environment.adjustmentLevel = 0;
    environment.motionState = "Rest";

    while (step < maxSteps) {
        step++;
        if (environment.motionState === targetMotion) {
            uiCallback('thought', `Tuning Successful. Target motion "${targetMotion}" calibrated perfectly.`);
            break;
        }

        uiCallback('thought', `Current gain level: ${environment.adjustmentLevel}. Evaluating motor response for ${targetMotion}.`);

        uiCallback('action', `Calling tool: testMotorFunction("${targetMotion}")`);
        const feedback = tools.testMotorFunction(targetMotion);
        uiCallback('observation', feedback);

        if (feedback.includes('optimal')) {
            uiCallback('thought', `Optimal state reached. Stopping tuning loop.`);
        } else if (feedback.includes('weak')) {
            uiCallback('thought', `Signal too weak. Need to increase gain.`);
            uiCallback('action', `Calling tool: increaseGain()`);
            const gainRes = tools.increaseGain();
            uiCallback('observation', gainRes);
        } else if (feedback.includes('strong')) {
            uiCallback('thought', `Signal too strong. Need to decrease gain.`);
            uiCallback('action', `Calling tool: decreaseGain()`);
            const gainRes = tools.decreaseGain();
            uiCallback('observation', gainRes);
        }
    }

    if(step >= maxSteps && environment.motionState !== targetMotion) {
        uiCallback('thought', 'Safety Protocol Triggered: Max iterations reached. Aborting tuning loop.');
    }
}

// UI Integration
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tuneBtn = document.getElementById('tune-btn');
        const targetMotionSelect = document.getElementById('target-motion');
        const thoughtLog = document.getElementById('thought-log');
        const currentAdjust = document.getElementById('current-adjust');
        const motionState = document.getElementById('motion-state');

        function appendLog(type, text) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            const prefix = type === 'thought' ? '🤖 Think: ' : type === 'action' ? '⚙️ Act: ' : '📡 Observe: ';
            div.innerText = prefix + text;
            thoughtLog.appendChild(div);
            thoughtLog.scrollTop = thoughtLog.scrollHeight;

            currentAdjust.innerText = environment.adjustmentLevel;
            motionState.innerText = environment.motionState;
        }

        tuneBtn.addEventListener('click', async () => {
            const targetMotion = targetMotionSelect.value;

            tuneBtn.disabled = true;
            thoughtLog.innerHTML = '';

            const uiCallback = async (type, text) => {
                appendLog(type, text);
                await new Promise(r => setTimeout(r, 600)); // artificial delay
            };

            // Wrap agent loop to allow await simulation in UI
             async function runSimulated() {
                 let step = 0;
                 environment.adjustmentLevel = 0; environment.motionState = "Rest";
                 while (step < 15) {
                     step++;
                     if (environment.motionState === targetMotion) {
                         await uiCallback('thought', `Tuning Successful. Target motion "${targetMotion}" calibrated perfectly.`);
                         break;
                     }
                     await uiCallback('thought', `Current gain level: ${environment.adjustmentLevel}. Evaluating motor response for ${targetMotion}.`);

                     await uiCallback('action', `Calling tool: testMotorFunction("${targetMotion}")`);
                     const feedback = tools.testMotorFunction(targetMotion);
                     await uiCallback('observation', feedback);

                     if (feedback.includes('optimal')) {
                         await uiCallback('thought', `Optimal state reached. Stopping tuning loop.`);
                     } else if (feedback.includes('weak')) {
                         await uiCallback('thought', `Signal too weak. Need to increase gain.`);
                         await uiCallback('action', `Calling tool: increaseGain()`);
                         const gainRes = tools.increaseGain();
                         await uiCallback('observation', gainRes);
                     } else if (feedback.includes('strong')) {
                         await uiCallback('thought', `Signal too strong. Need to decrease gain.`);
                         await uiCallback('action', `Calling tool: decreaseGain()`);
                         const gainRes = tools.decreaseGain();
                         await uiCallback('observation', gainRes);
                     }
                 }
                 tuneBtn.disabled = false;
            }
            runSimulated();
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { runTuningSession, tools, environment };
}
