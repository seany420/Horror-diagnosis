/* ============================================================
   SCREAM PROFILE — FUN ENGINE
   ============================================================
   A separate trait-based assessment that matches users to horror
   characters via 15 trait axes (NOT clinical signals). Designed
   to be fun, scenario-driven, and produce a different kind of
   match than the clinical engine. Comparison view juxtaposes
   the two so users can see who they ARE (traits) vs. what they
   ARE GOING THROUGH (clinical).
   ============================================================ */

/* ============================================================
   SECTION 1 — TRAIT AXES (15)
   ============================================================
   Each axis is bipolar with values from -100 (left pole) to +100
   (right pole). Zero is "neither — balanced." Both poles are
   non-pathological character dispositions.
   ============================================================ */

const TRAIT_AXES = [
  // ===== A. BEHAVIORAL DISPOSITION =====
  { id: "vigilance",  family: "Behavioral",  poleLow: "Trust",       poleHigh: "Vigilance",
    descLow: "Assumes safety, takes the world at face value, easy in unfamiliar rooms",
    descHigh: "Scans for threat constantly, notices what others miss, sleeps lightly" },
  { id: "solitary",   family: "Behavioral",  poleLow: "Communal",    poleHigh: "Solitary",
    descLow: "Energized by people, finds aloneness draining, needs connection to thrive",
    descHigh: "Energized by being alone, finds groups draining, needs solitude to think" },
  { id: "restraint",  family: "Behavioral",  poleLow: "Release",     poleHigh: "Restraint",
    descLow: "Lets feelings move through visibly — laughs loud, cries openly, doesn't hide",
    descHigh: "Holds emotion close, processes internally, only the surface shows" },
  { id: "order",      family: "Behavioral",  poleLow: "Chaos",       poleHigh: "Order",
    descLow: "Comfortable with mess, improvises, moves with whatever's happening",
    descHigh: "Builds structure, makes lists, finds peace in things being in their place" },
  { id: "curiosity",  family: "Behavioral",  poleLow: "Avoidance",   poleHigh: "Curiosity",
    descLow: "Stays clear of the unknown, lets sleeping dogs lie, doesn't open the basement door",
    descHigh: "Pulled toward mysteries, opens the door, reads the cursed book to know why" },

  // ===== B. RELATIONAL STYLE =====
  { id: "compassion", family: "Relational",  poleLow: "Predation",   poleHigh: "Compassion",
    descLow: "Sees others as obstacles, resources, or prey — not as people with inner lives",
    descHigh: "Naturally tracks others' emotional states, moves to ease suffering" },
  { id: "loyalty",    family: "Relational",  poleLow: "Independent", poleHigh: "Loyal",
    descLow: "Self-sufficient, comes and goes freely, doesn't owe anyone anything",
    descHigh: "Bonded deeply, shows up when it's hard, would burn the world for the people" },
  { id: "trusting",   family: "Relational",  poleLow: "Suspicious",  poleHigh: "Trusting",
    descLow: "Reads between the lines, expects hidden motives, knows the smile is the lie",
    descHigh: "Takes people at their word, gives benefit of the doubt, surprised by deceit" },
  { id: "caregiving", family: "Relational",  poleLow: "Self-Focused", poleHigh: "Caregiving",
    descLow: "Tends own needs first, knows the oxygen-mask rule, doesn't auto-rescue",
    descHigh: "Tends to others before self, often can't sit with someone in pain without acting" },
  { id: "forthright", family: "Relational",  poleLow: "Concealing",  poleHigh: "Forthright",
    descLow: "Keeps the inside hidden, lives behind the mask, shows only what serves",
    descHigh: "Says what's true even when costly, transparent to the bone, hard to read only because it's all there" },

  // ===== C. INNER ARCHITECTURE =====
  { id: "stability",  family: "Inner",       poleLow: "Volatile",    poleHigh: "Stable",
    descLow: "Storms move through fast, intensity is the baseline, never the same weather twice",
    descHigh: "Steady through everything, the hand on the wheel, the lighthouse" },
  { id: "uncanny",    family: "Inner",       poleLow: "Mundane",     poleHigh: "Uncanny",
    descLow: "Grounded in the literal world, finds the everyday sufficient",
    descHigh: "Senses what others miss — the thinness in some rooms, the watching from corners" },
  { id: "selfblame",  family: "Inner",       poleLow: "Other-Blame", poleHigh: "Self-Blame",
    descLow: "When things go wrong, looks outward — what they did, what the world handed",
    descHigh: "When things go wrong, looks inward — what you should have seen, what you should have been" },
  { id: "hope",       family: "Inner",       poleLow: "Doom",        poleHigh: "Hope",
    descLow: "Knows how things end, walks toward it without flinching, the planet is dying anyway",
    descHigh: "Carries forward expectation, believes the next room could be different, keeps trying" },
  { id: "embodied",   family: "Inner",       poleLow: "Dissociated", poleHigh: "Embodied",
    descLow: "Watches own life from a slight distance, observes the body more than inhabits it",
    descHigh: "Feels everything in the body, present in the meal, the run, the touch" }
];

const AXIS_BY_ID = {};
TRAIT_AXES.forEach(a => { AXIS_BY_ID[a.id] = a; });

/* ============================================================
   SECTION 2 — SCENARIO ITEMS (35)
   ============================================================
   Each scenario draws from canonical horror cinema. Each option
   is keyed to multiple trait axes via {axisId: weight} where
   weight is -3 to +3. The scoring sums weights across all
   answered items to produce final 15-axis user coordinates.
   ============================================================ */

