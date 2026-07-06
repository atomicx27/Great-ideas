// Agentic Logic
async function tuneDarkMatterContainment(fields, fetchOpenAI, apiKey) {
    const prompt = `You are an AI Tuner. Evaluate the following dark matter containment fields:
${JSON.stringify(fields, null, 2)}
Return a JSON array modifying 'harmonics' for each field to maximize stability (aim for 100), based on 'currentStability'. Reply ONLY with valid JSON.`;

    try {
        const response = await fetchOpenAI(
            apiKey,
            'gpt-3.5-turbo',
            'You tune containment fields. Respond only in JSON.',
            prompt
        );

        let parsed = JSON.parse(response);
        return { success: true, optimizedFields: parsed };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// DOM Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tuneBtn = document.getElementById('tune-btn');
        const logList = document.getElementById('log-list');
        const fieldsList = document.getElementById('fields-list');
        const agentState = document.getElementById('agent-state');
        const stabilityFill = document.getElementById('stability-fill');
        const stabilityText = document.getElementById('stability-text');

        const mockFields = [
            { id: 'Alpha', currentStability: 45, harmonics: 1.2 },
            { id: 'Beta', currentStability: 82, harmonics: 3.5 },
            { id: 'Gamma', currentStability: 21, harmonics: 0.8 }
        ];

        function logMsg(msg) {
            const li = document.createElement('li');
            li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logList.appendChild(li);
            logList.scrollTop = logList.scrollHeight;
        }

        function renderFields(fields) {
            fieldsList.innerHTML = '';
            let total = 0;
            fields.forEach(f => {
                total += f.currentStability;
                const li = document.createElement('li');
                li.innerHTML = `<span>Field ${f.id}</span> <span>Stability: ${f.currentStability}% | Harmonics: ${f.harmonics}</span>`;
                fieldsList.appendChild(li);
            });

            const avg = (total / fields.length).toFixed(1);
            stabilityFill.style.width = `${avg}%`;
            stabilityText.textContent = `${avg}%`;
        }

        renderFields(mockFields);

        tuneBtn.addEventListener('click', async () => {
            tuneBtn.disabled = true;
            agentState.textContent = 'Analyzing Fields...';
            document.querySelector('.status-dot').style.backgroundColor = 'var(--primary-color)';
            logMsg('Initiating dark matter field optimization sequence...');

            const mockFetch = async () => JSON.stringify([
                { id: 'Alpha', currentStability: 85, harmonics: 1.8 },
                { id: 'Beta', currentStability: 95, harmonics: 3.7 },
                { id: 'Gamma', currentStability: 70, harmonics: 1.5 }
            ]);

            logMsg('Agent requesting LLM optimization...');

            // In a real scenario, we'd use window.fetchOpenAI from llm-api.js
            // Mocking for frontend test without key
            const apiFunc = typeof window.fetchOpenAI !== 'undefined' ? window.fetchOpenAI : mockFetch;

            const result = await tuneDarkMatterContainment(mockFields, apiFunc, 'mock-key');

            if (result.success) {
                logMsg('Optimization successful. Applying new harmonic parameters.');
                renderFields(result.optimizedFields);
                agentState.textContent = 'Optimization Complete';
                document.querySelector('.status-dot').style.backgroundColor = 'var(--success-color)';
            } else {
                logMsg(`Error: ${result.error}`);
                agentState.textContent = 'Error';
                document.querySelector('.status-dot').style.backgroundColor = 'var(--warning-color)';
            }

            tuneBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tuneDarkMatterContainment };
}
