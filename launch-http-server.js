const { exec, spawn } = require('child_process');
const net = require('net');

const PORT = 8080;
const TARGET_URL = `http://localhost:${PORT}/blackJack.html`; 
const SERVER_COMMAND = `npx http-server -p ${PORT} ./src`;

// Check if the port is in use
function isPortInUse(port, callback) {
  const server = net.createServer();
  server.once('error', err => callback(err.code === 'EADDRINUSE'));
  server.once('listening', () => {
    server.close();
    callback(false);
  });
  server.listen(port);
}

isPortInUse(PORT, inUse => {
  if (!inUse) {
    console.log(`Starting http-server on port ${PORT}...`);
    const server = spawn(SERVER_COMMAND, {
      shell: true,
      stdio: 'inherit'
    });

    // Wait a moment before launching the browser
    setTimeout(() => {
      exec(`start "" "${TARGET_URL}"`); 
    }, 1500);
  } else {
    console.log(`http-server already running. Opening browser...`);
    exec(`start "" "${TARGET_URL}"`);
  }
});