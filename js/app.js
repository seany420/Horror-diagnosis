/* ============================================================
   SCREAM PROFILE — Main Application
   ============================================================
   Adaptive battery administration with gated branching.
   Handles instrument flow, response capture, real-time gate
   evaluation, scoring, and report generation.
   ============================================================ */

const APP = {
  state: "intro", // intro | browse | character-detail | battery | interstitial | report | saved-report | fun-intro | fun-battery | fun-report | comparison | comparisons | predict-intro | predict-battery | predict-report | predict-list
  responses: {},
  funResponses: {},
  funReport: null,
  funCurrentIdx: 0,
  predictResponses: {},
  predictFriendName: "",
  predictReport: null,
  predictCurrentIdx: 0,
  predictItemHistory: [],
  predictions: [], // saved predictions for others
  instrumentList: [],
  currentInstrumentIdx: 0,
  currentItemIdx: 0,
  unlockedConditional: new Set(),
  startTime: null,
  itemHistory: [], // for back-navigation: { instrumentIdx, itemIdx, itemId }
  funItemHistory: [],
  browseFilter: "all",
  detailCharacterId: null,
  hasCompletedScreening: false, // gates DSM associations on browse tab (Option B)
  hasCompletedFun: false,
  report: null, // populated after generateReport
  STORAGE_KEY: "scream_profile_v2",
  FUN_STORAGE_KEY: "scream_profile_fun_v3",
  PREDICTIONS_KEY: "scream_profile_predictions_v3",
  PROGRESS_KEY: "scream_profile_v3_progress",
  COMPARISONS_KEY: "scream_profile_comparisons",

  init() {
    this.completedInstrumentIds = new Set();
    this.bindEvents();
    this.loadFromStorage();
    this.detectInProgress();
    this.render();
  },

  detectInProgress() {
    try {
      const raw = localStorage.getItem(this.PROGRESS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.responses && Object.keys(data.responses).length > 0) {
          this.hasInProgressSave = true;
          this.inProgressSavedAt = data.savedAt;
        }
      }
    } catch(_) {}
  },

  bindEvents() {
    document.addEventListener("click", (e) => {
      // Fun-option button click → record response (fun or predict)
      const funOpt = e.target.closest(".fun-option[data-fun-option]");
      if (funOpt && (this.state === "fun-battery" || this.state === "predict-battery")) {
        const optionId = funOpt.dataset.funOption;
        const scenarioId = funOpt.dataset.funScenario;
        if (scenarioId && optionId) {
          if (this.state === "fun-battery") this.recordFunResponse(scenarioId, optionId);
          else this.recordPredictResponse(scenarioId, optionId);
        }
        return;
      }

      const action = e.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      switch (action) {
        case "begin": this.beginBattery(); break;
        case "resume": this.resumeAndRender(); break;
        case "discard-progress":
          if (confirm("Discard your in-progress screening? This cannot be undone.")) {
            this.clearProgressFromStorage();
            this.hasInProgressSave = false;
            this.render();
          }
          break;
        case "pause-exit":
          this.pauseAndExit();
          break;
        case "dismiss-interstitial":
          this.dismissInterstitial();
          break;
        case "share-card":
          this.generateShareCard();
          break;
        case "save-comparison":
          this.saveComparison();
          break;
        case "view-comparisons":
          this.state = "comparisons";
          this.render();
          break;
        case "begin-fun":
          this.beginFunAssessment();
          break;
        case "view-fun-report":
          if (this.funReport) { this.state = "fun-report"; this.render(); }
          break;
        case "view-comparison":
          this.state = "comparison";
          this.render();
          break;
        case "fun-back":
          this.funGoBack();
          break;
        case "fun-share-card":
          this.generateFunShareCard();
          break;
        case "retake-fun":
          if (confirm("Take the trait assessment again? Your current trait result will be replaced.")) {
            this.funResponses = {};
            this.funReport = null;
            this.hasCompletedFun = false;
            try { localStorage.removeItem(this.FUN_STORAGE_KEY); } catch(_) {}
            this.beginFunAssessment();
          }
          break;
        case "clear-fun":
          if (confirm("Clear your saved trait assessment result? This cannot be undone.")) {
            try { localStorage.removeItem(this.FUN_STORAGE_KEY); } catch(_) {}
            this.funReport = null;
            this.funResponses = {};
            this.hasCompletedFun = false;
            this.render();
          }
          break;
        case "predict-friend":
          this.state = "predict-intro";
          this.predictFriendName = "";
          this.render();
          break;
        case "begin-predict": {
          const nameInput = document.getElementById("predict-friend-name");
          const name = (nameInput?.value || "").trim();
          if (!name) {
            const err = document.getElementById("predict-name-error");
            if (err) err.textContent = "Please enter a name to continue.";
            return;
          }
          this.predictFriendName = name;
          this.beginPredictAssessment();
          break;
        }
        case "predict-back":
          this.predictGoBack();
          break;
        case "predict-share-card":
          this.generatePredictShareCard();
          break;
        case "save-prediction":
          this.savePrediction();
          break;
        case "view-predictions":
          this.state = "predict-list";
          this.render();
          break;
        case "delete-prediction": {
          const pid = e.target.closest("[data-prediction-id]")?.dataset.predictionId;
          if (pid && confirm("Delete this saved prediction?")) {
            this.deletePrediction(pid);
            this.render();
          }
          break;
        }
        case "delete-comparison": {
          const cid = e.target.closest("[data-comparison-id]")?.dataset.comparisonId;
          if (cid && confirm("Delete this saved comparison?")) {
            this.deleteComparison(cid);
            this.render();
          }
          break;
        }
        case "consent-back": this.state = "intro"; this.render(); break;
        case "back": this.goBack(); break;
        case "retake": this.reset(); break;
        case "print": window.print(); break;
        case "export-json": this.exportJSON(); break;
        case "save-result": this.saveToStorage(true); break;
        case "load-json-trigger":
          document.getElementById("load-json-input")?.click();
          break;
        case "browse": this.state = "browse"; this.render(); break;
        case "back-to-intro": this.state = "intro"; this.render(); break;
        case "back-to-browse": this.state = "browse"; this.render(); break;
        case "character-detail": {
          const cid = e.target.closest("[data-character-id]")?.dataset.characterId;
          if (cid) { this.detailCharacterId = cid; this.state = "character-detail"; this.render(); }
          break;
        }
        case "filter-browse": {
          const f = e.target.closest("[data-filter]")?.dataset.filter;
          if (f) { this.browseFilter = f; this.render(); }
          break;
        }
        case "view-saved":
          if (this.report) { this.state = "report"; this.render(); }
          break;
        case "clear-saved":
          if (confirm("Clear your saved screening result? This cannot be undone.")) {
            try { localStorage.removeItem(this.STORAGE_KEY); } catch(_) {}
            this.report = null;
            this.hasCompletedScreening = false;
            this.render();
          }
          break;
        case "toggle-disorder":
          const card = e.target.closest(".dx-card");
          if (card) card.classList.toggle("expanded");
          break;
        case "show-evidence":
          document.querySelector(".evidence-panel")?.classList.toggle("visible");
          break;
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.matches("input[type=radio][data-item]")) {
        const itemId = e.target.dataset.item;
        const value = parseFloat(e.target.value);
        // Immediate visual feedback: highlight the clicked option, dim siblings,
        // and explicitly remove .selected from any prior siblings.
        const label = e.target.closest("label.response-opt");
        if (label) {
          const container = label.parentNode;
          if (container) {
            container.querySelectorAll("label.response-opt.selected").forEach(el => {
              el.classList.remove("selected");
            });
          }
          label.classList.add("selected");
        }
        this.recordResponse(itemId, value);
      }
      if (e.target.matches("#load-json-input")) {
        const file = e.target.files?.[0];
        if (file) this.importJSON(file);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (this.state === "fun-battery" || this.state === "predict-battery") {
        if (e.key >= "1" && e.key <= "9") {
          const buttons = document.querySelectorAll(".fun-option[data-fun-option]");
          const idx = parseInt(e.key) - 1;
          if (buttons[idx]) buttons[idx].click();
        } else if (e.key === "ArrowLeft") {
          if (this.state === "fun-battery") this.funGoBack();
          else this.predictGoBack();
        }
        return;
      }
      if (this.state !== "battery") return;
      if (e.key >= "1" && e.key <= "9") {
        const radios = document.querySelectorAll("input[type=radio][data-item]:not(:disabled)");
        const idx = parseInt(e.key) - 1;
        if (radios[idx]) {
          radios[idx].checked = true;
          radios[idx].dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else if (e.key === "ArrowLeft") {
        this.goBack();
      } else if (e.key === "Escape") {
        this.pauseAndExit();
      }
    });
  },

  beginBattery() {
    // Guard: if there's a saved in-progress screening, confirm before wiping.
    if (this.hasInProgressSave) {
      const ok = confirm("You have a screening in progress. Starting a new one will erase your saved progress.\n\nContinue and start fresh?");
      if (!ok) return;
      this.clearProgressFromStorage();
      this.hasInProgressSave = false;
    }
    this.state = "battery";
    this.startTime = Date.now();
    this.responses = {};
    this.unlockedConditional.clear();
    this.itemHistory = [];
    this.completedInstrumentIds = new Set();

    const built = BATTERY.buildAdministered({});
    this.instrumentList = built.list;
    this.currentInstrumentIdx = 0;
    this.currentItemIdx = 0;
    this.render();
  },

  recordResponse(itemId, value) {
    this.responses[itemId] = value;

    // Re-evaluate gates whenever a gate-instrument finishes
    const inst = this.instrumentList[this.currentInstrumentIdx];
    const itemIdx = inst.items.findIndex(i => i.id === itemId);
    const isLastItem = itemIdx === inst.items.length - 1;

    if (isLastItem) {
      // gate evaluation, then advance
      this.evaluateGates();
      // small delay for tactile feel
      setTimeout(() => this.advance(itemId), 220);
    } else {
      setTimeout(() => this.advance(itemId), 180);
    }
  },

  evaluateGates() {
    // Compute gate scores from responses, rebuild instrument list
    const gateScores = {
      PHQ2: (this.responses.phq2_1 || 0) + (this.responses.phq2_2 || 0),
      GAD2: (this.responses.gad2_1 || 0) + (this.responses.gad2_2 || 0),
      PC_PTSD: ["pcptsd_1","pcptsd_2","pcptsd_3","pcptsd_4","pcptsd_5"]
        .reduce((a,k) => a + (this.responses[k] || 0), 0)
    };
    const built = BATTERY.buildAdministered(gateScores);
    // Splice in any newly unlocked instruments after current position
    const currentInst = this.instrumentList[this.currentInstrumentIdx];
    const masterOrder = built.list;
    const currentIdxInMaster = masterOrder.findIndex(i => i.id === currentInst.id);
    if (currentIdxInMaster >= 0) {
      // Take everything from currentIdxInMaster onward in master order
      const remaining = masterOrder.slice(currentIdxInMaster);
      const completed = this.instrumentList.slice(0, this.currentInstrumentIdx + 1);
      this.instrumentList = [...completed, ...remaining.slice(1)];
    }
    this.unlockedConditional = new Set(built.unlocked);
  },

  advance(lastAnsweredItemId) {
    // Guard: if we've moved on from battery state, ignore stale setTimeout calls
    if (this.state !== "battery") return;
    if (this.currentInstrumentIdx >= this.instrumentList.length) return;

    this.itemHistory.push({
      instrumentIdx: this.currentInstrumentIdx,
      itemIdx: this.currentItemIdx,
      itemId: lastAnsweredItemId
    });

    const inst = this.instrumentList[this.currentInstrumentIdx];
    if (!inst) return;
    const wasLastItem = this.currentItemIdx >= inst.items.length - 1;

    if (!wasLastItem) {
      this.currentItemIdx++;
    } else {
      // Finished an instrument — save progress, possibly trigger interstitial, advance
      this.saveProgressToStorage();
      this.completedInstrumentIds = this.completedInstrumentIds || new Set();
      this.completedInstrumentIds.add(inst.id);
      // Dynamically inject C-SSRS if SI just got endorsed and CSSRS not yet in list
      if (BATTERY.getSICondiCSSRS) {
        const cssrs = BATTERY.getSICondiCSSRS(this.responses);
        if (cssrs && !this.instrumentList.find(x => x.id === "CSSRS")) {
          this.instrumentList.splice(this.currentInstrumentIdx + 1, 0, cssrs);
        }
      }
      this.currentInstrumentIdx++;
      this.currentItemIdx = 0;

      // Show interstitial after every 3 instruments unless we just finished
      if (this.currentInstrumentIdx >= this.instrumentList.length) {
        this.finalize();
        return;
      }
      // Trigger interstitial if appropriate (every Nth instrument or at major boundaries)
      if (this.shouldShowInterstitial()) {
        this.state = "interstitial";
        this.render();
        return;
      }
    }

    // Skip items that reuse a previously-answered item
    this.skipDuplicateItems();

    if (this.currentInstrumentIdx >= this.instrumentList.length) {
      this.finalize();
      return;
    }
    this.render();
  },

  // Skip items annotated with `reuses: "other_item_id"` if that item already has a response.
  // Forwards the previous response under the new item ID to keep scoring consistent.
  skipDuplicateItems() {
    let safety = 0;
    while (safety++ < 50 && this.currentInstrumentIdx < this.instrumentList.length) {
      const inst = this.instrumentList[this.currentInstrumentIdx];
      if (!inst || !inst.items[this.currentItemIdx]) break;
      const item = inst.items[this.currentItemIdx];
      if (item.reuses && this.responses[item.reuses] !== undefined) {
        // Forward-copy the response to the new ID
        this.responses[item.id] = this.responses[item.reuses];
        // Advance past this item without rendering
        if (this.currentItemIdx < inst.items.length - 1) {
          this.currentItemIdx++;
        } else {
          this.currentInstrumentIdx++;
          this.currentItemIdx = 0;
        }
      } else {
        break;
      }
    }
  },

  shouldShowInterstitial() {
    // Show after instruments at meaningful boundaries — but not after the last instrument
    if (this.currentInstrumentIdx >= this.instrumentList.length) return false;
    const justFinished = this.instrumentList[this.currentInstrumentIdx - 1];
    if (!justFinished) return false;
    // Show after gates (PHQ2, GAD2, PC_PTSD), after BPS_INTAKE, after major instruments
    const triggerIds = new Set(["PHQ2", "GAD2", "PC_PTSD", "BPS_INTAKE", "PCL5_FULL", "MSI_BPD", "EAT_26", "SPQ_B", "TIPI"]);
    return triggerIds.has(justFinished.id);
  },

  dismissInterstitial() {
    this.state = "battery";
    this.skipDuplicateItems();
    if (this.currentInstrumentIdx >= this.instrumentList.length) {
      this.finalize();
      return;
    }
    this.render();
  },

  saveProgressToStorage() {
    // Auto-save mid-battery so the user can resume after browser refresh
    try {
      const payload = {
        version: "scream_profile_v3_progress",
        savedAt: new Date().toISOString(),
        responses: this.responses,
        currentInstrumentIdx: this.currentInstrumentIdx,
        currentItemIdx: this.currentItemIdx,
        instrumentIds: this.instrumentList.map(i => i.id),
        startTime: this.startTime,
        completedInstrumentIds: Array.from(this.completedInstrumentIds || [])
      };
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(payload));
    } catch(_) {}
  },

  clearProgressFromStorage() {
    try { localStorage.removeItem(this.PROGRESS_KEY); } catch(_) {}
  },

  resumeAndRender() {
    if (this.resumeFromProgress()) {
      this.render();
    } else {
      alert("Could not resume. The saved progress may have been corrupted.");
      this.hasInProgressSave = false;
      this.render();
    }
  },

  // ============== COMPARISONS ==============
  loadComparisons() {
    try {
      const raw = localStorage.getItem(this.COMPARISONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(_) { return []; }
  },

  saveComparison() {
    if (!this.report) return;
    try {
      const list = this.loadComparisons();
      const entry = {
        id: "cmp_" + Date.now(),
        savedAt: new Date().toISOString(),
        topMatch: this.report.matches[0]?.inspiredBy?.primary || this.report.matches[0]?.name,
        topPct: this.report.matches[0]?.pct,
        probableDxCount: this.report.probableDiagnoses.length,
        bigFive: this.report.personality?.bigFive,
        functional: this.report.functional?.percentage,
        report: this.report
      };
      list.unshift(entry);
      // Cap at 12 comparisons
      const capped = list.slice(0, 12);
      localStorage.setItem(this.COMPARISONS_KEY, JSON.stringify(capped));
      const btn = document.querySelector('[data-action="save-comparison"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "✓ Added to history";
        setTimeout(() => { btn.textContent = orig; }, 1800);
      }
    } catch(e) {
      alert("Could not save comparison. Local storage may be full.");
    }
  },

  deleteComparison(id) {
    try {
      const list = this.loadComparisons().filter(c => c.id !== id);
      localStorage.setItem(this.COMPARISONS_KEY, JSON.stringify(list));
    } catch(_) {}
  },

  // ============== SHARE CARD ==============
  generateShareCard() {
    if (!this.report || !this.report.matches?.length) return;
    const m = this.report.matches[0];
    const name = m.inspiredBy?.primary || m.name;
    const film = m.inspiredBy?.film || "";
    const archetype = m.archetype || "";
    const pct = m.pct || 0;

    const W = 800, H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(0.5, "#1a1018");
    grad.addColorStop(1, "#0a0a14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Outer borders
    ctx.strokeStyle = "#c4a060";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = "rgba(196, 160, 96, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Top brand strip
    ctx.fillStyle = "#c4a060";
    ctx.font = 'bold 24px serif';
    ctx.textAlign = "center";
    ctx.fillText("SCREAM PROFILE", W / 2, 90);
    ctx.fillStyle = "#888";
    ctx.font = 'italic 16px serif';
    ctx.fillText("Find Your Horror Archetype", W / 2, 118);

    // Decorative skull mini in top-left and right
    this.drawMiniSkull(ctx, 80, 90, 20);
    this.drawMiniSkull(ctx, W - 80, 90, 20);

    // Big "I MATCHED WITH" label
    ctx.fillStyle = "#888";
    ctx.font = 'bold 14px monospace';
    ctx.fillText("I  M A T C H E D  W I T H", W / 2, 200);

    // Character name (large)
    ctx.fillStyle = "#e8dfcc";
    const nameSize = name.length > 18 ? 56 : (name.length > 12 ? 64 : 72);
    ctx.font = `bold ${nameSize}px serif`;
    this.wrapText(ctx, name, W / 2, 280, W - 100, nameSize + 10);

    // Film (italic)
    ctx.fillStyle = "#b8a888";
    ctx.font = 'italic 26px serif';
    ctx.fillText(film, W / 2, 410);

    // Archetype (small caps)
    ctx.fillStyle = "#c4a060";
    ctx.font = 'bold 16px monospace';
    ctx.fillText(archetype.toUpperCase(), W / 2, 460);

    // Big skull illustration in middle
    this.drawBigSkull(ctx, W / 2, 680, 180);

    // Match percentage
    ctx.fillStyle = "#c4a060";
    ctx.font = 'bold 110px serif';
    ctx.fillText(`${pct}%`, W / 2, 980);
    ctx.fillStyle = "#888";
    ctx.font = 'bold 14px monospace';
    ctx.fillText("M A T C H", W / 2, 1010);

    // Footer
    ctx.fillStyle = "#888";
    ctx.font = '14px serif';
    ctx.fillText("seany420.github.io/Horror-diagnosis", W / 2, 1110);
    ctx.fillStyle = "#666";
    ctx.font = 'italic 11px serif';
    ctx.fillText("38 horror characters · 14 DSM-5-TR conditions · Adaptive screening", W / 2, 1135);

    // Convert to blob; share or download depending on device
    canvas.toBlob((blob) => {
      if (!blob) return;
      const filename = `scream-profile-match-${name.replace(/[^\w]/g, "-").toLowerCase()}.png`;
      this.downloadOrShare(
        blob,
        filename,
        "My Scream Profile match",
        `My top horror archetype match: ${name} (${pct}%) — find your own at seany420.github.io/Horror-diagnosis`,
        '[data-action="share-card"]'
      );
    }, "image/png");
  },

  // ============== DOWNLOAD/SHARE HELPER (mobile-friendly) ==============
  // Uses Web Share API when available (iOS Safari, mobile Android Chrome),
  // falls back to anchor download on desktop. Appends anchor to DOM
  // (required for iOS Safari to honor a.click() programmatically).
  async downloadOrShare(blob, filename, shareTitle, shareText, btnSelector) {
    const setBtnFeedback = (msg) => {
      const btn = document.querySelector(btnSelector);
      if (btn) {
        const orig = btn.dataset.origText || btn.textContent;
        btn.dataset.origText = orig;
        btn.textContent = msg;
        setTimeout(() => { btn.textContent = orig; }, 2200);
      }
    };

    // Try Web Share API with files (best for mobile)
    try {
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText
        });
        setBtnFeedback("✓ Shared");
        return;
      }
    } catch (err) {
      // User canceled share, or share threw — fall through to download
      if (err && err.name === "AbortError") {
        // User canceled — do nothing, no fallback needed
        return;
      }
    }

    // Fallback: anchor download
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);  // iOS Safari requires this
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 5000);
      setBtnFeedback("✓ Downloaded");
    } catch (err) {
      // Last resort: open in new tab so user can long-press save
      try {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setBtnFeedback("✓ Opened (long-press image to save)");
      } catch (err2) {
        setBtnFeedback("✗ Could not save");
      }
    }
  },

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (const w of words) {
      const testLine = line + w + ' ';
      if (ctx.measureText(testLine).width > maxWidth && line.length) {
        lines.push(line.trim());
        line = w + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    const totalH = lines.length * lineHeight;
    let yy = y - totalH / 2 + lineHeight / 2;
    for (const ln of lines) {
      ctx.fillText(ln, x, yy);
      yy += lineHeight;
    }
  },

  drawMiniSkull(ctx, cx, cy, r) {
    ctx.save();
    ctx.fillStyle = "#8b1a1a";
    ctx.beginPath();
    ctx.arc(cx, cy - 2, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - 2, r * 0.18, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.35, cy - 2, r * 0.18, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawBigSkull(ctx, cx, cy, r) {
    ctx.save();
    // Outer ring
    ctx.strokeStyle = "rgba(196, 160, 96, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
    ctx.stroke();
    // Skull body (upper rounded)
    ctx.fillStyle = "#8b1a1a";
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.15, r * 0.85, r * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    // Jaw block
    ctx.fillRect(cx - r * 0.55, cy + r * 0.35, r * 1.1, r * 0.55);
    // Eyes
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.32, cy - r * 0.05, r * 0.18, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy - r * 0.05, r * 0.18, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye glow
    ctx.fillStyle = "#c4a060";
    ctx.beginPath();
    ctx.arc(cx - r * 0.32, cy - r * 0.05, r * 0.04, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.32, cy - r * 0.05, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, cy + r * 0.25);
    ctx.lineTo(cx + r * 0.08, cy + r * 0.25);
    ctx.lineTo(cx, cy + r * 0.50);
    ctx.closePath();
    ctx.fill();
    // Teeth
    ctx.fillRect(cx - r * 0.30, cy + r * 0.65, r * 0.60, r * 0.12);
    ctx.strokeStyle = "#8b1a1a";
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i++) {
      const x = cx - r * 0.30 + (r * 0.60 * i / 4);
      ctx.beginPath();
      ctx.moveTo(x, cy + r * 0.65);
      ctx.lineTo(x, cy + r * 0.77);
      ctx.stroke();
    }
    ctx.restore();
  },

  pauseAndExit() {
    // Explicitly save and return to intro. Mark in-progress so the resume panel appears.
    this.saveProgressToStorage();
    this.hasInProgressSave = true;
    this.inProgressSavedAt = new Date().toISOString();
    this.state = "intro";
    this.render();
  },

  resumeFromProgress() {
    try {
      const raw = localStorage.getItem(this.PROGRESS_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.responses || !data.instrumentIds) return false;
      this.responses = data.responses;
      // Rebuild instrument list from saved gate scores so unlocks are correct
      const gateScores = {
        PHQ2: ((this.responses.phq2_1 || 0) + (this.responses.phq2_2 || 0)),
        GAD2: ((this.responses.gad2_1 || 0) + (this.responses.gad2_2 || 0)),
        PC_PTSD: ["pcptsd_1","pcptsd_2","pcptsd_3","pcptsd_4","pcptsd_5"]
                 .reduce((a, k) => a + (this.responses[k] || 0), 0)
      };
      const built = BATTERY.buildAdministered(gateScores);
      this.instrumentList = built.list;
      // If CSSRS was unlocked dynamically, add it back if SI is still endorsed
      if (BATTERY.getSICondiCSSRS) {
        const cssrs = BATTERY.getSICondiCSSRS(this.responses);
        if (cssrs && !this.instrumentList.find(x => x.id === "CSSRS")) {
          this.instrumentList.push(cssrs);
        }
      }
      // Find the saved position by instrument ID (more robust than index)
      const savedInstId = data.instrumentIds[data.currentInstrumentIdx];
      const newIdx = this.instrumentList.findIndex(i => i.id === savedInstId);
      this.currentInstrumentIdx = newIdx >= 0 ? newIdx : 0;
      this.currentItemIdx = data.currentItemIdx || 0;
      this.startTime = data.startTime || Date.now();
      this.completedInstrumentIds = new Set(data.completedInstrumentIds || []);
      this.itemHistory = [];
      this.state = "battery";
      return true;
    } catch (e) {
      return false;
    }
  },

  goBack() {
    if (!this.itemHistory.length) return;
    const last = this.itemHistory.pop();
    delete this.responses[last.itemId];
    this.currentInstrumentIdx = last.instrumentIdx;
    this.currentItemIdx = last.itemIdx;
    this.render();
  },

  finalize() {
    this.state = "report";
    this.report = generateReport(this.responses, CHARACTERS);
    this.hasCompletedScreening = true;
    this.saveToStorage(false);
    this.render();
  },

  // ============== FUN ASSESSMENT ==============
  beginFunAssessment() {
    this.state = "fun-battery";
    this.funResponses = {};
    this.funCurrentIdx = 0;
    this.funItemHistory = [];
    this.render();
  },

  recordFunResponse(scenarioId, optionId) {
    this.funResponses[scenarioId] = optionId;
    this.funItemHistory.push({ idx: this.funCurrentIdx, scenarioId });
    // Smooth advance
    setTimeout(() => this.advanceFun(), 220);
  },

  advanceFun() {
    if (this.state !== "fun-battery") return;
    if (this.funCurrentIdx < FUN_SCENARIOS.length - 1) {
      this.funCurrentIdx++;
      this.render();
    } else {
      this.finalizeFun();
    }
  },

  funGoBack() {
    if (!this.funItemHistory.length) return;
    const last = this.funItemHistory.pop();
    delete this.funResponses[last.scenarioId];
    this.funCurrentIdx = last.idx;
    this.render();
  },

  finalizeFun() {
    this.funReport = generateFunReport(this.funResponses, CHARACTERS);
    this.hasCompletedFun = true;
    this.saveFunToStorage();
    this.state = "fun-report";
    this.render();
  },

  generateFunShareCard() {
    if (!this.funReport || !this.funReport.matches?.length) return;
    const m = this.funReport.matches[0];
    const name = m.inspiredBy?.primary || m.name;
    const film = m.inspiredBy?.film || "";
    const archetype = m.archetype || "";
    const pct = m.pct || 0;

    const W = 800, H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Different palette for fun card — playful purple/yellow
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#1a0820");
    grad.addColorStop(0.5, "#2a1830");
    grad.addColorStop(1, "#0a0510");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Yellow border
    ctx.strokeStyle = "#f5d547";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = "rgba(245, 213, 71, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Brand
    ctx.fillStyle = "#f5d547";
    ctx.font = 'bold 24px serif';
    ctx.textAlign = "center";
    ctx.fillText("SCREAM PROFILE", W / 2, 90);
    ctx.fillStyle = "#a89878";
    ctx.font = 'italic 16px serif';
    ctx.fillText("Trait Match — Who You Are", W / 2, 118);

    // Mini skulls
    this.drawMiniSkull(ctx, 80, 90, 20);
    this.drawMiniSkull(ctx, W - 80, 90, 20);

    // "I MATCHED WITH" label
    ctx.fillStyle = "#a89878";
    ctx.font = 'bold 14px monospace';
    ctx.fillText("M Y  H O R R O R  T R A I T  M A T C H", W / 2, 200);

    // Character name
    ctx.fillStyle = "#fff";
    const nameSize = name.length > 18 ? 56 : (name.length > 12 ? 64 : 72);
    ctx.font = `bold ${nameSize}px serif`;
    this.wrapText(ctx, name, W / 2, 280, W - 100, nameSize + 10);

    // Film
    ctx.fillStyle = "#c8b0d8";
    ctx.font = 'italic 26px serif';
    ctx.fillText(film, W / 2, 410);

    // Archetype
    ctx.fillStyle = "#f5d547";
    ctx.font = 'bold 16px monospace';
    ctx.fillText(archetype.toUpperCase(), W / 2, 460);

    // Skull
    this.drawBigSkull(ctx, W / 2, 680, 180);

    // Match percentage
    ctx.fillStyle = "#f5d547";
    ctx.font = 'bold 110px serif';
    ctx.fillText(`${pct}%`, W / 2, 980);
    ctx.fillStyle = "#a89878";
    ctx.font = 'bold 14px monospace';
    ctx.fillText("T R A I T  M A T C H", W / 2, 1010);

    // Footer
    ctx.fillStyle = "#a89878";
    ctx.font = '14px serif';
    ctx.fillText("seany420.github.io/Horror-diagnosis", W / 2, 1110);
    ctx.fillStyle = "#786870";
    ctx.font = 'italic 11px serif';
    ctx.fillText("15 trait dimensions · 35 horror scenarios · Character-traits assessment", W / 2, 1135);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const filename = `scream-profile-trait-${name.replace(/[^\w]/g, "-").toLowerCase()}.png`;
      this.downloadOrShare(
        blob,
        filename,
        "My Scream Profile trait match",
        `My horror trait match: ${name} (${pct}%) — find yours at seany420.github.io/Horror-diagnosis`,
        '[data-action="fun-share-card"]'
      );
    }, "image/png");
  },

  // ============== PREDICT-A-FRIEND ==============
  beginPredictAssessment() {
    this.state = "predict-battery";
    this.predictResponses = {};
    this.predictCurrentIdx = 0;
    this.predictItemHistory = [];
    this.render();
  },

  recordPredictResponse(scenarioId, optionId) {
    this.predictResponses[scenarioId] = optionId;
    this.predictItemHistory.push({ idx: this.predictCurrentIdx, scenarioId });
    setTimeout(() => this.advancePredict(), 220);
  },

  advancePredict() {
    if (this.state !== "predict-battery") return;
    if (this.predictCurrentIdx < FUN_SCENARIOS.length - 1) {
      this.predictCurrentIdx++;
      this.render();
    } else {
      this.finalizePredict();
    }
  },

  predictGoBack() {
    if (!this.predictItemHistory.length) return;
    const last = this.predictItemHistory.pop();
    delete this.predictResponses[last.scenarioId];
    this.predictCurrentIdx = last.idx;
    this.render();
  },

  finalizePredict() {
    this.predictReport = generateFunReport(this.predictResponses, CHARACTERS);
    this.predictReport.friendName = this.predictFriendName;
    this.predictReport.type = "prediction";
    this.state = "predict-report";
    this.render();
  },

  loadPredictions() {
    try {
      const raw = localStorage.getItem(this.PREDICTIONS_KEY);
      if (!raw) { this.predictions = []; return; }
      const data = JSON.parse(raw);
      this.predictions = Array.isArray(data) ? data : [];
    } catch (_) { this.predictions = []; }
  },

  savePrediction() {
    if (!this.predictReport) return;
    this.loadPredictions();
    const entry = {
      id: "pred_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      savedAt: new Date().toISOString(),
      friendName: this.predictReport.friendName,
      topMatchId: this.predictReport.matches[0]?.id,
      topMatchName: this.predictReport.matches[0]?.inspiredBy?.primary || this.predictReport.matches[0]?.name,
      topMatchPct: this.predictReport.matches[0]?.pct,
      report: this.predictReport
    };
    this.predictions.unshift(entry);
    if (this.predictions.length > 5) this.predictions = this.predictions.slice(0, 5);
    try {
      localStorage.setItem(this.PREDICTIONS_KEY, JSON.stringify(this.predictions));
    } catch (_) {}
    // Feedback
    const btn = document.querySelector('[data-action="save-prediction"]');
    if (btn) {
      const orig = btn.dataset.origText || btn.textContent;
      btn.dataset.origText = orig;
      btn.textContent = "✓ Saved";
      setTimeout(() => { btn.textContent = orig; }, 1800);
    }
  },

  deletePrediction(id) {
    this.loadPredictions();
    this.predictions = this.predictions.filter(p => p.id !== id);
    try {
      localStorage.setItem(this.PREDICTIONS_KEY, JSON.stringify(this.predictions));
    } catch (_) {}
  },

  generatePredictShareCard() {
    if (!this.predictReport || !this.predictReport.matches?.length) return;
    const m = this.predictReport.matches[0];
    const name = m.inspiredBy?.primary || m.name;
    const film = m.inspiredBy?.film || "";
    const archetype = m.archetype || "";
    const pct = m.pct || 0;
    const friend = this.predictReport.friendName || "your friend";

    const W = 800, H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Predict card palette: green/yellow (distinct from clinical red and fun purple)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a1a14");
    grad.addColorStop(0.5, "#142820");
    grad.addColorStop(1, "#08120a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = "#7fb88f";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = "rgba(127, 184, 143, 0.40)";
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Brand
    ctx.fillStyle = "#7fb88f";
    ctx.font = 'bold 24px serif';
    ctx.textAlign = "center";
    ctx.fillText("SCREAM PROFILE", W / 2, 90);
    ctx.fillStyle = "#a89878";
    ctx.font = 'italic 16px serif';
    ctx.fillText("Predict-a-Friend — Who I Think You Are", W / 2, 118);

    this.drawMiniSkull(ctx, 80, 90, 20);
    this.drawMiniSkull(ctx, W - 80, 90, 20);

    // Friend's name banner
    ctx.fillStyle = "#a89878";
    ctx.font = 'bold 14px monospace';
    ctx.fillText("M Y  P R E D I C T I O N  F O R", W / 2, 188);
    ctx.fillStyle = "#fff";
    const friendSize = friend.length > 14 ? 44 : 56;
    ctx.font = `bold ${friendSize}px serif`;
    ctx.fillText(friend, W / 2, 240);

    // Divider
    ctx.strokeStyle = "rgba(127, 184, 143, 0.40)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 270);
    ctx.lineTo(W - 180, 270);
    ctx.stroke();

    // Predicted character
    ctx.fillStyle = "#a89878";
    ctx.font = 'bold 13px monospace';
    ctx.fillText("I  T H I N K  Y O U ' R E", W / 2, 310);
    ctx.fillStyle = "#fff";
    const nameSize = name.length > 18 ? 48 : (name.length > 12 ? 56 : 64);
    ctx.font = `bold ${nameSize}px serif`;
    this.wrapText(ctx, name, W / 2, 380, W - 100, nameSize + 10);

    ctx.fillStyle = "#b0d0b8";
    ctx.font = 'italic 22px serif';
    ctx.fillText(film, W / 2, 500);

    ctx.fillStyle = "#7fb88f";
    ctx.font = 'bold 14px monospace';
    ctx.fillText(archetype.toUpperCase(), W / 2, 540);

    // Skull
    this.drawBigSkull(ctx, W / 2, 740, 160);

    // Match
    ctx.fillStyle = "#7fb88f";
    ctx.font = 'bold 96px serif';
    ctx.fillText(`${pct}%`, W / 2, 1000);
    ctx.fillStyle = "#a89878";
    ctx.font = 'bold 12px monospace';
    ctx.fillText("P R E D I C T E D  T R A I T  M A T C H", W / 2, 1030);

    // Footer
    ctx.fillStyle = "#a89878";
    ctx.font = '13px serif';
    ctx.fillText("Take it yourself — see if I'm right", W / 2, 1090);
    ctx.fillText("seany420.github.io/Horror-diagnosis", W / 2, 1115);
    ctx.fillStyle = "#586868";
    ctx.font = 'italic 11px serif';
    ctx.fillText("35 horror scenarios · 15 trait dimensions", W / 2, 1140);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const safeFriend = friend.replace(/[^\w]/g, "-").toLowerCase();
      const filename = `scream-profile-prediction-${safeFriend}.png`;
      this.downloadOrShare(
        blob,
        filename,
        `My Scream Profile prediction for ${friend}`,
        `I predict ${friend} matches with ${name} (${pct}%). Take the assessment yourself at seany420.github.io/Horror-diagnosis and see if I'm right.`,
        '[data-action="predict-share-card"]'
      );
    }, "image/png");
  },

  reset() {
    this.state = "intro";
    this.responses = {};
    this.instrumentList = [];
    this.currentInstrumentIdx = 0;
    this.currentItemIdx = 0;
    this.unlockedConditional.clear();
    this.itemHistory = [];
    this.report = null;
    this.hasCompletedScreening = false;
    try { localStorage.removeItem(this.STORAGE_KEY); } catch(_) {}
    this.render();
  },

  exportJSON() {
    const payload = {
      version: "scream_profile_v2",
      generatedAt: new Date().toISOString(),
      responses: this.responses,
      report: this.report
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const filename = `scream-profile-${new Date().toISOString().slice(0,10)}.json`;

    // Use share/download helper for mobile compatibility
    try {
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Scream Profile Result", text: "My Scream Profile screening result (JSON)" })
          .catch(() => this._fallbackDownload(blob, filename));
        return;
      }
    } catch (_) {}
    this._fallbackDownload(blob, filename);
  },

  _fallbackDownload(blob, filename) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 5000);
    } catch (err) {
      alert("Download failed. Try a different browser or save the data manually.");
    }
  },

  importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.responses || !data.report) {
          alert("This file does not look like a Scream Profile result. Please choose a JSON file you previously exported from this app.");
          return;
        }
        this.responses = data.responses;
        this.report = data.report;
        this.hasCompletedScreening = true;
        this.saveToStorage(false);
        this.state = "report";
        this.render();
      } catch (err) {
        alert("Could not read this file. It may not be a valid JSON export.");
      }
    };
    reader.readAsText(file);
  },

  saveToStorage(showConfirm) {
    try {
      const payload = {
        version: "scream_profile_v2",
        savedAt: new Date().toISOString(),
        responses: this.responses,
        report: this.report,
        hasCompletedScreening: this.hasCompletedScreening
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
      if (showConfirm) {
        const btn = document.querySelector('[data-action="save-result"]');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = "✓ Saved";
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }
      }
    } catch (err) {
      if (showConfirm) alert("Could not save to local storage. Your browser may be blocking it (e.g. private mode).");
    }
  },

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.report && data.responses) {
          this.responses = data.responses;
          this.report = data.report;
          this.hasCompletedScreening = !!data.hasCompletedScreening;
        }
      }
    } catch(_) {}
    try {
      const funRaw = localStorage.getItem(this.FUN_STORAGE_KEY);
      if (funRaw) {
        const funData = JSON.parse(funRaw);
        if (funData.funReport && funData.funResponses) {
          this.funResponses = funData.funResponses;
          this.funReport = funData.funReport;
          this.hasCompletedFun = true;
        }
      }
    } catch(_) {}
    this.loadPredictions();
  },

  saveFunToStorage() {
    try {
      const payload = {
        version: "scream_profile_fun_v3",
        savedAt: new Date().toISOString(),
        funResponses: this.funResponses,
        funReport: this.funReport
      };
      localStorage.setItem(this.FUN_STORAGE_KEY, JSON.stringify(payload));
    } catch(_) {}
  },

  // ============== RENDERING ==============

  render() {
    const root = document.getElementById("app");
    if (!root) return;
    // Blur any focused element so :focus state doesn't bleed across renders
    if (document.activeElement && document.activeElement !== document.body) {
      try { document.activeElement.blur(); } catch (_) {}
    }
    switch (this.state) {
      case "intro": root.innerHTML = this.renderIntro(); break;
      case "browse": root.innerHTML = this.renderBrowse(); break;
      case "character-detail": root.innerHTML = this.renderCharacterDetail(); break;
      case "battery": root.innerHTML = this.renderBattery(); break;
      case "interstitial": root.innerHTML = this.renderInterstitial(); break;
      case "report": root.innerHTML = this.renderReport(); break;
      case "comparisons": root.innerHTML = this.renderComparisons(); break;
      case "fun-intro": root.innerHTML = this.renderFunIntro(); break;
      case "fun-battery": root.innerHTML = this.renderFunBattery(); break;
      case "fun-report": root.innerHTML = this.renderFunReport(); break;
      case "comparison": root.innerHTML = this.renderComparison(); break;
      case "predict-intro": root.innerHTML = this.renderPredictIntro(); break;
      case "predict-battery": root.innerHTML = this.renderPredictBattery(); break;
      case "predict-report": root.innerHTML = this.renderPredictReport(); break;
      case "predict-list": root.innerHTML = this.renderPredictList(); break;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  renderBloodSplatters() {
    // Hand-built SVG blood splatters at top corners + a few stray drops.
    // Layered behind content via CSS positioning. Subtle so the page reads
    // theatrical, not gory.
    return `
      <div class="blood-splatters" aria-hidden="true">
        <svg class="blood-splatter splatter-tl" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg">
          <g fill="#8b1a1a">
            <path d="M 10 8 Q 50 4 84 22 Q 110 32 130 28 Q 142 22 156 30 Q 168 38 168 50 Q 162 60 148 58 Q 132 58 116 50 Q 96 42 76 46 Q 56 50 38 42 Q 22 36 10 30 Z" opacity="0.78"/>
            <path d="M 22 44 Q 38 38 52 46 Q 64 54 58 64 Q 50 70 38 64 Q 26 56 22 44 Z" opacity="0.62"/>
            <ellipse cx="180" cy="42" rx="14" ry="9" opacity="0.55" transform="rotate(28 180 42)"/>
            <ellipse cx="208" cy="20" rx="6" ry="4" opacity="0.42"/>
            <circle cx="116" cy="78" r="6" opacity="0.55"/>
            <circle cx="138" cy="92" r="3.5" opacity="0.42"/>
            <circle cx="86" cy="84" r="2.5" opacity="0.35"/>
            <ellipse cx="220" cy="62" rx="3" ry="2" opacity="0.40"/>
            <path d="M 150 28 Q 152 80 148 130 Q 144 138 150 142 Q 158 138 156 124 Q 154 78 158 30 Z" opacity="0.40"/>
            <circle cx="40" cy="92" r="2" opacity="0.30"/>
          </g>
        </svg>

        <svg class="blood-splatter splatter-tr" viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg">
          <g fill="#8b1a1a">
            <path d="M 270 12 Q 234 8 200 24 Q 174 34 158 28 Q 144 22 132 30 Q 122 38 124 50 Q 132 60 146 58 Q 162 56 178 48 Q 198 40 218 44 Q 236 48 252 42 Q 264 38 270 32 Z" opacity="0.74"/>
            <ellipse cx="100" cy="38" rx="14" ry="9" opacity="0.55" transform="rotate(-32 100 38)"/>
            <circle cx="78" cy="22" r="5" opacity="0.50"/>
            <circle cx="164" cy="82" r="5" opacity="0.55"/>
            <circle cx="140" cy="96" r="3" opacity="0.40"/>
            <circle cx="192" cy="74" r="2.5" opacity="0.40"/>
            <ellipse cx="58" cy="58" rx="3" ry="2" opacity="0.40"/>
            <path d="M 130 32 Q 128 82 132 128 Q 134 138 128 142 Q 122 138 124 124 Q 126 80 124 32 Z" opacity="0.36"/>
            <circle cx="226" cy="92" r="2" opacity="0.30"/>
          </g>
        </svg>

        <svg class="blood-drip drip-1" viewBox="0 0 16 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M 8 0 Q 4 30 6 56 Q 4 70 8 80 Q 12 70 10 56 Q 12 30 8 0 Z" fill="#8b1a1a" opacity="0.55"/>
        </svg>
        <svg class="blood-drip drip-2" viewBox="0 0 14 70" xmlns="http://www.w3.org/2000/svg">
          <path d="M 7 0 Q 4 24 6 44 Q 4 56 7 62 Q 10 56 8 44 Q 10 24 7 0 Z" fill="#8b1a1a" opacity="0.48"/>
        </svg>
      </div>
    `;
  },

  renderIntro() {
    const hasSaved = !!(this.report && this.hasCompletedScreening);
    const savedAt = hasSaved ? new Date(this.report.generatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;
    return `
      <div class="intro-screen">
        ${this.renderBloodSplatters()}
        <header class="intro-header">
          <div class="brand-mark">
            <svg viewBox="0 0 60 80" class="brand-svg">
              <path d="M 30 8 C 18 8, 10 18, 10 32 C 10 48, 22 56, 22 56 L 22 64 C 22 68, 26 72, 30 72 C 34 72, 38 68, 38 64 L 38 56 C 38 56, 50 48, 50 32 C 50 18, 42 8, 30 8 Z" fill="#8b1a1a" stroke="#c4a060" stroke-width="0.6"/>
              <ellipse cx="22" cy="30" rx="3" ry="5" fill="#0a0a0a"/>
              <ellipse cx="38" cy="30" rx="3" ry="5" fill="#0a0a0a"/>
              <path d="M 22 44 L 25 50 L 30 46 L 35 50 L 38 44" fill="#0a0a0a"/>
            </svg>
          </div>
          <h1 class="brand">SCREAM <span class="brand-accent">PROFILE</span></h1>
          <p class="brand-tag">Find your horror archetype — a personality &amp; clinical profile through the lens of horror cinema</p>
        </header>

        <section class="intro-body">
          <p class="lede">A personality screener with real psychometric validity. Answer questions drawn from clinical instruments used in measurement-based care. Get matched with the horror character whose psychology most resembles your current presentation — from <em>Laurie Strode</em> to <em>Annie Wilkes</em>, <em>Hannibal Lecter</em> to <em>Cole Sear</em>. Receive a personality profile (Big Five) and a clinical-grade DSM-5-TR readout alongside your match.</p>

          ${hasSaved ? `
            <div class="saved-panel">
              <div class="saved-icon">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="saved-body">
                <div class="saved-title">You have a saved screening result from ${savedAt}</div>
                <div class="saved-detail">Top match: <strong>${this.report.matches[0]?.inspiredBy?.primary || this.report.matches[0]?.name}</strong></div>
              </div>
              <div class="saved-actions">
                <button class="cta secondary small" data-action="view-saved">View report</button>
                <button class="cta tertiary small" data-action="clear-saved">Clear</button>
              </div>
            </div>
          ` : ""}

          ${this.hasInProgressSave ? `
            <div class="resume-panel">
              <div class="resume-icon">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div class="resume-body">
                <div class="resume-title">Screening in progress</div>
                <div class="resume-detail">You paused mid-screening. Resume where you left off, or start fresh.</div>
              </div>
              <div class="resume-actions">
                <button class="cta primary small" data-action="resume">Resume</button>
                <button class="cta tertiary small" data-action="discard-progress">Discard</button>
              </div>
            </div>
          ` : ""}

          ${this.loadComparisons().length > 0 ? `
            <div class="comparisons-link">
              <button class="cta tertiary small" data-action="view-comparisons">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 12h4l3-9 4 18 3-9h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>View ${this.loadComparisons().length} saved comparison${this.loadComparisons().length === 1 ? "" : "s"}</span>
              </button>
            </div>
          ` : ""}

          <div class="features">
            <div class="feature">
              <div class="feature-num">~200</div>
              <div class="feature-label">items, adaptive</div>
              <div class="feature-detail">Branches based on your answers. Pause and resume anytime. Median completion 25–35 minutes.</div>
            </div>
            <div class="feature">
              <div class="feature-num">61</div>
              <div class="feature-label">horror characters</div>
              <div class="feature-detail">Iconic figures across the horror canon, each paired with a clinical pattern. Rich coverage of every major DSM-5-TR domain.</div>
            </div>
            <div class="feature">
              <div class="feature-num">19</div>
              <div class="feature-label">conditions screened</div>
              <div class="feature-detail">All 14 prior conditions plus eating, drug use, insomnia, schizotypal, and somatic symptom disorders.</div>
            </div>
          </div>

          <div class="instruments-list">
            <h3>Validated instruments administered</h3>
            <p>PHQ-2/9 · GAD-2/7 · PC-PTSD-5 · PCL-5 (full 20) · MSI-BPD · PID-5-BF · TIPI · Y-BOCS-SR · AUDIT-C · DAST-10 · ASRS-5 · LSAS · ISI · PHQ-15 · EAT-26 · SPQ-B · DES-B · ACE-10 · AQ-10 · MDQ · C-SSRS Screener · Functional Impact · Biopsychosocial Intake</p>
          </div>

          <div class="warnings">
            <div class="warning-item">
              <span class="warning-dot"></span>
              <div>
                <strong>This is not a diagnosis.</strong> Computer-generated diagnostic impressions cannot replace clinical interview, collateral information, longitudinal observation, or rule-out of medical etiology. Treat as educational/screening only.
              </div>
            </div>
            <div class="warning-item">
              <span class="warning-dot"></span>
              <div>
                <strong>Some items ask about suicide and self-harm.</strong> If you are in crisis, dial <strong>988</strong> (Suicide &amp; Crisis Lifeline) or text <strong>HOME</strong> to <strong>741741</strong>. The screening will flag any safety items you endorse.
              </div>
            </div>
            <div class="warning-item">
              <span class="warning-dot"></span>
              <div>
                <strong>Your responses stay on your device.</strong> Nothing is transmitted to a server. Auto-saved as you go. You can pause and resume anytime, export as JSON, and save comparisons over time.
              </div>
            </div>
          </div>

          <div class="cta-row">
            <button class="cta primary" data-action="begin">
              <span>${hasSaved ? "Take it again" : "Begin Screening"}</span>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <button class="cta primary fun-cta" data-action="begin-fun">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
              <span>${this.hasCompletedFun ? "Trait Assessment (taken)" : "Take Trait Assessment"}</span>
            </button>
            ${this.hasCompletedFun ? `
              <button class="cta primary predict-cta" data-action="predict-friend">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Predict a Friend</span>
              </button>
            ` : ""}
            <button class="cta secondary" data-action="browse">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <span>Browse the Roster</span>
            </button>
            <label class="cta tertiary" for="load-json-input" data-action="load-json-trigger" tabindex="0" role="button">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Load saved JSON</span>
            </label>
            <input type="file" id="load-json-input" accept="application/json,.json" style="display:none">
          </div>

          ${this.hasCompletedFun && this.hasCompletedScreening ? `
            <div class="comparisons-link" style="margin-top:18px">
              <button class="cta tertiary" data-action="view-comparison">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 12h8M12 8v8M3 3h18v18H3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                <span>View Clinical-vs-Trait Comparison</span>
              </button>
            </div>
          ` : ""}
          ${(this.predictions && this.predictions.length > 0) ? `
            <div class="comparisons-link" style="margin-top:10px">
              <button class="cta tertiary" data-action="view-predictions">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>View Saved Predictions (${this.predictions.length})</span>
              </button>
            </div>
          ` : ""}
        </section>

        <footer class="intro-footer">
          <p>Built for clinical education and self-reflection. <span class="footer-version">v3.2</span></p>
        </footer>
      </div>
    `;
  },

  renderBrowse() {
    const completedNote = this.hasCompletedScreening
      ? ""
      : `<div class="browse-note">DSM-5-TR clinical associations are hidden until you complete a screening. Browse the roster freely; the full clinical mapping unlocks after your assessment.</div>`;
    // Filter options
    const filters = [
      { id: "all", label: "All" },
      { id: "trauma", label: "Trauma & Survival" },
      { id: "mood", label: "Mood & Grief" },
      { id: "anxiety", label: "Anxiety & OCD" },
      { id: "personality", label: "Personality" },
      { id: "psychosis", label: "Dissociation & Psychosis" },
      { id: "substance", label: "Substance" },
      { id: "neuro", label: "Neurodivergent" },
      { id: "existential", label: "Existential & Identity" }
    ];
    const filterMap = {
      trauma: ["trauma", "vigilance", "ace", "child", "captivity"],
      mood: ["depression", "grief", "suicide", "post_crisis", "anhedonia", "rage", "betrayal", "anger"],
      anxiety: ["anxiety", "ocd", "ritual", "social_anxiety", "perinatal", "magical_thinking"],
      personality: ["bpd", "splitting", "antisocial", "predatory", "manipulative", "mimicry", "abandonment"],
      psychosis: ["dissociation", "psychosis", "identity", "isolation", "decompensation"],
      substance: ["substance", "alcohol", "craving"],
      neuro: ["adhd", "autism", "neurodivergent", "executive"],
      existential: ["existential", "nihilism", "meaning", "imposter", "self_betrayal", "values", "uncanny", "stuckness", "pattern", "masking"]
    };
    const matchesFilter = (ch) => {
      if (this.browseFilter === "all") return true;
      const tags = ch.traitTags || [];
      const wanted = filterMap[this.browseFilter] || [];
      return tags.some(t => wanted.includes(t));
    };
    const filtered = CHARACTERS.filter(matchesFilter);

    return `
      <div class="browse-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro" aria-label="Back to intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title">The Roster</h2>
          <p class="subpage-sub">Thirty-eight horror-cinema characters and the clinical patterns they exemplify.</p>
        </header>

        ${completedNote}

        <div class="browse-filters">
          ${filters.map(f => `
            <button class="filter-chip ${this.browseFilter === f.id ? "active" : ""}" data-action="filter-browse" data-filter="${f.id}">${f.label}</button>
          `).join("")}
        </div>

        <div class="browse-grid">
          ${filtered.map(ch => `
            <button class="roster-card" data-action="character-detail" data-character-id="${ch.id}">
              <div class="roster-portrait">${generatePortrait(ch)}</div>
              <div class="roster-info">
                <div class="roster-name">${ch.inspiredBy?.primary || ch.name}</div>
                ${ch.inspiredBy?.film ? `<div class="roster-film">${ch.inspiredBy.film}</div>` : ""}
                <div class="roster-archetype">${ch.archetype}</div>
                ${this.hasCompletedScreening ? this.renderClinicalAssociation(ch) : ""}
              </div>
            </button>
          `).join("")}
        </div>

        <div class="browse-footer">
          <p>${filtered.length} of ${CHARACTERS.length} characters shown.</p>
        </div>
      </div>
    `;
  },

  renderClinicalAssociation(ch) {
    if (!ch.weights) return "";
    const ranked = Object.entries(ch.weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([k]) => this.disorderShortLabel(k));
    return `<div class="roster-clinical">${ranked.join(" · ")}</div>`;
  },

  disorderShortLabel(key) {
    const map = {
      mdd: "Depression", gad: "Anxiety", ptsd: "PTSD", ocd: "OCD",
      social_anx: "Social anxiety", bpd: "BPD", bipolar: "Bipolar",
      aud: "Alcohol use", adhd: "ADHD", autism: "Autism",
      dissociation: "Dissociation", antisocial: "Antisocial",
      antagonism: "Antagonism", disinhibition: "Disinhibition", psychoticism: "Psychoticism",
      ace: "Childhood adversity", fnc: "Functional impact"
    };
    return map[key] || key;
  },

  renderCharacterDetail() {
    const ch = CHARACTERS.find(c => c.id === this.detailCharacterId);
    if (!ch) {
      this.state = "browse";
      return this.renderBrowse();
    }
    return `
      <div class="character-detail-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-browse" aria-label="Back to roster">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back to roster
          </button>
        </header>

        <article class="char-detail">
          <div class="char-detail-portrait">${generatePortrait(ch)}</div>
          <div class="char-detail-body">
            <h2 class="char-detail-name">${ch.inspiredBy?.primary || ch.name}</h2>
            ${ch.inspiredBy?.film ? `<p class="char-detail-film">${ch.inspiredBy.film}</p>` : ""}
            <p class="char-detail-archetype">The ${ch.name.replace(/^The\s+/, "")} — ${ch.archetype}</p>

            ${ch.inspiredBy?.others?.length ? `
              <div class="char-detail-section">
                <div class="char-section-label">Also exemplified by</div>
                <p>${ch.inspiredBy.others.join(" · ")}</p>
              </div>
            ` : ""}

            <div class="char-detail-section">
              <div class="char-section-label">Profile</div>
              <p>${ch.profile}</p>
            </div>

            <div class="char-detail-section">
              <div class="char-section-label">Clinical metaphor</div>
              <p>${ch.metaphor}</p>
            </div>

            <div class="char-detail-section">
              <div class="char-section-label">Therapeutic relevance</div>
              <p>${ch.therapeuticUse}</p>
            </div>

            ${this.hasCompletedScreening ? `
              <div class="char-detail-section clinical-unlocked">
                <div class="char-section-label">DSM-5-TR association</div>
                <p>${this.renderClinicalAssociationFull(ch)}</p>
              </div>
            ` : `
              <div class="char-detail-section clinical-locked">
                <div class="char-section-label">DSM-5-TR association</div>
                <p class="locked-note">🔒 Hidden until you complete the screening. Browse the roster first to inform your sense of the clinical territory; take the screening when you're ready to see how this character maps to specific DSM-5-TR conditions.</p>
              </div>
            `}
          </div>
        </article>
      </div>
    `;
  },

  renderClinicalAssociationFull(ch) {
    if (!ch.weights) return "—";
    const ranked = Object.entries(ch.weights).sort((a, b) => b[1] - a[1]);
    return ranked.map(([k, v]) => `<strong>${this.disorderShortLabel(k)}</strong> <span class="weight-pill">weight ${v.toFixed(1)}</span>`).join(" · ");
  },

  renderBattery() {
    const inst = this.instrumentList[this.currentInstrumentIdx];
    const item = inst.items[this.currentItemIdx];
    const elapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    const totalAnswered = Object.keys(this.responses).length;
    const totalEstimate = this.estimateTotalItems();
    const itemsRemaining = Math.max(0, totalEstimate - totalAnswered);
    const progressPct = Math.min(100, (totalAnswered / totalEstimate) * 100);
    // Time remaining: ~7 seconds per item average
    const minRemaining = Math.max(1, Math.round(itemsRemaining * 7 / 60));

    // Resolve scale: instrument-level or item-level
    let scale = inst.scale;
    if (typeof scale === "string") scale = RESPONSE_SCALES[scale];
    if (item.scale) scale = item.scale;
    if (typeof scale === "string") scale = RESPONSE_SCALES[scale];

    const currentValue = this.responses[item.id];
    const safetyClass = item.safetyFlag ? "safety-item" : "";

    // Section/instrument display name with item count within instrument
    const sectionName = inst.name || inst.title || inst.id;
    const itemInInst = this.currentItemIdx + 1;
    const totalInInst = inst.items.length;

    // Animation key — changes per item to retrigger fade-in
    const animKey = `${this.currentInstrumentIdx}_${this.currentItemIdx}`;

    return `
      <div class="battery-screen">
        <header class="battery-header">
          <div class="prog-track">
            <div class="prog-fill" style="width:${progressPct}%"></div>
          </div>
          <div class="prog-meta">
            <span class="prog-instrument">
              <span class="prog-section">${sectionName}</span>
              <span class="prog-section-counter">item ${itemInInst} of ${totalInInst}</span>
            </span>
            <span class="prog-counter">
              <span class="prog-overall">${totalAnswered} / ~${totalEstimate}</span>
              <span class="prog-time">~${minRemaining} min left</span>
            </span>
          </div>
        </header>

        <section class="item-body" data-anim="${animKey}">
          <div class="item-prompt">${inst.preface || inst.prompt || ""}</div>
          <h2 class="item-text ${safetyClass}">${item.text}</h2>
          ${item.safetyFlag ? '<div class="safety-note">If you are in immediate distress, dial <strong>988</strong> or text <strong>HOME to 741741</strong>.</div>' : ""}

          <div class="response-options">
            ${scale.map((opt, i) => `
              <label class="response-opt ${currentValue === opt.v ? "selected" : ""}">
                <input type="radio" name="resp_${item.id}" value="${opt.v}" data-item="${item.id}" ${currentValue === opt.v ? "checked" : ""}/>
                <span class="opt-marker"><span class="opt-number">${i+1}</span></span>
                <span class="opt-label">${opt.label}</span>
              </label>
            `).join("")}
          </div>
        </section>

        <footer class="battery-footer">
          <button class="ghost" data-action="back" ${!this.itemHistory.length ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 12 H5 M11 6 L5 12 L11 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Back</span>
          </button>
          <span class="elapsed">${this.formatElapsed(elapsed)} elapsed</span>
          <button class="ghost" data-action="pause-exit">
            <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>
            <span>Pause</span>
          </button>
        </footer>

        <div class="kbd-hints">
          <span><kbd>1</kbd>–<kbd>${scale.length}</kbd> answer</span>
          <span><kbd>←</kbd> back</span>
          <span><kbd>Esc</kbd> pause</span>
        </div>
      </div>
    `;
  },

  renderInterstitial() {
    // Show after specific instruments — horror-themed encouragement.
    // Pick the message based on what was just completed.
    const justFinishedId = this.instrumentList[this.currentInstrumentIdx - 1]?.id;
    const messages = {
      BPS_INTAKE: {
        title: "The context is set",
        body: "Now the work. The frame around the picture matters as much as the picture itself.",
        flavor: "— from a quiet film about ordinary haunting"
      },
      PHQ2: {
        title: "The cold has been named",
        body: "Sometimes the heaviest part is admitting it's there. Onward.",
        flavor: "— Wendy Torrance, before the corridors"
      },
      GAD2: {
        title: "The floor holds, for now",
        body: "Anxiety is the body warning you about a future it cannot yet see. Keep going.",
        flavor: "— Annie Graham, looking at a map of her family"
      },
      PC_PTSD: {
        title: "Bearing witness to what happened",
        body: "What you survived has a shape. You are giving that shape language. That's its own kind of survival.",
        flavor: "— Laurie Strode, decades after Haddonfield"
      },
      MSI_BPD: {
        title: "The storms are mapped",
        body: "What feels like instability often turns out to be sensitivity. The map and the territory aren't the same.",
        flavor: "— Pearl, looking at what she's done"
      },
      PCL5_FULL: {
        title: "The wound has been described in detail",
        body: "Not retraumatized — described. There is a difference. You can rest a moment before continuing.",
        flavor: "— Sidney Prescott, sometime around the third movie"
      },
      EAT_26: {
        title: "The body has been spoken to",
        body: "What we do with food is one of the oldest languages we have. You've described yours honestly.",
        flavor: "— Suzy Bannion, at the studio mirror"
      },
      SPQ_B: {
        title: "The unusual has been named",
        body: "Strange does not mean broken. Most of the great seers in horror — and in life — felt different long before they understood why.",
        flavor: "— Annie Graham again, drawing dollhouses"
      },
      TIPI: {
        title: "The architecture is mapped",
        body: "Personality is not destiny. It's the room you start in. What you do inside it is up to you.",
        flavor: "— Clarice Starling, before her first interview with Lecter"
      }
    };
    const msg = messages[justFinishedId] || {
      title: "A quiet moment before the next room",
      body: "Pause if you need to. The screening will be here. So will you.",
      flavor: "— from the borderlands of every horror film"
    };

    // Total progress
    const totalAnswered = Object.keys(this.responses).length;
    const totalEstimate = this.estimateTotalItems();
    const remaining = Math.max(0, totalEstimate - totalAnswered);
    const minRemaining = Math.max(1, Math.round(remaining * 7 / 60));

    return `
      <div class="interstitial-screen">
        <div class="interstitial-card">
          <div class="interstitial-skull">
            <svg viewBox="0 0 60 80" width="64" height="84">
              <path d="M 30 8 C 18 8, 10 18, 10 32 C 10 48, 22 56, 22 56 L 22 64 C 22 68, 26 72, 30 72 C 34 72, 38 68, 38 64 L 38 56 C 38 56, 50 48, 50 32 C 50 18, 42 8, 30 8 Z" fill="#8b1a1a" stroke="#c4a060" stroke-width="0.6"/>
              <ellipse cx="22" cy="30" rx="3" ry="5" fill="#0a0a0a"/>
              <ellipse cx="38" cy="30" rx="3" ry="5" fill="#0a0a0a"/>
              <path d="M 22 44 L 25 50 L 30 46 L 35 50 L 38 44" fill="#0a0a0a"/>
            </svg>
          </div>
          <h2 class="interstitial-title">${msg.title}</h2>
          <p class="interstitial-body">${msg.body}</p>
          <p class="interstitial-flavor">${msg.flavor}</p>
          <div class="interstitial-progress">
            <span>${totalAnswered} of ~${totalEstimate} items · ~${minRemaining} min remaining</span>
          </div>
          <button class="cta primary" data-action="dismiss-interstitial">
            <span>Continue</span>
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="cta tertiary small" data-action="pause-exit">Pause and exit</button>
        </div>
      </div>
    `;
  },

  renderComparisons() {
    const list = this.loadComparisons();
    return `
      <div class="comparisons-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro" aria-label="Back to intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title">Saved Comparisons</h2>
          <p class="subpage-sub">Your screening results over time. Real measurement-based care: how things shift between assessments tells you something useful.</p>
        </header>

        ${list.length === 0 ? `
          <div class="empty-comparisons">
            <p>No saved comparisons yet. After completing a screening, click <strong>Save to Comparisons</strong> on the report to add it here.</p>
          </div>
        ` : `
          <div class="comparison-list">
            ${list.map((c, i) => {
              const date = new Date(c.savedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
              const time = new Date(c.savedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
              const bf = c.bigFive || {};
              return `
                <article class="comparison-card">
                  <div class="comparison-header">
                    <div class="comparison-num">No. ${list.length - i}</div>
                    <div class="comparison-date">${date}<br><span class="comparison-time">${time}</span></div>
                    <button class="ghost small" data-action="delete-comparison" data-comparison-id="${c.id}">
                      <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                  <div class="comparison-body">
                    <div class="comparison-match">
                      <div class="comp-match-label">Top match</div>
                      <div class="comp-match-name">${c.topMatch || "—"}</div>
                      <div class="comp-match-pct">${c.topPct || 0}%</div>
                    </div>
                    <div class="comparison-stats">
                      <div class="comp-stat">
                        <span class="comp-stat-label">Probable Dx</span>
                        <span class="comp-stat-value">${c.probableDxCount || 0}</span>
                      </div>
                      <div class="comp-stat">
                        <span class="comp-stat-label">Functional</span>
                        <span class="comp-stat-value">${c.functional != null ? c.functional + "%" : "—"}</span>
                      </div>
                      ${bf.neuroticism != null ? `
                        <div class="comp-stat">
                          <span class="comp-stat-label">Neuroticism</span>
                          <span class="comp-stat-value">${bf.neuroticism.toFixed(1)}</span>
                        </div>
                      ` : ""}
                      ${bf.extraversion != null ? `
                        <div class="comp-stat">
                          <span class="comp-stat-label">Extraversion</span>
                          <span class="comp-stat-value">${bf.extraversion.toFixed(1)}</span>
                        </div>
                      ` : ""}
                    </div>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        `}
      </div>
    `;
  },

  formatElapsed(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2,"0")}`;
  },

  estimateTotalItems() {
    // Best estimate: count items in current instrumentList
    return this.instrumentList.reduce((a, inst) => a + inst.items.length, 0);
  },

  // ============== FUN ASSESSMENT RENDERS ==============

  renderFunIntro() {
    const hasFun = !!(this.funReport && this.hasCompletedFun);
    const funSavedAt = hasFun ? new Date(this.funReport.generatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;
    return `
      <div class="fun-intro-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro" aria-label="Back to intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title fun-title">The Trait Assessment</h2>
          <p class="subpage-sub">A different kind of mirror. Thirty-five horror scenarios. Find out which character your <em>character</em> resembles.</p>
        </header>

        <section class="fun-intro-body">
          <p class="lede">The clinical assessment screens what you might be going through. <strong>This one screens who you are.</strong> Same horror roster, completely different math: your answers across thirty-five horror-cinema scenarios produce a fifteen-axis trait profile that gets matched to the character whose disposition is closest to yours.</p>

          ${hasFun ? `
            <div class="saved-panel fun-saved-panel">
              <div class="saved-icon fun-saved-icon">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
              </div>
              <div class="saved-body">
                <div class="saved-title">You have a saved trait result from ${funSavedAt}</div>
                <div class="saved-detail">Top match: <strong>${this.funReport.matches[0]?.inspiredBy?.primary || this.funReport.matches[0]?.name}</strong></div>
              </div>
              <div class="saved-actions">
                <button class="cta secondary small" data-action="view-fun-report">View result</button>
                <button class="cta tertiary small" data-action="clear-fun">Clear</button>
              </div>
            </div>
          ` : ""}

          <div class="features fun-features">
            <div class="feature">
              <div class="feature-num">35</div>
              <div class="feature-label">horror scenarios</div>
              <div class="feature-detail">Drawn from canonical films — Babadook, Shining, Hereditary, Get Out, Carrie. Pick what you'd actually do.</div>
            </div>
            <div class="feature">
              <div class="feature-num">15</div>
              <div class="feature-label">trait dimensions</div>
              <div class="feature-detail">Vigilance ↔ Trust. Solitary ↔ Communal. Order ↔ Chaos. The bipolar axes that define horror cinema's psychology.</div>
            </div>
            <div class="feature">
              <div class="feature-num">~10</div>
              <div class="feature-label">minutes</div>
              <div class="feature-detail">Pure scenario items, no Likert scales. Faster than the clinical battery and not trying to diagnose anything.</div>
            </div>
          </div>

          <div class="fun-features-list">
            <h3>What this assessment measures</h3>
            <p>Behavioral disposition (vigilance, solitary, restraint, order, curiosity) · Relational style (compassion, loyalty, trusting, caregiving, forthright) · Inner architecture (stability, uncanny attunement, self-blame, hope, embodiment). All non-pathological — these are character traits, not symptoms.</p>
          </div>

          <div class="warnings fun-warnings">
            <div class="warning-item">
              <span class="warning-dot"></span>
              <div>
                <strong>This is for fun.</strong> No DSM, no clinical impressions, no diagnostic intent. The trait profile is a personality reading dressed up in horror.
              </div>
            </div>
            ${this.hasCompletedScreening ? `
              <div class="warning-item">
                <span class="warning-dot fun-dot"></span>
                <div>
                  <strong>You've already completed the clinical screening.</strong> After this assessment, you'll be able to compare the two — who you are (this) vs. what you're currently going through (that). The gap between them is often the most useful part.
                </div>
              </div>
            ` : `
              <div class="warning-item">
                <span class="warning-dot fun-dot"></span>
                <div>
                  Take this on its own, or pair it with the clinical screening for a side-by-side comparison view.
                </div>
              </div>
            `}
          </div>

          <div class="cta-row">
            <button class="cta primary fun-primary" data-action="begin-fun">
              <span>${hasFun ? "Take it again" : "Begin Trait Assessment"}</span>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </section>
      </div>
    `;
  },

  renderFunBattery() {
    const scenario = FUN_SCENARIOS[this.funCurrentIdx];
    if (!scenario) {
      // Should not happen — defensive
      return `<div class="fun-battery-screen"><p>Loading…</p></div>`;
    }
    const total = FUN_SCENARIOS.length;
    const num = this.funCurrentIdx + 1;
    const pct = (num / total) * 100;

    return `
      <div class="fun-battery-screen">
        <header class="fun-battery-header">
          <div class="prog-track fun-prog-track">
            <div class="prog-fill fun-prog-fill" style="width:${pct}%"></div>
          </div>
          <div class="prog-meta">
            <span class="prog-instrument">
              <span class="prog-section fun-prog-section">${scenario.film}</span>
              <span class="prog-section-counter">scenario ${num} of ${total}</span>
            </span>
            <span class="prog-counter">
              <span class="prog-overall">${num} / ${total}</span>
            </span>
          </div>
        </header>

        <section class="fun-scenario" data-anim="fun_${num}">
          <div class="fun-scenario-setup">${scenario.setup}</div>
          <div class="fun-scenario-prompt">${scenario.prompt}</div>

          <div class="fun-options">
            ${scenario.options.map((opt, i) => `
              <button class="fun-option" data-fun-option="${opt.id}" data-fun-scenario="${scenario.id}">
                <span class="fun-option-num">${i+1}</span>
                <span class="fun-option-text">${opt.label}</span>
              </button>
            `).join("")}
          </div>
        </section>

        <footer class="battery-footer">
          <button class="ghost" data-action="fun-back" ${!this.funItemHistory.length ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 12 H5 M11 6 L5 12 L11 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Back</span>
          </button>
          <span class="elapsed fun-tagline">A different kind of mirror</span>
          <button class="ghost" data-action="back-to-intro">
            <span>Exit</span>
          </button>
        </footer>

        <div class="kbd-hints">
          <span><kbd>1</kbd>–<kbd>${scenario.options.length}</kbd> answer</span>
          <span><kbd>←</kbd> back</span>
        </div>
      </div>
    `;
  },

  renderFunReport() {
    if (!this.funReport) return `<div><p>No trait result yet.</p></div>`;
    const r = this.funReport;
    const top3 = r.matches.slice(0, 3);
    const traits = r.userTraits.normalized;

    return `
      <div class="fun-report-screen">
        <header class="report-header">
          <div class="report-titlebar">
            <h1 class="report-title fun-title">Your Trait Profile</h1>
            <p class="report-sub">A character match based on who you are, not what you're going through. ${FUN_SCENARIOS.length} scenarios, ${TRAIT_AXES.length} trait dimensions, no DSM in sight.</p>
          </div>
          <div class="report-actions">
            ${this.hasCompletedScreening ? `<button class="ghost" data-action="view-comparison">Compare with clinical</button>` : ""}
            <button class="ghost" data-action="retake-fun">Retake</button>
            <button class="ghost" data-action="back-to-intro">Done</button>
          </div>
        </header>

        ${this.renderFunTopMatches(top3)}
        ${this.renderTraitProfile(traits)}

        ${!this.hasCompletedScreening ? `
          <section class="fun-cta-section">
            <h2 class="section-h">Want a deeper read?</h2>
            <p class="section-sub">The clinical assessment screens 19 DSM-5-TR conditions across 23 validated instruments. Pair it with this trait profile and you'll get a comparison view that explains the gap — what you're carrying vs. who you are.</p>
            <button class="cta primary" data-action="begin">Take the Clinical Screening</button>
          </section>
        ` : `
          <section class="fun-cta-section">
            <h2 class="section-h">Compare with your clinical result</h2>
            <p class="section-sub">You've completed both assessments. View them side by side to see where they converge and diverge — the gap between trait and clinical is often the most useful part.</p>
            <button class="cta primary" data-action="view-comparison">View Comparison</button>
          </section>
        `}
      </div>
    `;
  },

  renderFunTopMatches(matches) {
    return `
      <section class="matches-section fun-matches-section">
        <h2 class="section-h">Your Trait Match</h2>
        <p class="section-sub">Top three characters whose <em>trait disposition</em> most closely resembles yours. Match percentage = trait similarity in 15-axis space.</p>
        <div class="matches-grid">
          ${matches.map((m, i) => {
            const ch = CHARACTERS.find(c => c.id === m.id);
            return `
              <article class="match-card fun-match-card rank-${i+1}">
                <div class="match-portrait">${generatePortrait(ch)}</div>
                <div class="match-rank">No. ${i+1}</div>
                <div class="match-confidence fun-match-confidence">
                  <div class="conf-pct">${m.pct}<span class="pct-sym">%</span></div>
                  <div class="conf-label">trait match</div>
                </div>
                <h3 class="match-name">${m.inspiredBy?.primary || m.name}</h3>
                ${m.inspiredBy?.film ? `<p class="match-film">${m.inspiredBy.film}</p>` : ""}
                <p class="match-subtitle">The ${m.name.replace(/^The\s+/, "")} — <span class="match-arch-inline">${m.archetype}</span></p>
                <p class="match-profile">${m.profile}</p>
                <div class="match-section">
                  <div class="match-section-label">What this match suggests about you</div>
                  <p>${this.describeFunMatch(m)}</p>
                </div>
              </article>
            `;
          }).join("")}
        </div>

        <div class="match-actions">
          <button class="cta secondary" data-action="fun-share-card">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V3m0 0L7 8m5-5l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Share Card (PNG)</span>
          </button>
          ${this.hasCompletedScreening ? `
            <button class="cta secondary" data-action="view-comparison">
              <span>Compare with Clinical</span>
            </button>
          ` : ""}
          <button class="cta tertiary small" data-action="retake-fun">
            <span>Retake</span>
          </button>
        </div>
      </section>
    `;
  },

  describeFunMatch(match) {
    // Identify the 3 axes where user is most similar to this character
    const userTraits = this.funReport?.userTraits?.normalized || {};
    const charTraits = match.traits || {};
    const closeAxes = [];
    TRAIT_AXES.forEach(a => {
      const userVal = userTraits[a.id] ?? 0;
      const charVal = charTraits[a.id] ?? 0;
      const diff = Math.abs(userVal - charVal);
      // Both poles strongly leaning same direction
      if (Math.abs(userVal) > 30 && Math.abs(charVal) > 30 && Math.sign(userVal) === Math.sign(charVal)) {
        closeAxes.push({ axis: a, diff, userVal, charVal });
      }
    });
    closeAxes.sort((a, b) => a.diff - b.diff);
    const top3 = closeAxes.slice(0, 3);
    if (top3.length === 0) {
      return `Your overall trait profile resembles this character in subtle ways across multiple dimensions, without any single axis dominating.`;
    }
    const phrases = top3.map(({axis, userVal, charVal}) => {
      const pole = userVal > 0 ? axis.poleHigh : axis.poleLow;
      const desc = userVal > 0 ? axis.descHigh : axis.descLow;
      return `<strong>${pole}</strong> — ${desc.toLowerCase()}`;
    });
    return `Strongest shared traits: ${phrases.join("; ")}.`;
  },

  renderTraitProfile(traits) {
    // Group by family and render bars for each axis
    const families = {};
    TRAIT_AXES.forEach(a => {
      if (!families[a.family]) families[a.family] = [];
      families[a.family].push(a);
    });

    return `
      <section class="trait-profile-section">
        <h2 class="section-h">Your 15-Axis Trait Profile</h2>
        <p class="section-sub">Each axis is bipolar. The marker shows where your responses placed you between the two poles. None of these are "good" or "bad" — every horror character draws from a unique combination.</p>

        ${Object.entries(families).map(([famName, axes]) => `
          <div class="trait-family">
            <h3 class="trait-family-h">${famName}</h3>
            <div class="trait-axes">
              ${axes.map(a => {
                const val = traits[a.id] ?? 0;
                // val is -100 to +100, position % is (val + 100) / 2
                const pos = ((val + 100) / 2);
                return `
                  <div class="trait-axis">
                    <div class="trait-axis-poles">
                      <span class="trait-pole trait-pole-low">${a.poleLow}</span>
                      <span class="trait-pole-value">${val > 0 ? "+" : ""}${val}</span>
                      <span class="trait-pole trait-pole-high">${a.poleHigh}</span>
                    </div>
                    <div class="trait-axis-bar">
                      <div class="trait-axis-track"></div>
                      <div class="trait-axis-mid"></div>
                      <div class="trait-axis-marker" style="left: ${pos}%"></div>
                    </div>
                    <div class="trait-axis-desc">
                      ${val > 30 ? a.descHigh : (val < -30 ? a.descLow : "Balanced — your responses didn't push strongly toward either pole on this axis.")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </section>
    `;
  },

  renderComparison() {
    if (!this.report || !this.funReport) {
      return `
        <div class="comparison-screen">
          <header class="subpage-header">
            <button class="back-btn" data-action="back-to-intro">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Back
            </button>
            <h2 class="subpage-title">Comparison</h2>
          </header>
          <div class="empty-comparisons">
            <p>You need both a clinical screening result and a trait result to view the comparison.</p>
            ${!this.report ? `<button class="cta primary" data-action="begin">Take the Clinical Screening</button>` : ""}
            ${!this.funReport ? `<button class="cta primary" data-action="begin-fun">Take the Trait Assessment</button>` : ""}
          </div>
        </div>
      `;
    }

    const comparison = compareReports(this.report, this.funReport);

    return `
      <div class="comparison-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title">Clinical vs. Trait Comparison</h2>
          <p class="subpage-sub">Two assessments, two methodologies, one person. Where they agree and where they diverge tells different parts of the story.</p>
        </header>

        ${comparison.convergence.length > 0 ? `
          <section class="convergence-section">
            <h3 class="block-h">⚡ Convergent Matches</h3>
            <p class="section-sub">Characters that appeared in BOTH top-3 lists. When two different assessments surface the same archetype, the signal is strong.</p>
            <div class="convergence-list">
              ${comparison.convergence.map(c => {
                const ch = CHARACTERS.find(x => x.id === c.id);
                return `
                  <div class="convergence-card">
                    <div class="convergence-portrait">${generatePortrait(ch)}</div>
                    <div class="convergence-body">
                      <div class="convergence-name">${c.primary}</div>
                      <div class="convergence-ranks">
                        <span class="conv-rank">Clinical #${c.clinicalRank}</span>
                        <span class="conv-rank fun">Trait #${c.funRank}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </section>
        ` : ""}

        <section class="side-by-side-section">
          <div class="comparison-columns">
            <div class="comparison-col clinical-col">
              <h3 class="comparison-col-h">Clinical Screening</h3>
              <p class="comparison-col-sub">What you may be going through</p>
              <div class="comparison-list-mini">
                ${comparison.clinical.topThree.map((m, i) => {
                  const ch = CHARACTERS.find(c => c.id === m.id);
                  const isConvergent = comparison.convergence.some(c => c.id === m.id);
                  return `
                    <div class="comparison-row ${isConvergent ? "convergent" : ""}">
                      <span class="comparison-rank">#${i+1}</span>
                      <div class="comparison-portrait-mini">${generatePortrait(ch)}</div>
                      <div class="comparison-row-body">
                        <div class="comparison-row-name">${m.inspiredBy?.primary || m.name}</div>
                        <div class="comparison-row-pct">${m.pct}%</div>
                      </div>
                      ${isConvergent ? `<span class="convergent-badge">⚡</span>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
              <div class="comparison-meta">
                <span>${comparison.clinical.probableDxCount} probable Dx</span>
              </div>
            </div>

            <div class="comparison-col fun-col">
              <h3 class="comparison-col-h">Trait Assessment</h3>
              <p class="comparison-col-sub">Who you are</p>
              <div class="comparison-list-mini">
                ${comparison.fun.topThree.map((m, i) => {
                  const ch = CHARACTERS.find(c => c.id === m.id);
                  const isConvergent = comparison.convergence.some(c => c.id === m.id);
                  return `
                    <div class="comparison-row ${isConvergent ? "convergent" : ""}">
                      <span class="comparison-rank">#${i+1}</span>
                      <div class="comparison-portrait-mini">${generatePortrait(ch)}</div>
                      <div class="comparison-row-body">
                        <div class="comparison-row-name">${m.inspiredBy?.primary || m.name}</div>
                        <div class="comparison-row-pct">${m.pct}%</div>
                      </div>
                      ${isConvergent ? `<span class="convergent-badge">⚡</span>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
              <div class="comparison-meta">
                <span>15-axis trait profile</span>
              </div>
            </div>
          </div>
        </section>

        <section class="narrative-section">
          <h3 class="block-h">What the gap means</h3>
          <div class="narrative-body">
            ${comparison.narrative.split("\n\n").map(p => `<p>${p}</p>`).join("")}
          </div>
        </section>

        ${this.renderRadarChart(comparison)}

        <div class="comparison-actions">
          <button class="cta secondary" data-action="view-fun-report">View Trait Report</button>
          <button class="cta secondary" data-action="back-to-intro">View Clinical Report</button>
        </div>
      </div>
    `;
  },

  renderRadarChart(comparison) {
    // Render an SVG radar chart overlaying user's trait profile + Big Five (if available)
    const traits = comparison.fun.userTraits;
    const bigFive = comparison.clinical.bigFive;
    if (!traits) return "";

    const axes = TRAIT_AXES;
    const cx = 250, cy = 250, R = 180;
    const n = axes.length;

    // Compute polygon points for trait profile
    const traitPts = axes.map((a, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const val = traits[a.id] ?? 0;
      // Map -100..+100 to 0..1 radius
      const r = R * ((val + 100) / 200);
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    const traitPath = traitPts.map(p => `${p[0]},${p[1]}`).join(" ");

    // Map Big Five to overlay where possible (extraversion → solitary inverted, neuroticism → stability inverted, etc.)
    let bigFivePath = "";
    if (bigFive && bigFive.administered) {
      // BF range 1-7. Convert to -100..+100.
      const bfTo = (v) => v == null ? 0 : Math.round(((v - 4) / 3) * 100);
      const bfMap = {
        solitary: -bfTo(bigFive.extraversion), // extraversion is opposite of solitary
        compassion: bfTo(bigFive.agreeableness),
        order: bfTo(bigFive.conscientiousness),
        stability: -bfTo(bigFive.neuroticism), // neuroticism is opposite of stability
        curiosity: bfTo(bigFive.openness),
        uncanny: bfTo(bigFive.openness) // also maps loosely
      };
      const bfPts = axes.map((a, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const val = bfMap[a.id] ?? 0;
        const r = R * ((val + 100) / 200);
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
      });
      bigFivePath = bfPts.map(p => `${p[0]},${p[1]}`).join(" ");
    }

    // Grid rings
    const rings = [0.25, 0.5, 0.75, 1.0].map(f => {
      const points = axes.map((_, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return [cx + R * f * Math.cos(angle), cy + R * f * Math.sin(angle)];
      });
      return `<polygon points="${points.map(p => p.join(",")).join(" ")}" fill="none" stroke="rgba(196,160,96,0.10)" stroke-width="0.5"/>`;
    }).join("");

    // Axis lines
    const axisLines = axes.map((a, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(196,160,96,0.10)" stroke-width="0.5"/>`;
    }).join("");

    // Labels
    const labels = axes.map((a, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const lr = R + 24;
      const x = cx + lr * Math.cos(angle);
      const y = cy + lr * Math.sin(angle);
      let anchor = "middle";
      if (Math.cos(angle) > 0.3) anchor = "start";
      else if (Math.cos(angle) < -0.3) anchor = "end";
      const val = traits[a.id] ?? 0;
      const label = val > 30 ? a.poleHigh : (val < -30 ? a.poleLow : a.id);
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="9.5" font-family="monospace" fill="#b8a888" letter-spacing="0.05em">${label.toUpperCase()}</text>`;
    }).join("");

    return `
      <section class="radar-section">
        <h3 class="block-h">Trait Profile Map</h3>
        <p class="section-sub">Your trait profile from the fun assessment (gold) ${bigFivePath ? "overlaid with your Big Five from the clinical screening (red)" : "across all 15 axes"}. The further from center, the stronger that trait.</p>
        <div class="radar-wrap">
          <svg viewBox="0 0 500 500" class="radar-chart">
            ${rings}
            ${axisLines}
            ${labels}
            ${bigFivePath ? `<polygon points="${bigFivePath}" fill="rgba(160, 32, 32, 0.18)" stroke="#8b1a1a" stroke-width="1.2" opacity="0.85"/>` : ""}
            <polygon points="${traitPath}" fill="rgba(245, 213, 71, 0.20)" stroke="#f5d547" stroke-width="1.6"/>
          </svg>
        </div>
        <div class="radar-legend">
          <div class="radar-legend-item"><span class="radar-swatch trait"></span>Trait Assessment (15 axes)</div>
          ${bigFivePath ? `<div class="radar-legend-item"><span class="radar-swatch clinical"></span>Big Five (from clinical TIPI)</div>` : ""}
        </div>
      </section>
    `;
  },

  // ============== PREDICT-A-FRIEND RENDERS ==============

  renderPredictIntro() {
    return `
      <div class="predict-intro-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro" aria-label="Back to intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title predict-title">Predict a Friend</h2>
          <p class="subpage-sub">Take the trait assessment <em>as someone you know</em>. Answer how you think they would answer, then share the result and see how close you got.</p>
        </header>

        <section class="predict-intro-body">
          <div class="predict-card">
            <div class="predict-card-icon">
              <svg viewBox="0 0 24 24" width="32" height="32"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="predict-card-h">Who are you thinking about?</h3>
            <p class="predict-card-sub">First name only — stays on your device, never sent anywhere. You'll answer all 35 horror scenarios as you imagine they would, then get a shareable prediction card you can send to them.</p>
            <div class="predict-name-field">
              <label for="predict-friend-name" class="predict-name-label">Their first name</label>
              <input type="text"
                     id="predict-friend-name"
                     class="predict-name-input"
                     placeholder="e.g., Sam"
                     maxlength="40"
                     autocomplete="off"
                     value="${this.predictFriendName || ""}">
              <div id="predict-name-error" class="predict-name-error"></div>
            </div>
            <div class="predict-warning">
              <strong>How this works:</strong> Answer each horror scenario as you think this person would. At the end you'll get a prediction: "I think you match with [Character]." Share the card with them — they can take the assessment themselves and see how accurate your read on them was.
            </div>
            <div class="predict-cta-row">
              <button class="cta primary predict-cta-primary" data-action="begin-predict">
                <span>Start Predicting</span>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
              ${this.predictions && this.predictions.length > 0 ? `
                <button class="cta tertiary" data-action="view-predictions">
                  <span>View Saved (${this.predictions.length})</span>
                </button>
              ` : ""}
            </div>
          </div>
        </section>
      </div>
    `;
  },

  renderPredictBattery() {
    const scenario = FUN_SCENARIOS[this.predictCurrentIdx];
    if (!scenario) {
      return `<div class="fun-battery-screen"><p>Loading…</p></div>`;
    }
    const total = FUN_SCENARIOS.length;
    const num = this.predictCurrentIdx + 1;
    const pct = (num / total) * 100;
    const friend = this.predictFriendName || "your friend";

    return `
      <div class="fun-battery-screen predict-battery-screen">
        <header class="fun-battery-header">
          <div class="predict-context">
            <span class="predict-context-label">Answering as</span>
            <span class="predict-context-name">${friend}</span>
          </div>
          <div class="prog-track predict-prog-track">
            <div class="prog-fill predict-prog-fill" style="width:${pct}%"></div>
          </div>
          <div class="prog-meta">
            <span class="prog-instrument">
              <span class="prog-section predict-prog-section">${scenario.film}</span>
              <span class="prog-section-counter">scenario ${num} of ${total}</span>
            </span>
            <span class="prog-counter">
              <span class="prog-overall">${num} / ${total}</span>
            </span>
          </div>
        </header>

        <section class="fun-scenario predict-scenario" data-anim="predict_${num}">
          <div class="fun-scenario-setup">${scenario.setup}</div>
          <div class="fun-scenario-prompt">What you think <strong>${friend}</strong> would do:</div>

          <div class="fun-options">
            ${scenario.options.map((opt, i) => `
              <button class="fun-option predict-option" data-fun-option="${opt.id}" data-fun-scenario="${scenario.id}">
                <span class="fun-option-num">${i+1}</span>
                <span class="fun-option-text">${opt.label}</span>
              </button>
            `).join("")}
          </div>
        </section>

        <footer class="battery-footer">
          <button class="ghost" data-action="predict-back" ${!this.predictItemHistory.length ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 12 H5 M11 6 L5 12 L11 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Back</span>
          </button>
          <span class="elapsed predict-tagline">Predicting ${friend}</span>
          <button class="ghost" data-action="back-to-intro">
            <span>Exit</span>
          </button>
        </footer>

        <div class="kbd-hints">
          <span><kbd>1</kbd>–<kbd>${scenario.options.length}</kbd> answer</span>
          <span><kbd>←</kbd> back</span>
        </div>
      </div>
    `;
  },

  renderPredictReport() {
    if (!this.predictReport) return `<div><p>No prediction yet.</p></div>`;
    const r = this.predictReport;
    const top3 = r.matches.slice(0, 3);
    const friend = r.friendName || "your friend";

    return `
      <div class="fun-report-screen predict-report-screen">
        <header class="report-header">
          <div class="report-titlebar">
            <h1 class="report-title predict-title">Your Prediction for ${friend}</h1>
            <p class="report-sub">Based on how you answered the 35 horror scenarios as <strong>${friend}</strong> — here's the character you predicted they'd most resemble.</p>
          </div>
          <div class="report-actions">
            <button class="ghost" data-action="save-prediction">Save Prediction</button>
            <button class="ghost" data-action="predict-friend">Predict Another</button>
            <button class="ghost" data-action="back-to-intro">Done</button>
          </div>
        </header>

        <section class="matches-section predict-matches-section">
          <h2 class="section-h">You Predict <em>${friend}</em> Is…</h2>
          <p class="section-sub">Top three matches based on your answers about them. Share the result — they can take the assessment themselves and see how accurate your prediction was.</p>
          <div class="matches-grid">
            ${top3.map((m, i) => {
              const ch = CHARACTERS.find(c => c.id === m.id);
              return `
                <article class="match-card predict-match-card rank-${i+1}">
                  <div class="match-portrait">${generatePortrait(ch)}</div>
                  <div class="match-rank">No. ${i+1}</div>
                  <div class="match-confidence predict-match-confidence">
                    <div class="conf-pct">${m.pct}<span class="pct-sym">%</span></div>
                    <div class="conf-label">predicted match</div>
                  </div>
                  <h3 class="match-name">${m.inspiredBy?.primary || m.name}</h3>
                  ${m.inspiredBy?.film ? `<p class="match-film">${m.inspiredBy.film}</p>` : ""}
                  <p class="match-subtitle">The ${m.name.replace(/^The\s+/, "")} — <span class="match-arch-inline">${m.archetype}</span></p>
                  <p class="match-profile">${m.profile}</p>
                </article>
              `;
            }).join("")}
          </div>

          <div class="match-actions">
            <button class="cta secondary predict-share-btn" data-action="predict-share-card">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Share Prediction (PNG)</span>
            </button>
            <button class="cta secondary" data-action="save-prediction">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Save Prediction</span>
            </button>
            <button class="cta tertiary small" data-action="predict-friend">
              <span>Predict Another Friend</span>
            </button>
          </div>
        </section>

        <section class="predict-cta-section">
          <h2 class="section-h">How to use this</h2>
          <p class="section-sub">Tap <strong>Share Prediction</strong> to text or AirDrop the card to ${friend}. They can take the assessment themselves at the link on the card — when they finish, they'll get their actual trait match and can compare it to your prediction. If you nailed it, that's a real read on them. If not, the gap is usually the interesting part.</p>
        </section>
      </div>
    `;
  },

  renderPredictList() {
    this.loadPredictions();
    const list = this.predictions || [];
    return `
      <div class="predict-list-screen">
        <header class="subpage-header">
          <button class="back-btn" data-action="back-to-intro" aria-label="Back to intro">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <h2 class="subpage-title predict-title">Saved Predictions</h2>
          <p class="subpage-sub">Predictions you've made for friends. Up to 5 saved on this device. Share the card with them anytime.</p>
        </header>

        ${list.length === 0 ? `
          <div class="empty-comparisons">
            <p>No saved predictions yet. After making a prediction, click <strong>Save Prediction</strong> to keep it here.</p>
            <button class="cta primary predict-cta-primary" data-action="predict-friend" style="margin-top:16px">Make Your First Prediction</button>
          </div>
        ` : `
          <div class="predict-list">
            ${list.map(p => {
              const ch = CHARACTERS.find(c => c.id === p.topMatchId);
              const date = new Date(p.savedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
              return `
                <article class="prediction-card">
                  <div class="prediction-portrait">${ch ? generatePortrait(ch) : ""}</div>
                  <div class="prediction-body">
                    <div class="prediction-friend">${p.friendName}</div>
                    <div class="prediction-match">
                      <span class="prediction-match-label">predicted:</span>
                      <strong>${p.topMatchName}</strong>
                    </div>
                    <div class="prediction-meta">
                      <span>${p.topMatchPct}% match</span>
                      <span>·</span>
                      <span>${date}</span>
                    </div>
                  </div>
                  <button class="ghost small" data-action="delete-prediction" data-prediction-id="${p.id}" aria-label="Delete prediction">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </article>
              `;
            }).join("")}
          </div>
          <div class="predict-list-actions" style="margin-top:24px; text-align:center;">
            <button class="cta primary predict-cta-primary" data-action="predict-friend">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <span>New Prediction</span>
            </button>
          </div>
        `}
      </div>
    `;
  },

  renderReport() {
    const r = this.report;
    if (!r) return "<div>Generating report…</div>";

    return `
      <div class="report-screen">
        <header class="report-header">
          <div class="report-brand">
            <h1>SCREAM <span class="brand-accent">PROFILE</span></h1>
            <p class="report-meta">Generated ${new Date(r.generatedAt).toLocaleString()}</p>
          </div>
          <div class="report-actions no-print">
            <button class="ghost" data-action="save-result">Save</button>
            <button class="ghost" data-action="print">Print / PDF</button>
            <button class="ghost" data-action="export-json">Export JSON</button>
            <button class="ghost" data-action="retake">New Screening</button>
          </div>
        </header>

        ${this.renderSafetySection(r.safetyFlags)}
        ${this.renderTopMatches(r.matches.slice(0, 3))}
        ${this.renderPersonalitySection(r.personality)}
        ${this.renderClinicalSection(r.probableDiagnoses, r.subclinical, r.evidence)}
        ${this.renderFunctional(r.functional)}
        ${this.renderEvidencePanel(r.evidence, r.scores)}

        <footer class="report-footer">
          <p class="disclaimer">
            <strong>Disclaimer.</strong> This report is generated from validated short-form screening measures. It is intended for educational and self-reflection purposes. It is not a substitute for clinical interview, formal diagnosis, or treatment planning. The diagnostic suggestions reflect symptom patterns matching DSM-5-TR criteria; formal diagnosis requires evaluation by a qualified clinician including consideration of medical etiology, substance effects, longitudinal course, and functional impairment context. The character archetypes are creative-clinical metaphors and do not constitute personality assessment.
          </p>
        </footer>
      </div>
    `;
  },

  renderSafetySection(flags) {
    if (!flags || !flags.length) return "";
    return `
      <section class="safety-section">
        <div class="safety-header">⚠ Safety Considerations</div>
        ${flags.map(f => `
          <div class="safety-flag">
            <h3>${f.flag}</h3>
            <p class="safety-source">${f.source}</p>
            <p class="safety-action">${f.action}</p>
          </div>
        `).join("")}
        <div class="crisis-resources">
          <strong>Crisis resources:</strong>
          <span><strong>988</strong> Suicide & Crisis Lifeline (call/text)</span>
          <span><strong>741741</strong> Crisis Text Line (text HOME)</span>
          <span><strong>911</strong> Emergency</span>
        </div>
      </section>
    `;
  },

  renderTopMatches(matches) {
    if (!matches.length) return "";
    return `
      <section class="matches-section">
        <h2 class="section-h">Your Horror Archetype</h2>
        <p class="section-sub">Top three horror-clinical archetypes matched against your current presentation. Match percentage with 95% confidence interval; the interval widens when evidence is weak or when the next-ranked match is close behind.</p>
        <div class="matches-grid">
          ${matches.map((m, i) => {
            const ch = CHARACTERS.find(c => c.id === m.id);
            return `
              <article class="match-card rank-${i+1}">
                <div class="match-portrait">${generatePortrait(ch)}</div>
                <div class="match-rank">No. ${i+1}</div>
                <div class="match-confidence">
                  <div class="conf-pct">${m.pct}<span class="pct-sym">%</span></div>
                  <div class="conf-label">match</div>
                  ${(m.ciLow != null && m.ciHigh != null) ? `
                    <div class="conf-ci">
                      <span class="ci-bracket">[</span>${m.ciLow}–${m.ciHigh}%<span class="ci-bracket">]</span>
                      <span class="ci-95">95% CI</span>
                    </div>
                  ` : ""}
                </div>
                <h3 class="match-name">${m.inspiredBy?.primary || m.name}</h3>
                ${m.inspiredBy?.film ? `<p class="match-film">${m.inspiredBy.film}</p>` : ""}
                <p class="match-subtitle">The ${m.name.replace(/^The\s+/, "")} — <span class="match-arch-inline">${m.archetype}</span></p>
                ${m.inspiredBy?.others?.length ? `
                  <div class="match-inspired">
                    <span class="inspired-label">Also exemplified by</span>
                    <span class="inspired-others">${m.inspiredBy.others.join(" · ")}</span>
                  </div>
                ` : ""}
                <p class="match-profile">${m.profile}</p>
                <div class="match-section">
                  <div class="match-section-label">Clinical metaphor</div>
                  <p>${m.metaphor}</p>
                </div>
                <div class="match-section">
                  <div class="match-section-label">Therapeutic relevance</div>
                  <p>${m.therapeuticUse}</p>
                </div>
              </article>
            `;
          }).join("")}
        </div>

        <div class="match-actions">
          <button class="cta secondary" data-action="share-card">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V3m0 0L7 8m5-5l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Share Card (PNG)</span>
          </button>
          <button class="cta secondary" data-action="save-comparison">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 12 12)"/></svg>
            <span>Save to Comparisons</span>
          </button>
          <button class="cta tertiary small" data-action="view-comparisons">
            <span>View History</span>
          </button>
        </div>
      </section>
    `;
  },

  renderClinicalSection(probable, subclinical, evidence) {
    if (!probable.length && !subclinical.length) {
      return `
        <section class="clinical-section">
          <h2 class="section-h">Clinical Impressions</h2>
          <div class="impression-clear">No symptom presentation reaches DSM-5-TR threshold across the screened conditions.</div>
        </section>
      `;
    }
    return `
      <section class="clinical-section">
        <h2 class="section-h">Clinical Impressions</h2>
        <p class="section-sub">Conditions reaching threshold expand by default to show the criteria walkthrough. <strong>Criteria your screening responses suggest you meet are highlighted in yellow</strong> with a check mark and "✓ Endorsed" badge — the at-a-glance summary appears in each header chip. Tap any header to collapse or expand. Differentials, rule-outs, and treatment algorithms render below the criteria.</p>
        ${probable.length ? `
          <div class="dx-group">
            <h3 class="dx-group-h">Conditions Reaching Screening Threshold</h3>
            <div class="dx-list">
              ${probable.map(d => this.renderDisorderCard(d, true, evidence)).join("")}
            </div>
          </div>
        ` : ""}
        ${subclinical.length ? `
          <div class="dx-group">
            <h3 class="dx-group-h">Subclinical Signal (Below Threshold, Worth Monitoring)</h3>
            <div class="dx-list">
              ${subclinical.map(d => this.renderDisorderCard(d, false, evidence)).join("")}
            </div>
          </div>
        ` : ""}
      </section>
    `;
  },

  shortenCriterion(text) {
    // Take the part before the first em-dash or parenthesis for a compact peek chip.
    if (!text) return "";
    const stripped = text.replace(/^Criterion\s+[A-Z]:\s*/i, "");
    const cutAt = Math.min(
      stripped.indexOf("—") >= 0 ? stripped.indexOf("—") : 999,
      stripped.indexOf(" — ") >= 0 ? stripped.indexOf(" — ") : 999,
      stripped.indexOf("(") >= 0 ? stripped.indexOf("(") : 999,
      stripped.indexOf(",") >= 0 ? stripped.indexOf(",") : 999
    );
    let out = cutAt < 999 ? stripped.slice(0, cutAt).trim() : stripped;
    if (out.length > 40) out = out.slice(0, 38).trim() + "…";
    return out;
  },

  renderDisorderCard(d, probable, evidence) {
    const sev = d.severity || "—";
    const criteriaList = Array.isArray(d.criteria) ? d.criteria : (d.criteria ? [d.criteria] : []);
    const tx = d.treatment || d.treatments || {};
    // Pull criteriaMetIds from evidence for this disorder
    const ev = evidence ? evidence[d.key] : null;
    const metIds = (ev && ev.criteriaMetIds) ? new Set(ev.criteriaMetIds) : new Set();
    const metCount = metIds.size;
    const totalCount = criteriaList.length;

    return `
      <article class="dx-card ${probable ? "probable expanded" : "subclinical"}">
        <header class="dx-header" data-action="toggle-disorder">
          <div class="dx-title-row">
            <span class="dx-icd">${d.icd10 || d.icd || d.code || ""}</span>
            <h4 class="dx-name">${d.name}</h4>
            ${totalCount > 0 ? `<span class="dx-criteria-count ${metCount === 0 ? "zero-met" : ""}" title="${metCount} of ${totalCount} screened criteria endorsed">${metCount}/${totalCount} criteria met</span>` : ""}
            <span class="dx-severity sev-${(sev||"").toLowerCase().replace(/\s/g,"-")}">${sev}</span>
            <span class="dx-signal">${(d.signal*100).toFixed(0)}%</span>
            <span class="dx-toggle">＋</span>
          </div>
          ${metCount > 0 ? `
            <div class="dx-met-preview" aria-label="Endorsed criteria summary">
              <span class="dx-met-preview-label">Endorsed:</span>
              ${criteriaList
                .filter(c => typeof c !== "string" && metIds.has(c.id))
                .slice(0, 4)
                .map(c => `<span class="dx-met-chip">${this.shortenCriterion(c.text)}</span>`)
                .join("")}
              ${(criteriaList.filter(c => typeof c !== "string" && metIds.has(c.id)).length > 4) ? `<span class="dx-met-more">+${criteriaList.filter(c => typeof c !== "string" && metIds.has(c.id)).length - 4} more</span>` : ""}
            </div>
          ` : ""}
        </header>
        <div class="dx-body">
          ${criteriaList.length ? `
            <div class="dx-block">
              <div class="dx-block-h">DSM-5-TR Criteria <span class="dx-block-h-note">— ${metCount} of ${totalCount} suggested by responses</span></div>
              <ul class="dx-criteria-list">
                ${criteriaList.map(c => {
                  // Each criterion is either a string (legacy) or {id, text, instruments}
                  if (typeof c === "string") {
                    return `<li class="dx-criterion-text">${c}</li>`;
                  }
                  const isMet = metIds.has(c.id);
                  const instrumentNote = c.instruments ? `<div class="dx-criterion-instrument">${c.instruments.join(" · ")}</div>` : "";
                  return `
                    <li class="dx-criterion ${isMet ? "criterion-met" : "criterion-unmet"}">
                      <span class="dx-criterion-marker" aria-hidden="true">
                        ${isMet
                          ? '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                          : '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>'}
                      </span>
                      <div class="dx-criterion-body">
                        <div class="dx-criterion-text">${c.text}</div>
                        ${isMet ? '<span class="criterion-endorsed-badge">✓ Endorsed</span>' : ""}
                        ${instrumentNote}
                      </div>
                    </li>
                  `;
                }).join("")}
              </ul>
            </div>
          ` : ""}
          ${d.differentials ? `
            <div class="dx-block">
              <div class="dx-block-h">Differential Diagnoses</div>
              <ul class="dx-list-bullet">
                ${d.differentials.map(x => `<li>${x}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
          ${d.ruleOuts ? `
            <div class="dx-block">
              <div class="dx-block-h">Rule-Outs / Workup</div>
              <ul class="dx-list-bullet">
                ${d.ruleOuts.map(x => `<li>${x}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
          ${(tx.firstLine || tx.adjunctive || tx.severeCases || tx.medication || tx.mbc) ? `
            <div class="dx-block">
              <div class="dx-block-h">Evidence-Based Treatment Algorithm</div>
              ${tx.firstLine ? `
                <div class="tx-row">
                  <div class="tx-label">First-line</div>
                  <ul class="tx-list">${tx.firstLine.map(x => `<li>${x}</li>`).join("")}</ul>
                </div>
              ` : ""}
              ${tx.adjunctive ? `
                <div class="tx-row">
                  <div class="tx-label">Adjunctive</div>
                  <ul class="tx-list">${tx.adjunctive.map(x => `<li>${x}</li>`).join("")}</ul>
                </div>
              ` : ""}
              ${tx.severeCases ? `
                <div class="tx-row">
                  <div class="tx-label">Severe / refractory</div>
                  <ul class="tx-list">${tx.severeCases.map(x => `<li>${x}</li>`).join("")}</ul>
                </div>
              ` : ""}
              ${tx.medication ? `
                <div class="tx-row">
                  <div class="tx-label">Medication</div>
                  <ul class="tx-list">${tx.medication.map(x => `<li>${x}</li>`).join("")}</ul>
                </div>
              ` : ""}
              ${tx.mbc ? `
                <div class="tx-row">
                  <div class="tx-label">Measurement-based care</div>
                  <ul class="tx-list">${(Array.isArray(tx.mbc) ? tx.mbc : [tx.mbc]).map(x => `<li>${x}</li>`).join("")}</ul>
                </div>
              ` : ""}
            </div>
          ` : ""}
        </div>
      </article>
    `;
  },

  renderPersonalitySection(personality) {
    if (!personality) return "";
    const bf = personality.bigFive;
    const pid = personality.pid5;
    if (!bf || !bf.administered) return "";
    // Big Five traits with horror-flavored interpretive copy
    const traits = [
      {
        key: "extraversion",
        label: "Extraversion",
        score: bf.extraversion,
        band: bf.bands.extraversion,
        anchorLow: "Reserved · interior · slow to ignite",
        anchorHigh: "Expressive · social fuel · the one with the flashlight",
        flavorLow: "Quietly observant — the one watching from the back of the cabin.",
        flavorHigh: "Forward-pulling — the protagonist who drags the group toward the noise."
      },
      {
        key: "agreeableness",
        label: "Agreeableness",
        score: bf.agreeableness,
        band: bf.bands.agreeableness,
        anchorLow: "Skeptical · oppositional · keeps the receipts",
        anchorHigh: "Trusting · cooperative · believes the basement is safe",
        flavorLow: "The Final Girl who notices something is off and won't be talked out of it.",
        flavorHigh: "The trusting friend who follows the killer's instructions because he sounds reasonable."
      },
      {
        key: "conscientiousness",
        label: "Conscientiousness",
        score: bf.conscientiousness,
        band: bf.bands.conscientiousness,
        anchorLow: "Spontaneous · unfinished tasks · the missed warning",
        anchorHigh: "Methodical · prepared · checks the locks twice",
        flavorLow: "Casey Becker who picks up the phone without checking who it is.",
        flavorHigh: "Laurie Strode who taught her granddaughter to load a shotgun in the dark."
      },
      {
        key: "neuroticism",
        label: "Neuroticism",
        score: bf.neuroticism,
        band: bf.bands.neuroticism,
        anchorLow: "Unflappable · steady under pressure",
        anchorHigh: "Reactive · easily moved · the body keeps score",
        flavorLow: "The character who walks into the haunted house and makes a sandwich.",
        flavorHigh: "Annie Graham — the storms move through and you feel each one in your chest."
      },
      {
        key: "openness",
        label: "Openness",
        score: bf.openness,
        band: bf.bands.openness,
        anchorLow: "Conventional · grounded · suspicious of strange ideas",
        anchorHigh: "Imaginative · curious · the one who reads the cursed book",
        flavorLow: "Refuses to enter the woods, regardless of what the locals say.",
        flavorHigh: "Pearl staring at the alligator — wide open to whatever comes next."
      }
    ];

    const trait = (t) => {
      const score = t.score;
      const pct = score == null ? 0 : Math.round(((score - 1) / 6) * 100);
      const flavor = score == null ? "Not assessed" : (score >= 4.5 ? t.flavorHigh : t.flavorLow);
      return `
        <div class="bf-trait">
          <div class="bf-trait-head">
            <span class="bf-label">${t.label}</span>
            <span class="bf-score">${score == null ? "—" : score.toFixed(1)} <span class="bf-band">${t.band}</span></span>
          </div>
          <div class="bf-bar">
            <div class="bf-fill" style="width: ${pct}%"></div>
            <div class="bf-mid"></div>
          </div>
          <div class="bf-anchors">
            <span>${t.anchorLow}</span>
            <span>${t.anchorHigh}</span>
          </div>
          <p class="bf-flavor">${flavor}</p>
        </div>
      `;
    };

    // PID-5 maladaptive trait readout
    const pidTraits = pid ? [
      { label: "Negative Affectivity", score: pid.negativeAffect, max: 15, gloss: "Emotional reactivity, anxious vigilance, depressive lability." },
      { label: "Detachment", score: pid.detachment, max: 15, gloss: "Withdrawal, anhedonia, restricted affect." },
      { label: "Antagonism", score: pid.antagonism, max: 15, gloss: "Manipulativeness, callousness, grandiosity." },
      { label: "Disinhibition", score: pid.disinhibition, max: 15, gloss: "Impulsivity, irresponsibility, risk-taking." },
      { label: "Psychoticism", score: pid.psychoticism, max: 15, gloss: "Unusual beliefs, perceptual oddities, eccentricity." }
    ] : [];

    return `
      <section class="personality-section">
        <h2 class="section-h">Personality Profile</h2>
        <p class="section-sub">Two complementary readouts: <strong>Big Five</strong> (TIPI) shows your standing on five universal personality dimensions; <strong>PID-5-BF</strong> shows where you sit on five <em>maladaptive</em> trait domains used in DSM-5-TR's alternative model for personality disorders.</p>

        <div class="bigfive-block">
          <h3 class="block-h">Big Five (TIPI)</h3>
          <div class="bf-grid">
            ${traits.map(trait).join("")}
          </div>
        </div>

        ${pidTraits.length ? `
          <div class="pid5-block">
            <h3 class="block-h">PID-5-BF — Maladaptive Trait Domains</h3>
            <p class="block-sub">Higher scores indicate more pronounced expression of the trait. Domains aren't pathological by themselves; clinical relevance depends on functional impact.</p>
            <div class="pid-grid">
              ${pidTraits.map(p => `
                <div class="pid-trait">
                  <div class="pid-head">
                    <span class="pid-label">${p.label}</span>
                    <span class="pid-score">${p.score}<span class="pid-max">/${p.max}</span></span>
                  </div>
                  <div class="pid-bar"><div class="pid-fill" style="width: ${(p.score / p.max) * 100}%"></div></div>
                  <p class="pid-gloss">${p.gloss}</p>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </section>
    `;
  },

  renderFunctional(f) {
    if (!f) return "";
    return `
      <section class="func-section">
        <h2 class="section-h">Functional Impact</h2>
        <div class="func-bar-wrap">
          <div class="func-bar"><div class="func-fill" style="width:${f.percentage}%"></div></div>
          <div class="func-meta">
            <span>${f.percentage}% impairment across work, relationships, social life, self-care, identity</span>
            <span class="func-sev">${f.severity}</span>
          </div>
        </div>
      </section>
    `;
  },

  renderRemainingMatches(matches) {
    if (!matches.length) return "";
    return `
      <section class="more-matches-section">
        <h2 class="section-h">Additional Archetypal Resonances</h2>
        <p class="section-sub">Subordinate matches that may capture facets of your presentation.</p>
        <div class="more-matches">
          ${matches.map(m => {
            const ch = CHARACTERS.find(c => c.id === m.id);
            return `
              <div class="more-match">
                <div class="mm-portrait">${generatePortrait(ch)}</div>
                <div class="mm-info">
                  <div class="mm-pct">${m.pct}%</div>
                  <h4>${m.nameDisplay || m.name}</h4>
                  <p class="mm-arch">${m.archetype}</p>
                  ${m.inspiredBy ? `<p class="mm-inspired">${m.inspiredBy.primary} · ${m.inspiredBy.film}</p>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  },

  renderEvidencePanel(evidence, scores) {
    return `
      <section class="evidence-section">
        <h2 class="section-h">
          <span>Evidence Detail</span>
          <button class="ghost small" data-action="show-evidence">Toggle</button>
        </h2>
        <div class="evidence-panel">
          <table class="evidence-table">
            <thead><tr><th>Instrument</th><th>Score</th><th>Severity / Band</th></tr></thead>
            <tbody>
              ${this.evidenceRows(scores)}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  evidenceRows(scores) {
    const rows = [];
    if (scores.PHQ9) rows.push(["PHQ-9 (Depression)", `${scores.PHQ9.total} / 27`, scores.PHQ9.severity]);
    if (scores.GAD7) rows.push(["GAD-7 (Anxiety)", `${scores.GAD7.total} / 21`, scores.GAD7.severity]);
    if (scores.PCPTSD) rows.push(["PC-PTSD-5", `${scores.PCPTSD.total} / 5`, scores.PCPTSD.positive ? "Positive screen" : "Negative"]);
    if (scores.PCL5) rows.push(["PCL-5 (brief)", `${scores.PCL5.total} / 40`, `${scores.PCL5.severity} (clusters B${scores.PCL5.clusters.B}/C${scores.PCL5.clusters.C}/D${scores.PCL5.clusters.D}/E${scores.PCL5.clusters.E})`]);
    if (scores.MSI) rows.push(["MSI-BPD", `${scores.MSI.total} / 10`, scores.MSI.total >= 7 ? "Probable BPD" : "Subthreshold"]);
    if (scores.PID5) rows.push(["PID-5-BF (brief)",
      `Neg ${scores.PID5.negativeAffect}/6 · Det ${scores.PID5.detachment}/6 · Ant ${scores.PID5.antagonism}/6 · Dis ${scores.PID5.disinhibition}/6 · Psy ${scores.PID5.psychoticism}/6`,
      "Domain scores"]);
    if (scores.YBOCS) rows.push(["Y-BOCS-SR (brief)", `${scores.YBOCS.total} / 20`, scores.YBOCS.severity]);
    if (scores.AUDIT_C) rows.push(["AUDIT-C", `${scores.AUDIT_C.total} / 12`, scores.AUDIT_C.positive ? "At-risk drinking" : "Low risk"]);
    if (scores.ASRS) rows.push(["ASRS-5", `${scores.ASRS.total} (${scores.ASRS.positiveItems} items at threshold)`, scores.ASRS.positive ? "Probable ADHD" : "Subthreshold"]);
    if (scores.LSAS) rows.push(["LSAS (brief)", `${scores.LSAS.total} / 24`, scores.LSAS.severity]);
    if (scores.DES_B) rows.push(["DES-B", `mean ${scores.DES_B.mean.toFixed(2)} / 4`, scores.DES_B.severity]);
    if (scores.AQ10) rows.push(["AQ-10", `${scores.AQ10.total} / 10`, scores.AQ10.administered ? (scores.AQ10.positive ? "Positive screen" : "Negative") : "Not administered"]);
    if (scores.MDQ) rows.push(["MDQ", `${scores.MDQ.total} / 13`, scores.MDQ.positive ? "Positive — bipolar spectrum possible" : "Negative"]);
    if (scores.ACE) rows.push(["ACE-10", `${scores.ACE.total} / 10`, scores.ACE.risk]);
    if (scores.FUNCTIONAL) rows.push(["Functional Impact", `${scores.FUNCTIONAL.percentage}%`, scores.FUNCTIONAL.severity]);
    return rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  }
};

window.addEventListener("DOMContentLoaded", () => APP.init());
