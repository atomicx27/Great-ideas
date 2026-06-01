function calculateLoadBalance(solar, wind, demand) {
    const totalSupply = solar + wind;
    const actions = [];

    if (totalSupply === demand) {
        actions.push('Grid is perfectly balanced.');
    } else if (totalSupply > demand) {
        const excess = totalSupply - demand;
        actions.push(`Excess power of ${excess} MW detected.`);
        actions.push('Action: Route excess power to battery storage.');
    } else {
        const deficit = demand - totalSupply;
        actions.push(`Power deficit of ${deficit} MW detected.`);
        actions.push(`Action: Draw ${deficit} MW from reserve batteries to meet demand.`);
    }

    return actions;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const balanceBtn = document.getElementById('balance-btn');
        const solarInput = document.getElementById('solar-output');
        const windInput = document.getElementById('wind-output');
        const demandInput = document.getElementById('grid-demand');
        const resultsOutput = document.getElementById('results-output');
        const actionList = document.getElementById('action-list');

        balanceBtn.addEventListener('click', () => {
            const solar = parseFloat(solarInput.value) || 0;
            const wind = parseFloat(windInput.value) || 0;
            const demand = parseFloat(demandInput.value) || 0;

            const actions = calculateLoadBalance(solar, wind, demand);

            resultsOutput.classList.remove('hidden');
            actionList.innerHTML = '';

            actions.forEach(action => {
                const li = document.createElement('li');
                li.textContent = action;
                actionList.appendChild(li);
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateLoadBalance };
}