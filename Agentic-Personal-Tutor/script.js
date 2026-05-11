document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById('provider-select');
    const apiKeyGroup = document.getElementById('api-key-group');
    const modelGroup = document.getElementById('model-group');
    const startBtn = document.getElementById('start-tutor-btn');
    const outputLog = document.getElementById('output-log');
    const topicInput = document.getElementById('topic-input');

    // UI Logic for Provider Selection
    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'ollama') {
            apiKeyGroup.style.display = 'none';
            modelGroup.style.display = 'block';
        } else {
            apiKeyGroup.style.display = 'block';
            modelGroup.style.display = 'none';
        }
    });

    function appendLog(message, type = 'log-info') {
        const p = document.createElement('p');
        p.className = type;
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; // Secure DOM update
        outputLog.appendChild(p);
        outputLog.scrollTop = outputLog.scrollHeight;
    }

    // Simulated Tools
    const tools = {
        askStudentQuestion: async (question) => {
            appendLog(`Executing Tool: askStudentQuestion("${question}")`, 'log-action');
            // Simulate student answer (in a real app, this would prompt the user)
            return new Promise(resolve => setTimeout(() => {
                const answer = "I think it is how plants make food using sunlight.";
                appendLog(`Student answered: "${answer}"`, 'log-info');
                resolve(answer);
            }, 1500));
        },
        evaluateUnderstanding: async (topic, studentAnswer) => {
            appendLog(`Executing Tool: evaluateUnderstanding("${topic}")`, 'log-action');
            return new Promise(resolve => setTimeout(() => resolve(
                JSON.stringify({ score: 8, feedback: "Good basic understanding, but missing details about water and CO2." })
            ), 1000));
        },
        provideCorrection: async (correction) => {
            appendLog(`Executing Tool: provideCorrection("${correction}")`, 'log-action');
            return new Promise(resolve => setTimeout(() => resolve(
                "Correction delivered to student."
            ), 1000));
        }
    };

    // Agent Simulation Logic
    startBtn.addEventListener('click', async () => {
        const provider = providerSelect.value;
        const topic = topicInput.value;

        outputLog.innerHTML = '';
        appendLog(`Starting Agentic Tutor. Provider: ${provider.toUpperCase()}`, 'log-info');
        appendLog(`Goal: Ensure student understands "${topic}"`, 'log-info');
        startBtn.disabled = true;

        try {
            appendLog(`Thinking: I need to gauge the student's initial understanding of ${topic}.`, 'log-thought');
            const studentAnswer = await tools.askStudentQuestion(`Can you explain what ${topic} is in your own words?`);

            appendLog(`Thinking: I need to evaluate the student's answer to see if they understand the key concepts.`, 'log-thought');
            const evaluationStr = await tools.evaluateUnderstanding(topic, studentAnswer);
            const evaluation = JSON.parse(evaluationStr);
            appendLog(`Observation: Evaluation result: ${evaluation.feedback} (Score: ${evaluation.score}/10)`, 'log-info');

            appendLog(`Thinking: The student has a basic understanding but needs correction on specific details.`, 'log-thought');
            const correctionResult = await tools.provideCorrection(`That's a great start! Just remember that plants also need water and Carbon Dioxide (CO2) from the air to complete the process of ${topic}.`);
            appendLog(`Observation: ${correctionResult}`, 'log-success');

            appendLog('Thinking: The student has reached the required understanding threshold. Goal complete.', 'log-thought');
            appendLog('Agent Finished.', 'log-success');

        } catch (error) {
            appendLog(`Error during agent execution: ${error}`, 'log-error');
        } finally {
            startBtn.disabled = false;
        }
    });
});