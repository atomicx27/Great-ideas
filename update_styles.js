const fs = require('fs');
const path = require('path');

const NEW_CSS = `/* --- Modern UX & Animations Enhancements --- */
:root {
    --transition-speed: 0.5s; /* Changed */
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --hover-bg: rgba(59, 130, 246, 0.05); /* Added */
}

html {
    scroll-behavior: smooth;
}

body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 10px; /* Changed */
    height: 10px; /* Changed */
}
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05); /* Changed */
    border-radius: 5px; /* Changed */
}
::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.6); /* Changed */
    border-radius: 5px; /* Changed */
    border: 2px solid transparent; /* Added */
    background-clip: padding-box; /* Added */
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.9); /* Changed */
    border: 2px solid transparent; /* Added */
    background-clip: padding-box; /* Added */
}

/* Enhanced Buttons */
button {
    position: relative;
    overflow: hidden;
    transition: all var(--transition-speed) var(--ease-out-expo) !important;
    z-index: 1;
    border-radius: 8px; /* Added */
}

button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.15); /* Changed */
    transform: translateY(100%);
    transition: transform var(--transition-speed) var(--ease-out-expo);
    z-index: -1;
    border-radius: inherit; /* Added */
}

button:hover::after {
    transform: translateY(0);
}

button:hover {
    transform: translateY(-4px) scale(1.03); /* Changed */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); /* Changed */
}

button:active {
    transform: translateY(-1px) scale(0.97); /* Changed */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Changed */
}

/* Enhanced Inputs */
input, select, textarea {
    transition: all 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important; /* Changed */
    border-radius: 8px; /* Changed */
    background-color: rgba(255, 255, 255, 0.9); /* Added */
}

input:focus, select:focus, textarea:focus {
    outline: none !important;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3) !important; /* Changed */
    border-color: #3b82f6 !important;
    background-color: #ffffff !important; /* Added */
}

/* Cards & Containers Hover Effects */
.agent-card, .card {
    transition: transform 0.5s var(--ease-out-expo), box-shadow 0.5s var(--ease-out-expo), border-color 0.5s ease, background-color 0.5s ease !important; /* Changed */
    border-radius: 12px; /* Added */
}

.agent-card:hover, .card:hover {
    transform: translateY(-8px); /* Changed */
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important; /* Changed */
    border-color: rgba(59, 130, 246, 0.6) !important; /* Changed */
    background-color: var(--hover-bg) !important; /* Added */
}

/* Staggered Fade-Up Animations */
.container, section, .agent-card, .card, main {
    animation: fadeUpScale 0.8s var(--ease-out-expo) forwards; /* Changed */
    opacity: 0;
    will-change: opacity, transform;
}

@keyframes fadeUpScale {
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.92); /* Changed */
        filter: blur(4px); /* Added */
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0); /* Added */
    }
}

section:nth-child(1), .agent-card:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2), .agent-card:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3), .agent-card:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4), .agent-card:nth-child(4) { animation-delay: 0.4s; }
section:nth-child(5), .agent-card:nth-child(5) { animation-delay: 0.5s; }
section:nth-child(6), .agent-card:nth-child(6) { animation-delay: 0.6s; }

/* Glowing Text for Headers */
h1, h2 {
    transition: text-shadow 0.4s ease, color 0.4s ease; /* Changed */
}

h1:hover, h2:hover {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5); /* Changed */
    color: #e2e8f0; /* Added */
}

/* Pulse animation for active elements */
@keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); } /* Changed */
    70% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); } /* Changed */
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.active, .running {
    animation: pulseGlow 2.5s infinite; /* Changed */
}

/* Interactive List Items */ /* Added block */
li {
    transition: transform 0.3s ease, background-color 0.3s ease;
}

li:hover {
    transform: translateX(5px);
    background-color: rgba(59, 130, 246, 0.05);
    border-radius: 4px;
}
`;

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
