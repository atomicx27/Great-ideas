const fs = require('fs');
const path = require('path');

const NEW_CSS = fs.readFileSync('new_modern_ux.css', 'utf-8');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'shared') {
                processDir(fullPath);
            }
        } else if (file === 'style.css') {
            let content = fs.readFileSync(fullPath, 'utf-8');
            const startIndex = content.indexOf('/* --- Modern UX & Animations Enhancements --- */');
            if (startIndex !== -1) {
                // Keep the part before the marker
                const before = content.substring(0, startIndex);
                content = before + NEW_CSS + '\n';
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('.');
