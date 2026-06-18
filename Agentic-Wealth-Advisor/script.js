async function generateWealthAdvice(income, goal, risk, provider) {
    const prompt = `As a Wealth Management AI Advisor, provide a concise financial strategy for a client with the following profile:\n- Annual Income: $${income}\n- Financial Goal: ${goal}\n- Risk Tolerance: ${risk}`;
    try {
        const response = await fetchLLMResponse(provider, prompt);
        return response;
    } catch (error) {
        return "Error connecting to the LLM service.";
    }
}
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('profile-form');
        const output = document.getElementById('advice-output');
        const loading = document.getElementById('loading');
        const btn = document.getElementById('generate-btn');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const income = document.getElementById('income').value;
            const goal = document.getElementById('goal').value;
            const risk = document.getElementById('risk').value;
            const provider = document.getElementById('provider').value;
            loading.style.display = 'block';
            output.innerHTML = '';
            btn.disabled = true;
            const advice = await generateWealthAdvice(income, goal, risk, provider);
            loading.style.display = 'none';
            output.innerHTML = `<div class="advice-content"></div>`;
            output.querySelector(".advice-content").textContent = advice;
            btn.disabled = false;
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { generateWealthAdvice };
