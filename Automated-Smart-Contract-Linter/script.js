if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('action-btn');
        const output = document.getElementById('output');

        btn.addEventListener('click', () => {
            output.textContent = 'Processing...';
            setTimeout(() => {
                output.textContent = 'Action completed successfully.\n[Simulated Result Output]';
            }, 500);
        });
    });
}

function runLogic(input) {
    if (!input) return { status: 'error', message: 'No input provided' };
    return { status: 'success', result: input.toUpperCase() };
}

if (typeof module !== 'undefined') {
    module.exports = { runLogic };
}
