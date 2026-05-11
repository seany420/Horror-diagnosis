/* ============================================================
   SCREAM PROFILE — DIAGNOSTIC ENGINE
   ============================================================
   Computes:
   - Per-instrument scores with clinical cutoffs
   - Per-disorder evidence weights with normalized signal
   - DSM-5-TR criteria walkthrough per flagged condition
   - Severity, differentials, rule-outs
   - Top-3 character matches with % confidence (softmax-derived)
   ============================================================ */

/* ============================================================
   SECTION 1 — SCORING FUNCTIONS PER INSTRUMENT
   ============================================================ */

function score_PHQ2(responses) {
  const sum = (responses.phq2_1 || 0) + (responses.phq2_2 || 0);
  return { total: sum, positive: sum >= 3 };
}

function score_GAD2(responses) {
  const sum = (responses.gad2_1 || 0) + (responses.gad2_2 || 0);
  return { total: sum, positive: sum >= 3 };
}

function score_PCPTSD(responses) {
  const items = ["pcptsd_1","pcptsd_2","pcptsd_3","pcptsd_4","pcptsd_5"];
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  return { total: sum, positive: sum >= 3 };
}

function score_PHQ9(responses) {
  // PHQ9 reuses phq2_1 -> phq9_1, phq2_2 -> phq9_2
  const map = {
    phq9_1: responses.phq2_1 ?? responses.phq9_1 ?? 0,
    phq9_2: responses.phq2_2 ?? responses.phq9_2 ?? 0,
    phq9_3: responses.phq9_3 ?? 0,
    phq9_4: responses.phq9_4 ?? 0,
    phq9_5: responses.phq9_5 ?? 0,
    phq9_6: responses.phq9_6 ?? 0,
    phq9_7: responses.phq9_7 ?? 0,
    phq9_8: responses.phq9_8 ?? 0,
    phq9_9: responses.phq9_9 ?? 0
  };
  const total = Object.values(map).reduce((a,b)=>a+b, 0);
  let severity = "Minimal";
  if (total >= 20) severity = "Severe";
  else if (total >= 15) severity = "Moderately Severe";
  else if (total >= 10) severity = "Moderate";
  else if (total >= 5) severity = "Mild";
  // DSM-5-TR MDD criteria (≥5 of 9, with at least one core)
  const coreMet = (map.phq9_1 >= 2) || (map.phq9_2 >= 2);
  const criteriaMet = Object.values(map).filter(v => v >= 2).length;
  return {
    total, severity,
    coreMet, criteriaMet,
    meetsMDDCriteria: coreMet && criteriaMet >= 5,
    siFlag: map.phq9_9 >= 1,
    breakdown: map
  };
}

function score_GAD7(responses) {
  const map = {
    gad7_1: responses.gad2_1 ?? responses.gad7_1 ?? 0,
    gad7_2: responses.gad2_2 ?? responses.gad7_2 ?? 0,
    gad7_3: responses.gad7_3 ?? 0,
    gad7_4: responses.gad7_4 ?? 0,
    gad7_5: responses.gad7_5 ?? 0,
    gad7_6: responses.gad7_6 ?? 0,
    gad7_7: responses.gad7_7 ?? 0
  };
  const total = Object.values(map).reduce((a,b)=>a+b, 0);
  let severity = "Minimal";
  if (total >= 15) severity = "Severe";
  else if (total >= 10) severity = "Moderate";
  else if (total >= 5) severity = "Mild";
  return { total, severity, breakdown: map };
}

function score_PCL5_Brief(responses) {
  // Renamed conceptually but kept function name for backward compatibility.
  // Now scores the FULL PCL-5 (20 items, range 0–80).
  // Cluster mapping (per DSM-5):
  //   B (Intrusion): pcl_1–pcl_5
  //   C (Avoidance): pcl_6–pcl_7
  //   D (Negative cog/mood): pcl_8–pcl_14
  //   E (Hyperarousal): pcl_15–pcl_20
  const allItems = [];
  for (let i = 1; i <= 20; i++) allItems.push(`pcl_${i}`);
  const total = allItems.reduce((a,k) => a + (responses[k] || 0), 0);

  const itemAtThreshold = (k) => (responses[k] || 0) >= 2;
  const clusterB_items = ["pcl_1","pcl_2","pcl_3","pcl_4","pcl_5"];
  const clusterC_items = ["pcl_6","pcl_7"];
  const clusterD_items = ["pcl_8","pcl_9","pcl_10","pcl_11","pcl_12","pcl_13","pcl_14"];
  const clusterE_items = ["pcl_15","pcl_16","pcl_17","pcl_18","pcl_19","pcl_20"];

  const clusterB = clusterB_items.filter(itemAtThreshold).length;
  const clusterC = clusterC_items.filter(itemAtThreshold).length;
  const clusterD = clusterD_items.filter(itemAtThreshold).length;
  const clusterE = clusterE_items.filter(itemAtThreshold).length;

  // DSM-5 PTSD criteria: ≥1 in B, ≥1 in C, ≥2 in D, ≥2 in E (each item ≥2 = "moderately" or higher)
  const meetsCriteria = clusterB >= 1 && clusterC >= 1 && clusterD >= 2 && clusterE >= 2;

  // Total score interpretation (full PCL-5):
  //   <33 = below provisional cutoff
  //   33+ = provisional PTSD diagnosis (most cited cutoff)
  let severity = "Minimal";
  if (total >= 50) severity = "Severe (probable PTSD)";
  else if (total >= 33) severity = "Moderate-Severe (provisional PTSD)";
  else if (total >= 20) severity = "Moderate";
  else if (total >= 10) severity = "Mild subthreshold";

  return { total, severity, meetsCriteria, clusters: { B: clusterB, C: clusterC, D: clusterD, E: clusterE } };
}

function score_DESB(responses) {
  const items = ["des_1","des_2","des_3","des_4","des_5","des_6","des_7","des_8"];
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  const mean = sum / items.length;
  let severity = "Minimal";
  if (mean >= 3.0) severity = "Severe";
  else if (mean >= 2.0) severity = "Moderate";
  else if (mean >= 1.0) severity = "Mild";
  return { mean: Number(mean.toFixed(2)), severity };
}

function score_MSI(responses) {
  const items = ["msi_1","msi_2","msi_3","msi_4","msi_5","msi_6","msi_7","msi_8","msi_9","msi_10"];
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  return {
    total: sum,
    positive: sum >= 7,
    selfHarmFlag: (responses.msi_2 || 0) === 1
  };
}

function score_PID5(responses) {
  // Full PID-5-BF: 25 items, 5 items per domain, range 0–15 per domain.
  // Each item rated 0–3 on Likert scale (Definitely Disagree → Definitely Agree).
  const sumDomain = (prefix) => {
    let s = 0;
    for (let i = 1; i <= 5; i++) s += (responses[`${prefix}${i}`] || 0);
    return s;
  };
  return {
    negativeAffect: sumDomain("pid_neg"),
    detachment: sumDomain("pid_det"),
    antagonism: sumDomain("pid_ant"),
    disinhibition: sumDomain("pid_dis"),
    psychoticism: sumDomain("pid_psy"),
    domainMax: 15
  };
}

function score_YBOCS(responses) {
  // Full Y-BOCS-SR: 10 items, 5 obsessions + 5 compulsions, each scored 0–4, total 0–40.
  const obsItems = ["ybocs_1","ybocs_2","ybocs_3","ybocs_4","ybocs_5"];
  const compItems = ["ybocs_6","ybocs_7","ybocs_8","ybocs_9","ybocs_10"];
  const obsessionsScore = obsItems.reduce((a,k) => a + (responses[k] || 0), 0);
  const compulsionsScore = compItems.reduce((a,k) => a + (responses[k] || 0), 0);
  const sum = obsessionsScore + compulsionsScore;
  // Standard severity bands (Y-BOCS):
  //   0–7   = subclinical
  //   8–15  = mild
  //   16–23 = moderate
  //   24–31 = severe
  //   32–40 = extreme
  let severity = "Subclinical";
  if (sum >= 32) severity = "Extreme";
  else if (sum >= 24) severity = "Severe";
  else if (sum >= 16) severity = "Moderate";
  else if (sum >= 8) severity = "Mild";
  return {
    total: sum,
    obsessions: obsessionsScore,
    compulsions: compulsionsScore,
    severity,
    positive: sum >= 16  // moderate or higher = clinically significant
  };
}

function score_AUDIT_C(responses, sex = "unspecified") {
  const sum = (responses.audit_1 || 0) + (responses.audit_2 || 0) + (responses.audit_3 || 0);
  const cutoff = sex === "female" ? 3 : 4;
  return { total: sum, positive: sum >= cutoff, cutoff };
}

function score_ASRS(responses) {
  const items = ["asrs_1","asrs_2","asrs_3","asrs_4","asrs_5","asrs_6"];
  // ASRS scoring: items 1-3 endorsed at 'Sometimes' (2)+, items 4-6 at 'Often' (3)+
  const cutoffs = [2, 2, 2, 3, 3, 3];
  let positiveItems = 0;
  items.forEach((k, i) => {
    if ((responses[k] || 0) >= cutoffs[i]) positiveItems++;
  });
  return {
    positiveItems,
    total: items.reduce((a,k) => a + (responses[k] || 0), 0),
    positive: positiveItems >= 4
  };
}

function score_LSAS(responses) {
  // Full LSAS: 24 social situations, fear ratings only here (0–3 each).
  // Total range: 0–72 for fear-only.
  // Standard published cutoffs use combined fear+avoidance (range 0–144);
  // since we collect fear only, we apply rescaled cutoffs ≈ half of standard.
  const items = [];
  for (let i = 1; i <= 24; i++) items.push(`lsas_${i}`);
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  // Rescaled bands (fear-only ≈ standard/2):
  //   <15  = minimal/non-clinical
  //   15–24 = mild social anxiety
  //   25–35 = moderate
  //   36–47 = severe
  //   48+   = very severe
  let severity = "Minimal";
  if (sum >= 48) severity = "Very severe";
  else if (sum >= 36) severity = "Severe";
  else if (sum >= 25) severity = "Moderate";
  else if (sum >= 15) severity = "Mild";
  return { total: sum, severity, positive: sum >= 25, maxScore: 72 };
}

function score_ACE(responses) {
  const items = ["ace_1","ace_2","ace_3","ace_4","ace_5","ace_6","ace_7","ace_8","ace_9","ace_10"];
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  let risk = "Low";
  if (sum >= 4) risk = "High";
  else if (sum >= 1) risk = "Moderate";
  return { total: sum, risk };
}

function score_AQ10(responses) {
  let sum = 0;
  let answered = 0;
  const items = [
    { id: "aq_1", high: true },
    { id: "aq_2", high: false },
    { id: "aq_3", high: false },
    { id: "aq_4", high: false },
    { id: "aq_5", high: false },
    { id: "aq_6", high: false },
    { id: "aq_7", high: true },
    { id: "aq_8", high: true },
    { id: "aq_9", high: false },
    { id: "aq_10", high: true }
  ];
  items.forEach(it => {
    const v = responses[it.id];
    if (v === undefined || v === null) return; // not administered — don't credit
    answered++;
    // Scale 0-3 (Definitely Disagree → Definitely Agree)
    // For "high"-scored items: agree (2,3) = 1 point
    // For "low"-scored items: disagree (0,1) = 1 point
    if (it.high && v >= 2) sum++;
    else if (!it.high && v <= 1) sum++;
  });
  return { total: sum, answered, positive: sum >= 6, administered: answered >= 7 };
}

