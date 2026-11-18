# Redesign audit and implementation plan — 18 November 2026

The latest supplied redesign brief overrides the original light-only direction. Implement locally in this repository; no publishing or uploads are authorized. The three supplied references are design references, not portfolio work.

## Audit

Reviewed the generator, both generated routes, all data, CSS and JS modules, Vite configuration, npm lockfile, browser/accessibility scripts, assets, README and original specification. Retrieved the existing Vercel HTML for comparison after the web reader could not open it. Verified experience and education dates directly against the private source PDF without copying personal contact data into the build.

Reuse: static multipage generation; local Inter and Arabic fonts; GSAP/Lenis; publishable-project permission checks; generated concept images; native media controls; browser and axe infrastructure. Preserve exact CV dates and provenance labels.

Weaknesses: abstract hero lacks personal identity; overly long sticky process; duplicated credibility/ribbon content; all concepts lack category filters; video hidden inside first concept; no previous/next dialog controls; mobile navigation lacks containment; old design has no coherent light/dark rhythm or social image. Contact channels are intentionally gated.

## Verifiable stages

1. Establish tokens, local Space Grotesk, custom SVG MM, portrait WebP derivatives and original source copy. Use an editorial frame because a clean non-generative background removal pipeline is unavailable.
2. Rebuild semantic EN/AR documents from centralized public content: navy hero, expertise strip, open industry rows, image lab, dedicated motion study, service rows, four-step process, about, experience, toolkit and contact. Reuse verified facts and no invented results.
3. Implement accessible mobile drawer, active anchors, filters, media loading/errors, project previous/next, video ownership and modest GSAP entrances. Preserve no-JS and reduced-motion paths.
4. Build, test both locales across nine widths and available engines; inspect desktop/mobile screenshots; run axe and mobile Lighthouse; test base path, privacy gates and real approved-project fixtures. Record actual results and limits.
5. Update README, persistent design rules and verification report. Leave preview noindex and domain/contact/CV gating until launch approval.

Final domain decision: use the existing Vercel URL supplied in the owner?s brief for canonical/hreflang/sitemap and sharing metadata. The URL was verified during the audit; noindex remains enabled and no deployment is authorized.