const FUN_SCENARIOS = [
  // 1 — The Babadook
  { id: "fun_1", film: "The Babadook (2014)",
    setup: "Late at night. Something heavy is in the house with you — grief, dread, the thing in the book. You can't make it leave. Mister Babadook isn't going anywhere.",
    prompt: "What you actually do:",
    options: [
      { id: "a", label: "Lock myself in the bedroom and pretend I can't hear it. Eventually exhaustion wins.",
        weights: { curiosity: -2, embodied: -2, restraint: 1, hope: -1 } },
      { id: "b", label: "Confront it directly. Yell at it. Say its name out loud.",
        weights: { restraint: -3, embodied: 2, forthright: 2, hope: 1 } },
      { id: "c", label: "Try to rationalize what's happening. There must be a logical explanation.",
        weights: { curiosity: 2, restraint: 2, uncanny: -1, order: 1 } },
      { id: "d", label: "Make tea. Pretend it's any other Tuesday. Routine carries you through.",
        weights: { restraint: 3, embodied: -1, order: 2, forthright: -2 } }
    ]
  },

  // 2 — The Shining
  { id: "fun_2", film: "The Shining (1980)",
    setup: "Your partner has been writing in the same room for six weeks. They've started talking to themselves. Today they looked through you when you brought their coffee.",
    prompt: "Your instinct:",
    options: [
      { id: "a", label: "Pack a bag for me and the kid. We can talk about what's happening from somewhere safe.",
        weights: { vigilance: 3, caregiving: 2, embodied: 2, trusting: -2 } },
      { id: "b", label: "Sit down with them. Ask what's happening. Maybe they need help, not distance.",
        weights: { compassion: 3, trusting: 2, loyalty: 2, vigilance: -1 } },
      { id: "c", label: "Watch and wait. Don't react. Information first; decisions later.",
        weights: { restraint: 3, vigilance: 2, forthright: -1 } },
      { id: "d", label: "I would have noticed weeks ago. I'd have been gone after the first strange look.",
        weights: { vigilance: 3, loyalty: -2, solitary: 2, trusting: -3 } }
    ]
  },

  // 3 — The Ring
  { id: "fun_3", film: "The Ring (2002)",
    setup: "You watched the cursed tape. The phone rang. Seven days.",
    prompt: "Your week:",
    options: [
      { id: "a", label: "Investigate. Find the source. Break the curse before time runs out.",
        weights: { curiosity: 3, hope: 2, embodied: 2, order: 1 } },
      { id: "b", label: "Get my affairs in order. Write the letters. Leave nothing unsaid.",
        weights: { hope: -3, restraint: 1, forthright: 2, order: 2 } },
      { id: "c", label: "Tell no one. Pretend I never watched it. Maybe it isn't real.",
        weights: { curiosity: -3, forthright: -3, embodied: -2, uncanny: -1 } },
      { id: "d", label: "Show it to someone I trust. Two heads are better than one.",
        weights: { solitary: -3, loyalty: 2, trusting: 2, compassion: -1 } }
    ]
  },

  // 4 — Hereditary
  { id: "fun_4", film: "Hereditary (2018)",
    setup: "Your family has been hiding something for generations. Old letters in the attic suggest the story you grew up with isn't the real one.",
    prompt: "You:",
    options: [
      { id: "a", label: "Read every letter. Map the family tree. Even if it changes everything.",
        weights: { curiosity: 3, order: 2, hope: -1, restraint: -1 } },
      { id: "b", label: "Burn them. The past doesn't get to author the future.",
        weights: { curiosity: -2, embodied: 2, hope: 2, order: -1 } },
      { id: "c", label: "Show my partner. We figure this out together.",
        weights: { loyalty: 3, solitary: -2, forthright: 2 } },
      { id: "d", label: "Some things are inherited. I always knew, on some level.",
        weights: { uncanny: 3, hope: -2, selfblame: 1 } }
    ]
  },

  // 5 — Halloween
  { id: "fun_5", film: "Halloween (1978)",
    setup: "It's almost Halloween. The town's been whispering — something old has come back. The school principal sends everyone home early.",
    prompt: "Walking home alone at dusk:",
    options: [
      { id: "a", label: "Eyes everywhere. I know which neighbors are home. I know the routes.",
        weights: { vigilance: 3, order: 2, embodied: 2, trusting: -2 } },
      { id: "b", label: "Headphones in. Whatever happens happens.",
        weights: { vigilance: -3, embodied: -1, restraint: 2 } },
      { id: "c", label: "Take the long way to walk a friend home first.",
        weights: { caregiving: 3, loyalty: 2, compassion: 2 } },
      { id: "d", label: "The whispers are probably nothing. Town gossip.",
        weights: { trusting: 3, vigilance: -3, uncanny: -2 } }
    ]
  },

  // 6 — Get Out
  { id: "fun_6", film: "Get Out (2017)",
    setup: "Meeting the partner's family for the first time. Everyone is too smiling. The questions feel rehearsed. Something is wrong, but you can't name it.",
    prompt: "You:",
    options: [
      { id: "a", label: "Trust the gut. Make an excuse. Go home. Process from safety.",
        weights: { vigilance: 3, embodied: 2, trusting: -2, forthright: -1 } },
      { id: "b", label: "Confront them directly. 'What's going on here?'",
        weights: { forthright: 3, embodied: 2, restraint: -2, vigilance: 1 } },
      { id: "c", label: "Stay polite. Gather information. Plan an exit later.",
        weights: { restraint: 3, vigilance: 2, order: 1, forthright: -1 } },
      { id: "d", label: "I'm probably overthinking it. I do this. Everyone is being kind.",
        weights: { selfblame: 3, trusting: 2, vigilance: -2, uncanny: -1 } }
    ]
  },

  // 7 — A Quiet Place
  { id: "fun_7", film: "A Quiet Place (2018)",
    setup: "The world has rules now. Make a sound, and they come. You've adapted. You're good at this.",
    prompt: "Your daily life:",
    options: [
      { id: "a", label: "Routines, signs, sand paths. Predictability is survival.",
        weights: { order: 3, vigilance: 3, restraint: 2 } },
      { id: "b", label: "Constantly scanning. Every sound matters. The body is always alert.",
        weights: { vigilance: 3, embodied: 2, stability: -2, restraint: 1 } },
      { id: "c", label: "Protect the people I love. That's the entire frame now.",
        weights: { caregiving: 3, loyalty: 3, compassion: 2 } },
      { id: "d", label: "I find the silence almost peaceful. The world simplified.",
        weights: { solitary: 3, restraint: 2, hope: 1 } }
    ]
  },

  // 8 — Misery
  { id: "fun_8", film: "Misery (1990)",
    setup: "Someone you barely know has been very kind to you during a hard time. Last week you noticed them rearranging things in your home — small things, but specific.",
    prompt: "You:",
    options: [
      { id: "a", label: "Stop the relationship immediately. Make it final. Don't soften it.",
        weights: { vigilance: 3, forthright: 2, loyalty: -2, embodied: 1 } },
      { id: "b", label: "Have a careful conversation. Set explicit limits. See how they respond.",
        weights: { forthright: 3, compassion: 2, restraint: 1 } },
      { id: "c", label: "It's probably nothing. They mean well.",
        weights: { trusting: 3, vigilance: -3, selfblame: 2 } },
      { id: "d", label: "Quietly create distance. Become harder to reach. Don't make a scene.",
        weights: { restraint: 3, forthright: -3, vigilance: 2, solitary: 1 } }
    ]
  },

  // 9 — The Witch
  { id: "fun_9", film: "The Witch (2015)",
    setup: "The family blames you for everything that's gone wrong on the farm. The baby. The crops. The goats. You know you didn't do these things. But everyone is sure.",
    prompt: "You:",
    options: [
      { id: "a", label: "Defend myself fiercely. The truth matters even if no one accepts it.",
        weights: { forthright: 3, embodied: 2, selfblame: -3, hope: 1 } },
      { id: "b", label: "Carry it. Maybe they're right about something I can't see.",
        weights: { selfblame: 3, restraint: 2, hope: -2, forthright: -1 } },
      { id: "c", label: "Leave. Walk into the woods. Whatever happens out there is freer than this.",
        weights: { solitary: 3, hope: 1, loyalty: -3, curiosity: 2 } },
      { id: "d", label: "Wait it out. They'll need me when something else goes wrong.",
        weights: { restraint: 3, loyalty: 2, embodied: -1, hope: -1 } }
    ]
  },

  // 10 — Carrie
  { id: "fun_10", film: "Carrie (1976)",
    setup: "You've been the target of cruelty for a long time. Today, in front of everyone, the cruelty became public spectacle.",
    prompt: "What rises in you:",
    options: [
      { id: "a", label: "Fury. Something old and large. The world feels unsafe to them now.",
        weights: { stability: -3, embodied: 3, restraint: -3, hope: -2 } },
      { id: "b", label: "Numbness. I leave my body. I watch from somewhere up near the ceiling.",
        weights: { embodied: -3, restraint: 3, stability: -1 } },
      { id: "c", label: "Shame. I should have seen it coming. I should have known better.",
        weights: { selfblame: 3, restraint: 2, hope: -2 } },
      { id: "d", label: "A strange clarity. This was the moment something had to change.",
        weights: { hope: 2, embodied: 1, forthright: 2, stability: 1 } }
    ]
  },

  // 11 — The Silence of the Lambs
  { id: "fun_11", film: "The Silence of the Lambs (1991)",
    setup: "Someone dangerous and brilliant has agreed to help you with something important. But only if you trade pieces of yourself — memories, small truths — for each piece of help.",
    prompt: "You:",
    options: [
      { id: "a", label: "Accept the trade. Be precise about which pieces. Stay in command of the conversation.",
        weights: { restraint: 3, order: 2, forthright: 2, vigilance: 2 } },
      { id: "b", label: "Refuse. There's another way. There's always another way.",
        weights: { hope: 3, vigilance: 2, restraint: 1, curiosity: -1 } },
      { id: "c", label: "Engage. There's something fascinating about how their mind works.",
        weights: { curiosity: 3, uncanny: 1, vigilance: -1 } },
      { id: "d", label: "Lie. Give them inventions. Pieces that aren't real.",
        weights: { forthright: -3, vigilance: 3, trusting: -2 } }
    ]
  },

  // 12 — The Sixth Sense
  { id: "fun_12", film: "The Sixth Sense (1999)",
    setup: "You've started seeing things others don't see. Patterns. Faces in old photographs. A sense of someone in the room when you're alone. Children at the edge of the playground that nobody else looks at.",
    prompt: "How you handle it:",
    options: [
      { id: "a", label: "Tell someone I trust. I need a reality check or a witness.",
        weights: { forthright: 3, loyalty: 2, solitary: -2, uncanny: 2 } },
      { id: "b", label: "Investigate. There's a pattern. Find it.",
        weights: { curiosity: 3, order: 2, uncanny: 2 } },
      { id: "c", label: "Tell no one. This is mine to carry until I understand it.",
        weights: { solitary: 3, restraint: 3, forthright: -3, uncanny: 2 } },
      { id: "d", label: "Get help. This might not be a gift. It might be illness. Worth checking.",
        weights: { vigilance: 2, embodied: 2, selfblame: 1, uncanny: -1 } }
    ]
  },

  // 13 — Saint Maud
  { id: "fun_13", film: "Saint Maud (2019)",
    setup: "You're caring for someone difficult, dying, who treats your kindness as something to be earned. You've started to feel called — not by her, but by something larger.",
    prompt: "What's happening inside you:",
    options: [
      { id: "a", label: "I'm losing the line between her care and mine. I should step back.",
        weights: { vigilance: 2, embodied: 2, caregiving: -1, selfblame: 1 } },
      { id: "b", label: "Something sacred is in this. I'll keep going. The work matters.",
        weights: { caregiving: 3, uncanny: 3, hope: 2, solitary: 2 } },
      { id: "c", label: "I'm proud of doing what others won't. Even if she can't see it.",
        weights: { selfblame: -1, caregiving: 3, restraint: 2, forthright: -1 } },
      { id: "d", label: "I should have left this job months ago. I'm too far in.",
        weights: { selfblame: 2, embodied: 2, vigilance: 1, hope: -2 } }
    ]
  },

  // 14 — Black Swan
  { id: "fun_14", film: "Black Swan (2010)",
    setup: "You've worked toward this thing your whole life. It's finally close. But to be the version of yourself who can do it, you have to lose something — softness, sleep, the people who knew you before.",
    prompt: "You:",
    options: [
      { id: "a", label: "Worth it. The work is the only thing that's ever made sense.",
        weights: { order: 3, restraint: 3, solitary: 2, embodied: -1 } },
      { id: "b", label: "Not worth it. There has to be a way to do this without erasing myself.",
        weights: { stability: 3, embodied: 2, hope: 2, restraint: -1 } },
      { id: "c", label: "I don't know. I'm losing track of which version of me is real.",
        weights: { embodied: -3, stability: -2, selfblame: 2 } },
      { id: "d", label: "I can hold both. The art and the life. I just need more discipline.",
        weights: { order: 3, restraint: 2, hope: 1, selfblame: 1 } }
    ]
  },

  // 15 — Requiem for a Dream
  { id: "fun_15", film: "Requiem for a Dream (2000)",
    setup: "The thing you reach for to feel better has started reaching back. It promises you a smaller, brighter version of yourself. Less lonely. Less heavy.",
    prompt: "Where you actually are with it:",
    options: [
      { id: "a", label: "I see the shape of it clearly. Cutting it loose now, while I still can.",
        weights: { vigilance: 3, embodied: 2, hope: 2, forthright: 1 } },
      { id: "b", label: "It's the one good thing in a hard year. I'll handle it later.",
        weights: { selfblame: 1, hope: -1, restraint: 2, forthright: -1 } },
      { id: "c", label: "I'd rather not look at this directly.",
        weights: { restraint: 3, forthright: -3, embodied: -2, curiosity: -2 } },
      { id: "d", label: "I'm telling someone today. This isn't something to figure out alone.",
        weights: { forthright: 3, loyalty: 1, solitary: -2, hope: 2 } }
    ]
  },

  // 16 — Repulsion
  { id: "fun_16", film: "Repulsion (1965)",
    setup: "You're alone in your apartment. You haven't left in days. The walls have been doing something — a slow, almost-imperceptible shift. You're not sure what's real anymore.",
    prompt: "You:",
    options: [
      { id: "a", label: "Open every window. Get outside. Feet on pavement. Anchor in the body.",
        weights: { embodied: 3, vigilance: 2, hope: 2, solitary: -1 } },
      { id: "b", label: "Call someone. Hearing another voice will help.",
        weights: { solitary: -3, forthright: 2, trusting: 2, loyalty: 1 } },
      { id: "c", label: "Document what's happening. Photograph the walls. See if the photos show what I see.",
        weights: { curiosity: 3, order: 2, uncanny: 2, embodied: 1 } },
      { id: "d", label: "Ride it out. This will pass. It always passes.",
        weights: { restraint: 3, stability: 2, embodied: -1, hope: -1 } }
    ]
  },

  // 17 — The Lighthouse
  { id: "fun_17", film: "The Lighthouse (2019)",
    setup: "You've been stuck somewhere with someone who frustrates you, for far longer than expected. The weather won't break. You're running out of patience and small talk.",
    prompt: "What you do:",
    options: [
      { id: "a", label: "Find ways to be alone within the shared space. Carve out solitude.",
        weights: { solitary: 3, restraint: 2, forthright: -1 } },
      { id: "b", label: "Have it out. Say the things. Either we work through it or we know we can't.",
        weights: { forthright: 3, embodied: 2, restraint: -2, loyalty: 1 } },
      { id: "c", label: "Build new routines with them. Make a small civilization. We can do this.",
        weights: { order: 3, hope: 2, loyalty: 2, caregiving: 1 } },
      { id: "d", label: "Drink more. Sleep more. Wait out the weather.",
        weights: { restraint: 2, embodied: -2, hope: -1, forthright: -1 } }
    ]
  },

  // 18 — Pearl
  { id: "fun_18", film: "Pearl (2022)",
    setup: "You've been small your whole life — small farm, small town, small expectations. Today you realized you have something inside you the size of the sky. It scares you, and it doesn't.",
    prompt: "What you do with it:",
    options: [
      { id: "a", label: "Channel it into work. Hours and hours of practice. Build the thing carefully.",
        weights: { order: 3, restraint: 3, embodied: 1, hope: 2 } },
      { id: "b", label: "Let it move me. See where it takes me. The plan is to follow.",
        weights: { restraint: -3, embodied: 3, curiosity: 2, hope: 1 } },
      { id: "c", label: "Tell people about it. Find collaborators. Things this size need witnesses.",
        weights: { forthright: 3, solitary: -2, hope: 2, communal: 2 } },
      { id: "d", label: "Hide it. Most people will not survive what they see when they see it.",
        weights: { restraint: 3, forthright: -3, solitary: 2, vigilance: 2 } }
    ]
  },

  // 19 — Rosemary's Baby
  { id: "fun_19", film: "Rosemary's Baby (1968)",
    setup: "Your support network has been incredibly attentive lately — neighbors checking in constantly, your partner deciding what's good for you, your doctor smiling too much. You're being taken care of in a way that feels like surveillance.",
    prompt: "What you do:",
    options: [
      { id: "a", label: "Trust the gut. Get away to somewhere they don't know. Talk to someone outside this circle.",
        weights: { vigilance: 3, embodied: 2, forthright: 1, trusting: -3 } },
      { id: "b", label: "Stay calm. Document patterns. Don't let on that I've noticed.",
        weights: { restraint: 3, vigilance: 3, forthright: -2, order: 2 } },
      { id: "c", label: "I'm being paranoid. They've been good to me. I should be grateful.",
        weights: { trusting: 3, selfblame: 3, vigilance: -3 } },
      { id: "d", label: "Confront them directly. Watch how they react.",
        weights: { forthright: 3, vigilance: 2, embodied: 2 } }
    ]
  },

  // 20 — The Invisible Man
  { id: "fun_20", film: "The Invisible Man (2020)",
    setup: "You got out of something bad. Now small things keep happening that no one believes. You know what's happening. They think you're paranoid.",
    prompt: "How you proceed:",
    options: [
      { id: "a", label: "Build a record. Documentation. Evidence. Make my reality undeniable.",
        weights: { order: 3, vigilance: 3, embodied: 2, hope: 2 } },
      { id: "b", label: "Find one person who'll believe me. That's all I need to start.",
        weights: { loyalty: 2, trusting: 1, forthright: 3, hope: 2 } },
      { id: "c", label: "Handle it myself. The system that didn't protect me before won't protect me now.",
        weights: { solitary: 3, vigilance: 3, trusting: -3, embodied: 2 } },
      { id: "d", label: "Question my own perceptions. Am I sure? I have to be sure.",
        weights: { selfblame: 3, vigilance: 1, embodied: -1 } }
    ]
  },

  // 21 — A Nightmare on Elm Street
  { id: "fun_21", film: "A Nightmare on Elm Street (1984)",
    setup: "Sleep has become the dangerous place. Every time you close your eyes, the thing is waiting. You can't keep this up forever.",
    prompt: "Your strategy:",
    options: [
      { id: "a", label: "Caffeine, schedules, willpower. I will not let myself sleep.",
        weights: { order: 2, restraint: 3, embodied: -1, vigilance: 3 } },
      { id: "b", label: "Confront it in the dream. Bring it back with me. Make it real on my terms.",
        weights: { curiosity: 3, embodied: 2, hope: 2, forthright: 2 } },
      { id: "c", label: "Get help. Therapist, doctor, anyone. I cannot solve this alone.",
        weights: { forthright: 3, solitary: -3, embodied: 1, hope: 2 } },
      { id: "d", label: "Accept that this is the new normal. Find a way to live exhausted.",
        weights: { restraint: 3, hope: -2, embodied: -1 } }
    ]
  },

  // 22 — The Babadook (second take, on grief)
  { id: "fun_22", film: "The Babadook (2014) — six months later",
    setup: "The grief is still in the house. You've made peace with that. But sometimes, when you're not looking, it makes itself loud again.",
    prompt: "How you live with it:",
    options: [
      { id: "a", label: "Acknowledge it daily. Feed it small offerings. It's part of the household now.",
        weights: { embodied: 3, uncanny: 1, restraint: 1, hope: 2 } },
      { id: "b", label: "Compartmentalize. Specific times for the grief. Specific places.",
        weights: { order: 3, restraint: 3, embodied: -1 } },
      { id: "c", label: "Talk to other people who have lost what I lost.",
        weights: { forthright: 3, communal: 3, hope: 2 } },
      { id: "d", label: "Let it move through. Feel it when it comes. Let it leave when it leaves.",
        weights: { embodied: 3, restraint: -3, stability: 2, hope: 2 } }
    ]
  },

  // 23 — Us
  { id: "fun_23", film: "Us (2019)",
    setup: "You've started thinking about who you might have been if your life had gone differently — different family, different opportunities, different choices. The shadow self.",
    prompt: "What you do with the thought:",
    options: [
      { id: "a", label: "Sit with it. Let it inform how I treat people who are still in the rooms I escaped.",
        weights: { compassion: 3, uncanny: 2, embodied: 1, hope: 2 } },
      { id: "b", label: "Push it away. That kind of thinking goes nowhere good.",
        weights: { restraint: 3, curiosity: -2, embodied: -1 } },
      { id: "c", label: "Examine it carefully. It might tell me things about my actual self.",
        weights: { curiosity: 3, order: 1, uncanny: 1, embodied: 1 } },
      { id: "d", label: "Use it as motivation. The shadow self is a warning about who I might still become.",
        weights: { vigilance: 2, hope: 1, selfblame: 2, order: 1 } }
    ]
  },

  // 24 — Jaws
  { id: "fun_24", film: "Jaws (1975)",
    setup: "You see something dangerous coming. You tell the people in charge. They tell you to keep quiet — it's bad for business. People could get hurt.",
    prompt: "You:",
    options: [
      { id: "a", label: "Go public anyway. Some things are bigger than my comfort or my job.",
        weights: { forthright: 3, hope: 2, vigilance: 2, restraint: -1 } },
      { id: "b", label: "Work the system. Document, escalate, build a paper trail.",
        weights: { order: 3, restraint: 2, vigilance: 2, hope: 1 } },
      { id: "c", label: "Solve it directly. Don't wait for anyone's permission.",
        weights: { embodied: 3, solitary: 2, hope: 2, trusting: -1 } },
      { id: "d", label: "Make sure my own people are warned, even if no one else can be.",
        weights: { loyalty: 3, caregiving: 2, restraint: 1 } }
    ]
  },

  // 25 — It Follows
  { id: "fun_25", film: "It Follows (2014)",
    setup: "You've noticed something following you. Slow, persistent, takes the form of strangers and acquaintances. It's only visible to you. Telling anyone makes you sound paranoid.",
    prompt: "What you do:",
    options: [
      { id: "a", label: "Tell my closest people. They might not see it but they'll believe me.",
        weights: { loyalty: 3, forthright: 3, trusting: 2, solitary: -2 } },
      { id: "b", label: "Outrun it. Keep moving. Whatever this is, it can't catch a moving target.",
        weights: { embodied: 3, vigilance: 3, hope: 1, solitary: 1 } },
      { id: "c", label: "Confront it. Whatever it is, I want to know.",
        weights: { curiosity: 3, forthright: 2, embodied: 2 } },
      { id: "d", label: "Keep it to myself. It's mine to deal with.",
        weights: { solitary: 3, restraint: 3, forthright: -3 } }
    ]
  },

  // 26 — Possession
  { id: "fun_26", film: "Possession (1981)",
    setup: "Your relationship is ending in slow motion. Both of you keep almost saying the thing that would end it. Neither of you can.",
    prompt: "You:",
    options: [
      { id: "a", label: "Say it. Cut the cord cleanly. The kindest thing is the honest thing.",
        weights: { forthright: 3, embodied: 2, restraint: -2, hope: 1 } },
      { id: "b", label: "Wait for them to say it. I won't be the one who broke this.",
        weights: { selfblame: 2, restraint: 3, forthright: -3, loyalty: 1 } },
      { id: "c", label: "Let it dissolve slowly. No formal ending. Less wreckage that way.",
        weights: { restraint: 3, forthright: -2, embodied: -1, vigilance: -1 } },
      { id: "d", label: "Burn it down on the way out. Make it impossible to undo.",
        weights: { embodied: 3, forthright: 3, restraint: -3, hope: -1 } }
    ]
  },

  // 27 — Suspiria
  { id: "fun_27", film: "Suspiria (1977 / 2018)",
    setup: "You've joined a community — work, school, group — that demands more of you than you expected. The leadership is impressive. You're starting to notice that people who question things disappear from the group.",
    prompt: "You:",
    options: [
      { id: "a", label: "Leave. Now. Quietly. Don't make it a confrontation.",
        weights: { vigilance: 3, restraint: 3, solitary: 2 } },
      { id: "b", label: "Stay and watch. Information is power. Decide later from inside.",
        weights: { curiosity: 3, vigilance: 2, restraint: 2 } },
      { id: "c", label: "Stay and dissent. If others are doing this in silence, someone needs to say it.",
        weights: { forthright: 3, hope: 2, vigilance: 1, embodied: 2 } },
      { id: "d", label: "Stay and conform. Maybe the group is right. Maybe I'm too rigid.",
        weights: { selfblame: 3, trusting: 2, vigilance: -3 } }
    ]
  },

  // 28 — Annihilation
  { id: "fun_28", film: "Annihilation (2018)",
    setup: "There's a place that changes whoever enters it. You've been chosen to go in. You can refuse.",
    prompt: "Why you go (or don't):",
    options: [
      { id: "a", label: "Curiosity. I have to know what's in there. I won't be at peace otherwise.",
        weights: { curiosity: 3, hope: 1, embodied: 1, vigilance: -1 } },
      { id: "b", label: "Love. Someone I love went in. I'm bringing them back.",
        weights: { loyalty: 3, caregiving: 3, embodied: 1, hope: 2 } },
      { id: "c", label: "Grief. I've already lost something inside myself. There's nothing left to protect.",
        weights: { hope: -3, embodied: -1, restraint: 2, selfblame: 2 } },
      { id: "d", label: "I don't go. The cost is too uncertain. There are other ways to know things.",
        weights: { vigilance: 2, restraint: 2, curiosity: -2, hope: 1 } }
    ]
  },

  // 29 — The Thing
  { id: "fun_29", film: "The Thing (1982)",
    setup: "Stuck in a remote place. One of the people with you is not who they appear to be. Could be anyone. Could already be more than one.",
    prompt: "Your move:",
    options: [
      { id: "a", label: "Trust no one. Lock my own door. Sleep with one eye open.",
        weights: { solitary: 3, vigilance: 3, trusting: -3 } },
      { id: "b", label: "Build a test. Get everyone in one room. Solve it methodically.",
        weights: { order: 3, vigilance: 2, hope: 2, communal: 2 } },
      { id: "c", label: "Pair up with the one person I'd bet my life on.",
        weights: { loyalty: 3, trusting: 2, vigilance: 1 } },
      { id: "d", label: "Run. Take supplies. Better odds alone in the cold than in here.",
        weights: { solitary: 3, embodied: 2, vigilance: 2, hope: 2 } }
    ]
  },

  // 30 — Don't Look Now
  { id: "fun_30", film: "Don't Look Now (1973)",
    setup: "You and your partner lost something irreplaceable. You're both grieving, but in completely different ways. You're starting to feel like strangers in the same house.",
    prompt: "How you handle it:",
    options: [
      { id: "a", label: "Sit them down. Acknowledge the gap. Ask what they need from me.",
        weights: { forthright: 3, compassion: 3, loyalty: 2, restraint: -1 } },
      { id: "b", label: "Find my own way through first. Reconnect when I'm steady again.",
        weights: { solitary: 3, restraint: 2, embodied: 1 } },
      { id: "c", label: "Try to lead them through. I see further into this than they do.",
        weights: { caregiving: 3, uncanny: 2, forthright: 1, restraint: -1 } },
      { id: "d", label: "Travel together. Distract together. Sometimes the words aren't the answer.",
        weights: { loyalty: 3, embodied: 2, restraint: 1, forthright: -1 } }
    ]
  },

  // 31 — Talk to Me
  { id: "fun_31", film: "Talk to Me (2022)",
    setup: "Friends are passing around something dangerous and exciting. Each turn is short. The thrill is real. So is the cost. You're up next.",
    prompt: "You:",
    options: [
      { id: "a", label: "Take my turn. I want the experience. I'll handle the cost later.",
        weights: { curiosity: 3, embodied: 2, restraint: -3, vigilance: -2 } },
      { id: "b", label: "Pass. The risk math doesn't work for me right now.",
        weights: { vigilance: 3, restraint: 3, embodied: 1, hope: 1 } },
      { id: "c", label: "Take a partial turn. Push the limit but stop early.",
        weights: { curiosity: 1, restraint: 2, vigilance: 2, order: 1 } },
      { id: "d", label: "Pull a friend aside. We need to talk about whether anyone should be doing this.",
        weights: { forthright: 3, caregiving: 3, vigilance: 2, communal: 1 } }
    ]
  },

  // 32 — Antichrist
  { id: "fun_32", film: "Antichrist (2009)",
    setup: "Something terrible has happened. Your therapist suggests you confront it directly — go to where it happened, sit with it, work through the layers.",
    prompt: "You:",
    options: [
      { id: "a", label: "Do the work. Whatever it costs. I'd rather feel everything than nothing.",
        weights: { embodied: 3, curiosity: 2, forthright: 2, restraint: -2 } },
      { id: "b", label: "Refuse. There are gentler ways through. I trust myself on this.",
        weights: { vigilance: 2, restraint: 2, forthright: 2, embodied: 1 } },
      { id: "c", label: "Try it slowly. Small doses. Stop when it's too much.",
        weights: { order: 2, restraint: 2, hope: 2, embodied: 1 } },
      { id: "d", label: "Find a different therapist. This approach isn't right for me.",
        weights: { vigilance: 2, forthright: 2, trusting: -1, embodied: 1 } }
    ]
  },

  // 33 — Audition
  { id: "fun_33", film: "Audition (1999)",
    setup: "You've started seeing someone new. Things are good, then strange — there's a small lie that doesn't add up, then another, then another. Each one is small. Together, they're a pattern.",
    prompt: "You:",
    options: [
      { id: "a", label: "Confront directly. Bring the pattern. See what happens.",
        weights: { forthright: 3, embodied: 2, vigilance: 2 } },
      { id: "b", label: "End it. Quietly. Without confrontation. Disappear.",
        weights: { vigilance: 3, restraint: 3, forthright: -2, solitary: 1 } },
      { id: "c", label: "Investigate before deciding. I want to know what I'm dealing with.",
        weights: { curiosity: 3, vigilance: 2, restraint: 2 } },
      { id: "d", label: "I'm being paranoid. Most people have inconsistencies. Lean in.",
        weights: { trusting: 3, selfblame: 2, vigilance: -3 } }
    ]
  },

  // 34 — Melancholia
  { id: "fun_34", film: "Melancholia (2011)",
    setup: "Something catastrophic is approaching that no one can stop. Some people around you are panicking, planning, denying. You feel oddly calm.",
    prompt: "How you spend the time:",
    options: [
      { id: "a", label: "With the people I love. Small rituals. Final ordinary days.",
        weights: { loyalty: 3, embodied: 3, communal: 3, hope: 1 } },
      { id: "b", label: "Alone, outside, with the sky. The vastness is comforting, not terrifying.",
        weights: { solitary: 3, embodied: 2, hope: -1, uncanny: 2 } },
      { id: "c", label: "Helping the panickers stay calm. Someone has to be the steady one.",
        weights: { caregiving: 3, stability: 3, restraint: 2, hope: 1 } },
      { id: "d", label: "Honestly? Relieved. There's nothing left to fail at.",
        weights: { hope: -3, restraint: 2, selfblame: 2, embodied: -1 } }
    ]
  },

  // 35 — Final Destination
  { id: "fun_35", film: "Final Destination (2000)",
    setup: "You had a vision of something terrible. You acted on it. Most of you got out alive. But the world has a logic, and the people who escaped are starting to die anyway.",
    prompt: "How you live now:",
    options: [
      { id: "a", label: "Hyper-vigilance. Map every danger in every room. Out-think the pattern.",
        weights: { vigilance: 3, order: 3, embodied: 2, hope: 1 } },
      { id: "b", label: "Acceptance. I bought time. Whatever's coming is coming.",
        weights: { hope: -2, restraint: 3, stability: 2, embodied: -1 } },
      { id: "c", label: "Try to save the others, even though they're scattered.",
        weights: { caregiving: 3, loyalty: 2, hope: 2, embodied: 2 } },
      { id: "d", label: "Live louder. Bigger. The vision was a gift, not a curse.",
        weights: { embodied: 3, hope: 3, restraint: -2, curiosity: 2 } }
    ]
  }
];

