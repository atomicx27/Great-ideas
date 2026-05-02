if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const startBtn = document.getElementById('start-reporter-btn');
        const outputLog = document.getElementById('output-log');
        const topicInput = document.getElementById('topic-input');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        // Simulated Tools
        const tools = {
            searchNewsSources: async (query) => {
                appendLog(`Executing Tool: searchNewsSources("${query}")`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve("Found 3 recent articles regarding breakthroughs in qubit stability.");
                }, 1200));
            },
            factCheckClaim: async (claim) => {
                appendLog(`Executing Tool: factCheckClaim()`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve("Claim verified: Lab XYZ did achieve 99% fidelity.");
                }, 1000));
            },
            draftArticle: async (data) => {
                appendLog(`Executing Tool: draftArticle()`, 'log-action');
                return new Promise(resolve => setTimeout(() => resolve(
                    "Article drafted and saved to CMS."
                ), 1500));
            }
        };

        // Agent Simulation Logic
        startBtn.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const topic = topicInput.value;

            outputLog.innerHTML = '';
            appendLog(`Starting Reporter Agent. Provider: ${provider.toUpperCase()}`, 'log-info');
            appendLog(`Goal: Write factual report on "${topic}"`, 'log-info');
            startBtn.disabled = true;

            try {
                appendLog(`Thinking: I need to gather the latest information on the topic.`, 'log-thought');
                const searchResults = await tools.searchNewsSources(topic);
                appendLog(`Observation: ${searchResults}`, 'log-info');

                appendLog(`Thinking: I need to fact-check the main claims found in the articles before drafting.`, 'log-thought');
                const factCheckResult = await tools.factCheckClaim();
                appendLog(`Observation: ${factCheckResult}`, 'log-info');

                appendLog(`Thinking: The data is verified. I will now synthesize this into an article format.`, 'log-thought');
                const draftResult = await tools.draftArticle("Verified data on qubit stability.");
                appendLog(`Observation: ${draftResult}`, 'log-success');

                appendLog('Thinking: Article is complete and ready for publishing.', 'log-thought');
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
    module.exports = {};
}