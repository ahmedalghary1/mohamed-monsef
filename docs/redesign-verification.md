# Redesign verification — 18 November 2026

Implemented locally in the existing repository. No Git commit, push, source upload or deployment was performed. The new English `/` and Arabic `/ar/` documents remain a preview with indexing blocked.

## Delivered

- New navy/light editorial design system, local Space Grotesk/Inter/IBM Plex Sans Arabic, geometric MM mark, SVG favicon and portrait-based 1200×630 sharing image.
- Owner’s actual portrait, resized/compressed only, in an editorial frame. Original preserved byte-for-byte in `source-assets/portrait/mohamed-original.jpeg`; root `image.jpeg` untouched. Background removal was unavailable, so the original white/yellow backdrop is retained per the brief’s fallback.
- Semantic bilingual static HTML, sticky desktop navigation and mobile drawer with Escape, focus containment, inert background, close-on-navigation and scroll restoration.
- Truthful industry experience instead of invented campaign results. Separate, explicitly attributed website-generated image studies; real filters, category counts, image dialogs, previous/next and RTL keyboard navigation. Navigation controls are omitted when a filter leaves only one study.
- Dedicated motion section with actual silent six-second MP4/H.264 and WebM/VP9 files, native controls, full-screen capability, original-file links, load/error feedback and pause on close. These are programmed illustrations, not AI-generated videos or Mohamed’s client work.
- Four service groups, connected process, about, CV-grounded career timeline, education, skills/training and contact preview. Source CV dates were verified; Arabic display labels are localized without changing source dates.
- Centralized content/profile/projects/config, build-time permissions and local-media validation, conditional direct contact/CV/SEO, complete README and updated persistent design rules.
- GSAP/ScrollTrigger/Lenis only on suitable fine-pointer desktop devices without reduced motion. Mobile uses native scrolling and a short transform entrance. No Three.js/GPU dependency in the active page.

## Commands and functional checks

Environment: Windows, PowerShell, Node 24.15.0, npm, Vite 8.3.8, Playwright 1.65.1, localhost production preview `http://127.0.0.1:4173`. Exact installed dependency versions are pinned; lockfile retained.

| Check | Actual result |
| --- | --- |
| `npm.cmd ci --no-audit --no-fund` | Passed after enabling required network/cache access; initial sandbox install could not write npm logs |
| `npm.cmd run build` | Passed; independent English and Arabic HTML plus split JS/CSS assets |
| `npm.cmd test` on Chromium 145.0.7632.6 | Passed |
| `BROWSER=firefox npm.cmd test` on Firefox 159.0 | Passed; Windows content process required execution outside the restricted process sandbox |
| `BROWSER=webkit npm.cmd test` on Windows WebKit 27.2 | Passed |
| `npm.cmd run test:experience` on Chromium | Passed, including real MP4 playback and pause on close |
| `BROWSER=firefox npm.cmd run test:experience` | Passed, including real MP4 playback and pause on close |
| Default WebKit experience suite | **Failed:** native video playback did not begin within 8 seconds. Both VP9 and H.264 were attempted; the Windows media runtime stalled. Do not treat WebKit video playback as verified |
| `BROWSER=webkit SKIP_MEDIA_PLAYBACK=1 npm.cmd run test:experience` | Remaining interactions passed in both locales. The explicit skip prints a warning and does not assert playback success |
| `npm.cmd run test:a11y` | Passed: zero axe violations in 20 states; raw results `redesign-axe.json` |
| `node tests/base-path.mjs` | Passed for `/portfolio/` and `/portfolio/ar/`, direct HTTP requests, assets and language links; root build restored afterward |
| `npm.cmd run test:content` | Passed: configured Vercel canonical/hreflang/OG/schema/sitemap, locale metadata, brand/video assets and contact/CV preview gates |
| `git diff --check` | Passed; only Windows LF/CRLF conversion notices |

Each browser’s page suite checks both locales at 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 CSS pixels: 18 viewport checks per engine, with no detected horizontal overflow. It also tests 640px reflow equivalent to a 1280px window at 200% zoom. This is a layout-viewport equivalence check, not a claim of manually operating browser zoom on physical devices.

