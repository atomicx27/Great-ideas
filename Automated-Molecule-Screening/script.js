function screenMolecule(weight, logp) {
    if (weight <= 0) {
        return { status: 'Rejected', message: 'Molecular weight must be positive.' };
    }

    // Applying simplified Lipinski's Rule of Five
    const maxWeight = 500;
    const maxLogP = 5;

    if (weight > maxWeight && logp > maxLogP) {
        return { status: 'Rejected', message: 'Fails Lipinski criteria: Weight > 500 and logP > 5.' };
    } else if (weight > maxWeight) {
        return { status: 'Rejected', message: 'Fails Lipinski criteria: Weight > 500.' };
    } else if (logp > maxLogP) {
        return { status: 'Rejected', message: 'Fails Lipinski criteria: logP > 5.' };
    } else {
        return { status: 'Approved', message: 'Passes basic Lipinski screening. Proceed to next phase.' };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('screening-form');
        const output = document.getElementById('screening-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('weight').value);
            const logp = parseFloat(document.getElementById('logp').value);

            const result = screenMolecule(weight, logp);

            output.innerHTML = `
                <p><strong>Status:</strong> <span style="color: ${result.status === 'Approved' ? 'green' : 'red'}; font-weight: bold;">${result.status}</span></p>
                <p><strong>Note:</strong> ${result.message}</p>
            `;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { screenMolecule };
}