
            async function planEvent(reqs, llmFetchFn) {
                const prompt = "You are an autonomous event planner. Propose 3 actionable vendor negotiations based on requirements.";
                const result = await llmFetchFn('fake-key', 'model', prompt, reqs);
                return result.split('\n');
            }
            if (typeof document !== 'undefined') {
                document.getElementById('plan-btn').addEventListener('click', async () => {
                    const text = document.getElementById('event-reqs').value;
                    const mockFetch = async () => "- Caterer: Negotiating vegan menu.\n- Venue: Securing 500 cap hall.\n- Decor: Sourcing within budget.";
                    const result = await planEvent(text, mockFetch);
                    const ul = document.getElementById('plan-output');
                    ul.innerHTML = '';
                    result.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                    document.getElementById('results').classList.remove('hidden');
                });
            }
            if (typeof module !== 'undefined') module.exports = { planEvent };
