# D&D Hero Generator

A small React + Vite app to generate a fantasy D&D-style hero with a portrait, themed background, basic backstory, and point‑buy ability scores. Built with Tailwind CSS and Framer Motion for a smooth, modern UI.

## Features
- Hero form: name, optional description, and class selection
- Point‑buy allocator for STR/DEX/CON/INT/WIS/CHA (10 points)
- Animated loading state and transitions (Framer Motion)
- Result view with portrait, background, class, description, and stats
- Simple context store to pass data between pages

## Tech Stack
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Framer Motion

## Getting Started

Prerequisites:
- Node.js 18+

Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run dev
```
Vite serves the app (default at http://localhost:5173).

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure
```
.
├─ index.html               # App HTML entry
├─ package.json             # Scripts and dependencies
├─ tailwind.config.js       # Tailwind setup
├─ postcss.config.js        # PostCSS setup
├─ src/
│  ├─ main.jsx              # React root + Router
│  ├─ App.jsx               # Routes and layout
│  ├─ index.css             # Tailwind + theme styles
│  ├─ api/
│  │  └─ generateHero.js    # Simulated hero generation API
│  ├─ context/
│  │  └─ HeroContext.jsx    # Minimal context for hero data
│  ├─ components/
│  │  └─ StatAllocator.jsx  # Point‑buy allocator UI
│  └─ pages/
│     ├─ FormPage.jsx       # Input form and submit
│     └─ ResultPage.jsx     # Result view with images and stats
```

## Notes
- The hero generation uses placeholder images (Unsplash) and a simulated API delay.
- Adjust the point pool in `src/components/StatAllocator.jsx` via the `pool` prop if needed.

## License
This project is for educational/demo purposes. Add a license if you plan to distribute.
## Backend (n8n) Integration

The app posts hero requests to an n8n Webhook.

- Env var: `VITE_N8N_WEBHOOK_URL` (see `.env.example`).
- Default (if not set): `https://n8n.simeontsvetanovn8nworkflows.site/webhook/1be15846-8a97-43a1-a3e0-8fc393a95779`

Frontend request payload:
```json
{
  "name": "Aranel the Swift",
  "description": "(optional) short prompt",
  "class": "Warrior|Mage|Healer|Rogue|Ranger|Paladin",
  "stats": { "STR": 2, "DEX": 3, "CON": 1, "INT": 1, "WIS": 2, "CHA": 1 }
}
```
Expected response JSON (what the UI consumes):
```json
{
  "hero_image": "https://.../portrait.jpg",
  "background_image": "https://.../bg.jpg",
  "name": "Aranel the Swift",
  "class": "Warrior",
  "description": "...",
  "stats": { "STR": 2, "DEX": 3, "CON": 1, "INT": 1, "WIS": 2, "CHA": 1 }
}
```

### n8n Webhook Node Setup
Use your Production URL. Recommended settings:
- HTTP Method: `POST`
- Path: `1be15846-8a97-43a1-a3e0-8fc393a95779` (already set)
- Authentication: `None` (or configure and mirror in FE)
- Respond: `When Last Node Finishes` (or use a separate `Respond to Webhook` node if you want to control headers/body precisely)
- Options → Response Headers:
  - `Content-Type: application/json`
  - `Access-Control-Allow-Origin: *` (or your site origin)
  - `Access-Control-Allow-Headers: Content-Type`
  - `Access-Control-Allow-Methods: POST, OPTIONS`

Incoming request data in n8n:
- JSON body is available on the Webhook node output as `{{$json.body}}`.
  - Example: `{{$json.body.name}}`, `{{$json.body.class}}`, `{{$json.body.stats}}`
- Query params (if you ever use GET) are under `{{$json.query}}`.

Returning data to the FE:
- If using `Respond: When Last Node Finishes`, make the last node output the JSON in the shape shown above.
- If using a `Respond to Webhook` node, set
  - Response Code: `200`
  - Response Body: the JSON with keys `hero_image`, `background_image`, `name`, `class`, `description`, `stats`.
  - Response Headers: same CORS headers as above.

Notes:
- CORS: The headers above allow the browser to call the webhook from any origin; for stricter security, replace `*` with your site’s origin.
- Dev fallback: If the webhook is unreachable, the app falls back to a local mock so you can still test the UI.