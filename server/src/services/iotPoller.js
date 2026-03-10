/**
 * IoT Polling Service for Zenzor API
 */

const { processTelemetryPayload } = require('../controllers/iotController');

const ZENZOR_EMAIL = 'admin@demo.com';
const ZENZOR_PASSWORD = 'Ademo';
const POLL_INTERVAL_MS = parseInt(process.env.IOT_POLL_INTERVAL_MS) || 30000;

let pollerInterval = null;
let isPolling = false;
let authCookie = null;

async function zenzorLogin() {
  const fetchFn = globalThis.fetch;
  if (!fetchFn) throw new Error('No fetch implementation available.');

  const loginPageRes = await fetchFn('http://zenzor.in/Account/Login');
  const loginHtml = await loginPageRes.text();
  const cookies = loginPageRes.headers.getSetCookie ? loginPageRes.headers.getSetCookie() : [];
  let cookieStr = cookies.map(c => c.split(';')[0]).join('; ');

  let token = '';
  const tokenMatch = loginHtml.match(/<input name="__RequestVerificationToken" type="hidden" value="([^"]+)"/);
  if (tokenMatch) {
    token = tokenMatch[1];
  }

  const params = new URLSearchParams();
  params.append('Email', ZENZOR_EMAIL);
  params.append('Password', ZENZOR_PASSWORD);
  if (token) {
    params.append('__RequestVerificationToken', token);
  }

  const loginRes = await fetchFn('http://zenzor.in/Account/SignIn', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieStr,
    },
    redirect: 'manual'
  });

  if (loginRes.status !== 302 && loginRes.status !== 200) {
    throw new Error(`Zenzor login failed with status ${loginRes.status}`);
  }

  const loginCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
  const allCookies = [...cookies, ...loginCookies];

  const cookieMap = {};
  for (const c of allCookies) {
    const parts = c.split(';')[0].split('=');
    if (parts.length >= 2) {
      cookieMap[parts[0]] = parts.slice(1).join('=');
    }
  }
  
  authCookie = Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join('; ');
  console.log('[IoT Poller] Zenzor Login Successful');
}

async function fetchZenzorData() {
  const fetchFn = globalThis.fetch;
  
  if (!authCookie) {
    await zenzorLogin();
  }

  // Fetch from GetAll to get data for all devices
  let response = await fetchFn('http://zenzor.in/DeviceHistory/GetAll?duration=1H', {
    headers: { 'Cookie': authCookie },
    signal: AbortSignal.timeout(10000)
  });

  if (response.status === 401 || response.status === 403 || response.redirected) {
    console.log('[IoT Poller] Session expired, re-logging in...');
    await zenzorLogin();
    response = await fetchFn('http://zenzor.in/DeviceHistory/GetAll?duration=1H', {
      headers: { 'Cookie': authCookie },
      signal: AbortSignal.timeout(10000)
    });
  }

  if (!response.ok) {
    throw new Error(`Zenzor API responded with status ${response.status}`);
  }

  const text = await response.text();
  // Sometimes Zenzor responds with HTML if unauthorized
  if (text.startsWith('<')) {
    authCookie = null; // force login next time
    throw new Error('Zenzor API returned HTML instead of JSON');
  }

  const data = JSON.parse(text);
  return Array.isArray(data) ? data : [data];
}

async function runPollCycle() {
  if (isPolling) return;
  isPolling = true;

  try {
    const dataArrays = await fetchZenzorData();
    let updated = 0;
    let errors = 0;

    for (const deviceData of dataArrays) {
      if (!Array.isArray(deviceData) || deviceData.length === 0) continue;
      
      // We only care about the latest point for the dashboard
      // Zenzor returns oldest first, so the latest is the last element
      const payload = deviceData[deviceData.length - 1];
      
      try {
        await processTelemetryPayload(payload);
        updated++;
      } catch (err) {
        errors++;
        console.error(`[IoT Poller] Error processing payload:`, err.message);
      }
    }

    if (updated > 0 || errors > 0) {
      console.log(`[IoT Poller] Cycle complete — updated: ${updated}, errors: ${errors}`);
    }
  } catch (err) {
    console.error('[IoT Poller] Cycle failed:', err.message);
  } finally {
    isPolling = false;
  }
}

function startPoller() {
  console.log(`[IoT Poller] Starting Zenzor polling every ${POLL_INTERVAL_MS / 1000}s`);
  runPollCycle();
  pollerInterval = setInterval(runPollCycle, POLL_INTERVAL_MS);
}

function stopPoller() {
  if (pollerInterval) {
    clearInterval(pollerInterval);
    pollerInterval = null;
    console.log('[IoT Poller] Stopped.');
  }
}

module.exports = { startPoller, stopPoller };
