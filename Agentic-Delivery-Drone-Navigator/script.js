if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const startBtn = document.getElementById('start-nav-btn');
        const outputLog = document.getElementById('output-log');
        const destinationInput = document.getElementById('destination-input');

        // UI Logic for Provider Selection
        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyGroup.style.display = 'none';
                modelGroup.style.display = 'block';
            } else {
                apiKeyGroup.style.display = 'block';
                modelGroup.style.display = 'none';
            }
        });

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; // Secure DOM update
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        // Simulated Tools
        const tools = {
            checkWeather: async (location) => {
                appendLog(`Executing Tool: checkWeather("${location}")`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve("High winds detected in Sector 3.");
                }, 1000));
            },
            checkAirspace: async () => {
                appendLog(`Executing Tool: checkAirspace()`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve("Clear path available through Sector 2.");
                }, 1000));
            },
            updateRoute: async (newRoute) => {
                appendLog(`Executing Tool: updateRoute("${newRoute}")`, 'log-action');
                return new Promise(resolve => setTimeout(() => resolve(
                    "Route successfully updated."
                ), 1000));
            }
        };

        // Agent Simulation Logic
        startBtn.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const destination = destinationInput.value;

            outputLog.innerHTML = '';
            appendLog(`Starting Agentic Navigator. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Goal: Safe delivery to "${destination}"`, 'log-info');
            startBtn.disabled = true;

            try {
                appendLog(`Thinking: I need to check the weather conditions along the direct route.`, 'log-thought');
                const weatherReport = await tools.checkWeather(destination);
                appendLog(`Observation: ${weatherReport}`, 'log-info');

                appendLog(`Thinking: High winds present a safety risk. I need to find an alternative route via airspace radar.`, 'log-thought');
                const airspaceReport = await tools.checkAirspace();
                appendLog(`Observation: ${airspaceReport}`, 'log-info');

                appendLog(`Thinking: Rerouting through Sector 2 is the safest option.`, 'log-thought');
                const routeResult = await tools.updateRoute(`Via Sector 2 to ${destination}`);
                appendLog(`Observation: ${routeResult}`, 'log-success');

                appendLog('Thinking: New safe route established. Proceeding to destination.', 'log-thought');
                appendLog('Agent Finished.', 'log-success');

            } catch (error) {
                appendLog(`Error during agent execution: ${error}`, 'log-error');
            } finally {
                startBtn.disabled = false;
            }
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {}; // Add exports if pure logic functions are separated later
}