function score_MDQ(responses) {
  const symItems = Array.from({length: 13}, (_,i) => `mdq_${i+1}`);
  const sum = symItems.reduce((a,k) => a + (responses[k] || 0), 0);
  return { total: sum, positive: sum >= 7 };
}

function score_FUNCTIONAL(responses) {
  const items = ["func_1","func_2","func_3","func_4","func_5"];
  const sum = items.reduce((a,k) => a + (responses[k] || 0), 0);
  const max = items.length * 4;
  const pct = sum / max;
  let severity = "None";
  if (pct >= 0.7) severity = "Severe";
  else if (pct >= 0.5) severity = "Moderate";
  else if (pct >= 0.3) severity = "Mild";
  return { total: sum, severity, percentage: Math.round(pct * 100) };
}

function score_EAT26(responses) {
  // EAT-26: 25 items scored (items 1-25), item 26 reverse-scored.
  // Each 0-3 (only top 3 of 6 response options score). Range 0-78.
  // Cutoff: 20+ = at-risk, refer for clinical eval.
  let total = 0;
  for (let i = 1; i <= 25; i++) total += (responses[`eat_${i}`] || 0);
  // Item 26 is reverse: Always(5) → 0, Never(0) → 3
  if (responses.eat_26 != null) {
    const reverseMap = { 5: 0, 4: 0, 3: 0, 2: 1, 1: 2, 0: 3 };
    total += reverseMap[responses.eat_26] || 0;
  }
  // Behavioral items (questions 25, 26 from Garner — vomiting, binge eating frequency) — flagged separately for safety
  const behavioralFlags = {
    bingeEating: (responses.eat_4 || 0) >= 1,    // binges
    vomiting: (responses.eat_9 || 0) >= 1 || (responses.eat_25 || 0) >= 1,
    foodControl: (responses.eat_18 || 0) >= 2
  };
  let severity = "Subclinical";
  if (total >= 30) severity = "Severe — high risk";
  else if (total >= 20) severity = "Moderate — at-risk";
  else if (total >= 11) severity = "Mild";
  return {
    total,
    severity,
    positive: total >= 20,
    behavioralFlags,
    administered: responses.eat_1 !== undefined
  };
}

function score_DAST10(responses) {
  // DAST-10: yes=1, no=0 (item 3 reverse scored). Range 0-10.
  // Cutoffs: 1-2 low, 3-5 moderate, 6-8 substantial, 9-10 severe.
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const v = responses[`dast_${i}`];
    if (v == null) continue;
    if (i === 3) total += (v === 0 ? 1 : 0);  // reverse: "always able to stop" no = problem
    else total += v;
  }
  let severity = "No problem";
  if (total >= 9) severity = "Severe";
  else if (total >= 6) severity = "Substantial";
  else if (total >= 3) severity = "Moderate";
  else if (total >= 1) severity = "Low-level";
  return {
    total,
    severity,
    positive: total >= 3,
    administered: responses.dast_1 !== undefined
  };
}

function score_ISI(responses) {
  // ISI: 7 items, each 0-4. Range 0-28.
  // 0-7 no insomnia; 8-14 subthreshold; 15-21 moderate; 22-28 severe.
  let total = 0;
  for (let i = 1; i <= 7; i++) total += (responses[`isi_${i}`] || 0);
  let severity = "No insomnia";
  if (total >= 22) severity = "Severe insomnia";
  else if (total >= 15) severity = "Moderate insomnia";
  else if (total >= 8) severity = "Subthreshold insomnia";
  return {
    total,
    severity,
    positive: total >= 15,
    administered: responses.isi_1 !== undefined
  };
}

function score_CSSRS(responses) {
  // C-SSRS Screener: 6 items, yes/no. Highest endorsed item determines risk level.
  // Item 1: passive ideation, 2: active ideation no method, 3: method but no plan/intent,
  // 4: intent without plan, 5: plan with intent, 6: lifetime suicidal behavior.
  let highest = 0;
  for (let i = 1; i <= 6; i++) {
    const v = responses[`cssrs_${i}`];
    if (v != null && v > 0) highest = Math.max(highest, i);
  }
  const recentBehavior = responses.cssrs_6 === 1;
  // Risk stratification (Columbia algorithm, simplified):
  let risk = "Low";
  if (highest >= 4 || recentBehavior) risk = "High";
  else if (highest === 3) risk = "Moderate";
  else if (highest >= 1) risk = "Some elevation";
  return {
    highestItem: highest,
    risk,
    behaviorEndorsed: recentBehavior,
    activeSI: (responses.cssrs_2 === 1) || (responses.cssrs_3 === 1),
    administered: responses.cssrs_1 !== undefined
  };
}

function score_SPQB(responses) {
  // SPQ-Brief: 22 items, yes/no. Range 0-22.
  // Three factors: Cognitive-Perceptual (8), Interpersonal (8), Disorganized (6).
  const cogPerceptual = ["spq_1","spq_2","spq_3","spq_4","spq_5","spq_6","spq_7","spq_8"];
  const interpersonal = ["spq_9","spq_10","spq_11","spq_12","spq_13","spq_14","spq_15","spq_16"];
  const disorganized = ["spq_17","spq_18","spq_19","spq_20","spq_21","spq_22"];
  const sumDomain = (items) => items.reduce((a, k) => {
    let v = responses[k];
    if (v == null) return a;
    if (k === "spq_10") v = v === 0 ? 1 : 0;  // reverse
    return a + v;
  }, 0);
  const cog = sumDomain(cogPerceptual);
  const inter = sumDomain(interpersonal);
  const dis = sumDomain(disorganized);
  const total = cog + inter + dis;
  // Cutoff: total ≥ 10 suggests SPD-screen positive (Raine, 1995).
  let severity = "Low";
  if (total >= 14) severity = "High — strong schizotypal features";
  else if (total >= 10) severity = "Moderate — clinically elevated";
  else if (total >= 5) severity = "Mild — some features";
  return {
    total,
    cognitivePerceptual: cog,
    interpersonal: inter,
    disorganized: dis,
    severity,
    positive: total >= 10,
    administered: responses.spq_1 !== undefined
  };
}

function score_PHQ15(responses) {
  // PHQ-15: 15 items, each 0-2. Range 0-30.
  // Cutoffs: 5-9 low, 10-14 medium, 15+ high somatic burden.
  let total = 0;
  for (let i = 1; i <= 15; i++) total += (responses[`phq15_${i}`] || 0);
  let severity = "Minimal";
  if (total >= 15) severity = "High somatic symptoms";
  else if (total >= 10) severity = "Medium somatic symptoms";
  else if (total >= 5) severity = "Low somatic symptoms";
  return {
    total,
    severity,
    positive: total >= 10,
    administered: responses.phq15_1 !== undefined
  };
}

function score_BPSIntake(responses) {
  // Just collect — no scoring per se, but compute composite "psychosocial vulnerability" index.
  let vulnerability = 0;
  // Housing instability: 0-3
  vulnerability += Math.min(3, responses.bps_living || 0);
  // Low support: 0-3
  vulnerability += Math.min(3, responses.bps_support || 0);
  // Recent stressors: 0-3
  vulnerability += Math.min(3, responses.bps_stressors || 0);
  // Family history strong: 0-3
  vulnerability += Math.min(3, responses.bps_family_hx || 0);
  // Developmental disruption: 0-3
  vulnerability += Math.min(3, responses.bps_developmental || 0);
  // Untreated history: 0-3
  vulnerability += Math.min(3, responses.bps_treatment || 0);
  return {
    vulnerability,  // 0-18
    age: responses.bps_age,
    gender: responses.bps_gender,
    housing: responses.bps_living,
    support: responses.bps_support,
    stressors: responses.bps_stressors,
    treatmentHx: responses.bps_treatment,
    medication: responses.bps_medication,
    familyHx: responses.bps_family_hx,
    developmental: responses.bps_developmental,
    substanceHx: responses.bps_substance_hx,
    medical: responses.bps_medical,
    horrorFan: responses.bps_horror_fan,
    administered: responses.bps_age !== undefined
  };
}

function score_TIPI(responses) {
  // TIPI: 10 items, 7-point scale (1=Disagree strongly … 7=Agree strongly).
  // Each Big Five domain is an average of 2 items, one of which is reverse-keyed.
  // Range per domain: 1.0–7.0. Higher = more of that trait.
  const reverse = (v) => v ? (8 - v) : null;
  const avg = (a, b) => {
    const aN = (a == null) ? null : a;
    const bN = (b == null) ? null : b;
    if (aN == null && bN == null) return null;
    if (aN == null) return bN;
    if (bN == null) return aN;
    return (aN + bN) / 2;
  };
  const ext = avg(responses.tipi_1, reverse(responses.tipi_6));
  const agr = avg(reverse(responses.tipi_2), responses.tipi_7);
  const con = avg(responses.tipi_3, reverse(responses.tipi_8));
  const neu = avg(responses.tipi_4, reverse(responses.tipi_9));
  const opn = avg(responses.tipi_5, reverse(responses.tipi_10));

  const round = (x) => x == null ? null : Number(x.toFixed(2));
  // Categorical labels for UI
  const band = (x) => {
    if (x == null) return "Not assessed";
    if (x >= 5.5) return "High";
    if (x >= 4.0) return "Moderate-High";
    if (x >= 3.0) return "Moderate-Low";
    return "Low";
  };
  return {
    extraversion: round(ext),
    agreeableness: round(agr),
    conscientiousness: round(con),
    neuroticism: round(neu),
    openness: round(opn),
    bands: {
      extraversion: band(ext),
      agreeableness: band(agr),
      conscientiousness: band(con),
      neuroticism: band(neu),
      openness: band(opn)
    },
    administered: ext != null || agr != null || con != null || neu != null || opn != null
  };
}

/* ============================================================
   SECTION 2 — MASTER SCORING ORCHESTRATOR
   ============================================================ */

function scoreAll(responses, options = {}) {
  return {
    PHQ2: score_PHQ2(responses),
    GAD2: score_GAD2(responses),
    PCPTSD: score_PCPTSD(responses),
    PHQ9: score_PHQ9(responses),
    GAD7: score_GAD7(responses),
    PCL5: score_PCL5_Brief(responses),
    DES_B: score_DESB(responses),
    MSI: score_MSI(responses),
    PID5: score_PID5(responses),
    YBOCS: score_YBOCS(responses),
    AUDIT_C: score_AUDIT_C(responses, options.sex),
    ASRS: score_ASRS(responses),
    LSAS: score_LSAS(responses),
    ACE: score_ACE(responses),
    AQ10: score_AQ10(responses),
    MDQ: score_MDQ(responses),
    TIPI: score_TIPI(responses),
    EAT26: score_EAT26(responses),
    DAST10: score_DAST10(responses),
    ISI: score_ISI(responses),
    CSSRS: score_CSSRS(responses),
    SPQB: score_SPQB(responses),
    PHQ15: score_PHQ15(responses),
    BPS: score_BPSIntake(responses),
    FUNCTIONAL: score_FUNCTIONAL(responses)
  };
}

/* ============================================================
   SECTION 3 — DSM-5-TR DISORDER DEFINITIONS
   ============================================================ */

