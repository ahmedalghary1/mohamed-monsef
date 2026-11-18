# AGENTS.md — Mohamed Monsef Portfolio

## 1. Mission and scope

Build and maintain a premium, bilingual, responsive personal portfolio for Mohamed Monsef, a Performance Media Buyer offering AI image and video production. Optimize for credibility, creative presentation, accessibility, performance and qualified contact inquiries. The full initial product specification is `PORTFOLIO_PROMPT.md` when present. This file defines persistent engineering and design rules for all tasks. Follow the owner's latest explicit requirements; never silently expand scope or fabricate content. Apply these rules throughout the repository unless a narrower scoped AGENTS.md provides compatible instructions.

## 2. Non-negotiable stack

- Semantic HTML5, CSS3, vanilla JavaScript (ES modules), Three.js, GSAP + ScrollTrigger, Lenis.
- Vite is a build tool, not a UI framework. No React, Next.js, Vue, Angular, Tailwind, Bootstrap, jQuery or new runtime dependencies without explicit approval or a demonstrated need consistent with the brief.
- npm; use compatible stable dependencies and commit the lockfile. Never guess APIs or versions; read installed types, package files and official docs. Prefer small local modules over new packages.
- Static multi-page build: English `/` and Arabic `/ar/`; both must remain crawlable, semantically structured and usable without JS for essential content. No backend unless separately requested.
- Maintain source/assets separately from `dist/`. Do not hand-edit the build output. Never place credentials, private CVs, unapproved contacts, unpublished client materials or private campaign screenshots in a public folder or production bundle. `noindex` is not an access control mechanism.

## 3. Source of truth and content ethics

The owner has explicitly approved the WhatsApp number configured in `profile.contact.whatsappPhone` for public floating and direct-chat CTA links. Other contact channels and the private CV still require their own approval. Preserve this approval on later edits; do not hide the approved WhatsApp channel merely because the site remains a preview.

- Name: Mohamed Monsef. CV title: Performance Media Buyer. Proposed positioning: Performance Media Buyer & AI Creative Specialist. AI image/video production is the service confirmed in the user brief, not a verified list of completed AI projects.
- CV: 2+ years of experience; freelance 2023–Present (as stated in CV; review current status before publication); Capital MAS June 2024–2025. No invented end month or double-counted overlapping years. Experience includes real estate, retail, dates/agri-food exports; Meta and Google Ads, audience segmentation, optimization, A/B testing, Facebook Pixel, Google Analytics, reporting and ROI analysis.
- Education: Bachelor of Science in Genetics, Al-Azhar University – Cairo, 2022–2026 (Graduate). Training: Advanced Media Buying Course — Abdo Ramadan; Advanced Media Buying Course — Abdelrahman Alaa; Mind Shift Course; Digital Product Course. Tools named in CV: ChatGPT, Claude and Microsoft Office. Do not imply more credentials, affiliations or specific AI visual tools.
- No campaign numbers, testimonials, client logos, project thumbnails, face images, case studies, availability status, social profiles, certificates, guarantees or years of AI expertise may be invented or inferred. No sample performance values on public pages. Never use fake counters or skill percentages. Distinguish ROI from ROAS.
- Accept only approved real projects with actual media and permission to publish. Label illustrative concepts explicitly as such. Do not attribute stock or generated demo assets to the owner. No generated likeness. No CV download unless file exists and approved for public use. Keep preview contact data outside the public bundle until owner approval; data fields alone are not consent. WhatsApp is approved in the public contact configuration; LinkedIn and Instagram remain unconfirmed.
- Use public approved profile fields in one data source; project entries need stable id, type, status, localized title and summary, media, optional verified metrics (period, unit, baseline/source where applicable) and permissionConfirmed. Filter at build time so drafts/private data are not shipped. No draft data in public JS. Missing fields are omitted. With no projects, show truthful sector experience and service descriptions, not broken placeholders or misleading galleries.
- Public copy must be natural in both languages. Preserve exact names and CV dates; do not translate brand names incorrectly. Contact/SEO URLs must be real and verified, not guessed.

