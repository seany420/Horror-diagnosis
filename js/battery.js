/* ============================================================
   SCREAM PROFILE — CONSOLIDATED ADAPTIVE BATTERY (v2)
   ============================================================
   Architecture: gated/branching adaptive battery.
   Median ~140 items / ~22 minutes when several gates trip.

   v2 additions:
     - Time-frame prefaces on every instrument (visible in UI)
     - Horror-context flavor on items (preserves validated wording;
       flavor appears as italic gloss after the standard prompt)
     - Full-length forms: PCL-5 (20), Y-BOCS-SR (10), LSAS (24),
       PID-5-BF (25)

   Each instrument carries scoring, clinical cutoffs, and
   contributes weighted evidence to the diagnostic engine.
   ============================================================ */

const RESPONSE_SCALES = {
  L4: [
    { v: 0, label: "Not at all" },
    { v: 1, label: "Several days" },
    { v: 2, label: "More than half the days" },
    { v: 3, label: "Nearly every day" }
  ],
  L5: [
    { v: 0, label: "Never" },
    { v: 1, label: "Rarely" },
    { v: 2, label: "Sometimes" },
    { v: 3, label: "Often" },
    { v: 4, label: "Almost always" }
  ],
  L5_PCL: [
    { v: 0, label: "Not at all" },
    { v: 1, label: "A little bit" },
    { v: 2, label: "Moderately" },
    { v: 3, label: "Quite a bit" },
    { v: 4, label: "Extremely" }
  ],
  L4_LSAS_FEAR: [
    { v: 0, label: "None" },
    { v: 1, label: "Mild" },
    { v: 2, label: "Moderate" },
    { v: 3, label: "Severe" }
  ],
  L4_LSAS_AVOID: [
    { v: 0, label: "Never (0%)" },
    { v: 1, label: "Occasionally (1–33%)" },
    { v: 2, label: "Often (34–66%)" },
    { v: 3, label: "Usually (67–100%)" }
  ],
  YN: [
    { v: 0, label: "No" },
    { v: 1, label: "Yes" }
  ],
  L4_AGREE: [
    { v: 0, label: "Definitely disagree" },
    { v: 1, label: "Slightly disagree" },
    { v: 2, label: "Slightly agree" },
    { v: 3, label: "Definitely agree" }
  ],
  AUDIT_FREQ: [
    { v: 0, label: "Never" },
    { v: 1, label: "Monthly or less" },
    { v: 2, label: "2–4 times a month" },
    { v: 3, label: "2–3 times a week" },
    { v: 4, label: "4+ times a week" }
  ],
  AUDIT_QTY: [
    { v: 0, label: "1 or 2" },
    { v: 1, label: "3 or 4" },
    { v: 2, label: "5 or 6" },
    { v: 3, label: "7 to 9" },
    { v: 4, label: "10 or more" }
  ],
  AUDIT_BINGE: [
    { v: 0, label: "Never" },
    { v: 1, label: "Less than monthly" },
    { v: 2, label: "Monthly" },
    { v: 3, label: "Weekly" },
    { v: 4, label: "Daily or almost daily" }
  ],
  YBOCS_SEV: [
    { v: 0, label: "None" },
    { v: 1, label: "Mild — less than 1 hr/day" },
    { v: 2, label: "Moderate — 1 to 3 hrs/day" },
    { v: 3, label: "Severe — 3 to 8 hrs/day" },
    { v: 4, label: "Extreme — more than 8 hrs/day" }
  ],
  YBOCS_INTERFERE: [
    { v: 0, label: "None" },
    { v: 1, label: "Mild, slight interference" },
    { v: 2, label: "Moderate, definite interference but manageable" },
    { v: 3, label: "Severe, substantial impairment" },
    { v: 4, label: "Extreme, incapacitating" }
  ],
  YBOCS_DISTRESS: [
    { v: 0, label: "None" },
    { v: 1, label: "Mild, infrequent and not too disturbing" },
    { v: 2, label: "Moderate, disturbing but manageable" },
    { v: 3, label: "Severe, very disturbing" },
    { v: 4, label: "Extreme, near-constant and disabling" }
  ],
  YBOCS_RESIST: [
    { v: 0, label: "Always make an effort to resist" },
    { v: 1, label: "Try to resist most of the time" },
    { v: 2, label: "Make some effort to resist" },
    { v: 3, label: "Yield to most without trying to control" },
    { v: 4, label: "Completely yield willingly" }
  ],
  YBOCS_CONTROL: [
    { v: 0, label: "Complete control" },
    { v: 1, label: "Much control, can usually stop with effort" },
    { v: 2, label: "Moderate control, sometimes can stop" },
    { v: 3, label: "Little control, rarely successful" },
    { v: 4, label: "No control, experienced as completely involuntary" }
  ],
  TIPI_7: [
    { v: 1, label: "Disagree strongly" },
    { v: 2, label: "Disagree moderately" },
    { v: 3, label: "Disagree a little" },
    { v: 4, label: "Neither agree nor disagree" },
    { v: 5, label: "Agree a little" },
    { v: 6, label: "Agree moderately" },
    { v: 7, label: "Agree strongly" }
  ],
  EAT_FREQ: [
    // EAT-26 uses 6-point but only top 3 are scored (Always=3, Usually=2, Often=1; rest=0)
    { v: 0, label: "Never" },
    { v: 0, label: "Rarely" },
    { v: 0, label: "Sometimes" },
    { v: 1, label: "Often" },
    { v: 2, label: "Usually" },
    { v: 3, label: "Always" }
  ],
  ISI_5: [
    { v: 0, label: "None" },
    { v: 1, label: "Mild" },
    { v: 2, label: "Moderate" },
    { v: 3, label: "Severe" },
    { v: 4, label: "Very severe" }
  ],
  ISI_SAT: [
    { v: 0, label: "Very satisfied" },
    { v: 1, label: "Satisfied" },
    { v: 2, label: "Moderately satisfied" },
    { v: 3, label: "Dissatisfied" },
    { v: 4, label: "Very dissatisfied" }
  ],
  ISI_INTERFERE: [
    { v: 0, label: "Not at all" },
    { v: 1, label: "A little" },
    { v: 2, label: "Somewhat" },
    { v: 3, label: "Much" },
    { v: 4, label: "Very much" }
  ],
  PHQ15_3: [
    { v: 0, label: "Not bothered at all" },
    { v: 1, label: "Bothered a little" },
    { v: 2, label: "Bothered a lot" }
  ],
  CONFIDENCE: [
    { v: 1, label: "Not at all sure" },
    { v: 2, label: "A little sure" },
    { v: 3, label: "Moderately sure" },
    { v: 4, label: "Quite sure" },
    { v: 5, label: "Very sure" }
  ]
};

