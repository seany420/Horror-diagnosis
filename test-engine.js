/* test-engine.js — smoke tests for the v2 battery (full-length forms).
   Run with: node test-engine.js
*/

const battery = require('./js/battery.js');
const engine = require('./js/engine.js');
const chars = require('./js/characters.js');

function runProfile(name, responses) {
  console.log(`\n========== ${name} ==========`);
  const report = engine.generateReport(responses, chars.CHARACTERS);
  console.log("\n-- TOP 5 MATCHES --");
  report.matches.slice(0,5).forEach((m,i) => {
    console.log(`  ${i+1}. ${m.name} — ${m.pct}%  [peak=${m.peak.toFixed(2)} depth=${m.depth.toFixed(2)} gate=${m.gateMult} spec=${m.specificityMult.toFixed(2)} final=${m.finalScore.toFixed(2)}]`);
  });
  console.log("\n-- PROBABLE DIAGNOSES --");
  report.probableDiagnoses.forEach(d => console.log(`  ${d.code}: ${d.name} (signal=${d.signal.toFixed(2)})`));
  console.log("-- SUBCLINICAL --");
  report.subclinical.forEach(d => console.log(`  ${d.code}: ${d.name} (signal=${d.signal.toFixed(2)})`));
  console.log("-- SAFETY --", report.safetyFlags.map(f => f.flag));
}

// Helper: build LSAS-24 fear ratings (defaults to 0)
function lsas(map = {}) {
  const out = {};
  for (let i = 1; i <= 24; i++) out[`lsas_${i}`] = map[i] ?? 0;
  return out;
}
// Helper: build PCL-5 full 20 (defaults to 0)
function pcl(map = {}) {
  const out = {};
  for (let i = 1; i <= 20; i++) out[`pcl_${i}`] = map[i] ?? 0;
  return out;
}
// Helper: build full PID-5-BF (5 items per domain, defaults to 0)
function pid(map = {}) {
  const out = {};
  ["neg","det","ant","dis","psy"].forEach(d => {
    for (let i = 1; i <= 5; i++) out[`pid_${d}${i}`] = map[`${d}${i}`] ?? 0;
  });
  return out;
}
// Helper: build full Y-BOCS-SR (10 items, defaults to 0)
function ybocs(map = {}) {
  const out = {};
  for (let i = 1; i <= 10; i++) out[`ybocs_${i}`] = map[i] ?? 0;
  return out;
}

// PROFILE 1: Trauma + ACE + Depression
runProfile("TRAUMA + ACE + DEPRESSION", {
  phq2_1: 2, phq2_2: 3,
  phq9_3: 2, phq9_4: 3, phq9_5: 1, phq9_6: 2, phq9_7: 2, phq9_8: 1, phq9_9: 1,
  gad2_1: 2, gad2_2: 3,
  gad7_3: 2, gad7_4: 2, gad7_5: 1, gad7_6: 2, gad7_7: 3,
  pcptsd_1: 1, pcptsd_2: 1, pcptsd_3: 1, pcptsd_4: 1, pcptsd_5: 1,
  // Full PCL-5: B (1-5), C (6-7), D (8-14), E (15-20)
  ...pcl({
    1: 3, 2: 3, 3: 2, 4: 3, 5: 2,                 // Cluster B
    6: 3, 7: 3,                                    // Cluster C
    8: 2, 9: 2, 10: 1, 11: 3, 12: 3, 13: 2, 14: 2, // Cluster D
    15: 2, 16: 1, 17: 3, 18: 3, 19: 2, 20: 2       // Cluster E
  }),
  des_1: 1, des_2: 2, des_3: 1, des_4: 2, des_5: 2, des_6: 1, des_7: 1, des_8: 1,
  msi_1: 0, msi_2: 0, msi_3: 0, msi_4: 1, msi_5: 0, msi_6: 1, msi_7: 1, msi_8: 1, msi_9: 0, msi_10: 0,
  ...pid({ neg1: 2, neg2: 2, neg3: 1, neg4: 1, neg5: 0,
            det1: 2, det2: 2, det3: 1, det4: 1, det5: 1,
            ant1: 0, ant2: 0, ant3: 0, ant4: 0, ant5: 0,
            dis1: 1, dis2: 1, dis3: 0, dis4: 0, dis5: 0,
            psy1: 1, psy2: 1, psy3: 0, psy4: 1, psy5: 0 }),
  ...ybocs({ 1: 0, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }),
  audit_1: 1, audit_2: 1, audit_3: 0,
  asrs_1: 2, asrs_2: 1, asrs_3: 1, asrs_4: 2, asrs_5: 1, asrs_6: 1,
  ...lsas({ 1: 2, 2: 1, 3: 1, 7: 2, 11: 1, 14: 1 }),
  ace_1: 1, ace_2: 1, ace_3: 0, ace_4: 1, ace_5: 0, ace_6: 1, ace_7: 0, ace_8: 1, ace_9: 1, ace_10: 0,
  // AQ-10 not administered
  mdq_1: 0, mdq_2: 1, mdq_3: 0, mdq_4: 0, mdq_5: 0, mdq_6: 0, mdq_7: 0, mdq_8: 0, mdq_9: 0, mdq_10: 0, mdq_11: 0, mdq_12: 0, mdq_13: 0,
  func_1: 3, func_2: 3, func_3: 2, func_4: 2, func_5: 3
});

