// Deterministic triage logic
const CRITICAL_SYMPTOMS = ['chest pain', 'unconscious', 'severe bleeding', 'breathing difficulty', 'stroke'];
const URGENT_SYMPTOMS = ['fever', 'fracture', 'burn', 'severe pain'];

function assessTriage(symptomsText) {
    if (!symptomsText || typeof symptomsText !== 'string') return { priority: 'Error', message: 'Invalid input' };

    const lowerText = symptomsText.toLowerCase();

    // Check critical first
    for (const symptom of CRITICAL_SYMPTOMS) {
        if (lowerText.includes(symptom)) {
            return { priority: 'CRITICAL', class: 'critical', matched: symptom, action: 'Immediate ER intervention required.' };
        }
    }

    // Check urgent
    for (const symptom of URGENT_SYMPTOMS) {
        if (lowerText.includes(symptom)) {
            return { priority: 'URGENT', class: 'urgent', matched: symptom, action: 'See a doctor within 24 hours.' };
        }
    }

    return { priority: 'ROUTINE', class: 'routine', matched: 'none', action: 'Schedule a regular check-up or monitor symptoms.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const symptomsInput = document.getElementById('symptoms-input');
        const resultsSection = document.getElementById('results-section');
        const resultOutput = document.getElementById('result-output');

        processBtn.addEventListener('click', () => {
            const text = symptomsInput.value;
            if (!text.trim()) return;

            processBtn.textContent = 'Assessing...';
            processBtn.disabled = true;

            setTimeout(() => {
                const result = assessTriage(text);
                resultsSection.classList.remove('hidden');

                resultOutput.innerHTML = `
                    <div class="priority-badge ${result.class}">Priority: ${result.priority}</div>
                    <p><strong>Primary triggering symptom:</strong> ${result.matched}</p>
                    <p><strong>Recommended Action:</strong> ${result.action}</p>
                `;

                processBtn.textContent = 'Assess Priority';
                processBtn.disabled = false;
            }, 600);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { assessTriage };
}
