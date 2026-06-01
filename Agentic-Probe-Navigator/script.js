/**
 * Agentic Probe Navigator
 */

const SYSTEM_PROMPT = "You are the autonomous navigation agent for a deep space probe. Analyze the provided sensor data and provide specific navigation adjustment commands (e.g., 'adjust pitch by 5 degrees', 'engage thrusters for 2 seconds'). Keep the response concise and action-oriented.";

/**
 * Uses LLM to determine navigation adjustments based on sensor data.
 * @param {string} sensorData - Current sensor data
 * @returns {Promise<string>} - The LLM's recommended navigation adjustments
 */
async function navigateProbe(sensorData) {
    if (!sensorData || sensorData.trim() === '') {
        return "Error: No sensor data provided.";
    }

    try {
        // Fallback to mock fetchOpenAI for tests if not available globally
        const fetchFn = (typeof fetchOpenAI !== 'undefined') ? fetchOpenAI : (typeof global !== 'undefined' && global.fetchOpenAI ? global.fetchOpenAI : null);

        if (!fetchFn) {
            throw new Error("fetchOpenAI is not defined.");
        }

        // Dummy API key since this is local testing / mocked for unit tests
        const apiKey = "dummy-api-key";

        const response = await fetchFn(
            apiKey,
            "gpt-4", // or any model
            SYSTEM_PROMPT,
            `Sensor Data: ${sensorData}`,
            { temperature: 0.2 }
        );

        return response;
    } catch (error) {
        return `Navigation Error: ${error.message}`;
    }
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const navigateBtn = document.getElementById('navigateBtn');
        const sensorDataInput = document.getElementById('sensorData');
        const navigationLog = document.getElementById('navigationLog');

        if (navigateBtn) {
            navigateBtn.addEventListener('click', async () => {
                const data = sensorDataInput.value;
                if (!data) return;

                navigateBtn.disabled = true;
                navigateBtn.textContent = 'Consulting...';
                navigationLog.textContent = 'Consulting navigation agent...';

                try {
                    const result = await navigateProbe(data);
                    navigationLog.textContent = result;
                } catch (e) {
                    navigationLog.textContent = `Error: ${e.message}`;
                } finally {
                    navigateBtn.disabled = false;
                    navigateBtn.textContent = 'Consult Navigation Agent';
                }
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { navigateProbe };
}
