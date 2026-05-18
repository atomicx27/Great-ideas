// Simulated candidate responses
const candidateSimulation = {
    'React': "I use hooks mostly, specifically useEffect and useState. I've also worked with Context API for state management.",
    'Performance': "I try to memoize components using React.memo and useMemo for expensive calculations. I also lazy load routes.",
    'Testing': "I use Jest and React Testing Library to write unit and integration tests."
};

// Simulated tool APIs
const simulatedTools = {
    generateQuestion: async (topic) => {
        return `Tell me about your experience with ${topic} in a production environment.`;
    },
    evaluateAnswer: async (answer) => {
        const score = answer.length > 20 ? 'Pass' : 'Needs Improvement';
        return { score, notes: `Candidate provided sufficient detail.` };
    }
};

async function conductInterviewAgent(profile, llmConfig, updateStateCallback) {
    const log = (msg, type = 'info') => {
        if (updateStateCallback) updateStateCallback(msg, type);
    };

    log(`[AGENT STARTED] Goal: Conduct interview for ${profile}`);

    // Simulate Agent deciding what topics to cover based on profile
    log(`[THINKING] I need to break down the profile '${profile}' into core topics.`, 'tool-call');

    // Simulated LLM Call for topics
    let topics = ['React', 'Performance', 'Testing'];

    if (typeof fetchLLMResponse !== 'undefined') {
        log(`[API CALL] Requesting LLM to generate interview topics...`);
        try {
            const prompt = `Generate exactly 3 core technical topics to interview a candidate for the role of: ${profile}. Return a comma separated list.`;
            const llmResponse = await fetchLLMResponse(prompt, llmConfig);
            if (llmResponse) {
                topics = llmResponse.split(',').map(t => t.trim()).slice(0, 3);
            }
        } catch (e) {
            log(`[API ERROR] LLM failed, using fallback topics.`);
        }
    }

    log(`[DECISION] Will cover topics: ${topics.join(', ')}`);

    let report = `# Interview Report: ${profile}\n\n`;
    let totalScore = 0;

    for (const topic of topics) {
        log(`[ACTION] Calling tool: generateQuestion('${topic}')`, 'tool-call');
        const question = await simulatedTools.generateQuestion(topic);

        log(`[SIMULATION] Candidate answering question...`);
        // Simulate candidate answering
        const answer = candidateSimulation[topic] || "I have some basic experience with that.";

        log(`[ACTION] Calling tool: evaluateAnswer(...)`, 'tool-call');
        const evaluation = await simulatedTools.evaluateAnswer(answer);

        if(evaluation.score === 'Pass') totalScore++;

        report += `### Topic: ${topic}\n`;
        report += `**Q:** ${question}\n`;
        report += `**A:** ${answer}\n`;
        report += `**Evaluation:** ${evaluation.score} - ${evaluation.notes}\n\n`;

        // Artificial delay for UI effect
        await new Promise(r => setTimeout(r, 800));
    }

    const finalRecommendation = (totalScore / topics.length) >= 0.6 ? 'HIRE' : 'NO HIRE';
    report += `## Final Decision: ${finalRecommendation} (${totalScore}/${topics.length} Passed)\n`;

    log(`[AGENT FINISHED] Goal accomplished.`);

    return report;
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-interview-btn');
        const statusText = document.getElementById('status-text');
        const logContainer = document.getElementById('agent-log');
        const resultContainer = document.getElementById('interview-result');
        const profileInput = document.getElementById('candidate-profile');

        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');

        function updateLog(msg, type) {
            const div = document.createElement('div');
            div.className = `log-entry ${type}`;
            div.textContent = `> ${msg}`;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        startBtn.addEventListener('click', async () => {
            const profile = profileInput.value || 'General Developer';
            const llmConfig = {
                provider: providerSelect.value,
                apiKey: apiKeyInput.value
            };

            logContainer.innerHTML = '';
            resultContainer.style.display = 'none';
            statusText.textContent = 'Running';
            startBtn.disabled = true;

            const report = await conductInterviewAgent(profile, llmConfig, updateLog);

            statusText.textContent = 'Completed';
            startBtn.disabled = false;

            // Render markdown using marked and dompurify if available
            if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
                const rawHtml = marked.parse(report);
                const safeHtml = DOMPurify.sanitize(rawHtml);
                resultContainer.innerHTML = safeHtml;
            } else {
                 resultContainer.innerHTML = `<pre>${report}</pre>`;
            }

            resultContainer.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { conductInterviewAgent, simulatedTools };
}