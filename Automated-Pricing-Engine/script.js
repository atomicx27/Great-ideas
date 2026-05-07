function calculatePrice(basePrice, competitorPrice) {
    const MIN_MARGIN_PRICE = basePrice * 0.8; // Cannot go below 20% discount

    if (competitorPrice < basePrice) {
        if (competitorPrice >= MIN_MARGIN_PRICE) {
            return {
                newPrice: competitorPrice,
                message: `Matched competitor price at $${competitorPrice}.`
            };
        } else {
            return {
                newPrice: MIN_MARGIN_PRICE,
                message: `Competitor price too low. Set to minimum margin price of $${MIN_MARGIN_PRICE}.`
            };
        }
    }

    return {
        newPrice: basePrice,
        message: `Competitor price is higher or equal. Maintained base price at $${basePrice}.`
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const basePriceInput = document.getElementById('base-price');
        const competitorPriceInput = document.getElementById('competitor-price');
        const priceDisplay = document.getElementById('new-price-display');
        const logArea = document.getElementById('log');

        function appendLog(msg) {
            const p = document.createElement('p');
            p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logArea.prepend(p);
        }

        calculateBtn.addEventListener('click', () => {
            const basePrice = parseFloat(basePriceInput.value);
            const competitorPrice = parseFloat(competitorPriceInput.value);

            if (isNaN(basePrice) || isNaN(competitorPrice)) {
                appendLog("Error: Invalid price input.");
                return;
            }

            const result = calculatePrice(basePrice, competitorPrice);

            priceDisplay.textContent = `New Price: $${result.newPrice.toFixed(2)}`;
            appendLog(result.message);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculatePrice };
}
