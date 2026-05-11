// Simulated Triage Tools
const tools = {
    check_patient_history: (patientId) => {
        return { previousConditions: "None", allergies: "Penicillin" };
    },
    ask_followup_question: (question) => {
        // Mocking a specific scenario where we know the patient's symptoms
        if (question.includes("fever")) {
            return "Patient replies: Yes, I have a slight fever, around 101 F.";
        }
        return "Patient replies: No.";
    }
};

function generateTriageScore(symptoms, hasFever) {
    if (symptoms.includes('lower right abdomen') && hasFever) {
        return "Priority 1: Code Red - Suspected Appendicitis. Route to ER immediately.";
    }
    return "Priority 3: Standard Observation.";
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', () => {
            const task = document.getElementById('task-prompt').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Received Initial Report: "${task}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Lower right abdominal pain could be appendicitis. I need to check history and ask about fever.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog('Executing Tool: check_patient_history(ID: unknown)', 'log-action');
                const history = tools.check_patient_history('unknown');
                appendLog(`Observation: History: ${history.previousConditions}. Allergies: ${history.allergies}`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Executing Tool: ask_followup_question("Do you have a fever?")', 'log-action');
                const response = tools.ask_followup_question('fever');
                appendLog(`Observation: ${response}`, 'log-info');
            }, 4000);

            setTimeout(() => {
                appendLog('Thinking: Sharp lower right pain + fever = high likelihood of appendicitis.', 'log-thought');
                const result = generateTriageScore(task, true);
                appendLog(`Final Triage Decision: ${result}`, 'log-success');
                runBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, generateTriageScore };
}