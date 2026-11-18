# Mohamed Monsef — Creative Performance

A bilingual static portfolio built with semantic HTML, CSS, vanilla ES modules, Vite, GSAP/ScrollTrigger and Lenis. English `/` and Arabic `/ar/` are generated independently and remain readable without JavaScript. The November 2026 owner brief establishes the navy portrait-led redesign; see `AGENTS.md`, `DESIGN.md` and `docs/redesign-plan.md`.

## Setup and local preview

Use Node 22.12+ (verification used Node 24.15.0) and npm. All dependencies are pinned in `package.json` and the committed lockfile format is preserved.

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

PowerShell users with disabled `.ps1` scripts can use `npm.cmd` for the same commands. No execution-policy change is needed. `npm run dev` generates both pages before starting Vite. Production browser checks use the preview server on port 4173.

## Editing the site

| File | Purpose |
| --- | --- |
| `src/data/content.js` | Complete English/Arabic public copy, services, sectors, skills, process and training |
| `src/data/profile.js` | Approved identity, exact source dates, localized date labels, portrait and gated contact/CV settings |
| `src/data/projects.js` | Approved real work and build-time publication filter |
| `src/data/concepts.js` | Separately attributed website illustrations, categories, descriptions and objectives |
| `src/data/site-config.js` | Approved domain and preview indexing flag |
| `src/styles/tokens.css` | Colors, typography, spacing, radii and layout constants |
| `src/styles/main.css` | Base styles, navigation, hero, editorial sections and responsive/RTL rules |
| `src/styles/experience.css` | Gallery, dialogs and motion section |
| `scripts/generate.mjs` | Static HTML, metadata, truthful schema, robots and conditional sitemap |
| `scripts/experience-template.mjs` | Reusable editorial/gallery/media rendering and inline icons |

Run `npm run generate` after text changes, or `npm run build` for the complete output. `index.html` and `ar/index.html` are intentionally checked-in generated, no-JS documents; edit the data or renderer rather than hand-editing them. Never hand-edit `dist/`.

## Portrait and brand assets

The exact supplied portrait is preserved at `source-assets/portrait/mohamed-original.jpeg`; `image.jpeg` also remains untouched. The public assets are 960px, 640px and 480px WebP derivatives in `public/assets/images/`. A white editorial frame retains the original white/yellow background because clean background removal was unavailable. No face or body has been regenerated or retouched, and no transparent fallback is needed for the framed design.

The filled MM logo uses a single geometry source, `src/data/brand.json`, for inline markup, SVG exports, favicon and the 1200×630 sharing image. Its two bold letters use matching stems, open counters and complementary corner cuts. The name sits alongside it in a compact two-line lockup in both languages. Public exports: `monogram.svg` (currentColor), `logo-navy.svg`, `logo-white.svg`, `logo-cyan.svg`, `logo-transparent.png`, and the presentation sheet `logo-preview.png`. All are in `public/assets/brand/`.

Run `python scripts/prepare-assets.py --brand-only` to refresh only branding, or omit the flag to also regenerate portrait derivatives (requires Pillow; source font TTF is preserved in `source-assets/fonts/`). The website renderer reads the same geometry, so an HTML rebuild cannot restore an obsolete logo. Fonts are self-hosted WOFF2, with licenses alongside them. Inline Lucide-derived icons retain their license at `public/assets/brand/lucide-LICENSE.txt`.

## Adding approved real work

Add entries to `src/data/projects.js`. Required fields:

```js
{
  id: 'unique-kebab-case-id',
  type: 'campaign', // campaign | image | video
  status: 'published',
  permissionConfirmed: true,
  title: { en: 'Approved title', ar: 'العنوان المعتمد' },
  summary: { en: 'Approved description', ar: 'الوصف المعتمد' },
  media: [{
    src: '/assets/images/approved-file.webp',
    kind: 'image',
    alt: { en: 'Meaningful description', ar: 'وصف واضح للصورة' },
    width: 1280,
    height: 853
  }]
}
```