/* ============================================================
   SECTION 3 — CHARACTER TRAIT COORDINATES (61 chars × 15 axes)
   ============================================================
   Each character is positioned on every axis from -100 to +100.
   Coordinates set by reading each character's archetype carefully.
   Values represent the character's *trait disposition*, not their
   pathology — Hannibal scores high Stability not because health
   but because his volatility is genuinely low.
   ============================================================ */

const CHAR_TRAITS = {
  // ===== Trauma / survivor =====
  the_final_girl: { vigilance: 90, solitary: 40, restraint: 70, order: 70, curiosity: 30, compassion: 40, loyalty: 80, trusting: -60, caregiving: 60, forthright: 30, stability: 70, uncanny: 20, selfblame: 20, hope: 60, embodied: 80 },
  the_haunted_witness: { vigilance: 80, solitary: 70, restraint: 80, order: 30, curiosity: 60, compassion: 70, loyalty: 70, trusting: -20, caregiving: 50, forthright: -40, stability: 30, uncanny: 90, selfblame: 60, hope: 40, embodied: 30 },
  the_returning_daughter: { vigilance: 70, solitary: 30, restraint: 50, order: 40, curiosity: 70, compassion: 60, loyalty: 70, trusting: -30, caregiving: 70, forthright: 40, stability: 40, uncanny: 60, selfblame: 30, hope: 60, embodied: 70 },
  the_visiting_girl: { vigilance: 50, solitary: 80, restraint: 20, order: 20, curiosity: 40, compassion: -20, loyalty: 30, trusting: -50, caregiving: -20, forthright: -60, stability: -40, uncanny: 90, selfblame: 70, hope: -50, embodied: -40 },
  the_pregnant_oracle: { vigilance: 60, solitary: -30, restraint: 50, order: 60, curiosity: 70, compassion: 70, loyalty: 70, trusting: -20, caregiving: 80, forthright: 50, stability: 30, uncanny: 70, selfblame: 50, hope: 30, embodied: 50 },
  the_invisible_girl: { vigilance: 40, solitary: 70, restraint: 60, order: 40, curiosity: 50, compassion: 50, loyalty: 50, trusting: -50, caregiving: 30, forthright: -50, stability: -40, uncanny: 80, selfblame: 80, hope: 0, embodied: -20 },

  // ===== Mood / grief =====
  the_grief_keeper: { vigilance: 40, solitary: 50, restraint: 40, order: 30, curiosity: 30, compassion: 60, loyalty: 80, trusting: 20, caregiving: 70, forthright: 50, stability: -30, uncanny: 50, selfblame: 70, hope: 0, embodied: 30 },
  the_drowned_self: { vigilance: -20, solitary: 80, restraint: 70, order: -20, curiosity: 60, compassion: 30, loyalty: 30, trusting: 0, caregiving: 20, forthright: 50, stability: 20, uncanny: 80, selfblame: 30, hope: -90, embodied: -30 },
  the_returning_revenant: { vigilance: 60, solitary: 40, restraint: 70, order: 60, curiosity: 30, compassion: 70, loyalty: 80, trusting: 0, caregiving: 80, forthright: 30, stability: 50, uncanny: 30, selfblame: 50, hope: 30, embodied: 50 },
  the_vengeful_returner: { vigilance: 90, solitary: 80, restraint: 80, order: 70, curiosity: 30, compassion: -50, loyalty: 60, trusting: -80, caregiving: -30, forthright: 60, stability: 40, uncanny: 30, selfblame: -40, hope: -30, embodied: 80 },
  the_melancholic_widow: { vigilance: 30, solitary: 70, restraint: 80, order: 40, curiosity: 20, compassion: 60, loyalty: 80, trusting: 30, caregiving: 50, forthright: 20, stability: 0, uncanny: 50, selfblame: 60, hope: -50, embodied: -10 },
  the_hidden_depressive: { vigilance: 30, solitary: 50, restraint: 90, order: 70, curiosity: 30, compassion: 80, loyalty: 80, trusting: 30, caregiving: 90, forthright: -60, stability: -20, uncanny: 30, selfblame: 90, hope: -30, embodied: -20 },
  the_relational_survivor: { vigilance: 80, solitary: 60, restraint: 50, order: 60, curiosity: 50, compassion: 70, loyalty: 70, trusting: -30, caregiving: 70, forthright: 60, stability: 50, uncanny: 30, selfblame: 30, hope: 50, embodied: 70 },

  // ===== Anxiety / OCD / panic =====
  the_listener: { vigilance: 90, solitary: 30, restraint: 80, order: 60, curiosity: 40, compassion: 70, loyalty: 90, trusting: 0, caregiving: 80, forthright: 30, stability: 20, uncanny: 30, selfblame: 50, hope: 20, embodied: 80 },
  the_ritualist: { vigilance: 80, solitary: 70, restraint: 90, order: 90, curiosity: 30, compassion: 30, loyalty: 60, trusting: -40, caregiving: 50, forthright: -20, stability: 50, uncanny: 60, selfblame: 60, hope: 0, embodied: 30 },
  the_quiet_neighbor: { vigilance: 50, solitary: 90, restraint: 90, order: 70, curiosity: 30, compassion: 40, loyalty: 30, trusting: -50, caregiving: 20, forthright: -90, stability: -10, uncanny: 70, selfblame: 70, hope: -30, embodied: 0 },
  the_panicker: { vigilance: 90, solitary: 30, restraint: 30, order: 30, curiosity: 40, compassion: 50, loyalty: 60, trusting: -20, caregiving: 40, forthright: 30, stability: -70, uncanny: 30, selfblame: 60, hope: 30, embodied: 90 },
  the_clean_haunted: { vigilance: 90, solitary: 60, restraint: 80, order: 95, curiosity: 30, compassion: 50, loyalty: 50, trusting: -30, caregiving: 50, forthright: -30, stability: -10, uncanny: 50, selfblame: 80, hope: -10, embodied: 40 },

  // ===== Personality / Cluster B =====
  the_devoted_fan: { vigilance: 70, solitary: 60, restraint: -60, order: 60, curiosity: 30, compassion: 30, loyalty: 95, trusting: -30, caregiving: 80, forthright: 50, stability: -90, uncanny: 30, selfblame: -30, hope: 50, embodied: 70 },
  the_cabin_husband: { vigilance: 40, solitary: 80, restraint: -50, order: 50, curiosity: 30, compassion: -30, loyalty: 30, trusting: -20, caregiving: -20, forthright: 30, stability: -80, uncanny: 80, selfblame: 30, hope: -30, embodied: 50 },
  the_charming_predator: { vigilance: 90, solitary: 70, restraint: 90, order: 90, curiosity: 80, compassion: -90, loyalty: 30, trusting: -70, caregiving: -50, forthright: -50, stability: 90, uncanny: 60, selfblame: -90, hope: 30, embodied: 80 },
  the_perfect_child: { vigilance: 80, solitary: 70, restraint: 90, order: 90, curiosity: 50, compassion: -50, loyalty: 30, trusting: -60, caregiving: -30, forthright: -90, stability: 60, uncanny: 40, selfblame: -70, hope: 20, embodied: 40 },
  the_mask_wearer: { vigilance: 70, solitary: 60, restraint: 90, order: 90, curiosity: 30, compassion: -90, loyalty: -30, trusting: -50, caregiving: -70, forthright: -90, stability: 30, uncanny: 30, selfblame: -90, hope: 0, embodied: 50 },
  the_quiet_borderline: { vigilance: 70, solitary: 80, restraint: 50, order: 50, curiosity: 50, compassion: 40, loyalty: 70, trusting: -40, caregiving: 30, forthright: -60, stability: -70, uncanny: 50, selfblame: 80, hope: -20, embodied: 0 },
  the_dependent_clinger: { vigilance: 50, solitary: -90, restraint: -30, order: 40, curiosity: 30, compassion: 30, loyalty: 95, trusting: 60, caregiving: 60, forthright: -40, stability: -50, uncanny: 30, selfblame: 70, hope: 20, embodied: 50 },

  // ===== Dissociation / psychotic spectrum =====
  the_dissociated_son: { vigilance: 60, solitary: 80, restraint: 80, order: 50, curiosity: 30, compassion: 30, loyalty: 80, trusting: -20, caregiving: 50, forthright: -80, stability: -60, uncanny: 60, selfblame: 80, hope: -20, embodied: -70 },
  the_unraveling_caretaker: { vigilance: 70, solitary: 80, restraint: -30, order: 80, curiosity: 30, compassion: -20, loyalty: 30, trusting: -50, caregiving: 30, forthright: 30, stability: -70, uncanny: 80, selfblame: 50, hope: -50, embodied: 30 },
  the_psychic_child: { vigilance: 80, solitary: 60, restraint: 70, order: 30, curiosity: 80, compassion: 70, loyalty: 80, trusting: -10, caregiving: 50, forthright: -50, stability: 0, uncanny: 95, selfblame: 50, hope: 30, embodied: 30 },
  the_decompensating: { vigilance: 90, solitary: 95, restraint: 70, order: 30, curiosity: 30, compassion: -10, loyalty: -20, trusting: -90, caregiving: -30, forthright: -70, stability: -90, uncanny: 95, selfblame: 50, hope: -70, embodied: -50 },
  the_paranoid_patriarch: { vigilance: 95, solitary: 70, restraint: 50, order: 80, curiosity: 50, compassion: 40, loyalty: 80, trusting: -80, caregiving: 60, forthright: 50, stability: -30, uncanny: 80, selfblame: 30, hope: -20, embodied: 60 },

  // ===== Schizotypal =====
  the_unusual_seer: { vigilance: 60, solitary: 70, restraint: 50, order: 50, curiosity: 80, compassion: 50, loyalty: 70, trusting: -10, caregiving: 60, forthright: -30, stability: -40, uncanny: 95, selfblame: 50, hope: -20, embodied: 30 },
  the_eccentric_outsider: { vigilance: 50, solitary: 95, restraint: 60, order: 60, curiosity: 90, compassion: 30, loyalty: 30, trusting: -30, caregiving: -20, forthright: -50, stability: 0, uncanny: 90, selfblame: 30, hope: 0, embodied: 30 },
  the_paranoid_seer: { vigilance: 95, solitary: 90, restraint: 70, order: 60, curiosity: 60, compassion: 0, loyalty: 0, trusting: -90, caregiving: -30, forthright: -70, stability: -60, uncanny: 90, selfblame: 50, hope: -50, embodied: 0 },

  // ===== Substance / impulsivity =====
  the_cellar_drinker: { vigilance: 30, solitary: 80, restraint: -50, order: -30, curiosity: 30, compassion: 30, loyalty: 30, trusting: 0, caregiving: -30, forthright: -50, stability: -50, uncanny: 30, selfblame: 90, hope: -60, embodied: -30 },
  the_chasing_thing: { vigilance: 90, solitary: 60, restraint: 30, order: 30, curiosity: 60, compassion: -50, loyalty: -50, trusting: -90, caregiving: -50, forthright: 30, stability: 60, uncanny: 70, selfblame: 30, hope: -50, embodied: 60 },
  the_chasing_addict: { vigilance: 30, solitary: 30, restraint: -70, order: -50, curiosity: 60, compassion: 40, loyalty: 40, trusting: 30, caregiving: -20, forthright: 30, stability: -70, uncanny: 30, selfblame: 60, hope: -30, embodied: 80 },
  the_high_functioner: { vigilance: 70, solitary: 70, restraint: 90, order: 90, curiosity: 30, compassion: -30, loyalty: 0, trusting: -50, caregiving: -30, forthright: -90, stability: 30, uncanny: 30, selfblame: -30, hope: 30, embodied: 30 },

  // ===== Eating disorders =====
  the_perfectionist_swan: { vigilance: 70, solitary: 60, restraint: 90, order: 95, curiosity: 50, compassion: 30, loyalty: 50, trusting: -30, caregiving: 30, forthright: -50, stability: -30, uncanny: 60, selfblame: 90, hope: 30, embodied: 50 },
  the_starving_addict: { vigilance: 50, solitary: 70, restraint: 50, order: 60, curiosity: 30, compassion: 30, loyalty: 50, trusting: 30, caregiving: 30, forthright: -50, stability: -60, uncanny: 30, selfblame: 80, hope: -30, embodied: 30 },
  the_binge_keeper: { vigilance: 40, solitary: 80, restraint: -50, order: 30, curiosity: 30, compassion: 40, loyalty: 40, trusting: 30, caregiving: 30, forthright: -90, stability: -50, uncanny: 30, selfblame: 95, hope: -30, embodied: 70 },

  // ===== Insomnia =====
  the_sleepless_writer: { vigilance: 90, solitary: 90, restraint: 80, order: 70, curiosity: 70, compassion: 30, loyalty: 30, trusting: -30, caregiving: 30, forthright: -30, stability: -50, uncanny: 80, selfblame: 60, hope: 0, embodied: 30 },
  the_dreamless: { vigilance: 95, solitary: 50, restraint: 60, order: 70, curiosity: 50, compassion: 60, loyalty: 80, trusting: -30, caregiving: 70, forthright: 30, stability: -50, uncanny: 70, selfblame: 60, hope: 40, embodied: 60 },

  // ===== Somatic =====
  the_body_horror: { vigilance: 80, solitary: 80, restraint: 70, order: 70, curiosity: 80, compassion: 50, loyalty: 30, trusting: -20, caregiving: 80, forthright: 30, stability: -30, uncanny: 95, selfblame: 90, hope: 30, embodied: 90 },
  the_unwell_caretaker: { vigilance: 90, solitary: 50, restraint: 50, order: 80, curiosity: 60, compassion: 60, loyalty: 70, trusting: -30, caregiving: 70, forthright: 50, stability: -50, uncanny: 30, selfblame: 70, hope: -10, embodied: 80 },

  // ===== Bipolar / energy =====
  the_unbound_artist: { vigilance: 30, solitary: 60, restraint: -90, order: 30, curiosity: 90, compassion: 30, loyalty: 50, trusting: 30, caregiving: 30, forthright: 90, stability: -90, uncanny: 80, selfblame: -30, hope: 70, embodied: 95 },
  the_unsleeping_genius: { vigilance: 40, solitary: 70, restraint: -90, order: 30, curiosity: 95, compassion: -10, loyalty: 30, trusting: 30, caregiving: 30, forthright: 70, stability: -95, uncanny: 70, selfblame: -30, hope: 70, embodied: 70 },

  // ===== Acute stress / adjustment =====
  the_acutely_overwhelmed: { vigilance: 80, solitary: 30, restraint: 50, order: 50, curiosity: 30, compassion: 80, loyalty: 95, trusting: -20, caregiving: 80, forthright: 60, stability: -60, uncanny: 20, selfblame: 50, hope: 30, embodied: 80 },

  // ===== Neurodevelopmental =====
  the_distracted_protagonist: { vigilance: -30, solitary: -20, restraint: -30, order: -30, curiosity: 70, compassion: 50, loyalty: 70, trusting: 80, caregiving: 50, forthright: 60, stability: 0, uncanny: 0, selfblame: 30, hope: 50, embodied: 30 },
  the_uncanny_outsider: { vigilance: 70, solitary: 90, restraint: 70, order: 50, curiosity: 80, compassion: 40, loyalty: 60, trusting: -50, caregiving: 30, forthright: -60, stability: 30, uncanny: 90, selfblame: 30, hope: 0, embodied: 40 },

  // ===== Eating / Body / Identity =====
  the_perfectionist_dancer: { vigilance: 70, solitary: 60, restraint: 90, order: 95, curiosity: 50, compassion: 30, loyalty: 50, trusting: -30, caregiving: 30, forthright: -50, stability: -30, uncanny: 60, selfblame: 90, hope: 30, embodied: 50 },
  the_changing_body: { vigilance: 60, solitary: 70, restraint: 50, order: 60, curiosity: 95, compassion: 40, loyalty: 60, trusting: -10, caregiving: 50, forthright: 50, stability: -50, uncanny: 90, selfblame: 70, hope: -20, embodied: -70 },

  // ===== Existential =====
  the_void_speaker: { vigilance: 50, solitary: 90, restraint: 90, order: 80, curiosity: 95, compassion: -70, loyalty: -30, trusting: 30, caregiving: -30, forthright: 70, stability: 70, uncanny: 95, selfblame: -30, hope: -50, embodied: 50 },
  the_eternal_returner: { vigilance: 80, solitary: 70, restraint: 70, order: 70, curiosity: 90, compassion: 30, loyalty: 50, trusting: -30, caregiving: 50, forthright: 30, stability: 0, uncanny: 95, selfblame: 80, hope: 0, embodied: 30 },
  the_bargained_self: { vigilance: 60, solitary: 60, restraint: 70, order: 60, curiosity: 70, compassion: 40, loyalty: 40, trusting: 0, caregiving: 30, forthright: 30, stability: 0, uncanny: 70, selfblame: 70, hope: 30, embodied: 40 },

  // ===== Childhood trauma =====
  the_orphan_seer: { vigilance: 70, solitary: 50, restraint: 30, order: 30, curiosity: 80, compassion: 70, loyalty: 80, trusting: 30, caregiving: 50, forthright: 70, stability: -30, uncanny: 95, selfblame: 50, hope: 50, embodied: 50 },

  // ===== Withdrawal / attachment =====
  the_basement_dweller: { vigilance: 70, solitary: 90, restraint: 90, order: 80, curiosity: 30, compassion: 50, loyalty: 50, trusting: -50, caregiving: 30, forthright: -90, stability: 30, uncanny: 30, selfblame: 95, hope: 0, embodied: 30 },
  the_ferryman: { vigilance: 50, solitary: 50, restraint: 70, order: 80, curiosity: 50, compassion: 70, loyalty: 70, trusting: 50, caregiving: 90, forthright: 50, stability: 80, uncanny: 50, selfblame: 30, hope: 50, embodied: 60 },
  the_vanishing_partner: { vigilance: 30, solitary: 70, restraint: 80, order: 50, curiosity: 50, compassion: 50, loyalty: 60, trusting: 30, caregiving: 50, forthright: -60, stability: -30, uncanny: 50, selfblame: 70, hope: -10, embodied: -10 },

  // ===== Body / identity / shadow =====
  the_borrowed_face: { vigilance: 80, solitary: 50, restraint: 70, order: 60, curiosity: 70, compassion: 30, loyalty: 30, trusting: -50, caregiving: 30, forthright: -90, stability: -30, uncanny: 80, selfblame: 70, hope: 0, embodied: -30 },
  the_captive_self: { vigilance: 90, solitary: 80, restraint: 80, order: 60, curiosity: 50, compassion: 50, loyalty: 60, trusting: -50, caregiving: 50, forthright: 30, stability: 30, uncanny: 50, selfblame: 70, hope: 60, embodied: 70 },

  // ===== Adaptive / regulating =====
  the_curious_investigator: { vigilance: 70, solitary: 30, restraint: 60, order: 70, curiosity: 90, compassion: 80, loyalty: 80, trusting: 50, caregiving: 70, forthright: 80, stability: 80, uncanny: 50, selfblame: 30, hope: 80, embodied: 70 }
};

