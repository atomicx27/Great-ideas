// Core Logic (Testable)

const defaultPolicies = {
    maxDays: 30,
    categories: {
        electronics: { restockingFee: 0.15 },
        clothing: { restockingFee: 0 },
        software: { noReturnsIfOpened: true },
        perishable: { noReturns: true }
    }
};

function processReturnItem(item, policies = defaultPolicies) {
    let reasons = [];
    let isApproved = true;
    let requiresReview = false;

    // Check category specific policies first
    const catPolicy = policies.categories[item.category];

    if (catPolicy && catPolicy.noReturns) {
        return { approved: false, reasons: [{ type: 'fail', text: 'Category not eligible for returns.' }] };
    }

    if (item.category === 'software' && item.condition !== 'unopened') {
         return { approved: false, reasons: [{ type: 'fail', text: 'Opened software cannot be returned.' }] };
    }

    // Check time limits
    if (item.daysSince > policies.maxDays) {
        isApproved = false;
        reasons.push({ type: 'fail', text: `Return window of ${policies.maxDays} days has expired.` });
    } else {
        reasons.push({ type: 'pass', text: 'Within eligible return window.' });
    }

    // Check condition
    if (item.condition === 'damaged') {
        isApproved = false;
        reasons.push({ type: 'fail', text: 'Item damaged by customer.' });
    } else if (item.condition === 'opened_good') {
        reasons.push({ type: 'warn', text: 'Item opened. Restocking fee may apply.' });
    }

    if (item.condition === 'defective') {
        isApproved = true; // Override some rules if defective
        reasons = [{ type: 'pass', text: 'Item marked defective. Full refund approved.' }];
    }

    return { approved: isApproved, requiresReview, reasons };
}

function calculateRefundAmount(item, policies = defaultPolicies) {
    const decision = processReturnItem(item, policies);
    if (!decision.approved) return 0;

    if (item.condition === 'defective') return item.price; // Full refund

    let amount = item.price;
    const catPolicy = policies.categories[item.category];

    if (item.condition === 'opened_good' && catPolicy && catPolicy.restockingFee) {
        amount = amount - (amount * catPolicy.restockingFee);
    }

    return parseFloat(amount.toFixed(2));
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processReturnItem, calculateRefundAmount, defaultPolicies };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('return-form');
        const emptyState = document.getElementById('empty-state');
        const resultDisplay = document.getElementById('result-display');

        const statusIcon = document.getElementById('status-icon');
        const decisionText = document.getElementById('decision-text');
        const refundValue = document.getElementById('refund-value');
        const reasonList = document.getElementById('reason-list');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const item = {
                category: document.getElementById('item-category').value,
                price: parseFloat(document.getElementById('item-price').value),
                daysSince: parseInt(document.getElementById('days-since').value, 10),
                condition: document.getElementById('item-condition').value
            };

            const decision = processReturnItem(item);
            const refund = calculateRefundAmount(item);

            // Update UI
            emptyState.classList.add('hidden');
            resultDisplay.classList.remove('hidden');

            reasonList.innerHTML = '';
            decision.reasons.forEach(r => {
                const li = document.createElement('li');
                li.className = r.type;
                li.textContent = r.text;
                reasonList.appendChild(li);
            });

            if (decision.approved) {
                statusIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                statusIcon.className = 'status-indicator approved';
                decisionText.textContent = 'Return Approved';
            } else {
                statusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
                statusIcon.className = 'status-indicator rejected';
                decisionText.textContent = 'Return Rejected';
            }

            refundValue.textContent = `$${refund.toFixed(2)}`;
        });
    });
}
