import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('public/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function main() {
  console.log('Starting headless Chrome on port', PORT);
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1500,1150',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    BASE_URL
  ]);

  let isExiting = false;
  const cleanup = () => {
    if (!isExiting) {
      isExiting = true;
      try { chromeProc.kill(); } catch (e) {}
    }
  };
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        wsUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL from Chrome');
    cleanup();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  async function navigate(url) {
    await send('Page.navigate', { url });
    await sleep(4000);
  }

  async function capture(filename) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const fullPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(fullPath, buffer);
    console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
  }

  await send('Page.enable');
  await send('Runtime.enable');

  // STEP 1: NIGHT MODE HERO
  console.log('1. Capturing 01-roaster-night.png...');
  await sleep(4000);
  await evaluate(`
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    window.scrollTo({ top: 80, behavior: 'instant' });
  `);
  await sleep(1000);
  await capture('01-roaster-night.png');

  // STEP 2: DAY MODE HERO
  console.log('2. Capturing 02-roaster-day.png...');
  await evaluate(`
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    window.scrollTo({ top: 80, behavior: 'instant' });
  `);
  await sleep(1000);
  await capture('02-roaster-day.png');

  // STEP 3: DOSSIER RESULT VIA ?user=shadcn
  console.log('3. Navigating to roast result: ?user=shadcn...');
  await navigate(`${BASE_URL}/?user=shadcn`);
  await sleep(4500);
  await evaluate(`
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    window.scrollTo({ top: 560, behavior: 'instant' });
  `);
  await sleep(1500);
  console.log('Capturing 03-cyber-dossier-result.png...');
  await capture('03-cyber-dossier-result.png');

  // STEP 4: HUMILIATION HUB LEADERBOARD
  console.log('4. Scrolling to Humiliation Hub Leaderboard...');
  await evaluate(`
    const lb = document.getElementById('leaderboard') || Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Humiliation') || h.textContent.includes('Leaderboard'))?.closest('div');
    if (lb) {
      const rect = lb.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - 30, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 1250, behavior: 'instant' });
    }
  `);
  await sleep(1500);
  console.log('Capturing 04-humiliation-hub-leaderboard.png...');
  await capture('04-humiliation-hub-leaderboard.png');

  console.log('All 4 walkthrough screenshots captured successfully!');
  cleanup();
  process.exit(0);
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