/* ============================================================
   GATE INSTRUMENTS — short screens that branch into full forms
   ============================================================ */

const PHQ2 = {
  id: "PHQ2",
  name: "Depression Screen (PHQ-2)",
  scale: "L4",
  required: true,
  preface: "Over the last 2 weeks, how often have you been bothered by the following — the slow chill Wendy Torrance felt creeping through The Overlook long before she could name it:",
  items: [
    { id: "phq2_1", text: "Little interest or pleasure in doing things." },
    { id: "phq2_2", text: "Feeling down, depressed, or hopeless." }
  ],
  gateThreshold: 3,
  unlocks: ["PHQ9"]
};

const GAD2 = {
  id: "GAD2",
  name: "Anxiety Screen (GAD-2)",
  scale: "L4",
  required: true,
  preface: "Over the last 2 weeks, how often have you been bothered by the following — the kind of background hum Sidney Prescott lives inside even when the phone isn't ringing (Scream):",
  items: [
    { id: "gad2_1", text: "Feeling nervous, anxious, or on edge." },
    { id: "gad2_2", text: "Not being able to stop or control worrying." }
  ],
  gateThreshold: 3,
  unlocks: ["GAD7"]
};

const PC_PTSD = {
  id: "PC_PTSD",
  name: "Trauma Screen (PC-PTSD-5)",
  scale: "YN",
  required: true,
  preface: "Sometimes life hands you something you can't put down — the way grief became The Babadook for Amelia Vanek. In your life, have you ever had any experience that was so frightening, horrible, or upsetting that, in the past month, you...",
  items: [
    { id: "pcptsd_1", text: "Had nightmares about it or thought about it when you did not want to?" },
    { id: "pcptsd_2", text: "Tried hard not to think about it or went out of your way to avoid situations that reminded you of it?" },
    { id: "pcptsd_3", text: "Were constantly on guard, watchful, or easily startled?" },
    { id: "pcptsd_4", text: "Felt numb or detached from people, activities, or your surroundings?" },
    { id: "pcptsd_5", text: "Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?" }
  ],
  gateThreshold: 3,
  unlocks: ["PCL5_FULL", "DES_B"]
};

/* ============================================================
   FULL FORMS — unlocked by gates
   ============================================================ */

