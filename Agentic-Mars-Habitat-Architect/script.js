async function designHabitatLayout(crewDetails) {
    if (!crewDetails || typeof crewDetails !== 'string') {
        throw new Error('Invalid crew details provided.');
    }

    const systemPrompt = "You are an AI Martian Habitat Architect. Analyze the crew specializations and return a JSON blueprint with exactly two keys: 'primary_zone' (string, main focus area) and 'layout_score' (number out of 100).";

    // Default mock API Key
    const mockApiKey = 'sk-mock-mars-api-key';

    try {
        const responseText = await fetchOpenAI(mockApiKey, 'gpt-4o-mini', systemPrompt, crewDetails, { temperature: 0.3 });
        return JSON.parse(responseText);
    } catch (err) {
        throw new Error(`Design Generation Failed: ${err.message}`);
    }
}

if (typeof document !== 'undefined') {
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('design-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const crewDetails = document.getElementById('crew-details').value;
            output.innerHTML = '<p>Agent architecting blueprint...</p>';

            try {
                const result = await designHabitatLayout(crewDetails);

                output.innerHTML = `
                    <p><strong>Primary Zone Allocation:</strong> ${result.primary_zone}</p>
                    <p><strong>Estimated Layout Efficiency Score:</strong> ${result.layout_score}/100</p>
                `;
                showToast("Blueprint Generated");
            } catch (err) {
                output.innerHTML = `<p class="error">${err.message}</p>`;
                showToast("Generation Error");
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { designHabitatLayout };
}