Covered: heading bounds, image loading, all fragment targets, menu focus/inert/Escape/scroll lock, close-on-navigation, language/hash preservation, missing-contact/CV gating, no-JS navigation and original-media links, failed motion import, no-WebGL independence, draft exclusion and private-data scans across built HTML/JS/CSS/JSON/text. No unexpected page exceptions or HTTP errors were observed in the passing suites. Deliberately aborted assets are exercised separately to verify failure messages.

A final console-error listener check scrolled every main section in both routes with desktop motion active: zero console errors and zero page exceptions.

The interaction suite checks all six category counts/order, previous/next, RTL arrows, single-result control gating, Escape, focus restoration, native dialog scrolling, reduced-motion teardown, real playback where supported, pause on close and image error recovery. The axe run covers both languages, 1440px and 390px, with reduced motion on/off; each page and dialog plus the mobile menu are scanned. Axe is automated evidence, not WCAG certification or a substitute for assistive-technology review.

Browser setup: the initial cached Firefox/WebKit versions used incompatible automation protocols. Matching engines were installed. The existing Chromium binary was usable; its version is recorded rather than represented as the newest browser. Physical Safari/iOS/Android devices and screen readers were not available. Windows WebKit’s media limitation remains open for a real Safari/device check. Native controls, dual encodes, loading feedback and original-file links remain available; no fake playback success is shown.

## Visual review

Captured and inspected desktop/mobile English and Arabic screenshots, plus the image lab and project dialog. Image assets are decoded before full-page capture. Representative files:

- `redesign-en-chromium-desktop.png`, `redesign-ar-chromium-desktop.png`
- `redesign-en-chromium-mobile.png`, `redesign-ar-chromium-mobile.png`
- `redesign-en-chromium-hero.png`, `redesign-ar-chromium-hero.png`
- `redesign-en-chromium-mobile-hero.png`, `redesign-ar-chromium-mobile-hero.png`
- `redesign-en-lab.png`, `redesign-ar-lab.png`, `redesign-en-dialog.png`, `redesign-ar-dialog.png`

Firefox and WebKit page screenshots are also retained with engine names. Earlier unsuffixed screenshots/reports predate this redesign. Fixed a mobile backdrop stacking defect exposed by pointer tests and contrast defects caused by pre-reveal opacity; entering headings now retain full contrast and dialog entrance is transform-only.

## Final Lighthouse mobile lab results

Command: `npm.cmd run test:performance`. Lighthouse 13.6.0, Chromium 145.0.7632.6, Windows localhost static production build, 412×823 mobile emulation, DPR 1.75, simulated throttling, 150ms RTT, 1638.4Kbps throughput and 4× CPU slowdown. Final measurement timestamps: 07:11 UTC / 09:11 Cairo on 18 November 2026. The report includes exact configuration and environment.

| Metric | English | Arabic |
| --- | ---: | ---: |
| Performance | 99 | 99 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 69 | 69 |
| First Contentful Paint | 0.9s | 1.4s |
| Largest Contentful Paint | 0.9s | 1.9s |
| Cumulative Layout Shift | 0.082 | 0 |
| Total Blocking Time | 3ms | 0ms |
| Speed Index | 0.9s | 1.4s |
| Reported transfer | 299KiB | 305KiB |

SEO is intentionally limited by `noindex, nofollow` and robots disallow; removing that gate requires launch approval. Canonical/hreflang/sitemap/absolute sharing-image URLs use the existing Vercel domain supplied by the owner and verified during the audit. All non-indexing SEO checks in the reports pass. These are local lab samples, not field INP measurements, production guarantees or proof for every device. Network compression/cache policy on the eventual host may differ. Raw reports: `lighthouse-redesign-en.json`, `lighthouse-redesign-ar.json`; compact summary: `redesign-performance.json`.

## Launch inputs and limits

Still needed: genuine approved campaign media and outcomes, owner-created AI images/videos/showreel with attribution and rights, explicit public email/WhatsApp/LinkedIn approval, optional redacted public CV, review of the existing Vercel domain (or an approved custom domain) and confirmation that freelance status remains current. No testimonials, client logos, availability claims, fabricated results, social profiles or private contact values have been added. The portrait is already supplied and integrated; a clean owner-approved cutout can replace the framed derivative later.

The site is ready for local review. Public launch and actual hosting/domain behavior remain unverified because no deployment was requested. Preview indexing controls do not make private files safe to publish: only `dist/` is deployable, and private root/source files must remain outside it.