/* ============================================================
   SECTION 4 — SCORING & MATCHING
   ============================================================ */

function score_FunResponses(responses) {
  // Sum trait weights from each answered scenario into a 15-axis vector,
  // then normalize to fill -100..+100 range more aggressively.
  //
  // Why this needs to be aggressive: the previous implementation divided by
  // theoreticalMax = (items_touching_axis * 3), which assumed users pick
  // the most-extreme-on-that-axis option on every relevant item. In practice
  // users hit 30-40% of that max even with consistent choices, compressing
  // everyone toward the origin. We fix this by dividing by a more realistic
  // max (typical-best weight per item, ~2 instead of 3), so the resulting
  // user vector actually fills the trait space.

  const userTraits = {};
  TRAIT_AXES.forEach(a => { userTraits[a.id] = 0; });

  FUN_SCENARIOS.forEach(scenario => {
    const answer = responses[scenario.id];
    if (!answer) return;
    const chosenOption = scenario.options.find(o => o.id === answer);
    if (!chosenOption || !chosenOption.weights) return;
    Object.entries(chosenOption.weights).forEach(([axisId, w]) => {
      if (userTraits[axisId] === undefined) return;
      userTraits[axisId] += w;
    });
  });

  // Count items touching each axis for per-axis normalization
  const itemCount = {};
  TRAIT_AXES.forEach(a => { itemCount[a.id] = 0; });
  FUN_SCENARIOS.forEach(scenario => {
    const axesTouched = new Set();
    scenario.options.forEach(opt => {
      if (!opt.weights) return;
      Object.keys(opt.weights).forEach(k => axesTouched.add(k));
    });
    axesTouched.forEach(k => { if (itemCount[k] !== undefined) itemCount[k] += 1; });
  });

  // Normalize: use empirical "realistic max" of ~1.5 weight per touching item
  // (most options contribute 1-2, occasionally 3). This makes users actually
  // fill the trait space rather than clustering near zero.
  const normalized = {};
  TRAIT_AXES.forEach(a => {
    const count = itemCount[a.id] || 1;
    const realisticMax = count * 1.5;
    const raw = userTraits[a.id];
    normalized[a.id] = Math.round((raw / realisticMax) * 100);
    if (normalized[a.id] > 100) normalized[a.id] = 100;
    if (normalized[a.id] < -100) normalized[a.id] = -100;
  });

  return { raw: userTraits, normalized, itemsAnswered: Object.keys(responses).length };
}

