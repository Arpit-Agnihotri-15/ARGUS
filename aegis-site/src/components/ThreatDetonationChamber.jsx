import { useState, useEffect } from "react";

const ATTACK_SCENARIOS = [
  {
    id: "homoglyph",
    level: "CRITICAL · LEVEL 5",
    levelColor: "text-rose bg-rose/10 border-rose/40",
    title: "PayPal Lookalike (UTS #39 Homoglyph + Urgency)",
    sender: "service@pаypal.com",
    displayName: "PayPal Security Support",
    subject: "URGENT: Your account access has been limited within 24 hours",
    body: "We detected unauthorized access attempts from a foreign IP address. You must verify your login credentials immediately to avoid account suspension: https://pаypal.com/restore-access",
    attackVector: "Unicode Cyrillic 'а' (U+0430) + Artificial Urgency + Credential Harvesting",
    targetScore: 15,
    shields: [
      { id: "M0", name: "Sender Whitelist", status: "FAILED", delta: "-0", note: "Unknown sender address (not in local contacts)" },
      { id: "M1", name: "DMARC / SPF Posture", status: "FAILED", delta: "-15", note: "SPF softfail and DMARC alignment failure" },
      { id: "M2", name: "Domain RDAP Intel", status: "FAILED", delta: "-20", note: "Domain registered 4 days ago on Namecheap" },
      { id: "M3", name: "Unicode UTS #39 Engine", status: "INTERCEPTED", delta: "-25", note: "Detected Cyrillic 'а' (U+0430) masquerading as Latin 'a'" },
      { id: "M4", name: "On-Device ML Classifier", status: "INTERCEPTED", delta: "-12", note: "High urgency cue score (24-hour suspension threat)" },
      { id: "M5", name: "Proof-of-Action Assurance", status: "BLOCKED", delta: "QUARANTINE", note: "Refused authorization for credential submission" }
    ],
    verdict: "QUARANTINE",
    verdictColor: "bg-rose/20 text-rose border-rose/50",
    actionDecision: "BLOCKED",
    passport: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  },
  {
    id: "bec",
    level: "HIGH · LEVEL 4",
    levelColor: "text-amber bg-amber/10 border-amber/40",
    title: "Executive BEC (Wire Payment Diversion)",
    sender: "cfo-office@consulting-group.net",
    displayName: "Robert Chen (CFO)",
    subject: "Revised Wire Transfer Instructions for Vendor Milestone 3",
    body: "Hi team, please find our updated bank account routing instructions for today's remittance. Our primary account is under statutory audit. Do not delay wire transfer.",
    attackVector: "Executive Display-Name Impersonation + Banking Account Diversion",
    targetScore: 22,
    shields: [
      { id: "M0", name: "Sender Whitelist", status: "FAILED", delta: "-0", note: "First-time observed address from external domain" },
      { id: "M1", name: "DMARC / SPF Posture", status: "FAILED", delta: "-25", note: "Display-name claimed CFO but Reply-To diverted externally" },
      { id: "M2", name: "Domain RDAP Intel", status: "FAILED", delta: "-15", note: "Newly observed domain registered 12 days ago" },
      { id: "M3", name: "Unicode UTS #39 Engine", status: "PASSED", delta: "-0", note: "Clean ASCII characters" },
      { id: "M4", name: "On-Device ML Classifier", status: "INTERCEPTED", delta: "-10", note: "High financial pressure and payment rerouting rhetoric" },
      { id: "M5", name: "Proof-of-Action Assurance", status: "BLOCKED", delta: "QUARANTINE", note: "Financial wire change blocked without out-of-band identity confirmation" }
    ],
    verdict: "QUARANTINE",
    verdictColor: "bg-rose/20 text-rose border-rose/50",
    actionDecision: "BLOCKED",
    passport: "sha256:4a88b22a01538fc6f272a56767576a89476fc323211ddf4e3c3111f26a7e0892"
  },
  {
    id: "trojan",
    level: "CRITICAL · LEVEL 5",
    levelColor: "text-rose bg-rose/10 border-rose/40",
    title: "Malware Double Extension (Invoice_INV-8890.pdf.exe)",
    sender: "billing@freight-logistics-fast.org",
    displayName: "Global Freight Billing",
    subject: "OVERDUE INVOICE INV-8890 - Legal Action Pending",
    body: "Please review the attached statement immediately to avoid legal summons and immediate penalty charges.",
    attackVector: "Decoy Double Extension (.pdf.exe) + Coercive Legal Language",
    targetScore: 18,
    shields: [
      { id: "M0", name: "Sender Whitelist", status: "FAILED", delta: "-0", note: "Unrecognized sender" },
      { id: "M1", name: "DMARC / SPF Posture", status: "FAILED", delta: "-20", note: "No SPF record published (Cloudflare DoH lookup)" },
      { id: "M2", name: "Domain RDAP Intel", status: "FAILED", delta: "-15", note: "Domain age 18 days" },
      { id: "M3", name: "Unicode UTS #39 Engine", status: "PASSED", delta: "-0", note: "Clean ASCII" },
      { id: "M4", name: "Attachment Scanner", status: "INTERCEPTED", delta: "-35", note: "Dangerous double-extension (.pdf.exe executable payload)" },
      { id: "M5", name: "Proof-of-Action Assurance", status: "BLOCKED", delta: "QUARANTINE", note: "Executable download quarantined before execution" }
    ],
    verdict: "QUARANTINE",
    verdictColor: "bg-rose/20 text-rose border-rose/50",
    actionDecision: "BLOCKED",
    passport: "sha256:8890cdba77ef621b191a32ffba89012a67bc4539871100234aefd882190bcda1"
  },
  {
    id: "clean",
    level: "SAFE · LEVEL 0",
    levelColor: "text-mint bg-mint/10 border-mint/40",
    title: "Legitimate Notion Team Update (Clean RFC 5322)",
    sender: "mail@notion.so",
    displayName: "Notion",
    subject: "3 comments mention you in SIH 2026 Strategy",
    body: "Your team members have left feedback in the project document. Click below to view the latest revisions.",
    attackVector: "Benign Transactional Notification · Verified Cryptographic Identity",
    targetScore: 100,
    shields: [
      { id: "M0", name: "Sender Whitelist", status: "PASSED", delta: "+0", note: "Known trusted contact in local address history" },
      { id: "M1", name: "DMARC / SPF Posture", status: "PASSED", delta: "+0", note: "100% SPF pass, DKIM RSA-2048 valid, DMARC aligned" },
      { id: "M2", name: "Domain RDAP Intel", status: "PASSED", delta: "+0", note: "Established domain registered 10+ years ago" },
      { id: "M3", name: "Unicode UTS #39 Engine", status: "PASSED", delta: "+0", note: "Standard Latin ASCII script" },
      { id: "M4", name: "On-Device ML Classifier", status: "PASSED", delta: "+0", note: "Clean collaborative language tone" },
      { id: "M5", name: "Proof-of-Action Assurance", status: "ALLOWED", delta: "ALLOWED", note: "Standard informational read operation allowed" }
    ],
    verdict: "SAFE_INBOX",
    verdictColor: "bg-mint/20 text-mint border-mint/50",
    actionDecision: "ALLOWED",
    passport: "sha256:aa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbb"
  }
];

