const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { freemem } = require('node:os');

const server = http.createServer(async (req, res) => {

});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

async function logRequest(req) {
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] ${req.method} ${req.url} FROM ${req.socket.remoteAddress}\n`;

  const logPath = path.join(__dirname, 'request.log');

  try {
    await fs.appendFile(logPath, logData);
  } catch (error) {
    console.error('Logging error: ', error);
  }
}

server.on('request', async (req, res) => {
  logRequest(req);

  if (req === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page'); 
  } else {
    res.writeHead(404);
    res.end('Page Not Found');
  }

  if (req === '/health') {
    const memory = {
      total: formatBytes(os.totalmem()),
      used: formatBytes(os.totalmem() - os.freemem()),
      free: formatBytes(os.freemem())
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(memory));
  }
});