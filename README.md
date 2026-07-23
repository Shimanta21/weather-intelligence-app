# Weather Intelligence App

A lightweight, AI-generated Weather Intelligence App built in Google AI Studio using React and Vite. 
Users can search for any city to view:
- Current weather conditions (temperature, wind speed, condition)
- A 7-day forecast with max/min temperature and precipitation probability, visualized as charts
- Simple planning recommendations (e.g., carry an umbrella, stay hydrated, good day for outdoor activity)

Built entirely on public, keyless APIs:
- Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com/v1/search
- Open-Meteo Forecast API: https://api.open-meteo.com/v1/forecast

No API keys, secrets, or paid services are used. Deployed via Cloudflare Pages, connected directly to this GitHub repository.


Troubleshooting Notes:
- Cloudflare's dashboard defaulted to the Workers creation flow instead of Pages, 
  producing a .workers.dev URL initially instead of the required .pages.dev URL.
- Root cause: Cloudflare has merged Workers and Pages into a unified 
  "Workers & Pages" interface, with Workers shown as the primary path.
- Fix: On the "Create application" screen, a small link at the bottom 
  ("Looking to deploy Pages? Get started") routes to the correct Pages flow 
  with Git repository import and standard build configuration fields.
- Deleted the initial Worker project and recreated it correctly via Pages, 
  using Build command: npm run build, Build output directory: dist.
- Final deployment succeeded with a valid pages.dev URL.