const DISORDERS = {
  mdd: {
    code: "F32.x / F33.x",
    name: "Major Depressive Disorder",
    icd10: "F32.x (single episode) / F33.x (recurrent)",
    dsm5tr: "DSM-5-TR 296.2x / 296.3x",
    criteria: [
      { id: "depressed_mood", text: "Depressed mood most of the day, nearly every day", instruments: ["PHQ-9 item 2 / PHQ-2"] },
      { id: "anhedonia", text: "Markedly diminished interest or pleasure in activities (anhedonia)", instruments: ["PHQ-9 item 1 / PHQ-2"] },
      { id: "appetite", text: "Significant weight change or appetite disturbance", instruments: ["PHQ-9 item 5"] },
      { id: "sleep", text: "Insomnia or hypersomnia nearly every day", instruments: ["PHQ-9 item 3"] },
      { id: "psychomotor", text: "Psychomotor agitation or retardation observable by others", instruments: ["PHQ-9 item 8"] },
      { id: "fatigue", text: "Fatigue or loss of energy", instruments: ["PHQ-9 item 4"] },
      { id: "worthlessness", text: "Feelings of worthlessness or excessive guilt", instruments: ["PHQ-9 item 6"] },
      { id: "concentration", text: "Diminished ability to concentrate", instruments: ["PHQ-9 item 7"] },
      { id: "suicidality", text: "Recurrent thoughts of death, suicidal ideation, or suicide attempt", instruments: ["PHQ-9 item 9 / C-SSRS"] }
    ],
    differentials: [
      "Bipolar Disorder (rule out with MDQ + lifetime hypomania/mania history)",
      "Persistent Depressive Disorder (chronicity ≥2 years adults / ≥1 year youth)",
      "Adjustment Disorder with Depressed Mood (clear stressor, time-limited)",
      "Substance/Medication-Induced Depressive Disorder",
      "Depressive Disorder Due to Another Medical Condition (thyroid, B12, anemia, OSA, neurocognitive)",
      "Disruptive Mood Dysregulation Disorder (youth)",
      "Premenstrual Dysphoric Disorder (cyclical)"
    ],
    ruleOuts: [
      "TSH, B12, ferritin, CBC, CMP, vitamin D",
      "Substance use review (current + recent withdrawal states)",
      "Sleep apnea screen if hypersomnia/fatigue dominant",
      "Bipolar review (lifetime hypomania, family history, antidepressant-induced activation)"
    ],
    treatments: {
      psychotherapy: [
        "Cognitive Behavioral Therapy (CBT) — first-line, strong evidence base",
        "Behavioral Activation (BA) — particularly when anhedonia is dominant",
        "Interpersonal Therapy (IPT) — when interpersonal triggers/grief central",
        "Acceptance and Commitment Therapy (ACT) — values-based, strong for chronic/recurrent",
        "Mindfulness-Based Cognitive Therapy (MBCT) — relapse prevention after remission"
      ],
      medication: [
        "SSRIs first-line: sertraline, escitalopram, fluoxetine",
        "SNRIs: venlafaxine, duloxetine (consider with comorbid pain or anxiety)",
        "Atypicals: bupropion (low sexual SE, energizing; avoid with seizure or ED history), mirtazapine (sleep/appetite)",
        "TRD: augmentation (lithium, T3, atypical antipsychotic), ketamine/esketamine, TMS, ECT"
      ],
      mbc: [
        "Re-administer PHQ-9 every 2–4 weeks during acute phase",
        "Target: ≥50% reduction by week 6, remission (PHQ-9 < 5) by week 12",
        "Behavioral activation tracking via daily activity/mood log"
      ]
    }
  },

  gad: {
    code: "F41.1",
    name: "Generalized Anxiety Disorder",
    icd10: "F41.1",
    dsm5tr: "DSM-5-TR 300.02",
    criteria: [
      { id: "excessive_worry", text: "Excessive anxiety and worry, occurring more days than not for at least 6 months, about a number of events or activities", instruments: ["GAD-7 item 3"] },
      { id: "uncontrollable_worry", text: "Difficulty controlling the worry", instruments: ["GAD-7 item 2 / GAD-2"] },
      { id: "nervousness", text: "Feeling nervous, anxious, or on edge", instruments: ["GAD-7 item 1 / GAD-2"] },
      { id: "relax_difficulty", text: "Trouble relaxing", instruments: ["GAD-7 item 4"] },
      { id: "restlessness", text: "Restlessness or being so restless it's hard to sit still", instruments: ["GAD-7 item 5"] },
      { id: "irritability", text: "Becoming easily annoyed or irritable", instruments: ["GAD-7 item 6"] },
      { id: "apprehension", text: "Feeling afraid as if something awful might happen", instruments: ["GAD-7 item 7"] }
    ],
    differentials: [
      "Adjustment Disorder with Anxiety (clear stressor, <6 months)",
      "Specific Phobia / Social Anxiety (circumscribed)",
      "Panic Disorder (discrete attacks dominant)",
      "OCD (obsessions/compulsions)",
      "PTSD (trauma-linked, intrusive features)",
      "Hyperthyroidism, caffeine/stimulant intoxication, withdrawal states",
      "Anxiety Disorder Due to Another Medical Condition"
    ],
    ruleOuts: [
      "TSH, caffeine intake, stimulant/medication review",
      "Cardiac history if palpitations dominant",
      "Substance use (especially during withdrawal)"
    ],
    treatments: {
      psychotherapy: [
        "CBT with worry exposure and cognitive restructuring — first-line",
        "Acceptance and Commitment Therapy (ACT) — strong for chronic worry",
        "Applied Relaxation (Öst) — particularly with somatic features",
        "Mindfulness-Based Stress Reduction (MBSR)"
      ],
      medication: [
        "SSRIs first-line: escitalopram, sertraline, paroxetine",
        "SNRIs: venlafaxine, duloxetine",
        "Buspirone (non-sedating, no dependency)",
        "Avoid chronic benzodiazepine use except short-term bridging",
        "Hydroxyzine for short-term symptomatic relief"
      ],
      mbc: [
        "GAD-7 every 2–4 weeks; target remission GAD-7 < 5",
        "Track worry-time logs and somatic symptom intensity"
      ]
    }
  },

  ptsd: {
    code: "F43.10",
    name: "Posttraumatic Stress Disorder",
    icd10: "F43.10",
    dsm5tr: "DSM-5-TR 309.81",
    criteria: [
      { id: "traumatic_event", text: "Criterion A: Exposure to actual or threatened death, serious injury, or sexual violence", instruments: ["PC-PTSD-5"] },
      { id: "intrusion", text: "Criterion B: ≥1 intrusion symptom (intrusive memories, nightmares, flashbacks, distress to cues, physiological reactivity)", instruments: ["PCL-5 cluster B (items 1–5)"] },
      { id: "avoidance", text: "Criterion C: ≥1 avoidance symptom (avoidance of internal or external reminders)", instruments: ["PCL-5 cluster C (items 6–7)"] },
      { id: "negative_alterations", text: "Criterion D: ≥2 negative alterations in cognition/mood (amnesia, negative beliefs, distorted blame, negative emotional state, anhedonia, detachment)", instruments: ["PCL-5 cluster D (items 8–14)"] },
      { id: "hyperarousal", text: "Criterion E: ≥2 alterations in arousal/reactivity (irritability, recklessness, hypervigilance, startle, concentration, sleep)", instruments: ["PCL-5 cluster E (items 15–20)"] },
      { id: "functional_impairment", text: "Duration >1 month with clinically significant impairment", instruments: ["Functional Impact"] }
    ],
    differentials: [
      "Acute Stress Disorder (3 days–1 month post-trauma)",
      "Adjustment Disorder (sub-threshold trauma, less severe)",
      "Complex PTSD / DESNOS / Disorders of Extreme Stress (not in DSM-5-TR; in ICD-11)",
      "Major Depressive Disorder with trauma context",
      "Panic Disorder (discrete attacks not trauma-cued)",
      "Borderline Personality Disorder (often comorbid; differential vs. interpersonal trauma sequelae)",
      "Dissociative disorders",
      "TBI sequelae"
    ],
    ruleOuts: [
      "TBI history and neuro screen if applicable",
      "Substance use review (often heavy comorbid)",
      "Sleep apnea if dreams/fatigue prominent",
      "Comorbid depression and SI assessment"
    ],
    treatments: {
      psychotherapy: [
        "Prolonged Exposure (PE) — first-line, strongest evidence",
        "Cognitive Processing Therapy (CPT) — first-line, structured 12-session protocol",
        "Eye Movement Desensitization and Reprocessing (EMDR) — APA-endorsed, strong evidence",
        "Trauma-Focused CBT (especially youth)",
        "Written Exposure Therapy (WET) — brief 5-session protocol",
        "Skills-first approaches (STAIR, DBT-PE) for complex/dysregulated presentations"
      ],
      medication: [
        "SSRIs first-line: sertraline (FDA), paroxetine (FDA)",
        "SNRI: venlafaxine (off-label, evidence-supported)",
        "Prazosin for trauma-related nightmares",
        "Avoid benzodiazepines (worsen long-term outcomes)",
        "Adjunctive sleep agents short-term as needed"
      ],
      mbc: [
        "PCL-5 every 2 weeks during active treatment",
        "Target ≥10–20 point reduction; remission < 33",
        "Track trauma exposure hierarchy completion in PE/CPT"
      ]
    }
  },

  social_anx: {
    code: "F40.10",
    name: "Social Anxiety Disorder",
    icd10: "F40.10",
    dsm5tr: "DSM-5-TR 300.23",
    criteria: [
      { id: "performance_fear", text: "Marked fear of social situations involving possible scrutiny — performance situations (speaking, eating in public)", instruments: ["LSAS performance items"] },
      { id: "interaction_fear", text: "Marked fear of social-interaction situations (parties, meeting strangers, talking to authority)", instruments: ["LSAS interaction items"] },
      { id: "intensity", text: "Social situations almost always provoke anxiety, out of proportion to actual threat, persistent ≥6 months", instruments: ["LSAS total ≥25"] },
      { id: "avoidance_impairment", text: "Situations avoided or endured with intense distress; clinically significant impairment", instruments: ["LSAS avoidance + Functional Impact"] }
    ],
    differentials: [
      "Avoidant Personality Disorder (heavy overlap)",
      "Agoraphobia",
      "Panic Disorder",
      "Body Dysmorphic Disorder",
      "Autism Spectrum Disorder (social discomfort due to mismatch, not negative evaluation)",
      "Selective Mutism (typically childhood-onset)"
    ],
    ruleOuts: [
      "Autism screening (AQ-10) if social discomfort patterns extend beyond evaluation fear",
      "BDD screening if appearance-focused avoidance"
    ],
    treatments: {
      psychotherapy: [
        "CBT with exposure (in vivo and behavioral experiments) — first-line",
        "Group CBT — particularly effective; uses peer exposure",
        "Acceptance and Commitment Therapy (ACT)"
      ],
      medication: [
        "SSRIs: paroxetine, sertraline, escitalopram",
        "SNRIs: venlafaxine",
        "Beta-blockers (propranolol) for performance-only subtype, situational use",
        "Avoid chronic benzodiazepines"
      ],
      mbc: ["LSAS or SPIN every 2–4 weeks during exposure-based treatment"]
    }
  },

  ocd: {
    code: "F42.x",
    name: "Obsessive-Compulsive Disorder",
    icd10: "F42.x",
    dsm5tr: "DSM-5-TR 300.3",
    criteria: [
      { id: "obsessions_present", text: "Recurrent and persistent obsessions (intrusive thoughts, urges, or images)", instruments: ["Y-BOCS-SR item 1 (time on obsessions)"] },
      { id: "obsessions_distress", text: "Obsessions cause marked anxiety or distress", instruments: ["Y-BOCS-SR item 3 (distress from obsessions)"] },
      { id: "resistance", text: "Person attempts to ignore, suppress, or neutralize the obsessions", instruments: ["Y-BOCS-SR item 4 (resistance against obsessions)"] },
      { id: "compulsions_present", text: "Repetitive behaviors or mental acts performed in response to obsessions or rigid rules", instruments: ["Y-BOCS-SR item 6 (time on compulsions)"] },
      { id: "compulsions_interfere", text: "Compulsions are time-consuming or cause clinically significant distress/impairment", instruments: ["Y-BOCS-SR item 7 (interference from compulsions)"] },
      { id: "clinical_severity", text: "Total severity reaches clinical threshold (Y-BOCS ≥16)", instruments: ["Y-BOCS-SR total"] }
    ],
    differentials: [
      "Generalized Anxiety Disorder (real-life worry, no compulsions)",
      "Hoarding Disorder",
      "Body Dysmorphic Disorder",
      "Trichotillomania / Excoriation",
      "Tic Disorders / Tourette's",
      "Obsessive-Compulsive Personality Disorder (ego-syntonic, rigid character)",
      "Autism Spectrum (restricted/repetitive behaviors with different function)",
      "Psychotic disorders (when delusional)"
    ],
    ruleOuts: [
      "PANS/PANDAS in pediatric onset",
      "Tic-related OCD subtype assessment"
    ],
    treatments: {
      psychotherapy: [
        "Exposure and Response Prevention (ERP) — first-line, strongest evidence",
        "Cognitive Therapy with ERP",
        "Inference-Based CBT (I-CBT) for poor-insight presentations",
        "Family-Based ERP for youth"
      ],
      medication: [
        "SSRIs at higher doses than depression: fluoxetine 60–80 mg, sertraline 200 mg, fluvoxamine 200–300 mg",
        "Clomipramine if SSRI-resistant",
        "Augmentation with atypical antipsychotic (risperidone, aripiprazole) for partial response",
        "Glutamate-modulating agents (memantine, riluzole) experimental"
      ],
      mbc: ["Y-BOCS every 4 weeks; target ≥35% reduction"]
    }
  },

  bpd: {
    code: "F60.3",
    name: "Borderline Personality Disorder",
    icd10: "F60.3",
    dsm5tr: "DSM-5-TR 301.83",
    criteria: [
      { id: "abandonment_avoidance", text: "Frantic efforts to avoid real or imagined abandonment", instruments: ["MSI-BPD item 10"] },
      { id: "unstable_relationships", text: "Pattern of unstable and intense interpersonal relationships (idealization/devaluation)", instruments: ["MSI-BPD item 1"] },
      { id: "identity_disturbance", text: "Identity disturbance — markedly and persistently unstable self-image", instruments: ["MSI-BPD item 9"] },
      { id: "impulsivity", text: "Impulsivity in ≥2 potentially self-damaging areas", instruments: ["MSI-BPD item 3"] },
      { id: "self_harm_suicide", text: "Recurrent suicidal behavior, gestures, threats, or self-mutilating behavior", instruments: ["MSI-BPD item 2 / C-SSRS"] },
      { id: "affective_instability", text: "Affective instability due to marked reactivity of mood", instruments: ["MSI-BPD item 4"] },
      { id: "emptiness", text: "Chronic feelings of emptiness", instruments: ["MSI-BPD item 8"] },
      { id: "anger", text: "Inappropriate intense anger or difficulty controlling anger", instruments: ["MSI-BPD item 5"] },
      { id: "paranoid_dissociative", text: "Transient stress-related paranoid ideation", instruments: ["MSI-BPD item 6"] },
      { id: "dissociation", text: "Severe dissociative symptoms under stress", instruments: ["MSI-BPD item 7 / DES-B"] }
    ],
    differentials: [
      "Bipolar II Disorder (mood episodes are sustained vs. reactive)",
      "Complex PTSD (overlaps heavily; trauma history, no identity disturbance core)",
      "Histrionic / Narcissistic / Antisocial PD",
      "Dissociative Identity Disorder",
      "Substance-induced affective instability",
      "MDD with anxious distress"
    ],
    ruleOuts: [
      "Substance use during episodes",
      "Bipolar review with collateral",
      "Trauma history thorough assessment"
    ],
    treatments: {
      psychotherapy: [
        "Dialectical Behavior Therapy (DBT) — first-line, strongest evidence (reduces SI, self-harm, hospitalization)",
        "Mentalization-Based Therapy (MBT)",
        "Transference-Focused Psychotherapy (TFP)",
        "Schema-Focused Therapy",
        "General Psychiatric Management (GPM) — accessible structured approach"
      ],
      medication: [
        "No medication FDA-approved for BPD itself",
        "Target symptoms: SSRIs for affective instability, mood stabilizers for anger/impulsivity, atypicals for cognitive-perceptual symptoms",
        "Avoid benzodiazepines (disinhibit)",
        "Minimize polypharmacy"
      ],
      mbc: ["Self-harm and SI tracking weekly", "DBT diary card", "Re-administer MSI-BPD or BSL-23 quarterly"]
    }
  },

  bipolar: {
    code: "F31.x",
    name: "Bipolar Spectrum Disorder",
    icd10: "F31.x",
    dsm5tr: "DSM-5-TR 296.4x–296.8x",
    criteria: [
      { id: "elevated_mood", text: "Episode of abnormally elevated, expansive, or irritable mood (high or 'hyper')", instruments: ["MDQ item 1"] },
      { id: "grandiosity", text: "Inflated self-esteem or grandiosity", instruments: ["MDQ item 3"] },
      { id: "decreased_sleep", text: "Decreased need for sleep without feeling tired", instruments: ["MDQ item 4"] },
      { id: "pressured_speech", text: "More talkative than usual or pressure to keep talking", instruments: ["MDQ item 5"] },
      { id: "racing_thoughts", text: "Thoughts racing or ideas coming faster than they can be expressed", instruments: ["MDQ item 6"] },
      { id: "distractibility", text: "Distractibility — attention pulled by trivial stimuli", instruments: ["MDQ item 7"] },
      { id: "increased_activity", text: "Increased goal-directed activity or psychomotor agitation", instruments: ["MDQ items 8, 9"] },
      { id: "risky_behavior", text: "Excessive involvement in activities with high potential for painful consequences (spending, sexual, business)", instruments: ["MDQ items 12, 13"] }
    ],
    differentials: [
      "Major Depressive Disorder (no hypomania/mania)",
      "Borderline Personality Disorder (reactive mood shifts within hours)",
      "ADHD (chronic, no episodicity)",
      "Substance-induced mood episode",
      "Mood Disorder Due to Another Medical Condition (hyperthyroidism, steroids, neurologic)",
      "Schizoaffective Disorder"
    ],
    ruleOuts: [
      "TSH, comprehensive metabolic, substance use review",
      "Detailed lifetime mood history with collateral if possible",
      "Medication review (steroids, stimulants, antidepressant-induced activation)"
    ],
    treatments: {
      psychotherapy: [
        "Psychoeducation (illness management, prodromal recognition)",
        "Interpersonal and Social Rhythm Therapy (IPSRT)",
        "CBT for bipolar (relapse prevention, mood monitoring)",
        "Family-Focused Therapy"
      ],
      medication: [
        "Lithium — gold standard for Bipolar I; reduces suicide risk",
        "Valproate, lamotrigine (especially depressed phase BPII), carbamazepine",
        "Atypical antipsychotics: quetiapine, lurasidone (BP depression), olanzapine, aripiprazole",
        "Caution with antidepressant monotherapy (mood destabilization risk)",
        "ECT for severe/refractory"
      ],
      mbc: ["Mood charting daily", "ASRM/MDQ quarterly", "Sleep tracking critical (sleep loss = prodrome)"]
    }
  },

  aud: {
    code: "F10.x",
    name: "Alcohol Use Disorder",
    icd10: "F10.x",
    dsm5tr: "DSM-5-TR 303.90",
    criteria: [
      { id: "frequency", text: "Frequency of drinking — drinks containing alcohol consumed monthly or more often", instruments: ["AUDIT-C item 1"] },
      { id: "quantity", text: "Quantity per occasion — typical drinks per drinking day exceeds low-risk threshold", instruments: ["AUDIT-C item 2"] },
      { id: "binge", text: "Heavy episodic drinking — six or more drinks on one occasion", instruments: ["AUDIT-C item 3"] },
      { id: "hazardous", text: "Pattern reaches hazardous-drinking threshold (AUDIT-C ≥4 men, ≥3 women)", instruments: ["AUDIT-C total"] }
    ],
    differentials: [
      "Other substance use disorders (often co-occur)",
      "Mood/anxiety disorders with secondary use",
      "Bipolar Disorder (manic phase use)",
      "Antisocial / Borderline PD"
    ],
    ruleOuts: [
      "LFTs, CBC, GGT, MCV (alcohol biomarkers)",
      "Co-occurring depression/anxiety post-detox",
      "Withdrawal severity (CIWA-Ar) if clinically indicated"
    ],
    treatments: {
      psychotherapy: [
        "Motivational Interviewing — first-line for ambivalence",
        "Cognitive Behavioral Therapy for SUD",
        "Contingency Management (strong evidence)",
        "12-Step Facilitation, SMART Recovery, Refuge Recovery",
        "Family approaches (CRAFT for family of person not yet engaged)"
      ],
      medication: [
        "Naltrexone (oral or Vivitrol monthly injection) — reduces craving",
        "Acamprosate — supports abstinence post-detox",
        "Disulfiram — for highly motivated patients",
        "Topiramate, gabapentin (off-label, evidence-supported)"
      ],
      mbc: ["AUDIT-C every 1–3 months", "Drinking diary", "Biomarkers (PEth, CDT) if indicated"]
    }
  },

  adhd: {
    code: "F90.x",
    name: "Attention-Deficit/Hyperactivity Disorder",
    icd10: "F90.x",
    dsm5tr: "DSM-5-TR 314.0x",
    criteria: [
      { id: "inattention", text: "Inattention symptoms — careless mistakes, sustained attention difficulty, distractibility, forgetfulness, organization problems", instruments: ["ASRS-5 items 1–4"] },
      { id: "hyperactivity_impulsivity", text: "Hyperactivity-impulsivity symptoms — fidgeting, restlessness, on-the-go feeling, blurting answers", instruments: ["ASRS-5 items 5–6"] },
      { id: "symptom_threshold", text: "Symptom threshold reached — at least 4 items endorsed at clinical frequency", instruments: ["ASRS-5 positive items count"] },
      { id: "impairment", text: "Symptoms cause clear interference with functioning across settings", instruments: ["Functional Impact items 1, 4"] }
    ],
    differentials: [
      "Anxiety Disorders (concentration impaired secondary to worry)",
      "Mood Disorders",
      "Learning Disorders / Specific Learning Disability",
      "Autism Spectrum",
      "Sleep disorders (especially OSA, insufficient sleep)",
      "Substance-induced",
      "Trauma-related concentration difficulties"
    ],
    ruleOuts: [
      "Sleep evaluation (very common confound)",
      "Iron, ferritin, thyroid",
      "Substance use",
      "Trauma history (vigilance can mimic distractibility)"
    ],
    treatments: {
      psychotherapy: [
        "CBT for adult ADHD (Safren/Sprich protocol)",
        "Coaching, executive function skills training",
        "Behavioral parent training (youth)",
        "School-based behavioral interventions (youth)"
      ],
      medication: [
        "Stimulants first-line (high effect size): methylphenidate, amphetamine salts",
        "Non-stimulants: atomoxetine, guanfacine ER, clonidine ER, viloxazine",
        "Bupropion (off-label, helpful with comorbid depression)"
      ],
      mbc: ["ASRS or AISRS quarterly", "Functional outcomes (work, academic, relational)"]
    }
  },

  autism: {
    code: "F84.0",
    name: "Autism Spectrum Disorder",
    icd10: "F84.0",
    dsm5tr: "DSM-5-TR 299.00",
    criteria: [
      { id: "social_communication", text: "Persistent deficits in social communication — difficulty switching back-and-forth in conversation, holding conversations", instruments: ["AQ-10 items 5, 6"] },
      { id: "social_understanding", text: "Difficulty understanding others' intentions, social cues, or what someone is thinking/feeling", instruments: ["AQ-10 items 7, 10"] },
      { id: "attention_to_detail", text: "Restricted, repetitive interests or strong focus on detail, parts of objects, or patterns", instruments: ["AQ-10 items 1, 8"] },
      { id: "threshold", text: "Total score reaches AQ-10 screening threshold (≥6)", instruments: ["AQ-10 total"] }
    ],
    differentials: [
      "Social Anxiety Disorder",
      "Social (Pragmatic) Communication Disorder",
      "ADHD (often comorbid)",
      "Intellectual Disability",
      "OCD (restricted interests vs. compulsions)",
      "Schizoid PD"
    ],
    ruleOuts: [
      "Hearing assessment if speech/language concerns",
      "Genetic evaluation if dysmorphic features or ID",
      "Comprehensive developmental history"
    ],
    treatments: {
      psychotherapy: [
        "Note: aim is supportive/skills-based, not 'curative'; respect neurodivergence",
        "ABA controversial — avoid compliance-based protocols; consider ethical alternatives",
        "Adult: CBT for co-occurring anxiety/depression with autism-informed adaptations",
        "Social skills groups (PEERS for adolescents/adults)",
        "Occupational therapy for sensory integration",
        "Supported employment / vocational rehabilitation"
      ],
      medication: [
        "No medication treats core ASD",
        "Target comorbidities: SSRIs for anxiety/depression (start low, slow titration), stimulants for comorbid ADHD, atypicals (risperidone, aripiprazole) for severe irritability/aggression"
      ],
      mbc: ["Functional outcomes-focused; consider self-report scales like AASP for sensory profile"]
    }
  },

  dissociation: {
    code: "F44.x / F48.1",
    name: "Dissociative Disorder Spectrum",
    icd10: "F44.0–F44.9 / F48.1",
    dsm5tr: "DSM-5-TR 300.6 (Depersonalization/Derealization), 300.12 (Dissociative Amnesia), 300.14 (DID)",
    criteria: [
      { id: "amnesia", text: "Dissociative amnesia — gaps in recall, finding yourself somewhere with no memory of getting there, or important time loss", instruments: ["DES-B items 1, 2"] },
      { id: "depersonalization", text: "Depersonalization — feeling detached from yourself, watching yourself from outside, or feeling like an observer of your own life", instruments: ["DES-B items 3, 5"] },
      { id: "derealization", text: "Derealization — surroundings feel unreal, dreamlike, or distorted", instruments: ["DES-B item 4"] },
      { id: "identity_alteration", text: "Identity alteration — sense of being a different person, or finding evidence of activities you don't recall doing", instruments: ["DES-B item 6"] },
      { id: "clinical_threshold", text: "Frequency reaches clinical threshold (DES-B mean ≥2.0)", instruments: ["DES-B total mean"] }
    ],
    differentials: [
      "PTSD with dissociative subtype (often the better-fitting diagnosis)",
      "Borderline Personality Disorder (transient stress-induced dissociation)",
      "Psychotic disorders (reality testing distinguishes)",
      "Substance/medication induced",
      "Seizure disorders (especially temporal lobe)",
      "Acute Stress Disorder"
    ],
    ruleOuts: [
      "EEG if seizure concern",
      "Neuro evaluation if amnesia atypical",
      "Substance use review",
      "Comprehensive trauma history"
    ],
    treatments: {
      psychotherapy: [
        "Phase-based trauma treatment (Herman/ISSTD): stabilization → trauma processing → integration",
        "Trauma-focused CBT, EMDR (with care re: pacing for dissociation)",
        "DBT for emotion dysregulation",
        "Sensorimotor Psychotherapy / Somatic Experiencing",
        "DID specifically: long-term specialty care; work with parts/systems"
      ],
      medication: [
        "No FDA-approved for dissociation per se",
        "Target comorbid PTSD/depression/anxiety",
        "Avoid benzodiazepines (disinhibit dissociation in some)",
        "Naltrexone has some evidence for dissociation reduction"
      ],
      mbc: ["DES-II or MID quarterly", "Grounding skills tracking"]
    }
  },

  antisocial: {
    code: "F60.2",
    name: "Antisocial Personality Disorder / Antagonism Spectrum",
    icd10: "F60.2",
    dsm5tr: "DSM-5-TR 301.7",
    criteria: [
      { id: "antagonism", text: "Elevated antagonism — manipulativeness, deceitfulness, callousness, hostility, grandiosity", instruments: ["PID-5-BF antagonism domain"] },
      { id: "disinhibition", text: "Elevated disinhibition — impulsivity, irresponsibility, distractibility, risk-taking", instruments: ["PID-5-BF disinhibition domain"] },
      { id: "manipulation", text: "Manipulativeness — using others to advance own agenda", instruments: ["PID-5-BF antagonism item 1"] },
      { id: "callousness", text: "Lack of empathy / callousness toward others' welfare", instruments: ["PID-5-BF antagonism items 3, 4"] },
      { id: "substance_concurrent", text: "Concurrent substance use disorder (commonly co-occurring)", instruments: ["AUDIT-C / DAST-10"] }
    ],
    differentials: [
      "Substance-induced (assess sober baseline)",
      "Narcissistic Personality Disorder",
      "Borderline Personality Disorder",
      "Bipolar Disorder (manic episodes)",
      "Intermittent Explosive Disorder",
      "Conduct Disorder (under 18)"
    ],
    ruleOuts: [
      "Substance use thorough assessment",
      "TBI history if onset later in life",
      "Frontal/limbic neurologic conditions"
    ],
    treatments: {
      psychotherapy: [
        "Limited efficacy research; outcomes modest",
        "Schema-Focused Therapy",
        "Mentalization-Based Therapy",
        "Cognitive-Behavioral approaches for behavioral targets",
        "Contingency Management",
        "Concurrent SUD treatment essential"
      ],
      medication: [
        "No specific medication; target symptoms (mood instability, impulsivity)",
        "Mood stabilizers for impulsive aggression",
        "SSRIs may help with reactive aggression"
      ],
      mbc: ["Behavioral target tracking", "Concurrent monitoring of legal/occupational outcomes"]
    }
  },

  eating: {
    code: "F50.x",
    icd: "F50.0 Anorexia / F50.2 Bulimia / F50.81 Binge-Eating Disorder",
    name: "Feeding & Eating Disorder",
    criteria: [
      { id: "preoccupation", text: "Persistent preoccupation with food, weight, or body shape", instruments: ["EAT-26 items 1, 11, 14, 21"] },
      { id: "behaviors", text: "Disordered eating behaviors (restriction, bingeing, purging, dieting rituals)", instruments: ["EAT-26 items 2, 4, 9, 18, 23, 25"] },
      { id: "control", text: "Sense that food/eating controls life, or compensatory behaviors after eating", instruments: ["EAT-26 items 10, 18, 24"] },
      { id: "weight_concern", text: "Intense fear of weight gain or persistent body image disturbance", instruments: ["EAT-26 items 1, 11, 14"] },
      { id: "impairment", text: "Behaviors cause significant medical or psychosocial impairment", instruments: ["EAT-26 total ≥20 + Functional"] }
    ],
    differentials: [
      "MDD with appetite changes — but eating disorders feature weight/shape preoccupation as core",
      "OCD with food-related obsessions — distinct compulsion targets",
      "Social anxiety with eating-in-public fear — phenomenologically narrower",
      "Body Dysmorphic Disorder — focus on specific body parts vs. weight"
    ],
    ruleOuts: [
      "Medical causes of weight loss (hyperthyroidism, GI disease, malignancy)",
      "Medication effects (stimulants, SSRIs)",
      "Differentiate restrictive vs. binge-purge vs. binge-only subtypes — treatments differ"
    ],
    treatments: {
      firstLine: ["Enhanced CBT for Eating Disorders (CBT-E) — gold standard", "Family-Based Treatment (FBT/Maudsley) for adolescents", "Interpersonal Therapy (IPT)"],
      adjunctive: ["Nutritional rehabilitation with RD", "Body image work", "Mindfulness-based eating awareness training"],
      severeCases: ["Higher level of care assessment — IOP / PHP / residential / inpatient based on medical instability", "Medical monitoring — vitals, labs, weight, EKG"],
      medication: ["Fluoxetine — only FDA-approved med for bulimia (60 mg)", "Lisdexamfetamine — approved for binge-eating disorder", "Avoid bupropion in purging subtypes (seizure risk)"],
      mbc: ["EAT-26 monthly", "Weekly weights when clinically indicated", "Eating-disorder-specific outcome measures (EDE-Q)"]
    }
  },

  sud: {
    code: "F19.x",
    icd: "F11–F19 Substance Use Disorders",
    name: "Substance Use Disorder (non-alcohol)",
    criteria: [
      { id: "loss_control", text: "Loss of control — inability to stop despite intent", instruments: ["DAST-10 item 3"] },
      { id: "consequences", text: "Continued use despite negative consequences (legal, family, medical)", instruments: ["DAST-10 items 6, 7, 8, 10"] },
      { id: "withdrawal", text: "Tolerance or withdrawal symptoms", instruments: ["DAST-10 item 9"] },
      { id: "polysubstance", text: "Use of multiple substances concurrently", instruments: ["DAST-10 item 2"] },
      { id: "blackouts", text: "Cognitive consequences (blackouts, memory loss)", instruments: ["DAST-10 item 4"] }
    ],
    differentials: [
      "AUD — separate diagnostic category, can co-occur",
      "Mood disorder with substance use — careful temporal sequencing needed",
      "Trauma-driven self-medication — treat both"
    ],
    ruleOuts: [
      "Iatrogenic dependence (chronic pain management) — distinct treatment frame",
      "Cultural/contextual use patterns — assess actual impairment"
    ],
    treatments: {
      firstLine: ["Cognitive-Behavioral Therapy (CBT) for SUD", "Motivational Interviewing", "Contingency Management — strong evidence for stimulant use disorders", "Mutual-help groups (NA, SMART Recovery)"],
      adjunctive: ["Twelve-step facilitation", "Family therapy / CRAFT for family members", "Harm reduction approaches"],
      severeCases: ["Medically supervised withdrawal", "Residential / IOP", "Co-occurring disorder integrated treatment"],
      medication: ["Naltrexone — opioid use disorder", "Buprenorphine / methadone — opioid agonist therapy", "No FDA-approved meds for stimulants/cannabis — pharmacotherapy off-label"],
      mbc: ["DAST-10 quarterly", "Urine drug screens as clinically appropriate", "Days-of-use logging"]
    }
  },

  insomnia: {
    code: "G47.0",
    icd: "F51.01 Primary Insomnia / G47.00 Insomnia",
    name: "Insomnia Disorder",
    criteria: [
      { id: "sleep_difficulty", text: "Difficulty initiating, maintaining, or terminating sleep ≥3 nights/week", instruments: ["ISI items 1, 2, 3"] },
      { id: "duration", text: "Symptoms persist ≥3 months", instruments: ["BPS Intake (current behaviors)"] },
      { id: "distress", text: "Sleep concerns cause distress and dissatisfaction", instruments: ["ISI items 4, 6"] },
      { id: "daytime_impairment", text: "Daytime functional impairment (fatigue, mood, concentration)", instruments: ["ISI item 7"] },
      { id: "not_substance", text: "Not better explained by substance/medication or another disorder", instruments: ["DAST-10, AUDIT-C cross-check"] }
    ],
    differentials: [
      "MDD with insomnia as feature — primary mood disorder",
      "GAD with worry-related sleep disruption",
      "Trauma-related sleep disturbance (nightmares, hypervigilance)",
      "Circadian rhythm disorders, sleep apnea — refer for sleep study"
    ],
    ruleOuts: [
      "Substance-induced insomnia (caffeine, stimulants, alcohol withdrawal)",
      "Medication side effects (SSRIs, steroids, beta-agonists)",
      "Medical conditions (chronic pain, hyperthyroidism, neurodegenerative disease)"
    ],
    treatments: {
      firstLine: ["Cognitive-Behavioral Therapy for Insomnia (CBT-I) — first-line per AASM", "Sleep restriction therapy", "Stimulus control"],
      adjunctive: ["Sleep hygiene education", "Relaxation training", "Mindfulness-based therapy for insomnia (MBT-I)"],
      severeCases: ["Sleep medicine consultation", "Polysomnography to rule out apnea/RLS", "Concurrent treatment of comorbid mood/anxiety"],
      medication: ["Trazodone, mirtazapine — sedating antidepressants for comorbid mood", "Z-drugs (zolpidem, eszopiclone) — short-term only", "Avoid chronic benzodiazepines — dependence/cognitive risk"],
      mbc: ["ISI biweekly", "Sleep diary tracking", "Daytime functioning monitoring"]
    }
  },

  schizotypal: {
    code: "F21",
    icd: "F21 Schizotypal Personality Disorder",
    name: "Schizotypal Personality Disorder / Schizotypy Spectrum",
    criteria: [
      { id: "ideas_reference", text: "Ideas of reference (without delusional intensity)", instruments: ["SPQ-B items 2, 3, 9"] },
      { id: "magical_thinking", text: "Odd beliefs or magical thinking inconsistent with subcultural norms", instruments: ["SPQ-B items 1, 5, 7"] },
      { id: "perceptual", text: "Unusual perceptual experiences, including bodily illusions", instruments: ["SPQ-B items 6, 8"] },
      { id: "thought_speech", text: "Odd thinking and speech (vague, circumstantial, metaphorical)", instruments: ["SPQ-B items 19, 21"] },
      { id: "suspiciousness", text: "Suspiciousness or paranoid ideation", instruments: ["SPQ-B items 10, 22"] },
      { id: "constricted_affect", text: "Inappropriate or constricted affect", instruments: ["SPQ-B items 14, 16"] },
      { id: "eccentric", text: "Eccentric behavior or appearance", instruments: ["SPQ-B items 17, 18"] },
      { id: "few_close", text: "Lack of close friends/confidants other than first-degree relatives", instruments: ["SPQ-B items 11, 13"] },
      { id: "social_anxiety", text: "Excessive social anxiety that doesn't diminish with familiarity, associated with paranoid fears", instruments: ["SPQ-B item 15 + LSAS"] }
    ],
    differentials: [
      "Schizophrenia spectrum — quantitative not qualitative differences; STPD lacks frank psychosis",
      "Autism spectrum — overlap in social-communication, but autism lacks magical thinking/paranoia",
      "Avoidant PD — social anxiety without odd beliefs/perceptions",
      "Post-traumatic dissociation can mimic STPD — careful timeline"
    ],
    ruleOuts: [
      "Substance-induced perceptual changes",
      "Cultural/spiritual practices that include unusual beliefs (assess context)",
      "Frank psychotic disorder (refer for higher level of care if positive symptoms emerge)"
    ],
    treatments: {
      firstLine: ["Supportive psychotherapy", "Social skills training", "Cognitive remediation for cognitive symptoms"],
      adjunctive: ["Family psychoeducation", "Vocational rehabilitation"],
      severeCases: ["Coordinated specialty care if conversion to schizophrenia spectrum", "Early-intervention programs"],
      medication: ["Low-dose atypical antipsychotics for cognitive-perceptual symptoms (off-label)", "Treat comorbid mood/anxiety"],
      mbc: ["SPQ-B periodically", "Functional outcome tracking"]
    }
  },

  somatic: {
    code: "F45.1",
    icd: "F45.1 Somatic Symptom Disorder",
    name: "Somatic Symptom Disorder",
    criteria: [
      { id: "somatic_symptoms", text: "One or more distressing somatic symptoms", instruments: ["PHQ-15 total ≥10"] },
      { id: "preoccupation", text: "Excessive thoughts/feelings/behaviors related to symptoms", instruments: ["PHQ-15 + Functional"] },
      { id: "duration", text: "Persistent state (typically >6 months)", instruments: ["BPS Intake"] },
      { id: "impairment", text: "Symptoms disrupt daily functioning", instruments: ["Functional"] }
    ],
    differentials: [
      "MDD with somatic features — primary mood disorder driving body symptoms",
      "Anxiety disorders — somatic symptoms secondary to autonomic arousal",
      "Genuine medical illness — must rule out / address concurrently",
      "Conversion disorder (functional neurological) — distinct presentation"
    ],
    ruleOuts: [
      "Underlying medical conditions — collaboration with PCP essential",
      "Medication side effects",
      "Substance use",
      "Note: SSD diagnosis requires that symptoms cause excessive concern, NOT that they're medically unexplained"
    ],
    treatments: {
      firstLine: ["CBT for somatic symptoms", "Acceptance and Commitment Therapy (ACT)", "Mindfulness-based interventions"],
      adjunctive: ["Body-based therapies (yoga, gentle movement)", "PCP coordination", "Avoid unnecessary diagnostic procedures"],
      severeCases: ["Integrated care model (mental health embedded in primary care)", "Pain management referral if pain-predominant"],
      medication: ["SSRIs / SNRIs — duloxetine for pain-predominant somatic symptoms", "Avoid benzodiazepines and opioids for chronic somatic complaints"],
      mbc: ["PHQ-15 quarterly", "Functional capacity tracking", "Healthcare utilization metrics"]
    }
  }
};

