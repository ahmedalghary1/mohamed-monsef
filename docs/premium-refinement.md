# Premium UI/UX refinement — 18 November 2026

Local implementation in the existing checkout; no commit, push or deployment. The working tree already contained the previous redesign and owner-requested MM logo. Those changes/assets were preserved. Baseline `npm.cmd run build` and `npm.cmd test` passed before implementation.

## Changes and observations

The previous page led with sector rows, used a cold white canvas and small supporting text, repeated a four-stage static process, and had no configurable Facebook/floating WhatsApp components. The refinement introduces warm white `#F5F5F0`, ice cyan `#67E8F9`, secondary navy `#111D2E`, dark dividers `#263244` and a 1360px editorial container. Supporting text is larger; the portrait has a calm, straight frame and faint MM backdrop. The supplied face/photo and filled MM logo were preserved.

The clearly disclosed creative explorations now lead the work section, followed by truthful sector experience. A wide 16:9 feature leads a portrait/square pairing. Filters show only categories containing actual entries. Existing filters, full-media dialogs, previous/next and provenance labels are retained. There are no genuine approved cases in the current data, so the website does not call these illustrations Mohamed's client work. During visual review a broad `:has([hidden])` selector was found to match hidden dialog loading messages and incorrectly collapse the unfiltered composition; it now targets hidden project articles specifically, with a regression assertion.

Services now use native details/summary: real expandable rows, keyboard support and descriptions available without JavaScript. The old card-row CSS was removed. The new Strategy to Creative section has six bilingual stages, a custom SVG feedback loop, accessible selection buttons, scroll-selected highlights, and a visible explanation. It uses static content without JS, no horizontal mobile scrolling, no pinning, and no results/metrics. Observer/listener cleanup is owned by its initializer; desktop SVG motion uses the existing GSAP context.

The header gains a compact scrolled state; the mobile drawer now includes language and contact actions. Footer typography is larger and configured contact methods appear consistently in the contact section, footer and mobile drawer. Existing no-JS, reduced-motion, language/hash, sticky navigation, media pause and private-data gates remain.

## Main files

- `src/styles/tokens.css`, `main.css`, `refinement.css`: palette, typography and editorial/service/workflow/social layouts.
- `src/data/workflow.js`, `src/js/workflow.js`: localized six-stage methodology and lifecycle-owned interactions.
- `scripts/contact-template.mjs`: one normalization/rendering pipeline for configured contact methods and floating WhatsApp.
- `src/data/profile.js`: **the only public contact configuration** (`profile.contact`); current value remains empty.
- `scripts/generate.mjs`, `scripts/experience-template.mjs`: page order, native services, workflow and shared channel integration.
- `src/js/navigation.js`, `main.js`, `motion.js`: drawer integration, lifecycle and workflow-line motion.
- `tests/refinement.mjs`: contact encoding/gating, overlay visibility, service/workflow behavior and visual captures.
- `scripts/performance.mjs`: optional report prefix to retain historical measurements.

## Contact configuration

After explicit public approval, edit `profile.contact` in `src/data/profile.js`:

```js
contact: {
  whatsappPhone: '', // international digits, country code, no +, whitespace or leading zero
  facebook: '',      // verified full HTTPS Facebook profile URL
  facebookPage: '',  // independent verified full HTTPS Facebook page URL
  email: '',
  linkedin: ''       // verified full HTTPS LinkedIn URL
}
```

WhatsApp messages are localized and URL-encoded in `scripts/contact-template.mjs`. Previously configured wa.me URLs remain supported. Missing/invalid phone and social URLs are hidden. The floating control uses the WhatsApp bubble/handset mark, green exterior, white glyph on a dark inset for contrast, logical placement, safe-area offsets, keyboard tooltip, and hides during menu/media overlays. Facebook uses no SDK, feed or tracking pixel; verified Facebook/LinkedIn channels feed Person `sameAs`. External social links use `noopener noreferrer`. No contact values were copied out of the private CV. Email opens the visitor's email application; there is no submission endpoint or fake success.

No public channels are approved/configured currently: WhatsApp, Facebook, email and LinkedIn controls are correctly absent. Tests use local synthetic values and do not navigate to third parties or send messages. A public CV still requires a redacted file and explicit permission, as documented in README.

## Actual verification

Windows / Node 24.15.0 / Vite 8.3.8 / Playwright 1.65.1 / localhost production preview.

| Command / check | Result |
| --- | --- |
| `npm.cmd run build` | Passed, EN/AR static pages |
| `npm.cmd test` | Passed, Chromium 145.0.7632.6 |
| `npm.cmd run test:experience` | Passed, Chromium, including actual video playback/pause |
| `npm.cmd run test:content` | Passed metadata/assets/contact/CV gates |
| `node tests/refinement.mjs` | Passed localized URL generation, invalid/missing values, floating overlay hiding, workflow selection, native service expansion, featured composition regression, six screenshots and production console checks |
| `npm.cmd run test:a11y` | Zero axe violations in 20 EN/AR desktop/mobile page/menu/dialog states, with reduced motion on/off |
| Firefox 159 `npm.cmd test` + `test:experience` | Passed; browser content process needed execution outside the restricted process sandbox |
| Windows WebKit 27.2 `npm.cmd test` | Passed page/navigation/locale/privacy/fallback checks |

The page suites exercise 320/360/390/430/768/1024/1280/1440/1920 CSS pixels in both languages and 640px reflow equivalent to 200% of a 1280px viewport, not physical browser-zoom operation. No horizontal overflow was detected. Actual snapshots at 1440, 768 and 390px in both languages are `docs/refinement-{en,ar}-{width}.png`; visually reviewed representative desktop and Arabic mobile captures, with remaining sizes captured by the same checks. No unexpected production page or console errors were observed.

Windows WebKit native video playback stalled in the earlier redesign verification and was not re-certified here. Chromium and Firefox real playback pass. Real Safari/iOS/Android devices and screen readers are unavailable. No WCAG certification or every-device guarantee is claimed. Preview-indexing and static domain behavior are retained; prior subpath verification is documented in `redesign-verification.md`.

## Mobile Lighthouse lab sample

`REPORT_PREFIX=refinement npm.cmd run test:performance`: Lighthouse 13.6.0 / Chromium 145 / Windows localhost build, 412×823, DPR 1.75, simulated 150ms RTT/1638.4Kbps throughput and 4× CPU slowdown. Recorded 08:17 UTC / 10:17 Cairo, 18 November 2026.

| Metric | EN | AR |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 69 | 69 |
| LCP | 1.2s | 1.3s |
| CLS | 0.005 | 0 |
| TBT | 0ms | 0ms |
| Transfer | 416KiB | 422KiB |

Raw evidence: `lighthouse-refinement-{en,ar}.json` and `refinement-performance.json`. These are lab samples, not production field INP or performance guarantees. The SEO limitation is intentional preview `noindex`/robots blocking; launch approval is required before enabling crawling. The existing owner-supplied Vercel domain remains the canonical/hreflang/sitemap/sharing target.

## Remaining launch inputs

Approved public WhatsApp phone, Facebook profile/page, email/LinkedIn, optional redacted CV, actual permitted campaigns/images/videos/results and confirmation that freelance status remains current. The portrait is already supplied; its original backdrop is retained in the documented editorial-frame fallback. Next useful work is adding real approved portfolio material, followed by real-device media/accessibility review and an approved deployment. No placeholder contact action, invented performance figure or fictional client project was published.
