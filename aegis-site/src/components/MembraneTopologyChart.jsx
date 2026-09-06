import { useState, useEffect } from "react";

const MEMBRANES = [
  {
    id: "M0",
    name: "Sender History",
    subtitle: "Local Contact Whitelist",
    latency: "0.1ms",
    icon: "🫆",
    file: "background.js · storage.local",
    desc: "Maintains zero reputation penalty for known, recurring correspondents without skipping security layers.",
    rule: "If sender in contactWhitelist, preserves baseline trust and prevents false alarms.",
    maxDeduction: "0 pts (Baseline Safeguard)",
    color: "#00E599"
  },
  {
    id: "M1",
    name: "Identity & Auth",
    subtitle: "DMARC / SPF / Display-Name",
    latency: "1.2ms",
    icon: "✅",
    file: "senderIdentity.js · doh.js",
    desc: "Performs privacy-preserving DNS-over-HTTPS queries via Cloudflare to verify SPF, DKIM, and DMARC alignment.",
    rule: "Flags display-name mismatches, Reply-To diversions, and unaligned From headers.",
    maxDeduction: "-30 pts",
    color: "#00E599"
  },
  {
    id: "M2",
    name: "Domain Intelligence",
    subtitle: "RDAP Age & Punycode",
    latency: "2.4ms",
    icon: "🌐",
    file: "rdap.js · confusables.js",
    desc: "Inspects public domain registration timestamps without leaking message content; decodes Unicode UTS #39 confusables.",
    rule: "Deducts 20-30 points for domains registered under 30 days ago or homoglyph spoofing.",
    maxDeduction: "-35 pts",
    color: "#00E599"
  },
  {
    id: "M3",
    name: "On-Device ML",
    subtitle: "12,000-Feature TF-IDF + LR",
    latency: "0.5ms",
    icon: "🧠",
    file: "aiPhishingClassifier.js",
    desc: "Client-side logistic regression evaluating urgency, pressure, and phishing rhetoric directly in browser memory.",
    rule: "Capped at -12 pts deduction; suppressed by OTP fast-lane to prevent false alarms.",
    maxDeduction: "-12 pts (Capped Guardrail)",
    color: "#00E599"
  },
  {
    id: "M4",
    name: "Proof-of-Action",
    subtitle: "Authorization Membrane",
    latency: "0.2ms",
    icon: "🛡️",
    file: "actionAssurance.js",
    desc: "Never treats authentication as authorization. Evaluates what the email asks the user to DO (wire, credential, PII).",
    rule: "Enforces VERIFY_FIRST or BLOCKED on sensitive operations from unverified or newly seen senders.",
    maxDeduction: "Quarantine Override",
    color: "#F59E0B"
  },
  {
    id: "M5",
    name: "Evidence Passport",
    subtitle: "SHA-256 Audit Seal",
    latency: "0.1ms",
    icon: "📄",
    file: "pdfReport.js · crypto.subtle",
    desc: "Calculates SHA-256 cryptographic hash across all membrane deductions, generating verifiable PDF 1.4 forensic dossiers.",
    rule: "Exports immutable passport for SOC incident response without uploading raw emails.",
    maxDeduction: "Cryptographic Seal",
    color: "#3B82F6"
  }
];

