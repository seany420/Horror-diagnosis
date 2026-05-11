/* ============================================================
   SCREAM PROFILE — SVG PORTRAIT GENERATOR
   ============================================================
   Generates inline SVG portraits per character using each
   character's palette and a small library of symbolic forms.
   These ship as the v1 default — replaceable with AI art later
   by dropping PNGs into /assets/characters/{character.id}.png

   The override mechanism: if a PNG exists at the expected
   path, we render an <img> with an onerror fallback to the SVG.
   Browsers cache the 404 after first miss, so this is cheap.
   ============================================================ */

// Cache of which character IDs have a confirmed PNG override.
// null = unchecked, true = file exists, false = file missing.
const PORTRAIT_OVERRIDE_CACHE = {};

function getPortraitOverridePath(ch) {
  return `assets/characters/${ch.id}.png`;
}

function generatePortrait(ch) {
  const id = ch.id;
  const primary = ch.palette?.primary || "#3a1a1a";
  const accent = ch.palette?.accent || "#c4c4c4";
  const archetype = ch.archetype || "";

  // If we've previously confirmed the override doesn't exist, skip the img tag entirely.
  // Otherwise emit an <img> with an onerror handler that swaps in the SVG fallback.
  const overridePath = getPortraitOverridePath(ch);
  const overrideStatus = PORTRAIT_OVERRIDE_CACHE[id];
  const svgMarkup = generateSVGPortrait(ch);

  if (overrideStatus === false) {
    return svgMarkup;
  }

  // Embed the SVG fallback as a base64 data URI inside a data attribute,
  // so the onerror handler can swap it in if the PNG is missing.
  const svgFallbackB64 = (typeof btoa !== "undefined")
    ? btoa(unescape(encodeURIComponent(svgMarkup)))
    : "";

  return `
    <div class="portrait-wrap" data-character="${id}">
      <img
        class="portrait-img"
        src="${overridePath}"
        alt="${ch.name} portrait"
        loading="lazy"
        data-svg-fallback="${svgFallbackB64}"
        onload="window.PORTRAIT_OVERRIDE_CACHE && (window.PORTRAIT_OVERRIDE_CACHE['${id}'] = true)"
        onerror="(function(img){
          window.PORTRAIT_OVERRIDE_CACHE && (window.PORTRAIT_OVERRIDE_CACHE['${id}'] = false);
          const wrap = img.parentNode;
          const svgB64 = img.dataset.svgFallback;
          if (wrap && svgB64) {
            try {
              wrap.innerHTML = decodeURIComponent(escape(atob(svgB64)));
            } catch(e) {
              wrap.innerHTML = '';
            }
          }
        })(this)"
      />
    </div>
  `;
}

// Expose cache to window so the onerror handler can write to it.
if (typeof window !== "undefined") {
  window.PORTRAIT_OVERRIDE_CACHE = PORTRAIT_OVERRIDE_CACHE;
}

function generateSVGPortrait(ch) {
  const id = ch.id;
  const primary = ch.palette?.primary || "#3a1a1a";
  const accent = ch.palette?.accent || "#c4c4c4";
  const archetype = ch.archetype || "";

  // Choose symbolic motif by character category
  // Mapping: id → motif key
  const MOTIFS = {
    // Trauma / final girl
    the_final_girl: "lone_silhouette",
    the_haunted_witness: "watching_window",
    the_returning_daughter: "child_door",
    the_visiting_girl: "small_apparition",
    the_orphan_seer: "child_field",

    // Grief
    the_grief_keeper: "shadow_door",
    the_drowned_self: "sinking_figure",
    the_returning_revenant: "rising_figure",

    // Anxiety / ritual
    the_listener: "ear_dark",
    the_ritualist: "circle_marks",
    the_quiet_neighbor: "curtain_eye",
    the_pregnant_oracle: "vessel",

    // BPD / affective
    the_devoted_fan: "fractured_heart",
    the_changing_body: "mirror_split",
    the_invisible_girl: "ghost_outline",

    // Cluster B
    the_charming_predator: "smiling_mask",
    the_cabin_husband: "axe_doorway",
    the_perfect_child: "doll_face",
    the_mask_wearer: "two_masks",

    // Dissociation / psychotic
    the_dissociated_son: "double_self",
    the_psychic_child: "third_eye",
    the_unraveling_caretaker: "thread_unwound",
    the_basement_dweller: "underground",

    // Substance
    the_cellar_drinker: "bottle_shadow",
    the_chasing_thing: "running_figure",

    // ADHD / Autism
    the_distracted_protagonist: "scattered",
    the_uncanny_outsider: "different_shape",

    // ED / OCD
    the_perfectionist_dancer: "ballerina_crack",

    // Bipolar / void
    the_unbound_artist: "rising_burst",
    the_void_speaker: "abyss",
    the_eternal_returner: "ouroboros",

    // Caregiver / coping
    the_ferryman: "boat",
    the_vanishing_partner: "fading_figure",
    the_vengeful_returner: "blade_silhouette",
    the_bargained_self: "split_figure",
    the_captive_self: "caged",
    the_curious_investigator: "lantern",
    the_borrowed_face: "mirror_split",

    // ED / SUD / Insomnia / Schizotypal / Somatic / additional
    the_perfectionist_swan: "ballerina_crack",
    the_starving_addict: "fading_figure",
    the_binge_keeper: "shadow_door",
    the_chasing_addict: "running_figure",
    the_high_functioner: "two_masks",
    the_sleepless_writer: "scattered",
    the_dreamless: "ear_dark",
    the_unusual_seer: "third_eye",
    the_eccentric_outsider: "different_shape",
    the_paranoid_seer: "watching_window",
    the_body_horror: "mirror_split",
    the_unwell_caretaker: "vessel",
    the_melancholic_widow: "sinking_figure",
    the_hidden_depressive: "shadow_door",
    the_unsleeping_genius: "rising_burst",
    the_relational_survivor: "fractured_heart",
    the_panicker: "abyss",
    the_clean_haunted: "circle_marks",
    the_quiet_borderline: "ghost_outline",
    the_decompensating: "thread_unwound",
    the_acutely_overwhelmed: "axe_doorway",
    the_paranoid_patriarch: "underground",
    the_dependent_clinger: "double_self"
  };

  const motif = MOTIFS[id] || "lone_silhouette";
  const inner = renderMotif(motif, primary, accent);
  const characterAccent = renderCharacterAccent(id, primary, accent);

  return `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" class="portrait" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${darken(primary, 0.3)}" />
        <stop offset="100%" stop-color="#0a0a0a" />
      </linearGradient>
      <filter id="grain-${id}">
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
      <filter id="vignette-${id}">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
    </defs>
    <rect width="200" height="280" fill="url(#bg-${id})"/>
    <rect width="200" height="280" fill="${primary}" opacity="0.15"/>
    ${inner}
    ${characterAccent}
    <rect width="200" height="280" fill="url(#bg-${id})" opacity="0.0" filter="url(#grain-${id})"/>
    <rect x="2" y="2" width="196" height="276" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="0.5"/>
    <rect x="6" y="6" width="188" height="268" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
  </svg>`;
}

