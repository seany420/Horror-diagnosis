/* ============================================================
   SCREAM PROFILE — CHARACTER ROSTER
   ============================================================
   Each character has:
   - id: unique key (matches SVG portrait file)
   - name: original archetype-based name (no IP)
   - source: inspiration noted as analytic reference, not claim
   - archetype: one-line type
   - profile: clinical descriptive
   - metaphor: therapeutic/cultural function
   - therapeuticUse: how this archetype is used in clinical work
   - weights: evidence weights against each disorder ID
   - traitTags: surface-level tags for UI filtering
   ============================================================ */

const CHARACTERS = [

  // ========= TRAUMA / FINAL GIRL ARCHETYPES =========
  {
    id: "the_final_girl",
    name: "The Final Girl",
    nameDisplay: "Laurie Strode — The Final Girl",
    inspiredBy: { primary: "Laurie Strode", film: "Halloween (1978/2018)", others: ["Sidney Prescott (Scream)", "Nancy Thompson (A Nightmare on Elm Street)", "Sally Hardesty (The Texas Chain Saw Massacre)"] },
    archetype: "Survivor / Vigilant Protector",
    profile: "Hypervigilant, capable, isolated by what she has seen. The one left standing — and the one most marked by it.",
    metaphor: "Survival as identity. Trauma not as wound but as competence forged in fire. The capacity to keep going when there is no one left to follow.",
    therapeuticUse: "PTSD work, complex grief, survivor guilt. Externalizes hypervigilance as both protective and isolating — the same vigilance that saved her keeps her alone.",
    weights: { ptsd: 4.5, gad: 1.5, mdd: 1.8, ace: 2.5, aud: 0.8, fnc: 1.5 },
    traitTags: ["trauma", "vigilance", "isolation", "resilience"],
    palette: { primary: "#8b1a1a", accent: "#d4a574" }
  },
  {
    id: "the_haunted_witness",
    name: "The Haunted Witness",
    nameDisplay: "Cole Sear — The Haunted Witness",
    inspiredBy: { primary: "Cole Sear", film: "The Sixth Sense (1999)", others: ["Eleanor Vance (The Haunting of Hill House)", "Lin Shaye's Elise Rainier (Insidious)"] },
    archetype: "Trauma Survivor / Ghost-Seer",
    profile: "Sees what others cannot. Carries memory as embodied presence. Often dissociative, sometimes mistaken for fragile — actually load-bearing.",
    metaphor: "Trauma as continued visitation. The dead don't leave; they teach.",
    therapeuticUse: "Complex PTSD with dissociative features. Explores how 'haunting' indexes unresolved attachment and witnessing.",
    weights: { ptsd: 4.0, dissociation: 2.5, mdd: 1.5, ace: 2.5, fnc: 1.2 },
    traitTags: ["trauma", "dissociation", "witnessing", "grief"],
    palette: { primary: "#3a4a5a", accent: "#9bb3c4" }
  },
  {
    id: "the_returning_daughter",
    name: "The Returning Daughter",
    nameDisplay: "Adelaide Wilson — The Returning Daughter",
    inspiredBy: { primary: "Adelaide Wilson", film: "Us (2019)", others: ["Annie Graham (Hereditary)", "Eleanor (The Haunting of Bly Manor)"] },
    archetype: "Adult Survivor of Childhood Abuse",
    profile: "Comes back to the place that hurt her — sometimes to bury it, sometimes because she never really left. Carries the family wound.",
    metaphor: "Generational trauma. The house that won't release its inhabitants.",
    therapeuticUse: "Adult survivors of CSA, family-of-origin work, intergenerational ACE patterns. Names the pull to return.",
    weights: { ptsd: 3.5, mdd: 2.0, ace: 4.0, bpd: 1.5, dissociation: 1.8, fnc: 1.2 },
    traitTags: ["trauma", "family", "ace", "return"],
    palette: { primary: "#5a3a4a", accent: "#c9a0a0" }
  },

  // ========= GRIEF & DEPRESSION =========
  {
    id: "the_grief_keeper",
    name: "The Grief-Keeper",
    nameDisplay: "Amelia Vanek — The Grief-Keeper",
    inspiredBy: { primary: "Amelia Vanek", film: "The Babadook (2014)", others: ["Annie Graham (Hereditary)", "Rabbit (The Babadook)"] },
    archetype: "Maternal Mourner / Denied Loss",
    profile: "Loss has metabolized into something with a face. Exhausted, raw, alternately tender and explosive. Cannot put it down because she has not been allowed to set it down.",
    metaphor: "Grief that gets disenfranchised — too long, too messy, too disturbing for others — becomes monstrous because it has nowhere else to go.",
    therapeuticUse: "Complicated grief, perinatal loss, single-parent overwhelm. Externalizes the grief as a separate (manageable) entity rather than the self.",
    weights: { mdd: 3.2, gad: 2.0, ptsd: 1.8, fnc: 2.0 },
    traitTags: ["grief", "depression", "maternal", "exhaustion"],
    palette: { primary: "#1a1a2a", accent: "#6b5d8c" }
  },
  {
    id: "the_drowned_self",
    name: "The Drowned Self",
    nameDisplay: "Justine — The Drowned Self",
    inspiredBy: { primary: "Justine", film: "Melancholia (2011)", others: ["Maud (Saint Maud)", "Mother (Mother!, 2017)", "Edna Pontellier (The Awakening as proto-horror)"] },
    archetype: "Anhedonic Depression / Existential Drift",
    profile: "Submerged. Watching life from underwater. Going through motions while feeling absence as a physical weight. Not sad — gone.",
    metaphor: "Depression as water — not the storm but the deep, quiet pressure that crushes slowly.",
    therapeuticUse: "MDD with prominent anhedonia and existential features. Useful with patients who can't access affect — gives them an image for the absence.",
    weights: { mdd: 3.5, gad: 1.0, dissociation: 1.2, fnc: 2.0 },
    traitTags: ["depression", "anhedonia", "existential"],
    palette: { primary: "#0f2030", accent: "#4a6c80" }
  },
  {
    id: "the_invisible_girl",
    name: "The Invisible Girl",
    nameDisplay: "Carrie White — The Invisible Girl",
    inspiredBy: { primary: "Carrie White", film: "Carrie (1976)", others: ["May (May, 2002)", "Brigette Fitzgerald (Ginger Snaps)"] },
    archetype: "Suppressed Adolescent / Bullied Outsider",
    profile: "Years of being unseen become a kind of power — and a kind of poison. The pressure cooker of suppressed rage.",
    metaphor: "What happens when the unwanted become powerful. The cost of years of suppression.",
    therapeuticUse: "Adolescent depression with bullying history, suppressed-rage clinical pictures. Validates the rage while addressing its expression.",
    weights: { mdd: 2.2, ace: 2.8, ptsd: 1.5, social_anx: 2.0 },
    traitTags: ["depression", "rage", "adolescent", "outsider"],
    palette: { primary: "#3a0a1a", accent: "#a83a3a" }
  },

  // ========= ANXIETY / OCD / PHOBIC =========
  {
    id: "the_listener",
    name: "The Listener",
    nameDisplay: "Evelyn Abbott — The Listener",
    inspiredBy: { primary: "Evelyn Abbott", film: "A Quiet Place (2018)", others: ["Chris MacNeil (The Exorcist)", "Theresa (The Conjuring)", "Lin Shaye's Elise Rainier (Insidious)"] },
    archetype: "Hypervigilant Anxious / Sensory-Driven",
    profile: "World built around silence. Hyperaware of sound, breath, footstep. Anxiety has perfected itself into a system of rules.",
    metaphor: "Anxiety as survival adaptation — the rules that worked once and now run the household.",
    therapeuticUse: "GAD with strong somatic/sensory features, hypervigilance, OCD-spectrum. Explores how protective rules become prisons.",
    weights: { gad: 3.0, ocd: 2.5, ptsd: 1.5, fnc: 1.5 },
    traitTags: ["anxiety", "hypervigilance", "sensory"],
    palette: { primary: "#2a3525", accent: "#a8b58a" }
  },
  {
    id: "the_ritualist",
    name: "The Ritualist",
    nameDisplay: "Thomasin's father (William) — The Ritualist",
    inspiredBy: { primary: "William", film: "The Witch (2015)", others: ["Aaron Cleary (Frailty, 2001)", "Beverly Marsh's tap rituals (IT)", "the priests of The Conjuring"] },
    archetype: "OCD / Compulsive Order",
    profile: "If the rules are followed exactly, nothing bad happens. If they are not — catastrophe. The self disappears into the algorithm.",
    metaphor: "Magical thinking as bargain. The compulsion as price for safety that never arrives.",
    therapeuticUse: "OCD, scrupulosity, ritualistic anxiety. Externalizes the ritual as something separate from the person — often the entry point to ERP.",
    weights: { ocd: 3.5, gad: 2.0, mdd: 1.0 },
    traitTags: ["ocd", "ritual", "magical_thinking"],
    palette: { primary: "#1f1a2a", accent: "#b8a060" }
  },
  {
    id: "the_quiet_neighbor",
    name: "The Quiet Neighbor",
    nameDisplay: "Eleanor Vance — The Quiet Neighbor",
    inspiredBy: { primary: "Eleanor Vance", film: "The Haunting of Hill House (1963/1999/2018)", others: ["Wendy Torrance pre-Overlook (The Shining)", "Margot (The Witch)", "Sara (Don't Breathe)"] },
    archetype: "Social Anxiety / Avoidant",
    profile: "World shrunk to the safe perimeter. Catastrophic prediction in every social encounter. Polite, careful, exhausted.",
    metaphor: "The safety of being unseen. The cost of never being known.",
    therapeuticUse: "Social anxiety disorder, avoidant personality features. Validates the protective function while naming the cost.",
    weights: { social_anx: 3.5, gad: 1.8, mdd: 1.5 },
    traitTags: ["social_anxiety", "avoidance", "isolation"],
    palette: { primary: "#2c2c3a", accent: "#8a8aa0" }
  },
  {
    id: "the_pregnant_oracle",
    name: "The Pregnant Oracle",
    nameDisplay: "Rosemary Woodhouse — The Pregnant Oracle",
    inspiredBy: { primary: "Rosemary Woodhouse", film: "Rosemary's Baby (1968)", others: ["Madeline (Saint Maud)", "Beth (Inside)"] },
    archetype: "Perinatal Anxiety / Gaslit Knowing",
    profile: "Knows something is wrong. Cannot get anyone to believe her. Watches her own perception decay under the weight of others' certainty.",
    metaphor: "Gaslighting and the betrayal of intimate knowing. The body that tells the truth nobody will hear.",
    therapeuticUse: "Perinatal mood/anxiety, medical trauma, narcissistic-abuse aftermath. Validates intuition that has been pathologized.",
    weights: { gad: 2.5, ptsd: 2.2, mdd: 1.8, dissociation: 1.5 },
    traitTags: ["anxiety", "perinatal", "gaslighting"],
    palette: { primary: "#3a2a3a", accent: "#c8a0c0" }
  },

  // ========= PERSONALITY / BPD / NPD =========
  {
    id: "the_devoted_fan",
    name: "The Devoted Fan",
    nameDisplay: "Annie Wilkes — The Devoted Fan",
    inspiredBy: { primary: "Annie Wilkes", film: "Misery (1990)", others: ["Pearl (Pearl, 2022)", "Evelyn Draper (Play Misty for Me)"] },
    archetype: "BPD with Idealization-Devaluation",
    profile: "Love that flips into rage in a heartbeat. The most loyal person until you violate the unwritten rules.",
    metaphor: "Splitting made literal. The terror of abandonment expressed as captivity.",
    therapeuticUse: "BPD work, particularly idealization-devaluation cycles. Excellent for psychoeducation about splitting.",
    weights: { bpd: 3.5, mdd: 2.0, gad: 1.5 },
    traitTags: ["bpd", "splitting", "abandonment"],
    palette: { primary: "#5a1a2a", accent: "#e8a8a8" }
  },
  {
    id: "the_cabin_husband",
    name: "The Cabin Husband",
    nameDisplay: "Jack Torrance — The Cabin Husband",
    inspiredBy: { primary: "Jack Torrance", film: "The Shining (1980)", others: ["Paul Sheldon's writer-decline", "Greg in The Lighthouse"] },
    archetype: "Cluster B / Substance / Psychotic Decompensation",
    profile: "Charm degrading into rage. Isolation accelerating internal collapse. Substance use removing whatever brakes were left.",
    metaphor: "The monster who was always there, brought forward by isolation and substances. Family-of-origin trauma reenacting.",
    therapeuticUse: "Co-occurring SUD with mood/personality pathology, intimate partner violence dynamics, intergenerational trauma.",
    weights: { bpd: 2.0, aud: 3.0, ace: 2.5, mdd: 1.8, ptsd: 1.5 },
    traitTags: ["substance", "violence", "family", "decompensation"],
    palette: { primary: "#4a2a1a", accent: "#c87a4a" }
  },
  {
    id: "the_charming_predator",
    name: "The Charming Predator",
    nameDisplay: "Hannibal Lecter — The Charming Predator",
    inspiredBy: { primary: "Hannibal Lecter", film: "The Silence of the Lambs (1991)", others: ["Patrick Bateman (American Psycho)", "Tom Ripley", "Joe Goldberg (You)"] },
    archetype: "Antisocial / Psychopathic Traits",
    profile: "Glib, articulate, observant. Reads emotion as data, not experience. Uses what others feel without feeling it himself.",
    metaphor: "Predation as cultivated craft. Civilization as costume.",
    therapeuticUse: "Antisocial PD, narcissistic dynamics, forensic populations. Discussed with clinical care; not for self-identification work.",
    weights: { antisocial: 3.5, antagonism: 3.0, disinhibition: 1.5 },
    traitTags: ["antisocial", "predatory", "manipulative"],
    palette: { primary: "#2a1a1a", accent: "#8a3030" }
  },
  {
    id: "the_perfect_child",
    name: "The Perfect Child",
    nameDisplay: "Esther — The Perfect Child",
    inspiredBy: { primary: "Esther", film: "Orphan (2009)", others: ["Damien (The Omen)", "Rhoda Penmark (The Bad Seed)"] },
    archetype: "Pathological Mimicry / Cluster B presentation",
    profile: "Performs what is expected. Watches, learns, replicates. The mismatch between presentation and interior is the threat.",
    metaphor: "The cost of being a good object for adults. Childhood compliance as predator camouflage in extreme cases.",
    therapeuticUse: "Discussed clinically when working with adoption disruption, severe attachment disorders, or callous-unemotional features in youth.",
    weights: { antisocial: 3.0, antagonism: 2.5, ace: 1.5, disinhibition: 2.0 },
    traitTags: ["antisocial", "mimicry", "childhood"],
    palette: { primary: "#4a3a4a", accent: "#d8c8d8" }
  },

  // ========= PSYCHOSIS / DISSOCIATION / IDENTITY =========
  {
    id: "the_dissociated_son",
    name: "The Dissociated Son",
    nameDisplay: "Norman Bates — The Dissociated Son",
    inspiredBy: { primary: "Norman Bates", film: "Psycho (1960)", others: ["Kevin Wendell Crumb (Split)", "Carl in House of 1000 Corpses"] },
    archetype: "Severe Dissociative Identity / Trauma-Origin",
    profile: "Identity fragmented around early catastrophic loss. The mother is alive because she has to be. The shifts are protective and terrifying.",
    metaphor: "Dissociation as survival. The system held together by a fiction that cannot be examined.",
    therapeuticUse: "Severe trauma, DID/OSDD work. Always with extreme clinical care; this is for psychoeducation and metaphor, not self-administration.",
    weights: { dissociation: 3.5, ptsd: 2.5, ace: 3.0, mdd: 1.5 },
    traitTags: ["dissociation", "identity", "trauma", "maternal"],
    palette: { primary: "#3a3a4a", accent: "#a0a8b8" }
  },
  {
    id: "the_unraveling_caretaker",
    name: "The Unraveling Caretaker",
    nameDisplay: "Thomas Wake — The Unraveling Caretaker",
    inspiredBy: { primary: "Thomas Wake", film: "The Lighthouse (2019)", others: ["Jack Torrance's Overlook arc (The Shining)", "Reverend Toller (First Reformed)", "the keepers in The Witch"] },
    archetype: "Psychotic Decompensation in Isolation",
    profile: "Started organized. Present at first. Slowly losing the thread under sustained isolation, sleep deprivation, and a weight of responsibility nobody can carry alone.",
    metaphor: "What sustained isolation does to mind. The hotel as the inside of his own head.",
    therapeuticUse: "Psychotic episodes, severe depression with psychotic features, caregiver collapse. Explores environmental contributors.",
    weights: { psychoticism: 3.0, mdd: 2.0, aud: 2.0, dissociation: 1.5, fnc: 2.0 },
    traitTags: ["psychosis", "isolation", "decompensation"],
    palette: { primary: "#1a1a1a", accent: "#a82828" }
  },
  {
    id: "the_visiting_girl",
    name: "The Visiting Girl",
    nameDisplay: "Samara Morgan — The Visiting Girl",
    inspiredBy: { primary: "Samara Morgan", film: "The Ring (2002)", others: ["Sadako Yamamura (Ringu)", "Toshio Saeki (Ju-On)", "Regan (The Exorcist)"] },
    archetype: "Childhood Trauma / Vengeful Witness",
    profile: "The child who was failed, returning. Cannot be reasoned with — only understood and contained. The harm done to her is the harm she now does.",
    metaphor: "Unprocessed childhood violence as cyclical. The point at which a victim becomes inseparable from what was done.",
    therapeuticUse: "Childhood trauma reenactment, perpetration following victimization, the cycle of abuse. Difficult, important clinical territory.",
    weights: { ptsd: 2.5, ace: 3.5, antisocial: 1.8, dissociation: 2.0 },
    traitTags: ["trauma", "child", "cycle", "vengeance"],
    palette: { primary: "#1a2a2a", accent: "#5a8a8a" }
  },
  {
    id: "the_psychic_child",
    name: "The Psychic Child",
    nameDisplay: "Danny Torrance — The Psychic Child",
    inspiredBy: { primary: "Danny Torrance", film: "The Shining (1980) / Doctor Sleep (2019)", others: ["Carol Anne (Poltergeist)", "Charlie McGee (Firestarter)", "Eleven (Stranger Things)"] },
    archetype: "Sensory Sensitivity / Dissociation / Possible Psychotic Spectrum",
    profile: "Sees what isn't there — or sees what is and others have made themselves not-see. The vehicle is unclear; the suffering is not.",
    metaphor: "Sensitivity as gift and burden. The child who indexes what the system cannot face.",
    therapeuticUse: "Highly sensitive children, dissociative features in youth, family-system identification. Avoid pathologizing intuition.",
    weights: { psychoticism: 2.5, dissociation: 2.5, gad: 2.0, ace: 1.5 },
    traitTags: ["dissociation", "child", "sensitivity"],
    palette: { primary: "#2a2a3a", accent: "#a8b8d8" }
  },

  // ========= ADDICTION / CRAVING / RELAPSE =========
  {
    id: "the_cellar_drinker",
    name: "The Cellar Drinker",
    nameDisplay: "Don Birnam — The Cellar Drinker",
    inspiredBy: { primary: "Don Birnam", film: "The Lost Weekend (1945)", others: ["Steve Graham (Hereditary)", "Jack Torrance pre-Overlook (The Shining)", "Mark Petrie's father (Salem's Lot)"] },
    archetype: "Severe Alcohol Use Disorder / Hidden Drinking",
    profile: "Two selves — the one upstairs, the one downstairs. The bargain that the downstairs self stays contained. It never does.",
    metaphor: "Compartmentalized addiction. The progressive impossibility of containment.",
    therapeuticUse: "AUD in high-functioning patients, dual diagnosis, hidden-drinker family systems.",
    weights: { aud: 3.5, mdd: 1.8, ace: 1.5, fnc: 2.0 },
    traitTags: ["substance", "alcohol", "compartmentalization"],
    palette: { primary: "#2a1a0a", accent: "#a87040" }
  },
  {
    id: "the_chasing_thing",
    name: "The Chasing Thing",
    nameDisplay: "\"It\" (the entity) — The Chasing Thing",
    inspiredBy: { primary: "the entity (\"It\")", film: "It Follows (2014)", others: ["The Babadook", "the Smile entity (Smile, 2022)", "the slow walkers (Pulse, 2001)"] },
    archetype: "Stimulant Craving / Compulsive Use / Impulsivity",
    profile: "Always moving, never satisfied. Driven by something that promises relief and delivers escalation.",
    metaphor: "Craving made literal — the thing you cannot outrun because it lives inside.",
    therapeuticUse: "Stimulant use disorder, behavioral addictions, impulsive features in BPD/ASPD spectrum.",
    weights: { aud: 2.0, disinhibition: 3.0, antagonism: 1.5, adhd: 1.5 },
    traitTags: ["substance", "craving", "impulsivity"],
    palette: { primary: "#2a2a1a", accent: "#c8c870" }
  },

  // ========= ADHD / EXECUTIVE FUNCTION =========
  {
    id: "the_distracted_protagonist",
    name: "The Distracted Protagonist",
    nameDisplay: "Casey Becker — The Distracted Protagonist",
    inspiredBy: { primary: "Casey Becker", film: "Scream (1996)", others: ["Lila Crane (Psycho)", "Olivia (Truth or Dare)", "the Bly Manor children"] },
    archetype: "ADHD / Executive Dysfunction in Crisis",
    profile: "Loses the plot. Misses the warning. Notices the wrong thing. Energy and attention scattered while threat builds in the background.",
    metaphor: "The horror of executive dysfunction — the way we can fail to see what is in front of us.",
    therapeuticUse: "Adult ADHD, particularly in high-stakes contexts. Validates the experience of missing crucial cues.",
    weights: { adhd: 3.5, gad: 1.5, fnc: 1.8 },
    traitTags: ["adhd", "executive", "distraction"],
    palette: { primary: "#1a2a3a", accent: "#80b0d8" }
  },

  // ========= AUTISM / SENSORY / DIFFERENT-WIRING =========
  {
    id: "the_uncanny_outsider",
    name: "The Uncanny Outsider",
    nameDisplay: "Eli — The Uncanny Outsider",
    inspiredBy: { primary: "Eli", film: "Let the Right One In (2008)", others: ["May Canady (May, 2002)", "Lily (May)", "Carrie White's social isolation"] },
    archetype: "Autism / Different Cognitive Architecture",
    profile: "Reads the world by different rules. Misses social signals others find obvious. The perceived strangeness is mostly mismatch.",
    metaphor: "The horror genre's long obsession with 'the strange one' is often miscoded neurodivergence.",
    therapeuticUse: "Adult autism diagnosis, masking exhaustion, social-isolation correlates. Reframes 'uncanny' as mismatch, not pathology.",
    weights: { autism: 3.5, social_anx: 2.0, gad: 1.5 },
    traitTags: ["autism", "neurodivergent", "masking"],
    palette: { primary: "#2a3a4a", accent: "#80a8c0" }
  },

  // ========= EATING / BODY / SELF-DESTRUCTIVE =========
  {
    id: "the_perfectionist_dancer",
    name: "The Perfectionist Dancer",
    nameDisplay: "Nina Sayers — The Perfectionist Dancer",
    inspiredBy: { primary: "Nina Sayers", film: "Black Swan (2010)", others: ["Sarah (Suspiria 2018)", "Susie Bannion (Suspiria)"] },
    archetype: "Perfectionism / Eating-Disordered Cognitions / Splitting",
    profile: "Cannot integrate the wild and the controlled. The pursuit of perfection becomes a sustained act of self-erasure.",
    metaphor: "The cost of perfectionism. Splitting between idealized and 'shadow' self.",
    therapeuticUse: "Eating disorders, perfectionism, body dysmorphia, performance-based identity. Exploring integration of polarized selves.",
    weights: { mdd: 2.5, ocd: 2.0, gad: 2.5, dissociation: 1.5 },
    traitTags: ["perfectionism", "splitting", "eating"],
    palette: { primary: "#1a1a2a", accent: "#e8d8e8" }
  },

  // ========= MANIA / GRANDIOSITY / RECKLESSNESS =========
  {
    id: "the_unbound_artist",
    name: "The Unbound Artist",
    nameDisplay: "Pearl — The Unbound Artist",
    inspiredBy: { primary: "Pearl", film: "Pearl (2022) / X (2022)", others: ["Maxine Minx", "Adrian Veidt's grandiosity (Watchmen)"] },
    archetype: "Bipolar / Hypomanic / Grandiose Episode",
    profile: "Unsleeping. Brilliant. Spending. Building. Crashing in a way they can't yet see coming.",
    metaphor: "The terror and seduction of mania — what gets created at altitude, what falls apart on landing.",
    therapeuticUse: "Bipolar I/II psychoeducation, harm-reduction during prodromal phase, post-episode grief work.",
    weights: { bipolar: 3.5, disinhibition: 2.0, antagonism: 1.0 },
    traitTags: ["bipolar", "mania", "grandiosity"],
    palette: { primary: "#3a1a3a", accent: "#f8b860" }
  },

  // ========= EXISTENTIAL / NIHILISTIC / PURPOSELESS =========
  {
    id: "the_void_speaker",
    name: "The Void-Speaker",
    nameDisplay: "Pinhead — The Void-Speaker",
    inspiredBy: { primary: "Pinhead", film: "Hellraiser (1987)", others: ["the entity in Annihilation's Shimmer", "Lo Pan's nihilism"] },
    archetype: "Existential Crisis / Meaninglessness",
    profile: "Has seen behind the curtain and cannot un-see. The certainty that nothing matters — accompanied by a refusal to act on it.",
    metaphor: "Confrontation with meaninglessness. The point where nihilism could collapse into despair or catalyze freedom.",
    therapeuticUse: "Existential depression, post-disillusionment work, ACT/Optimistic Nihilism territory. Names the crisis without resolving it prematurely.",
    weights: { mdd: 2.5, gad: 1.5, fnc: 1.5 },
    traitTags: ["existential", "nihilism", "meaning"],
    palette: { primary: "#0a0a0a", accent: "#606060" }
  },
  {
    id: "the_eternal_returner",
    name: "The Eternal Returner",
    nameDisplay: "Jess Carter — The Eternal Returner",
    inspiredBy: { primary: "Jess Carter", film: "Triangle (2009)", others: ["Tree Gelbman (Happy Death Day)", "Sara (12 Monkeys)", "Cassie (Russian Doll, horror-adjacent)"] },
    archetype: "Repetition Compulsion / Stuck in Loop",
    profile: "Same patterns, same partners, same job, same fight. Knowing it doesn't break it. The compulsion to recreate the original wound.",
    metaphor: "The horror of insight without change. Repetition compulsion as fate-shaped.",
    therapeuticUse: "Therapy stuckness, repetition compulsion, dynamic patterns. Useful when insight has plateaued without behavioral change.",
    weights: { ace: 2.5, mdd: 2.0, bpd: 1.5, fnc: 2.0 },
    traitTags: ["repetition", "stuckness", "pattern"],
    palette: { primary: "#1a2a1a", accent: "#80a880" }
  },

  // ========= BODY HORROR / SOMATIC =========
  {
    id: "the_changing_body",
    name: "The Changing Body",
    nameDisplay: "Seth Brundle — The Changing Body",
    inspiredBy: { primary: "Seth Brundle", film: "The Fly (1986)", others: ["Kane (Alien chestburster aftermath)", "Tetsuo (Akira)"] },
    archetype: "Somatic Symptom / Health Anxiety / Body-Identity",
    profile: "Body experienced as unfamiliar, threatening, in revolt. Self located uneasily inside something that no longer feels like home.",
    metaphor: "Body horror as somatic anxiety, illness, transition, aging — the uncanny experience of one's own flesh.",
    therapeuticUse: "Somatic symptom disorder, illness anxiety, body dysmorphia, dissociation from body following trauma.",
    weights: { gad: 2.5, dissociation: 2.0, ocd: 1.5, mdd: 1.0 },
    traitTags: ["somatic", "body", "uncanny"],
    palette: { primary: "#2a1a1a", accent: "#c89090" }
  },

  // ========= COMPLEX / MIXED PRESENTATIONS =========
  {
    id: "the_orphan_seer",
    name: "The Orphan Seer",
    nameDisplay: "Carol Anne Freeling — The Orphan Seer",
    inspiredBy: { primary: "Carol Anne Freeling", film: "Poltergeist (1982)", others: ["Owen (Let the Right One In)", "the children in The Others"] },
    archetype: "Childhood Loss / Sensitive Witness / Quiet Resilience",
    profile: "A child carrying weight no child should carry. Seeing what others won't. Finding the path forward by attending to what others avoid.",
    metaphor: "Sensitivity born of early loss. The witness function as both burden and gift.",
    therapeuticUse: "Childhood bereavement, parentification, the quiet kid who's actually doing all the emotional labor.",
    weights: { ace: 2.5, gad: 2.0, mdd: 1.8, dissociation: 1.5 },
    traitTags: ["child", "loss", "witness", "resilience"],
    palette: { primary: "#1a2a3a", accent: "#a0c0d8" }
  },
  {
    id: "the_basement_dweller",
    name: "The Basement-Dweller",
    nameDisplay: "The Mother (Barbarian) — The Basement-Dweller",
    inspiredBy: { primary: "The Mother", film: "Barbarian (2022)", others: ["the blind man (Don't Breathe)", "Trelkovsky (The Tenant)", "the unseen tenants in Goodnight Mommy"] },
    archetype: "Severe Isolation / Schizoid / Withdrawn",
    profile: "Underground. Stopped trying. Built a life so small it cannot disappoint. Not depressed exactly — withdrawn from the field of contact.",
    metaphor: "The withdrawal that is neither depression nor anxiety, but a quiet refusal of the exchange.",
    therapeuticUse: "Schizoid features, severe avoidance, prolonged-isolation states. Distinguishes from depression and social anxiety.",
    weights: { social_anx: 2.5, mdd: 2.0, autism: 1.5, fnc: 2.5 },
    traitTags: ["isolation", "withdrawal", "schizoid"],
    palette: { primary: "#1a1a1a", accent: "#606070" }
  },
  {
    id: "the_mask_wearer",
    name: "The Mask-Wearer",
    nameDisplay: "Patrick Bateman — The Mask-Wearer",
    inspiredBy: { primary: "Patrick Bateman", film: "American Psycho (2000)", others: ["Jordan Belfort-style sociopath archetypes", "Joe Goldberg (You)"] },
    archetype: "Identity Disturbance / High-Functioning Mask",
    profile: "Polished surface, unknown interior. The mask has been on long enough that it's not clear what's underneath anymore.",
    metaphor: "The cost of sustained masking — autistic, traumatic, professional, gendered. The interior that has gone unmet.",
    therapeuticUse: "Late-discovered autism, complex trauma in high-functioning patients, professional burnout, identity-foreclosure.",
    weights: { autism: 2.0, dissociation: 2.0, mdd: 2.0, social_anx: 1.5, fnc: 1.8 },
    traitTags: ["masking", "identity", "high_functioning"],
    palette: { primary: "#2a2a2a", accent: "#c0c0c0" }
  },
  {
    id: "the_returning_revenant",
    name: "The Returning Revenant",
    nameDisplay: "Sadie Harper — The Returning Revenant",
    inspiredBy: { primary: "Sadie Harper", film: "The Boogeyman (2023)", others: ["Beverly Marsh (IT Chapter Two)", "Ellen Burstyn's character in Requiem for a Dream survival arc"] },
    archetype: "Suicide Attempt Survivor / Post-Crisis",
    profile: "Came back. Marked by it. Now occupying a strange interstitial — neither the person before nor the one who didn't return.",
    metaphor: "The aftermath of attempted suicide. The work of building a life on the other side of the line.",
    therapeuticUse: "Post-attempt clinical work, DBT for chronic SI, family work after attempt. Treated with extreme clinical care.",
    weights: { mdd: 3.0, bpd: 2.0, ace: 2.0, ptsd: 1.5 },
    traitTags: ["suicide", "post_crisis", "survival"],
    palette: { primary: "#1a1a3a", accent: "#a0a0e0" }
  },
  {
    id: "the_ferryman",
    name: "The Ferryman",
    nameDisplay: "Father Karras — The Ferryman",
    inspiredBy: { primary: "Father Karras", film: "The Exorcist (1973)", others: ["Father Merrin", "Lorraine Warren (The Conjuring films)", "Ed Warren"] },
    archetype: "Chronic Caregiving / Compassion Fatigue / Helper Identity",
    profile: "Carries others across. Has carried so many that the carrying is the identity. The fatigue is not visible; the toll is internal.",
    metaphor: "Helper-burnout. The clinician, the eldest daughter, the family's emotional infrastructure.",
    therapeuticUse: "Vicarious trauma, compassion fatigue, parentified eldest daughters, healthcare worker burnout.",
    weights: { mdd: 2.5, gad: 2.0, ptsd: 1.5, fnc: 2.0 },
    traitTags: ["caregiver", "burnout", "helper"],
    palette: { primary: "#2a3a3a", accent: "#a0c0c0" }
  },
  {
    id: "the_vanishing_partner",
    name: "The Vanishing Partner",
    nameDisplay: "Mike Enslin — The Vanishing Partner",
    inspiredBy: { primary: "Mike Enslin", film: "1408 (2007)", others: ["the husband in The Babadook", "Father Burke (Saint Maud)"] },
    archetype: "Avoidant Attachment / Emotional Withholding",
    profile: "Present-but-not. Loves at a distance. Withdraws under intimacy. Cannot say what they need because they cannot let themselves know.",
    metaphor: "Avoidant attachment as ghosting-from-within. The partner who is and isn't there.",
    therapeuticUse: "Avoidant attachment, emotionally focused therapy work, repair after withdrawal patterns.",
    weights: { social_anx: 1.5, mdd: 1.5, ace: 2.0, fnc: 1.5 },
    traitTags: ["attachment", "avoidant", "intimacy"],
    palette: { primary: "#3a3a3a", accent: "#909090" }
  },
  {
    id: "the_vengeful_returner",
    name: "The Vengeful Returner",
    nameDisplay: "Jennifer Hills — The Vengeful Returner",
    inspiredBy: { primary: "Jennifer Hills", film: "I Spit on Your Grave (1978)", others: ["Cassie Thomas (Promising Young Woman)", "Mama (Mama, 2013)", "Carrie White's prom"] },
    archetype: "Justice-Driven Anger / Post-Betrayal",
    profile: "Has been wronged. Knows it. Refuses to forgive prematurely. The anger is functional and accurate — and consuming.",
    metaphor: "Righteous anger that has nowhere productive to go. The cost of carrying justified rage.",
    therapeuticUse: "Post-betrayal trauma, moral injury, anger work that respects the validity while addressing the cost.",
    weights: { ptsd: 2.0, mdd: 1.8, antagonism: 2.0, ace: 1.5 },
    traitTags: ["anger", "betrayal", "justice"],
    palette: { primary: "#3a1a1a", accent: "#c84040" }
  },
  {
    id: "the_borrowed_face",
    name: "The Borrowed-Face",
    nameDisplay: "Red (the Tethered) — The Borrowed-Face",
    inspiredBy: { primary: "Red", film: "Us (2019)", others: ["MacReady's uncertainty (The Thing, 1982)", "Maud's identity drift (Saint Maud)", "the doppelgängers of Goodnight Mommy"] },
    archetype: "Imposter / Identity-Foreclosure",
    profile: "Wears the life that was supposed to be someone else's. Going through gestures that fit but don't feel chosen. The imposter feeling is partly accurate.",
    metaphor: "The horror of living a life you didn't author. Identity-foreclosure as quiet possession.",
    therapeuticUse: "Imposter phenomenon, identity foreclosure, mid-life or late-30s reckoning, post-pandemic 're-evaluation' work.",
    weights: { mdd: 2.0, gad: 1.5, dissociation: 1.5, fnc: 2.0 },
    traitTags: ["identity", "imposter", "foreclosure"],
    palette: { primary: "#2a2a3a", accent: "#a0a0c0" }
  },
  {
    id: "the_bargained_self",
    name: "The Bargained Self",
    nameDisplay: "Dr. Henry Jekyll — The Bargained Self",
    inspiredBy: { primary: "Dr. Henry Jekyll", film: "Dr. Jekyll and Mr. Hyde (1931 / 1941 / various adaptations)", others: ["Larry Talbot (The Wolf Man)", "Seth Brundle's hubris (The Fly)", "Faust"] },
    archetype: "Self-Betrayal / Ambition Cost",
    profile: "Made a deal years ago — career, status, security, in exchange for some part of the original self. The thing traded is starting to make itself known.",
    metaphor: "Faustian self-betrayal. The thing buried that begins to scratch.",
    therapeuticUse: "Mid-career existential crisis, value-incongruence work in ACT, post-success depression.",
    weights: { mdd: 2.5, gad: 1.5, fnc: 2.0 },
    traitTags: ["self_betrayal", "ambition", "values"],
    palette: { primary: "#2a1a2a", accent: "#a060a0" }
  },
  {
    id: "the_captive_self",
    name: "The Captive Self",
    nameDisplay: "Cecilia Kass — The Captive Self",
    inspiredBy: { primary: "Cecilia Kass", film: "The Invisible Man (2020)", others: ["Michelle (10 Cloverfield Lane)", "Joy Newsome (Room)", "Sara (Hush)"] },
    archetype: "Coercive Control Survivor",
    profile: "Lives inside someone else's reality. Cannot trust own perception. Has organized survival around the captor's moods.",
    metaphor: "Coercive control as captivity, even without physical bars. The slow erosion of self under sustained dominance.",
    therapeuticUse: "Coercive-control survivors, post-cult, narcissistic-abuse aftermath, abusive-relationship recovery.",
    weights: { ptsd: 3.0, mdd: 2.5, gad: 2.0, ace: 1.8, dissociation: 1.5 },
    traitTags: ["coercion", "captivity", "abuse"],
    palette: { primary: "#3a2a1a", accent: "#a87858" }
  },
  {
    id: "the_curious_investigator",
    name: "The Curious Investigator",
    nameDisplay: "Clarice Starling — The Curious Investigator",
    inspiredBy: { primary: "Clarice Starling", film: "The Silence of the Lambs (1991)", others: ["Beverly Marsh as adult investigator (IT Chapter Two)", "Mulder/Scully as horror-tropes"] },
    archetype: "Resilient Inquirer / Securely-Attached Witness",
    profile: "Walks toward what is frightening rather than away. Curiosity larger than fear. Anchored enough to look closely without losing self.",
    metaphor: "Healthy curiosity in proximity to horror. The witness function fully integrated.",
    therapeuticUse: "Strengths-based formulation. The presentation in someone whose distress is contextual rather than chronic; protective factor archetype.",
    weights: { gad: 1.0, mdd: 0.5, fnc: 0.5 },
    traitTags: ["resilience", "curiosity", "witness"],
    palette: { primary: "#2a3a2a", accent: "#c0d8a0" }
  },

  // ========= EATING DISORDER ARCHETYPES =========
  {
    id: "the_perfectionist_swan",
    name: "The Perfectionist Swan",
    nameDisplay: "Suzy Bannion — The Perfectionist Swan",
    inspiredBy: { primary: "Suzy Bannion", film: "Suspiria (1977 / 2018)", others: ["Sara Goldfarb (Requiem for a Dream)", "Sara Cassidy (To the Bone)"] },
    archetype: "Anorexia Nervosa with Perfectionism",
    profile: "Control over the body as the last possible refuge. The discipline that began as virtue and became cage.",
    metaphor: "The dance studio mirror. The way starvation can feel like clarity. The body as the one thing left that obeys.",
    therapeuticUse: "Restrictive eating disorders, particularly anorexia nervosa with perfectionistic features. Useful for psychoeducation about how control becomes pathology.",
    weights: { eating: 3.5, gad: 1.5, ocd: 1.0, mdd: 1.0 },
    traitTags: ["restriction", "perfectionism", "control", "body_image"],
    palette: { primary: "#2a1a2a", accent: "#e8d8e8" }
  },
  {
    id: "the_starving_addict",
    name: "The Starving Addict",
    nameDisplay: "Sara Goldfarb — The Starving Addict",
    inspiredBy: { primary: "Sara Goldfarb", film: "Requiem for a Dream (2000)", others: ["Lily (Black Swan)", "Mia (To the Bone)"] },
    archetype: "Restrictive Eating + Stimulant Use",
    profile: "Body and chemistry both weaponized in pursuit of a vanished version of self. Dignity bartered for an image.",
    metaphor: "The red dress. The diet pills. The slow disappearance of what was actually loved.",
    therapeuticUse: "Co-occurring eating disorder + stimulant misuse. Vivid example of how appearance-driven goals can drive multiple disorders.",
    weights: { eating: 3.0, sud: 2.5, mdd: 2.0, gad: 1.0 },
    traitTags: ["restriction", "stimulants", "body_image", "isolation"],
    palette: { primary: "#3a1a1a", accent: "#c87878" }
  },
  {
    id: "the_binge_keeper",
    name: "The Binge-Keeper",
    nameDisplay: "Stevie — The Binge-Keeper",
    inspiredBy: { primary: "the binge-shame archetype", film: "Cam (2018) / Possessor (2020)", others: ["Hilary (Hilary, 2024)", "Pippa (Pearl, 2022)"] },
    archetype: "Binge-Eating Disorder with Shame",
    profile: "The secret kitchen at 2am. The bodily self treated as the storage of unprocessed feeling. The shame that doubles back on itself.",
    metaphor: "The locked door, the empty wrappers, the ritual silence afterward. Eating as containment of feeling that has no other place to go.",
    therapeuticUse: "Binge-eating disorder, especially with shame-based reinforcement. Body-as-vault metaphor.",
    weights: { eating: 3.0, mdd: 2.0, gad: 1.5 },
    traitTags: ["binge", "shame", "secrecy", "emotional_eating"],
    palette: { primary: "#2a1a1a", accent: "#a0786a" }
  },

  // ========= DRUG USE DISORDER ARCHETYPES =========
  {
    id: "the_chasing_addict",
    name: "The Chasing Addict",
    nameDisplay: "Harry Goldfarb — The Chasing Addict",
    inspiredBy: { primary: "Harry Goldfarb", film: "Requiem for a Dream (2000)", others: ["Renton (Trainspotting)", "Mark (Trainspotting)", "Tyler (Fight Club, with caveats)"] },
    archetype: "Opioid / Stimulant Use Disorder",
    profile: "The hit that got you out of where you came from. The progressive narrowing — eventually only the drug, only the chase, only the next.",
    metaphor: "The arm sequence. The bridges burned in slow motion. The way the body itself becomes the territory of the addiction.",
    therapeuticUse: "Severe SUD, particularly opioid or stimulant. Useful for harm reduction and stages-of-change work.",
    weights: { sud: 3.5, mdd: 2.0, antisocial: 1.0, ace: 1.0 },
    traitTags: ["drugs", "compulsion", "consequences", "decline"],
    palette: { primary: "#1a2a1a", accent: "#a8a868" }
  },
  {
    id: "the_high_functioner",
    name: "The High-Functioner",
    nameDisplay: "Patrick Bateman (substance variant) — The High-Functioner",
    inspiredBy: { primary: "the high-functioning user archetype", film: "American Psycho (2000) / Spree (2020)", others: ["Wall Street's Bud Fox (horror-adjacent)", "Henry from Henry: Portrait of a Serial Killer"] },
    archetype: "Polysubstance Use with Social Concealment",
    profile: "Performance unaffected. Career intact. Life concealed. The substance use is the second life — and the one that runs the show.",
    metaphor: "The pristine apartment. The locked desk drawer. The disconnect between public function and private chemistry.",
    therapeuticUse: "Hidden / functional substance use disorder. Common presentation in professionals, useful for normalizing help-seeking.",
    weights: { sud: 2.5, antagonism: 1.5, disinhibition: 1.5, antisocial: 1.5 },
    traitTags: ["concealment", "polysubstance", "high_function", "compartmentalize"],
    palette: { primary: "#2a2a2a", accent: "#a0a0a0" }
  },

  // ========= INSOMNIA ARCHETYPES =========
  {
    id: "the_sleepless_writer",
    name: "The Sleepless Writer",
    nameDisplay: "Mike Enslin (insomnia variant) — The Sleepless Writer",
    inspiredBy: { primary: "Mike Enslin", film: "1408 (2007)", others: ["Trelkovsky (The Tenant)", "Reggie (Phantasm)", "Dom Cobb (Inception)"] },
    archetype: "Chronic Insomnia with Hyperarousal",
    profile: "The mind that won't close. 3am every night, forever. Reality slowly getting glassy, time getting strange.",
    metaphor: "The hotel room of the self that won't release. The slow erosion of the line between waking and dreaming.",
    therapeuticUse: "Chronic insomnia, particularly with hyperarousal and trauma history. CBT-I educational metaphor.",
    weights: { insomnia: 3.5, gad: 2.0, ptsd: 1.0, mdd: 1.0 },
    traitTags: ["insomnia", "hyperarousal", "rumination", "isolation"],
    palette: { primary: "#1a1a2a", accent: "#a0a8c0" }
  },
  {
    id: "the_dreamless",
    name: "The Dreamless",
    nameDisplay: "Nancy Thompson — The Dreamless",
    inspiredBy: { primary: "Nancy Thompson", film: "A Nightmare on Elm Street (1984)", others: ["the Sleepwalker archetype", "characters in The Machinist"] },
    archetype: "Trauma-Driven Insomnia",
    profile: "Sleep is the territory of the threat. So sleep gets refused. So everything else slowly comes apart.",
    metaphor: "The coffee pot. The pinned-open eyes. The fear that closing them is when something gets in.",
    therapeuticUse: "Insomnia secondary to PTSD. Useful for explaining the sleep-trauma feedback loop.",
    weights: { insomnia: 3.0, ptsd: 2.5, gad: 1.5 },
    traitTags: ["insomnia", "trauma", "vigilance", "nightmares"],
    palette: { primary: "#1a1a1a", accent: "#a8a8a8" }
  },

  // ========= SCHIZOTYPAL / UNUSUAL EXPERIENCES =========
  {
    id: "the_unusual_seer",
    name: "The Unusual Seer",
    nameDisplay: "Annie Graham — The Unusual Seer",
    inspiredBy: { primary: "Annie Graham", film: "Hereditary (2018)", others: ["Lin Shaye's Elise (Insidious)", "Theresa (The Conjuring)"] },
    archetype: "Schizotypal Features with Genuine Phenomena",
    profile: "Sees what others don't. The tension between is-this-real and is-this-me. Family history complicates everything.",
    metaphor: "The miniature dollhouse. The séance. The way some perceptions feel both true and impossible.",
    therapeuticUse: "Schizotypal features, magical thinking, perceptual oddities. The diagnostic challenge of belief vs. delusion.",
    weights: { schizotypal: 3.0, dissociation: 1.5, ptsd: 1.0, psychoticism: 2.0 },
    traitTags: ["magical_thinking", "perception", "uncanny", "family_hx"],
    palette: { primary: "#1a1a2a", accent: "#9090b0" }
  },
  {
    id: "the_eccentric_outsider",
    name: "The Eccentric Outsider",
    nameDisplay: "Renfield — The Eccentric Outsider",
    inspiredBy: { primary: "R.M. Renfield", film: "Dracula (various)", others: ["the protagonist of The Tenant", "characters in The Lighthouse"] },
    archetype: "Schizotypal Personality with Social Withdrawal",
    profile: "Lives at a slight angle to the world. Friendships rare; the inner life rich and strange. Dismissed as 'odd,' rarely understood.",
    metaphor: "The mumbled monologue, the collected oddities, the room full of strange precisions.",
    therapeuticUse: "Classic STPD presentation — eccentric beliefs without psychosis, social isolation, restricted affect.",
    weights: { schizotypal: 3.5, social_anx: 2.0, autism: 1.0 },
    traitTags: ["eccentric", "isolation", "magical_thinking", "social_withdrawal"],
    palette: { primary: "#1a1a1a", accent: "#a0a0c0" }
  },
  {
    id: "the_paranoid_seer",
    name: "The Paranoid Seer",
    nameDisplay: "Trelkovsky — The Paranoid Seer",
    inspiredBy: { primary: "Trelkovsky", film: "The Tenant (1976)", others: ["Carol Ledoux (Repulsion)", "Roman Polanski's troubled men"] },
    archetype: "Paranoid Schizotypal / Persecutory Ideation",
    profile: "The neighbors are watching. The walls remember. The slow narrowing as suspicion becomes the world.",
    metaphor: "The apartment as enemy territory. The mirrored windows. The conviction that meaning is being broadcast at you.",
    therapeuticUse: "Paranoid schizotypal features and prodromal-psychosis-adjacent presentations. Differentials with PTSD and prodromal psychosis.",
    weights: { schizotypal: 3.0, gad: 2.0, ptsd: 1.0, psychoticism: 2.0 },
    traitTags: ["paranoia", "ideas_reference", "isolation", "magical_thinking"],
    palette: { primary: "#1a1a1a", accent: "#7878a0" }
  },

  // ========= SOMATIC SYMPTOM ARCHETYPES =========
  {
    id: "the_body_horror",
    name: "The Body Horror",
    nameDisplay: "Maud — The Body Horror",
    inspiredBy: { primary: "Maud Carver", film: "Saint Maud (2019)", others: ["Beverly (Dead Ringers)", "Veronica Quaife (The Fly)"] },
    archetype: "Somatic Symptom Disorder + Religious Preoccupation",
    profile: "The body becomes the message. Pain as meaning. The turning-inward that becomes obsession with bodily signs.",
    metaphor: "The stigmata, the burnt skin, the conviction that the body is broadcasting a sacred or terrible truth.",
    therapeuticUse: "Somatic symptom disorder with religious or magical-thinking overlay. Differential from genuine medical illness.",
    weights: { somatic: 3.0, ocd: 2.0, schizotypal: 1.5, mdd: 1.5 },
    traitTags: ["somatic", "religious", "preoccupation", "isolation"],
    palette: { primary: "#2a1a1a", accent: "#c8a0a0" }
  },
  {
    id: "the_unwell_caretaker",
    name: "The Unwell Caretaker",
    nameDisplay: "the chronic-illness caretaker — The Unwell Caretaker",
    inspiredBy: { primary: "Misery's Annie (somatic frame)", film: "Misery (1990) / Run (2020)", others: ["Diane (Run)", "Mrs. Voorhees (Friday the 13th, somatic-displacement frame)"] },
    archetype: "Chronic Illness + Anxiety Amplification",
    profile: "Every twinge a threat. Every test result the start of a bigger story. Real symptoms, real distress, magnified by anxious vigilance.",
    metaphor: "The pill bottles, the medical files, the ER as second home. The body as the thing that cannot be trusted.",
    therapeuticUse: "Somatic symptom disorder with health anxiety. Useful for anxiety-amplification psychoeducation.",
    weights: { somatic: 2.5, gad: 2.5, mdd: 1.0 },
    traitTags: ["somatic", "health_anxiety", "vigilance", "medicalization"],
    palette: { primary: "#1a2a2a", accent: "#a8c0c0" }
  },

  // ========= ADDITIONAL RICH COVERAGE =========

  // Major depression — additional flavor: melancholic
  {
    id: "the_melancholic_widow",
    name: "The Melancholic Widow",
    nameDisplay: "Eleanor — The Melancholic Widow",
    inspiredBy: { primary: "Eleanor Vance (depression variant)", film: "The Haunting of Hill House (2018)", others: ["Lydia Deetz (Beetlejuice, with caveats)", "Karen Cooper-as-mother in NoTLD"] },
    archetype: "Melancholic Depression with Loss",
    profile: "The slow gravity. The way grief becomes architecture. The world muted on every channel.",
    metaphor: "The dark hallway you can't stop walking down. The relationships you no longer reach for.",
    therapeuticUse: "Melancholic-feature MDD with prominent anhedonia and psychomotor slowing.",
    weights: { mdd: 3.0, gad: 1.0, ace: 1.0 },
    traitTags: ["depression", "melancholic", "grief", "anhedonia"],
    palette: { primary: "#1a2a3a", accent: "#909fb0" }
  },

  // Major depression — atypical
  {
    id: "the_hidden_depressive",
    name: "The Hidden Depressive",
    nameDisplay: "Father Karras (depression variant) — The Hidden Depressive",
    inspiredBy: { primary: "Damien Karras", film: "The Exorcist (1973)", others: ["the priests in Calvary", "Reverend Toller (First Reformed)"] },
    archetype: "Smiling / Concealed Depression",
    profile: "Functional from the outside. Catastrophic from the inside. The shame loop that says 'others have it worse.'",
    metaphor: "The collar buttoned. The duties carried out. The collapse that nobody saw coming.",
    therapeuticUse: "High-functioning concealed depression — common in professionals, caregivers, helpers.",
    weights: { mdd: 3.0, gad: 1.5, fnc: -0.5 },
    traitTags: ["depression", "concealed", "high_function", "shame"],
    palette: { primary: "#1a1a2a", accent: "#7868a0" }
  },

  // Bipolar — manic flavor
  {
    id: "the_unsleeping_genius",
    name: "The Unsleeping Genius",
    nameDisplay: "Jack Torrance (manic variant) — The Unsleeping Genius",
    inspiredBy: { primary: "Jack Torrance (manic phase)", film: "The Shining (1980)", others: ["Pearl (Pearl, 2022)", "Cal (Beau is Afraid)"] },
    archetype: "Bipolar I Mania with Creative Grandiosity",
    profile: "Days awake and incandescent. Convinced this is the work that changes everything. The crash that nobody can yet see.",
    metaphor: "The typewriter keys at 4am. The grandiosity that feels like clarity. The inevitable downturn.",
    therapeuticUse: "Bipolar I mania, creative-grandiosity flavor. Useful for psychoeducation about elevated states.",
    weights: { bipolar: 3.5, disinhibition: 1.5, antagonism: 1.0 },
    traitTags: ["mania", "grandiosity", "insomnia", "creativity"],
    palette: { primary: "#3a1a1a", accent: "#f8b860" }
  },

  // Trauma — complex/relational
  {
    id: "the_relational_survivor",
    name: "The Relational Survivor",
    nameDisplay: "Rosemary Woodhouse (post-trauma variant) — The Relational Survivor",
    inspiredBy: { primary: "Rosemary Woodhouse (after)", film: "Rosemary's Baby (1968)", others: ["Cassie (Promising Young Woman)", "Cecilia (The Invisible Man)"] },
    archetype: "Complex PTSD from Relational Betrayal",
    profile: "The trauma was not a single event but a relationship. Trust calibrated by experience: dangerous people teach you to scan everyone.",
    metaphor: "The friends who were in on it. The home that became a stage. The slow rebuilding of a self that learns when to trust.",
    therapeuticUse: "Complex PTSD from relational/institutional betrayal. Useful for trust-rebuilding work.",
    weights: { ptsd: 3.0, bpd: 1.5, mdd: 1.5, gad: 1.5 },
    traitTags: ["trauma", "relational", "betrayal", "trust"],
    palette: { primary: "#2a1a2a", accent: "#c0a0c0" }
  },

  // Anxiety — panic specifically
  {
    id: "the_panicker",
    name: "The Panicker",
    nameDisplay: "Marion Crane — The Panicker",
    inspiredBy: { primary: "Marion Crane", film: "Psycho (1960)", others: ["the running protagonist in Run Lola Run (anxious variant)", "Will Graham (Hannibal)"] },
    archetype: "Panic Disorder with Catastrophic Cognition",
    profile: "The body sounds the alarm before the mind has decided there's danger. Each panic teaches the mind to fear the next.",
    metaphor: "The shower scene as inner experience — sudden, total, the body registering catastrophe before the world has caught up.",
    therapeuticUse: "Panic disorder, particularly with catastrophic cognitions and avoidance. Cognitive-restructuring metaphor.",
    weights: { gad: 3.0, somatic: 1.5 },
    traitTags: ["panic", "catastrophic", "somatic", "avoidance"],
    palette: { primary: "#2a1a1a", accent: "#d8a0a0" }
  },

  // OCD — contamination flavor
  {
    id: "the_clean_haunted",
    name: "The Clean-Haunted",
    nameDisplay: "the contamination-OCD archetype — The Clean-Haunted",
    inspiredBy: { primary: "the cleaning-ritual archetype", film: "Take Shelter (2011) / Aftermath films", others: ["Howard Hughes-as-horror", "characters in OCD-coded films like The Aviator"] },
    archetype: "Contamination OCD",
    profile: "The hands that won't stop. The contamination that spreads through the imagined. The shame of knowing the rituals don't make sense.",
    metaphor: "The hand-washing ritual that grows from minutes to hours. The bleach. The avoided surfaces.",
    therapeuticUse: "Classic contamination/cleaning OCD. ERP-relevant metaphor.",
    weights: { ocd: 3.5, gad: 1.5 },
    traitTags: ["ocd", "contamination", "rituals", "shame"],
    palette: { primary: "#2a3a3a", accent: "#a0c0c0" }
  },

  // BPD — quiet variant
  {
    id: "the_quiet_borderline",
    name: "The Quiet Borderline",
    nameDisplay: "May — The Quiet Borderline",
    inspiredBy: { primary: "May Canady", film: "May (2002)", others: ["Justine (Raw, 2016)", "Lily (May)"] },
    archetype: "BPD with Internalized Splitting",
    profile: "The storms turn inward. Idealization and devaluation happen toward the self, not toward others. The doll that was supposed to be a friend.",
    metaphor: "The collected parts. The friend stitched together from pieces. The way longing for connection becomes self-undoing.",
    therapeuticUse: "Quiet/internalizing BPD presentation — often missed because the chaos is internal rather than relational.",
    weights: { bpd: 3.0, mdd: 2.0, ace: 1.5 },
    traitTags: ["bpd", "internalizing", "isolation", "self_directed"],
    palette: { primary: "#2a1a2a", accent: "#a0a0c0" }
  },

  // Psychotic decompensation
  {
    id: "the_decompensating",
    name: "The Decompensating",
    nameDisplay: "Carol Ledoux — The Decompensating",
    inspiredBy: { primary: "Carol Ledoux", film: "Repulsion (1965)", others: ["the late-stage Eleanor (Hill House)", "characters in Possessor"] },
    archetype: "Acute Psychotic Decompensation",
    profile: "The world's reality fading at the edges. The walls beginning to behave wrongly. The progression that often goes unnoticed by those nearby.",
    metaphor: "The cracking walls, the hands from the wallpaper, the dissolving distinction between perception and projection.",
    therapeuticUse: "Acute psychotic break and emerging schizophrenia. Important for early-intervention psychoeducation.",
    weights: { psychoticism: 3.5, schizotypal: 2.5, dissociation: 1.5 },
    traitTags: ["psychosis", "decompensation", "isolation", "perceptual"],
    palette: { primary: "#1a1a1a", accent: "#a0a0a0" }
  },

  // Adjustment / acute stress
  {
    id: "the_acutely_overwhelmed",
    name: "The Acutely Overwhelmed",
    nameDisplay: "Wendy Torrance — The Acutely Overwhelmed",
    inspiredBy: { primary: "Wendy Torrance", film: "The Shining (1980)", others: ["Ellen Ripley (between events, Aliens)", "the mother in Babadook before transformation"] },
    archetype: "Acute Stress Reaction / Adjustment Disorder",
    profile: "Coping intact until it isn't. The line between 'managing' and 'unraveling' suddenly visible. Resources available but the load has exceeded them.",
    metaphor: "The bat in the hand. The phone that won't connect. The recognition that the trusted person has become the threat.",
    therapeuticUse: "Adjustment disorder, acute stress reaction, situational crisis. Useful for normalizing acute decompensation under impossible circumstances.",
    weights: { gad: 2.5, mdd: 1.5, ptsd: 1.0, fnc: 1.5 },
    traitTags: ["acute_stress", "overwhelm", "situational", "coping"],
    palette: { primary: "#1a1a2a", accent: "#a0a0c0" }
  },

  // Cluster A — paranoid PD
  {
    id: "the_paranoid_patriarch",
    name: "The Paranoid Patriarch",
    nameDisplay: "the patriarch under threat — The Paranoid Patriarch",
    inspiredBy: { primary: "Curtis (Take Shelter)", film: "Take Shelter (2011)", others: ["Roy Neary (Close Encounters, horror-adjacent paranoid)", "the father in Hereditary"] },
    archetype: "Paranoid Personality / Pre-Psychotic Apprehension",
    profile: "Convinced the storm is coming, even when no one else can see the clouds. Family destabilized by his certainty. The line between prepared and ill is thin.",
    metaphor: "The bunker dug too deep. The repeated warnings. The look on the face of the family member who can't tell anymore which version of him is true.",
    therapeuticUse: "Paranoid PD or prodromal psychosis. Differential challenge — when does conviction become illness?",
    weights: { schizotypal: 2.5, psychoticism: 2.0, gad: 2.0, antagonism: 1.0 },
    traitTags: ["paranoia", "prodromal", "magical_thinking", "isolation"],
    palette: { primary: "#1a2a1a", accent: "#a0c0a0" }
  },

  // Avoidant attachment / dependent
  {
    id: "the_dependent_clinger",
    name: "The Dependent Clinger",
    nameDisplay: "Carol Anne (clinger variant) — The Dependent Clinger",
    inspiredBy: { primary: "the over-attached protagonist", film: "Single White Female (1992) / Misery (1990)", others: ["Hedra Carlson (Single White Female)", "Mary Bell-coded archetypes"] },
    archetype: "Dependent Personality / Anxious Attachment",
    profile: "Cannot bear separation. Seeks the kind of fusion that obliterates the other person. Love as desperation rather than choice.",
    metaphor: "The shaped-into-you. The matched outfit. The slow erosion of the friend who was supposed to be admired.",
    therapeuticUse: "Dependent PD and anxious attachment styles. Differential from BPD — dependent lacks the volatility.",
    weights: { bpd: 1.5, gad: 2.0, mdd: 2.0 },
    traitTags: ["dependent", "fusion", "anxious_attachment", "abandonment"],
    palette: { primary: "#2a1a2a", accent: "#c8a0c0" }
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CHARACTERS };
}
