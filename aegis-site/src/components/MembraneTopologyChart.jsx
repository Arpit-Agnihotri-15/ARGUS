import { useState } from "react";

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

export function MembraneTopologyChart() {
  const [activeNode, setActiveNode] = useState(MEMBRANES[0]);

  return (
    <div className="bg-panel border border-line rounded-lg p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line pb-4">
        <div>
          <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
            DETERMINISTIC DEFENSE-IN-DEPTH · LATENCY BENCHMARK
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Membrane Inspection Pipeline (M0 → M5)
          </h3>
          <p className="text-muted text-xs sm:text-sm mt-1 max-w-xl">
            Every incoming email passes through 6 sequential on-device membranes. Click any membrane node to inspect its execution latency, rule logic, and deduction caps.
          </p>
        </div>

        <div className="bg-panel2 border border-line p-3 rounded-md text-right">
          <div className="mono text-[10px] text-muted">TOTAL PIPELINE LATENCY</div>
          <div className="text-xl font-bold text-mint mono">~4.5 ms</div>
          <div className="text-[10px] text-mint mt-0.5">100% Client-Side</div>
        </div>
      </div>

      {/* Interactive Topology Graph Flow */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {MEMBRANES.map((m, i) => {
          const isSelected = activeNode.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveNode(m)}
              className={`text-left p-4 rounded-lg border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-panel2 border-mint shadow-lg"
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
      <div className="bg-panel2 border border-line rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-lg bg-panel border border-line flex items-center justify-center text-2xl shrink-0">
              {activeNode.icon}
            </span>
            <div>
              <div className="mono text-[10px] text-mint uppercase">SELECTED MEMBRANE NODE / {activeNode.id}</div>
              <h4 className="text-lg font-bold text-white">{activeNode.name}: {activeNode.subtitle}</h4>
              <div className="mono text-[10px] text-mintdim mt-0.5">{activeNode.file}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-panel border border-line px-3 py-1.5 rounded text-right">
              <div className="mono text-[9px] text-muted">EXECUTION LATENCY</div>
              <div className="mono text-sm font-bold text-mint">{activeNode.latency}</div>
            </div>
            <div className="bg-panel border border-line px-3 py-1.5 rounded text-right">
              <div className="mono text-[9px] text-muted">PENALTY IMPACT</div>
              <div className="mono text-sm font-bold text-amber">{activeNode.maxDeduction}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-panel p-4 rounded border border-line space-y-1">
            <div className="mono text-[10px] text-muted uppercase">Operational Heuristic</div>
            <p className="text-white leading-relaxed">{activeNode.desc}</p>
          </div>
          <div className="bg-panel p-4 rounded border border-line space-y-1">
            <div className="mono text-[10px] text-muted uppercase">Enforcement Rule</div>
            <p className="text-muted leading-relaxed">{activeNode.rule}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
