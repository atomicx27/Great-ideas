/**
 * Autonomous logic to adapt a holographic interface based on user gaze.
 */
async function adaptToUserGaze(gazeFocus, provider, fetchFn = null) {
    const fetchFunc = fetchFn || window.fetchLLMResponse;
    if (!fetchFunc) throw new Error("fetchLLMResponse is not defined");

    const prompt = `You are an Agentic Holographic Assistant.
The user has focused their gaze on a 3D projection of: "${gazeFocus}".

Autonomously decide how to adapt the holographic UI to assist them.
Return a JSON object with this exact structure:
{
  "thought": "your reasoning on what the user needs based on their focus",
  "context_menu": "the specific floating menu options to surface",
  "hologram_adjustment": "how to transform the 3D model (e.g., 'explode view', 'highlight tumor', 'show load paths')"
}`;

    const rawResponse = await fetchFunc(provider, prompt);
    try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
        return parsed;
    } catch (e) {
        return {
            thought: "Failed to parse LLM response.",
            context_menu: "Error loading context",
            hologram_adjustment: "Maintain current state"
        };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const adaptBtn = document.getElementById('adapt-btn');
        const gazeSelect = document.getElementById('gaze-focus');
        const providerSelect = document.getElementById('provider');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');

        const logContainer = document.getElementById('log-container');
        const menuOutput = document.getElementById('menu-output');
        const hologramOutput = document.getElementById('hologram-output');

        function appendLog(text) {
            const el = document.createElement('div');
            el.className = 'log-entry';
            el.textContent = `> ${text}`;
            logContainer.appendChild(el);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        adaptBtn.addEventListener('click', async () => {
            statusText.textContent = 'Status: Agent Processing Gaze Data...';
            adaptBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            logContainer.innerHTML = '';

            menuOutput.textContent = 'Loading...';
            hologramOutput.textContent = 'Loading...';

            try {
                const focus = gazeSelect.value;
                appendLog(`Detected sustained gaze on: ${focus}`);

                const result = await adaptToUserGaze(focus, providerSelect.value);

                appendLog(`Thought: ${result.thought}`);

                menuOutput.textContent = result.context_menu;
                hologramOutput.textContent = result.hologram_adjustment;

                statusText.textContent = 'Status: UI Adapted Successfully';
            } catch (error) {
                appendLog(`Error: ${error.message}`);
                statusText.textContent = 'Status: Error';
            } finally {
                adaptBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { adaptToUserGaze };
}