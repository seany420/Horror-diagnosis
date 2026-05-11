# SCREAM PROFILE

**A horror-archetypal psychological screening.** Find your horror archetype — a personality &amp; clinical profile through the lens of horror cinema.

A personality screener with real psychometric validity. Answer questions drawn from validated clinical instruments. Get matched with the horror character whose psychology most resembles your current presentation — Laurie Strode, Annie Wilkes, Hannibal Lecter, Cole Sear, Jack Torrance, Carrie White, Suzy Bannion, Sara Goldfarb, and **fifty-three others**. Receive a Big Five personality readout, confidence-rated character matches, and a clinical-grade DSM-5-TR report alongside your match.

Built as a single-page application — no server, no tracking, no transmission. Your responses never leave your device.

> "Every horror character encodes a recognizable psychological pattern. Laurie Strode is post-traumatic vigilance. Justine in *Melancholia* is anhedonic depression. Evelyn Abbott is generalized anxiety in a body that cannot stop scanning."

---

## What this is

A clinical-education and self-reflection instrument that combines:

- **Adaptive battery** (~200 items, ~25–35 minutes with full coverage; ~140 items / ~18 minutes when distress is low) with gated branching, dynamic safety follow-up, and **pause/resume** anytime. PHQ-2 unlocks PHQ-9; GAD-2 unlocks GAD-7; PC-PTSD-5 unlocks PCL-5 + DES-B; suicidal ideation triggers C-SSRS; duplicate items are automatically deduped (PHQ-9 doesn't re-ask the PHQ-2 gate items).
- **Nineteen DSM-5-TR conditions** screened: MDD, GAD, PTSD, OCD, Social Anxiety Disorder, BPD, Bipolar Spectrum, AUD, **Drug Use Disorder**, ADHD, ASD, Dissociative Spectrum, Antagonism/Antisocial, **Eating Disorder**, **Insomnia Disorder**, **Schizotypal PD**, **Somatic Symptom Disorder**, plus structured suicide-risk stratification (C-SSRS) and biopsychosocial context.
- **Full-length validated forms**: PCL-5 (20), Y-BOCS-SR (10), LSAS (24), PID-5-BF (25), TIPI (10), **EAT-26 (26)**, **DAST-10 (10)**, **ISI (7)**, **SPQ-Brief (22)**, **PHQ-15 (15)**, MSI-BPD (10), AUDIT-C, ASRS-5, AQ-10, MDQ, ACE-10, DES-B (8), **C-SSRS Screener (6)**, **Biopsychosocial Intake (12)**.
- **Sixty-one horror characters** across the genre canon, each paired with a clinical pattern. From iconic figures (Laurie Strode, Hannibal Lecter, Annie Wilkes, Jack Torrance) to rich coverage of every DSM domain (Suzy Bannion for restrictive eating, Mike Enslin for trauma-driven insomnia, Annie Graham for schizotypal features, Maud for somatic symptom disorder, Carol Ledoux for psychotic decompensation).
- **Browse the Roster** — explore all 61 characters and their clinical patterns before you screen. DSM-5-TR associations stay locked until you complete the assessment, so browsing doesn't bias responses.
- **Top-3 character matches with confidence intervals** — character name leads ("Laurie Strode"), archetype framing as subtitle ("The Final Girl — Survivor / Vigilant Protector"). 95% CIs widen when evidence is weak or matches are bunched.
- **Big Five personality profile** — extraversion, agreeableness, conscientiousness, neuroticism, openness with horror-flavored interpretive copy, alongside the PID-5-BF maladaptive trait domains.
- **The Trait Assessment (v3.1)** — a separate, fun-only second assessment using thirty-five horror-cinema scenarios (Babadook, Shining, Hereditary, Get Out, Carrie, Hannibal, Saint Maud, Black Swan, Annihilation, Melancholia and more) to score you on fifteen bipolar trait axes across three families: behavioral disposition (vigilance, solitary, restraint, order, curiosity), relational style (compassion, loyalty, trusting, caregiving, forthright), and inner architecture (stability, uncanny attunement, self-blame, hope, embodiment). Match by Euclidean distance in fifteen-dimensional trait space — same character roster, completely different math. The trait assessment screens *who you are*; the clinical assessment screens *what you're going through*.
- **Clinical-vs-Trait comparison view** — once you've completed both assessments, a comparison screen overlays your clinical and trait results: side-by-side top three with portraits, convergent characters highlighted (when the same character appears in both top-3, that's a strong signal), an SVG radar chart overlaying your fifteen-axis trait profile against your Big Five from the clinical TIPI, and an auto-generated divergence narrative that interprets the gap (or convergence) between the two — distinguishing trait-level patterns from current-state distress, "weather vs climate" framing, and other clinically meaningful interpretations.
- **Clinical-grade DSM-5-TR report with criteria highlighting** — for each flagged condition, the specific criteria your responses suggest you meet are visually highlighted (✓ Endorsed badges with gold accent), with the precise instrument items each criterion draws from. Differentials, rule-outs, and treatment algorithms (CBT/DBT/ACT/EMDR/IPT/medication classes/MBC follow-up cadence) expand below.
- **Save, share, compare**: auto-save to local storage on completion, JSON export/import, **shareable PNG match cards** (800×1200, social-media-ready, generated client-side), and a **comparisons feature** that stores up to 12 past results so you can track how your profile shifts over time. Real measurement-based care.
- **Horror-themed interstitials** between sections — brief, character-grounded encouragements between major instruments that make the screening feel less like a clinical task and more like a deliberate journey. Pause anytime; the screening auto-saves your progress.
- **Safety screening with structured risk stratification**: PHQ-9 item 9 endorsed → C-SSRS auto-administered → Columbia algorithm risk stratification (Low / Some elevation / Moderate / High). Crisis resources (988/741741/911) surface at the top of the report when any safety item is endorsed.