## 4. Repository conventions

Prefer these modules (respect an existing sound structure):

```text
index.html
ar/index.html
src/styles/{tokens,base,layout,components,sections,motion,responsive}.css
src/js/{main,navigation,scroll,motion,hero-scene,gallery,contact}.js
src/data/{profile,projects,site-config}.js
public/assets/{brand,fonts,images,videos,documents}/
tests/
README.md
```

- Use kebab-case for files and CSS classes; camelCase for JS functions and variables; use consistent English identifiers. Use small modules with clear ownership and named exports. Use data attributes for JS behavior rather than coupling logic to styling classes. Keep CSS specificity low and styles scoped by component. No global mutation without an explicit reason. No inline JS event handlers; no unsafe innerHTML for user-controlled or data-driven content.
- Keep semantic headings, anchor targets and data contracts stable. Use CSS logical properties and shared tokens. Avoid duplicate layout rules and language-specific fixed positioning; Arabic is not a mechanical text reversal. Use source data or build-time generation for repeated content. Prefer native browser controls and APIs over custom equivalents.
- Every initializer returns cleanup or has explicit lifecycle ownership where it registers listeners, observers, animation instances, renderer resources or timers. Avoid duplicate listeners/RAF. Handle failed async module imports and asset loading without breaking unrelated features.
- Do not overwrite unrelated user changes; inspect git state and read relevant files first. Never delete user assets or perform broad refactors without need. Do not commit, push, publish or upload private material unless requested and authorized.

## 5. Design system (must be followed)

The final production-readiness brief supplies `image.png` as the approved updated portrait. Preserve it at `source-assets/portrait/mohamed-updated.png`, use its optimized `public/assets/images/profile/` derivatives, and retain the older original separately. The new opaque navy/cyan background is part of the supplied image, not transparency. No face reconstruction, stretch, circular frame, extra MM backdrop or extra glow. Use the latest concise bilingual hero copy. The owner-supplied production domain is now `https://mohamed-monsef.vercel.app`; keep preview indexing blocked until launch approval. Enquiries stay browser-local, with explicit copy/open-WhatsApp actions only; no tracking of enquiry text. Comparison pairs require explicit media permission and remain absent without genuine assets.

The latest premium refinement brief takes precedence for tokens and composition: warm `#F5F5F0` canvas, ice cyan `#67E8F9` on dark, secondary dark `#111D2E`, dark border `#263244`, and 1360px container. Keep the approved filled MM identity. Present clearly attributed creative explorations before industry experience; never relabel illustrative assets as the owner's work. The signature workflow now has six stages and services use native details/summary. Contact settings remain in `profile.contact`; render floating WhatsApp and Facebook channels only for valid owner-approved public configuration. Missing values stay omitted.

The owner’s November 2026 redesign brief supersedes the original light-only direction, abstract hero and original palette/type choices. The active direction is Creative Performance: a navy portrait-led hero, light editorial work/services/about sections, a dark motion study and a navy contact/footer. Use the real supplied portrait unchanged in an editorial frame; never generate or reconstruct the owner’s face. Source photo stays in `source-assets/portrait/`; only approved WebP derivatives are public.

| Token | Value | Purpose |
|---|---|---|
| bg | #F8FAFC | canvas |
| surface | #FFFFFF | content surfaces |
| ink | #0F172A | primary type |
| deep | #080F1C | hero, motion and contact |
| dark-surface | #172338 | dark supporting surfaces |
| text-secondary | #475569 | supporting type on light |
| muted | #94A3B8 | supporting type on dark |
| brand | #22D3EE | cyan on dark |
| action | #0E7490 | text and actions on light |
| action-hover | #0891B2 | accent hover; validate foreground |
| line | #E2E8F0 | decorative dividers |
| accent-soft | #E8F5F7 | soft accent surfaces |
| positive | #15803D | verified positive results only |

