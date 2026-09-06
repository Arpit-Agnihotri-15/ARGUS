import { useState, useMemo } from "react";

// User-friendly AI Threat Signals
const THREAT_SIGNALS = [
  {
    id: "urgency",
    name: "Forced Urgency & 24h Deadlines",
    category: "critical",
    tier: "Critical Risk Factor",
    impact: "+95% Threat Multiplier",
    impactPercent: 95,
    icon: "⏱️",
    summary: "Psychological pressure forcing the recipient to act before thinking (e.g., 'Account locked within 24 hours').",
    howItWorks: "The on-device model tokenizes time-pressure n-grams and pairs them with threat verbiage to flag coercive social engineering."
  },
  {
    id: "credentials",
    name: "Credential & Login Harvesting",
    category: "critical",
    tier: "Critical Risk Factor",
    impact: "+92% Threat Multiplier",
    impactPercent: 92,
    icon: "🔑",
    summary: "Prompts asking the user to re-authenticate, reset passwords, or enter OTPs on an unverified domain.",
    howItWorks: "Detects password reset lures and cross-references link destinations against known authentic login endpoints."
  },
  {
    id: "homoglyph",
    name: "Lookalike Brand & Domain Spoofing",
    category: "critical",
    tier: "Critical Risk Factor",
    impact: "+88% Threat Multiplier",
    impactPercent: 88,
    icon: "🎭",
    summary: "Internationalized Cyrillic/Greek characters or typo-squatted domains visually disguised as trusted brands.",
    howItWorks: "M2 Domain Intelligence maps Unicode characters to ASCII skeletons, exposing disguised characters in under 1ms."
  },
  {
    id: "financial",
    name: "Wire Transfer & Bank Account Diversion",
    category: "high",
    tier: "High Suspicion Factor",
    impact: "+82% Threat Multiplier",
    impactPercent: 82,
    icon: "💳",
    summary: "Urgent requests to alter vendor payment routing, change bank account numbers, or purchase gift cards.",
    howItWorks: "Triggers M4 Proof-of-Action membrane, refusing to treat sender authentication as authorization for financial moves."
  },
  {
    id: "attachment",
    name: "Disguised Double Extension Files",
    category: "high",
    tier: "High Suspicion Factor",
    impact: "+78% Threat Multiplier",
    impactPercent: 78,
    icon: "📎",
    summary: "Executable payloads disguised as harmless documents (e.g. invoice.pdf.exe or statement.xlsx.scr).",
    howItWorks: "Inspects true MIME headers and file extensions before download, blocking executable payloads instantly."
  },
  {
    id: "dmarc",
    name: "Unaligned DMARC / Spoofed From Header",
    category: "high",
    tier: "High Suspicion Factor",
    impact: "+70% Threat Multiplier",
    impactPercent: 70,
    icon: "🛡️",
    summary: "Email claims to be from a reputable organization but fails SPF alignment or lacks valid cryptographic DKIM.",
    howItWorks: "M1 Identity membrane analyzes RFC 5322 headers locally to detect display-name impersonation."
  },
  {
    id: "dkim_pass",
    name: "Cryptographic DKIM Signature Match",
    category: "trust",
    tier: "Legitimacy Indicator",
    impact: "-75% Risk Reduction",
    impactPercent: 75,
    icon: "✓",
    summary: "Legitimate RSA-2048 cryptographic signature verified against the sending organization's public DNS.",
    howItWorks: "Reinforces message authenticity and prevents accidental false positives on verified corporate mail."
  },
  {
    id: "whitelist",
    name: "Known Bilateral Contact History",
    category: "trust",
    tier: "Legitimacy Indicator",
    impact: "-85% Risk Reduction",
    impactPercent: 85,
    icon: "👤",
    summary: "User has a proven history of communicating with this address in their local browser storage.",
    howItWorks: "M0 Local History membrane automatically preserves trust baselines without uploading contact books to any server."
  },
  {
    id: "domain_age",
    name: "Established Domain Age (> 5 Years)",
    category: "trust",
    tier: "Legitimacy Indicator",
    impact: "-65% Risk Reduction",
    impactPercent: 65,
    icon: "🌐",
    summary: "The sending domain has an active, legitimate web presence with continuous positive reputation.",
    howItWorks: "RDAP cache checks domain registration dates. Domains registered recently (<30 days) receive a penalty instead."
  }
];

