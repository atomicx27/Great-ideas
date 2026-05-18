// Standard deterministic emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
    electricity: 0.4, // kg CO2 per kWh
    flight: 150,     // kg CO2 per short-haul flight
    driving: 0.41    // kg CO2 per mile (avg car)
};

function calculateEmissions(electricity, flights, driving) {
    const electricityEmissions = electricity * EMISSION_FACTORS.electricity;
    const flightEmissions = flights * EMISSION_FACTORS.flight;
    const drivingEmissions = driving * EMISSION_FACTORS.driving;

    const total = electricityEmissions + flightEmissions + drivingEmissions;

    return {
        electricityEmissions,
        flightEmissions,
        drivingEmissions,
        total
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const electricityInput = document.getElementById('electricity');
        const flightsInput = document.getElementById('flights');
        const drivingInput = document.getElementById('driving');
        const resultsOutput = document.getElementById('results-output');
        const detailsContainer = document.getElementById('calculation-details');

        calculateBtn.addEventListener('click', () => {
            const electricity = parseFloat(electricityInput.value) || 0;
            const flights = parseFloat(flightsInput.value) || 0;
            const driving = parseFloat(drivingInput.value) || 0;

            const results = calculateEmissions(electricity, flights, driving);

            resultsOutput.classList.remove('hidden');
            detailsContainer.innerHTML = `
                <div class="calculation-item">Electricity: ${results.electricityEmissions.toFixed(2)} kg CO2</div>
                <div class="calculation-item">Flights: ${results.flightEmissions.toFixed(2)} kg CO2</div>
                <div class="calculation-item">Driving: ${results.drivingEmissions.toFixed(2)} kg CO2</div>
                <div class="total-emissions">Total Footprint: ${results.total.toFixed(2)} kg CO2</div>
            `;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateEmissions, EMISSION_FACTORS };
}