# CHARACTER_PROMPTS.md — AI Art Prompt Manifest

This document contains sixty-one detailed image-generation prompts — one per archetype — for users who want to replace the default SVG portraits with custom AI-generated art. The prompts are written to be **IP-safe**: they describe the archetypal pattern in the abstract (no character names, no copyrighted franchises, no actor likenesses), so the resulting images can be redistributed with the app under MIT.

## How to use

1. Pick an archetype below.
2. Paste the **base prompt** into your image generator of choice — Midjourney, DALL-E 3, Stable Diffusion XL, Flux, Imagen, etc.
3. Append the **style modifier** appropriate to your generator (Midjourney/SDXL accept `--ar 3:4 --style raw`; DALL-E does best with descriptive style sentences inline).
4. Save the output as `{character_id}.png` (file name shown under each entry — for example, `the_final_girl.png`).
5. Drop it into `assets/characters/`.
6. The portrait generator detects the file automatically and uses it; if missing, the SVG fallback renders. No code change required.

## Aesthetic guidance — global

For visual cohesion across the gallery, prepend or append these qualifiers to every prompt:

> *cinematic 35mm film grain, low-key chiaroscuro lighting, muted period palette, painterly horror illustration, no recognizable likeness of any actor or public figure, no logos, no text, vertical 3:4 aspect ratio, head-and-shoulders or symbolic-tarot framing, occult-clinical portraiture style*

If you want a more uniform tarot-card aesthetic across all 38, add: *bordered tarot card composition, ink-wash texture, gold-leaf accents on dark background, hand-painted feel*.

If you want photographic realism instead, swap "painterly horror illustration" for *35mm photograph, expired Kodak Gold film, natural lensing, no studio lighting*.

---

## Trauma & Survivor Archetypes