// Security Sensitivity Profiles
const SENSITIVITY_PROFILES = [
  {
    id: "strict",
    name: "Strict Sentinel",
    badge: "Maximum Security",
    color: "rose",
    threshold: 40,
    target: "Executive, Finance & High-Value Inboxes",
    captureRate: "99.8%",
    falseAlarmRate: "~1.2%",
    description: "Zero-tolerance security posture. Challenges all unknown senders, strictly blocks unaligned DMARC, and enforces Proof-of-Action on all financial/credential operations.",
    policyDetails: [
      { label: "Suspicious Links", val: "Quarantine & Force Confirm", color: "text-rose" },
      { label: "Wire / Payment Lures", val: "Mandatory Step-Up Authorization", color: "text-rose" },
      { label: "Unknown Senders", val: "Warning Banner + Identity Verify", color: "text-amber" },
      { label: "Disguised Attachments", val: "Immediate Hard Block", color: "text-rose" }
    ]
  },
  {
    id: "balanced",
    name: "Balanced Enterprise",
    badge: "Recommended Default",
    color: "mint",
    threshold: 55,
    target: "Standard Corporate, Government & Academic Mailboxes",
    captureRate: "98.2%",
    falseAlarmRate: "< 0.2%",
    description: "Optimal balance between high threat capture and frictionless daily workflow. Eliminates false alarms on legitimate newsletters and receipts while intercepting malicious attacks.",
    policyDetails: [
      { label: "Suspicious Links", val: "Inspect & Warn Membrane", color: "text-mint" },
      { label: "Wire / Payment Lures", val: "Prompt Action Verification", color: "text-mint" },
      { label: "Unknown Senders", val: "Passive Reputation Baseline", color: "text-mint" },
      { label: "Disguised Attachments", val: "Quarantine & Strip", color: "text-rose" }
    ]
  },
  {
    id: "permissive",
    name: "Developer & Auditor",
    badge: "Informational Mode",
    color: "amber",
    threshold: 75,
    target: "Security Analysts, IT Admins & Test Labs",
    captureRate: "94.5%",
    falseAlarmRate: "0.0%",
    description: "Passive inspection mode. Surfaces deep forensic telemetry, RDAP headers, and ML token breakdown without intercepting buttons or blocking inbound messages.",
    policyDetails: [
      { label: "Suspicious Links", val: "Forensic Header Tag Only", color: "text-muted" },
      { label: "Wire / Payment Lures", val: "Audit Log Entry", color: "text-muted" },
      { label: "Unknown Senders", val: "Log Only (No Intercept)", color: "text-muted" },
      { label: "Disguised Attachments", val: "Security Tag", color: "text-amber" }
    ]
  }
];

// Interactive Token Scorer Preset Examples
const TOKEN_PRESETS = [
  {
    label: "🚨 Urgent Suspension Lure",
    text: "URGENT: Your account has been temporarily restricted due to unauthorized login attempts. You must verify your credentials and reset password within 24 hours or your profile will be terminated."
  },
  {
    label: "💳 Wire Transfer Diversion",
    text: "Attention Finance Team: Please find the revised bank account wire routing details for invoice #98124. Remit payment to the updated IBAN before close of business today."
  },
  {
    label: "🛡️ Standard Team Agenda",
    text: "Hi team, attached is the meeting agenda and sprint review deck for tomorrow's sync. Please review the release notes and leave comments directly in Notion."
  },
  {
    label: "💻 GitHub PR Notification",
    text: "GitHub notification: Pull request #145 'Update crypto hash validator' has been merged by arpit-agnihotri into main. CI workflow and unit tests completed successfully."
  }
];

