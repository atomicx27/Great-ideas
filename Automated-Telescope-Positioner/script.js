function calculateTrajectory(ra, dec, currentRa, currentDec) {
    const raDiff = ra - currentRa;
    const decDiff = dec - currentDec;

    let commands = [];
    if (Math.abs(raDiff) > 0.01) {
        commands.push(`Slew RA ${raDiff > 0 ? '+' : ''}${raDiff.toFixed(2)}h`);
    }
    if (Math.abs(decDiff) > 0.01) {
        commands.push(`Slew DEC ${decDiff > 0 ? '+' : ''}${decDiff.toFixed(2)}°`);
    }

    if (commands.length === 0) {
        commands.push('Target acquired. Tracking engaged.');
    }

    return {
        timestamp: new Date().toISOString().substring(11, 19),
        commands: commands
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const logOutput = document.getElementById('log-output');

        let currentRa = 5.0; // Initial simulated position
        let currentDec = 10.0;

        calculateBtn.addEventListener('click', () => {
            logOutput.innerHTML = '';

            const targets = [
                { name: 'Target Alpha', ra: 5.5, dec: 12.0 },
                { name: 'Target Beta', ra: 5.5, dec: 12.0 }, // Duplicate to test tracking
                { name: 'Target Gamma', ra: 10.2, dec: -5.4 }
            ];

            let delay = 0;
            targets.forEach(target => {
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = 'log-entry';
                    div.innerHTML = `<span style="color: #3498db;">[New Target]</span> ${target.name} (RA: ${target.ra}, DEC: ${target.dec})`;
                    logOutput.appendChild(div);

                    const result = calculateTrajectory(target.ra, target.dec, currentRa, currentDec);

                    result.commands.forEach(cmd => {
                        const cmdDiv = document.createElement('div');
                        cmdDiv.className = 'log-entry';
                        cmdDiv.innerHTML = `<span class="log-time">[${result.timestamp}]</span> CMD: ${cmd}`;
                        logOutput.appendChild(cmdDiv);
                    });

                    currentRa = target.ra;
                    currentDec = target.dec;
                    logOutput.scrollTop = logOutput.scrollHeight;
                }, delay);
                delay += 1000;
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTrajectory };
}