/* ============================================================
   SECTION 4 — DISORDER EVIDENCE COMPILATION
   ============================================================ */

function compileDisorderEvidence(scores, responses) {
  // Each disorder: weight from each instrument that contributes
  // Returns normalized 0-1 signal, DSM-5-TR criteria evaluation, and which specific
  // criteria are met for transparency in the report.
  const evidence = {};
  responses = responses || {};

  // Helper: evaluate which specific criteria are met based on response thresholds
  // Returns array of criterion IDs that are met
  const checkCriteria = (criteriaChecks) => {
    return criteriaChecks.filter(c => c.met).map(c => c.id);
  };

  // ===== MDD =====
  const mddSignal = (scores.PHQ9.total / 27) * 0.7
                  + (scores.PHQ2.total / 6) * 0.3;
  const mddCritsMet = [];
  if ((responses.phq9_1 || 0) >= 1 || (responses.phq2_1 || 0) >= 1) mddCritsMet.push("anhedonia");
  if ((responses.phq9_2 || 0) >= 1 || (responses.phq2_2 || 0) >= 1) mddCritsMet.push("depressed_mood");
  if ((responses.phq9_3 || 0) >= 1) mddCritsMet.push("sleep");
  if ((responses.phq9_4 || 0) >= 1) mddCritsMet.push("fatigue");
  if ((responses.phq9_5 || 0) >= 1) mddCritsMet.push("appetite");
  if ((responses.phq9_6 || 0) >= 1) mddCritsMet.push("worthlessness");
  if ((responses.phq9_7 || 0) >= 1) mddCritsMet.push("concentration");
  if ((responses.phq9_8 || 0) >= 1) mddCritsMet.push("psychomotor");
  if ((responses.phq9_9 || 0) >= 1) mddCritsMet.push("suicidality");
  evidence.mdd = {
    signal: mddSignal,
    criteriaMet: scores.PHQ9.meetsMDDCriteria,
    severity: scores.PHQ9.severity,
    primary: scores.PHQ9.total,
    criteriaMetIds: mddCritsMet,
    flags: { si: scores.PHQ9.siFlag }
  };

  // ===== GAD =====
  const gadSignal = (scores.GAD7.total / 21) * 0.7
                  + (scores.GAD2.total / 6) * 0.3;
  const gadCritsMet = [];
  if ((responses.gad7_1 || 0) >= 1 || (responses.gad2_1 || 0) >= 1) gadCritsMet.push("nervousness");
  if ((responses.gad7_2 || 0) >= 1 || (responses.gad2_2 || 0) >= 1) gadCritsMet.push("uncontrollable_worry");
  if ((responses.gad7_3 || 0) >= 1) gadCritsMet.push("excessive_worry");
  if ((responses.gad7_4 || 0) >= 1) gadCritsMet.push("relax_difficulty");
  if ((responses.gad7_5 || 0) >= 1) gadCritsMet.push("restlessness");
  if ((responses.gad7_6 || 0) >= 1) gadCritsMet.push("irritability");
  if ((responses.gad7_7 || 0) >= 1) gadCritsMet.push("apprehension");
  evidence.gad = {
    signal: gadSignal,
    criteriaMet: scores.GAD7.total >= 10,
    severity: scores.GAD7.severity,
    primary: scores.GAD7.total,
    criteriaMetIds: gadCritsMet
  };

  // ===== PTSD =====
  let ptsdSignal = (scores.PCL5.total / 80) * 0.6
                 + (scores.PCPTSD.total / 5) * 0.4;
  if (scores.PCL5.meetsCriteria) ptsdSignal = Math.min(1, ptsdSignal * 1.2);
  const ptsdCritsMet = [];
  if (scores.PCL5.clusters && scores.PCL5.clusters.B >= 1) ptsdCritsMet.push("intrusion");
  if (scores.PCL5.clusters && scores.PCL5.clusters.C >= 1) ptsdCritsMet.push("avoidance");
  if (scores.PCL5.clusters && scores.PCL5.clusters.D >= 2) ptsdCritsMet.push("negative_alterations");
  if (scores.PCL5.clusters && scores.PCL5.clusters.E >= 2) ptsdCritsMet.push("hyperarousal");
  if (scores.PCPTSD.total >= 3) ptsdCritsMet.push("traumatic_event");
  if ((responses.func_1 || 0) + (responses.func_2 || 0) >= 4) ptsdCritsMet.push("functional_impairment");
  evidence.ptsd = {
    signal: ptsdSignal,
    criteriaMet: scores.PCL5.meetsCriteria,
    severity: scores.PCL5.severity,
    primary: scores.PCL5.total,
    pcptsd: scores.PCPTSD.total,
    criteriaMetIds: ptsdCritsMet
  };

  // ===== Social Anxiety =====
  const socCritsMet = [];
  // Performance situations: items 5, 6, 16, 17, 20
  const performanceMean = [5, 6, 16, 17, 20].reduce((a, i) => a + (responses[`lsas_${i}`] || 0), 0) / 5;
  // Interaction situations: items 11, 12, 14, 15, 21
  const interactionMean = [11, 12, 14, 15, 21].reduce((a, i) => a + (responses[`lsas_${i}`] || 0), 0) / 5;
  if (performanceMean >= 1.5) socCritsMet.push("performance_fear");
  if (interactionMean >= 1.5) socCritsMet.push("interaction_fear");
  if (scores.LSAS.total >= 25) socCritsMet.push("intensity");
  if ((responses.func_3 || 0) >= 2) socCritsMet.push("avoidance_impairment");
  evidence.social_anx = {
    signal: scores.LSAS.total / 72,
    criteriaMet: scores.LSAS.total >= 25,
    severity: scores.LSAS.severity,
    primary: scores.LSAS.total,
    criteriaMetIds: socCritsMet
  };

  // ===== OCD =====
  const ocdCritsMet = [];
  if ((responses.ybocs_1 || 0) >= 2) ocdCritsMet.push("obsessions_present");
  if ((responses.ybocs_3 || 0) >= 2) ocdCritsMet.push("obsessions_distress");
  if ((responses.ybocs_4 || 0) >= 2) ocdCritsMet.push("resistance");
  if ((responses.ybocs_6 || 0) >= 2) ocdCritsMet.push("compulsions_present");
  if ((responses.ybocs_7 || 0) >= 2) ocdCritsMet.push("compulsions_interfere");
  if (scores.YBOCS.total >= 16) ocdCritsMet.push("clinical_severity");
  evidence.ocd = {
    signal: scores.YBOCS.total / 40,
    criteriaMet: scores.YBOCS.total >= 16,
    severity: scores.YBOCS.severity,
    primary: scores.YBOCS.total,
    criteriaMetIds: ocdCritsMet
  };

  // ===== BPD =====
  const bpdCritsMet = [];
  if (responses.msi_1 === 1) bpdCritsMet.push("unstable_relationships");
  if (responses.msi_2 === 1) bpdCritsMet.push("self_harm_suicide");
  if (responses.msi_3 === 1) bpdCritsMet.push("impulsivity");
  if (responses.msi_4 === 1) bpdCritsMet.push("affective_instability");
  if (responses.msi_5 === 1) bpdCritsMet.push("anger");
  if (responses.msi_6 === 1) bpdCritsMet.push("paranoid_dissociative");
  if (responses.msi_7 === 1) bpdCritsMet.push("dissociation");
  if (responses.msi_8 === 1) bpdCritsMet.push("emptiness");
  if (responses.msi_9 === 1) bpdCritsMet.push("identity_disturbance");
  if (responses.msi_10 === 1) bpdCritsMet.push("abandonment_avoidance");
  evidence.bpd = {
    signal: scores.MSI.total / 10,
    criteriaMet: scores.MSI.total >= 7,
    severity: scores.MSI.total >= 7 ? "Probable" : "Subclinical",
    primary: scores.MSI.total,
    criteriaMetIds: bpdCritsMet,
    flags: { selfHarm: scores.MSI.selfHarmFlag }
  };

  // ===== Bipolar =====
  const bipCritsMet = [];
  if (responses.mdq_1 === 1) bipCritsMet.push("elevated_mood");
  if (responses.mdq_3 === 1) bipCritsMet.push("grandiosity");
  if (responses.mdq_4 === 1) bipCritsMet.push("decreased_sleep");
  if (responses.mdq_5 === 1) bipCritsMet.push("pressured_speech");
  if (responses.mdq_6 === 1) bipCritsMet.push("racing_thoughts");
  if (responses.mdq_7 === 1) bipCritsMet.push("distractibility");
  if (responses.mdq_8 === 1 || responses.mdq_9 === 1) bipCritsMet.push("increased_activity");
  if (responses.mdq_12 === 1 || responses.mdq_13 === 1) bipCritsMet.push("risky_behavior");
  evidence.bipolar = {
    signal: scores.MDQ.total / 13,
    criteriaMet: scores.MDQ.total >= 7,
    severity: scores.MDQ.total >= 7 ? "Probable" : "Subclinical",
    primary: scores.MDQ.total,
    criteriaMetIds: bipCritsMet
  };

  // ===== AUD =====
  const audCritsMet = [];
  if ((responses.audit_1 || 0) >= 2) audCritsMet.push("frequency");
  if ((responses.audit_2 || 0) >= 2) audCritsMet.push("quantity");
  if ((responses.audit_3 || 0) >= 1) audCritsMet.push("binge");
  if (scores.AUDIT_C.positive) audCritsMet.push("hazardous");
  evidence.aud = {
    signal: scores.AUDIT_C.total / 12,
    criteriaMet: scores.AUDIT_C.positive,
    severity: scores.AUDIT_C.total >= 8 ? "Probable severe" : (scores.AUDIT_C.positive ? "At-risk" : "Low"),
    primary: scores.AUDIT_C.total,
    criteriaMetIds: audCritsMet
  };

  // ===== ADHD =====
  const adhdCritsMet = [];
  // Inattention (items 1-4)
  if ([1,2,3,4].some(i => (responses[`asrs_${i}`] || 0) >= 2)) adhdCritsMet.push("inattention");
  // Hyperactivity (items 5-6)
  if ([5,6].some(i => (responses[`asrs_${i}`] || 0) >= 2)) adhdCritsMet.push("hyperactivity_impulsivity");
  if (scores.ASRS.positiveItems >= 4) adhdCritsMet.push("symptom_threshold");
  if ((responses.func_1 || 0) >= 2 || (responses.func_4 || 0) >= 2) adhdCritsMet.push("impairment");
  evidence.adhd = {
    signal: scores.ASRS.total / 24,
    criteriaMet: scores.ASRS.positive,
    severity: scores.ASRS.positive ? "Probable" : "Subclinical",
    primary: scores.ASRS.total,
    positiveItems: scores.ASRS.positiveItems,
    criteriaMetIds: adhdCritsMet
  };

  // ===== Autism =====
  const autismCritsMet = [];
  if (scores.AQ10.administered) {
    if ((responses.aq_5 === 0) || (responses.aq_6 === 0)) autismCritsMet.push("social_communication");
    if ((responses.aq_7 === 3) || (responses.aq_10 === 3)) autismCritsMet.push("social_understanding");
    if ((responses.aq_1 === 3) || (responses.aq_8 === 3)) autismCritsMet.push("attention_to_detail");
    if (scores.AQ10.positive) autismCritsMet.push("threshold");
  }
  evidence.autism = {
    signal: scores.AQ10.administered ? scores.AQ10.total / 10 : 0,
    criteriaMet: scores.AQ10.administered && scores.AQ10.positive,
    severity: scores.AQ10.administered ? (scores.AQ10.positive ? "Probable" : "Subclinical") : "Not administered",
    primary: scores.AQ10.total,
    administered: scores.AQ10.administered,
    criteriaMetIds: autismCritsMet
  };

  // ===== Dissociation =====
  const dissCritsMet = [];
  if ((responses.des_1 || 0) >= 2 || (responses.des_2 || 0) >= 2) dissCritsMet.push("amnesia");
  if ((responses.des_3 || 0) >= 2 || (responses.des_5 || 0) >= 2) dissCritsMet.push("depersonalization");
  if ((responses.des_4 || 0) >= 2) dissCritsMet.push("derealization");
  if ((responses.des_6 || 0) >= 2) dissCritsMet.push("identity_alteration");
  if (scores.DES_B.mean >= 2.0) dissCritsMet.push("clinical_threshold");
  evidence.dissociation = {
    signal: scores.DES_B.mean / 4,
    criteriaMet: scores.DES_B.mean >= 2.0,
    severity: scores.DES_B.severity,
    primary: scores.DES_B.mean,
    criteriaMetIds: dissCritsMet
  };

  // ===== PID-5 trait domains =====
  evidence.antagonism = { signal: scores.PID5.antagonism / 15, primary: scores.PID5.antagonism };
  evidence.disinhibition = { signal: scores.PID5.disinhibition / 15, primary: scores.PID5.disinhibition };
  evidence.psychoticism = { signal: scores.PID5.psychoticism / 15, primary: scores.PID5.psychoticism };

  // ===== Antisocial =====
  const antiCritsMet = [];
  if (scores.PID5.antagonism >= 9) antiCritsMet.push("antagonism");
  if (scores.PID5.disinhibition >= 9) antiCritsMet.push("disinhibition");
  if ((responses.pid_ant1 || 0) >= 2) antiCritsMet.push("manipulation");
  if ((responses.pid_ant3 || 0) >= 2 || (responses.pid_ant4 || 0) >= 2) antiCritsMet.push("callousness");
  if (scores.AUDIT_C.positive || scores.DAST10.positive) antiCritsMet.push("substance_concurrent");
  evidence.antisocial = {
    signal: ((scores.PID5.antagonism + scores.PID5.disinhibition) / 30),
    criteriaMet: (scores.PID5.antagonism + scores.PID5.disinhibition) >= 18,
    severity: ((scores.PID5.antagonism + scores.PID5.disinhibition) >= 18) ? "Elevated" : "Subclinical",
    primary: scores.PID5.antagonism + scores.PID5.disinhibition,
    criteriaMetIds: antiCritsMet
  };

  // ===== Eating Disorder =====
  const eatCritsMet = [];
  if (scores.EAT26.administered) {
    if ((responses.eat_1 || 0) >= 1 || (responses.eat_11 || 0) >= 1 || (responses.eat_14 || 0) >= 1) eatCritsMet.push("preoccupation");
    if ((responses.eat_2 || 0) >= 1 || (responses.eat_4 || 0) >= 1 || (responses.eat_18 || 0) >= 1 || (responses.eat_23 || 0) >= 1) eatCritsMet.push("behaviors");
    if ((responses.eat_18 || 0) >= 1) eatCritsMet.push("control");
    if ((responses.eat_1 || 0) >= 1 || (responses.eat_11 || 0) >= 1) eatCritsMet.push("weight_concern");
    if (scores.EAT26.total >= 20) eatCritsMet.push("impairment");
  }
  evidence.eating = {
    signal: scores.EAT26.administered ? Math.min(1, scores.EAT26.total / 40) : 0,
    criteriaMet: scores.EAT26.positive,
    severity: scores.EAT26.severity,
    primary: scores.EAT26.total,
    flags: scores.EAT26.behavioralFlags,
    administered: scores.EAT26.administered,
    criteriaMetIds: eatCritsMet
  };

  // ===== Drug Use Disorder =====
  const sudCritsMet = [];
  if (scores.DAST10.administered) {
    if (responses.dast_3 === 0) sudCritsMet.push("loss_control");
    if ([6, 7, 8, 10].some(i => responses[`dast_${i}`] === 1)) sudCritsMet.push("consequences");
    if (responses.dast_9 === 1) sudCritsMet.push("withdrawal");
    if (responses.dast_2 === 1) sudCritsMet.push("polysubstance");
    if (responses.dast_4 === 1) sudCritsMet.push("blackouts");
  }
  evidence.sud = {
    signal: scores.DAST10.administered ? scores.DAST10.total / 10 : 0,
    criteriaMet: scores.DAST10.positive,
    severity: scores.DAST10.severity,
    primary: scores.DAST10.total,
    administered: scores.DAST10.administered,
    criteriaMetIds: sudCritsMet
  };

  // ===== Insomnia =====
  const insomCritsMet = [];
  if (scores.ISI.administered) {
    if ((responses.isi_1 || 0) >= 2 || (responses.isi_2 || 0) >= 2 || (responses.isi_3 || 0) >= 2) insomCritsMet.push("sleep_difficulty");
    if ((responses.isi_4 || 0) >= 2) insomCritsMet.push("distress");
    if ((responses.isi_7 || 0) >= 2) insomCritsMet.push("daytime_impairment");
    if (scores.ISI.positive) insomCritsMet.push("clinical_threshold");
    if (scores.AUDIT_C.total < 4 && !scores.DAST10.positive) insomCritsMet.push("not_substance");
  }
  evidence.insomnia = {
    signal: scores.ISI.administered ? scores.ISI.total / 28 : 0,
    criteriaMet: scores.ISI.positive,
    severity: scores.ISI.severity,
    primary: scores.ISI.total,
    administered: scores.ISI.administered,
    criteriaMetIds: insomCritsMet
  };

  // ===== Schizotypal =====
  const schizCritsMet = [];
  if (scores.SPQB.administered) {
    if ([2, 3, 9].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("ideas_reference");
    if ([1, 5, 7].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("magical_thinking");
    if ([6, 8].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("perceptual");
    if ([19, 21].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("thought_speech");
    if ([10, 22].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("suspiciousness");
    if ([14, 16].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("constricted_affect");
    if ([17, 18].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("eccentric");
    if ([11, 13].some(i => responses[`spq_${i}`] === 1)) schizCritsMet.push("few_close");
    if (responses.spq_15 === 1 && scores.LSAS.total >= 25) schizCritsMet.push("social_anxiety");
  }
  evidence.schizotypal = {
    signal: scores.SPQB.administered ? scores.SPQB.total / 22 : 0,
    criteriaMet: scores.SPQB.positive,
    severity: scores.SPQB.severity,
    primary: scores.SPQB.total,
    administered: scores.SPQB.administered,
    criteriaMetIds: schizCritsMet
  };

  // ===== Somatic Symptom Disorder =====
  const somCritsMet = [];
  if (scores.PHQ15.administered) {
    if (scores.PHQ15.total >= 10) somCritsMet.push("somatic_symptoms");
    if (scores.PHQ15.total >= 10 && (evidence.gad?.signal > 0.4)) somCritsMet.push("preoccupation");
    if (scores.PHQ15.total >= 5) somCritsMet.push("duration");
    if ((responses.func_4 || 0) >= 2 || scores.FUNCTIONAL.total >= 8) somCritsMet.push("impairment");
  }
  evidence.somatic = {
    signal: scores.PHQ15.administered ? scores.PHQ15.total / 30 : 0,
    criteriaMet: scores.PHQ15.positive,
    severity: scores.PHQ15.severity,
    primary: scores.PHQ15.total,
    administered: scores.PHQ15.administered,
    criteriaMetIds: somCritsMet
  };

  // ACE & Functional & BPS
  evidence.ace = {
    signal: scores.ACE.total / 10,
    severity: scores.ACE.risk,
    primary: scores.ACE.total
  };
  evidence.fnc = {
    signal: scores.FUNCTIONAL.total / 20,
    severity: scores.FUNCTIONAL.severity,
    primary: scores.FUNCTIONAL.percentage
  };
  evidence.bps = scores.BPS;
  evidence.cssrs = scores.CSSRS;

  return evidence;
}

/* ============================================================
   SECTION 5 — CHARACTER MATCHING WITH SOFTMAX %
   ============================================================ */

function matchCharacters(evidence, characters) {
  // For each character, compute a score that:
  //  (1) rewards strong matches between high weights and high signals (peak pairing)
  //  (2) adds bonus for additional matched signals (depth of match)
  //  (3) penalizes characters whose primary criteria aren't met (gating)
  //  (4) penalizes characters whose primary disorders have low evidence (specificity)

  const results = characters.map(ch => {
    const weights = ch.weights;
    const dxKeys = Object.keys(weights);

    // Per-disorder contribution: signal × weight
    const contributions = dxKeys.map(dx => {
      const ev = evidence[dx];
      if (!ev) return { dx, signal: 0, weight: weights[dx], product: 0, criteriaMet: undefined };
      return {
        dx,
        signal: ev.signal || 0,
        weight: weights[dx],
        product: (ev.signal || 0) * weights[dx],
        criteriaMet: ev.criteriaMet
      };
    });

    contributions.sort((a, b) => b.product - a.product);

    // Peak match: top contribution (heavily weighted)
    const peak = contributions[0]?.product || 0;

    // Depth: sum of remaining contributions, weighted to add support without dominating
    const depth = contributions.slice(1).reduce((a, c) => a + c.product, 0);

    // Specificity penalty: if the *highest weighted* disorder has low signal, character is wrong fit
    const sortedByWeight = [...contributions].sort((a, b) => b.weight - a.weight);
    const primaryDx = sortedByWeight[0];
    const primarySignal = primaryDx?.signal || 0;
    let specificityMult = 1.0;
    if (primaryDx && primaryDx.weight >= 3.0) {
      // Character's *defining* disorder must have at least moderate signal
      if (primarySignal < 0.25) specificityMult = 0.20;
      else if (primarySignal < 0.40) specificityMult = 0.55;
      else if (primarySignal < 0.55) specificityMult = 0.85;
    } else if (primaryDx && primaryDx.weight >= 2.0) {
      if (primarySignal < 0.30) specificityMult = 0.45;
      else if (primarySignal < 0.50) specificityMult = 0.75;
    }

    // Criteria gating — count criteria-met among PRIMARY weights only (≥2.0)
    let criteriaTotal = 0, criteriaMatched = 0;
    contributions.forEach(c => {
      if (c.criteriaMet !== undefined && c.weight >= 2.0) {
        criteriaTotal++;
        if (c.criteriaMet) criteriaMatched++;
      }
    });
    let gateMult = 1.0;
    if (criteriaTotal > 0) {
      const ratio = criteriaMatched / criteriaTotal;
      if (ratio === 0) gateMult = 0.30;
      else if (ratio < 0.34) gateMult = 0.55;
      else if (ratio < 0.67) gateMult = 0.80;
      else gateMult = 1.0;
    } else {
      // No diagnostic-level weights: this is a trait/resilience archetype
      // Penalize when there is high overall distress
      const distress = (evidence.mdd?.signal || 0) + (evidence.gad?.signal || 0)
                      + (evidence.ptsd?.signal || 0) + (evidence.bpd?.signal || 0);
      if (distress > 1.6) gateMult = 0.30;
      else if (distress > 0.9) gateMult = 0.60;
    }

    // Combined raw score: peak weighted heavily, depth as supporting evidence
    const combinedRaw = (peak * 1.0) + (depth * 0.30);

    // Apply gates
    const finalScore = combinedRaw * specificityMult * gateMult;

    return {
      id: ch.id,
      name: ch.name,
      nameDisplay: ch.nameDisplay || ch.name,
      inspiredBy: ch.inspiredBy || null,
      archetype: ch.archetype,
      profile: ch.profile,
      metaphor: ch.metaphor,
      therapeuticUse: ch.therapeuticUse,
      traitTags: ch.traitTags,
      palette: ch.palette,
      contributions,
      peak,
      depth,
      combinedRaw,
      specificityMult,
      gateMult,
      criteriaMatched,
      criteriaTotal,
      finalScore,
      // legacy aliases
      rawScore: combinedRaw
    };
  });

  // Sort by finalScore
  results.sort((a, b) => b.finalScore - a.finalScore);

  // Softmax over top 8 with temperature; produces clean percentage spread
  const TEMP = 0.55;
  const top = results.slice(0, 8);

  // Normalize finalScores by max for temperature stability
  const maxScore = Math.max(...top.map(r => r.finalScore), 0.001);
  const expScores = top.map(r => Math.exp((r.finalScore / maxScore) / TEMP));
  const expSum = expScores.reduce((a, b) => a + b, 0);

  // Confidence floor: damp confidence when overall evidence is weak
  // Anchored to absolute peak score, not relative softmax
  const evidenceFloor = Math.min(1, maxScore / 1.8); // full confidence when peak ≥ 1.8

  top.forEach((r, i) => {
    const rawPct = expSum > 0 ? (expScores[i] / expSum) : 0;
    r.pct = Math.round(rawPct * 100 * evidenceFloor);
    r.rawPct = Math.round(rawPct * 100);

    // Confidence interval: width depends on (1) absolute evidence strength
    // and (2) how close this score is to the next-ranked. Wide CI when evidence
    // is weak or scores are bunched; narrow CI when evidence is strong + clearly separated.
    const evidenceFactor = Math.min(1, maxScore / 1.8);
    const nextScore = top[i + 1] ? top[i + 1].finalScore : 0;
    const separation = r.finalScore - nextScore;
    const separationFactor = Math.min(1, separation / 0.6);
    // Half-width: 2-15 percentage points depending on confidence
    const halfWidth = Math.round(2 + (1 - evidenceFactor) * 8 + (1 - separationFactor) * 5);
    r.ciLow = Math.max(0, r.pct - halfWidth);
    r.ciHigh = Math.min(100, r.pct + halfWidth);
    r.ciHalfWidth = halfWidth;
  });

  return top;
}

/* ============================================================
   SECTION 6 — MASTER REPORT GENERATOR
   ============================================================ */

function generateReport(responses, characters, options = {}) {
  const scores = scoreAll(responses, options);
  const evidence = compileDisorderEvidence(scores, responses);
  const matches = matchCharacters(evidence, characters);

  // Identify diagnoses meeting criteria
  const probableDiagnoses = [];
  const subclinical = [];

  Object.keys(DISORDERS).forEach(dxKey => {
    const ev = evidence[dxKey];
    if (!ev) return;
    if (ev.criteriaMet) {
      probableDiagnoses.push({
        key: dxKey,
        ...DISORDERS[dxKey],
        signal: ev.signal,
        severity: ev.severity,
        primary: ev.primary,
        flags: ev.flags || {}
      });
    } else if (ev.signal >= 0.3) {
      subclinical.push({
        key: dxKey,
        ...DISORDERS[dxKey],
        signal: ev.signal,
        severity: ev.severity,
        primary: ev.primary
      });
    }
  });

  probableDiagnoses.sort((a,b) => b.signal - a.signal);
  subclinical.sort((a,b) => b.signal - a.signal);

  // Safety flags
  const safetyFlags = [];
  if (evidence.mdd.flags && evidence.mdd.flags.si) {
    safetyFlags.push({
      severity: "URGENT",
      flag: "Suicidal ideation",
      source: "PHQ-9 item 9 endorsed",
      action: "Further safety assessment indicated. Provide 988 (Suicide & Crisis Lifeline), 741741 (Crisis Text Line), and 911 for emergency. Connect to clinical care."
    });
  }
  if (evidence.bpd.flags && evidence.bpd.flags.selfHarm) {
    safetyFlags.push({
      severity: "URGENT",
      flag: "Self-harm or attempt history",
      source: "MSI-BPD item 2 endorsed",
      action: "Means restriction discussion, safety planning intervention, DBT skills introduction. Consider higher level of care if active."
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    scores,
    evidence,
    matches,
    probableDiagnoses,
    subclinical,
    safetyFlags,
    functional: scores.FUNCTIONAL,
    personality: {
      bigFive: scores.TIPI,
      pid5: scores.PID5
    }
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    scoreAll, compileDisorderEvidence, matchCharacters, generateReport, DISORDERS
  };
}
