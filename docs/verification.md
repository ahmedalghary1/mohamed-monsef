# Verification — 17 November 2026

Environment: Linux, Node 22.22.1, npm 9.2.0; local Vite production preview on 127.0.0.1:4173. No public deployment. Existing workspace was not a Git repository, so git diff/status could not be used; original AGENTS.md, prompt and PDF were preserved.

## Actual checks

- `npm run build`: passed; both independent locale entry points generated.
- `npm test`: passed in Chromium and `BROWSER=firefox npm test`: passed. Checks EN/AR lang, H1, 320/360/390/430/768/1024/1280/1440/1920 CSS px without horizontal overflow, desktop menu hidden, mobile disclosure and Escape, close after navigation, anchor hashes and hash-preserving language switch, no unapproved contact/CV/project controls, no-JS navigation/content, no-WebGL SVG fallback, reduced-motion change, draft exclusion and absence of CV email/phone in built HTML. Test-only gallery fixture verifies filters, active state, native dialog Escape and restored focus. No page errors / failed responses in tested standard flows.
- `npm run test:a11y`: axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tags, zero violations on either route after darkening secondary text. Automated result is not WCAG certification or a full manual accessibility audit.
- Screenshots saved for desktop 1440px and mobile 390px in both languages; full-page captures reviewed for layout/RTL. The suite re-captures these for each browser. Other widths were checked automatically. Physical devices, browser UI 200% zoom and manual assistive-technology testing were not performed; 320px reflow was checked.
- WebKit browser downloaded but execution blocked by missing host libraries: libevent-2.1-7t64, libavif16, libmanette-0.2-0. No WebKit pass claimed.
- Impeccable guarded context/detector ran; narrow in-thread review used, no delegated critique run. Detector flagged small captions; corrected to 12px. Project-directed labels, palette and abstract geometry retained. Current web-interface-guidelines fetched read-only and reviewed against sources. No hooks installed.
- A first axe invocation failed due to its context API requirement; corrected to explicit browser.newContext and reran successfully. Initial package install timed out; retry succeeded.

## Lighthouse mobile lab

Lighthouse 13.6.0, headless Chrome 149 on this Linux host, default simulated mobile throttling (Moto G Power profile), local production preview, one final run per route. Saved raw reports: lighthouse-en.json and lighthouse-ar.json.

| Route | Performance | Accessibility | LCP | CLS | Total resource bytes |
|---|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 1.35 s | 0 | 100,509 |
| `/ar/` | 98 | 100 | 1.36 s | 0.094 | 105,478 |

These are lab observations, not field guarantees; no field INP measured. Arabic font swap contributes to CLS, within 0.1 in this run. Mobile uses the static scene; fonts are local. Gzip build sizes: core JS 2.24KB, CSS about 3.5KB; deferred motion 49.74KB and deferred Three.js scene 133.29KB. Vite warns that the lazy scene is 538.67KB minified (>500KB). It is excluded from mobile/reduced-motion scenes, renders on demand, and is not part of essential content. Initial mobile transfer is below the 500KB target in these runs.

## Dependency audit

`npm audit` reported four high findings in the Vite development-tool chain (picomatch/fdir/tinyglobby/Vite). The registry reported latest picomatch 4.0.7, which the advisory currently includes; no compatible patched version was available to adopt. No forced Vite downgrade was applied. Vite is a dev dependency, binds to localhost, and is not shipped to static hosting. Recheck and update the lockfile when a compatible fix is released. This is an outstanding tooling limitation.

## Release inputs

Real projects/media and publishing rights; approved public contact fields; optional redacted CV/portrait; actual domain and approval to enable indexing. Confirm continued freelance status stated as 2023–Present in the supplied CV. Public contact and CV are deliberately withheld. No private PDF or briefing documents appear in dist. Domain-specific SEO is generated only once a domain is supplied; no invented domain or OG image.

Subpath regression: initial `SITE_BASE=/portfolio/` build revealed source-module URLs incorrectly prefixed during generation. Fixed source entry references so Vite resolves them and prefixes output assets. Retested both `/portfolio/` and `/portfolio/ar/` on a plain static HTTP server, including asset responses. Restored the default root build afterward.
