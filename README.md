# Alichane Driss · Portfolio

Personal portfolio of **Alichane Driss**, Full-Stack & AI software engineer (EMSI 2026).

**Live:** https://drissalichane.github.io

A single-page site with a "technical blueprint / HUD" look: dark navy grid, one blue accent, square edges, corner brackets and monospace labels. Besides the usual sections (experience, projects, skills, education, contact), it has a few interactive touches built from scratch: an FPS-style crosshair cursor, a small shooting mini-game in the hero with synthesized sound effects, a typing terminal, and experience entries that type themselves out like a game's dialogue box.

> **How was it built?** See [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) for a section-by-section walkthrough of every feature, animation and effect, including the design decisions behind them.

## Highlights

| Feature | What it does | How (short) |
|---|---|---|
| Crosshair cursor | Replaces the mouse pointer with a reticle, a short low-fps ghost trail, brackets that lock onto links and recoil on click | One `requestAnimationFrame` loop moving DOM nodes through refs, no React re-renders |
| Hero mini-game | Floating targets to shoot (2 big, 2 small), hit markers, shard bursts, a hit counter | Rejection-sampled spawn points that avoid the page content, CSS keyframes driven by custom properties |
| Enemy nameplate | Hovering the name shows a HUD tag with an HP bar; each click is a shot, a medkit refills it at zero | React state + a reflow trick to replay CSS animations on every hit |
| Sound effects | Silenced shot, hit marker, medkit chime, with a remembered mute toggle | Synthesized live with the Web Audio API: no audio files at all |
| Hero terminal | Types `whoami`, then one real command per stack, in a loop | Async loop with cancellation, fixed height so the layout never moves |
| Typewriter experience | Each job types itself out when scrolled into view; click to skip | Time-based plan per text segment, invisible placeholder text so nothing shifts |
| Light / dark theme | Follows the system, remembers the choice, no flash on load | Inline script sets `data-theme` before paint; colours are CSS variables |
| French / English | Full content and interface in both languages | Two typed data files + a small context, choice stored in `localStorage` |
| Contact form | Messages reach the owner's inbox | Web3Forms email + Firestore backup in parallel (`Promise.allSettled`), locked-down security rules |

Everything respects `prefers-reduced-motion`, the custom cursor only runs on mouse devices, and the game elements are hidden from keyboard and screen-reader navigation since they are decorative.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, exported as a static site
- **Tailwind CSS 4** (CSS-first config with `@theme` tokens)
- **Framer Motion** for section reveals and the hero intro
- **Web Audio API** for sound, **requestAnimationFrame** for the cursor
- **Firebase Firestore** + **Web3Forms** for the contact form
- **Google Analytics** via `@next/third-parties`
- **GitHub Actions → GitHub Pages** for deployment on every push to `main`

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build
```

## Project structure

```
src/
  app/
    layout.tsx        fonts, no-flash theme script, global cursor
    page.tsx          the single page: sections in order
    globals.css       design tokens, light palette, all custom keyframes
  components/
    Hero.tsx          hero section (name, bio, profile card)
    HeroTerminal.tsx  typing terminal in the profile card
    NamePlate.tsx     enemy HUD tag + HP bar on the name
    HeroTargets.tsx   floating targets, hit effects
    HitCounter.tsx    bottom-right HUD (hit count + mute button)
    SoundToggle.tsx   mute button
    Cursor.tsx        crosshair cursor
    Experience.tsx    typewriter experience timeline
    Projects.tsx, Skills.tsx, Education.tsx, Contact.tsx, Guestbook.tsx (message form)
    Header.tsx, Toggles.tsx (theme + language), Corners.tsx, SectionHeading.tsx
  data/
    portfolio.ts      all content in French
    portfolio.en.ts   all content in English
  lib/
    sfx.ts            Web Audio sound synthesis + mute state
    firebase.ts       Firestore client
  i18n.tsx            interface strings + language context
firestore.rules       security rules for the message form
.github/workflows/    GitHub Pages deployment
```

## Editing the content

All text lives in [src/data/portfolio.ts](src/data/portfolio.ts) (French) and [src/data/portfolio.en.ts](src/data/portfolio.en.ts) (English); interface labels are in [src/i18n.tsx](src/i18n.tsx). Components never hard-code content, so updating the CV is a data change only.
