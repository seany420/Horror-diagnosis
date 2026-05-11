# Character Art Override

Drop PNG files here to replace the default SVG portraits.

**Naming**: `{character_id}.png` — for example, `the_final_girl.png` or `the_perfectionist_swan.png`.

**Sizing**: Any size renders, but 600×840 (3:4 aspect ratio) is recommended for best appearance in match cards and roster grid.

**Override mechanism**: The portrait generator checks for a PNG at `assets/characters/{id}.png` first; if it exists, it renders. If missing, the SVG fallback renders automatically — no code change needed.

**Generating art**: See `/docs/CHARACTER_PROMPTS.md` for IP-safe prompts you can run through Midjourney, DALL-E, Stable Diffusion, etc.

**Character IDs**: All 61 IDs are listed in `/js/characters.js` — search for `id:` to enumerate them.
