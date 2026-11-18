# Floating WhatsApp icon correction

Replaced the hand-built compound path with a clean local MIT-licensed SVG (Bootstrap Icons v1.13.1, license beside the asset). Removed the nested dark disc/padding and centered the 32px white glyph on the existing green button. All WhatsApp placements share this source; destination, locale messages, tooltip, keyboard focus and overlay behavior remain owned by the existing components. No framework or dependency was added.

`npm.cmd run build` and `npm.cmd run test:content` passed. Focused Chromium verification passed for EN/AR at 1440px and 390px: correct viewBox, one intact path, transparent glyph background, center alignment and approved chat destination. No chat was opened. Mobile capture visually reviewed; captures are `docs/whatsapp-icon-{en,ar}-{1440,390}.png`. `git diff --check` passed apart from Windows line-ending notices. No deployment performed.
