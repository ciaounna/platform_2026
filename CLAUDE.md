# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site for **unna** (ciaounna.com), an Italian association/movement focused on regenerating
territories in Sicily. It's a static, no-build multi-page site: plain HTML pages load React 18 and
Babel Standalone from unpkg via `<script>` tags and compile `.jsx` files directly in the browser — there
is no bundler, no `package.json`, no npm install/build/test step. Deployed as static files (GitHub Pages —
see `CNAME` / `.nojekyll`).

## Commands

There is no build/lint/test tooling. To work on the site locally, just serve the directory statically and
open a page, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/index.html` (or `galleria.html`, `evento.html`, `tutti-gli-eventi.html`).
Editing any `.js`/`.jsx`/`.css` file and refreshing the browser is the entire dev loop — Babel transpiles
JSX in-browser on load.

## Architecture

**Multi-page, not an SPA.** Each top-level page is its own `.html` file that loads a specific subset of
`.jsx` scripts in a fixed order (order matters — later scripts assume earlier ones already ran and
attached globals to `window`):

- `index.html` → home page, loads `shared.jsx`, `nav.jsx`, `hero.jsx`, `galleria.jsx`, `team.jsx`,
  `eventi.jsx`, `manifesto.jsx`, `contatti.jsx`, `tweaks-panel.jsx`, then `app.jsx` (which renders `<App/>`).
- `evento.html` → single event detail, loads `shared.jsx` + `evento.jsx`.
- `galleria.html` → full photo gallery, loads `shared.jsx` + `galleria.jsx`.
- `tutti-gli-eventi.html` → full events list, loads `shared.jsx`, `eventi.jsx`, `tutti-gli-eventi.jsx`.

**No module system — everything is a global.** Components/helpers are defined as plain functions and
attached with `window.Foo = Foo` at the bottom of each file (e.g. `window.Header`, `window.Icon`,
`window.EventoCard`). Consuming files declare what they expect via a `/* global React, Icon, ... */`
comment at the top rather than importing anything. When adding a new component, follow this same pattern:
define it, then export it onto `window`, then add a `<script type="text/babel" src="...">` tag (in the
right order) to whichever `.html` page(s) need it.

**Data model (`data.js` + `api.js`).** `data.js` defines `window.UNNA = { galleria, social, team, eventi }`
with the real team roster hardcoded and `eventi`/`galleria` starting empty. `api.js` defines
`window.unnaInit(renderFn)`, which is what every page's entry script calls instead of rendering directly:
it renders immediately with whatever is in `UNNA` (so the page paints instantly), then — if
`window.UNNA_API_URL` is set — fetches live `eventi`/`galleria` data from a Google Apps Script web app
backend, mutates `UNNA.eventi` / `UNNA.galleria` in place, and fires `window` events
(`"unna:refresh"`, `"unna:galleria"`) that components listen for to re-render with real data and drop
loading/skeleton state. `api.js` also deterministically assigns each event a `tinta` (brand color) by
hashing its id, so the same event always gets the same color.

**Backend (`apps-script.js`).** Not deployed by this repo — it's the source to paste into Google Apps
Script, bound to a Google Sheet (`FOGLIO_ID`), and published as a web app whose URL becomes
`UNNA_API_URL` in `api.js`. It exposes `doGet` actions `eventi`, `galleria`, `iscrizione`, reading/writing
sheet tabs `eventi` / `galleria` / `iscrizioni`. The comment block at the bottom of that file documents the
expected sheet column layout (base fields, up to 6 `progN_titolo/body` steps, up to 10
`infoN_etichetta/valore` rows, `contatti_tel/email`) — read it before changing how events are shaped, since
the frontend (`evento.jsx`) expects that exact structure (`programma: [{titolo, body}]`,
`info: [{k, v}]`, `contatti: {tel, email}`).

**Brand colors (`shared.jsx`).** The five brand tints (`viola`, `viola-300`, `arancio`, `arancio-2`,
`inchiostro`) are defined once in `TINTE` in `shared.jsx` and looked up via `tinta(name)`. Team members and
events both carry a `tinta` field referencing one of these keys — team tints are set by hand in `data.js`,
event tints are auto-assigned by `api.js`.

**Tweaks panel (`tweaks-panel.jsx`).** A reusable dev/design tool (shared boilerplate, not
unna-specific — see the usage comment at the top of the file) that renders a floating panel of live
controls (radio/slider/color/etc.) for adjusting a `TWEAK_DEFAULTS` object at runtime, and also implements
a host "edit mode" postMessage protocol. `app.jsx` is the only page currently wired up to it, controlling
`heroVariant`, `teamLayout`, `accent`, and `motion`. When adding a new visual variant that should be
tweakable, add a key to `TWEAK_DEFAULTS` in `app.jsx` and a corresponding `Tweak*` control in the
`<TweaksPanel>` block, not a hardcoded value.

**Styling** is split across three global stylesheets loaded by (nearly) every page — `styles.css` (base/reset/
tokens), `components.css` (shared component styles), `sections.css` (home page section styles) — plus
`evento.css` for event/gallery-specific pages. There's no CSS module scoping; class names are the
namespacing mechanism.