const PHQ9 = {
  id: "PHQ9",
  name: "Depression — PHQ-9",
  scale: "L4",
  preface: "Over the last 2 weeks, how often have you been bothered by any of the following — the heaviness Laurie Strode carries decades after that night in Haddonfield:",
  items: [
    { id: "phq9_1", text: "Little interest or pleasure in doing things — even the things you used to love.", reuses: "phq2_1" },
    { id: "phq9_2", text: "Feeling down, depressed, or hopeless.", reuses: "phq2_2" },
    { id: "phq9_3", text: "Trouble falling or staying asleep, or sleeping too much." },
    { id: "phq9_4", text: "Feeling tired or having little energy — the lead-weighted exhaustion Amelia carries through The Babadook, when even the basic motions of the day feel impossible." },
    { id: "phq9_5", text: "Poor appetite or overeating." },
    { id: "phq9_6", text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down." },
    { id: "phq9_7", text: "Trouble concentrating on things, such as reading, watching television, or following a conversation." },
    { id: "phq9_8", text: "Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual." },
    { id: "phq9_9", text: "Thoughts that you would be better off dead, or of hurting yourself in some way.", safetyFlag: "SI" }
  ]
};

const GAD7 = {
  id: "GAD7",
  name: "Anxiety — GAD-7",
  scale: "L4",
  preface: "Over the last 2 weeks, how often have you been bothered by the following — the Hereditary feeling that the floor could drop out at any moment:",
  items: [
    { id: "gad7_1", text: "Feeling nervous, anxious, or on edge.", reuses: "gad2_1" },
    { id: "gad7_2", text: "Not being able to stop or control worrying.", reuses: "gad2_2" },
    { id: "gad7_3", text: "Worrying too much about different things." },
    { id: "gad7_4", text: "Trouble relaxing." },
    { id: "gad7_5", text: "Being so restless that it's hard to sit still." },
    { id: "gad7_6", text: "Becoming easily annoyed or irritable." },
    { id: "gad7_7", text: "Feeling afraid as if something awful might happen — the Hereditary feeling that the floor is about to drop out." }
  ]
};

const PCL5_FULL = {
  id: "PCL5_FULL",
  name: "PTSD Symptoms — PCL-5 (full 20-item)",
  scale: "L5_PCL",
  preface: "Thinking about your worst stressful experience, in the past month how much were you bothered by — the kind of post-trauma residue Laurie Strode (Halloween), Sidney Prescott (Scream), and Nancy Thompson (A Nightmare on Elm Street) all carry:",
  items: [
    // Cluster B — Intrusion (5 items)
    { id: "pcl_1", text: "Repeated, disturbing, and unwanted memories of the stressful experience.", cluster: "B" },
    { id: "pcl_2", text: "Repeated, disturbing dreams of the stressful experience.", cluster: "B" },
    { id: "pcl_3", text: "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it).", cluster: "B" },
    { id: "pcl_4", text: "Feeling very upset when something reminded you of the stressful experience.", cluster: "B" },
    { id: "pcl_5", text: "Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating).", cluster: "B" },
    // Cluster C — Avoidance (2 items)
    { id: "pcl_6", text: "Avoiding memories, thoughts, or feelings related to the stressful experience.", cluster: "C" },
    { id: "pcl_7", text: "Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations).", cluster: "C" },
    // Cluster D — Negative alterations in cognition/mood (7 items)
    { id: "pcl_8", text: "Trouble remembering important parts of the stressful experience.", cluster: "D" },
    { id: "pcl_9", text: "Strong negative beliefs about yourself, other people, or the world (for example: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous).", cluster: "D" },
    { id: "pcl_10", text: "Blaming yourself or someone else for the stressful experience or what happened after it.", cluster: "D" },
    { id: "pcl_11", text: "Having strong negative feelings such as fear, horror, anger, guilt, or shame.", cluster: "D" },
    { id: "pcl_12", text: "Loss of interest in activities you used to enjoy.", cluster: "D" },
    { id: "pcl_13", text: "Feeling distant or cut off from other people.", cluster: "D" },
    { id: "pcl_14", text: "Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you).", cluster: "D" },
    // Cluster E — Hyperarousal (6 items)
    { id: "pcl_15", text: "Irritable behavior, angry outbursts, or acting aggressively.", cluster: "E" },
    { id: "pcl_16", text: "Taking too many risks or doing things that could cause you harm.", cluster: "E" },
    { id: "pcl_17", text: "Being 'super-alert' or watchful or on guard — the way Laurie Strode scans the upstairs hallway even decades later.", cluster: "E" },
    { id: "pcl_18", text: "Feeling jumpy or easily startled.", cluster: "E" },
    { id: "pcl_19", text: "Having difficulty concentrating.", cluster: "E" },
    { id: "pcl_20", text: "Trouble falling or staying asleep.", cluster: "E" }
  ]
};

const DES_B = {
  id: "DES_B",
  name: "Dissociation Brief — DES-B",
  scale: "L5",
  preface: "How often, in the past month, do you experience the following — the kind of slipping that Cole Sear knew well in The Sixth Sense, or the dissociative breaks Adelaide moves through in Us:",
  items: [
    { id: "des_1", text: "Finding yourself in a place and having no idea how you got there." },
    { id: "des_2", text: "Finding things among your belongings that you don't remember buying." },
    { id: "des_3", text: "Feeling like your body is not your own." },
    { id: "des_4", text: "Feeling that other people, objects, and the world around you are not real." },
    { id: "des_5", text: "Feeling as though you were standing next to yourself or watching yourself do something, as if you were looking at another person." },
    { id: "des_6", text: "Acting so differently in different situations that you feel like two different people." },
    { id: "des_7", text: "Hearing voices inside your head that tell you to do things or comment on things you are doing." },
    { id: "des_8", text: "Sometimes you remember a past event so vividly you feel as if you were reliving it." }
  ]
};

/* ============================================================
   STANDALONE SCREENS (no gating — always administered)
   ============================================================ */

const MSI_BPD = {
  id: "MSI_BPD",
  name: "Borderline Features — MSI-BPD",
  scale: "YN",
  preface: "Have any of the following been true for you for most of the past several years — the volatile attachment storms Annie Wilkes (Misery) navigates with Paul, the ones Pearl moves through on the farm:",
  items: [
    { id: "msi_1", text: "Have any of your closest relationships been troubled by a lot of arguments or repeated breakups?" },
    { id: "msi_2", text: "Have you deliberately hurt yourself physically (e.g., punched yourself, cut yourself, burned yourself)? Have you made a suicide attempt?", safetyFlag: "SH" },
    { id: "msi_3", text: "Have you had at least two other problems with impulsivity (e.g., eating binges, spending sprees, drinking too much, drug use, reckless driving, sexual impulsivity)?" },
    { id: "msi_4", text: "Have you been extremely moody?" },
    { id: "msi_5", text: "Have you felt very angry a lot of the time, or often acted in an angry or sarcastic manner?" },
    { id: "msi_6", text: "Have you often been distrustful of other people?" },
    { id: "msi_7", text: "Have you frequently felt unreal or as if things around you were unreal?" },
    { id: "msi_8", text: "Have you chronically felt empty?" },
    { id: "msi_9", text: "Have you often felt that you had no idea who you are or that you have no identity?" },
    { id: "msi_10", text: "Have you made desperate efforts to avoid feeling abandoned or being abandoned (e.g., repeatedly called someone to reassure yourself, came home early to avoid being alone, became very upset when someone canceled plans)?" }
  ]
};

const PID5_BF = {
  id: "PID5_BF",
  name: "Personality Domains — PID-5-BF (full 25-item)",
  scale: "L4_AGREE",
  preface: "How well does each statement describe you in general — the architecture of how you tend to move through the world (the difference between, say, Clarice Starling and Hannibal Lecter is mostly here):",
  items: [
    // Negative Affect (5)
    { id: "pid_neg1", text: "I worry about almost everything.", domain: "negativeAffect" },
    { id: "pid_neg2", text: "I get emotional easily, often for very little reason.", domain: "negativeAffect" },
    { id: "pid_neg3", text: "I fear being alone in life more than anything else.", domain: "negativeAffect" },
    { id: "pid_neg4", text: "I get stuck on one way of doing things, even when it's clear it won't work.", domain: "negativeAffect" },
    { id: "pid_neg5", text: "I have seen things that weren't really there.", domain: "negativeAffect" },
    // Detachment (5)
    { id: "pid_det1", text: "I don't get as much pleasure out of things as others seem to.", domain: "detachment" },
    { id: "pid_det2", text: "I keep to myself.", domain: "detachment" },
    { id: "pid_det3", text: "I steer clear of romantic relationships.", domain: "detachment" },
    { id: "pid_det4", text: "I'm not interested in making friends.", domain: "detachment" },
    { id: "pid_det5", text: "I rarely get enthusiastic about anything.", domain: "detachment" },
    // Antagonism (5)
    { id: "pid_ant1", text: "I'll do just about anything to get what I want.", domain: "antagonism" },
    { id: "pid_ant2", text: "Lying comes easily to me.", domain: "antagonism" },
    { id: "pid_ant3", text: "I use people to get what I want.", domain: "antagonism" },
    { id: "pid_ant4", text: "It's no big deal if I hurt other people's feelings.", domain: "antagonism" },
    { id: "pid_ant5", text: "I am pretty much in charge wherever I go.", domain: "antagonism" },
    // Disinhibition (5)
    { id: "pid_dis1", text: "I'm not good at planning ahead.", domain: "disinhibition" },
    { id: "pid_dis2", text: "I do what I want regardless of how unsafe it might be.", domain: "disinhibition" },
    { id: "pid_dis3", text: "I make impulsive decisions that I later regret.", domain: "disinhibition" },
    { id: "pid_dis4", text: "Even though I know better, I can't stop making rash decisions.", domain: "disinhibition" },
    { id: "pid_dis5", text: "People would describe me as reckless.", domain: "disinhibition" },
    // Psychoticism (5)
    { id: "pid_psy1", text: "I often have unusual experiences, such as sensing the presence of someone who isn't actually there.", domain: "psychoticism" },
    { id: "pid_psy2", text: "My thoughts often don't make sense to others.", domain: "psychoticism" },
    { id: "pid_psy3", text: "Sometimes I think someone else is putting thoughts into my head.", domain: "psychoticism" },
    { id: "pid_psy4", text: "Things around me often feel unreal, or more real than usual.", domain: "psychoticism" },
    { id: "pid_psy5", text: "I have some unusual abilities, like sometimes knowing exactly what someone is thinking.", domain: "psychoticism" }
  ]
};

const YBOCS_SR = {
  id: "YBOCS_SR",
  name: "OCD Severity — Y-BOCS-SR (full 10-item)",
  preface: "Regarding your obsessions (unwanted, intrusive thoughts) and compulsions (repetitive behaviors performed to reduce anxiety) over the past week — the way ritual and obsessive thought take over Beverly's life in IT, or the patriarchal rituals William enforces in The Witch:",
  items: [
    // Obsessions (5)
    { id: "ybocs_1", text: "Time occupied by obsessive thoughts: How much of your time is occupied by obsessive thoughts? How frequently do they occur?", scale: "YBOCS_SEV" },
    { id: "ybocs_2", text: "Interference from obsessions: How much do your obsessions interfere with your social, work, or role functioning?", scale: "YBOCS_INTERFERE" },
    { id: "ybocs_3", text: "Distress associated with obsessions: How much distress do your obsessive thoughts cause you?", scale: "YBOCS_DISTRESS" },
    { id: "ybocs_4", text: "Resistance against obsessions: How much effort do you make to resist the obsessive thoughts?", scale: "YBOCS_RESIST" },
    { id: "ybocs_5", text: "Degree of control over obsessive thoughts: How much control do you have over your obsessive thoughts?", scale: "YBOCS_CONTROL" },
    // Compulsions (5)
    { id: "ybocs_6", text: "Time spent performing compulsive behaviors: How much time do you spend performing compulsive behaviors?", scale: "YBOCS_SEV" },
    { id: "ybocs_7", text: "Interference from compulsive behaviors: How much do your compulsive behaviors interfere with social, work, or role functioning?", scale: "YBOCS_INTERFERE" },
    { id: "ybocs_8", text: "Distress associated with compulsions: How would you feel if prevented from performing your compulsion(s)? How anxious would you become?", scale: "YBOCS_DISTRESS" },
    { id: "ybocs_9", text: "Resistance against compulsions: How much effort do you make to resist the compulsions?", scale: "YBOCS_RESIST" },
    { id: "ybocs_10", text: "Degree of control over compulsive behavior: How strong is the drive to perform the compulsive behavior, and how much control do you have over it?", scale: "YBOCS_CONTROL" }
  ]
};

const AUDIT_C = {
  id: "AUDIT_C",
  name: "Alcohol Use — AUDIT-C",
  preface: "About your drinking patterns over the past year — the kind of accounting Jack Torrance was trying to avoid in The Shining, the bottle Steve Graham keeps reaching for in Hereditary:",
  items: [
    { id: "audit_1", text: "How often do you have a drink containing alcohol?", scale: "AUDIT_FREQ" },
    { id: "audit_2", text: "How many standard drinks containing alcohol do you have on a typical day when you are drinking?", scale: "AUDIT_QTY" },
    { id: "audit_3", text: "How often do you have six or more drinks on one occasion?", scale: "AUDIT_BINGE" }
  ]
};

const ASRS_5 = {
  id: "ASRS_5",
  name: "Adult ADHD — ASRS v1.1 (Part A, 6 items)",
  scale: "L5",
  preface: "How often have you experienced the following over the past 6 months — the kind of attention-scattering that gets characters in Scream and Final Destination into trouble in the first place:",
  items: [
    { id: "asrs_1", text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
    { id: "asrs_2", text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
    { id: "asrs_3", text: "How often do you have problems remembering appointments or obligations?" },
    { id: "asrs_4", text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
    { id: "asrs_5", text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
    { id: "asrs_6", text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?" }
  ]
};

const LSAS_FULL = {
  id: "LSAS_FULL",
  name: "Social Anxiety — LSAS (full 24-situation, fear ratings)",
  scale: "L4_LSAS_FEAR",
  preface: "Over the past week, rate how much fear or anxiety you experience in each situation — the kind of social-survival math Eleanor Vance runs every time she enters a room (The Haunting), or Carrie White bracing for prom:",
  items: [
    { id: "lsas_1", text: "Telephoning in public." },
    { id: "lsas_2", text: "Participating in small groups." },
    { id: "lsas_3", text: "Eating in public places." },
    { id: "lsas_4", text: "Drinking with others in public places." },
    { id: "lsas_5", text: "Talking to people in authority." },
    { id: "lsas_6", text: "Acting, performing, or giving a talk in front of an audience." },
    { id: "lsas_7", text: "Going to a party." },
    { id: "lsas_8", text: "Working while being observed." },
    { id: "lsas_9", text: "Writing while being observed." },
    { id: "lsas_10", text: "Calling someone you don't know very well." },
    { id: "lsas_11", text: "Talking with people you don't know very well." },
    { id: "lsas_12", text: "Meeting strangers." },
    { id: "lsas_13", text: "Urinating in a public bathroom." },
    { id: "lsas_14", text: "Entering a room when others are already seated." },
    { id: "lsas_15", text: "Being the center of attention." },
    { id: "lsas_16", text: "Speaking up at a meeting." },
    { id: "lsas_17", text: "Taking a test of your ability, skill, or knowledge." },
    { id: "lsas_18", text: "Expressing disagreement or disapproval to someone you don't know very well." },
    { id: "lsas_19", text: "Looking someone who you don't know very well straight in the eyes." },
    { id: "lsas_20", text: "Giving a prepared oral talk to a group." },
    { id: "lsas_21", text: "Trying to make someone's romantic or sexual interest." },
    { id: "lsas_22", text: "Returning goods to a store for a refund." },
    { id: "lsas_23", text: "Giving a party." },
    { id: "lsas_24", text: "Resisting a high-pressure salesperson." }
  ]
};

const ACE_10 = {
  id: "ACE_10",
  name: "Adverse Childhood Experiences — ACE-10",
  scale: "YN",
  preface: "Before age 18, did any of the following occur — the family-of-origin material that haunts Carrie White, the Graham family in Hereditary, and the Sawyer household in The Texas Chain Saw Massacre:",
  items: [
    { id: "ace_1", text: "A parent or other adult swore at you, insulted you, put you down, or humiliated you — or acted in a way that made you afraid you might be physically hurt." },
    { id: "ace_2", text: "A parent or other adult pushed, grabbed, slapped, threw something at you, or hit you so hard you had marks or were injured." },
    { id: "ace_3", text: "An adult or person at least 5 years older touched or fondled you, or had you touch their body in a sexual way — or attempted/had oral, anal, or vaginal intercourse with you." },
    { id: "ace_4", text: "You felt that no one in your family loved you or thought you were important — or your family didn't look out for or support each other." },
    { id: "ace_5", text: "You didn't have enough to eat, had to wear dirty clothes, or had no one to protect you — or your parents were too drunk/high to care for you." },
    { id: "ace_6", text: "Your parents were separated or divorced." },
    { id: "ace_7", text: "Your mother or stepmother was pushed, grabbed, slapped, kicked, bitten, hit with a fist or hard object, or threatened with a weapon." },
    { id: "ace_8", text: "You lived with anyone who was a problem drinker, alcoholic, or used street drugs." },
    { id: "ace_9", text: "A household member was depressed, mentally ill, or attempted suicide." },
    { id: "ace_10", text: "A household member went to prison." }
  ]
};

const AQ_10 = {
  id: "AQ_10",
  name: "Autism Spectrum Screen — AQ-10",
  scale: "L4_AGREE",
  preface: "How much do you agree with each statement — the cognitive architecture that makes some of horror's so-called 'strange ones' (Eli in Let the Right One In, Carrie White, the misunderstood teen in May) simply differently-wired:",
  items: [
    { id: "aq_1", text: "I often notice small sounds when others do not.", scoredHigh: true },
    { id: "aq_2", text: "I usually concentrate more on the whole picture, rather than the small details.", scoredHigh: false },
    { id: "aq_3", text: "I find it easy to do more than one thing at once.", scoredHigh: false },
    { id: "aq_4", text: "If there is an interruption, I can switch back to what I was doing very quickly.", scoredHigh: false },
    { id: "aq_5", text: "I find it easy to 'read between the lines' when someone is talking to me.", scoredHigh: false },
    { id: "aq_6", text: "I know how to tell if someone listening to me is getting bored.", scoredHigh: false },
    { id: "aq_7", text: "When I'm reading a story, I find it difficult to work out the characters' intentions.", scoredHigh: true },
    { id: "aq_8", text: "I like to collect information about categories of things (e.g., types of car, bird, train, plant).", scoredHigh: true },
    { id: "aq_9", text: "I find it easy to work out what someone is thinking or feeling just by looking at their face.", scoredHigh: false },
    { id: "aq_10", text: "I find it difficult to work out people's intentions.", scoredHigh: true }
  ]
};

const MDQ = {
  id: "MDQ",
  name: "Mood Disorder Questionnaire (MDQ) — Bipolar Screen",
  scale: "YN",
  preface: "Has there ever been a period of time when you were not your usual self and... — the kind of magnificent, dangerous altitude Pearl reaches before everything turns, or Jack Torrance's unsleeping creative surges before the descent:",
  items: [
    { id: "mdq_1", text: "...you felt so good or so hyper that other people thought you were not your normal self, or you were so hyper that you got into trouble?" },
    { id: "mdq_2", text: "...you were so irritable that you shouted at people or started fights or arguments?" },
    { id: "mdq_3", text: "...you felt much more self-confident than usual?" },
    { id: "mdq_4", text: "...you got much less sleep than usual and found you didn't really miss it?" },
    { id: "mdq_5", text: "...you were much more talkative or spoke faster than usual?" },
    { id: "mdq_6", text: "...thoughts raced through your head or you couldn't slow your mind down?" },
    { id: "mdq_7", text: "...you were so easily distracted by things around you that you had trouble concentrating or staying on track?" },
    { id: "mdq_8", text: "...you had much more energy than usual?" },
    { id: "mdq_9", text: "...you were much more active or did many more things than usual?" },
    { id: "mdq_10", text: "...you were much more social or outgoing than usual?" },
    { id: "mdq_11", text: "...you were much more interested in sex than usual?" },
    { id: "mdq_12", text: "...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?" },
    { id: "mdq_13", text: "...spending money got you or your family into trouble?" }
  ]
};

const TIPI = {
  id: "TIPI",
  name: "Personality — Big Five (TIPI)",
  scale: "TIPI_7",
  preface: "Below are pairs of traits that may or may not apply to you. Rate the extent to which the pair applies to you, even if one trait applies more strongly than the other. The differences between, say, Laurie Strode (cautious, dependable) and Pearl (volatile, dramatic) are mostly captured by these five dimensions:",
  items: [
    { id: "tipi_1", text: "Extraverted, enthusiastic.", domain: "extraversion", reversed: false },
    { id: "tipi_2", text: "Critical, quarrelsome.", domain: "agreeableness", reversed: true },
    { id: "tipi_3", text: "Dependable, self-disciplined.", domain: "conscientiousness", reversed: false },
    { id: "tipi_4", text: "Anxious, easily upset.", domain: "neuroticism", reversed: false },
    { id: "tipi_5", text: "Open to new experiences, complex.", domain: "openness", reversed: false },
    { id: "tipi_6", text: "Reserved, quiet.", domain: "extraversion", reversed: true },
    { id: "tipi_7", text: "Sympathetic, warm.", domain: "agreeableness", reversed: false },
    { id: "tipi_8", text: "Disorganized, careless.", domain: "conscientiousness", reversed: true },
    { id: "tipi_9", text: "Calm, emotionally stable.", domain: "neuroticism", reversed: true },
    { id: "tipi_10", text: "Conventional, uncreative.", domain: "openness", reversed: true }
  ]
};

const EAT_26 = {
  id: "EAT_26",
  name: "Eating Attitudes — EAT-26",
  scale: "EAT_FREQ",
  preface: "How often, over the past 6 months, have the following been true — the kind of relationship-with-the-body that Nina Sayers and the dancers in Suspiria knew well, where control becomes its own demand:",
  items: [
    { id: "eat_1", text: "Am terrified about being overweight." },
    { id: "eat_2", text: "Avoid eating when I am hungry." },
    { id: "eat_3", text: "Find myself preoccupied with food." },
    { id: "eat_4", text: "Have gone on eating binges where I feel I may not be able to stop." },
    { id: "eat_5", text: "Cut my food into small pieces." },
    { id: "eat_6", text: "Aware of the calorie content of foods that I eat." },
    { id: "eat_7", text: "Particularly avoid food with a high carbohydrate content (e.g., bread, rice, potatoes)." },
    { id: "eat_8", text: "Feel that others would prefer if I ate more." },
    { id: "eat_9", text: "Vomit after I have eaten." },
    { id: "eat_10", text: "Feel extremely guilty after eating." },
    { id: "eat_11", text: "Am preoccupied with a desire to be thinner." },
    { id: "eat_12", text: "Think about burning up calories when I exercise." },
    { id: "eat_13", text: "Other people think that I am too thin." },
    { id: "eat_14", text: "Am preoccupied with the thought of having fat on my body." },
    { id: "eat_15", text: "Take longer than others to eat my meals." },
    { id: "eat_16", text: "Avoid foods with sugar in them." },
    { id: "eat_17", text: "Eat diet foods." },
    { id: "eat_18", text: "Feel that food controls my life." },
    { id: "eat_19", text: "Display self-control around food." },
    { id: "eat_20", text: "Feel that others pressure me to eat." },
    { id: "eat_21", text: "Give too much time and thought to food." },
    { id: "eat_22", text: "Feel uncomfortable after eating sweets." },
    { id: "eat_23", text: "Engage in dieting behavior." },
    { id: "eat_24", text: "Like my stomach to be empty." },
    { id: "eat_25", text: "Have the impulse to vomit after meals." },
    { id: "eat_26", text: "Enjoy trying new rich foods.", reverseScored: true }
  ]
};

const DAST_10 = {
  id: "DAST_10",
  name: "Drug Use — DAST-10",
  scale: "YN",
  preface: "About your drug use over the past year — these questions concern non-medical use of illegal drugs OR misuse of prescription medications:",
  items: [
    { id: "dast_1", text: "Have you used drugs other than those required for medical reasons?" },
    { id: "dast_2", text: "Do you abuse more than one drug at a time?" },
    { id: "dast_3", text: "Are you always able to stop using drugs when you want to?", reverseScored: true },
    { id: "dast_4", text: "Have you had blackouts or flashbacks as a result of drug use?" },
    { id: "dast_5", text: "Do you ever feel bad or guilty about your drug use?" },
    { id: "dast_6", text: "Does your spouse (or parents) ever complain about your involvement with drugs?" },
    { id: "dast_7", text: "Have you neglected your family because of your use of drugs?" },
    { id: "dast_8", text: "Have you engaged in illegal activities in order to obtain drugs?" },
    { id: "dast_9", text: "Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?" },
    { id: "dast_10", text: "Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding)?" }
  ]
};

const ISI = {
  id: "ISI",
  name: "Insomnia — ISI",
  preface: "About your sleep over the past 2 weeks — the kind of restless nights Mike Enslin had in 1408, the wide-eyed alertness Father Karras carried after Damien:",
  items: [
    { id: "isi_1", text: "Difficulty falling asleep.", scale: "ISI_5" },
    { id: "isi_2", text: "Difficulty staying asleep.", scale: "ISI_5" },
    { id: "isi_3", text: "Problem waking up too early.", scale: "ISI_5" },
    { id: "isi_4", text: "How satisfied/dissatisfied are you with your current sleep pattern?", scale: "ISI_SAT" },
    { id: "isi_5", text: "How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?", scale: "ISI_INTERFERE" },
    { id: "isi_6", text: "How worried/distressed are you about your current sleep problem?", scale: "ISI_INTERFERE" },
    { id: "isi_7", text: "To what extent do you consider your sleep problem to interfere with your daily functioning (e.g., daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, mood, etc.)?", scale: "ISI_INTERFERE" }
  ]
};

const CSSRS = {
  id: "CSSRS",
  name: "Suicide Risk — C-SSRS Screener",
  scale: "YN",
  preface: "These questions ask about suicidal thoughts and behavior. Please answer honestly — endorsing any of these items will surface immediate safety resources at the top of your report.",
  items: [
    { id: "cssrs_1", text: "In the past month, have you wished you were dead or wished you could go to sleep and not wake up?", safetyFlag: "SI_PASSIVE" },
    { id: "cssrs_2", text: "In the past month, have you actually had any thoughts of killing yourself?", safetyFlag: "SI_ACTIVE" },
    { id: "cssrs_3", text: "In the past month, have you been thinking about how you might do this?", safetyFlag: "SI_METHOD" },
    { id: "cssrs_4", text: "In the past month, have you had these thoughts and had some intention of acting on them?", safetyFlag: "SI_INTENT" },
    { id: "cssrs_5", text: "In the past month, have you started to work out or worked out the details of how to kill yourself? Did you intend to carry out this plan?", safetyFlag: "SI_PLAN" },
    { id: "cssrs_6", text: "Have you ever done anything, started to do anything, or prepared to do anything to end your life? (Examples: collected pills, obtained a gun, gave away valuables, wrote a suicide note, took out pills but didn't swallow any, held a gun but changed your mind or it was grabbed from your hand, went to the roof but didn't jump; or actually took pills, tried to shoot yourself, cut yourself, tried to hang yourself, etc.)", safetyFlag: "SI_BEHAVIOR" }
  ]
};

const SPQ_B = {
  id: "SPQ_B",
  name: "Schizotypal Traits — SPQ-Brief",
  scale: "YN",
  preface: "Please answer the following questions yes or no — these tap unusual perceptual experiences, interpersonal patterns, and cognitive style. Many people endorse some of these without it being clinically concerning; the pattern across all items matters more than any single one. (The territory the Sixth Sense and Hereditary explore — uncanny perception, social difference, magical thinking.)",
  items: [
    // Cognitive-Perceptual (8)
    { id: "spq_1", text: "Have you ever had the sense that some person or force is around you, even though you cannot see anyone?", domain: "cognitive_perceptual" },
    { id: "spq_2", text: "When shopping, do you get the feeling that other people are taking notice of you?", domain: "cognitive_perceptual" },
    { id: "spq_3", text: "Have you ever noticed a common event or object that seemed to be a special sign for you?", domain: "cognitive_perceptual" },
    { id: "spq_4", text: "Are you sometimes sure that other people can tell what you are thinking?", domain: "cognitive_perceptual" },
    { id: "spq_5", text: "Have you ever felt that you are communicating with another person telepathically (by mind-reading)?", domain: "cognitive_perceptual" },
    { id: "spq_6", text: "Do everyday things seem unusually large or small?", domain: "cognitive_perceptual" },
    { id: "spq_7", text: "Do you often hear a voice speaking your thoughts aloud?", domain: "cognitive_perceptual" },
    { id: "spq_8", text: "When you look at a person, or yourself in a mirror, have you ever seen the face change right before your eyes?", domain: "cognitive_perceptual" },
    // Interpersonal (8)
    { id: "spq_9", text: "Do you sometimes feel that people are talking about you?", domain: "interpersonal" },
    { id: "spq_10", text: "Are you sometimes sure that other people can be trusted?", domain: "interpersonal", reverseScored: true },
    { id: "spq_11", text: "Do you find it hard to be emotionally close to other people?", domain: "interpersonal" },
    { id: "spq_12", text: "Do you find that it is best not to let other people know too much about you?", domain: "interpersonal" },
    { id: "spq_13", text: "Do you feel that you cannot get 'close' to people?", domain: "interpersonal" },
    { id: "spq_14", text: "Are your emotions sometimes muted, lacking depth?", domain: "interpersonal" },
    { id: "spq_15", text: "Do you feel very uncomfortable in social situations involving unfamiliar people?", domain: "interpersonal" },
    { id: "spq_16", text: "Have you found that it is best to be neutral when expressing emotions?", domain: "interpersonal" },
    // Disorganized (6)
    { id: "spq_17", text: "Do people sometimes find you aloof and distant?", domain: "disorganized" },
    { id: "spq_18", text: "Do people sometimes find you eccentric or odd?", domain: "disorganized" },
    { id: "spq_19", text: "Do you sometimes use words in unusual ways?", domain: "disorganized" },
    { id: "spq_20", text: "Are there times when you feel suddenly distracted by distant sounds you are not normally aware of?", domain: "disorganized" },
    { id: "spq_21", text: "Do you tend to wander off the topic when having a conversation?", domain: "disorganized" },
    { id: "spq_22", text: "Do you often feel that other people have it in for you?", domain: "disorganized" }
  ]
};

const PHQ15 = {
  id: "PHQ15",
  name: "Somatic Symptoms — PHQ-15",
  scale: "PHQ15_3",
  preface: "During the past 4 weeks, how much have you been bothered by any of the following physical complaints — the way the body becomes the site of horror in films like The Fly, Possessor, or Hereditary, where psychological pain takes physical form:",
  items: [
    { id: "phq15_1", text: "Stomach pain." },
    { id: "phq15_2", text: "Back pain." },
    { id: "phq15_3", text: "Pain in your arms, legs, or joints (knees, hips, etc.)." },
    { id: "phq15_4", text: "Menstrual cramps or other problems with your periods. (If applicable; otherwise mark 'Not bothered'.)" },
    { id: "phq15_5", text: "Headaches." },
    { id: "phq15_6", text: "Chest pain." },
    { id: "phq15_7", text: "Dizziness." },
    { id: "phq15_8", text: "Fainting spells." },
    { id: "phq15_9", text: "Feeling your heart pound or race." },
    { id: "phq15_10", text: "Shortness of breath." },
    { id: "phq15_11", text: "Pain or problems during sexual intercourse." },
    { id: "phq15_12", text: "Constipation, loose bowels, or diarrhea." },
    { id: "phq15_13", text: "Nausea, gas, or indigestion." },
    { id: "phq15_14", text: "Feeling tired or having low energy." },
    { id: "phq15_15", text: "Trouble sleeping." }
  ]
};

const BPS_INTAKE = {
  id: "BPS_INTAKE",
  name: "Biopsychosocial Intake",
  preface: "A few brief questions about your context — these don't affect your character match but inform the clinical formulation. All optional; pick 'Prefer not to say' if you'd rather skip an item.",
  items: [
    { id: "bps_age", text: "Your age range:", scale: [
      { v: 0, label: "Under 18" }, { v: 1, label: "18–24" }, { v: 2, label: "25–34" },
      { v: 3, label: "35–44" }, { v: 4, label: "45–54" }, { v: 5, label: "55–64" },
      { v: 6, label: "65+" }, { v: 7, label: "Prefer not to say" }
    ] },
    { id: "bps_gender", text: "Gender identity (best fit):", scale: [
      { v: 0, label: "Woman" }, { v: 1, label: "Man" }, { v: 2, label: "Non-binary / genderqueer" },
      { v: 3, label: "Trans woman" }, { v: 4, label: "Trans man" }, { v: 5, label: "Other / self-describe" },
      { v: 6, label: "Prefer not to say" }
    ] },
    { id: "bps_living", text: "Your current housing situation:", scale: [
      { v: 0, label: "Stable / safe" }, { v: 1, label: "Stable but stressful" },
      { v: 2, label: "Unstable / at risk" }, { v: 3, label: "Currently unhoused" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_support", text: "How would you describe your social support right now?", scale: [
      { v: 0, label: "Strong — multiple close people I can rely on" },
      { v: 1, label: "Moderate — at least one or two close people" },
      { v: 2, label: "Limited — mostly acquaintances, little close support" },
      { v: 3, label: "Isolated — few or no close connections" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_stressors", text: "In the past 6 months, have you experienced any major life stressors (death of a loved one, job loss, divorce/breakup, serious illness, financial crisis, legal issue, move, etc.)?", scale: [
      { v: 0, label: "None significant" },
      { v: 1, label: "One major stressor" },
      { v: 2, label: "Multiple stressors" },
      { v: 3, label: "Cascading / overwhelming" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_treatment", text: "Have you received mental health treatment in the past?", scale: [
      { v: 0, label: "Never" },
      { v: 1, label: "Yes, in the past — not currently" },
      { v: 2, label: "Yes, currently in treatment" },
      { v: 3, label: "Wanted to, but couldn't access it" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_medication", text: "Are you currently taking any psychiatric medications?", scale: [
      { v: 0, label: "No" },
      { v: 1, label: "Yes — and they help" },
      { v: 2, label: "Yes — but unsure if they help" },
      { v: 3, label: "Yes — but they don't seem to be working" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_family_hx", text: "Family mental health history (parents, siblings, grandparents) — best fit:", scale: [
      { v: 0, label: "No known history" },
      { v: 1, label: "One relative with a mood/anxiety condition" },
      { v: 2, label: "Multiple relatives or one with severe condition (e.g., bipolar, psychosis, suicide)" },
      { v: 3, label: "Pervasive family mental health concerns across generations" },
      { v: 4, label: "Don't know / prefer not to say" }
    ] },
    { id: "bps_developmental", text: "Were there significant developmental concerns in your childhood (delays, learning differences, frequent moves, parental separation under age 5, medical illness, etc.)?", scale: [
      { v: 0, label: "No significant concerns" },
      { v: 1, label: "Some, but mostly resolved" },
      { v: 2, label: "Yes — ongoing impact" },
      { v: 3, label: "Yes — major developmental disruption" },
      { v: 4, label: "Don't know / prefer not to say" }
    ] },
    { id: "bps_substance_hx", text: "Substance use history — your sense of it:", scale: [
      { v: 0, label: "No history of problematic use" },
      { v: 1, label: "Past problematic use, currently not using or controlled" },
      { v: 2, label: "Currently use; sometimes worry about it" },
      { v: 3, label: "Currently use; significantly affects my life" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_medical", text: "Significant current medical conditions (chronic pain, autoimmune, neurological, endocrine, etc.):", scale: [
      { v: 0, label: "None" },
      { v: 1, label: "One stable condition" },
      { v: 2, label: "Multiple or one significant condition" },
      { v: 3, label: "Major impact on daily life" },
      { v: 4, label: "Prefer not to say" }
    ] },
    { id: "bps_horror_fan", text: "How well do you know horror cinema? (This affects how much your match will resonate.)", scale: [
      { v: 0, label: "Casual — I know the famous ones" },
      { v: 1, label: "Comfortable — I watch horror regularly" },
      { v: 2, label: "Devoted — horror is a primary interest" },
      { v: 3, label: "Scholar — I know the obscure stuff too" }
    ] }
  ]
};

const FUNCTIONAL = {
  id: "FUNCTIONAL",
  name: "Functional Impairment & Context",
  scale: "L5",
  preface: "Over the past month, how much have your concerns interfered with the actual machinery of your life:",
  items: [
    { id: "func_1", text: "Your work or school performance." },
    { id: "func_2", text: "Your close relationships." },
    { id: "func_3", text: "Your social life." },
    { id: "func_4", text: "Your ability to take care of yourself (sleep, nutrition, hygiene)." },
    { id: "func_5", text: "Your sense of who you are or what your life is about." }
  ]
};

/* ============================================================
   BATTERY ORDER & GATING LOGIC
   ============================================================ */

const BATTERY = {
  // Phase 1: gates (always administered)
  gates: [PHQ2, GAD2, PC_PTSD],

  // Phase 2: standalone (always administered) — biopsychosocial intake first to set context
  standalone: [BPS_INTAKE, MSI_BPD, PID5_BF, TIPI, YBOCS_SR, AUDIT_C, DAST_10, ASRS_5, LSAS_FULL, ISI, PHQ15, EAT_26, SPQ_B, ACE_10, AQ_10, MDQ, FUNCTIONAL],

  // Phase 3: conditional (unlocked by gates)
  conditional: {
    PHQ9: PHQ9,
    GAD7: GAD7,
    PCL5_FULL: PCL5_FULL,
    DES_B: DES_B,
    CSSRS: CSSRS  // unlocked when PHQ-9 item 9 is endorsed (>0)
  },

  // Build the full administered list given gate scores
  buildAdministered(gateScores) {
    const list = [...this.gates, ...this.standalone];
    const unlocked = new Set();
    if ((gateScores.PHQ2 || 0) >= PHQ2.gateThreshold) unlocked.add("PHQ9");
    if ((gateScores.GAD2 || 0) >= GAD2.gateThreshold) unlocked.add("GAD7");
    if ((gateScores.PC_PTSD || 0) >= PC_PTSD.gateThreshold) {
      unlocked.add("PCL5_FULL");
      unlocked.add("DES_B");
    }
    unlocked.forEach(id => list.push(this.conditional[id]));
    return { list, unlocked: [...unlocked] };
  },

  // Returns C-SSRS instrument if SI is endorsed (called dynamically during battery)
  getSICondiCSSRS(responses) {
    const phq9_9 = responses.phq9_9;
    const msi_2 = responses.msi_2;
    const cssrs_already = responses.cssrs_1 !== undefined;
    if (cssrs_already) return null;
    if ((phq9_9 != null && phq9_9 > 0) || (msi_2 != null && msi_2 > 0)) {
      return CSSRS;
    }
    return null;
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    RESPONSE_SCALES, BATTERY,
    PHQ2, GAD2, PC_PTSD, PHQ9, GAD7, PCL5_FULL, DES_B,
    MSI_BPD, PID5_BF, TIPI, YBOCS_SR, AUDIT_C, ASRS_5, LSAS_FULL, ACE_10, AQ_10, MDQ, FUNCTIONAL,
    EAT_26, DAST_10, ISI, CSSRS, SPQ_B, PHQ15, BPS_INTAKE
  };
}