### The Final Girl — `the_final_girl.png`
Palette: deep blood red (#8b1a1a) and worn parchment gold (#d4a574)

> A young woman alone in a dim suburban kitchen at dawn, knife held loosely at her side, blood at her temple, eyes ringed with exhaustion but locked on the doorway. Damp brown hair. Wearing a torn pale shirt. The lighting is single-source through a window slat — sodium-orange streetlight bleeding into pre-dawn blue. She is not afraid. She is waiting. Painterly horror illustration, 35mm grain, vertical composition.

### The Haunted Witness — `the_haunted_witness.png`
Palette: cold slate blue (#3a4a5a) and frosted glass (#9bb3c4)

> A woman in her thirties seated by a frost-edged window in an old house, looking past the camera at something the viewer cannot see. Her reflection in the glass is doubled and slightly out of phase with her body — the second image looking back at her, not at the world. Pale skin, dark circles, expression neither afraid nor relieved. Cool gray-blue palette, steam from a forgotten teacup, grain.

### The Returning Daughter — `the_returning_daughter.png`
Palette: bruise plum (#5a3a4a) and faded rose (#c9a0a0)

> A woman in her early thirties standing in the doorway of a childhood bedroom that has been preserved exactly. She holds a small object from the room — a stuffed animal, a photograph — but the camera does not show what. Her face is composed; her hand is white-knuckled. The wallpaper is patterned with small repeating roses gone yellow with age. Single bare bulb above. Plum and rose tones, painterly.

### The Visiting Girl — `the_visiting_girl.png`
Palette: brackish teal (#1a2a2a) and pond-water silver (#5a8a8a)

> A child of about eight, wet hair plastered to her face, standing perfectly still at the edge of a moonlit body of water. She is barefoot, in an old-fashioned nightgown, mostly soaked. The water behind her is impossibly still. She is not menacing — she is *patient*. The viewer cannot tell if she has just emerged or is about to step back in. Cool teal-silver palette, painterly horror illustration.

### The Orphan Seer — `the_orphan_seer.png`
Palette: dawn slate (#1a2a3a) and morning gold (#a0c0d8)

> A child standing alone in a field of tall, dry grass at dawn, holding a small bird that is alive. They are looking at the horizon, not at the bird. The light is soft and forgiving — first sunrise after a long night. The composition is calm rather than dread-inducing. Painterly, with golden-blue tonal range.

### The Captive Self — `the_captive_self.png`
Palette: leather sienna (#3a2a1a) and copper-gold (#a87858)

> A woman seated in a plain kitchen chair, hands folded in her lap, mouth slightly parted. She is not bound — that is the point — but every line of her body says she has not been free in a long time. The room is tidy, ordinary, a little overlit. There is one closed door behind her. Sienna and copper palette, oil-painting realism, claustrophobic framing.

---

## Mood, Grief, Existential

### The Grief-Keeper — `the_grief_keeper.png`
Palette: night ink (#1a1a2a) and lavender shadow (#6b5d8c)

> A woman seated on the floor of a darkened bedroom, holding something wrapped in a small blanket close to her chest. The wrapped shape is intentionally ambiguous — it is the *grief itself* given form. Her face is exhausted past tears. Behind her, on the wall, a single nightlight casts an enormous blurred shadow that has its own posture, faintly humanoid. Deep purple-black palette, grain.

### The Drowned Self — `the_drowned_self.png`
Palette: deep harbor (#0f2030) and pewter (#4a6c80)

> A figure submerged in still dark water seen from above, fully clothed, eyes open, expression neutral — not drowning, not rescued, simply *under*. Hair fans out slowly. Surface above shows a faint reflection of a city window. The viewer is the surface looking down. Cold harbor-blue palette, photographic realism, near-silence as a visual quality.

### The Returning Revenant — `the_returning_revenant.png`
Palette: midnight indigo (#1a1a3a) and pale lilac (#a0a0e0)

> A figure in plain hospital-discharge clothing standing on a wet sidewalk at dusk, looking at their own front door from the bottom of the steps. They are intact, healing, marked by something that is not quite visible. The light around them is gentler than it should be. No blood, no melodrama — only the strange suspended gravity of return. Indigo and lilac palette, painterly.

### The Vengeful Returner — `the_vengeful_returner.png`
Palette: dried blood (#3a1a1a) and ember red (#c84040)

> A woman in her forties standing in falling rain at the edge of a parking lot, jaw set, eyes clear, water tracing her face. She is not crying. She is not screaming. She is *deciding*. The framing is from below, slightly heroic, but the palette is too dark for triumph. Ember-red highlights against rust-black. Painterly, cinematic.

### The Void-Speaker — `the_void_speaker.png`
Palette: pure black (#0a0a0a) and cold bone gray (#606060)

> A figure standing at the edge of an immense empty plane that recedes into perfect black. Their back is to the viewer. They are not afraid — they are *attentive*. Their silhouette is precise; the void around them is uniform, suggestive of nothing and therefore of everything. No stars, no horizon, no scale. Bone-gray figure on absolute black, painterly minimalism.

### The Eternal Returner — `the_eternal_returner.png`
Palette: forest moss (#1a2a1a) and pale lichen (#80a880)

> A figure walking along a circular path through dim woods. The path is worn into the ground from prior passages. Faint ghosts of the same figure walk ahead and behind them, slightly out of register, in different stages of stride — past selves and future selves, all walking the same loop. They are not surprised by them. Mossy green and lichen palette, painterly.

### The Bargained Self — `the_bargained_self.png`
Palette: aubergine (#2a1a2a) and orchid violet (#a060a0)

> A successful-looking person in a tailored suit standing alone in a high-floor office at night, city lights below. Their hand rests on a desk. Below the desk, half-emerging from the floor, is a faint translucent second figure — the same person, younger, raising a hand toward them. The polished figure does not look down. Violet and aubergine, painterly cinematic.

---

## Anxiety, OCD, Hypervigilance

### The Listener — `the_listener.png`
Palette: forest moss (#2a3525) and reedy sage (#a8b58a)

> A woman holding herself very still in a perfectly silent kitchen at night, head tilted just slightly as if catching a sound. Every surface is meticulously clean, every object placed with intention. A single floorboard creak is implied by the composition — though we cannot see it. Sage-green palette, naturalistic, careful.

### The Ritualist — `the_ritualist.png`
Palette: violet ink (#1f1a2a) and brass (#b8a060)

> A figure performing an unspecified small precise action — adjusting an object on a table, perhaps the third or fourth time — in a softly lit room. The objects on the table are arranged in a perfect geometric pattern. Around them, faint chalk lines on the floor mark routes that have been walked many times. They are concentrating; nothing else exists. Violet and brass tones, painterly.

### The Quiet Neighbor — `the_quiet_neighbor.png`
Palette: dusk indigo (#2c2c3a) and fog gray (#8a8aa0)

> A person seen through a curtained apartment window from outside, partial silhouette, books visible on a nearby shelf. They are reading, holding still, present in their own life and absent from anyone else's. The street outside is empty. Cold indigo palette, painterly cinematic, melancholy without despair.

### The Pregnant Oracle — `the_pregnant_oracle.png`
Palette: muted plum (#3a2a3a) and dusty mauve (#c8a0c0)

> A pregnant woman in a lit doorway at night, hand resting on her abdomen, looking past the viewer with quiet certainty. Behind her, the apartment hallway is shadowed in a way the room ahead is not. She knows something. No one in the world has yet believed her. Painterly, grain, plum and mauve palette, no horror clichés.

---

## Personality / Cluster B

### The Devoted Fan — `the_devoted_fan.png`
Palette: arterial (#5a1a2a) and salmon pink (#e8a8a8)

> A young woman in a softly lit room surrounded by carefully curated objects — collected, arranged, slightly obsessive. Her expression is open and warm. Behind her, on the wall, a slightly out-of-focus second image of the same woman is visible — same room, same posture, but with a different expression: cold, watchful, exact. Painterly, deep red-pink palette.

### The Cabin Husband — `the_cabin_husband.png`
Palette: smoke umber (#4a2a1a) and ember orange (#c87a4a)

> A man in his forties seated alone at a long wooden dining table in a rural cabin, an unfinished bottle in front of him, a typewriter further down the table. The light is amber and low. His expression has begun to slip — the practiced charm not quite covering what is moving underneath. Snow visible through the windows. Umber and amber palette, painterly cinematic.

### The Charming Predator — `the_charming_predator.png`
Palette: dried-blood black (#2a1a1a) and dulled crimson (#8a3030)

> A well-dressed man in his thirties in a clean, modern interior, smiling pleasantly at the viewer. The smile is technically correct in every detail and emotionally vacant in every detail. His eyes do not match his mouth. Behind him, the room is impeccably ordered. Painterly photo-realism, dark red-black palette, calm rather than gory.

### The Perfect Child — `the_perfect_child.png`
Palette: still lake (#2a3a4a) and blanched cream (#d8d0b8)

> A child of about ten in formal clothing, standing alone in a polished hallway, holding a single object — perhaps a plate, a flower, or a book. Their posture is too composed; their expression is impassive. The proportions are subtly *almost* correct, in a way the viewer cannot pinpoint. Cream and lake-water palette, painterly.

### The Mask-Wearer — `the_mask_wearer.png`
Palette: charcoal (#2a2a2a) and silver (#c0c0c0)

> A person photographed mid-smile in a flattering professional portrait — confident, accomplished, lit beautifully. The mouth and eyes are smiling. There is, however, a faint second outline behind the polished face — the suggestion of another expression underneath the first, not visible directly but felt. Charcoal and silver palette, photo-realism with painterly underdrawing.

---

## Dissociation, Psychotic Spectrum

### The Dissociated Son — `the_dissociated_son.png`
Palette: cold concrete (#3a3a4a) and faded blue-gray (#a0a8b8)

> A man in his forties seated in front of an antique vanity mirror in a darkened room. In the mirror, an elderly woman is faintly visible behind him — not a ghost, but a fixed *presence* maintained by his system. The viewer cannot tell whether she is conscious. He is calm. The palette is concrete and blue-gray, painterly, restrained.

### The Unraveling Caretaker — `the_unraveling_caretaker.png`
Palette: deep ash (#1a1a1a) and signal red (#a82828)

> A man in a button-down shirt seated alone in an enormous, empty grand hall — a hotel ballroom or banquet space. There is a single typewriter in front of him on a small table. The chairs are stacked along the walls. He is looking up at the high ceiling, mouth slightly open, eyes far away. The space dwarfs him. Painterly cinematic, ash and red.

### The Psychic Child — `the_psychic_child.png`
Palette: bruise indigo (#2a2a3a) and pale moonlight (#a8b8d8)

> A child sitting cross-legged on a bedroom floor, drawing. The drawings on the floor around them depict the future or the unseen — not gory, but *too specific* to be imagined. The child is calm and absorbed, apparently undisturbed by what their hand produces. Cool indigo and moonlight palette, painterly.

### The Borrowed-Face — `the_borrowed_face.png`
Palette: sleet gray (#2a2a3a) and pewter rose (#a0a0c0)

> A person in formal attire seen at a function — wedding, gallery opening, corporate event. They are smiling at someone outside the frame. Their face, in the slight motion blur, momentarily appears to belong to someone else, faintly visible underneath. The replacement is partial and uneasy. Photographic realism with painterly bleed, sleet and rose tones.

---

## Substance / Impulsivity

### The Cellar Drinker — `the_cellar_drinker.png`
Palette: peat brown (#2a1a0a) and amber whiskey (#a87040)

> A wooden staircase descending into a basement, single bare bulb at the bottom, glow of amber light, partial silhouette of a figure seated on the floor below the frame. The framing is from above — the viewer is on the upper floor, where the rest of the family is. Empty bottles arranged with strange precision around the seated figure. Whiskey and peat palette, painterly cinematic.

### The Chasing Thing — `the_chasing_thing.png`
Palette: olive shadow (#2a2a1a) and pale citrine (#c8c870)

> A figure running through a corridor that extends impossibly forward, blurred. They are not pursued — they are *pursuing*. Whatever they are chasing remains just past the vanishing point, never visible. Their expression is not desperate; it is *fixed*. Olive and citrine palette, motion blur, painterly.

---

## Neurodevelopmental

### The Distracted Protagonist — `the_distracted_protagonist.png`
Palette: navy dusk (#1a2a3a) and electric sky (#80b0d8)

> A person in a busy room at a party, looking off at something irrelevant in the corner — a moth, a poster, a blinking light — while behind them, partly out of focus, something significant is happening that they have not yet noticed. The composition is split-attention by design. Navy and electric blue palette, painterly cinematic.

### The Uncanny Outsider — `the_uncanny_outsider.png`
Palette: deep teal (#2a3a4a) and morning blue (#80a8c0)

> A young person standing slightly apart from a small group at a casual gathering, attending closely to a single object — a leaf, a coffee cup, a pattern on the floor — while the group behind them communicates in flows they are not part of. The figure is not lonely; they are *correctly absorbed*. Teal and morning-blue palette, painterly, kind.

---

## Identity, Body, Mood Spectrum

### The Perfectionist Dancer — `the_perfectionist_dancer.png`
Palette: smoke purple (#1a1a2a) and pearl pink (#e8d8e8)

> A dancer in a mirrored studio executing a perfect line, body precise, expression composed. In the mirror, a second version of her stands slightly out of phase — looser, wilder, holding a small piece of food, looking back at the disciplined version with quiet judgment that reads as both threat and longing. Smoke-purple and pearl palette, painterly.

### The Unbound Artist — `the_unbound_artist.png`
Palette: midnight orchid (#3a1a3a) and golden flare (#f8b860)

> A figure in a paint-spattered studio at 3am, surrounded by canvases, sketchbooks, instruments, ten unfinished projects in mid-state. They are not tired. The light is warm and impossible. There is a faint manic glow at their temples. The composition is overflowing — too much *yes* — beautiful and not sustainable. Orchid and gold palette, painterly cinematic.

### The Changing Body — `the_changing_body.png`
Palette: dried clay (#2a1a1a) and dusty rose (#c89090)

> A figure looking down at their own hand or arm in a mirror, examining it as if it has begun to belong to someone else. The hand looks ordinary; it is the *gaze* that signals horror. The palette is muted clay and rose. Painterly, intimate, restrained — body horror by attention rather than by spectacle.

### The Invisible Girl — `the_invisible_girl.png`
Palette: arterial maroon (#3a0a1a) and signal red (#a83a3a)

> A teenage girl in a high school hallway, mostly out of focus while peers move past her sharply rendered. Her form is rendered with slightly less weight than the rest of the scene, as if the world is in agreement that she should not be seen. Her expression is neither sad nor angry — it is *containing*. Maroon and signal-red palette, painterly cinematic.

---

## Withdrawal, Attachment, Identity

### The Basement-Dweller — `the_basement_dweller.png`
Palette: night ash (#1a1a1a) and slate gray (#606070)

> A person in a small, cluttered, lamplit room — books, screens, partial meals, a careful arrangement of objects of personal meaning. They are calm. They are absorbed. The room is below ground. The door is closed. The composition is serene rather than tragic. Painterly, night-ash palette, kind.

### The Vanishing Partner — `the_vanishing_partner.png`
Palette: sleet gray (#3a3a3a) and bone (#909090)

> A couple seated at a small kitchen table at evening. One partner is leaning slightly forward, present, asking something. The other partner is in the same physical position as a mirror but rendered with about 70% opacity — physically there, partly elsewhere. Their expression is gentle, but their *being* is half-withdrawn. Sleet and bone palette, painterly.

### The Ferryman — `the_ferryman.png`
Palette: still water (#2a3a3a) and green-glass (#a0c0c0)

> A figure rowing a small boat across a still gray river at dawn. The boat is full of unseen weight (the passengers are implied, not rendered). The figure is steady, exhausted, kind. Their hands are calloused. Their eyes are clear and far away. Mist on the water. Painterly cinematic, gray-green tonal range.

---

## Adaptive / Regulating

### The Curious Investigator — `the_curious_investigator.png`
Palette: forest moss (#2a3a2a) and lichen green (#c0d8a0)

> A person standing at the threshold of a dim doorway, holding a small flashlight, calmly considering whether to enter. They are not afraid; they are *curious*. The room beyond the door is dark but not threatening. Their posture is settled. The composition is open rather than tense. Moss and lichen palette, painterly cinematic, lit warmly from below.

---

## v3 Additions — Eating, Substance, Insomnia, Schizotypal, Somatic, and More

### The Perfectionist Swan — `the_perfectionist_swan.png`
Palette: midnight violet (#2a1a2a) and pale silver-pink (#e8d8e8)

> A dancer in front of a wide mirror, body postured for control. The reflection shows a slightly different version — more strained, more visibly hungry. The studio is lit by a single bare bulb. Ribbon laces cross the legs in tight rows. Velvet curtains in the background. Painterly horror illustration, midnight violet palette.

### The Starving Addict — `the_starving_addict.png`
Palette: dried blood red (#3a1a1a) and faded coral (#c87878)

> A figure in a vintage red dress, hollow at the cheeks, sitting alone in a kitchen with pill bottles arranged on the counter. The light is from a small TV screen flickering off-camera. Wallpaper is yellowed. The figure is reading her own reflection in the dark window. Cinematic, period-piece, dried-blood and faded-coral palette.

### The Binge-Keeper — `the_binge_keeper.png`
Palette: walnut brown (#2a1a1a) and parchment beige (#a0786a)

> A figure crouched in a small kitchen at night, surrounded by empty wrappers. The only light source is the open refrigerator. The figure's face is turned away from the viewer; only the curve of a shoulder and a hand visible. Shame-saturated. Walnut and parchment palette.

### The Chasing Addict — `the_chasing_addict.png`
Palette: institutional green (#1a2a1a) and olive yellow (#a8a868)

> A figure with a bandaged arm, sitting on the edge of a bare hospital bed, gaze focused on the middle distance. Industrial light from a single fluorescent bulb. The room is institutional green. A small spoon and bent metal on the side table. Painterly, harm-reduction-aware (no glamorization).

### The High-Functioner — `the_high_functioner.png`
Palette: charcoal gray (#2a2a2a) and pewter silver (#a0a0a0)

> A figure in a perfectly tailored suit, sitting at a polished desk in a glass office. A locked drawer is barely visible at the corner. The figure's expression is composed, public, professional. The reflection in the window behind shows nothing — perfectly mirror-blank. Pewter and charcoal palette.

### The Sleepless Writer — `the_sleepless_writer.png`
Palette: midnight indigo (#1a1a2a) and bone white (#a0a8c0)

> A figure at a small writing desk in a hotel room, surrounded by crumpled paper. A clock on the wall reads 3:17. The figure's eyes are wide, alert, exhausted. A typewriter or laptop is half-finished. The bedside lamp is the only light. Indigo and bone palette.

### The Dreamless — `the_dreamless.png`
Palette: ash gray (#1a1a1a) and platinum white (#a8a8a8)

> A figure pinned awake in bed, eyes wide, propping themselves against the headboard. A mug of coffee on the nightstand. The bedroom is dim, the window showing a deep night sky. The figure's body shows the strain of multiple sleepless nights. Ash and platinum palette.

### The Unusual Seer — `the_unusual_seer.png`
Palette: candlelight gold (#1a1a2a) and antique brass (#9090b0)

> A figure in a small studio at night, working on an intricate dollhouse. The dollhouse contains figures arranged in tableaux that mirror the figure's own life. Candles around the workspace. The figure's hand is steady; their gaze is focused, almost trance-like. Candlelit, gold and brass palette.

### The Eccentric Outsider — `the_eccentric_outsider.png`
Palette: sepia black (#1a1a1a) and tarnished silver (#a0a0c0)

> A figure in a small attic apartment surrounded by shelves of strange collected objects — preserved insects, old coins, books in obscure languages. The figure is mid-monologue to themselves, comfortable, unconcerned with social judgment. Window shows a city at twilight. Sepia, tarnished palette.

### The Paranoid Seer — `the_paranoid_seer.png`
Palette: midnight black (#1a1a1a) and steel blue (#7878a0)

> A figure peering through a peephole or curtain in a dim apartment. The hallway visible beyond is empty but the figure is convinced something is wrong. The wallpaper has small repeating patterns that almost form faces. The figure's posture is cautious, listening intently. Black and steel-blue palette.

### The Body Horror — `the_body_horror.png`
Palette: bruised wine (#2a1a1a) and pale flesh (#c8a0a0)

> A figure with stigmata-like marks on their hands and bare feet, kneeling in a small bedroom that doubles as a chapel. Religious imagery in tarnished silver around the room. The figure's expression is rapt, half-pained, half-ecstatic. Wine and pale-flesh palette.

### The Unwell Caretaker — `the_unwell_caretaker.png`
Palette: hospital teal (#1a2a2a) and clinical mint (#a8c0c0)

> A figure surrounded by pill organizers, medical files, a thermometer, and a blood pressure cuff. The figure is examining a small bruise on their arm with grave attention. The kitchen behind them is otherwise normal. Hospital teal and clinical mint palette.

### The Melancholic Widow — `the_melancholic_widow.png`
Palette: storm slate (#1a2a3a) and twilight blue (#909fb0)

> A figure sitting at the end of a long dark hallway, head turned away. A single window at the far end of the hallway shows a gray dusk. The figure's hand rests on a closed photo album. The hallway carpet is patterned and faded. Storm slate and twilight blue palette.

### The Hidden Depressive — `the_hidden_depressive.png`
Palette: midnight purple (#1a1a2a) and amethyst gray (#7868a0)

> A figure in clerical or professional dress, photographed from behind, looking at their reflection in a window. The reflection shows a face that doesn't match the public composure of the body. Empty office space behind. Midnight purple, amethyst gray palette.

### The Unsleeping Genius — `the_unsleeping_genius.png`
Palette: burning red (#3a1a1a) and ember gold (#f8b860)

> A figure at a typewriter at 4 AM, hair disheveled, surrounded by stacks of finished pages. The figure's eyes are bright, manic, electrified. A nearly-empty bottle of whiskey to the side. The light is golden, warm, dangerous. Burning red and ember gold palette.

### The Relational Survivor — `the_relational_survivor.png`
Palette: bruised plum (#2a1a2a) and rose-gray (#c0a0c0)

> A figure standing in the doorway of an apartment, keys in hand, surveying the empty rooms with both relief and watchfulness. The space is theirs again. Behind, on a side table, a small framed photo turned face-down. Plum and rose-gray palette.

### The Panicker — `the_panicker.png`
Palette: shower-curtain crimson (#2a1a1a) and pulse pink (#d8a0a0)

> A figure mid-gasp, hand on chest, eyes wide. The room around them — a bathroom or hallway — is rendered slightly off-axis, as if the figure's perception is warping. The lighting is harsh white-fluorescent. Crimson and pulse-pink palette.

### The Clean-Haunted — `the_clean_haunted.png`
Palette: bleach teal (#2a3a3a) and chrome white (#a0c0c0)

> A figure at a kitchen sink, hands raw and red from washing, water running. Bottles of bleach lined neatly on the counter. The room is otherwise spotless to a degree that registers as wrong rather than tidy. Cool, sterile, slightly off. Bleach teal and chrome palette.

### The Quiet Borderline — `the_quiet_borderline.png`
Palette: doll-rose dusk (#2a1a2a) and porcelain blue (#a0a0c0)

> A figure in a small craft room, sewing together a doll from disparate parts. The doll's parts are organized neatly on the table — eyes, hands, a small mouth. The figure's expression is careful, almost loving. The room is dim and tidy. Doll-rose and porcelain palette.

### The Decompensating — `the_decompensating.png`
Palette: peeling plaster (#1a1a1a) and bone yellow (#a0a0a0)

> A figure in a once-elegant apartment, walls cracking visibly behind them. The figure is mid-motion, having just noticed a hand emerging from the wallpaper that the viewer can also see — but the viewer cannot tell if it is real or projected. Peeling plaster and bone-yellow palette.

### The Acutely Overwhelmed — `the_acutely_overwhelmed.png`
Palette: blizzard navy (#1a1a2a) and frost gray (#a0a0c0)

> A figure standing in a snowy doorway holding something heavy, posture exhausted but resolute. The view behind shows endless white. Their face shows the moment between coping and unraveling. Navy and frost-gray palette.

### The Paranoid Patriarch — `the_paranoid_patriarch.png`
Palette: storm-cellar green (#1a2a1a) and overcast pale (#a0c0a0)

> A figure standing at the lip of a hand-dug shelter in the backyard, looking up at a stormy sky that hasn't yet broken. Family visible in a window of the house behind, watching with concern. The figure is alone in their certainty. Storm-cellar green palette.

### The Dependent Clinger — `the_dependent_clinger.png`
Palette: matched-outfit lavender (#2a1a2a) and rose taupe (#c8a0c0)

> Two figures sitting side by side on a couch, photographed from behind. They are wearing matching outfits. One figure's posture is relaxed; the other is mirroring with such precision it registers as wrong. The intimacy is suffocating rather than warm. Lavender and rose-taupe palette.

---

## Tips for batch generation

If you want to regenerate the entire gallery in one workflow:

1. **Midjourney**: Use the `/imagine` command with each prompt, append `--ar 3:4 --style raw --stylize 200`, and save with the `character_id.png` naming convention. Midjourney's `--seed` parameter helps if you want the gallery to share visual DNA — pick one seed and reuse it across all 38.
2. **DALL-E 3**: Append `". Style: cinematic horror illustration, painterly, 35mm grain, vertical 3:4 composition. No text, no logos, no recognizable likeness."` Adjust the wording per prompt if DALL-E refuses a prompt for content policy — a slight rewording usually clears it.
3. **Stable Diffusion XL / Flux**: Use a horror-illustration LoRA if you have one. Negative prompts: *text, watermark, logo, signature, recognizable celebrity face, deformed hands, gore-pornographic, exploitation imagery*.
4. **Imagen 3 / Imagen 4 / Gemini**: Append `"Vertical 3:4 portrait. Painterly horror illustration. Cinematic 35mm film grain. No text. No recognizable likeness."` Imagen tends to produce slightly more painterly results than DALL-E.

Whichever generator you use: review every output before adding to the gallery. The prompts are written to be IP-safe in **description**, but generators can still produce images that resemble specific copyrighted characters or actors due to their training data. If anything looks too close to a recognizable IP, regenerate with the seed varied.

## License of generated outputs

The prompts in this file are released under MIT (with the rest of the repo). The images you generate from them are subject to the terms of service of whichever generator you use. Most current generators permit commercial use of outputs, but verify for your specific case. If you generate images and want to contribute them back to the repo, please confirm the generator's license permits redistribution under MIT.