## What this is *not*

This is **not a diagnostic instrument**. Computer-generated screening cannot replace clinical interview, longitudinal observation, collateral information, medical rule-out, or formal assessment by a licensed clinician. Treat the output as an *educational artifact* and a *self-reflection scaffold*, not a diagnosis.

The horror archetypes are **creative-clinical metaphors**, used here for educational and psychoeducational purposes under fair use. They are not personality types and they do not constitute personality assessment. Each archetype pairs an iconic horror character with a clinical pattern they exemplify — the same way clinicians have long used metaphor in psychoeducation when a depressive episode "feels like drowning" or hypervigilance "feels like always being the last one alive."

---

## Instruments administered

| Instrument | Construct | Items | Notes |
|---|---|---|---|
| **Biopsychosocial Intake** | Demographics, family hx, support, stressors, treatment hx, medical | 12 | Standalone — opens the screening; provides clinical context |
| PHQ-2 → PHQ-9 | Depression | 2 → 7 (PHQ-9 deduped) | Gated; PHQ-2 items reused, only the 7 unique PHQ-9 items asked |
| GAD-2 → GAD-7 | Anxiety | 2 → 5 (GAD-7 deduped) | Gated; GAD-2 items reused |
| PC-PTSD-5 → PCL-5 (full) + DES-B | Trauma & dissociation | 5 → 28 | Gated on positive PC-PTSD-5; full 20-item PCL-5 with DSM-5 cluster scoring |
| MSI-BPD | Borderline traits | 10 | Standalone |
| PID-5-BF (full) | Maladaptive personality domains | 25 | Standalone — Negative Affect, Detachment, Antagonism, Disinhibition, Psychoticism |
| TIPI | Big Five | 10 | Standalone |
| Y-BOCS-SR (full) | OCD severity | 10 | Standalone — 5 obsessions + 5 compulsions |
| AUDIT-C | Hazardous drinking | 3 | Standalone |
| **DAST-10** | Drug use disorder | 10 | Standalone — non-alcohol substance use |
| ASRS-5 | Adult ADHD | 6 | Standalone |
| LSAS (full) | Social anxiety | 24 | Standalone — 24 social situations, fear ratings |
| **ISI** | Insomnia severity | 7 | Standalone |
| **PHQ-15** | Somatic symptom burden | 15 | Standalone |
| **EAT-26** | Eating attitudes & behaviors | 26 | Standalone with behavioral safety flags |
| **SPQ-Brief** | Schizotypal traits | 22 | Standalone — 3 factors: Cognitive-Perceptual, Interpersonal, Disorganized |
| ACE-10 | Childhood adversity | 10 | Standalone, contextual |
| AQ-10 | Autism spectrum | 10 | Standalone |
| MDQ | Bipolar spectrum | 13 | Standalone |
| **C-SSRS Screener** | Suicide risk stratification | 6 | Conditional — auto-administered when SI endorsed (PHQ-9 #9 or MSI #2) |
| Functional Impact | Work / relationships / social / self-care / identity | 5 | Custom Likert |

All items are short-form, validated, and used clinically as part of measurement-based care workflows. New v3 instruments shown in **bold**.

## Archetype roster

Sixty-one horror-cinema characters paired with the clinical patterns they embody:

**Trauma / survivor**: Laurie Strode (*Halloween*) · Cole Sear (*The Sixth Sense*) · Adelaide Wilson (*Us*) · Samara Morgan (*The Ring*) · Carol Anne Freeling (*Poltergeist*) · Cecilia Kass (*The Invisible Man*) · Rosemary Woodhouse post-trauma (*Rosemary's Baby*)
**Mood / grief**: Amelia Vanek (*The Babadook*) · Justine (*Melancholia*) · Sadie Harper (*The Boogeyman*) · Jennifer Hills (*I Spit on Your Grave*) · Eleanor depression-variant (*The Haunting of Hill House*) · Father Karras concealed-depression (*The Exorcist*)
**Anxiety / OCD / panic**: Evelyn Abbott (*A Quiet Place*) · William (*The Witch*) · Eleanor Vance (*The Haunting*) · Rosemary Woodhouse (*Rosemary's Baby*) · Marion Crane panic (*Psycho*) · the Clean-Haunted contamination archetype
**Personality / cluster B**: Annie Wilkes (*Misery*) · Jack Torrance (*The Shining*) · Hannibal Lecter (*The Silence of the Lambs*) · Esther (*Orphan*) · Patrick Bateman (*American Psycho*) · May Canady quiet-BPD (*May*) · the Dependent Clinger (*Single White Female*)
**Dissociation / psychotic spectrum**: Norman Bates (*Psycho*) · Thomas Wake (*The Lighthouse*) · Danny Torrance (*The Shining* / *Doctor Sleep*) · Red the Tethered (*Us*) · Carol Ledoux decompensating (*Repulsion*) · Curtis paranoid patriarch (*Take Shelter*)
**Schizotypal / unusual experiences**: Annie Graham (*Hereditary*) · Renfield (*Dracula*) · Trelkovsky (*The Tenant*)
**Substance / impulsivity**: Don Birnam (*The Lost Weekend*) · "It" the entity (*It Follows*) · Harry Goldfarb opioid use (*Requiem for a Dream*) · the High-Functioner concealed-use archetype
**Eating disorders**: Suzy Bannion perfectionist (*Suspiria*) · Sara Goldfarb restrictive + stimulants (*Requiem for a Dream*) · the Binge-Keeper shame archetype
**Insomnia**: Mike Enslin (*1408*) · Nancy Thompson (*A Nightmare on Elm Street*)
**Somatic**: Maud (*Saint Maud*) · the Unwell Caretaker health-anxiety archetype
**Bipolar / energy**: Pearl (*Pearl* / *X*) · Jack Torrance manic-variant (*The Shining*)
**Acute stress / adjustment**: Wendy Torrance (*The Shining*)
**Neurodevelopmental**: Casey Becker (*Scream*) · Eli (*Let the Right One In*)
**Body / identity**: Seth Brundle (*The Fly*)
**Existential**: Pinhead (*Hellraiser*) · Jess Carter (*Triangle*) · Dr. Henry Jekyll (*Dr. Jekyll and Mr. Hyde*)
**Withdrawal / attachment**: The Mother (*Barbarian*)
**Childhood trauma**: Carrie White (*Carrie*) · the Visiting Girl (*The Ring* / *Ju-On*)
**Adaptive / regulating**: Clarice Starling (*The Silence of the Lambs*) — the only securely-attached archetype, used as a strengths-based formulation when distress is contextual rather than chronic

Each archetype contains a clinical profile, a metaphorical reading, suggested therapeutic uses, weighted bindings to the disorder dimensions, and a generated SVG portrait with character-specific iconographic accents (Laurie's knife, Jack's typewriter, Hannibal's wine glass, Annie Graham's dollhouse, etc.). Character names are used here under fair use for educational and psychoeducational purposes.

---

## Running locally

The app is a static single-page application. No build step, no dependencies, no install.

```bash
git clone https://github.com/YOUR-USERNAME/scream-profile.git
cd scream-profile
# Option A: Python's built-in server
python3 -m http.server 8000
# Option B: Node http-server
npx http-server -p 8000
# Then open http://localhost:8000
```

Or just **open `index.html` directly in a browser** — most modern browsers (Chrome, Firefox, Safari) will run it without a server, since there are no module imports or fetch calls.

## Deploying to GitHub Pages

See [`DEPLOY.md`](./DEPLOY.md) for step-by-step instructions. Short version:

1. Push to a public GitHub repo
2. Settings → Pages → Source: `main` branch, `/` (root)
3. Wait ~1 minute, visit `https://YOUR-USERNAME.github.io/scream-profile/`

The repo includes a `.nojekyll` file so GitHub Pages serves the asset directories untouched.

## Project structure

```
scream-profile/
├── index.html                  Entry point. Loads scripts in order.
├── css/
│   └── style.css               Typewriter-horror aesthetic; ink/blood/rust palette
├── js/
│   ├── battery.js              Instrument bank, response scales, adaptive gate logic
│   ├── characters.js           Thirty-eight archetypes with clinical bindings
│   ├── portraits.js            SVG portrait generator (palette-driven, motif-keyed)
│   ├── engine.js               Scoring functions, DSM-5-TR disorder content,
│   │                           character-matching algorithm, report compiler
│   └── app.js                  UI state machine, rendering, event handling
├── assets/
│   ├── characters/             Drop AI-generated PNGs here to override SVG defaults
│   │                           (filename: {character_id}.png — e.g. the_final_girl.png)
│   └── icons/
├── docs/
│   └── CHARACTER_PROMPTS.md    Midjourney/DALL-E/SDXL prompts per archetype
├── test-engine.js              Node smoke test runner (5 clinical profiles)
├── README.md
├── LICENSE                     MIT
├── DEPLOY.md                   GitHub Pages deployment walkthrough
└── .nojekyll                   Disables Jekyll on GitHub Pages
```

## Customization

- **Replace SVG portraits with AI art**: Generate a PNG using any prompt from [`docs/CHARACTER_PROMPTS.md`](./docs/CHARACTER_PROMPTS.md), name it `{character_id}.png` (e.g. `the_final_girl.png`), and drop it into `assets/characters/`. The portrait generator detects the file automatically and uses it; if the file is missing, the SVG portrait renders as a fallback. No code changes required.
- **Add an archetype**: Append a new object to the `CHARACTERS` array in `js/characters.js` with a unique `id`, `name`, `archetype`, weighted disorder bindings, palette, and motif. Add a corresponding entry to the `MOTIFS` map in `js/portraits.js` if you want a custom symbolic form.
- **Adjust the matching algorithm**: The peak-pairing + softmax math lives at the top of `matchCharacters` in `js/engine.js`. The `TEMP` constant controls confidence sharpness (lower = more confident top match, higher = flatter distribution).
- **Add an instrument**: Add an entry to `BATTERY.instruments` in `js/battery.js`, write a `score_*` function in `js/engine.js`, and bind it into `compileDisorderEvidence` for whichever DSM-5-TR condition it screens.

## Smoke testing the engine

```bash
node test-engine.js
```

The script runs five canonical clinical profiles (trauma+ACE+depression, BPD+affective instability, antagonism/antisocial, OCD+anxiety, healthy/low-distress) and reports the top-5 archetype matches plus probable diagnoses for each. Use this as a regression check whenever you tune algorithm parameters or add archetypes.

## Disclaimer

This tool is intended for **clinical education and self-reflection only**. The DSM-5-TR criteria, treatment algorithms, and ICD-10 codes referenced in the report are summarized from public clinical sources and are subject to revision. They are not a substitute for the actual DSM-5-TR or for clinical judgment. The character archetypes are creative-clinical metaphors and do not constitute personality assessment.

If you are in psychological crisis, contact:
- **988** — Suicide & Crisis Lifeline (call or text, US)
- **741741** — Crisis Text Line (text HOME)
- **911** — Emergency
- Your local emergency services

## License

MIT — see [`LICENSE`](./LICENSE).

## Author

Built by Sean — LCSW, doctorate in behavioral health — as part of an ongoing project translating horror cinema into clinically defensible psychoeducation. Companion to the clinical manual *When Monsters Become Metaphors*.

---

*Survival as identity. Trauma not as wound but as competence forged in fire.*