function matchFunCharacters(userTraits, characters) {
  // CENTERED cosine similarity: subtract the population mean from each axis
  // before computing alignment. This is the key fix for personality matching —
  // without centering, characters with broadly-positive trait profiles (like
  // "warm caregiver" types) correlate positively with almost any user, and
  // distinctive characters (the predator, the void-speaker) almost never match.
  // After centering, what matters is the SHAPE of the trait profile relative
  // to average — vigilance noticeably ABOVE the norm vs vigilance noticeably
  // BELOW. This is how Big Five and similar instruments actually score.

  const userVec = userTraits.normalized;
  const results = [];

  // Compute population mean for each axis across all characters
  const popMean = {};
  TRAIT_AXES.forEach(a => {
    let sum = 0, count = 0;
    Object.values(CHAR_TRAITS).forEach(traits => {
      if (traits[a.id] !== undefined) {
        sum += traits[a.id];
        count += 1;
      }
    });
    popMean[a.id] = count > 0 ? sum / count : 0;
  });

  // Center user vector and precompute its magnitude
  const userCentered = {};
  let userMagSq = 0;
  TRAIT_AXES.forEach(a => {
    const v = (userVec[a.id] ?? 0) - popMean[a.id];
    userCentered[a.id] = v;
    userMagSq += v * v;
  });
  const userMag = Math.sqrt(userMagSq) || 1;

  characters.forEach(ch => {
    const traits = CHAR_TRAITS[ch.id];
    if (!traits) return;

    // Center the character vector
    let dot = 0;
    let charMagSq = 0;
    TRAIT_AXES.forEach(a => {
      const u = userCentered[a.id];
      const c = (traits[a.id] ?? 0) - popMean[a.id];
      dot += u * c;
      charMagSq += c * c;
    });
    const charMag = Math.sqrt(charMagSq) || 1;
    const cosine = dot / (userMag * charMag); // -1 to +1

    // Convert cosine to 0-100 percentage. Map [-1, +1] → [0, 100].
    let similarity = ((cosine + 1) / 2) * 100;

    // Light magnitude-imbalance penalty (using centered magnitudes):
    // someone who's near the population average shouldn't claim 95% match with
    // an extreme character.
    const magRatio = Math.min(userMag, charMag) / Math.max(userMag, charMag);
    similarity = similarity * 0.75 + magRatio * 100 * 0.25;

    similarity = Math.max(0, Math.min(100, Math.round(similarity)));

    results.push({
      id: ch.id,
      name: ch.name,
      archetype: ch.archetype,
      profile: ch.profile,
      metaphor: ch.metaphor,
      therapeuticUse: ch.therapeuticUse,
      inspiredBy: ch.inspiredBy,
      traits,
      cosine: cosine,
      pct: similarity
    });
  });

  // Sort by similarity descending
  results.sort((a, b) => b.pct - a.pct);
  return results;
}

