document.addEventListener('DOMContentLoaded', () => {
    const networkLogs = document.getElementById('network-logs');
    const agentActions = document.getElementById('agent-actions');
    const simulateBtn = document.getElementById('simulate-attack-btn');
    const statusIndicator = document.getElementById('status-indicator');

    let isUnderAttack = false;

    // Routine log simulation
    setInterval(() => {
        if (!isUnderAttack) {
            addNetworkLog('INFO: Traffic normal. Server CPU 24%.');
        }
    }, 3000);

    function getTimeString() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    function addNetworkLog(message, isAlert = false) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        if (isAlert) logEntry.style.color = '#f87171';

        const safeMessage = DOMPurify.sanitize(message);
        logEntry.innerHTML = `<span class="log-time">[${getTimeString()}]</span> ${safeMessage}`;

        networkLogs.appendChild(logEntry);
        networkLogs.scrollTop = networkLogs.scrollHeight;
    }

    function addAgentAction(message, isMitigated = false) {
        const actionEntry = document.createElement('div');
        actionEntry.className = `agent-action ${isMitigated ? 'mitigated' : ''}`;

        const safeMessage = DOMPurify.sanitize(message);
        actionEntry.textContent = `> ${safeMessage}`;

        agentActions.appendChild(actionEntry);
        agentActions.scrollTop = agentActions.scrollHeight;
    }

    async function simulateAgentResponse() {
        addAgentAction('Anomaly detected. Initiating diagnostic tools...');
        await sleep(1500);

        addAgentAction('Analyzing payload signature. Attempted SQL Injection matched with known CVE-2023-XXXX.');
        await sleep(1500);

        addAgentAction('Evaluating impact. Database access attempted but blocked by WAF. Source IP identified: 192.168.1.105');
        await sleep(1500);

        addAgentAction('Executing mitigation protocol: Blacklisting IP on edge router.');
        addNetworkLog('WARN: Firewall rule updated. IP 192.168.1.105 blocked.', true);
        await sleep(2000);

        addAgentAction('Threat neutralized. Generating incident report and restoring normal monitoring status.', true);

        statusIndicator.textContent = 'Safe';
        statusIndicator.className = 'status safe';
        isUnderAttack = false;
        simulateBtn.disabled = false;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    simulateBtn.addEventListener('click', () => {
        isUnderAttack = true;
        simulateBtn.disabled = true;

        statusIndicator.textContent = 'Threat Detected';
        statusIndicator.className = 'status danger';

        addNetworkLog('CRITICAL: Multiple failed login attempts and malformed queries detected from 192.168.1.105!', true);

        simulateAgentResponse();
    });
});