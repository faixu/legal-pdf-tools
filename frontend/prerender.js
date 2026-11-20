import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import http from 'http';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All routes that should be pre-rendered
const routes = [
  '/',
  '/bates-stamp-court-exhibits',
  '/redact-ssn-from-pdf',
  '/bates-number-discovery-documents',
  '/confidential-stamp-pdf',
  '/redact-bank-account-numbers-pdf',
  '/medical-records-hipaa-pdf-redaction',
  '/law-firm-pdf-exhibit-generator',
  '/guides',
  '/guides/what-is-bates-numbering-in-legal-discovery',
  '/guides/how-to-permanently-redact-pdf-without-metadata-leaks',
  '/guides/federal-court-exhibit-stamping-formatting-rules',
  '/guides/hipaa-and-pii-redaction-checklist-for-paralegals',
  '/privacy-policy',
  '/terms',
  '/about',
  '/contact',
];

// Simple HTTP server to serve dist folder
function createServer(distDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(distDir, req.url === '/' ? '/index.html' : req.url);

      // If no extension, assume it's a route and serve index.html
      if (!path.extname(filePath)) {
        filePath = path.join(distDir, req.url, 'index.html');
      }

      // If still no extension and not index.html, try adding /index.html
      if (!path.extname(filePath) && !filePath.endsWith('index.html')) {
        filePath = path.join(filePath, 'index.html');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Try index.html as fallback for SPA routes
          const indexPath = path.join(distDir, 'index.html');
          fs.readFile(indexPath, (err2, data2) => {
            if (err2) {
              res.writeHead(404);
              res.end('Not found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
            return;
          });
          return;
        }

        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.webmanifest': 'application/manifest+json',
        }[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    server.listen(port, () => {
      console.log(`Prerender server running on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', reject);
  });
}

async function prerender() {
  const distDir = path.join(__dirname, 'dist');
  const port = 34567; // Random high port

  console.log('Starting prerender server...');
  const server = await createServer(distDir, port);

  // Allow Chrome path to be configured via environment variable
  const executablePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const route of routes) {
      const url = `http://localhost:34567${route}`;
      console.log(`Prerendering: ${route}`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

      // Wait for React to hydrate - try multiple strategies
      try {
        await page.waitForFunction(() => {
          const root = document.getElementById('root');
          return root && (root.children.length > 0 || root.innerHTML.trim().length > 0);
        }, { timeout: 30000 });
      } catch (e) {
        console.log(`  Warning: Root hydration check timed out, proceeding anyway...`);
      }

      // Debug: log what we actually got
      const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'EMPTY');
      console.log(`  Root HTML length: ${rootHTML.length} chars`);

      const html = await page.content();

      // Save to dist folder
      const outputDir = path.join(distDir, route === '/' ? '' : route);
      fs.mkdirSync(outputDir, { recursive: true });

      const outputFile = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputFile, html);
      console.log(`✓ Prerendered: ${route}`);
    }
  } catch (error) {
    console.error('Prerendering failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('Prerendering complete!');
}

prerender().catch(console.error);