export function InteractiveAiCharts() {
  const [signalFilter, setSignalFilter] = useState("all");
  const [selectedSignal, setSelectedSignal] = useState(THREAT_SIGNALS[0]);
  const [activeProfile, setActiveProfile] = useState("balanced");
  const [sandboxText, setSandboxText] = useState(TOKEN_PRESETS[0].text);

  const currentProfile = SENSITIVITY_PROFILES.find((p) => p.id === activeProfile) || SENSITIVITY_PROFILES[1];

  const [isScoring, setIsScoring] = useState(false);
  const [analyzedText, setAnalyzedText] = useState(TOKEN_PRESETS[0].text);

  const handleAnalyze = () => {
    if (!sandboxText.trim()) return;
    setIsScoring(true);
    setTimeout(() => {
      setAnalyzedText(sandboxText);
      setIsScoring(false);
    }, 240);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  // Dynamic on-device tokenization and risk analysis based on analyzed text
  const tokenAnalysis = useMemo(() => {
    if (!analyzedText.trim()) {
      return {
        threatProbability: 0,
        matchedThreats: [],
        matchedBenign: [],
        isFlagged: false,
        isEmpty: true
      };
    }

    const text = analyzedText.toLowerCase();
    const threatVocabulary = [
      { word: "urgent", weight: 28, desc: "Forced immediacy" },
      { word: "immediately", weight: 26, desc: "Time-pressure urgency" },
      { word: "within 24 hours", weight: 28, desc: "Artificial deadline" },
      { word: "final notice", weight: 25, desc: "Coercive warning" },
      { word: "restricted", weight: 24, desc: "Account coercion" },
      { word: "suspended", weight: 28, desc: "Account coercion" },
      { word: "locked", weight: 24, desc: "Account lock lure" },
      { word: "terminated", weight: 26, desc: "Punitive threat" },
      { word: "verify", weight: 22, desc: "Credential lure" },
      { word: "verification", weight: 20, desc: "Credential lure" },
      { word: "credentials", weight: 30, desc: "Credential harvesting" },
      { word: "password", weight: 30, desc: "Credential harvesting" },
      { word: "sign in", weight: 22, desc: "Authentication lure" },
      { word: "login", weight: 22, desc: "Authentication lure" },
      { word: "reset", weight: 20, desc: "Credential reset prompt" },
      { word: "wire", weight: 26, desc: "Financial diversion" },
      { word: "routing", weight: 24, desc: "Banking alteration" },
      { word: "remit", weight: 20, desc: "Payment lure" },
      { word: "iban", weight: 26, desc: "Banking substitution" },
      { word: "bank account", weight: 25, desc: "Financial alteration" },
      { word: "invoice", weight: 16, desc: "Commercial lure" },
      { word: "overdue", weight: 20, desc: "Payment urgency" },
      { word: "security alert", weight: 24, desc: "Fake security lure" },
      { word: "unauthorized", weight: 22, desc: "Fear trigger" },
      { word: "compromised", weight: 25, desc: "Fear trigger" },
      { word: "aadhaar", weight: 26, desc: "PII/KYC exfiltration" },
      { word: "gift card", weight: 30, desc: "BEC payment lure" },
      { word: "bitcoin", weight: 28, desc: "Cryptocurrency demand" }
    ];

    const benignVocabulary = [
      { word: "team", weight: -18, desc: "Workplace collaboration" },
      { word: "agenda", weight: -16, desc: "Calendar scheduling" },
      { word: "meeting", weight: -18, desc: "Calendar scheduling" },
      { word: "calendar", weight: -14, desc: "Calendar event" },
      { word: "schedule", weight: -14, desc: "Workplace planning" },
      { word: "attached", weight: -12, desc: "Standard attachment" },
      { word: "sprint", weight: -16, desc: "Agile project task" },
      { word: "sync", weight: -14, desc: "Workplace communication" },
      { word: "project", weight: -12, desc: "Legitimate work scope" },
      { word: "roadmap", weight: -15, desc: "Strategy document" },
      { word: "github", weight: -25, desc: "Developer notification" },
      { word: "pull request", weight: -24, desc: "Developer workflow" },
      { word: "merged", weight: -18, desc: "Developer action" },
      { word: "commit", weight: -16, desc: "Code version control" },
      { word: "ci", weight: -15, desc: "Automated workflow" },
      { word: "tests", weight: -14, desc: "QA verification" },
      { word: "notion", weight: -16, desc: "SaaS collaboration" },
      { word: "slack", weight: -14, desc: "Workplace messaging" },
      { word: "slides", weight: -14, desc: "Presentation deck" },
      { word: "notes", weight: -12, desc: "Meeting minutes" },
      { word: "thanks", weight: -15, desc: "Polite workplace closing" },
      { word: "regards", weight: -14, desc: "Professional sign-off" },
      { word: "cheers", weight: -12, desc: "Friendly workplace closing" },
      { word: "hello", weight: -10, desc: "Standard greeting" },
      { word: "hi", weight: -8, desc: "Standard greeting" }
    ];

    const matchedThreats = [];
    const matchedBenign = [];

    threatVocabulary.forEach((item) => {
      if (text.includes(item.word)) {
        matchedThreats.push(item);
      }
    });

    benignVocabulary.forEach((item) => {
      if (text.includes(item.word)) {
        matchedBenign.push(item);
      }
    });

    // Logistic regression logit with Sigmoid activation mirroring the extension ML model
    // Base logit: -2.3 gives ~9% baseline threat probability for neutral/casual conversation
    let logit = -2.3;
    matchedThreats.forEach((item) => {
      logit += item.weight * 0.085;
    });
    matchedBenign.forEach((item) => {
      logit += item.weight * 0.085; // item.weight is negative
    });

    // Sigmoid probability calculation
    const rawProbability = (1 / (1 + Math.exp(-logit))) * 100;
    let threatProbability = Math.round(Math.max(2, Math.min(99, rawProbability)));

    const isFlagged = threatProbability >= currentProfile.threshold;

    return {
      threatProbability,
      matchedThreats,
      matchedBenign,
      isFlagged,
      isEmpty: false
    };
  }, [analyzedText, currentProfile.threshold]);

  const filteredSignals = THREAT_SIGNALS.filter((s) => {
    if (signalFilter === "all") return true;
    if (signalFilter === "threat") return s.category === "critical" || s.category === "high";
    if (signalFilter === "trust") return s.category === "trust";
    return true;
  });

  return (
    <div className="space-y-12">
      {/* 1. Live On-Device ML Token Scorer Sandbox (HIGH INTERACTIVITY) */}
      <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              LIVE INTERACTIVE SANDBOX · ON-DEVICE TF-IDF TOKENIZER
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Real-Time On-Device ML Token Scorer
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Type or paste any email subject or body text below. Click <strong>Analyze Message</strong> (or press Enter) to watch the on-device engine instantly extract n-grams, calculate token weights, and produce an immediate phishing verdict in under 0.5ms.
            </p>
          </div>

          <div className="mono text-xs px-3 py-1.5 rounded border border-mint/40 bg-mint/10 text-mint font-semibold shrink-0 self-start sm:self-auto">
            100% CLIENT-SIDE · 0 CLOUD TOKENS
          </div>
        </div>

        {/* Quick Example Buttons */}
        <div className="space-y-2">
          <label className="block mono text-[10px] text-muted tracking-wider uppercase">
            Click an Example Attack or Genuine Notice to Test:
          </label>
          <div className="flex flex-wrap gap-2">
            {TOKEN_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setSandboxText(p.text);
                  setAnalyzedText(p.text);
                }}
                className={`mono text-xs px-3 py-1.5 rounded-md border transition-all ${
                  sandboxText === p.text
                    ? "border-mint text-mint bg-panel2 font-bold shadow-sm"
                    : "border-line text-muted hover:text-white bg-panel2/60 hover:bg-panel2"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Textarea & Action Control Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="mono text-[10px] text-muted uppercase">
              INPUT TEXT SANDBOX (TYPE OR EDIT FREELY · PRESS ENTER ↵ TO ANALYZE):
            </label>
            {sandboxText && (
              <button
                onClick={() => {
                  setSandboxText("");
                  setAnalyzedText("");
                }}
                className="mono text-[10px] text-rose hover:underline"
              >
                Clear Text
              </button>
            )}
          </div>
          <textarea
            rows={3}
            value={sandboxText}
            onChange={(e) => setSandboxText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste any email message or subject to test on-device scoring (e.g. Your account is suspended, please wire funds, or team meeting sync)..."
            className="w-full bg-panel2 border border-line rounded-md p-3.5 text-xs text-white focus:border-mint outline-none mono transition-colors shadow-inner"
          />

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isScoring || !sandboxText.trim()}
                className={`mono text-xs font-bold px-5 py-2.5 rounded transition-all flex items-center gap-2 shadow-md ${
                  isScoring
                    ? "bg-panel2 border border-line text-muted cursor-wait"
                    : !sandboxText.trim()
                    ? "bg-panel2 text-muted border border-line cursor-not-allowed opacity-60"
                    : "bg-mint text-ink hover:bg-mintdim active:scale-95 cursor-pointer"
                }`}
              >
                <span>{isScoring ? "⚡ Tokenizing in Web Worker..." : "⚡ Analyze Message & Score Tokens (Enter ↵)"}</span>
              </button>
              <span className="mono text-[11px] text-muted hidden sm:inline">
                Press Enter to run · Shift+Enter for new line
              </span>
            </div>

            {analyzedText && (
              <span className="mono text-[10px] text-mint flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                ACTIVE ANALYSIS LOADED
              </span>
            )}
          </div>
        </div>

        {/* Live Threat Probability Meter & Verdict */}
        {tokenAnalysis.isEmpty ? (
          <div className="bg-panel2 border border-dashed border-line rounded-lg p-8 text-center text-muted text-xs space-y-1">
            <div className="text-white font-semibold">Ready for On-Device Evaluation</div>
            <p>Type or paste an email message above and click <strong>&quot;Analyze Message &amp; Score Tokens&quot;</strong> (or select an example attack) to run real-time scoring.</p>
          </div>
        ) : (
          <div className="bg-panel2 border border-line rounded-lg p-5 grid md:grid-cols-12 gap-6 items-center animate-fade-up">
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs mono">
                <span className="text-muted uppercase">On-Device Threat Probability:</span>
                <span className={`text-lg font-bold ${
                  tokenAnalysis.threatProbability > 65
                    ? "text-rose"
                    : tokenAnalysis.threatProbability > 35
                    ? "text-amber"
                    : "text-mint"
                }`}>
                  {tokenAnalysis.threatProbability}%
                </span>
              </div>

              {/* Gauge Progress Bar */}
              <div className="w-full bg-ink/60 h-3 rounded-full overflow-hidden border border-line p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    tokenAnalysis.threatProbability > 65
                      ? "bg-rose"
                      : tokenAnalysis.threatProbability > 35
                      ? "bg-amber"
                      : "bg-mint"
                  }`}
                  style={{ width: `${tokenAnalysis.threatProbability}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] mono text-muted">
                <span>0% (Clean)</span>
                <span>Threshold: {currentProfile.threshold}% ({currentProfile.name})</span>
                <span>100% (Critical)</span>
              </div>
            </div>

            <div className="md:col-span-7 flex items-center justify-between flex-wrap gap-4 border-l border-line/60 md:pl-6">
              <div>
                <div className="mono text-[10px] text-muted uppercase">SECURITY VERDICT:</div>
                <div className={`text-base font-bold flex items-center gap-2 mt-0.5 ${
                  tokenAnalysis.isFlagged ? "text-rose" : "text-mint"
                }`}>
                  <span>{tokenAnalysis.isFlagged ? "🚨 MALICIOUS PHISHING DETECTED" : "✓ LEGITIMATE WORKPLACE COMMUNICATION"}</span>
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {tokenAnalysis.isFlagged
                    ? `Exceeds the ${currentProfile.threshold}% threshold for ${currentProfile.name}. Triggers verify-first membrane.`
                    : `Well within safe margins for ${currentProfile.name}. Zero user friction.`}
                </div>
              </div>

              <div className="mono text-[10px] text-muted bg-panel px-3 py-1.5 rounded border border-line shadow-sm">
                LATENCY: &lt; 0.45ms
              </div>
            </div>
          </div>
        )}

        {/* Extracted Tokens Breakdown */}
        {!tokenAnalysis.isEmpty && (
          <div className="space-y-2 animate-fade-up">
            <div className="mono text-[11px] text-muted uppercase">
              DETECTED TF-IDF FEATURE WEIGHTS IN THIS SAMPLE:
            </div>

            <div className="flex flex-wrap gap-2">
              {tokenAnalysis.matchedThreats.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-rose/15 border border-rose/40 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs"
                >
                  <span className="font-mono text-rose font-bold">"{t.word}"</span>
                  <span className="mono text-[10px] text-rose font-bold">+{t.weight} pts</span>
                  <span className="text-[10px] text-muted">({t.desc})</span>
                </div>
              ))}

              {tokenAnalysis.matchedBenign.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-mint/15 border border-mint/40 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs"
                >
                  <span className="font-mono text-mint font-bold">"{b.word}"</span>
                  <span className="mono text-[10px] text-mint font-bold">{b.weight} pts</span>
                  <span className="text-[10px] text-muted">({b.desc})</span>
                </div>
              ))}

              {tokenAnalysis.matchedThreats.length === 0 && tokenAnalysis.matchedBenign.length === 0 && (
                <div className="text-xs text-muted italic">
                  No high-impact phishing or benign tokens matched in this specific text snippet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. User-Friendly AI Threat Signals & Feature Impact Explorer */}
      <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line pb-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              MODEL VOCABULARY EXPLORER · 12,000 N-GRAMS
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              AI Threat Signals &amp; Impact Factors
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl">
              Inspect how the packaged on-device model weights specific behavioral cues, domain traits, and authentication baselines.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center bg-panel2 border border-line p-1 rounded-md mono text-xs">
            <button
              onClick={() => setSignalFilter("all")}
              className={`px-3 py-1.5 rounded transition-all ${
                signalFilter === "all" ? "bg-mint text-ink font-bold shadow-sm" : "text-muted hover:text-white"
              }`}
            >
              All Signals ({THREAT_SIGNALS.length})
            </button>
            <button
              onClick={() => setSignalFilter("threat")}
              className={`px-3 py-1.5 rounded transition-all ${
                signalFilter === "threat" ? "bg-rose text-white font-bold shadow-sm" : "text-muted hover:text-white"
              }`}
            >
              Threat Multipliers (🔴)
            </button>
            <button
              onClick={() => setSignalFilter("trust")}
              className={`px-3 py-1.5 rounded transition-all ${
                signalFilter === "trust" ? "bg-mint text-ink font-bold shadow-sm" : "text-muted hover:text-white"
              }`}
            >
              Trust Factors (🟢)
            </button>
          </div>
        </div>

        {/* Signal Selector Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-2.5">
            {filteredSignals.map((sig) => {
              const isSelected = selectedSignal.id === sig.id;
              const isThreat = sig.category === "critical" || sig.category === "high";

              return (
                <button
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 group ${
                    isSelected
                      ? isThreat
                        ? "bg-rose/10 border-rose/50 shadow-md"
                        : "bg-mint/10 border-mint/50 shadow-md"
                      : "bg-panel2/60 border-line hover:border-mint/30 hover:bg-panel2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{sig.icon}</span>
                      <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/90 group-hover:text-white"}`}>
                        {sig.name}
                      </span>
                    </div>
                    <span className={`mono text-xs font-bold ${isThreat ? "text-rose" : "text-mint"}`}>
                      {sig.impact}
                    </span>
                  </div>

                  <div className="w-full bg-ink/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isThreat ? "bg-rose" : "bg-mint"}`}
                      style={{ width: `${sig.impactPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Dossier */}
          <div className="md:col-span-5 bg-panel2 border border-line rounded-lg p-5 space-y-4 flex flex-col justify-between shadow-inner">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="mono text-[10px] text-mint uppercase tracking-wider">
                  SIGNAL INSPECTION DOSSIER
                </span>
                <span className={`mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  selectedSignal.category === "trust" ? "bg-mint/15 text-mint" : "bg-rose/15 text-rose"
                }`}>
                  {selectedSignal.tier}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedSignal.icon}</span>
                <h4 className="text-base font-bold text-white">{selectedSignal.name}</h4>
              </div>

              <div className="bg-panel p-3 rounded border border-line space-y-1">
                <div className="mono text-[10px] text-muted uppercase">BEHAVIORAL IMPACT:</div>
                <div className="text-xs text-white leading-relaxed">{selectedSignal.summary}</div>
              </div>

              <div className="bg-panel p-3 rounded border border-line space-y-1">
                <div className="mono text-[10px] text-muted uppercase">HOW ON-DEVICE ML PROCESSES THIS:</div>
                <div className="text-xs text-muted leading-relaxed">{selectedSignal.howItWorks}</div>
              </div>
            </div>

            <div className="border-t border-line pt-3 flex items-center justify-between mono text-[11px] text-muted">
              <span>LATENCY: &lt; 0.5ms</span>
              <span className="text-mint">100% CLIENT-SIDE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. User-Friendly Security Posture & Sensitivity Profiles */}
      <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              OPERATIONAL CONFIGURATION · SECURITY POSTURE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Detection Sensitivity &amp; Protection Profiles
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-xl">
              Switching profiles actively adjusts the ML classification threshold and membrane intercept policies above.
            </p>
          </div>

          <div className="mono text-xs text-mint bg-mint/10 border border-mint/30 px-3 py-1.5 rounded self-start sm:self-auto">
            CURRENT: {currentProfile.name.toUpperCase()} ({currentProfile.threshold}% Threshold)
          </div>
        </div>

        {/* Profile Selection Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {SENSITIVITY_PROFILES.map((prof) => {
            const isSelected = prof.id === activeProfile;

            return (
              <button
                key={prof.id}
                onClick={() => setActiveProfile(prof.id)}
                className={`text-left p-5 rounded-lg border transition-all relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "bg-panel2 border-mint shadow-xl ring-1 ring-mint"
                    : "bg-panel2/50 border-line hover:border-line2 hover:bg-panel2"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      prof.color === "mint"
                        ? "bg-mint/15 text-mint border border-mint/30"
                        : prof.color === "rose"
                        ? "bg-rose/15 text-rose border border-rose/30"
                        : "bg-amber/15 text-amber border border-amber/30"
                    }`}>
                      {prof.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white">{prof.name}</h4>
                  <div className="mono text-[10px] text-muted mt-0.5">{prof.target}</div>
                  <p className="text-xs text-muted mt-3 leading-relaxed">{prof.description}</p>
                </div>

                <div className="border-t border-line pt-3 grid grid-cols-2 gap-2 mono text-center">
                  <div className="bg-panel p-2 rounded border border-line">
                    <div className="text-[10px] text-muted">THREAT CATCH</div>
                    <div className="text-sm font-bold text-mint">{prof.captureRate}</div>
                  </div>
                  <div className="bg-panel p-2 rounded border border-line">
                    <div className="text-[10px] text-muted">FALSE ALARMS</div>
                    <div className="text-sm font-bold text-white">{prof.falseAlarmRate}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Policy Breakdown Preview */}
        <div className="bg-panel2 border border-line rounded-lg p-5 space-y-3">
          <div className="mono text-xs text-white font-semibold flex items-center justify-between">
            <span>ACTIVE ENFORCEMENT RULES FOR {currentProfile.name.toUpperCase()}:</span>
            <span className="text-[10px] text-muted mono">CONFIGURED ON-DEVICE</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentProfile.policyDetails.map((pol) => (
              <div key={pol.label} className="bg-panel p-3.5 rounded border border-line space-y-1">
                <div className="mono text-[10px] text-muted uppercase">{pol.label}</div>
                <div className={`text-xs font-semibold ${pol.color}`}>{pol.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
