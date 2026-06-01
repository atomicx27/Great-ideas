/**
 * Agentic Nanobot Medic
 */

const SYSTEM_PROMPT = "You are a specialized medical AI orchestrating therapeutic nanobots. Analyze the provided symptoms and vitals, then output a specific nanobot treatment plan. Be concise and prioritize patient safety.";

/**
 * Uses LLM to determine treatment plan based on symptoms.
 * @param {string} symptoms - Patient symptoms and vitals
 * @returns {Promise<string>} - The LLM's recommended nanobot treatment
 */
async function diagnoseAndTreat(symptoms) {
    if (!symptoms || symptoms.trim() === '') {
        return "Error: No symptoms provided.";
    }

    try {
        const fetchFn = (typeof fetchOpenAI !== 'undefined') ? fetchOpenAI : (typeof global !== 'undefined' && global.fetchOpenAI ? global.fetchOpenAI : null);

        if (!fetchFn) {
            throw new Error("fetchOpenAI is not defined.");
        }

        const apiKey = "dummy-api-key";

        const response = await fetchFn(
            apiKey,
            "gpt-4",
            SYSTEM_PROMPT,
            `Patient Symptoms: ${symptoms}`,
            { temperature: 0.2 }
        );

        return response;
    } catch (error) {
        return `Diagnostic Error: ${error.message}`;
    }
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const diagnoseBtn = document.getElementById('diagnoseBtn');
        const symptomsInput = document.getElementById('symptoms');
        const treatmentLog = document.getElementById('treatmentLog');

        if (diagnoseBtn) {
            diagnoseBtn.addEventListener('click', async () => {
                const data = symptomsInput.value;
                if (!data) return;

                diagnoseBtn.disabled = true;
                diagnoseBtn.textContent = 'Analyzing...';
                treatmentLog.textContent = 'Consulting medical agent...';

                try {
                    const result = await diagnoseAndTreat(data);
                    treatmentLog.textContent = result;
                } catch (e) {
                    treatmentLog.textContent = `Error: ${e.message}`;
                } finally {
                    diagnoseBtn.disabled = false;
                    diagnoseBtn.textContent = 'Analyze & Formulate Treatment';
                }
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { diagnoseAndTreat };
}
