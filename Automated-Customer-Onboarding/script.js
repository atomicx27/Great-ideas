// Deterministic Onboarding Logic
function processOnboarding(companySize, industry, planTier) {
    const steps = [];

    // Step 1: Account Creation (Always happens)
    steps.push({
        type: 'account',
        title: 'Provision Base Account',
        description: `Creating ${planTier.toUpperCase()} tier account infrastructure.`
    });

    // Step 2: Compliance Routing based on Industry
    if (industry === 'finance' || industry === 'healthcare') {
        steps.push({
            type: 'compliance',
            title: 'Trigger High-Security Compliance Check',
            description: `Industry (${industry}) requires HIPAA/SOC2 verification module activation.`
        });
    } else {
        steps.push({
            type: 'compliance',
            title: 'Standard Compliance Check',
            description: `Applying standard terms of service for ${industry} sector.`
        });
    }

    // Step 3: Support Assignment based on Size & Tier
    if (planTier === 'enterprise' || companySize > 500) {
        steps.push({
            type: 'support',
            title: 'Assign Dedicated Account Manager',
            description: `High-value client detected. Routing to Enterprise Support queue.`
        });
    } else {
        steps.push({
            type: 'support',
            title: 'Assign Standard Support',
            description: `Routing to self-serve onboarding and standard ticketing queue.`
        });
    }

    return steps;
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const resultsPanel = document.getElementById('results-panel');
        const stepsContainer = document.getElementById('onboarding-steps');

        processBtn.addEventListener('click', () => {
            const size = parseInt(document.getElementById('company-size').value, 10);
            const industry = document.getElementById('industry').value;
            const plan = document.getElementById('plan-tier').value;

            const steps = processOnboarding(size, industry, plan);

            stepsContainer.innerHTML = '';
            steps.forEach((step, index) => {
                const el = document.createElement('div');
                el.className = `step ${step.type} fade-up`;
                el.style.animationDelay = `${index * 0.15}s`;
                el.innerHTML = `
                    <h3>${index + 1}. ${step.title}</h3>
                    <p>${step.description}</p>
                `;
                stepsContainer.appendChild(el);
            });

            resultsPanel.classList.remove('hidden');
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { processOnboarding };
}