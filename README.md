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