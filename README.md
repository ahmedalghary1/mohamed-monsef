# Mohamed Monsef portfolio

Bilingual static portfolio, English `/` and Arabic `/ar/`, using semantic HTML, CSS, vanilla ES modules, Vite, Three.js, GSAP/ScrollTrigger and Lenis. Source content stays readable without JavaScript. No tracking, backend, submissions or published personal contact information.

## Run

Use Node 22.12+ (tested 22.22.1), npm and the committed lockfile.

```sh
npm ci
npm run dev
npm run build
npm run preview
npx playwright install chromium firefox webkit
npm test
npm run test:a11y
BROWSER=firefox npm test
BROWSER=webkit npm test
```

Preview server must be running on port 4173 for browser tests. `TEST_URL` overrides the test origin; `CHROME_PATH` optionally supplies a Chromium binary. `npm run generate` writes both HTML entry points from `scripts/generate.mjs`; edit copy there, not generated HTML. These generated documents are intentional checked-in no-JS fallbacks. Build after changes. Test-only gallery fixture is never shipped.

## Content and design

`AGENTS.md` and `PORTFOLIO_PROMPT.md` contain the factual and engineering constraints. `DESIGN.md` records the chosen composition. `src/styles/tokens.css` is the token authority; `main.css` contains layout and responsive styling. `--muted` remains the supplied decorative/supporting token; `--text-secondary` provides higher contrast for text on the off-white canvas. Fonts are self-hosted WOFF2 with OFL licenses alongside them; unused local font files may be removed only when no CSS references remain.

`src/data/profile.js` contains approved public profile fields only. Contact fields are empty. Do not place the original CV, source brief, unpublished campaign exports or private contact configuration in `public/`; Vite copies everything there. The root PDF remains private to the workspace and is not bundled.

### Add approved cases

Add entries to `src/data/projects.js`, following its documented schema, with stable IDs, both translations, local media URLs and explicit `permissionConfirmed: true` and `status: 'published'`. Draft/unapproved entries are filtered by the Node generator and never imported by browser code. The generator verifies publishable media exists and fails on missing assets. Use `/assets/images/...` or `/assets/videos/...`; compress media, include meaningful localized alt text, native controls, poster and caption tracks for speech. Provide verified results with unit, period and source context; metrics and extended case-study details require a deliberate presentation change before use. The current gallery displays title, summary and media only. No fabricated gallery is included. Without approved entries, the sector experience view is shown. Filters and native media dialogs appear only when projects exist.

### Contact and CV approval

After explicit public-email approval, add `contact.email` to `profile.js`; the generator exposes a validated mailto link. It opens the visitor’s email application and does not send or store a message. Telephone/social/form channels are intentionally absent and require verified fields and implementation. No WhatsApp is assumed. To add a public CV: obtain approval for a redacted file, place only that copy in `public/assets/documents/`, and add a localized download link in the generator. `profile.cv` is reserved and is not currently rendered. Never copy the private root PDF automatically.

## Deployment

Deploy only `dist/` after `npm run build`, on a static host supporting directory index pages; no SPA rewrite. `/ar/` must resolve directly on refresh. For a subdirectory use `SITE_BASE=/portfolio/ npm run build`; set host routing to that directory. Do not upload the repository itself.

This is a preview: both pages use noindex and robots disallows crawling. These do not protect private data. Before public release obtain approval for contact details, case media and domain; reconfirm the CV’s freelance `2023–Present` status. Set the approved HTTPS domain origin in `src/data/site-config.js`; the generator then adds canonical, hreflang, sitemap and OG text/URLs for both locale routes. Add an approved OG image separately. Switch `preview` to false only as part of an approved release; robots is generated from that setting. No deployment or public upload has been performed.

## Verification and remaining assets

See `docs/verification.md` and local `docs/*-desktop.png` / `docs/*-mobile.png`. Needed from the owner: publishable real project screenshots/images/videos with rights, approved email/other contacts, optional redacted CV and domain. A portrait is optional; no face has been generated. Current scene artwork is original abstract geometry, not client work.

## Motion and illustrative lab

The owner-approved expanded experience is in `src/styles/experience.css`, `src/js/experience.js`, `src/js/motion.js`, and `scripts/experience-template.mjs`. The skill ribbon pauses via a real button, hover/focus, reduced-motion preference, document visibility and viewport visibility. The reading progress indicator is decorative. The desktop story uses CSS sticky and four scroll-selected diagrams; narrow screens render a diagram with each stage. No wheel cancellation or forced scroll lock.

`src/data/concepts.js` holds the explicitly illustrative lab, separate from approved client projects. `docs/generated-concepts.md` records the built-in generation prompts, asset paths and programmed video provenance. Keep the visible concept/attribution labels when editing. No performance metrics are implied by any diagram. The silent WebM motion study is not AI-generated video and is not client work.

`npm run test:experience` verifies new controls, story states, actual video playback/pause, dialog focus restoration, reduced motion and both locale layouts. Run after `npm run build` with the preview server running; `BROWSER=firefox npm run test:experience` selects Firefox. `scripts/render-motion.mjs` is an optional offline asset-generation script, not runtime code.
