Live AI and CPCB setup
The prototype now includes a small Node backend in `server.mjs`.
Run
Install Node.js 18+.
Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` and `DATA_GOV_API_KEY`.
Export the variables in your terminal, then run:
```bash
node server.mjs
```
Open `http://localhost:8787`.
Endpoints
`GET /api/health` — shows whether Gemini and CPCB keys are configured.
`GET /api/city?city=Chennai` — fetches CPCB city readings or returns a labelled demo profile.
`POST /api/analyze` — sends a citizen description to Gemini or returns a labelled demo triage result.
The backend uses CPCB’s official data.gov.in resource `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`. Never commit `.env` or API keys to GitHub.