const CASCADE_SCENARIOS = [
  {
    id: "paypal",
    title: "Cyrillic PayPal Phishing",
    sender: "security@pаypal.com (Spoofed)",
    steps: [
      { id: "M0", label: "M0 Sender History", status: "PASS", deduction: 0, log: "New correspondent · No baseline penalty applied." },
      { id: "M1", label: "M1 Identity & Auth", status: "FAIL", deduction: -30, log: "FAIL: DMARC unaligned · From header domain fails SPF validation." },
      { id: "M2", label: "M2 Domain Intel", status: "FAIL", deduction: -35, log: "FAIL: Unicode Homoglyph U+0430 detected in 'pаypal.com'." },
      { id: "M3", label: "M3 On-Device ML", status: "FAIL", deduction: -12, log: "FLAGGED: Urgency n-grams detected ('account suspended in 24h')." },
      { id: "M4", label: "M4 Proof-of-Action", status: "BLOCKED", deduction: 0, log: "INTERCEPT: Credential harvesting link blocked · Prompt prohibited." },
      { id: "M5", label: "M5 Evidence Passport", status: "SEALED", deduction: 0, log: "SEALED: SHA-256 passport e8f91b4a... generated in local storage." }
    ],
    finalScore: 23,
    verdict: "QUARANTINE / HIGH THREAT",
    color: "rose"
  },
  {
    id: "bec",
    title: "CEO Wire Transfer Diversion",
    sender: "ceo-office@company-corp.com",
    steps: [
      { id: "M0", label: "M0 Sender History", status: "PASS", deduction: 0, log: "Known executive contact name · Passed M0 verification." },
      { id: "M1", label: "M1 Identity & Auth", status: "WARN", deduction: -15, log: "WARN: Reply-To header diverts to external protonmail address." },
      { id: "M2", label: "M2 Domain Intel", status: "PASS", deduction: 0, log: "Domain age: 8 years · Clean DNS reputation." },
      { id: "M3", label: "M3 On-Device ML", status: "FAIL", deduction: -12, log: "FLAGGED: High BEC language score ('revised wire routing, urgent')." },
      { id: "M4", label: "M4 Proof-of-Action", status: "ENFORCE", deduction: 0, log: "ENFORCE: Refuses auth as authority · Proof-of-Action PIN challenge." },
      { id: "M5", label: "M5 Evidence Passport", status: "SEALED", deduction: 0, log: "SEALED: Audit seal 41c88d2f... logged to incident database." }
    ],
    finalScore: 48,
    verdict: "VERIFY FIRST / SUSPICIOUS BEC",
    color: "amber"
  },
  {
    id: "github",
    title: "Genuine GitHub PR Notification",
    sender: "notifications@github.com",
    steps: [
      { id: "M0", label: "M0 Sender History", status: "PASS", deduction: 0, log: "Frequent sender verified in local browser address history." },
      { id: "M1", label: "M1 Identity & Auth", status: "PASS", deduction: 0, log: "PASS: Cryptographic DKIM RSA-2048 verified · SPF aligned." },
      { id: "M2", label: "M2 Domain Intel", status: "PASS", deduction: 0, log: "github.com established 16+ years · High trust tier." },
      { id: "M3", label: "M3 On-Device ML", status: "PASS", deduction: 0, log: "BENIGN: Developer collaboration payload · 0% threat probability." },
      { id: "M4", label: "M4 Proof-of-Action", status: "PASS", deduction: 0, log: "CLEAR: Read-only notification · No authorization challenge required." },
      { id: "M5", label: "M5 Evidence Passport", status: "SEALED", deduction: 0, log: "SEALED: Clean provenance hash a902bc41... archived." }
    ],
    finalScore: 98,
    verdict: "SAFE TO ENGAGE / VERIFIED",
    color: "mint"
  }
];