Only publish accurate owner-approved entries with actual local media and publication permission. Drafts/private fields are filtered by Node and are never imported into browser JS. The generator rejects missing files, unsafe paths and duplicate published IDs. Files under `public/` are always copied by Vite, so keep unpublished media outside it even when their project entry is a draft.

Optional localized case fields: `overview`, `challenge`, `objective`, `strategy`, `execution`, `testing`, `optimization`, `lessons`, `attribution`; `tools` is a verified string array. Media arrays support additional images and video with `poster`, localized alt and optional caption `captions` track. Supply actual captions for speech; use native controls and `preload="none"`. Metrics are rendered only with `verified: true`, `label: {en,ar}`, `value`, `unit`, `period` and `source`; include baseline context in the source where applicable. Never confuse ROI with ROAS or add sample public metrics.

Real work renders in its own Selected work gallery. Until entries exist, the page shows truthful sector experience. The creative lab stays explicitly separate: its generated concepts were made for this website by the coding assistant, not by Mohamed for clients. Categories are editable in `concepts.js`. Filters preserve source order, dialogs support previous/next, keyboard arrows, Escape and focus restoration. Without JS, image/video links open the real asset.

## Motion provenance and behavior

`still-form.webm` and `still-form.mp4` are silent, six-second programmed animations of the generated bottle artwork. They are not AI-generated video or client work. H.264 MP4 is the first source for wider native compatibility, with VP9 WebM fallback. No video loads or plays automatically; dialogs pause all competing media and stop playback on close. See `docs/generated-concepts.md`.

The offline renderer can regenerate either file against a running server: set `ASSET_ORIGIN` to the server URL and `MOTION_FORMAT` to `mp4` or `webm`, then run `node scripts/render-motion.mjs`. Requires a Chromium build supporting the chosen MediaRecorder codec. The hero uses the supplied photo and does not load Three.js; the original scene source is retained for reference. GSAP/Lenis loads only for fine-pointer desktop users without reduced motion. Mobile uses a short native transform entrance and native scrolling. Initial HTML never depends on animations.

## Approved contact, CV and domain

The premium refinement adds build-time contact rows in the main contact section, footer and mobile drawer, plus a locale-aware floating WhatsApp component. **The only public contact source is `src/data/profile.js` → `profile.contact`.** After explicit public approval, configure any of these fields; omit unavailable ones:

```js
contact: {
  whatsappPhone: '', // international digits only, country code, no +/spaces/leading zero
  facebook: '',      // full https://www.facebook.com/ profile URL
  facebookPage: '',  // independent verified page URL, optional
  email: '',
  linkedin: ''       // full HTTPS LinkedIn profile URL
}
```

`scripts/contact-template.mjs` validates destinations, encodes the prefilled WhatsApp message for EN/AR, and renders shared channel rows. A previously configured `contact.whatsapp` wa.me URL remains supported; `whatsappPhone` takes precedence. Invalid/missing phone, Facebook or LinkedIn values are omitted. No test opens these destinations or sends a message. The floating control uses safe-area spacing, logical RTL placement, keyboard tooltip/focus, and hides while menu/dialog overlays are open. Facebook has independent profile/page settings; no social SDK or tracking pixel is loaded. The owner-approved WhatsApp number is now enabled in `profile.contact.whatsappPhone`. Floating chat and all primary talk buttons open its localized wa.me destination. Other contact channels remain hidden until approved/configured.

`src/data/workflow.js` holds the new six-stage bilingual Strategy to Creative section. `src/js/workflow.js` owns its selection/observer cleanup. Services use native details/summary with descriptions accessible without JavaScript. Warm/ice-cyan tokens, workflow, service and social component styles are in `tokens.css` and `refinement.css`. Genuine approved cases remain separate from website-generated illustrative studies. The creative gallery now leads the page, followed by sector experience.

