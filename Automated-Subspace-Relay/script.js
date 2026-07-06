// Deterministic Logic
function relaySubspaceSignal(packets) {
    let relayedCount = 0;
    const processed = [];

    for (let p of packets) {
        let status = 'Unknown';
        let className = 'packet-unknown';

        if (p.strength > 80 && p.integrity > 90) {
            status = 'Optimal (Relayed)';
            className = 'packet-optimal';
            relayedCount++;
        } else if (p.strength > 30 || p.integrity > 50) {
            status = 'Degraded (Buffered)';
            className = 'packet-degraded';
        } else {
            status = 'Lost (Dropped)';
            className = 'packet-lost';
        }

        processed.push({ ...p, status, className });
    }

    return { processed, relayedCount };
}

// DOM Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const relayBtn = document.getElementById('relay-btn');
        const statusText = document.getElementById('status-text');
        const packetList = document.getElementById('packet-list');

        const mockPackets = [
            { id: 'PKT-01', strength: 95, integrity: 99 },
            { id: 'PKT-02', strength: 45, integrity: 60 },
            { id: 'PKT-03', strength: 12, integrity: 20 },
            { id: 'PKT-04', strength: 85, integrity: 95 }
        ];

        relayBtn.addEventListener('click', () => {
            statusText.textContent = 'Status: Processing Queue...';
            statusText.style.color = 'var(--warning-color)';
            relayBtn.disabled = true;
            relayBtn.classList.add('running');
            packetList.innerHTML = '';

            setTimeout(() => {
                const results = relaySubspaceSignal(mockPackets);

                results.processed.forEach(p => {
                    const li = document.createElement('li');
                    li.className = p.className;
                    li.textContent = `Packet ${p.id}: Str ${p.strength}% | Int ${p.integrity}% -> ${p.status}`;
                    packetList.appendChild(li);
                });

                statusText.textContent = `Status: Complete. ${results.relayedCount} packets relayed optimally.`;
                statusText.style.color = 'var(--success-color)';
                relayBtn.disabled = false;
                relayBtn.classList.remove('running');
            }, 1200);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { relaySubspaceSignal };
}
