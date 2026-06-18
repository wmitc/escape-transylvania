# 🦇 Escape Transylvania

A browser-based **point-and-click escape room**. Night has fallen over Castle Dracula and
the doors have locked behind you — explore the rooms, inspect and collect objects, solve the
Count's puzzles, and find the keys to unlock the castle gate before dawn.

> Solo single-player · plays entirely in the browser · progress saved locally.

## Tech stack

- **React + Vite + TypeScript** — a fast, modern static web app (no backend required).
- **Zustand** for game state, with `localStorage` persistence so progress survives a refresh.
- Plain CSS with a gothic theme; placeholder room art that can be swapped for real artwork later.

## Getting started

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the dev server, then open the printed http://localhost URL
```

Other scripts:

```bash
npm run build    # type-check and produce a production build in dist/
npm run preview  # serve the production build locally to verify it
npm run lint     # type-check without emitting files
npm test         # run the test suite once (Vitest)
npm run test:watch  # run tests in watch mode while developing
```

> **New to this?** `npm run dev` is all you need day to day. Edit a file under `src/`, save,
> and the browser updates automatically.

## Project layout

```
public/            static assets served as-is (favicon, room art)
src/
  main.tsx         app entry point
  App.tsx          root component
  styles/          global + component CSS (gothic theme tokens live in global.css)
  data/            game content: rooms, items, puzzles
  state/           Zustand game store                            (added in later PRs)
  components/       RoomScene, Hotspot, Inventory, etc.          (added in later PRs)
```

## Roadmap

1. ✅ **Bootstrap** — project scaffold + gothic title screen.
2. ✅ **Game engine** — data-driven rooms, inventory, navigation (the full castle skeleton).
3. ✅ **Puzzles & keys** — puzzle panels, item use, collect 3 keys to unlock the gate.
4. ✅ **Polish** — save/reset, intro & win screens, gothic styling pass.
5. ✅ **CI & deploy** — automated tests and GitHub Pages deployment.

## Testing

Logic is covered by [Vitest](https://vitest.dev) + Testing Library: the game store
(item pickup, solving puzzles, key-gated exits, the win condition), puzzle-data
integrity, and a puzzle component. Run `npm test`.

## Deployment

Every push to `main` runs **CI** (`.github/workflows/ci.yml`: type-check, test, build)
and, if green, **deploys** to GitHub Pages (`.github/workflows/deploy.yml`).

> **One-time setup:** in the repo, go to **Settings → Pages → Build and deployment**
> and set **Source** to **GitHub Actions**. The site then publishes to
> `https://wmitc.github.io/escape-transylvania/` (the Vite `base` path is already
> configured for this subpath).

## How the game is structured

Rooms, items, and puzzles are defined as **data** (in `src/data/`), and generic components
render them. Adding new content is mostly editing data — not writing new components. The castle
has five rooms: the Dungeon (start), the Great Hall (hub), the Library, the Alchemy Lab, and the
Castle Gate (the exit, which opens once you hold all three keys).

---

Built with [Claude Code](https://claude.com/claude-code).
