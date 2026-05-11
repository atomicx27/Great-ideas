// Simulated Swarm Agents
const Agents = {
    GenomicsExpert: async (patientData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let analysis = "No significant actionable variants detected.";
                if (patientData.toUpperCase().includes("BRCA1")) {
                    analysis = "Identified BRCA1 Pathogenic Variant. Confirms high risk for hereditary breast and ovarian cancer. Suggests potential susceptibility to PARP inhibitors.";
                }
                resolve({ role: 'Genomics', findings: analysis });
            }, 1200 + Math.random() * 500);
        });
    },

    Pharmacologist: async (patientData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let analysis = "Standard dosing protocols apply.";
                if (patientData.toUpperCase().includes("PENICILLIN")) {
                    analysis = "Alert: Penicillin allergy noted. Recommend alternative antibiotic prophylaxis if required. If considering PARP inhibitors, verify hepatic function panels prior to dosing.";
                } else if (patientData.toUpperCase().includes("BRCA1")) {
                     analysis = "Pharmacogenomic profile indicates suitability for targeted PARP inhibitor therapy (e.g., Olaparib).";
                }
                resolve({ role: 'Pharmacology', findings: analysis });
            }, 1500 + Math.random() * 500);
        });
    },

    OncologySpecialist: async (patientData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let analysis = "General oncological monitoring recommended.";
                if (patientData.toUpperCase().includes("STAGE II BREAST CANCER")) {
                    analysis = "Stage II Breast Cancer diagnosis: Indicates localized disease. Standard protocol includes surgical resection followed by adjuvant therapy. Requires genomic risk stratification to finalize systemic therapy plan.";
                }
                resolve({ role: 'Oncology', findings: analysis });
            }, 1000 + Math.random() * 500);
        });
    }
};

// Master Orchestrator Logic
async function orchestrateMedicinePlan(patientData, agents = Agents, callbacks = {}) {
    if (callbacks.onStart) callbacks.onStart();

    // Fire all agents in parallel
    const agentPromises = [
        agents.GenomicsExpert(patientData).then(res => {
            if (callbacks.onAgentComplete) callbacks.onAgentComplete('genomics', res.findings);
            return res;
        }),
        agents.Pharmacologist(patientData).then(res => {
            if (callbacks.onAgentComplete) callbacks.onAgentComplete('pharmacy', res.findings);
            return res;
        }),
        agents.OncologySpecialist(patientData).then(res => {
            if (callbacks.onAgentComplete) callbacks.onAgentComplete('oncology', res.findings);
            return res;
        })
    ];

    // Wait for the swarm to finish
    const results = await Promise.all(agentPromises);

    if (callbacks.onSynthesisStart) callbacks.onSynthesisStart();

    // Master Synthesis Logic (Simulated AGI synthesis)
    return new Promise(resolve => {
        setTimeout(() => {
            const genomics = results.find(r => r.role === 'Genomics').findings;
            const pharmacy = results.find(r => r.role === 'Pharmacology').findings;
            const oncology = results.find(r => r.role === 'Oncology').findings;

            let synthesis = `
                <p><strong>Clinical Overview:</strong> The swarm has analyzed the patient profile. The primary condition assessed is aligned with the Oncology specialist's findings regarding localized disease.</p>
                <p><strong>Genomic & Pharmacological Alignment:</strong> Based on the Genomics analysis (${genomics}), the Pharmacologist advises: ${pharmacy}.</p>
                <div style="margin-top: 15px; padding: 10px; background: rgba(79, 172, 254, 0.1); border-left: 3px solid #4facfe;">
                    <strong>Master Recommendation:</strong>
                    Proceed with localized surgical intervention as per Oncology protocol.
                    Adjuvant systemic therapy should strictly incorporate targeted therapies guided by the identified genomic variants, while adhering to the pharmacological allergy constraints.
                </div>
            `;
            resolve(synthesis);
        }, 1000);
    });
}

// UI Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const input = document.getElementById('patient-data');
        const masterOutput = document.getElementById('master-output');

        const uiElements = {
            genomics: { status: document.querySelector('#agent-genomics .agent-status'), output: document.querySelector('#agent-genomics .agent-output') },
            pharmacy: { status: document.querySelector('#agent-pharmacy .agent-status'), output: document.querySelector('#agent-pharmacy .agent-output') },
            oncology: { status: document.querySelector('#agent-oncology .agent-status'), output: document.querySelector('#agent-oncology .agent-output') }
        };

        btn.addEventListener('click', async () => {
            const data = input.value.trim();
            if (!data) return;

            btn.disabled = true;
            masterOutput.innerHTML = 'Orchestrating swarm...';

            const callbacks = {
                onStart: () => {
                    Object.keys(uiElements).forEach(key => {
                        uiElements[key].status.className = 'agent-status working';
                        uiElements[key].status.textContent = 'Analyzing...';
                        uiElements[key].output.textContent = '';
                    });
                },
                onAgentComplete: (agentId, findings) => {
                    uiElements[agentId].status.className = 'agent-status done';
                    uiElements[agentId].status.textContent = 'Complete';
                    uiElements[agentId].output.textContent = findings;
                },
                onSynthesisStart: () => {
                    masterOutput.innerHTML = '<span style="color: #4facfe;">All agents complete. Master synthesizing strategy...</span>';
                }
            };

            try {
                const finalPlan = await orchestrateMedicinePlan(data, Agents, callbacks);
                masterOutput.innerHTML = finalPlan;
            } catch (err) {
                masterOutput.innerHTML = `<span style="color: red;">Orchestration failed: ${err.message}</span>`;
            } finally {
                btn.disabled = false;
            }
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateMedicinePlan, Agents };
}