Use a single `tokens.css` as source of truth. Spacing scale: 4/8/12/16/20/24/32/40/48/64/80/96px, container max 1320px, section space clamp(64px, 8.5vw, 136px), gutters clamp(20px, 4.5vw, 72px). Radii 8/16/24px, soft shadows only where hierarchy benefits. Grid desktop 12, tablet 8, mobile 4 as needed; no excessive card nesting. Typography: Space Grotesk display, Inter body, system monospace for limited labels, IBM Plex Sans Arabic for AR. Self-host licensed WOFF2 assets and fall back cleanly. Fluid headings, readable body copy, natural Arabic letter spacing, controlled line lengths. Check all state contrasts instead of assuming a token passes everywhere.

Art direction: premium editorial, performance marketing and creative technology. Roughly 60% light, 30% dark and 10% accents. Strong hierarchy, aligned margins and purposeful whitespace. Avoid excessive glass, generic SaaS dashboards, every-section bento, random gradients, decorative metric widgets, custom cursor and motion for its own sake. The supplied portrait, custom MM monogram and clearly attributed concept images anchor the identity. Reference images are inspiration only and must not be published as portfolio work.

Default order: header → hero → credibility → selected work / AI creative showcase (or truthful sector experience if empty) → services → process → about & experience → skills/training → contact → footer. Keep conversion paths easy to find. Primary CTA to work; secondary to contact. Every visible control must perform its stated action. If data or permission is missing, conditionally omit related controls; do not use dead links or fake success toasts.

## 6. Interaction, accessibility and localization

- Mobile-first and responsive at 320–1920+ CSS px, desktop and touch, both languages. Use fluid grid, minmax(0,1fr), aspect-ratio and content-driven breakpoints. No horizontal overflow, fixed width body or content lost under overlays. Test 200% zoom/reflow. Aim for touch targets >=44px where possible.
- Target WCAG 2.2 AA, not a claim of certification. Text contrast >=4.5:1 normal and >=3:1 large; necessary UI component boundaries and focus states per applicable criteria. Use skip link, landmarks, meaningful heading hierarchy, accessible names, keyboard operation, focus-visible and relevant alternative text. Do not use color alone. No positive tabindex.
- Keep initial HTML visible. If JS fails, never leave text hidden by initial animation styles. Respect prefers-reduced-motion; skip nonessential motion for those users. Native touch/keyboard scrolling must work. Scroll lock is allowed only while a mobile drawer or modal is open, with restoration on close. No scroll snapping or global wheel cancellation.
- HTML `lang`/`dir` correct, full AR and EN translations, logical CSS, use bdi for mixed-direction metric labels; use actual locale URLs for language switch. Do not rely only on localStorage for language content. Preserve URL hash when meaningful.
- Prefer native anchor links, real buttons for actions, aria-current where appropriate. Mobile menu disclosure/dialog must support ESC, focus management and close on navigation. Work filters must preserve order, provide an accessible active state and communicate results. Dialogs need clear close, keyboard support, focus containment/restoration, mobile scroll support. Stop video on close and prevent concurrent audio. No autoplay audio.
- Contact is static unless a real endpoint is commissioned. An optional mailto composer must say it opens the visitor's email app, not that it sends a message. Encode fields, validate, avoid logging or storing personal data. Do not turn on collection or tracking without authorization.

## 7. Motion engineering

