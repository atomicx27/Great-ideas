function simulateAffinityCalculation(moleculeStructure) {
    // A simplified deterministic simulation of affinity based on length
    return Math.min(99, moleculeStructure.length * 5 + Math.floor(Math.random() * 10));
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const finalMoleculeContainer = document.getElementById('final-molecule');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        const tools = {
            proposeStructure: async (iteration) => {
                appendLog(`Executing Tool: proposeStructure(iteration: ${iteration})`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    let base = "C1=CC=C(C=C1)";
                    for(let i=0; i<iteration; i++) { base += "C(=O)O"; }
                    resolve(base);
                }, 1000));
            },
            calculateAffinity: async (structure) => {
                appendLog(`Executing Tool: calculateAffinity()`, 'log-action');
                return new Promise(resolve => setTimeout(() => {
                    resolve(simulateAffinityCalculation(structure));
                }, 1500));
            }
        };

        runBtn.addEventListener('click', async () => {
            outputLog.innerHTML = '';
            finalMoleculeContainer.innerHTML = '';
            finalMoleculeContainer.classList.add('hidden');
            runBtn.disabled = true;

            appendLog(`Starting Molecule Optimization Agent. Goal: Affinity > 85.`, 'log-info');

            try {
                let currentAffinity = 0;
                let iteration = 1;
                let bestStructure = "";

                while (currentAffinity <= 85 && iteration <= 5) {
                    appendLog(`Thinking: Iteration ${iteration}. I need to propose a new molecular structure.`, 'log-thought');
                    const structure = await tools.proposeStructure(iteration);
                    appendLog(`Observation: Proposed structure: ${structure}`, 'log-info');

                    appendLog(`Thinking: I need to calculate the binding affinity of this structure.`, 'log-thought');
                    currentAffinity = await tools.calculateAffinity(structure);
                    appendLog(`Observation: Calculated Affinity: ${currentAffinity}`, 'log-info');

                    bestStructure = structure;

                    if (currentAffinity > 85) {
                        appendLog(`Thinking: Affinity ${currentAffinity} is greater than 85. Optimization complete.`, 'log-success');
                        break;
                    } else {
                        appendLog(`Thinking: Affinity ${currentAffinity} is too low. I need to modify the structure.`, 'log-thought');
                        iteration++;
                    }
                }

                if (currentAffinity > 85) {
                    finalMoleculeContainer.innerHTML = `
                        <h3>Optimization Successful</h3>
                        <p><strong>Final Structure (SMILES):</strong> ${bestStructure}</p>
                        <p><strong>Estimated Affinity:</strong> ${currentAffinity}</p>
                    `;
                } else {
                    finalMoleculeContainer.innerHTML = `
                        <h3>Optimization Failed</h3>
                        <p>Could not reach target affinity within iteration limit. Best structure: ${bestStructure}</p>
                    `;
                }

                finalMoleculeContainer.classList.remove('hidden');
                appendLog('Agent Finished.', 'log-success');

            } catch (error) {
                appendLog(`Error during agent execution: ${error}`, 'log-error');
            } finally {
                runBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { simulateAffinityCalculation };
}