export function MembraneTopologyChart() {
  const [activeNode, setActiveNode] = useState(MEMBRANES[0]);

  // Interception Cascade Simulation State
  const [selectedScenario, setSelectedScenario] = useState(CASCADE_SCENARIOS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [cumulativeScore, setCumulativeScore] = useState(100);

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveStepIndex(0);
    setCumulativeScore(100);

    let currentScore = 100;

    const runStep = (idx) => {
      if (idx >= 6) {
        setIsSimulating(false);
        return;
      }
      setActiveStepIndex(idx);
      currentScore += selectedScenario.steps[idx].deduction;
      setCumulativeScore(currentScore);

      setTimeout(() => {
        runStep(idx + 1);
      }, 550);
    };

    setTimeout(() => runStep(0), 200);
  };

  return (
    <div className="space-y-8">
      {/* Topology Overview */}
      <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line pb-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              DETERMINISTIC DEFENSE-IN-DEPTH · 6 IN-FLIGHT MEMBRANES
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Membrane Inspection Pipeline (M0 → M5)
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Every incoming email passes through 6 sequential on-device membranes. Click any node to inspect its execution latency, rule logic, and deduction caps.
            </p>
          </div>

          <div className="bg-panel2 border border-line p-3 rounded-md text-right shadow-sm">
            <div className="mono text-[10px] text-muted">TOTAL PIPELINE LATENCY</div>
            <div className="text-xl font-bold text-mint mono">~4.5 ms</div>
            <div className="text-[10px] text-mint mt-0.5">100% Client-Side</div>
          </div>
        </div>

        {/* 6 Membrane Nodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEMBRANES.map((m, i) => {
            const isSelected = activeNode.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveNode(m)}
                className={`text-left p-4 rounded-lg border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-panel2 border-mint shadow-lg ring-1 ring-mint"
                    : "bg-panel2/60 border-line hover:border-mint/50 hover:bg-panel2"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="mono text-xs font-bold text-mint">{m.id}</span>
                    <span className="mono text-[10px] text-muted bg-panel px-1.5 py-0.5 rounded border border-line">
                      {m.latency}
                    </span>
                  </div>
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="font-semibold text-xs text-white leading-snug">{m.name}</div>
                  <div className="text-[10px] text-muted truncate mt-0.5">{m.subtitle}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[9px] mono text-mintdim">
                  <span>Step {i + 1} of 6</span>
                  <span>{isSelected ? "ACTIVE" : "SELECT →"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Membrane Deep-Dive Inspector */}
        <div className="bg-panel2 border border-line rounded-lg p-5 sm:p-6 space-y-4 shadow-inner">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-lg bg-panel border border-line flex items-center justify-center text-2xl shrink-0 shadow-sm">
                {activeNode.icon}
              </span>
              <div>
                <div className="mono text-[10px] text-mint uppercase">SELECTED MEMBRANE NODE / {activeNode.id}</div>
                <h4 className="text-lg font-bold text-white">{activeNode.name}: {activeNode.subtitle}</h4>
                <div className="mono text-[10px] text-mintdim mt-0.5">{activeNode.file}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-panel border border-line px-3 py-1.5 rounded text-right shadow-sm">
                <div className="mono text-[9px] text-muted">EXECUTION LATENCY</div>
                <div className="mono text-sm font-bold text-mint">{activeNode.latency}</div>
              </div>
              <div className="bg-panel border border-line px-3 py-1.5 rounded text-right shadow-sm">
                <div className="mono text-[9px] text-muted">PENALTY IMPACT</div>
                <div className="mono text-sm font-bold text-amber">{activeNode.maxDeduction}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-panel p-4 rounded border border-line space-y-1 shadow-sm">
              <div className="mono text-[10px] text-muted uppercase">Operational Heuristic</div>
              <p className="text-white leading-relaxed">{activeNode.desc}</p>
            </div>
            <div className="bg-panel p-4 rounded border border-line space-y-1 shadow-sm">
              <div className="mono text-[10px] text-muted uppercase">Enforcement Rule</div>
              <p className="text-muted leading-relaxed">{activeNode.rule}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE 6-LAYER INTERCEPTION CASCADE SIMULATOR (HIGH INTERACTIVITY) */}
      <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              INTERACTIVE DEMONSTRATION · IN-FLIGHT INSPECTION CASCADE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Live 6-Layer Intercept Cascade Simulator
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Select an incoming email attack scenario and trigger the in-flight cascade. Watch each membrane execute in sequence with live score deduction.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={`mono text-xs font-bold px-5 py-2.5 rounded shadow-md transition-all flex items-center gap-2 shrink-0 ${
              isSimulating
                ? "bg-panel2 border border-line text-muted cursor-not-allowed"
                : "bg-mint text-ink hover:bg-mintdim active:scale-95"
            }`}
          >
            <span>{isSimulating ? "⚡ Simulating Pipeline..." : "▶ Run Live Intercept Cascade"}</span>
          </button>
        </div>

        {/* Scenario Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          {CASCADE_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenario(scen);
                setActiveStepIndex(-1);
                setCumulativeScore(100);
              }}
              disabled={isSimulating}
              className={`mono text-xs px-3.5 py-2 rounded-md border transition-all ${
                selectedScenario.id === scen.id
                  ? "border-mint text-mint bg-panel2 font-bold shadow-sm"
                  : "border-line text-muted hover:text-white bg-panel2/60 hover:bg-panel2"
              }`}
            >
              {scen.title}
            </button>
          ))}
        </div>

        {/* Live Intercept Progress Status Bar */}
        <div className="bg-panel2 border border-line rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs mono">
            <span className="text-muted">
              TARGET MESSAGE: <span className="text-white font-semibold">{selectedScenario.sender}</span>
            </span>
            <span className="text-mint font-bold">
              TRUST SCORE: {activeStepIndex === -1 ? 100 : cumulativeScore} / 100
            </span>
          </div>

          {/* Sequential Step Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {selectedScenario.steps.map((st, i) => {
              const isActive = activeStepIndex === i;
              const isPast = activeStepIndex > i;

              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-md border text-left transition-all ${
                    isActive
                      ? "bg-mint/15 border-mint shadow-md ring-1 ring-mint animate-pulse"
                      : isPast
                      ? st.deduction < 0
                        ? "bg-rose/10 border-rose/40"
                        : "bg-panel border-line"
                      : "bg-panel/40 border-line/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mono mb-1">
                    <span className="font-bold">{st.id}</span>
                    <span className={`px-1 rounded font-bold text-[8px] ${
                      isPast || isActive
                        ? st.deduction < 0
                          ? "bg-rose text-white"
                          : "bg-mint/20 text-mint"
                        : "text-muted"
                    }`}>
                      {isPast || isActive ? st.status : "QUEUED"}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate">{st.label}</div>
                  <div className="text-[10px] mono text-muted mt-1">
                    {isPast || isActive
                      ? st.deduction < 0
                        ? `${st.deduction} pts`
                        : "0 deduction"
                      : "Pending"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Step Audit Log */}
          <div className="bg-panel border border-line rounded p-3 mono text-xs space-y-1">
            <div className="text-[10px] text-muted uppercase">REAL-TIME MEMBRANE AUDIT FEED:</div>
            {activeStepIndex === -1 ? (
              <div className="text-muted italic text-[11px]">
                Click "Run Live Intercept Cascade" to start the on-device verification process.
              </div>
            ) : (
              <div className="text-white text-[11px]">
                &gt; <span className="text-mint">{selectedScenario.steps[activeStepIndex]?.id}:</span>{" "}
                {selectedScenario.steps[activeStepIndex]?.log}
              </div>
            )}
          </div>

          {/* Final Cascade Result Badge */}
          {activeStepIndex >= 5 && (
            <div className={`p-4 rounded-lg border flex items-center justify-between flex-wrap gap-4 ${
              selectedScenario.color === "rose"
                ? "bg-rose/15 border-rose/50 text-rose"
                : selectedScenario.color === "amber"
                ? "bg-amber/15 border-amber/50 text-amber"
                : "bg-mint/15 border-mint/50 text-mint"
            }`}>
              <div>
                <div className="font-bold text-sm">FINAL VERDICT: {selectedScenario.verdict}</div>
                <div className="text-xs opacity-90 mt-0.5">
                  Calculated locally across all 6 membranes in 4.4ms with zero external cloud telemetry.
                </div>
              </div>
              <div className="mono text-xs font-bold px-3 py-1.5 rounded bg-panel border border-line text-white">
                SCORE: {cumulativeScore} / 100
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
