VayuSetu AI


VayuSetu AI is a simple, beautiful MVP for Problem Statement 02: Clean Air & Climate Resilience.
It combines citizen reports, official air-quality context, weather context, and AI triage to identify hyper-local pollution hotspots, forecast risk, and recommend authority action.
The overview now makes the judge-facing evidence chain explicit: AI risk assessment, predicted AQI graph, hotspot labels with AQI/risk, evidence used by AI, probabilistic source estimates, and a recommended authority action card.
Run it
Open `index.html` in a browser. It has no build step and no external dependency.
Product flow
Overview: click hotspots to inspect evidence, AI confidence, possible sources, and prediction.
Report pollution: submit a multilingual citizen report and optional image/voice input.
Forecast: view a six-hour risk forecast and an AI explanation of the drivers.
Authority & alerts: acknowledge, assign, notify, and follow a response sequence.
City network: demonstrate interoperable nodes sharing aggregated risk signals without raw citizen data.
Official data sources
CPCB real-time AQI catalogue: https://www.data.gov.in/catalog/real-time-air-quality-index
IMD rainfall catalogue: https://www.data.gov.in/catalog/rainfall-india
The bundled `data/air-quality-demo.json` is explicitly labelled as a demo snapshot. It is included so the prototype works reliably without an API key or CORS dependency. Replace it with an approved CPCB/API export for a live deployment and keep the source attribution.
All dashboard counts, hotspot values, forecasts, confidence scores, and alerts are visibly marked as demo/simulated values. They must not be presented as live emergency alerts or official CPCB forecasts.
Google AI integration required for final submission
The interface is ready for a backend endpoint such as `POST /api/analyse-report`. Send the citizen text, selected language, location, and image to Gemini/Vertex AI and return:
```json
{
"source": "industrial_smoke",
"severity": "high",
"confidence": 0.87,
"risk_score": 92,
"recommended_action": "inspect source within 6 hours"
}
```
Use Gemini Vision for image classification, Gemini for multilingual report summarisation, Google Speech-to-Text for voice reports, and deterministic application code for the final risk formula. The visible offline fallback keeps the demo usable while the real endpoint is being connected.
Demo disclosure
The map, forecast, and dashboard values are synthetic demonstration values. They must not be presented as live emergency alerts or official CPCB forecasts.
Submission preparation
[Submission checklist](SUBMISSION_CHECKLIST.md)
[Demo script](DEMO_SCRIPT.md)
[Pitch deck outline](PITCH_DECK_OUTLINE.md)
[Live backend setup](LIVE_SETUP.md)
For the final demo, show the complete story: citizen report → AI-assisted analysis → multi-signal evidence → city/area forecast → authority response → community notification. Keep the demo label visible whenever the values are simulated.