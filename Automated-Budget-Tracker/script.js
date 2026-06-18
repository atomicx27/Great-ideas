function categorizeExpense(amount, type) {
    if (type === 'rent') return { category: 'Fixed Essential', warning: false };
    if (type === 'utilities') return { category: 'Variable Essential', warning: amount > 300 };
    if (type === 'groceries') return { category: 'Variable Essential', warning: amount > 500 };
    if (type === 'entertainment') return { category: 'Discretionary', warning: amount > 100 };
    return { category: 'Other', warning: amount > 50 };
}
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('expense-form');
        const output = document.getElementById('result-output');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;
            const result = categorizeExpense(amount, type);
            const warningClass = result.warning ? 'alert' : 'standard';
            const warningMsg = result.warning ? ' - Warning: High spending!' : '';
            output.innerHTML = `<p class="${warningClass}">Category: ${result.category}${warningMsg}</p>`;
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { categorizeExpense };