- GSAP/ScrollTrigger for lightweight entry animations and purposeful timeline reveals. Opacity/transform primarily; 0.4–0.8s, y <=24px, restrained staggers; run reveal once where appropriate. Use matchMedia/context, remove triggers and restore styles on teardown. Avoid animating layout and expensive filters. Failure must not block content.
- Lenis on compatible fine-pointer devices only, if reduced motion is off. Native touch and keyboard fallback. Use its official CSS. Synchronize with ScrollTrigger and one ticker: `autoRaf: false` if driving from GSAP, named callback `time => lenis.raf(time * 1000)`. Apply lag smoothing settings from version docs, remove callbacks/destroy instance when disabled, avoid duplicate RAF. Preserve hash, anchors, history, native focus scroll and modal internal scroll; `scroll-margin-top` for sticky nav. Refresh triggers only after actual layout change. Test native mode.
- The active portrait design does not load Three.js or require WebGL. The original hero scene module may remain as unused source, but must not enter the active bundle. If a future approved design restores it, lazy load after critical content, keep one inexpensive renderer, provide a visible static SVG fallback, bound DPR, pause offscreen/hidden, handle context loss and dispose all resources. Never obscure accessible content with a canvas.

## 8. Performance and SEO policies

- Responsive WebP/AVIF with fallback, dimensions on media, poster assets, lazy load noncritical assets, only LCP priority as appropriate. No bulk video preload; use preload=none/metadata and native playback controls. Compress video; provide captions where applicable. No asset hotlinking or unlicensed media. Never reference files that do not exist.
- Initial compressed transfer target <=500KB before 3D/videos; split noncritical code. Targets: Lighthouse mobile Performance >=90, Accessibility >=95; LCP <=2.5s, CLS <=0.1, INP <=200ms as field goals. Record actual test environment and results; never imply lab scores prove field performance or promise perfect scores. If budget fails, profile and prioritize essentials.
- Metadata and titles per locale, canonical/hreflang/OG/sitemap only with actual domain/approved assets; Person/WebSite schema only truthful approved public fields. Preview noindex until deployment approval. Use real favicon and image paths. Verify build works on static hosting and `/ar/` route resolves on refresh. Respect base path. No SPA-only routing.

## 9. Workflow and definition of done

Before coding: read this file, inspect repo, determine scope, review design/data, identify missing assets and source facts. Plan in short verifiable stages; keep the user moving toward a working implementation. Make scoped edits and test after each phase, not just at the end. If a nonessential input is missing, choose a reversible default and document it; if proof/permission is missing, omit the claim/asset rather than fabricate. Do not block the whole implementation on unprovided images or case studies.

Use actual package scripts; configure equivalent checks for new repo. Typical commands:

```sh
npm install       # first setup / dependency changes only
npm ci            # reproducible install with valid lockfile
npm run dev
npm run build
npm run preview
npm run test      # if implemented; otherwise document actual checks
```

Do not run destructive commands, change package manager or install dependencies unnecessarily. Check `git diff` before delivery. Use lint/format tooling if configured. Use automated browser tests (Playwright or existing equivalent) for navigation, both locales, filters, media dialogs, contact gating, responsive layout, keyboard, reduced-motion, no-WebGL and JS failures. Check console/network errors. Screenshot desktop and mobile in both languages, across 320/360/390/430/768/1024/1280/1440/1920px where feasible, review alignment, clipping and typography. Run Lighthouse/axe if available and record results. Test Chromium, Firefox and WebKit where accessible. Add regression tests for fixed defects. Do not invent test results or say a test passed when not run. Report blocked checks and reasons.

Done requires: functional build, both language routes, correct content, real CTAs, zero known broken links or critical console errors, usable fallback paths, responsive and accessible behavior, truthful empty states, no leakage of draft/private files, documented performance measurements and limitations. README covers setup/build/deploy, adding approved cases and media, updating text/colors, enabling verified contact fields, approved CV download, domain setup, and test commands. Public launch requires owner approval for contact, data, assets and domain.

Final response after work: summarize implemented changes, key files, commands and actual results, outstanding inputs (real project screenshots/images/videos, optional portrait, approved public CV/contact/domain), and any failed/unavailable checks. Never claim the website is deployed, working on every device, or WCAG certified without evidence. Do not stop at a plan if implementation is requested.