// PROFILE 2: BPD with self-harm
runProfile("BPD + AFFECTIVE INSTABILITY", {
  phq2_1: 3, phq2_2: 3,
  phq9_3: 2, phq9_4: 2, phq9_5: 2, phq9_6: 3, phq9_7: 2, phq9_8: 2, phq9_9: 2,
  gad2_1: 3, gad2_2: 2,
  gad7_3: 2, gad7_4: 2, gad7_5: 2, gad7_6: 3, gad7_7: 2,
  pcptsd_1: 1, pcptsd_2: 0, pcptsd_3: 1, pcptsd_4: 1, pcptsd_5: 1,
  ...pcl({
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
    6: 2, 7: 2,
    8: 1, 9: 2, 10: 2, 11: 2, 12: 1, 13: 2, 14: 1,
    15: 2, 16: 2, 17: 1, 18: 2, 19: 1, 20: 2
  }),
  des_1: 2, des_2: 2, des_3: 2, des_4: 2, des_5: 2, des_6: 1, des_7: 1, des_8: 1,
  msi_1: 1, msi_2: 1, msi_3: 1, msi_4: 1, msi_5: 1, msi_6: 1, msi_7: 1, msi_8: 1, msi_9: 1, msi_10: 1,
  ...pid({ neg1: 3, neg2: 3, neg3: 3, neg4: 2, neg5: 1,
            det1: 1, det2: 1, det3: 1, det4: 0, det5: 1,
            ant1: 2, ant2: 2, ant3: 1, ant4: 1, ant5: 1,
            dis1: 3, dis2: 3, dis3: 3, dis4: 2, dis5: 2,
            psy1: 1, psy2: 1, psy3: 0, psy4: 1, psy5: 0 }),
  ...ybocs({}),
  audit_1: 2, audit_2: 2, audit_3: 1,
  asrs_1: 1, asrs_2: 2, asrs_3: 1, asrs_4: 2, asrs_5: 2, asrs_6: 1,
  ...lsas({ 1: 1, 7: 1, 11: 1, 12: 1 }),
  ace_1: 1, ace_2: 0, ace_3: 0, ace_4: 1, ace_5: 0, ace_6: 1, ace_7: 0, ace_8: 0, ace_9: 1, ace_10: 0,
  mdq_1: 0, mdq_2: 1, mdq_3: 1, mdq_4: 0, mdq_5: 1, mdq_6: 1, mdq_7: 0, mdq_8: 0, mdq_9: 0, mdq_10: 0, mdq_11: 0, mdq_12: 0, mdq_13: 0,
  func_1: 3, func_2: 4, func_3: 3, func_4: 3, func_5: 3
});

// PROFILE 3: Antisocial / antagonism
runProfile("ANTAGONISM / ANTISOCIAL", {
  phq2_1: 0, phq2_2: 0,
  gad2_1: 0, gad2_2: 0,
  pcptsd_1: 0, pcptsd_2: 0, pcptsd_3: 0, pcptsd_4: 0, pcptsd_5: 0,
  msi_1: 1, msi_2: 0, msi_3: 1, msi_4: 0, msi_5: 1, msi_6: 1, msi_7: 0, msi_8: 0, msi_9: 0, msi_10: 0,
  ...pid({ neg1: 0, neg2: 0, neg3: 0, neg4: 0, neg5: 0,
            det1: 1, det2: 1, det3: 1, det4: 1, det5: 1,
            ant1: 3, ant2: 3, ant3: 3, ant4: 3, ant5: 2,
            dis1: 3, dis2: 3, dis3: 2, dis4: 2, dis5: 3,
            psy1: 0, psy2: 0, psy3: 0, psy4: 0, psy5: 0 }),
  ...ybocs({}),
  audit_1: 3, audit_2: 3, audit_3: 2,
  asrs_1: 2, asrs_2: 2, asrs_3: 2, asrs_4: 1, asrs_5: 2, asrs_6: 2,
  ...lsas({}),
  ace_1: 1, ace_2: 1, ace_3: 0, ace_4: 0, ace_5: 0, ace_6: 1, ace_7: 1, ace_8: 1, ace_9: 0, ace_10: 1,
  mdq_1: 1, mdq_2: 1, mdq_3: 1, mdq_4: 0, mdq_5: 0, mdq_6: 0, mdq_7: 0, mdq_8: 0, mdq_9: 0, mdq_10: 0, mdq_11: 0, mdq_12: 1, mdq_13: 1,
  func_1: 1, func_2: 1, func_3: 0, func_4: 0, func_5: 1
});

