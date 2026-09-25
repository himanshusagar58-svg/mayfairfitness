# Apex Strength — Gym Demo

Dark gym landing page with React Bits components:
- **Lightning** (WebGL hero background)
- **Stack** (Why Us image stack)
- **CircularGallery** (full ogl curved gallery)

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Edit site data

All copy, contact, reviews, gallery images, and demo bar settings live in:

```
public/config.js
```

Change `window.GYM` and refresh.

## Dependencies

| Package | Used by |
|---------|---------|
| `react` / `react-dom` | App |
| `ogl` | CircularGallery |
| `motion` | Stack |
| `vite` + `@vitejs/plugin-react` | Build |

## Structure

```
public/
  config.js          # gym data (edit this)
  img/hero.jpg
  fonts/
src/
  App.jsx
  components/
    Lightning.jsx
    Stack.jsx
    CircularGallery.jsx
```
