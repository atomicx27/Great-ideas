async function stabilizeWormhole(fluctuationFreq) {
    if (fluctuationFreq > 10000) {
        return { action: 'MAX_INJECTION', message: 'Critical throat collapse imminent. Injecting maximum exotic matter.' };
    } else if (fluctuationFreq > 2000) {
        return { action: 'PULSED_INJECTION', message: 'Throat destabilizing. Commencing pulsed exotic matter injection.' };
    }
    return { action: 'MONITORING', message: 'Throat stable. Maintaining negative mass equilibrium.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('stabilize-btn');
        const freqInput = document.getElementById('fluctuations');
        const logs = document.getElementById('logs');

        btn.addEventListener('click', async () => {
            const freq = parseFloat(freqInput.value);

            const logEntry = document.createElement('div');
            logEntry.textContent = 'Agent analyzing throat geometry...';
            logEntry.className = 'fade-in';
            logs.appendChild(logEntry);

            setTimeout(async () => {
                const result = await stabilizeWormhole(freq);
                const resultEntry = document.createElement('div');
                resultEntry.innerHTML = `<strong>Action:</strong> ${result.action} - ${result.message}`;
                resultEntry.className = 'fade-in';

                if (result.action === 'MAX_INJECTION') resultEntry.style.color = '#c0392b';
                else if (result.action === 'PULSED_INJECTION') resultEntry.style.color = '#f39c12';
                else resultEntry.style.color = '#27ae60';

                logs.appendChild(resultEntry);
                logs.scrollTop = logs.scrollHeight;
            }, 600);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { stabilizeWormhole };
}