// PROFILE 4: Pure OCD + Anxiety
runProfile("OCD + ANXIETY", {
  phq2_1: 1, phq2_2: 1,
  gad2_1: 3, gad2_2: 3,
  gad7_3: 3, gad7_4: 3, gad7_5: 2, gad7_6: 2, gad7_7: 3,
  pcptsd_1: 0, pcptsd_2: 0, pcptsd_3: 1, pcptsd_4: 0, pcptsd_5: 0,
  msi_1: 0, msi_2: 0, msi_3: 0, msi_4: 0, msi_5: 0, msi_6: 0, msi_7: 0, msi_8: 0, msi_9: 0, msi_10: 0,
  ...pid({ neg1: 3, neg2: 2, neg3: 1, neg4: 2, neg5: 0,
            det1: 0, det2: 1, det3: 0, det4: 0, det5: 0,
            ant1: 0, ant2: 0, ant3: 0, ant4: 0, ant5: 0,
            dis1: 0, dis2: 0, dis3: 0, dis4: 0, dis5: 0,
            psy1: 0, psy2: 0, psy3: 0, psy4: 0, psy5: 0 }),
  ...ybocs({ 1: 3, 2: 3, 3: 3, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 2, 10: 3 }),
  audit_1: 0, audit_2: 0, audit_3: 0,
  asrs_1: 1, asrs_2: 1, asrs_3: 1, asrs_4: 1, asrs_5: 0, asrs_6: 0,
  ...lsas({ 1: 1, 7: 1, 11: 1 }),
  ace_1: 0, ace_2: 0, ace_3: 0, ace_4: 0, ace_5: 0, ace_6: 0, ace_7: 0, ace_8: 0, ace_9: 0, ace_10: 0,
  mdq_1: 0, mdq_2: 0, mdq_3: 0, mdq_4: 0, mdq_5: 0, mdq_6: 0, mdq_7: 0, mdq_8: 0, mdq_9: 0, mdq_10: 0, mdq_11: 0, mdq_12: 0, mdq_13: 0,
  func_1: 2, func_2: 1, func_3: 2, func_4: 1, func_5: 1
});

// PROFILE 5: Healthy
runProfile("LOW DISTRESS / HEALTHY", {
  phq2_1: 0, phq2_2: 0,
  gad2_1: 1, gad2_2: 0,
  pcptsd_1: 0, pcptsd_2: 0, pcptsd_3: 0, pcptsd_4: 0, pcptsd_5: 0,
  msi_1: 0, msi_2: 0, msi_3: 0, msi_4: 0, msi_5: 0, msi_6: 0, msi_7: 0, msi_8: 0, msi_9: 0, msi_10: 0,
  ...pid({}),
  ...ybocs({}),
  audit_1: 1, audit_2: 1, audit_3: 0,
  asrs_1: 0, asrs_2: 1, asrs_3: 0, asrs_4: 1, asrs_5: 0, asrs_6: 0,
  ...lsas({}),
  ace_1: 0, ace_2: 0, ace_3: 0, ace_4: 0, ace_5: 0, ace_6: 0, ace_7: 0, ace_8: 0, ace_9: 0, ace_10: 0,
  mdq_1: 0, mdq_2: 0, mdq_3: 0, mdq_4: 0, mdq_5: 0, mdq_6: 0, mdq_7: 0, mdq_8: 0, mdq_9: 0, mdq_10: 0, mdq_11: 0, mdq_12: 0, mdq_13: 0,
  func_1: 0, func_2: 0, func_3: 0, func_4: 0, func_5: 0
});
