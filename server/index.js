const express = require('express');
const cors = require('cors');
const dns = require('dns').promises;
const services = require('./services.json');
const heuristics = require('./heuristics');

const app = express();
const PORT = process.env.PORT || 3001;
const TIMEOUT_MS = 8000;
const DOMAIN_TLDS = ['com', 'io', 'dev', 'net', 'app', 'ai', 'xyz', 'co'];

app.use(cors());
app.use(express.json());

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function cacheKey(...parts) {
  return parts.join(':').toLowerCase();
}

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value) {
  cache.set(key, { ts: Date.now(), value });
}

function withUsername(template, username) {
  return template.replace(/\{username\}/g, encodeURIComponent(username));
}

function cleanUsername(raw) {
  return String(raw || '').replace(/[^a-zA-Z0-9-_.]/g, '');
}

function bodyIndicatesMissing(text, messages) {
  if (!text || !messages || !messages.length) return false;
  const lower = text.toLowerCase();
  return messages.some((msg) => lower.includes(String(msg).toLowerCase()));
}

function decideAvailability(service, status, text) {
  const hint = heuristics[service.id] || {};
  const unknownStatus = hint.unknownStatus || [];

  if (status === 404 || status === 410) {
    return { available: true, unknown: false };
  }
  if (status === 0) {
    return { available: false, unknown: true };
  }
  if (unknownStatus.includes(status)) {
    if (bodyIndicatesMissing(text, hint.errorMsg)) {
      return { available: true, unknown: false };
    }
    return { available: false, unknown: true };
  }
  if (bodyIndicatesMissing(text, hint.errorMsg)) {
    return { available: true, unknown: false };
  }
  if (status >= 200 && status < 400) {
    return { available: false, unknown: false };
  }
  if (status === 429 || status === 403 || status === 401) {
    return { available: false, unknown: true };
  }
  return { available: false, unknown: true };
}

async function fetchProbe(url, signal) {
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal,
      headers,
    });
  } catch (error) {
    throw error;
  }
  const contentType = response.headers.get('content-type') || '';
  let text = '';
  try {
    const raw = await response.text();
    text = raw.slice(0, 8000);
  } catch (_e) {
    text = '';
  }
  return { status: response.status, text, contentType, finalUrl: response.url };
}

async function checkService(service, username) {
  const profileUrl = withUsername(service.url, username);
  const probeUrl = withUsername(service.probe || service.url, username);
  const key = cacheKey('svc', service.id, username);
  const cached = getCached(key);
  if (cached) return { ...cached, cached: true };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const probe = await fetchProbe(probeUrl, controller.signal);
    const decision = decideAvailability(service, probe.status, probe.text);
    const result = {
      service: service.name,
      serviceId: service.id,
      available: decision.available,
      unknown: decision.unknown,
      status: probe.status,
      url: profileUrl,
      category: service.category,
    };
    setCached(key, result);
    return result;
  } catch (error) {
    const result = {
      service: service.name,
      serviceId: service.id,
      available: false,
      unknown: true,
      status: 0,
      url: profileUrl,
      category: service.category,
      error: error.name === 'AbortError' ? 'timeout' : 'network',
    };
    return result;
  } finally {
    clearTimeout(timer);
  }
}

async function checkDomain(label, tld) {
  const domain = `${label}.${tld}`.toLowerCase();
  const key = cacheKey('dom', domain);
  const cached = getCached(key);
  if (cached) return { ...cached, cached: true };

  try {
    await dns.resolve(domain);
    const result = { domain, tld, available: false, unknown: false };
    setCached(key, result);
    return result;
  } catch (error) {
    const code = error.code || '';
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'NXDOMAIN') {
      const result = { domain, tld, available: true, unknown: false };
      setCached(key, result);
      return result;
    }
    return { domain, tld, available: false, unknown: true, error: code || 'dns' };
  }
}

function buildSuggestions(username, limit = 8) {
  const base = cleanUsername(username);
  if (!base) return [];
  const year = String(new Date().getFullYear()).slice(-2);
  const extras = [
    `${base}${year}`,
    `${base}hq`,
    `${base}app`,
    `${base}dev`,
    `${base}io`,
    `the${base}`,
    `real${base}`,
    `its${base}`,
    `get${base}`,
    `${base}official`,
    `${base}x`,
    `${base}1`,
    `${base}2`,
    `${base}co`,
  ];
  const seen = new Set([base.toLowerCase()]);
  const out = [];
  extras.forEach((item) => {
    const key = item.toLowerCase();
    if (seen.has(key) || item.length < 2 || item.length > 30) return;
    seen.add(key);
    out.push(item);
  });
  return out.slice(0, limit);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'userdorking', developer: 'swayampandit' });
});

app.get('/api/services', (_req, res) => {
  res.json(
    services.map(({ id, name, category, color, url }) => ({
      id,
      name,
      category,
      color,
      url,
    })),
  );
});

app.get('/api/check/:serviceId/:username', async (req, res) => {
  const cleaned = cleanUsername(req.params.username);
  if (!cleaned) return res.status(400).json({ error: 'invalid username' });
  const service = services.find((s) => s.id === req.params.serviceId);
  if (!service) return res.status(404).json({ error: 'unknown service' });
  const result = await checkService(service, cleaned);
  res.json(result);
});

app.get('/api/search/:username', async (req, res) => {
  const cleaned = cleanUsername(req.params.username);
  if (!cleaned) return res.status(400).json({ error: 'invalid username' });
  const results = await Promise.all(services.map((s) => checkService(s, cleaned)));
  res.json({ username: cleaned, results });
});

app.get('/api/domains/:username', async (req, res) => {
  const cleaned = cleanUsername(req.params.username).replace(/[._]/g, '-');
  if (!cleaned) return res.status(400).json({ error: 'invalid username' });
  const domains = await Promise.all(DOMAIN_TLDS.map((tld) => checkDomain(cleaned, tld)));
  res.json({ username: cleaned, domains });
});

app.get('/api/suggest/:username', (req, res) => {
  const cleaned = cleanUsername(req.params.username);
  if (!cleaned) return res.status(400).json({ error: 'invalid username' });
  res.json({ username: cleaned, suggestions: buildSuggestions(cleaned) });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`userdorking api listening on ${PORT}`);
});