function generateFunReport(responses, characters) {
  const userTraits = score_FunResponses(responses);
  const matches = matchFunCharacters(userTraits, characters);
  return {
    generatedAt: new Date().toISOString(),
    type: "fun",
    userTraits,
    matches,
    topThree: matches.slice(0, 3)
  };
}

/* ============================================================
   SECTION 5 — COMPARISON LOGIC
   ============================================================
   Given a clinical report and a fun report (both with .matches),
   generate a comparison object with:
   - convergent characters (in both top 3)
   - divergence narrative (auto-generated)
   - trait overlap analysis (where Big Five from clinical aligns
     with fun trait axes)
   ============================================================ */

function compareReports(clinicalReport, funReport) {
  const out = {
    generatedAt: new Date().toISOString(),
    clinical: {
      topThree: clinicalReport.matches?.slice(0, 3) || [],
      probableDxCount: clinicalReport.probableDiagnoses?.length || 0,
      bigFive: clinicalReport.personality?.bigFive
    },
    fun: {
      topThree: funReport.topThree || [],
      userTraits: funReport.userTraits?.normalized || {}
    },
    convergence: [],
    narrative: ""
  };

  // Find characters in both top 3
  const clinIds = new Set(out.clinical.topThree.map(m => m.id));
  out.fun.topThree.forEach(m => {
    if (clinIds.has(m.id)) {
      out.convergence.push({
        id: m.id,
        name: m.name,
        primary: m.inspiredBy?.primary || m.name,
        clinicalRank: out.clinical.topThree.findIndex(c => c.id === m.id) + 1,
        funRank: out.fun.topThree.findIndex(f => f.id === m.id) + 1
      });
    }
  });

  // Generate divergence narrative
  out.narrative = generateDivergenceNarrative(out, clinicalReport, funReport);

  return out;
}

