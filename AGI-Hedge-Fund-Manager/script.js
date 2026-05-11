// Swarm logic for testing
function synthesizeReports(quantReport, macroReport, riskReport) {
    return {
        strategy: "Hybrid Market Neutral",
        allocation: {
            "Renewable ETF": quantReport.signal === 'BUY' ? "40%" : "20%",
            "Oil Majors Short": macroReport.inflationExpectation === 'HIGH' ? "40%" : "20%",
            "Cash/Treasuries": riskReport.volatility === 'HIGH' ? "20%" : "60%"
        }
    };
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            quant: { card: document.getElementById('agent-quant'), status: document.querySelector('#agent-quant .agent-status'), output: document.querySelector('#agent-quant .agent-output') },
            macro: { card: document.getElementById('agent-macro'), status: document.querySelector('#agent-macro .agent-status'), output: document.querySelector('#agent-macro .agent-output') },
            risk: { card: document.getElementById('agent-risk'), status: document.querySelector('#agent-risk .agent-status'), output: document.querySelector('#agent-risk .agent-output') }
        };

        function appendAgentLog(agentKey, message) {
            const p = document.createElement('p');
            p.textContent = `> ${message}`;
            agents[agentKey].output.appendChild(p);
            agents[agentKey].output.scrollTop = agents[agentKey].output.scrollHeight;
        }

        function setAgentState(agentKey, isActive, statusText) {
            agents[agentKey].status.textContent = statusText;
            if (isActive) {
                agents[agentKey].card.classList.add('active');
            } else {
                agents[agentKey].card.classList.remove('active');
            }
        }

        const simulateAgentProcessing = async (agentKey, steps) => {
            setAgentState(agentKey, true, "Processing...");
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 1000 + 400));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Pending...");
            });

            masterStatus.textContent = "Deconstructing Goal into Agent Tasks...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Spawning Sub-Agents for Parallel Execution";

            const quantSteps = ["Fetching P/E ratios for ICLN and XLE", "Running statistical arbitrage models", "Identifying momentum divergence: BUY Renewable, SELL Fossil"];
            const macroSteps = ["Analyzing CPI prints", "Evaluating Federal Reserve dot plot", "Inflation expectation: HIGH, favoring commodity shorts"];
            const riskSteps = ["Calculating portfolio Beta", "Stress-testing against 2008 oil shock data", "Volatility assessment: HIGH. Recommend cash buffer."];

            await Promise.all([
                simulateAgentProcessing('quant', quantSteps),
                simulateAgentProcessing('macro', macroSteps),
                simulateAgentProcessing('risk', riskSteps)
            ]);

            masterStatus.textContent = "Synthesizing Conflicting Data...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Orchestration Complete.";
            synthesisNode.style.display = 'block';

            const result = synthesizeReports(
                { signal: 'BUY' },
                { inflationExpectation: 'HIGH' },
                { volatility: 'HIGH' }
            );

            finalStrategy.innerHTML = `
                <p><strong>Strategy:</strong> ${result.strategy}</p>
                <p><strong>Proposed Allocation:</strong></p>
                <ul>
                    <li>Long Renewable Energy: ${result.allocation["Renewable ETF"]}</li>
                    <li>Short Fossil Fuels: ${result.allocation["Oil Majors Short"]}</li>
                    <li>Risk Buffer (Treasuries): ${result.allocation["Cash/Treasuries"]}</li>
                </ul>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeReports };
}