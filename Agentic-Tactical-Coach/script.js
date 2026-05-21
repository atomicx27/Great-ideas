// Agentic Tactical Coach - Autonomous Play Calling

const Tools = {
    queryOpponentTendencies: async (situation) => {
        return `DB_RESULT: Opponent blitzes 60% of the time in ${situation} situations.`;
    },
    analyzePlayerFatigue: async () => {
        return `SENSOR_RESULT: RB1 is at 65% stamina, WR1 is at 90% stamina.`;
    },
    simulatePlayOutcome: async (playType) => {
        if (playType.includes("Pass")) return "SIMULATION: High success probability against Cover 2 Zone using flood concepts.";
        return "SIMULATION: Low success probability, run box is stacked.";
    }
};

class TacticalCoachAgent {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.thoughtLog = [];
        this.toolLog = [];
    }

    logTool(toolName, input, result) {
        this.toolLog.push({ tool: toolName, input, result });
        if (typeof document !== 'undefined') {
            const list = document.getElementById('tools-log');
            const li = document.createElement('li');
            li.textContent = `> ${toolName}("${input}")\n${result}`;
            list.appendChild(li);
            list.scrollTop = list.scrollHeight;
        }
    }

    logThought(thought) {
        this.thoughtLog.push(thought);
        if (typeof document !== 'undefined') {
            const div = document.getElementById('thought-log');
            div.textContent += `\n[COACH] ${thought}\n`;
            div.scrollTop = div.scrollHeight;
        }
    }

    updateState(state, isDone = false) {
        if (typeof document !== 'undefined') {
            const stateEl = document.getElementById('agent-state');
            stateEl.textContent = state;
            if (isDone) {
                stateEl.className = 'state-done';
                document.getElementById('loader').classList.remove('active');
            } else {
                stateEl.className = 'state-thinking';
            }
        }
    }

    async generatePlay(situation) {
        this.updateState('Analyzing Situation...');
        this.logThought(`Goal: Call optimal play for: ${situation}`);

        this.updateState('Using Tool: queryOpponentTendencies');
        await new Promise(r => setTimeout(r, 800));
        let tendRes = await Tools.queryOpponentTendencies("late game, trailing");
        this.logTool('queryOpponentTendencies', 'late game, trailing', tendRes);
        this.logThought(`Opponent brings pressure. Need quick read options or max protect.`);

        this.updateState('Using Tool: analyzePlayerFatigue');
        await new Promise(r => setTimeout(r, 800));
        let fatigueRes = await Tools.analyzePlayerFatigue();
        this.logTool('analyzePlayerFatigue', 'current_roster', fatigueRes);
        this.logThought(`RB1 is tired. WR1 is fresh. Will target WR1 on the outside.`);

        this.updateState('Using Tool: simulatePlayOutcome');
        await new Promise(r => setTimeout(r, 800));
        let playType = "Quick Pass / Flood Concept";
        let simRes = await Tools.simulatePlayOutcome(playType);
        this.logTool('simulatePlayOutcome', playType, simRes);
        this.logThought(`Simulation confirms flood concept is optimal against their Cover 2.`);

        this.updateState('Generating Call Sheet...');

        const prompt = `
            You are an Agentic Tactical Coach.
            Situation: ${situation}
            Tendency Data: ${tendRes}
            Fatigue Data: ${fatigueRes}
            Simulation: ${simRes}

            Based on this data, provide a highly specific play call recommendation formatted in Markdown. Include the personnel grouping, the primary read, and the audible plan.
        `;

        let finalReport = "";
        try {
            if (typeof fetchLLMResponse === 'function') {
                finalReport = await fetchLLMResponse(prompt, this.provider, this.apiKey);
            } else {
                finalReport = `## Play Call Recommendation\n\n**Play:** Trips Right, Mesh Concept with WR1 on Corner route.\n\n**Primary Read:** WR1 against the Cover 2 safety.\n\n**Rationale:** Exploits fatigue mismatch and Cover 2 vulnerability.`;
            }
        } catch (error) {
            console.error("LLM Error:", error);
            finalReport = "## Play Call Recommendation (Fallback)\n\nError contacting LLM.\n\n**Recommended Play:** Quick Pass to WR1.";
        }

        this.updateState('Play Generated', true);
        return finalReport;
    }
}

async function startCoach() {
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('start-btn');
    const situation = document.getElementById('situation').value;
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('api-key').value;

    btn.disabled = true;
    document.getElementById('agent-workspace').classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');
    document.getElementById('loader').classList.add('active');
    document.getElementById('tools-log').innerHTML = '';
    document.getElementById('thought-log').innerHTML = '';

    const coach = new TacticalCoachAgent(provider, apiKey);
    const reportMarkdown = await coach.generatePlay(situation);

    const finalReportDiv = document.getElementById('final-report');
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        finalReportDiv.innerHTML = DOMPurify.sanitize(marked.parse(reportMarkdown));
    } else {
        finalReportDiv.textContent = reportMarkdown;
    }

    document.getElementById('results-panel').classList.remove('hidden');
    btn.disabled = false;
}

if (typeof document !== 'undefined') {
    document.getElementById('start-btn').addEventListener('click', startCoach);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TacticalCoachAgent, Tools };
}