Additional checks: `node tests/refinement.mjs` covers workflow selection, accordion behavior, contact URL encoding/validation, missing-data gates, overlay visibility and six desktop/tablet/mobile screenshots. Set `REPORT_PREFIX=refinement` for `npm run test:performance` to preserve earlier lab reports.

WhatsApp is explicitly approved and configured; no form endpoint or other public contact channels are configured. The contact section is a truthful preview, with no form or dead contact controls. After explicit owner approval, set `profile.contact.email`, `profile.contact.whatsapp` (a verified `https://wa.me/...` URL) and/or `profile.contact.linkedin` (`https://www.linkedin.com/...`). These public configuration values are themselves approval assertions; never copy them from a CV automatically. Email opens the visitor’s mail app and does not send/store a message. No analytics or collection is enabled.

For a CV, obtain approval for a redacted public PDF, put that copy in `public/assets/documents/`, then configure `profile.cv = {src: '/assets/documents/approved-cv.pdf', permissionConfirmed: true}`. The private root CV must never be copied into `public/` or uploaded.

The site remains `preview: true` with `noindex, nofollow` and robots disallow. These are indexing instructions, not access control. The existing Vercel URL supplied in the owner?s brief is configured in `site-config.js`, so canonical/hreflang/OG image URLs, WebSite schema and the sitemap are generated. Replace it only with an owner-approved HTTPS origin. Without a domain, URL metadata and sitemap are omitted. Text Open Graph metadata, locale titles, a favicon and truthful Person schema are present; WebSite schema requires the actual domain. Set `preview: false` only for an approved launch and recheck the target host.

## Static deployment

For Vercel use build command `npm run build`, output directory `dist`. Both `/` and `/ar/` are real HTML outputs; no SPA catch-all or backend is required. Deploy only `dist/`, never the repository or source assets. No deployment was performed as part of this redesign.

For a subdirectory, set `SITE_BASE=/portfolio/` before building (PowerShell: `$env:SITE_BASE='/portfolio/'`). Both generated page links and Vite assets respect it. Clear `SITE_BASE` before returning to a root deployment.

## Verification

With the production preview running:

```sh
npm test
npm run test:experience
npm run test:a11y
npm run test:performance
npm run test:content
```

Install matching browsers if needed: `npm exec playwright install chromium firefox webkit`. Select another engine with `BROWSER=firefox` or `BROWSER=webkit`; in PowerShell use `$env:BROWSER='firefox'`. `TEST_URL` changes the origin, and `BROWSER_PATH` or `CHROME_PATH` can select a local binary. Browser tests use available cached Chromium as a fallback; Firefox/WebKit need protocol-compatible releases. Some Windows sandboxes require the Firefox content process to run outside the process sandbox.

The suites cover both routes, nine widths from 320–1920px, 200% reflow equivalent (640 CSS px from a 1280px viewport), menus/focus/inert/Escape, locale/hash links, real gallery filters/dialogs, media playback/pause, loading errors, reduced motion, no JS, failed motion module, no WebGL and public-bundle privacy gates. Screenshots are in `docs/redesign-*-{chromium,firefox,webkit}-*.png`; older screenshots/reports describe the previous design.

Current results and browser limitations are documented in `docs/redesign-verification.md`; raw axe and Lighthouse JSON live alongside it. Lighthouse is a local mobile lab measurement, not field INP or a guarantee for every device. Remaining launch inputs: authorized real campaign/image/video work, approved contact channels, optional redacted public CV, review of the existing Vercel domain (or an approved custom domain), and confirmation that freelance status remains current.

The Windows WebKit media runtime stalled with both encodes, so its default experience suite currently fails the real-playback assertion. `SKIP_MEDIA_PLAYBACK=1` explicitly skips only that check and prints the limitation; other WebKit interactions pass. Chromium and Firefox playback passes. Recheck native video on real Safari/iOS before public launch. `node tests/base-path.mjs` separately builds/tests the `/portfolio/` deployment and restores the root build.
