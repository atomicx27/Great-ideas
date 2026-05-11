// Pure logic functions
function compileReport(salesData, expensesData) {
    const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalSales - totalExpenses;

    return {
        totalSales,
        totalExpenses,
        netIncome,
        profitMargin: totalSales > 0 ? ((netIncome / totalSales) * 100).toFixed(2) : '0.00'
    };
}

function generateReportHTML(reportData) {
    return `
        <h3>Q3 Financial Summary</h3>
        <table class="report-table">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Sales</td><td>$${reportData.totalSales.toLocaleString()}</td></tr>
            <tr><td>Total Expenses</td><td>$${reportData.totalExpenses.toLocaleString()}</td></tr>
            <tr><td>Net Income</td><td>$${reportData.netIncome.toLocaleString()}</td></tr>
            <tr><td>Profit Margin</td><td>${reportData.profitMargin}%</td></tr>
        </table>
    `;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const generateBtn = document.getElementById('generate-report-btn');
        const reportOutput = document.getElementById('report-output');

        const mockSales = [
            { department: 'North America', amount: 500000 },
            { department: 'Europe', amount: 350000 },
            { department: 'Asia', amount: 200000 }
        ];

        const mockExpenses = [
            { category: 'Payroll', amount: 400000 },
            { category: 'Marketing', amount: 150000 },
            { category: 'Operations', amount: 200000 }
        ];

        generateBtn.addEventListener('click', () => {
            reportOutput.innerHTML = '<p>Compiling data...</p>';

            setTimeout(() => {
                const report = compileReport(mockSales, mockExpenses);
                reportOutput.innerHTML = generateReportHTML(report);
            }, 800); // Simulate processing time
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { compileReport, generateReportHTML };
}