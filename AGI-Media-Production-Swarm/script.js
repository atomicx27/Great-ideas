if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-orchestrator-btn');
        const outputLog = document.getElementById('output-log');
        const projectInput = document.getElementById('project-input');

        const agents = {
            master: document.getElementById('agent-master'),
            script: document.getElementById('agent-script'),
            assets: document.getElementById('agent-assets'),
            editor: document.getElementById('agent-editor')
        };

        function setAgentStatus(agentKey, statusText, stateClass) {
            const el = agents[agentKey];
            el.className = `agent-node ${stateClass}`;
            el.querySelector('.status').textContent = statusText;
        }

        const simulatePipelineStep = async (key, taskName, delay) => {
            setAgentStatus(key, taskName, 'status-active');
            await new Promise(r => setTimeout(r, delay));
            setAgentStatus(key, 'Done', 'status-complete');
        };

        startBtn.addEventListener('click', async () => {
            const goal = projectInput.value;
            outputLog.innerHTML = '';
            startBtn.disabled = true;

            // Reset
            Object.keys(agents).forEach(k => setAgentStatus(k, 'Waiting', ''));

            try {
                // Master analyzes
                await simulatePipelineStep('master', 'Planning', 1500);

                // Scripting phase
                await simulatePipelineStep('script', 'Writing', 2000);

                // Assets phase (depends on script usually, simulated sequentially here for pipeline visualization)
                await simulatePipelineStep('assets', 'Generating', 2500);

                // Editor phase
                await simulatePipelineStep('editor', 'Rendering', 3000);

                // Master finalizes
                setAgentStatus('master', 'Finalizing', 'status-active');
                await new Promise(r => setTimeout(r, 1000));
                setAgentStatus('master', 'Complete', 'status-complete');

                const finalReport = `PROJECT COMPLETE.\n\nGoal: ${goal}\n\nDeliverables:\n- script.md generated\n- 12 image assets generated\n- voiceover.mp3 synthesized\n- final_video.mp4 rendered and exported.`;
                outputLog.textContent = finalReport;

            } catch (error) {
                outputLog.textContent = `CRITICAL FAILURE: ${error}`;
            } finally {
                startBtn.disabled = false;
            }
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}