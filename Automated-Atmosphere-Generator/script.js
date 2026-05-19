function calculateInjection(currentCO2, targetCO2) {
    const diff = targetCO2 - currentCO2;
    // Simple deterministic rule: 1 ppm difference requires 10 tons of gas
    const amount = Math.abs(diff * 10);

    if (diff > 0) {
        return { type: "CO2 Injection", amount: amount };
    } else if (diff < 0) {
        return { type: "Oxygen/Nitrogen Dilution", amount: amount };
    } else {
        return { type: "None (Equilibrium)", amount: 0 };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const injectionType = document.getElementById('injection-type');
        const injectionAmount = document.getElementById('injection-amount');

        calculateBtn.addEventListener('click', () => {
            const current = parseFloat(document.getElementById('co2-level').value);
            const target = parseFloat(document.getElementById('target-co2').value);

            if (isNaN(current) || isNaN(target)) {
                alert("Please enter valid numbers.");
                return;
            }

            calculateBtn.disabled = true;
            statusText.innerText = "Status: Calculating...";
            resultsPanel.classList.add('hidden');

            setTimeout(() => {
                const result = calculateInjection(current, target);
                injectionType.innerText = result.type;
                injectionAmount.innerText = result.amount;

                statusText.innerText = "Status: Calculation Complete";
                resultsPanel.classList.remove('hidden');
                calculateBtn.disabled = false;
            }, 800);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { calculateInjection };
}
