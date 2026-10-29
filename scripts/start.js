const { spawn } = require('child_process');
const net = require('net');

const mockPort = 3001;
const mockHost = 'localhost';
const projectRoot = process.cwd();

let mockProcess = null;
let frontendProcess = null;
let shuttingDown = false;

function isPortOpen(port, host) {
  return new Promise((resolve) => {
    const socket = net.connect(port, host);

    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });

    socket.once('error', () => {
      resolve(false);
    });
  });
}

function waitForPort(port, host, timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      if (await isPortOpen(port, host)) {
        clearInterval(timer);
        resolve();
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        clearInterval(timer);
        reject(new Error(`Timed out waiting for ${host}:${port}`));
      }
    }, 300);
  });
}

function startProcess(command, args, label) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (shuttingDown) {
      return;
    }

    if (code !== 0) {
      console.error(`${label} exited with code ${code}`);
      shutdown(code || 1);
    }
  });

  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  const processes = [frontendProcess, mockProcess].filter(Boolean);

  for (const child of processes) {
    try {
      child.kill();
    } catch (error) {
      // ignore kill errors during shutdown
    }
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

(async () => {
  const mockAlreadyRunning = await isPortOpen(mockPort, mockHost);
  const frontendAlreadyRunning = await isPortOpen(3000, mockHost);

  if (!mockAlreadyRunning) {
    console.log(`Starting mock server on http://${mockHost}:${mockPort}...`);
    mockProcess = startProcess('npm', ['run', 'mock'], 'mock server');
    console.log('Mock server is starting in background...');
  } else {
    console.log(`Mock server already running on http://${mockHost}:${mockPort}`);
  }

  if (frontendAlreadyRunning) {
    console.log('React frontend already running on http://localhost:3000');

    if (!mockAlreadyRunning) {
      console.log('Mock server is now running; refresh the browser to load data.');
      return;
    }

    shutdown(0);
    return;
  }

  console.log('Starting React frontend...');
  frontendProcess = startProcess('npm', ['run', 'start:frontend'], 'frontend');
})().catch((error) => {
  console.error(error.message || error);
  shutdown(1);
});
