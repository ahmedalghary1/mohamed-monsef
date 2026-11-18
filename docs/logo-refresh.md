# MM logo refresh

Owner request: replace the previous thin line monogram with a professional logo.

The new mark uses two filled M letterforms, matching stem widths, open internal spaces and complementary cuts on the outer corners. It works in one color; the cyan/navy palette comes from the current identity. The name uses a compact two-line arrangement in English and Arabic in the header/footer. This is original vector construction, not a raster image or an external icon.

Geometry source: `src/data/brand.json`. The Node HTML renderer and Python brand exporter read the same polygons, keeping all uses consistent. Updated: header, footer, portrait corner, about identity panel, favicon and sharing image.

Exports in `public/assets/brand/`:

- `monogram.svg`: currentColor vector
- `logo-navy.svg`, `logo-white.svg`, `logo-cyan.svg`: fixed-color transparent vectors
- `logo-transparent.png`: 1440×1120 RGBA, transparent background
- `logo-preview.png`: 1440×960 presentation sheet
- `social-preview.png`: updated 1200×630 sharing image

`public/favicon.svg` uses the same geometry on a navy tile. Regenerate brand assets with `python scripts/prepare-assets.py --brand-only`; portrait derivatives and the original photograph are left untouched. Rebuild HTML with `npm run build`.

Verification performed on this change:

- `npm.cmd run build`: passed.
- `npm.cmd run test:content`: passed.
- `npm.cmd test`: passed on Chromium 145.0.7632.6, including both languages, 18 viewport checks from 320–1920px, 200% reflow equivalence, menus, language/hash, no-JS and privacy gates.
- Checked all four inline marks in each locale use the same new geometry and contain two polygons.
- All SVG/PNG exports and favicon returned HTTP 200. Production-route console/page-error scan was clean.
- Favicon rendered at 16/24/32/48/64px. Inspected the presentation sheet, sharing image, EN/AR desktop/mobile headers and portrait mark.
- Captures: `docs/logo-{en,ar}-{desktop,mobile}.png` and `docs/logo-favicon-sizes.png`.

No dependency added, photo retouching, commit or deployment. Broader Lighthouse/axe/Firefox/WebKit results in the redesign report are the earlier baseline and were not rerun for this focused branding change.
