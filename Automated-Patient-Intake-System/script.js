// Pure logic routing function
function determineRouting(age, symptom) {
    if (symptom === 'chest_pain') {
        if (age > 60) {
            return { department: 'Cardiology (Code Red)', urgent: true };
        }
        return { department: 'Cardiology (Standard)', urgent: false };
    }

    if (symptom === 'broken_bone') {
        return { department: 'Orthopedics', urgent: false };
    }

    if (symptom === 'fever' && age < 5) {
        return { department: 'Pediatrics (Urgent)', urgent: true };
    }

    if (symptom === 'rash') {
        return { department: 'Dermatology / General Practice', urgent: false };
    }

    return { department: 'General Triage Queue', urgent: false };
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('intake-form');
        const output = document.getElementById('routing-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const age = parseInt(document.getElementById('age').value);
            const symptom = document.getElementById('symptom').value;

            const result = determineRouting(age, symptom);

            const colorClass = result.urgent ? 'alert' : 'standard';

            output.innerHTML = `<p class="${colorClass}">Routed to: ${result.department}</p>`;
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineRouting };
}