function darken(hex, amt) {
  const n = parseInt(hex.replace("#",""), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.max(0, Math.floor(r * (1-amt)));
  g = Math.max(0, Math.floor(g * (1-amt)));
  b = Math.max(0, Math.floor(b * (1-amt)));
  return "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
}

function renderMotif(motif, primary, accent) {
  const stroke = accent;
  const fill = primary;
  switch (motif) {
    case "lone_silhouette":
      // Final-girl style: standing figure, distant
      return `
        <ellipse cx="100" cy="220" rx="60" ry="8" fill="${fill}" opacity="0.4"/>
        <path d="M 100 100 C 88 100, 85 115, 88 130 L 90 200 L 95 240 L 105 240 L 110 200 L 112 130 C 115 115, 112 100, 100 100 Z" fill="${fill}"/>
        <circle cx="100" cy="92" r="14" fill="${fill}"/>
        <line x1="60" y1="240" x2="140" y2="240" stroke="${stroke}" stroke-width="0.5" opacity="0.5"/>
        <circle cx="100" cy="92" r="14" fill="none" stroke="${stroke}" stroke-width="0.3" opacity="0.6"/>
      `;
    case "watching_window":
      return `
        <rect x="60" y="50" width="80" height="110" fill="none" stroke="${stroke}" stroke-width="1" opacity="0.7"/>
        <line x1="100" y1="50" x2="100" y2="160" stroke="${stroke}" stroke-width="0.5" opacity="0.6"/>
        <line x1="60" y1="105" x2="140" y2="105" stroke="${stroke}" stroke-width="0.5" opacity="0.6"/>
        <ellipse cx="100" cy="100" rx="3" ry="6" fill="${accent}" opacity="0.9"/>
        <ellipse cx="100" cy="100" rx="1" ry="3" fill="${fill}"/>
        <path d="M 60 200 Q 100 195 140 200 L 140 240 L 60 240 Z" fill="${fill}" opacity="0.6"/>
      `;
    case "child_door":
      return `
        <rect x="70" y="60" width="60" height="160" rx="3" fill="${fill}"/>
        <rect x="70" y="60" width="60" height="160" rx="3" fill="none" stroke="${stroke}" stroke-width="1"/>
        <line x1="100" y1="60" x2="100" y2="220" stroke="${stroke}" stroke-width="0.4" opacity="0.5"/>
        <circle cx="120" cy="140" r="2" fill="${accent}"/>
        <circle cx="80" cy="140" r="2" fill="${accent}"/>
        <path d="M 90 230 L 110 230 L 105 270 L 95 270 Z" fill="${accent}" opacity="0.4"/>
      `;
    case "small_apparition":
      return `
        <ellipse cx="100" cy="245" rx="45" ry="6" fill="${fill}" opacity="0.3"/>
        <path d="M 100 130 C 90 130, 85 145, 86 165 L 88 220 L 92 245 L 108 245 L 112 220 L 114 165 C 115 145, 110 130, 100 130 Z" fill="${fill}" opacity="0.7"/>
        <circle cx="100" cy="120" r="11" fill="${fill}" opacity="0.85"/>
        <ellipse cx="96" cy="118" rx="1.5" ry="2" fill="${stroke}" opacity="0.6"/>
        <ellipse cx="104" cy="118" rx="1.5" ry="2" fill="${stroke}" opacity="0.6"/>
      `;
    case "child_field":
      return `
        <rect x="0" y="180" width="200" height="100" fill="${fill}" opacity="0.3"/>
        <ellipse cx="100" cy="240" rx="35" ry="4" fill="#000" opacity="0.4"/>
        <path d="M 100 150 C 92 150, 89 160, 91 175 L 93 215 L 97 240 L 103 240 L 107 215 L 109 175 C 111 160, 108 150, 100 150 Z" fill="${fill}"/>
        <circle cx="100" cy="143" r="9" fill="${fill}"/>
        ${[...Array(12)].map((_,i) => `<line x1="${20 + i*15}" y1="${190 + (i%3)*5}" x2="${20 + i*15 + 1}" y2="${175 + (i%3)*5}" stroke="${stroke}" stroke-width="0.5" opacity="0.5"/>`).join("")}
      `;
    case "shadow_door":
      // Babadook-style: shadow at threshold
      return `
        <rect x="60" y="40" width="80" height="200" fill="#000"/>
        <rect x="60" y="40" width="80" height="200" fill="none" stroke="${stroke}" stroke-width="1.2"/>
        <path d="M 80 80 L 100 60 L 120 80 L 120 220 L 80 220 Z" fill="${fill}" opacity="0.85"/>
        <ellipse cx="92" cy="110" rx="2.5" ry="3" fill="${accent}"/>
        <ellipse cx="108" cy="110" rx="2.5" ry="3" fill="${accent}"/>
        <line x1="100" y1="60" x2="100" y2="50" stroke="${fill}" stroke-width="2"/>
        <line x1="93" y1="55" x2="107" y2="55" stroke="${fill}" stroke-width="1.5"/>
      `;
    case "sinking_figure":
      return `
        <rect x="0" y="180" width="200" height="100" fill="${fill}" opacity="0.4"/>
        ${[120,150,170,200].map((y,i) => `<path d="M 0 ${y} Q 50 ${y-8} 100 ${y} T 200 ${y}" fill="none" stroke="${stroke}" stroke-width="0.6" opacity="${0.6 - i*0.1}"/>`).join("")}
        <circle cx="100" cy="190" r="14" fill="${fill}" opacity="0.7"/>
        <circle cx="100" cy="190" r="14" fill="none" stroke="${stroke}" stroke-width="0.5" opacity="0.5"/>
        <line x1="80" y1="220" x2="120" y2="220" stroke="${fill}" stroke-width="2" opacity="0.4"/>
      `;
    case "rising_figure":
      return `
        <rect x="0" y="200" width="200" height="80" fill="${fill}" opacity="0.4"/>
        <path d="M 100 80 C 90 80, 85 95, 88 115 L 92 200 L 95 230 L 105 230 L 108 200 L 112 115 C 115 95, 110 80, 100 80 Z" fill="${fill}"/>
        <circle cx="100" cy="72" r="13" fill="${fill}"/>
        <line x1="100" y1="40" x2="100" y2="70" stroke="${accent}" stroke-width="0.5" opacity="0.6"/>
      `;
    case "ear_dark":
      // Listener — ear shape
      return `
        <path d="M 100 60 C 70 60, 50 90, 50 130 C 50 175, 70 220, 100 220 C 110 220, 120 215, 125 200 C 110 195, 100 175, 105 150 C 110 130, 130 125, 135 105 C 130 80, 115 60, 100 60 Z" fill="${fill}"/>
        <path d="M 100 100 C 80 100, 75 130, 80 160 C 85 175, 100 175, 105 160" fill="none" stroke="${stroke}" stroke-width="1" opacity="0.7"/>
        <circle cx="100" cy="140" r="4" fill="${stroke}" opacity="0.4"/>
      `;
    case "circle_marks":
      // Ritualist — concentric marks
      return `
        <circle cx="100" cy="140" r="80" fill="none" stroke="${stroke}" stroke-width="0.5" opacity="0.3"/>
        <circle cx="100" cy="140" r="60" fill="none" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>
        <circle cx="100" cy="140" r="40" fill="none" stroke="${stroke}" stroke-width="0.6" opacity="0.6"/>
        <circle cx="100" cy="140" r="20" fill="${fill}"/>
        ${[...Array(12)].map((_,i) => {
          const a = (i/12) * Math.PI * 2;
          const x1 = 100 + Math.cos(a)*70, y1 = 140 + Math.sin(a)*70;
          const x2 = 100 + Math.cos(a)*80, y2 = 140 + Math.sin(a)*80;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="0.5" opacity="0.5"/>`;
        }).join("")}
      `;
    case "curtain_eye":
      return `
        <rect x="0" y="0" width="200" height="280" fill="${fill}" opacity="0.4"/>
        <path d="M 0 0 Q 50 60 100 30 Q 150 60 200 0 L 200 280 L 0 280 Z" fill="${fill}" opacity="0.7"/>
        <path d="M 70 130 Q 100 110 130 130 Q 100 150 70 130 Z" fill="${accent}" opacity="0.85"/>
        <circle cx="100" cy="130" r="6" fill="${stroke}"/>
        <circle cx="100" cy="130" r="2.5" fill="#000"/>
      `;
    case "vessel":
      return `
        <ellipse cx="100" cy="160" rx="55" ry="65" fill="${fill}"/>
        <ellipse cx="100" cy="160" rx="55" ry="65" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <ellipse cx="100" cy="160" rx="35" ry="40" fill="none" stroke="${stroke}" stroke-width="0.4" opacity="0.6"/>
        <circle cx="100" cy="160" r="6" fill="${accent}" opacity="0.8"/>
        <path d="M 100 80 C 95 80, 92 90, 100 95 C 108 90, 105 80, 100 80" fill="${fill}"/>
      `;
    case "fractured_heart":
      return `
        <path d="M 100 200 L 50 130 C 35 110, 50 80, 75 90 C 88 95, 100 110, 100 110 C 100 110, 112 95, 125 90 C 150 80, 165 110, 150 130 Z" fill="${fill}"/>
        <path d="M 100 110 L 95 140 L 105 160 L 95 180 L 100 200" fill="none" stroke="#000" stroke-width="2"/>
        <path d="M 100 110 L 95 140 L 105 160 L 95 180 L 100 200" fill="none" stroke="${accent}" stroke-width="0.6"/>
      `;
    case "mirror_split":
      return `
        <rect x="50" y="60" width="100" height="160" fill="${fill}" opacity="0.6"/>
        <rect x="50" y="60" width="100" height="160" fill="none" stroke="${stroke}" stroke-width="1"/>
        <line x1="100" y1="60" x2="100" y2="220" stroke="${stroke}" stroke-width="1.2"/>
        <circle cx="78" cy="120" r="10" fill="${accent}" opacity="0.7"/>
        <circle cx="122" cy="120" r="10" fill="${accent}" opacity="0.4"/>
        <path d="M 78 145 Q 78 155 78 165" stroke="${accent}" stroke-width="1" fill="none" opacity="0.7"/>
        <path d="M 122 145 Q 122 160 122 170" stroke="${accent}" stroke-width="1" fill="none" opacity="0.5"/>
      `;
    case "ghost_outline":
      return `
        <path d="M 100 80 C 70 80, 60 100, 60 130 L 60 230 L 70 220 L 80 230 L 90 220 L 100 230 L 110 220 L 120 230 L 130 220 L 140 230 L 140 130 C 140 100, 130 80, 100 80 Z" fill="none" stroke="${stroke}" stroke-width="1" opacity="0.6"/>
        <ellipse cx="90" cy="125" rx="3" ry="5" fill="${stroke}" opacity="0.5"/>
        <ellipse cx="110" cy="125" rx="3" ry="5" fill="${stroke}" opacity="0.5"/>
      `;
    case "smiling_mask":
      return `
        <ellipse cx="100" cy="140" rx="50" ry="65" fill="${fill}"/>
        <ellipse cx="100" cy="140" rx="50" ry="65" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <ellipse cx="85" cy="125" rx="4" ry="6" fill="${accent}"/>
        <ellipse cx="115" cy="125" rx="4" ry="6" fill="${accent}"/>
        <path d="M 80 165 Q 100 185 120 165" fill="none" stroke="${accent}" stroke-width="2"/>
      `;
    case "axe_doorway":
      return `
        <rect x="60" y="40" width="80" height="200" fill="#000"/>
        <rect x="60" y="40" width="80" height="200" fill="none" stroke="${stroke}" stroke-width="1"/>
        <path d="M 100 60 L 100 180" stroke="${fill}" stroke-width="3"/>
        <path d="M 90 60 L 110 60 L 115 75 L 85 75 Z" fill="${fill}"/>
        <line x1="100" y1="180" x2="100" y2="200" stroke="${fill}" stroke-width="3"/>
      `;
    case "doll_face":
      return `
        <ellipse cx="100" cy="135" rx="55" ry="65" fill="${fill}"/>
        <ellipse cx="100" cy="135" rx="55" ry="65" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <circle cx="80" cy="125" r="5" fill="#fff"/>
        <circle cx="80" cy="125" r="2" fill="#000"/>
        <circle cx="120" cy="125" r="5" fill="#fff"/>
        <circle cx="120" cy="125" r="2" fill="#000"/>
        <circle cx="100" cy="160" r="3" fill="${accent}" opacity="0.8"/>
        <ellipse cx="100" cy="180" rx="8" ry="3" fill="#a02020"/>
      `;
    case "two_masks":
      return `
        <ellipse cx="80" cy="130" rx="35" ry="50" fill="${fill}" opacity="0.85"/>
        <ellipse cx="125" cy="150" rx="35" ry="50" fill="${accent}" opacity="0.6"/>
        <ellipse cx="80" cy="130" rx="35" ry="50" fill="none" stroke="${stroke}" stroke-width="0.6"/>
        <circle cx="72" cy="120" r="2" fill="#000"/>
        <circle cx="88" cy="120" r="2" fill="#000"/>
        <circle cx="117" cy="142" r="2" fill="${fill}"/>
        <circle cx="133" cy="142" r="2" fill="${fill}"/>
      `;
    case "double_self":
      return `
        <path d="M 70 90 C 60 90, 56 105, 58 125 L 62 200 L 65 240 L 75 240 L 78 200 L 82 125 C 84 105, 80 90, 70 90 Z" fill="${fill}"/>
        <circle cx="70" cy="82" r="11" fill="${fill}"/>
        <path d="M 130 90 C 120 90, 116 105, 118 125 L 122 200 L 125 240 L 135 240 L 138 200 L 142 125 C 144 105, 140 90, 130 90 Z" fill="${fill}" opacity="0.5"/>
        <circle cx="130" cy="82" r="11" fill="${fill}" opacity="0.5"/>
      `;
    case "third_eye":
      return `
        <circle cx="100" cy="140" r="60" fill="${fill}"/>
        <circle cx="100" cy="140" r="60" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <ellipse cx="80" cy="130" rx="6" ry="4" fill="${accent}"/>
        <ellipse cx="120" cy="130" rx="6" ry="4" fill="${accent}"/>
        <ellipse cx="100" cy="155" rx="10" ry="6" fill="${accent}" opacity="0.85"/>
        <circle cx="100" cy="155" r="4" fill="${stroke}"/>
        <circle cx="100" cy="155" r="1.5" fill="#000"/>
      `;
    case "thread_unwound":
      return `
        <path d="M 30 140 Q 60 100 100 140 T 170 140 Q 140 180 100 140 T 30 140" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <path d="M 50 90 Q 100 60 150 90" fill="none" stroke="${accent}" stroke-width="0.6"/>
        <path d="M 50 200 Q 100 230 150 200" fill="none" stroke="${accent}" stroke-width="0.6"/>
        <circle cx="100" cy="140" r="20" fill="${fill}"/>
        ${[...Array(8)].map((_,i) => {
          const a = (i/8) * Math.PI * 2;
          const x = 100 + Math.cos(a)*40;
          const y = 140 + Math.sin(a)*40;
          return `<line x1="100" y1="140" x2="${x}" y2="${y}" stroke="${stroke}" stroke-width="0.4" opacity="0.5"/>`;
        }).join("")}
      `;
    case "underground":
      return `
        <rect x="0" y="0" width="200" height="180" fill="${fill}" opacity="0.3"/>
        <rect x="0" y="180" width="200" height="100" fill="${fill}"/>
        <line x1="0" y1="180" x2="200" y2="180" stroke="${stroke}" stroke-width="1"/>
        <ellipse cx="100" cy="220" rx="20" ry="3" fill="#000" opacity="0.5"/>
        <circle cx="100" cy="210" r="14" fill="${fill}" opacity="0.85"/>
        <ellipse cx="95" cy="208" rx="1.5" ry="2" fill="${accent}"/>
        <ellipse cx="105" cy="208" rx="1.5" ry="2" fill="${accent}"/>
      `;
    case "bottle_shadow":
      return `
        <ellipse cx="100" cy="240" rx="35" ry="6" fill="#000" opacity="0.6"/>
        <path d="M 90 80 L 90 120 L 80 140 L 80 230 Q 80 240, 90 240 L 110 240 Q 120 240, 120 230 L 120 140 L 110 120 L 110 80 Z" fill="${fill}"/>
        <path d="M 90 80 L 90 120 L 80 140 L 80 230 Q 80 240, 90 240 L 110 240 Q 120 240, 120 230 L 120 140 L 110 120 L 110 80 Z" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <ellipse cx="100" cy="200" rx="15" ry="20" fill="${accent}" opacity="0.4"/>
      `;
    case "running_figure":
      return `
        <path d="M 100 100 L 110 140 L 130 160 L 145 200" fill="none" stroke="${fill}" stroke-width="6" stroke-linecap="round"/>
        <path d="M 100 100 L 90 140 L 70 160 L 55 200" fill="none" stroke="${fill}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="100" cy="92" r="14" fill="${fill}"/>
        <line x1="100" y1="105" x2="100" y2="160" stroke="${fill}" stroke-width="6" stroke-linecap="round"/>
      `;
    case "scattered":
      return `
        <circle cx="60" cy="80" r="4" fill="${accent}" opacity="0.5"/>
        <circle cx="140" cy="100" r="3" fill="${accent}" opacity="0.4"/>
        <circle cx="50" cy="160" r="5" fill="${accent}" opacity="0.6"/>
        <circle cx="160" cy="180" r="4" fill="${accent}" opacity="0.5"/>
        <circle cx="100" cy="140" r="20" fill="${fill}"/>
        <circle cx="100" cy="140" r="20" fill="none" stroke="${stroke}" stroke-width="0.6"/>
        <line x1="100" y1="140" x2="60" y2="80" stroke="${stroke}" stroke-width="0.4" opacity="0.4"/>
        <line x1="100" y1="140" x2="140" y2="100" stroke="${stroke}" stroke-width="0.4" opacity="0.4"/>
        <line x1="100" y1="140" x2="50" y2="160" stroke="${stroke}" stroke-width="0.4" opacity="0.4"/>
        <line x1="100" y1="140" x2="160" y2="180" stroke="${stroke}" stroke-width="0.4" opacity="0.4"/>
      `;
    case "different_shape":
      // Hexagonal cluster surrounding an unsettled square
      return `
        ${[...Array(6)].map((_,i) => {
          const a = (i/6) * Math.PI * 2 - Math.PI/2;
          const x = 100 + Math.cos(a)*55;
          const y = 140 + Math.sin(a)*55;
          return `<polygon points="${x-12},${y-10} ${x+12},${y-10} ${x+18},${y} ${x+12},${y+10} ${x-12},${y+10} ${x-18},${y}" fill="${fill}" opacity="0.5" stroke="${stroke}" stroke-width="0.4"/>`;
        }).join("")}
        <rect x="84" y="124" width="32" height="32" fill="${accent}" transform="rotate(15 100 140)"/>
      `;
    case "ballerina_crack":
      return `
        <path d="M 100 80 C 92 80, 87 90, 89 105 L 91 130 L 88 160 L 80 200 L 90 240 L 110 240 L 120 200 L 112 160 L 109 130 L 111 105 C 113 90, 108 80, 100 80 Z" fill="${fill}"/>
        <circle cx="100" cy="72" r="11" fill="${fill}"/>
        <line x1="100" y1="80" x2="100" y2="200" stroke="${accent}" stroke-width="1.2"/>
        <line x1="100" y1="120" x2="92" y2="160" stroke="${accent}" stroke-width="0.6"/>
        <line x1="100" y1="120" x2="108" y2="170" stroke="${accent}" stroke-width="0.6"/>
      `;
    case "rising_burst":
      // Bipolar/manic — rays
      return `
        ${[...Array(16)].map((_,i) => {
          const a = (i/16) * Math.PI * 2;
          const x1 = 100 + Math.cos(a)*30;
          const y1 = 140 + Math.sin(a)*30;
          const x2 = 100 + Math.cos(a)*90;
          const y2 = 140 + Math.sin(a)*90;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="${0.8 + (i%2)*0.4}" opacity="${0.5 + (i%3)*0.15}"/>`;
        }).join("")}
        <circle cx="100" cy="140" r="22" fill="${fill}"/>
        <circle cx="100" cy="140" r="22" fill="none" stroke="${stroke}" stroke-width="0.8"/>
      `;
    case "abyss":
      return `
        <circle cx="100" cy="140" r="80" fill="#000"/>
        <circle cx="100" cy="140" r="60" fill="${fill}"/>
        <circle cx="100" cy="140" r="40" fill="${darken(primary, 0.4)}"/>
        <circle cx="100" cy="140" r="20" fill="#000"/>
        <circle cx="100" cy="140" r="80" fill="none" stroke="${stroke}" stroke-width="0.4" opacity="0.5"/>
      `;
    case "ouroboros":
      return `
        <circle cx="100" cy="140" r="60" fill="none" stroke="${stroke}" stroke-width="3" opacity="0.7"/>
        <circle cx="100" cy="140" r="60" fill="none" stroke="${fill}" stroke-width="2" stroke-dasharray="100 280" stroke-dashoffset="0" opacity="0.85"/>
        <circle cx="160" cy="140" r="6" fill="${accent}"/>
        <path d="M 154 134 L 160 128 L 166 134" fill="none" stroke="${accent}" stroke-width="1"/>
      `;
    case "boat":
      return `
        <rect x="0" y="200" width="200" height="80" fill="${fill}" opacity="0.4"/>
        <path d="M 50 195 L 150 195 L 130 220 L 70 220 Z" fill="${fill}"/>
        <line x1="100" y1="195" x2="100" y2="120" stroke="${fill}" stroke-width="2"/>
        <path d="M 100 120 L 100 180 L 130 195" fill="${accent}" opacity="0.7"/>
        <circle cx="100" cy="170" r="8" fill="${fill}"/>
      `;
    case "fading_figure":
      return `
        <path d="M 100 80 C 90 80, 86 95, 88 115 L 92 200 L 95 240 L 105 240 L 108 200 L 112 115 C 114 95, 110 80, 100 80 Z" fill="${fill}" opacity="0.3"/>
        <circle cx="100" cy="72" r="13" fill="${fill}" opacity="0.3"/>
        <line x1="60" y1="240" x2="140" y2="240" stroke="${stroke}" stroke-width="0.4" opacity="0.3"/>
      `;
    case "blade_silhouette":
      return `
        <path d="M 100 80 C 90 80, 85 95, 88 115 L 92 200 L 95 240 L 105 240 L 108 200 L 112 115 C 115 95, 110 80, 100 80 Z" fill="${fill}"/>
        <circle cx="100" cy="72" r="13" fill="${fill}"/>
        <line x1="135" y1="120" x2="180" y2="80" stroke="${accent}" stroke-width="3" opacity="0.85"/>
        <line x1="135" y1="120" x2="180" y2="80" stroke="#fff" stroke-width="0.5" opacity="0.5"/>
      `;
    case "split_figure":
      return `
        <path d="M 100 80 L 70 200 L 90 240 L 100 200 Z" fill="${fill}"/>
        <path d="M 100 80 L 130 200 L 110 240 L 100 200 Z" fill="${darken(primary, 0.2)}"/>
        <circle cx="100" cy="72" r="13" fill="${fill}"/>
        <line x1="100" y1="80" x2="100" y2="240" stroke="${accent}" stroke-width="0.8" opacity="0.6"/>
      `;
    case "caged":
      return `
        <rect x="55" y="50" width="90" height="200" fill="none" stroke="${stroke}" stroke-width="1.2"/>
        ${[70,85,100,115,130].map(x => `<line x1="${x}" y1="50" x2="${x}" y2="250" stroke="${stroke}" stroke-width="1.2"/>`).join("")}
        <path d="M 100 100 C 92 100, 88 115, 90 135 L 93 200 L 96 240 L 104 240 L 107 200 L 110 135 C 112 115, 108 100, 100 100 Z" fill="${fill}"/>
        <circle cx="100" cy="92" r="11" fill="${fill}"/>
      `;
    case "lantern":
      return `
        <rect x="80" y="100" width="40" height="60" fill="${fill}" opacity="0.7"/>
        <rect x="80" y="100" width="40" height="60" fill="none" stroke="${stroke}" stroke-width="0.8"/>
        <line x1="100" y1="100" x2="100" y2="80" stroke="${stroke}" stroke-width="0.6"/>
        <circle cx="100" cy="78" r="3" fill="${stroke}"/>
        <circle cx="100" cy="130" r="10" fill="${accent}" opacity="0.85"/>
        <circle cx="100" cy="130" r="6" fill="#fff" opacity="0.7"/>
        ${[...Array(8)].map((_,i) => {
          const a = (i/8) * Math.PI * 2;
          const x1 = 100 + Math.cos(a)*15;
          const y1 = 130 + Math.sin(a)*15;
          const x2 = 100 + Math.cos(a)*40;
          const y2 = 130 + Math.sin(a)*40;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="0.5" opacity="0.4"/>`;
        }).join("")}
        <path d="M 30 200 L 170 200" stroke="${stroke}" stroke-width="0.4" opacity="0.4"/>
      `;
    default:
      return `<circle cx="100" cy="140" r="40" fill="${fill}"/>`;
  }
}

// Character-specific iconographic accents layered on top of the base motif.
// These small symbolic overlays make characters more recognizable at a glance —
// a knife for Laurie, a typewriter for Jack, a doll for May. Subtle: low
// opacity, accent-colored, positioned around the figure. Hand-built SVG paths.
function renderCharacterAccent(id, primary, accent) {
  // All accents render at low opacity in accent color, positioned around the figure
  const ACCENTS = {
    // Laurie Strode — kitchen knife in lower-right
    the_final_girl: `
      <g opacity="0.32">
        <path d="M 168 178 L 174 184 L 174 220 L 170 224 L 168 222 L 168 184 Z" fill="${accent}" stroke="${accent}" stroke-width="0.4"/>
        <rect x="167" y="222" width="6" height="14" rx="0.6" fill="#1a1a1a" stroke="${accent}" stroke-width="0.4"/>
      </g>`,
    // Cole Sear — small ghostly figure faintly visible
    the_haunted_witness: `
      <g opacity="0.22">
        <ellipse cx="34" cy="220" rx="10" ry="14" fill="${accent}"/>
        <ellipse cx="30" cy="216" rx="1" ry="1.5" fill="#0a0a0a"/>
        <ellipse cx="38" cy="216" rx="1" ry="1.5" fill="#0a0a0a"/>
      </g>`,
    // Adelaide Wilson — scissors crossed
    the_returning_daughter: `
      <g opacity="0.30" stroke="${accent}" stroke-width="1" fill="none">
        <path d="M 28 200 L 50 222"/>
        <path d="M 28 222 L 50 200"/>
        <circle cx="26" cy="200" r="3"/>
        <circle cx="26" cy="222" r="3"/>
      </g>`,
    // Amelia Vanek — top hat for the Babadook
    the_grief_keeper: `
      <g opacity="0.30">
        <rect x="160" y="38" width="22" height="22" fill="#0a0a0a" stroke="${accent}" stroke-width="0.5"/>
        <rect x="156" y="58" width="30" height="3" fill="#0a0a0a" stroke="${accent}" stroke-width="0.5"/>
      </g>`,
    // Justine — black sun for Melancholia
    the_drowned_self: `
      <g opacity="0.28">
        <circle cx="170" cy="50" r="14" fill="#0a0a0a"/>
        <circle cx="170" cy="50" r="14" stroke="${accent}" stroke-width="0.6" fill="none"/>
      </g>`,
    // Carrie White — small handprint of blood
    the_invisible_girl: `
      <g opacity="0.32" fill="${accent}">
        <ellipse cx="30" cy="50" rx="3" ry="5"/>
        <ellipse cx="26" cy="46" rx="1" ry="3"/>
        <ellipse cx="29" cy="44" rx="1" ry="3.5"/>
        <ellipse cx="33" cy="44" rx="1" ry="3.5"/>
        <ellipse cx="36" cy="46" rx="1" ry="3"/>
      </g>`,
    // Evelyn Abbott — listening ear with radiating sound waves
    the_listener: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.6" fill="none">
        <path d="M 165 70 Q 175 70 175 80 Q 175 90 165 90"/>
        <path d="M 178 75 Q 184 80 184 85"/>
        <path d="M 182 70 Q 190 78 190 86"/>
      </g>`,
    // William (The Witch) — a goat skull horn
    the_ritualist: `
      <g opacity="0.28" stroke="${accent}" stroke-width="0.7" fill="none">
        <path d="M 30 60 Q 24 56 22 60 Q 22 66 30 64"/>
        <path d="M 38 60 Q 44 56 46 60 Q 46 66 38 64"/>
      </g>`,
    // Eleanor Vance — a Victorian curtain edge
    the_quiet_neighbor: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.5" fill="none">
        <path d="M 178 30 L 178 90 L 172 92 L 178 100 L 172 110 L 178 120"/>
        <path d="M 22 30 L 22 90 L 28 92 L 22 100 L 28 110 L 22 120"/>
      </g>`,
    // Rosemary — wedding ring
    the_pregnant_oracle: `
      <g opacity="0.32">
        <circle cx="34" cy="220" r="6" fill="none" stroke="${accent}" stroke-width="1.2"/>
        <circle cx="34" cy="216" r="1.2" fill="${accent}"/>
      </g>`,
    // Annie Wilkes — sledgehammer (just the head)
    the_devoted_fan: `
      <g opacity="0.28">
        <rect x="160" y="208" width="22" height="10" fill="#1a1a1a" stroke="${accent}" stroke-width="0.5"/>
        <line x1="171" y1="218" x2="171" y2="240" stroke="${accent}" stroke-width="1"/>
      </g>`,
    // Jack Torrance — typewriter outline
    the_cabin_husband: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.5" fill="none">
        <rect x="20" y="216" width="32" height="20" rx="1"/>
        <line x1="22" y1="222" x2="50" y2="222"/>
        <line x1="22" y1="226" x2="50" y2="226"/>
        <line x1="22" y1="230" x2="50" y2="230"/>
      </g>`,
    // Hannibal — a single chianti glass
    the_charming_predator: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.6" fill="none">
        <path d="M 30 200 Q 30 215 38 215 Q 46 215 46 200"/>
        <line x1="38" y1="215" x2="38" y2="232"/>
        <line x1="32" y1="232" x2="44" y2="232"/>
      </g>`,
    // Esther — orphanage ribbon
    the_perfect_child: `
      <g opacity="0.32" fill="${accent}">
        <path d="M 100 60 L 88 70 L 92 78 L 100 72 L 108 78 L 112 70 Z"/>
      </g>`,
    // Norman Bates — knife in shadow
    the_dissociated_son: `
      <g opacity="0.30">
        <path d="M 168 38 L 170 42 L 170 80 L 166 84 L 164 82 L 164 42 Z" fill="${accent}"/>
        <rect x="163" y="82" width="8" height="14" fill="#0a0a0a"/>
      </g>`,
    // Thomas Wake — lighthouse
    the_unraveling_caretaker: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="none">
        <rect x="166" y="40" width="14" height="36"/>
        <rect x="164" y="36" width="18" height="6"/>
        <circle cx="173" cy="50" r="3" fill="${accent}" opacity="0.4"/>
      </g>`,
    // Samara — well opening at top
    the_visiting_girl: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="none">
        <ellipse cx="100" cy="34" rx="22" ry="6"/>
        <line x1="78" y1="34" x2="78" y2="44"/>
        <line x1="122" y1="34" x2="122" y2="44"/>
        <ellipse cx="100" cy="44" rx="22" ry="4" stroke-dasharray="2 2"/>
      </g>`,
    // Danny Torrance — tricycle wheel
    the_psychic_child: `
      <g opacity="0.28" stroke="${accent}" stroke-width="0.6" fill="none">
        <circle cx="34" cy="232" r="10"/>
        <line x1="24" y1="232" x2="44" y2="232"/>
        <line x1="34" y1="222" x2="34" y2="242"/>
      </g>`,
    // Don Birnam — bottle silhouette
    the_cellar_drinker: `
      <g opacity="0.30">
        <path d="M 168 200 L 168 210 L 165 214 L 165 232 L 175 232 L 175 214 L 172 210 L 172 200 Z"
              fill="#1a1a1a" stroke="${accent}" stroke-width="0.5"/>
      </g>`,
    // Pennywise — red balloon
    the_chasing_thing: `
      <g opacity="0.34">
        <ellipse cx="172" cy="38" rx="9" ry="11" fill="#a02020"/>
        <line x1="172" y1="49" x2="170" y2="78" stroke="${accent}" stroke-width="0.4"/>
      </g>`,
    // Casey Becker — landline phone
    the_distracted_protagonist: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="none">
        <path d="M 22 222 Q 22 218 26 218 L 36 218 Q 40 218 40 222 L 40 230 Q 40 234 36 234 L 26 234 Q 22 234 22 230 Z"/>
        <line x1="40" y1="222" x2="46" y2="216"/>
      </g>`,
    // Eli — single bare tree
    the_uncanny_outsider: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.5" fill="none">
        <line x1="34" y1="234" x2="34" y2="200"/>
        <line x1="34" y1="210" x2="28" y2="200"/>
        <line x1="34" y1="210" x2="40" y2="200"/>
        <line x1="34" y1="206" x2="30" y2="198"/>
        <line x1="34" y1="206" x2="38" y2="198"/>
      </g>`,
    // Nina Sayers — single ballet shoe ribbon
    the_perfectionist_dancer: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="none">
        <path d="M 168 50 L 178 65 L 174 80 L 178 95 L 174 110"/>
      </g>`,
    // Pearl — pitchfork
    the_unbound_artist: `
      <g opacity="0.28" stroke="${accent}" stroke-width="0.7" fill="none">
        <line x1="172" y1="40" x2="172" y2="100"/>
        <line x1="166" y1="44" x2="166" y2="56"/>
        <line x1="178" y1="44" x2="178" y2="56"/>
      </g>`,
    // Pinhead — pin grid
    the_void_speaker: `
      <g opacity="0.32" fill="${accent}">
        ${[0,1,2,3].map(r => [0,1,2,3].map(c =>
          `<circle cx="${24 + c*4}" cy="${36 + r*4}" r="0.6"/>`
        ).join("")).join("")}
      </g>`,
    // Patrick Bateman — business card
    the_mask_wearer: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.4" fill="none">
        <rect x="20" y="220" width="34" height="20"/>
        <line x1="24" y1="226" x2="40" y2="226"/>
        <line x1="24" y1="230" x2="48" y2="230"/>
        <line x1="24" y1="234" x2="36" y2="234"/>
      </g>`,
    // Suzy Bannion — tutu
    the_perfectionist_swan: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.5" fill="none">
        <path d="M 80 232 L 100 218 L 120 232 L 120 244 L 80 244 Z"/>
        <line x1="90" y1="232" x2="92" y2="244"/>
        <line x1="100" y1="232" x2="100" y2="244"/>
        <line x1="110" y1="232" x2="108" y2="244"/>
      </g>`,
    // Sara Goldfarb — pill bottles
    the_starving_addict: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.5" fill="none">
        <rect x="22" y="40" width="10" height="16"/>
        <rect x="34" y="44" width="10" height="12"/>
      </g>`,
    // Harry Goldfarb — syringe
    the_chasing_addict: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.6" fill="none">
        <line x1="20" y1="220" x2="46" y2="220"/>
        <rect x="40" y="217" width="10" height="6"/>
        <line x1="50" y1="220" x2="56" y2="220"/>
      </g>`,
    // Mike Enslin — clock at 1408
    the_sleepless_writer: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="none">
        <circle cx="172" cy="50" r="10"/>
        <line x1="172" y1="50" x2="172" y2="42"/>
        <line x1="172" y1="50" x2="178" y2="50"/>
      </g>`,
    // Annie Graham — dollhouse window
    the_unusual_seer: `
      <g opacity="0.32" stroke="${accent}" stroke-width="0.5" fill="none">
        <rect x="20" y="40" width="28" height="22"/>
        <line x1="34" y1="40" x2="34" y2="62"/>
        <line x1="20" y1="51" x2="48" y2="51"/>
      </g>`,
    // William (Witch father) — pitchfork already used; Curtis (Take Shelter) — storm cloud
    the_paranoid_patriarch: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.6" fill="${accent}" fill-opacity="0.2">
        <path d="M 156 52 Q 152 48 156 44 Q 162 38 170 42 Q 178 38 184 46 Q 188 50 184 56 L 156 56 Z"/>
        <line x1="160" y1="60" x2="158" y2="68" stroke-dasharray="1 1"/>
        <line x1="170" y1="62" x2="168" y2="72" stroke-dasharray="1 1"/>
      </g>`,
    // The Babadook book + others — top hat already used; Marion Crane — shower curtain
    the_panicker: `
      <g opacity="0.30" stroke="${accent}" stroke-width="0.5" fill="none">
        <line x1="178" y1="30" x2="178" y2="120"/>
        <path d="M 174 32 Q 178 28 182 32 Q 178 36 178 40 Q 178 44 182 48 Q 178 52 174 56 Q 178 60 178 64"/>
      </g>`
  };

  return ACCENTS[id] || "";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { generatePortrait, generateSVGPortrait };
}
