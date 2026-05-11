function analyzeReplayData(replayData) {
    let mistakes = [];
    if (replayData.visionScore < 10) mistakes.push("Low vision score. Place more wards.");
    if (replayData.csPerMin < 6) mistakes.push("Poor farm rate. Focus on last-hitting.");
    if (replayData.deaths > 5) mistakes.push("High death count. Play more conservatively.");

    if (mistakes.length === 0) return "Excellent performance. Maintain current strategy.";
    return mistakes.join(" ");
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const finalFeedbackContainer = document.getElementById('final-feedback');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        const tools = {
            fetchReplayStats: async (id) => {
                appendLog(`Executing Tool: fetchReplayStats(${id})`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve({ visionScore: 5, csPerMin: 5.2, deaths: 7 });
                }, 1500));
            },
            generateFeedback: async (stats) => {
                appendLog(`Executing Tool: generateFeedback()`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve(analyzeReplayData(stats));
                }, 1500));
            }
        };

        runBtn.addEventListener('click', async () => {
            outputLog.innerHTML = '';
            finalFeedbackContainer.innerHTML = '';
            finalFeedbackContainer.classList.add('hidden');
            runBtn.disabled = true;

            const replayId = document.getElementById('replay-id').value;
            appendLog(`Starting Game Coach Agent for Replay: ${replayId}`, 'log-info');

            try {
                appendLog(`Thinking: First, I need to fetch the raw statistics from the replay file.`, 'log-thought');
                const stats = await tools.fetchReplayStats(replayId);
                appendLog(`Observation: Stats retrieved. Vision: ${stats.visionScore}, CS/Min: ${stats.csPerMin}, Deaths: ${stats.deaths}`, 'log-info');

                appendLog(`Thinking: I need to analyze these stats against high-elo benchmarks to identify mistakes.`, 'log-thought');
                const feedback = await tools.generateFeedback(stats);
                appendLog(`Observation: Analysis complete.`, 'log-info');

                appendLog(`Thinking: Task complete. Delivering tactical feedback to player.`, 'log-success');

                finalFeedbackContainer.innerHTML = `
                    <h3>Tactical Feedback</h3>
                    <p>${feedback}</p>
                `;
                finalFeedbackContainer.classList.remove('hidden');

            } catch (error) {
                appendLog(`Error during agent execution: ${error}`, 'log-error');
            } finally {
                runBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeReplayData };
}