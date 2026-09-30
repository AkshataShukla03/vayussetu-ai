import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8787);
const geminiKey = process.env.GEMINI_API_KEY || '';
const cpcbKey = process.env.DATA_GOV_API_KEY || '';
const cpcbResource = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';

const demo = {
  Chennai: { city: 'Chennai', region: 'Chennai North', aqi: 198, pm25: 118, predictedAqi: 270, risk: 'High', alerts: 2 },
  Delhi: { city: 'Delhi', region: 'Delhi NCR', aqi: 176, pm25: 96, predictedAqi: 214, risk: 'High', alerts: 1 },
  Mumbai: { city: 'Mumbai', region: 'Mumbai Metropolitan Region', aqi: 112, pm25: 54, predictedAqi: 138, risk: 'Moderate', alerts: 0 },
  Indore: { city: 'Indore', region: 'Indore Urban Region', aqi: 84, pm25: 39, predictedAqi: 126, risk: 'Moderate', alerts: 1 }
};

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

async function fetchCpcb(city) {
  if (!cpcbKey) return { ...demo[city] || demo.Chennai, mode: 'demo', source: 'CPCB adapter not configured' };
  const url = `https://api.data.gov.in/resource/${cpcbResource}?api-key=${encodeURIComponent(cpcbKey)}&format=json&limit=100&filters[city]=${encodeURIComponent(city)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CPCB request failed${response.status}`);
  const payload = await response.json();
  const rows = payload.records || [];
  const values = rows.map(row => Number(row.aqi)).filter(Number.isFinite).filter(value => value > 0);
  const aqi = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : (demo[city] || demo.Chennai).aqi;
  const base = demo[city] || demo.Chennai;
  return { ...base, aqi, stationCount: rows.length, mode: 'live', source: 'CPCB real-time AQI' };
}

async function analyzeWithGemini(input) {
  if (!geminiKey) return { ...input, detectedEvent: 'Smoke plume', possibleSource: 'Waste burning', severity: 'High', confidence: 0.82, mode: 'demo' };
  const prompt = `You are an environmental incident triage assistant for India. Return JSON only with keys detectedEvent, possibleSource, severity, confidence, recommendedAction, summary. Do not identify a specific person or make a medical diagnosis. Report: ${input.description || ''}. Location: ${input.location || 'unknown'}. Language: ${input.language || 'English'}.`;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } }) });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return { ...JSON.parse(text), mode: 'live' };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, gemini: Boolean(geminiKey), cpcb: Boolean(cpcbKey) });
    if (req.method === 'GET' && url.pathname === '/api/city') return json(res, 200, await fetchCpcb(url.searchParams.get('city') || 'Chennai'));
    if (req.method === 'POST' && url.pathname === '/api/analyze') return json(res, 200, await analyzeWithGemini(await body(req)));
    if (req.method === 'GET') {
      const requested = url.pathname === '/' ? '/index.html' : url.pathname;
      const file = path.join(root, requested.replace(/^\/+/, ''));
      if (!file.startsWith(root) || !fs.existsSync(file)) return json(res, 404, { error: 'Not found' });
      return res.end(fs.readFileSync(file));
    }
    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) { return json(res, 502, { error: error.message, mode: 'demo-fallback-available' }); }
});

server.listen(port, () => console.log(`VayuSetu running at http://localhost:${port}`));



 
  