// Available Telecom Plans
const PLANS = [
    {
        id: 'p1',
        name: 'Basic Starter',
        basePrice: 20,
        dataLimit: 2, // GB
        dataOverageRate: 10, // per GB
        minutesLimit: 500,
        minutesOverageRate: 0.10, // per minute
        intlIncluded: false,
        intlRate: 0.50 // per minute assumed flat if not included
    },
    {
        id: 'p2',
        name: 'Standard Value',
        basePrice: 40,
        dataLimit: 15,
        dataOverageRate: 5,
        minutesLimit: Infinity, // Unlimited
        minutesOverageRate: 0,
        intlIncluded: false,
        intlRate: 0.50
    },
    {
        id: 'p3',
        name: 'Premium Unlimited',
        basePrice: 70,
        dataLimit: Infinity,
        dataOverageRate: 0,
        minutesLimit: Infinity,
        minutesOverageRate: 0,
        intlIncluded: false,
        intlRate: 0.25
    },
    {
        id: 'p4',
        name: 'Global Executive',
        basePrice: 90,
        dataLimit: Infinity,
        dataOverageRate: 0,
        minutesLimit: Infinity,
        minutesOverageRate: 0,
        intlIncluded: true,
        intlRate: 0
    }
];

document.getElementById('usage-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const usage = {
        data: parseFloat(document.getElementById('data-usage').value),
        minutes: parseInt(document.getElementById('call-minutes').value),
        intl: document.getElementById('intl-calling').value === 'yes'
    };

    calculateCosts(usage);
});

function calculateCosts(usage) {
    // We'll assume a flat 60 mins of intl calling if they say 'yes' to making them regularly
    const INTL_MINS_ESTIMATE = usage.intl ? 60 : 0;

    const evaluatedPlans = PLANS.map(plan => {
        let cost = plan.basePrice;
        let overageDetails = [];

        // Data Overage
        if (usage.data > plan.dataLimit) {
            const dataOverage = Math.ceil(usage.data - plan.dataLimit);
            const dataCost = dataOverage * plan.dataOverageRate;
            cost += dataCost;
            overageDetails.push(`$${dataCost.toFixed(2)} data overage (${dataOverage}GB)`);
        }

        // Voice Overage
        if (usage.minutes > plan.minutesLimit) {
            const minOverage = usage.minutes - plan.minutesLimit;
            const minCost = minOverage * plan.minutesOverageRate;
            cost += minCost;
            overageDetails.push(`$${minCost.toFixed(2)} voice overage (${minOverage} mins)`);
        }

        // Intl Cost
        if (INTL_MINS_ESTIMATE > 0 && !plan.intlIncluded) {
            const intlCost = INTL_MINS_ESTIMATE * plan.intlRate;
            cost += intlCost;
            overageDetails.push(`$${intlCost.toFixed(2)} est. intl calls`);
        }

        return {
            ...plan,
            totalEstCost: cost,
            overageDetails: overageDetails
        };
    });

    // Sort by lowest cost
    evaluatedPlans.sort((a, b) => a.totalEstCost - b.totalEstCost);

    renderResults(evaluatedPlans);
}

function renderResults(plans) {
    const resultsSection = document.getElementById('results-section');
    const bestPlanCard = document.getElementById('best-plan-card');
    const otherPlansList = document.getElementById('other-plans-list');

    resultsSection.classList.remove('hidden');
    bestPlanCard.innerHTML = '';
    otherPlansList.innerHTML = '';

    const bestPlan = plans[0];
    bestPlanCard.innerHTML = createPlanHTML(bestPlan);

    // Render remaining plans
    for (let i = 1; i < plans.length; i++) {
        const div = document.createElement('div');
        div.className = 'plan-card';
        div.innerHTML = createPlanHTML(plans[i]);
        otherPlansList.appendChild(div);
    }
}

function createPlanHTML(plan) {
    const dataStr = plan.dataLimit === Infinity ? 'Unlimited' : `${plan.dataLimit} GB`;
    const minStr = plan.minutesLimit === Infinity ? 'Unlimited' : `${plan.minutesLimit} Mins`;
    const intlStr = plan.intlIncluded ? 'Included' : 'Pay-per-minute';

    let breakdownHTML = '';
    if (plan.overageDetails.length > 0) {
        breakdownHTML = `<div class="cost-breakdown">
            <strong>Estimated Extra Costs:</strong><br>
            ${plan.overageDetails.join('<br>')}
        </div>`;
    }

    return `
        <div class="plan-header">
            <div class="plan-name">${plan.name}</div>
            <div class="plan-price">$${plan.totalEstCost.toFixed(2)}<span style="font-size: 0.9rem; font-weight: normal;">/mo est.</span></div>
        </div>
        <div class="plan-details">
            <div>📡 Data: ${dataStr}</div>
            <div>📞 Voice: ${minStr}</div>
            <div>🌐 Intl: ${intlStr}</div>
            <div>💰 Base: $${plan.basePrice}/mo</div>
        </div>
        ${breakdownHTML}
    `;
}
