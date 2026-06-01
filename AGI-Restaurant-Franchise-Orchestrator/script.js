
            async function orchestrateFranchise(goal, llmFetchFn) {
                const prompt = "Simulate 3 parallel sub-agents (Real Estate, Supply Chain, Marketing) responding to the goal. Output one bullet per agent.";
                const result = await llmFetchFn('fake-key', 'model', prompt, goal);
                return result.split('\n');
            }
            if (typeof document !== 'undefined') {
                document.getElementById('orchestrate-btn').addEventListener('click', async () => {
                    const text = document.getElementById('goal-input').value;
                    const mockFetch = async () => "- Real Estate: Locations secured.\n- Supply Chain: Vendors contracted.\n- Marketing: Ads deployed.";
                    const result = await orchestrateFranchise(text, mockFetch);
                    const ul = document.getElementById('orchestration-log');
                    ul.innerHTML = '';
                    result.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                    document.getElementById('results').classList.remove('hidden');
                });
            }
            if (typeof module !== 'undefined') module.exports = { orchestrateFranchise };
