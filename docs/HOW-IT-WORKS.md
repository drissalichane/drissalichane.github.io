# How this portfolio works

A walkthrough of how every part of [drissalichane.github.io](https://drissalichane.github.io) was built: the architecture, the design system, and each animation and interactive effect, with the reasoning behind the choices. File links point to the source so each claim can be checked against the code.

**Contents**

1. [Architecture](#1-architecture)
2. [Design system](#2-design-system)
3. [Light / dark theme without a flash](#3-light--dark-theme-without-a-flash)
4. [French / English](#4-french--english)
5. [Hero section and the typing terminal](#5-hero-section-and-the-typing-terminal)
6. [Typewriter experience timeline](#6-typewriter-experience-timeline)
7. [Scroll reveals and hover effects](#7-scroll-reveals-and-hover-effects)
8. [Crosshair cursor](#8-crosshair-cursor)
9. [Hero mini-game: targets, hits and counter](#9-hero-mini-game-targets-hits-and-counter)
10. [Enemy nameplate with HP and medkit](#10-enemy-nameplate-with-hp-and-medkit)
11. [Synthesized sound effects](#11-synthesized-sound-effects)
12. [Contact form: email + database backup](#12-contact-form-email--database-backup)
13. [Accessibility and performance principles](#13-accessibility-and-performance-principles)
14. [Build, deployment and testing](#14-build-deployment-and-testing)

---

## 1. Architecture

- **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.** The site is one page ([src/app/page.tsx](../src/app/page.tsx)) made of section components rendered in order: Header, Hero, Experience, Projects, Skills, Education, Message form, Contact.
- **Static export.** There is no server at runtime. GitHub Actions builds the site into plain HTML/CSS/JS and GitHub Pages serves it. Everything dynamic (theme, language, cursor, game, sound) runs in the browser.
- **Content is data.** All CV content lives in two typed files: [portfolio.ts](../src/data/portfolio.ts) (French) and [portfolio.en.ts](../src/data/portfolio.en.ts) (English). Components only read from them, so updating the CV never touches layout code.
- **Small, single-purpose components.** Each interactive feature is its own file with one job (e.g. [Cursor.tsx](../src/components/Cursor.tsx) is only the cursor; [sfx.ts](../src/lib/sfx.ts) is only sound). Features talk through tiny, explicit channels (a DOM event, a data attribute, a subscribable store) instead of a global state library.
- **Dependencies are kept minimal:** Framer Motion (reveals), lucide-react (icons), Firebase (form backup), clsx + tailwind-merge (class names). The cursor, mini-game, typewriter and sound are hand-written with browser APIs.

## 2. Design system

The visual theme is a **technical blueprint / game HUD**: a dark navy background, a faint grid, one blue accent, square corners, monospace labels and corner brackets.

- **Colour tokens.** Tailwind 4's `@theme` block in [globals.css](../src/app/globals.css) defines seven colours (`background`, `surface`, `line`, `ink`, `muted`, `primary`, `accent`) and three fonts (Inter for text, Space Grotesk for headings, JetBrains Mono for labels). Every utility class (`bg-surface`, `text-muted`, `border-line`…) reads these variables, which is what makes the light theme a pure CSS swap (section 3).
- **Blueprint grid.** A custom `@utility blueprint` draws the grid with two 1px `linear-gradient`s at 56px intervals, using `color-mix()` to tint the primary colour at 12%. The hero fades it out with a radial `mask-image` so it only shows behind the name.
- **Corner brackets.** [Corners.tsx](../src/components/Corners.tsx) draws four 12px L-shaped ticks at the corners of any box using borders on absolutely positioned spans. The same visual language is reused by the cursor's lock-on brackets, the nameplate and the ghost trail, so all the effects feel like one system.
- **Details:** square scrollbar in the palette, selection colour from the primary, a blinking block caret (`steps(1)` animation for a hard on/off blink like old terminals).

## 3. Light / dark theme without a flash

Files: [layout.tsx](../src/app/layout.tsx), [Toggles.tsx](../src/components/Toggles.tsx), [globals.css](../src/app/globals.css)

- **The problem:** a static site doesn't know the visitor's theme when the HTML is generated, so a naive React toggle renders dark first and then switches, causing a visible flash.
- **The fix:** a tiny inline `<script>` in `<head>` runs **before the first paint**. It reads `localStorage` (or the system preference via `matchMedia("(prefers-color-scheme: light)")`) and sets `data-theme` on `<html>`.
- **Light palette = redefined tokens.** `:root[data-theme="light"]` overrides the same seven colour variables. No component has theme-specific classes; everything follows automatically.
- **The toggle** treats the `data-theme` attribute as the single source of truth and reads it with React's `useSyncExternalStore`, which keeps server and client renders consistent (the server snapshot is "dark") and avoids hydration mismatches.

## 4. French / English

File: [i18n.tsx](../src/i18n.tsx)

- Interface strings (buttons, labels, aria-labels) live in one `ui` object with `fr` and `en` keys; the French object's type is the contract, so a missing English string is a TypeScript error.
- A `LanguageProvider` exposes `{ lang, setLang, data, t }`. Components call `useLang()` and get both the right content file and the right strings.
- The language is stored in `localStorage` and read with `useSyncExternalStore`. The static HTML is rendered in French (server snapshot) and switches on hydration if English was chosen. It also listens to the `storage` event, so two open tabs stay in sync, and updates `<html lang>` for screen readers and SEO.
- Tool output in the hero terminal deliberately stays in English in both languages, the way real CLIs print it.

## 5. Hero section and the typing terminal

Files: [Hero.tsx](../src/components/Hero.tsx), [HeroTerminal.tsx](../src/components/HeroTerminal.tsx)

- **Intro animation:** the text column and the profile card fade and slide up 24px with Framer Motion, the card 0.15s after the text for a staggered entrance. The outlined last name uses `-webkit-text-stroke` with a transparent fill.
- **The terminal** in the profile card types `whoami` (name + availability), then one real command per stack (`mvn spring-boot:run`, `php artisan test`, `npm run build`, `python train.py --model lstm`, `dotnet build`) with its output, and loops forever.
  - It's an `async` loop inside a `useEffect`: type one character every 55ms, wait 350ms, print each output line 220ms apart, hold, next scene. A `cancelled` flag set in the effect's cleanup stops the loop when the component unmounts or the language changes. That is the standard way to cancel async work in React.
  - The terminal has a **fixed height of three lines**, so changing commands never moves the layout around it.
  - Screen readers get a static `aria-label` with the `whoami` result instead of a stream of changing characters; with reduced motion enabled, the `whoami` scene is shown without typing.

## 6. Typewriter experience timeline

File: [Experience.tsx](../src/components/Experience.tsx)

Each job types itself out like a dialogue box in an old game when it scrolls into view: the title and company slowly (30 characters/second), the details fast (240 characters/second), with short pauses between segments.

- **Time-based, not tick-based.** The entry is split into segments (role, company, description, each task, tech list). A `useMemo` computes a **plan**: the start time of every segment from the previous one's length ÷ speed + pause. One `requestAnimationFrame` loop just tracks elapsed time; how many characters of each segment to show is derived from it. This keeps the speed correct even if frames drop, and there's a single loop per entry instead of one timer per character.
- **No layout shift.** The full text is rendered from the start: the typed part is visible and the rest is `invisible` (it keeps its space). Lines never re-wrap and the page never jumps while text appears.
- **Accessible.** The complete text is in an `sr-only` span for screen readers; the animated copy is `aria-hidden`.
- **Skippable.** Clicking an entry that is still typing completes it instantly. With reduced motion, the text appears at once.
- **Triggered on view** with Framer Motion's `useInView` (`once: true`, `-80px` margin, so it starts when the entry is genuinely on screen).
- The caret is the same hard-blink block cursor as the terminal and follows the segment currently typing.

## 7. Scroll reveals and hover effects

Files: [SectionHeading.tsx](../src/components/SectionHeading.tsx), [Projects.tsx](../src/components/Projects.tsx), [Skills.tsx](../src/components/Skills.tsx), [Education.tsx](../src/components/Education.tsx), [Header.tsx](../src/components/Header.tsx)

- **Reveals:** headings, project rows, skill cards and education rows use Framer Motion's `whileInView` with `viewport={{ once: true }}`: a short fade + 12 to 16px slide, played once. Skill cards are staggered by 50ms each.
- **Project rows:** on hover, a 1px primary line grows down the left edge (`scale-y-0` → `scale-y-100` with `origin-top`, a transform, so it's GPU-cheap), the title turns accent and the tech tags' borders tint.
- **Header:** transparent at the top, then gets a border and a blurred translucent background (`backdrop-blur`) after 40px of scroll; the mobile menu slides in with Framer Motion.
- **Numbered navigation** (`01 EXPÉRIENCE`, `02 PROJETS`…) and matching section indexes reinforce the blueprint look.

## 8. Crosshair cursor

File: [Cursor.tsx](../src/components/Cursor.tsx), styles at the end of [globals.css](../src/app/globals.css)

The mouse pointer is replaced by an FPS-style reticle: four arms, a centre dot and corner brackets.

- **Performance first: no React re-renders.** The cursor is rendered once. A single `requestAnimationFrame` loop reads the latest mouse position (stored in plain variables by a passive `pointermove` listener) and writes `transform: translate3d(...)` directly on the DOM nodes through refs. Moving 60+ times a second through React state would re-render on every frame; this approach only touches compositor-friendly properties.
- **Low-fps ghost trail.** Two faded copies of the reticle trail behind it. The trick: the main cursor updates every frame, but the trail **samples** the mouse position only 20 times a second into a tiny buffer, so the copies jump in visible steps like a choppy screen recording. Copies that have caught up with the cursor are hidden, so the trail disappears when the mouse stops. It was first 4 copies at 12 fps, then shortened to 2 copies at 20 fps (~100ms of trail) because a long slow trail felt disorienting.
- **Lock-on brackets.** Over a link, button, or anything marked `data-cursor-lock` (the name), the four corner ticks slide out to frame the element's bounding box (+6px). They ease toward their target with frame-rate-independent smoothing: `k = 1 - exp(-dt / 45ms)`, so the snap feels the same at 60Hz or 144Hz. While locked, the arms fade and the dot becomes a ringed point (ink colour with a background-colour outline), which stays visible on any fill, including blue buttons.
- **Recoil:** while the mouse button is down, the arms kick 4px outward (a `data-firing` attribute + CSS transitions).
- **Where it's off:** it only activates when `matchMedia("(hover: hover) and (pointer: fine)")` matches, so phones and tablets keep native behaviour. The system cursor is hidden by a class added only after the component mounts (so there's never a moment with no cursor). Text fields keep the normal text caret and the reticle hides over them. With reduced motion, the trail and easing are disabled. The cursor also hides when the mouse leaves the window and re-evaluates its target on scroll.

## 9. Hero mini-game: targets, hits and counter

Files: [HeroTargets.tsx](../src/components/HeroTargets.tsx), [HitCounter.tsx](../src/components/HitCounter.tsx), styles in [globals.css](../src/app/globals.css)

Practice targets float in the hero's empty space; shooting them gives a hit marker, a shard burst and a "+1", and a counter tracks hits.

- **Never covering content.** Text blocks, buttons and the profile card are marked with a `data-target-avoid` attribute. To spawn a target, the code picks random positions inside the hero (**rejection sampling**, up to 40 tries) and accepts the first one that doesn't overlap any marked element (with a 16px margin that also covers the bobbing), isn't under the fixed header, and isn't too close to another target. If the layout leaves no room (small screens), it simply spawns fewer.
- **Sizes and limits.** There are never more than 4 targets: 2 at 40px and 2 at 26px. A per-size quota decides which size can spawn next, so a shot target is always replaced by one of the same size. A 1.5s interval refills missing targets; on window resize, all targets are cleared and re-placed for the new layout.
- **Animation with CSS only.** Each target scales in, then bobs (up/down + slight rotation) with a random negative `animation-delay` passed as a CSS custom property, so they never move in sync. The burst is 6 shards whose flight direction is computed in JS (`cos`/`sin` of 0°, 60°… 300°) and handed to one shared keyframe through `--dx`/`--dy` custom properties. The hit marker is four short diagonal strokes that pop and fade, like in shooters.
- **Shooting** uses `pointerdown` rather than `click`, so the hit registers instantly when the button is pressed, which feels like a trigger.
- **Decoupled counter.** The targets dispatch a `target-hit` DOM event on `window`; the bottom-right [HitCounter](../src/components/HitCounter.tsx) listens to it. Neither component imports the other's state, and no global store was needed. The counter only appears after the first hit (visitors who don't play never see it) and resets on reload. It and the mute button fade out once the hero fills less than half the screen, and become `inert` so the hidden button can't be tabbed to; they come back, with the count kept, when the visitor scrolls up to the game again.
- **Cursor integration:** targets carry `data-cursor-target`; while aiming at one, the cursor hides its ghost trail so aiming feels precise, and the lock-on brackets snap to the target like an aim assist.
- **Accessibility:** the layer is `aria-hidden` and targets have `tabIndex={-1}`: they are decoration, so keyboard and screen-reader users aren't sent through them.

## 10. Enemy nameplate with HP and medkit

File: [NamePlate.tsx](../src/components/NamePlate.tsx)

Hovering the name shows a HUD tag above it, like the label over an enemy in a shooter: `ALICHANE DRISS · FULL-STACK` and a 10-segment HP bar. Each click on the name is a shot.

- **Show/hide is pure CSS:** Tailwind's `group-hover`, which in Tailwind 4 only applies on devices that can hover, so phones don't get a stuck tag.
- **HP is React state** (10 → 0). Each shot removes one segment, shows a hit marker at the exact click point (coordinates relative to the name), makes the name flinch (a 160ms 2px shake) and flashes the bar.
- **Replaying a CSS animation on every hit.** A CSS animation doesn't restart if its class is already present. The `replay()` helper removes the class, forces a reflow by reading `offsetWidth`, and adds it back, so rapid shots each get their own flinch and flash.
- **Medkit:** at 0 HP the tag swaps to a green `+ MEDKIT` (`+ KIT DE SOIN` in French), then the bar refills one segment every 100ms in green, and shots are ignored until it's full. All timers are tracked and cleared on unmount.
- Text selection is disabled on the name (`select-none`) so rapid clicking doesn't highlight it.

## 11. Synthesized sound effects

Files: [sfx.ts](../src/lib/sfx.ts), [SoundToggle.tsx](../src/components/SoundToggle.tsx)

There are **no audio files**: every sound is generated in real time with the **Web Audio API**. This keeps the download size at zero, avoids licensing questions, and lets each sound be tuned in code.

- **Building blocks.** Two helpers create short-lived audio graphs:
  - `tone()`: an `OscillatorNode` (sine, triangle, square) through a `GainNode` envelope that fades out exponentially, optionally sliding in pitch.
  - `burst()`: a buffer of white noise (generated once) through a `BiquadFilterNode` (low-pass, band-pass or high-pass) and a gain envelope with a 4ms attack, so it starts softly instead of clicking.
- **The sounds:**
  - **Silenced shot:** low-passed noise at 900Hz (the muffled "pfft"), a soft 120→55Hz thump, and a tiny high-passed click 25ms later for the slide. The first version was a loud band-passed bang; it was reworked to sound suppressed.
  - **Target hit:** shot + a short 2.2kHz triangle "tick" (hit marker) + a high-passed crack as the target breaks.
  - **Name hit:** shot + a duller 700→400Hz thud, so hitting the "enemy" feels different.
  - **Medkit:** a rising C–E–G chime, then a blip per refilled segment, each a bit higher in pitch.
- **Browser autoplay rules:** browsers block audio until the user interacts with the page. The `AudioContext` is created lazily on the first shot, which is always a click, so it's allowed to play. Nothing makes noise on page load.
- **Mute toggle.** The mute state lives in the module with a tiny subscribe/emit store, read by React through `useSyncExternalStore` (same pattern as the theme and language). The choice is saved in `localStorage`. The speaker button appears in the bottom-right HUD the first time a sound would have played, even when muted, so it's always available once it matters.
- Master volume is kept low (0.22) and every sound is under 0.3s, so rapid shooting never piles up into noise.

## 12. Contact form: email + database backup

Files: [Guestbook.tsx](../src/components/Guestbook.tsx), [firebase.ts](../src/lib/firebase.ts), [firestore.rules](../firestore.rules)

The project started with a public, real-time guestbook (Firestore), later turned into a **private message form**:

- On submit, two channels run **in parallel with `Promise.allSettled`**: an email to the owner through **Web3Forms**, and a backup copy in **Firestore**. If either succeeds, the visitor sees "sent"; an error is only shown if both fail. Failures are logged without blocking the other channel.
- **Security rules** ([firestore.rules](../firestore.rules)) make the collection write-only from the site: no reads, updates or deletes, only documents with exactly the expected fields, string types, length limits (name ≤ 60, email ≤ 120, message ≤ 500) and a server timestamp (`createdAt == request.time`) so dates can't be forged. Every other collection is closed. The same limits are mirrored on the inputs with `maxLength`.
- The Firebase config and the Web3Forms key are public by design: they only identify the project/inbox, and access is enforced by the rules and by Web3Forms.

## 13. Accessibility and performance principles

These rules applied to every feature:

- **`prefers-reduced-motion`** is respected everywhere: typewriter and terminal show text at once, the cursor drops its trail and easing, targets stop bobbing and shards don't fly, flinches and pops are disabled.
- **Decoration stays out of the way:** the cursor, targets, ghost trail and nameplate are `aria-hidden`; animated text has a static screen-reader version; targets can't be tabbed to.
- **Device-aware:** hover-only effects (cursor, nameplate) only run on devices with a fine pointer that can hover.
- **No layout shift:** the terminal has a fixed height, typed text reserves its space, overlays are absolutely positioned.
- **Cheap animations:** movement uses `transform` and `opacity` (compositor-only); per-frame work happens in one `requestAnimationFrame` loop outside React; one-shot effects are CSS keyframes.
- **Robust storage:** every `localStorage` access is wrapped in `try/catch`, since it can throw in private modes or when storage is blocked; the site works without it.

## 14. Build, deployment and testing

- **Deployment:** [.github/workflows/nextjs.yml](../.github/workflows/nextjs.yml) runs on every push to `main`: install with `npm ci`, `next build` with the static-site settings from `actions/configure-pages`, upload the output, deploy to GitHub Pages.
- **Checks before each change:** `npm run lint` (ESLint with the Next.js config, including the React hooks rules) and `npm run build` (type-check + production build).
- **Visual and behaviour checks:** the interactive features were verified by driving a headless browser (Microsoft Edge) over the Chrome DevTools Protocol from small Node scripts. These scripts aren't part of the repo. They moved the mouse, clicked targets and the name, and took screenshots in both themes and at desktop and phone sizes. They asserted things like "no target overlaps content", "the trail is hidden while aiming", "the HP bar drops one segment per shot and refills", and "muting stops all sound". For sound, the scripts counted the oscillators the page created, since a headless browser has no speakers.
