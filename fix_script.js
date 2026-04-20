const fs = require('fs');

const path = 'Time-Zone-Meeting-Scheduler/script.js';
let content = fs.readFileSync(path, 'utf8');

// Due to previous sed failure, we'll restore and rewrite the function correctly
// Let's just rewrite the script entirely for safety
