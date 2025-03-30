# 🎧 nullptr-rs-player

A glitchy, cyberpunk-inspired **Progressive Web App (PWA)** MP3 player — built with React, Tailwind, Radix UI, and Vite.

🔗 **Live Demo:** [nullptr-rs.github.io/nullptr-rs-player](https://nullptr-rs.github.io/nullptr-rs-player/)

---

## 📦 Getting Started

### Install Dependencies

```bash
npm install
```

Installs all required packages and dev tools.

---

## 🛠️ Local Development

```bash
npm run dev
```

- Starts Vite's dev server at [http://localhost:5173](http://localhost:5173)
- Hot-reloads on changes

---

## 🧪 Preview Production Build

```bash
npm run build
npm run preview
```

- `build`: Compiles an optimized production version into the `dist/` folder
- `preview`: Serves the built version locally

---

## 🚀 Deployment (GitHub Pages)

This app is deployed via GitHub Pages using the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package.

### One-command deploy:

```bash
npm run deploy
```

This runs:

```bash
npm run build && gh-pages -d dist
```

Ensure your `vite.config.ts` contains the correct base path:

```ts
// vite.config.ts
export default defineConfig({
  base: '/nullptr-rs-player/', // ← important for GitHub Pages
  plugins: [react(), VitePWA()],
});
```

---

## 📱 PWA Features

- Installable on desktop and mobile
- Offline support (via service worker)
- Caches core assets and playlists
- Add to Home Screen for fullscreen audio player experience

Powered by [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (library homepage).

---

## 📁 Project Structure

```
├── public/              # Static assets (PWA manifest, icons)
├── src/                 # App source (React + TSX)
│   └── App.tsx          # Main player logic
├── music/               # Playlists and audio (served via GitHub Pages)
├── dist/                # Production build (auto-created)
├── package.json         # Scripts and dependencies
└── vite.config.ts       # Vite + PWA config
```

---

## ⌨️ Keyboard Shortcuts

- `Space` — Play/Pause  
- `Ctrl + → / ←` — Next / Previous track  
- `→ / ←` — Seek forward / backward  
- `↑ / ↓` — Volume  
- `M` — Mute  
- `S` — Shuffle  
- `R` — Repeat  
- `L` — Toggle playlist

---

## ⚖️ License

## 🎵 Licensing Notes

- The **source code** of this project is licensed under the [MIT License](LICENSE).
- However, all **audio tracks, cover art, and musical works** (located in the `music/` folder) are **© NullPtr.rs, All Rights Reserved**.

You may not copy, redistribute, or reuse our music without explicit permission.

For usage inquiries or licensing, contact: nullptr.rs@outlook.com

---

> _"panic!(\"Playback subsystem online.\");"_ 💀🎶

---