function generateDivergenceNarrative(comparison, clinicalReport, funReport) {
  const segments = [];

  const dxCount = clinicalReport.probableDiagnoses?.length || 0;
  const ut = funReport.userTraits?.normalized || {};

  // Detect "stable trait, distressed clinical" pattern
  const stable = (ut.stability || 0) > 30;
  const hopeful = (ut.hope || 0) > 30;
  const embodied = (ut.embodied || 0) > 30;
  const unstable = (ut.stability || 0) < -30;
  const doomed = (ut.hope || 0) < -30;
  const dissociated = (ut.embodied || 0) < -30;

  if (comparison.convergence.length >= 2) {
    const names = comparison.convergence.map(c => c.primary).join(" and ");
    segments.push(
      `Strong convergence: ${names} appeared in both your clinical and trait-based top matches. When two methodologically different assessments — one tracking symptoms, one tracking character — surface the same archetype, that match is doing real work. The pattern these characters embody is showing up in who you are AND in how you're currently functioning.`
    );
  } else if (comparison.convergence.length === 1) {
    const c = comparison.convergence[0];
    segments.push(
      `One convergent match: ${c.primary} appeared in both your clinical (rank #${c.clinicalRank}) and your trait-based (rank #${c.funRank}) top three. That's a meaningful overlap — this character captures something both about your underlying disposition and your current presentation.`
    );
  } else {
    segments.push(
      `No direct convergence: your clinical and trait-based top matches are entirely different characters. This is itself useful information — the gap between them often tells a story.`
    );
  }

  // Pattern: stable trait + flagged clinical = "going through something"
  if (stable && hopeful && dxCount >= 2) {
    segments.push(
      `Your trait profile reads as steady — you score high on stability, hope, and being grounded in your body. But your clinical screening is flagging multiple areas of distress. This pattern often means: who you are is intact; what you're going through is hard. The clinical readout is describing the weather. The trait readout is describing the climate. Both are real, but they operate on different timescales.`
    );
  }

  // Pattern: volatile trait + quiet clinical = "running hot, well-regulated"
  if (unstable && dxCount === 0) {
    segments.push(
      `Your trait profile reads as intense — high reactivity, lower stability, comfort with the uncanny. But your clinical screening is quiet. This is consistent with someone who runs hot internally but has built strong external regulation, or whose intensity is channeled productively (creative work, advocacy, deep relationships) rather than tipping into impairment. The character matches in your fun result are likely capturing something more durable about who you are than your clinical result is.`
    );
  }

  // Pattern: dissociated + clinical signal
  if (dissociated && dxCount >= 1) {
    segments.push(
      `Both assessments are picking up on a tendency to observe yourself from a slight remove rather than to fully inhabit experience. This trait-level dissociation isn't pathological in itself — it can be an asset for clinical work, writing, or any role requiring perspective — but combined with current clinical signal, it may be worth noting whether the distance is helpful right now or whether it's amplifying isolation.`
    );
  }

  // Pattern: hopeful trait + low clinical signal = "well-regulated baseline"
  if (hopeful && stable && dxCount === 0) {
    segments.push(
      `Both assessments are pointing in the same direction: you're in a relatively well-regulated place. Your trait profile (steady, hopeful, embodied) and your clinical screening (low symptom signal) tell the same story. The characters you matched with on the fun assessment likely resemble the version of you that operates when you're grounded.`
    );
  }

  // Doom + clinical signal
  if (doomed && dxCount >= 2) {
    segments.push(
      `Both assessments are surfacing a darker thread — your trait profile leans toward expecting bad outcomes, and your clinical screening is flagging multiple areas. This isn't catastrophic, but it does suggest the felt sense of doom isn't just an artifact of the current crisis; it's part of how you orient generally. That's worth knowing because trait-level pessimism responds to different interventions than acute distress (the former benefits from work on values/meaning/positive psychology; the latter benefits from symptom-targeted treatment).`
    );
  }

  // Default closing if narrative is light
  if (segments.length < 2) {
    segments.push(
      `The two assessments together describe two layers: the durable architecture of your character, and the current state of your functioning. Read them as complementary rather than competitive — the gap (or convergence) between them is often the most useful part.`
    );
  }

  return segments.join("\n\n");
}

/* ============================================================
   SECTION 6 — EXPORTS
   ============================================================ */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TRAIT_AXES,
    AXIS_BY_ID,
    FUN_SCENARIOS,
    CHAR_TRAITS,
    score_FunResponses,
    matchFunCharacters,
    generateFunReport,
    compareReports,
    generateDivergenceNarrative
  };
}
