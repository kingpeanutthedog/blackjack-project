const { exec } = require('child_process');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/blackJack.html'); // replace with your file
exec(`start "" "${filePath}"`); // "start" for Windows; use "open" for macOS or "xdg-open" for Linux