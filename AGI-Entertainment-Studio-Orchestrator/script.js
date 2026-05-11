function synthesizeCampaign(prompt, writerData, videoData, marketingData) {
    return {
        concept: prompt,
        assets: [
            { role: "Scriptwriter", content: `Title: ${writerData.title}\nScript: ${writerData.script}` },
            { role: "Video Generation", content: `Prompt: ${videoData.prompt}\nStatus: Rendered ${videoData.duration}s MP4` },
            { role: "Marketing Strategy", content: `Target: ${marketingData.demographic}\nBudget Allocation: ${marketingData.budget}` }
        ]
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-agi-btn');
        const promptInput = document.getElementById('campaign-prompt');
        const masterStatus = document.getElementById('master-status');
        const swarmContainer = document.getElementById('swarm-container');
        const finalCampaign = document.getElementById('final-campaign');
        const campaignAssets = document.getElementById('campaign-assets');

        const agents = {
            writer: { box: document.getElementById('agent-writer'), status: document.querySelector('#agent-writer .status'), output: document.querySelector('#agent-writer .output') },
            video: { box: document.getElementById('agent-video'), status: document.querySelector('#agent-video .status'), output: document.querySelector('#agent-video .output') },
            marketing: { box: document.getElementById('agent-marketing'), status: document.querySelector('#agent-marketing .status'), output: document.querySelector('#agent-marketing .output') }
        };

        function appendLog(key, text) {
            const p = document.createElement('p');
            p.textContent = `> ${text}`;
            agents[key].output.appendChild(p);
            agents[key].output.scrollTop = agents[key].output.scrollHeight;
        }

        async function simulateAgent(key, steps) {
            agents[key].box.classList.add('active');
            agents[key].status.textContent = "Processing...";
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
                appendLog(key, step);
            }
            agents[key].status.textContent = "Task Complete.";
            agents[key].box.classList.remove('active');
        }

        runBtn.addEventListener('click', async () => {
            const prompt = promptInput.value.trim() || "Launch campaign";
            runBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            finalCampaign.style.display = 'none';
            campaignAssets.innerHTML = '';

            Object.values(agents).forEach(a => {
                a.output.innerHTML = '';
                a.status.textContent = "Pending...";
            });

            masterStatus.textContent = `Master Orchestrator: Parsing intent for "${prompt}"...`;
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Master Orchestrator: Goal parsed. Spawning specialized sub-agents...";

            const writerSteps = ["Analyzing tone requirements", "Drafting hook: 'Save the planet, from your couch.'", "Finalizing 30-second VO script"];
            const videoSteps = ["Extracting visual cues from script", "Generating prompts: 'cinematic lighting, modern living room, glowing green smart hub'", "Rendering 30s 4k video asset"];
            const marketingSteps = ["Identifying target: Millennials aged 25-40", "Analyzing competitor ad spend", "Allocating $50k budget across Instagram and TikTok"];

            await Promise.all([
                simulateAgent('writer', writerSteps),
                simulateAgent('video', videoSteps),
                simulateAgent('marketing', marketingSteps)
            ]);

            masterStatus.textContent = "Master Orchestrator: Agents completed. Synthesizing final campaign assets...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Master Orchestrator: Campaign Synthesis Complete. Ready for deployment.";

            const result = synthesizeCampaign(
                prompt,
                { title: "The Green Couch", script: "Save the planet, from your couch. Meet the new EcoHub." },
                { prompt: "cinematic lighting, modern living room, glowing green smart hub", duration: 30 },
                { demographic: "Millennials 25-40", budget: "$50,000 (IG/TikTok)" }
            );

            finalCampaign.style.display = 'block';

            result.assets.forEach(asset => {
                const div = document.createElement('div');
                div.className = 'campaign-item';
                div.innerHTML = `<strong>${asset.role} Output:</strong><div class="campaign-content">${asset.content.replace(/\n/g, '<br>')}</div>`;
                campaignAssets.appendChild(div);
            });

            runBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeCampaign };
}