export function ThreatDetonationChamber() {
  const [activeScenario, setActiveScenario] = useState(ATTACK_SCENARIOS[0]);
  const [isFiring, setIsFiring] = useState(false);
  const [activeShieldIdx, setActiveShieldIdx] = useState(6);
  const [displayScore, setDisplayScore] = useState(ATTACK_SCENARIOS[0].targetScore);

  // Trigger detonation simulation animation
  const detonateAttack = (scenario = activeScenario) => {
    setIsFiring(true);
    setActiveShieldIdx(-1);
    setDisplayScore(100);

    let step = 0;
    const interval = setInterval(() => {
      setActiveShieldIdx(step);
      step++;

      // Animate score dropping
      const progress = step / scenario.shields.length;
      const currentScore = Math.round(100 - progress * (100 - scenario.targetScore));
      setDisplayScore(currentScore);

      if (step >= scenario.shields.length) {
        clearInterval(interval);
        setIsFiring(false);
        setDisplayScore(scenario.targetScore);
      }
    }, 280);
  };

  const selectScenario = (s) => {
    setActiveScenario(s);
    detonateAttack(s);
  };

  return (
    <div className="bg-panel border border-mint/40 rounded-xl p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-2xl">
      {/* Cyber Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-mint/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mono text-xs text-mint uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            LIVE ON-DEVICE INTERCEPT ENGINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Live Phishing Detonation Chamber
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-1 max-w-xl">
            Simulate weaponized email attacks against A.E.G.I.S. in real time. Watch all 6 deterministic membranes fire sequentially without leaking data to the cloud.
          </p>
        </div>

        <button
          onClick={() => detonateAttack()}
          disabled={isFiring}
          className="bg-mint text-ink font-bold px-5 py-2.5 rounded-md text-xs flex items-center gap-2 hover:bg-mintdim active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <span className={`w-2 h-2 rounded-full ${isFiring ? "bg-rose animate-ping" : "bg-ink"}`} />
          {isFiring ? "MEMBRANES INTERCEPTING..." : "💥 DETONATE ATTACK NOW"}
        </button>
      </div>

      {/* Scenario Selector Pills */}
      <div className="space-y-2 relative z-10">
        <div className="mono text-[10px] text-muted uppercase tracking-wider">Select Attack Scenario:</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {ATTACK_SCENARIOS.map((s) => {
            const isSelected = activeScenario.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => selectScenario(s)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? "bg-panel2 border-mint shadow-md"
                    : "bg-panel2/60 border-line hover:border-mint/50 hover:bg-panel2"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`mono text-[9px] px-2 py-0.5 rounded font-bold border ${s.levelColor}`}>
                    {s.level}
                  </span>
                  <span className="mono text-xs font-bold text-white">{s.targetScore} pts</span>
                </div>
                <div className="font-semibold text-xs text-white leading-snug line-clamp-2">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Detonation Chamber Core */}
      <div className="grid lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* Left: Email Under Inspection */}
        <div className="lg:col-span-5 bg-panel2 border border-line rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="mono text-[11px] text-muted uppercase">Incoming Mail Envelope</span>
            <span className="mono text-[10px] text-mint">100% Client-Side</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="mono text-[10px] text-muted block">DISPLAY NAME:</span>
              <span className="text-white font-semibold">{activeScenario.displayName}</span>
            </div>
            <div>
              <span className="mono text-[10px] text-muted block">SENDER ADDRESS:</span>
              <span className="mono text-mint font-medium">{activeScenario.sender}</span>
            </div>
            <div>
              <span className="mono text-[10px] text-muted block">SUBJECT:</span>
              <span className="text-white font-medium">{activeScenario.subject}</span>
            </div>
            <div className="bg-panel p-3 rounded border border-line">
              <span className="mono text-[10px] text-muted block mb-1">BODY PAYLOAD:</span>
              <p className="text-muted leading-relaxed text-[11px] font-sans">{activeScenario.body}</p>
            </div>
            <div className="mono text-[10px] bg-rose/10 border border-rose/30 text-rose p-2.5 rounded">
              <span className="font-bold">ATTACK SIGNATURE: </span>
              {activeScenario.attackVector}
            </div>
          </div>
        </div>

        {/* Right: 6-Layer Shield Laser Intercept Waterfall */}
        <div className="lg:col-span-7 bg-panel2 border border-line rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="mono text-[11px] text-white font-semibold uppercase">
                Sequential Membrane Intercept Defense
              </span>
              {isFiring && (
                <span className="mono text-[9px] bg-rose/20 text-rose px-2 py-0.5 rounded border border-rose/40 animate-pulse">
                  ACTIVE DETONATION
                </span>
              )}
            </div>

            {/* Live Trust Score Meter */}
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] text-muted">COMPUTED TRUST:</span>
              <span className={`text-xl font-bold mono ${
                displayScore >= 80 ? "text-mint" : displayScore >= 40 ? "text-amber" : "text-rose"
              }`}>
                {displayScore} / 100
              </span>
            </div>
          </div>

          {/* 6 Sequential Shields */}
          <div className="space-y-2.5">
            {activeScenario.shields.map((shield, i) => {
              const hasFired = i <= activeShieldIdx;
              const isCurrent = i === activeShieldIdx;
              const isIntercept = shield.status === "INTERCEPTED" || shield.status === "BLOCKED";
              const isPassed = shield.status === "PASSED";

              return (
                <div
                  key={shield.id}
                  className={`p-3 rounded-md border transition-all flex items-center justify-between gap-3 text-xs ${
                    !hasFired
                      ? "opacity-30 bg-panel border-line"
                      : isCurrent
                      ? "bg-panel2 border-mint shadow-md animate-pulse-soft scale-[1.01]"
                      : isIntercept
                      ? "bg-rose/10 border-rose/40 text-white"
                      : isPassed
                      ? "bg-mint/10 border-mint/40 text-white"
                      : "bg-panel border-line text-muted"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`mono text-xs font-bold w-7 text-center shrink-0 ${
                      hasFired && isIntercept ? "text-rose" : hasFired && isPassed ? "text-mint" : "text-muted"
                    }`}>
                      {shield.id}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate flex items-center gap-2">
                        <span>{shield.name}</span>
                        {hasFired && (
                          <span className={`mono text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            isIntercept ? "bg-rose text-ink" : isPassed ? "bg-mint text-ink" : "bg-line text-muted"
                          }`}>
                            {shield.status}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted truncate mt-0.5">{shield.note}</div>
                    </div>
                  </div>

                  <span className={`mono font-bold shrink-0 text-xs ${
                    shield.delta.startsWith("-") ? "text-rose" : shield.delta === "QUARANTINE" ? "text-rose" : "text-mint"
                  }`}>
                    {shield.delta}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Final Verdict & Proof-of-Action Decision Banner */}
          <div className="pt-3 border-t border-line flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="mono text-[10px] text-muted block uppercase">FINAL VERDICT &amp; ACTION ASSURANCE:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`mono text-xs font-bold px-3 py-1 rounded border ${activeScenario.verdictColor}`}>
                  {activeScenario.verdict}
                </span>
                <span className="mono text-xs text-white">
                  Action: <strong className="text-rose">{activeScenario.actionDecision}</strong>
                </span>
              </div>
            </div>

            <div className="mono text-[10px] text-muted text-right truncate max-w-xs">
              <span className="block text-mint">AUTHENTICATED PASSPORT:</span>
              <span className="truncate block">{activeScenario.passport.slice(0, 24)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
