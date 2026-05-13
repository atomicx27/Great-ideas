// Standard EPA Conversion Factors (Deterministic)
const CONVERSION_FACTORS = {
    electricity: 0.000417, // Metric tons CO2e per kWh
    naturalGas: 0.0053,    // Metric tons CO2e per Therm
    flightMiles: 0.00016   // Metric tons CO2e per flight mile
};

function calculateEmissions(inputs) {
    const elecEmissions = inputs.electricity * CONVERSION_FACTORS.electricity;
    const gasEmissions = inputs.naturalGas * CONVERSION_FACTORS.naturalGas;
    const flightEmissions = inputs.flights * CONVERSION_FACTORS.flightMiles;

    const total = elecEmissions + gasEmissions + flightEmissions;

    return {
        total: total.toFixed(2),
        breakdown: {
            electricity: elecEmissions.toFixed(2),
            naturalGas: gasEmissions.toFixed(2),
            flights: flightEmissions.toFixed(2)
        }
    };
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const resultsOutput = document.getElementById('results-output');

        const inputs = {
            electricity: document.getElementById('elec-usage'),
            naturalGas: document.getElementById('gas-usage'),
            flights: document.getElementById('flights-usage')
        };

        const displayTotal = document.getElementById('total-co2');
        const displayBreakdown = document.getElementById('breakdown-details');

        calculateBtn.addEventListener('click', () => {
            const data = {
                electricity: parseFloat(inputs.electricity.value) || 0,
                naturalGas: parseFloat(inputs.naturalGas.value) || 0,
                flights: parseFloat(inputs.flights.value) || 0
            };

            const result = calculateEmissions(data);

            displayTotal.textContent = result.total;
            displayBreakdown.innerHTML = `
                <p><span>Electricity:</span> <span>${result.breakdown.electricity} MT CO2e</span></p>
                <p><span>Natural Gas:</span> <span>${result.breakdown.naturalGas} MT CO2e</span></p>
                <p><span>Flights:</span> <span>${result.breakdown.flights} MT CO2e</span></p>
            `;

            resultsOutput.style.display = 'block';
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateEmissions };
}