const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

const server = http.createServer(async (req, res) => {

  logRequest(req);

  switch(req.url) {
    case '/':
      try {

        const halamanHTML = await fs.readFile('index.html', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(halamanHTML);

    } catch (error) {

        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Terjadi kesalahan internal server');
        console.error('Error membaca file:', error);

    }
      break;
    case '/health':

      const memory = {
        total: formatBytes(os.totalmem()),
        used: formatBytes(os.totalmem() - os.freemem()),
        free: formatBytes(os.freemem())
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(memory));

      break;
    default:

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('error 404: Halaman tidak ditemukan');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server berhasil dinyalakan di http://localhost:${PORT}`);
});

async function logRequest(req) {
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] ${req.method} ${req.url} FROM ${req.socket.remoteAddress}\n`;

  const logPath = path.join(__dirname, 'request.log');

  try {
    await fs.appendFile(logPath, logData);
  } catch (error) {
    console.error('Logging error', error);
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}