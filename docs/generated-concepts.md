# Concept assets — provenance

Created with the built-in image_gen tool for the explicitly approved illustrative lab. These are fictional concepts, not Mohamed Monsef’s completed work, real properties, real products or client campaigns. The public page and every dialog disclose this. No likeness, logos, results or client claims.

Final web assets: `public/assets/images/concepts/{bottle,architecture,dates}.webp`, with `-640.webp` responsive siblings. Original 1536×1024 generated PNGs remain in the local Codex generated_images directory; only resized/compressed WebP derivatives are shipped. Conversion preserves composition (1280×853 and 640×427). Original generation tool: built-in image_gen; no API/CLI fallback used.

## Final generation prompts

### bottle
Premium advertising concept product photography, landscape 3:2. A single unbranded matte ivory reusable water bottle with brushed metal cap hovering among precise translucent aqua acrylic planes and one deep navy sphere, soft cool grey studio background, dramatic soft side lighting, sophisticated realistic materials, generous negative space, elegant campaign art direction. No text, no logo, no people, no watermark. Original fictional concept for a media buyer portfolio, not an existing product.

### architecture
Premium editorial advertising concept, landscape 3:2. Sculptural contemporary coastal residence with a sweeping ivory concrete arch framing a turquoise pool and a single olive tree, sunlit limestone, architectural model realism, crisp shadows, deep navy pool reflections and soft aqua water, quiet atmospheric composition with an unusual low camera angle. No people, no text, no logos, no watermark. Fictional architectural concept, not a real property or client project.

### dates
Premium advertising still life concept, landscape 3:2. Rich glossy medjool dates suspended in a sculptural falling arc above a shallow ivory ceramic platter, one cut date revealing texture, pale sand background and warm directional sun, refined high end food photography, subtle aqua fabric at lower edge, generous negative space, tactile macro detail, artful editorial composition. No packaging, no text, no logos, no people, no watermark. Original fictional food advertising concept.

## Motion asset

November 2026 redesign: `public/assets/videos/still-form.mp4` is an additional silent six-second H.264 encode, created with Chromium canvas + MediaRecorder by the same offline renderer. MP4 is served first, with the original VP9 WebM as fallback. Neither format is AI-generated video. The original WebM remains unchanged. Set `MOTION_FORMAT=mp4` or `webm` when regenerating, and `ASSET_ORIGIN` to the running server. The site visibly preserves the programmed-study attribution.

`public/assets/videos/still-form.webm`: actual six-second, 960×640, silent VP9 video, made by `scripts/render-motion.mjs` using canvas + MediaRecorder in Chromium. It gently reframes the generated still and animates corner linework. It is a programmed motion study, explicitly labelled as such; it does not claim AI video generation or client authorship. Native controls; no autoplay; preload none; pauses on dialog close. Regenerate against `npm run dev` with `node scripts/render-motion.mjs` (`ASSET_ORIGIN` overrides origin).
