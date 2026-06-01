const fs = require('fs');
const content = fs.readFileSync('AI-Email-Copilot/style.css', 'utf-8');
const startIndex = content.indexOf('/* --- Modern UX & Animations Enhancements --- */');
console.log("Start index:", startIndex);
if (startIndex !== -1) {
    console.log(content.substring(startIndex, startIndex + 500));
}
