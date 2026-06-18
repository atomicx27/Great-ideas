// Core Logic (Testable)
function analyzeEnergyUsage(usageDataStr) {
    try {
        const data = JSON.parse(usageDataStr);
        let totalUsage = 0;
        let peakAppliance = null;
        let maxUsage = 0;

        for (const item of data) {
            totalUsage += item.usage_kwh;
            if (item.usage_kwh > maxUsage) {
                maxUsage = item.usage_kwh;
                peakAppliance = item.appliance;
            }
        }

        return {
            isValid: true,
            totalUsage,
            peakAppliance,
            data
        };
    } catch (e) {
        return { isValid: false, error: "Invalid JSON format" };
    }
}

async function optimizeEnergyConsumption(config, fetchLLMResponseFn) {
    const analysis = analyzeEnergyUsage(config.usageData);
    if (!analysis.isValid) {
        throw new Error(analysis.error);
    }

    const systemPrompt = `You are an Agentic Energy Optimization AI.
Analyze the provided home energy usage profile and user preferences.
Provide a concrete, actionable schedule to shift energy loads to off-peak hours and reduce costs.
Format your response in Markdown with clear headings and bullet points.`;

    const userMessage = `Usage Data: ${JSON.stringify(analysis.data, null, 2)}
User Preferences: ${config.preferences}
Total Daily Usage: ${analysis.totalUsage} kWh
Highest Consuming Appliance: ${analysis.peakAppliance}`;

    // Use dependency injection for the LLM fetch to allow easy mocking in tests
    return await fetchLLMResponseFn(config.provider, config.apiKey, systemPrompt, userMessage);
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeEnergyUsage, optimizeEnergyConsumption };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyContainer = document.getElementById('api-key-container');
        const apiKeyInput = document.getElementById('api-key');
        const btnOptimize = document.getElementById('btn-optimize');
        const outputDiv = document.getElementById('agent-output');
        const loadingDiv = document.getElementById('loading');

        const usageDataInput = document.getElementById('usage-data');
        const userPrefsInput = document.getElementById('user-prefs');

        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyContainer.classList.add('hidden');
            } else {
                apiKeyContainer.classList.remove('hidden');
            }
        });

        // Wrapper function to connect the UI to the shared LLM API
        async function fetchLLMWrapper(provider, apiKey, systemPrompt, userMessage) {
            if (provider === 'openai') {
                return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
            } else if (provider === 'anthropic') {
                return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', systemPrompt, userMessage);
            } else if (provider === 'ollama') {
                // Simplified mock for local ollama in this UI context
                return "Mocked Ollama Response: Shift HVAC to pre-cool at 12:00. Delay EV charging to 23:00.";
            }
            throw new Error("Unknown provider");
        }

        btnOptimize.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key for " + provider);
                return;
            }

            outputDiv.classList.add('hidden');
            loadingDiv.classList.remove('hidden');
            btnOptimize.disabled = true;

            const config = {
                usageData: usageDataInput.value,
                preferences: userPrefsInput.value,
                provider: provider,
                apiKey: apiKey
            };

            try {
                const markdownResponse = await optimizeEnergyConsumption(config, fetchLLMWrapper);
                const htmlOutput = window.marked ? window.marked.parse(markdownResponse) : markdownResponse;
                outputDiv.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlOutput) : htmlOutput;
            } catch (error) {
                outputDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
            } finally {
                loadingDiv.classList.add('hidden');
                outputDiv.classList.remove('hidden');
                btnOptimize.disabled = false;
            }
        });
    });
}
