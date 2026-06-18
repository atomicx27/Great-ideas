/**
 * Simulates a wind tunnel tool.
 */
function queryWindTunnelSim(shape, speed) {
    if (shape === 'blunt-cylinder') {
        return `High drag coefficient detected at Mach ${speed}. Severe flow separation.`;
    } else if (shape === 'teardrop') {
        if (speed < 1.0) return `Low drag at Mach ${speed}. Attached flow. Subsonic optimal.`;
        return `Wave drag increasing at Mach ${speed}. Not optimal for transonic/supersonic.`;
    } else if (shape === 'airfoil') {
        return `Moderate drag, high lift at Mach ${speed}. Ideal for sustained flight.`;
    }
    return `Unknown shape ${shape} aerodynamics uncalculated.`;
}

/**
 * Main optimization function using a ReAct loop.
 */
async function optimizeAerodynamicShape(initialShape, windSpeed, provider, fetchFn = null) {
    const fetchFunc = fetchFn || window.fetchLLMResponse;
    if (!fetchFunc) throw new Error("fetchLLMResponse is not defined");

    const prompt = `You are an Agentic Shape Shifter optimizing aerodynamic profiles.
Current Shape: ${initialShape}
Wind Speed (Mach): ${windSpeed}

Your goal is to optimize the shape for the given wind speed using a ReAct loop.
Simulated wind tunnel data: ${queryWindTunnelSim(initialShape, windSpeed)}

Output a JSON object with this exact structure:
{
  "thought": "your analysis of the wind tunnel data",
  "action": "the new shape to adopt (e.g., 'teardrop', 'airfoil', 'swept-wing', or 'keep current')",
  "observation": "expected outcome of this change",
  "final_shape": "the ultimate shape decided"
}`;

    const rawResponse = await fetchFunc(provider, prompt);
    try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
        return parsed;
    } catch (e) {
        return {
            thought: "Failed to parse LLM response.",
            action: "Error",
            observation: rawResponse,
            final_shape: initialShape
        };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const optimizeBtn = document.getElementById('optimize-btn');
        const currentShapeSelect = document.getElementById('current-shape');
        const windSpeedInput = document.getElementById('wind-speed');
        const providerSelect = document.getElementById('provider');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const logContainer = document.getElementById('log-container');
        const finalShapeOutput = document.getElementById('final-shape-output');

        function appendLog(type, text) {
            const el = document.createElement('div');
            el.className = `log-entry log-${type}`;
            el.textContent = `[${type.toUpperCase()}]: ${text}`;
            logContainer.appendChild(el);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        optimizeBtn.addEventListener('click', async () => {
            statusText.textContent = 'Status: Agent Loop Active...';
            optimizeBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            logContainer.innerHTML = '';
            finalShapeOutput.textContent = 'Calculating...';

            const shape = currentShapeSelect.value;
            const speed = windSpeedInput.value;
            const provider = providerSelect.value;

            try {
                appendLog('observation', `Initial Shape: ${shape}, Speed: Mach ${speed}`);
                const result = await optimizeAerodynamicShape(shape, speed, provider);

                appendLog('thought', result.thought);
                appendLog('action', result.action);
                appendLog('observation', result.observation);
                appendLog('final', `Converged on: ${result.final_shape}`);

                finalShapeOutput.textContent = result.final_shape;
                statusText.textContent = 'Status: Optimization Complete';
            } catch (error) {
                appendLog('observation', `Error: ${error.message}`);
                statusText.textContent = 'Status: Error';
            } finally {
                optimizeBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { optimizeAerodynamicShape, queryWindTunnelSim };
}