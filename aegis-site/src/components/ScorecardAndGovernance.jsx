import { useState } from "react";

const COVERAGE = [
  { label: "Phase 1: Proof-of-Action & Core Detection Membrane", pct: 100, phase: "PHASE 1 (SHIPPED)" },
  { label: "Phase 1: Zero-Token Companion Dashboard & Web Platform", pct: 100, phase: "PHASE 1 (SHIPPED)" },
  { label: "Phase 2: Origin Traceability & SMTP Relay Path (EML Parser)", pct: 35, phase: "PHASE 2 (IN PROGRESS)" },
  { label: "Phase 2: Geolocation & Infrastructure Flagging (VPN/Tor)", pct: 15, phase: "PHASE 2 (IN PROGRESS)" },
  { label: "Phase 2: Local Campaign Correlation & Attribution Store", pct: 15, phase: "PHASE 2 (PLANNED)" },
  { label: "Phase 3: Multi-User Incident Response Case Management", pct: 0, phase: "PHASE 3 (ROADMAP)" },
];

const ROADMAP = [
  {
    n: "00",
    tag: "LIVE",
    tagRight: "PHASE 1 SHIPPED",
    title: "Phase 1: Proof-of-Action & Core Detection Membrane",
    desc: "Sender identity, Unicode UTS #39 confusables, on-device TF-IDF classifier, RDAP domain intelligence, and Proof-of-Action authorization enforcement.",
    live: true,
  },
  {
    n: "01",
    tag: "LIVE",
    tagRight: "PHASE 1 SHIPPED",
    title: "Phase 1: SOC Live Dashboard & Zero-Token Link",
    desc: "Companion web platform with interactive 3D threat sphere, deep statistical charts, and frictionless extension synchronization.",
    live: true,
  },
  {
    n: "02",
    tag: "ACTIVE",
    tagRight: "PHASE 2 RC",
    title: "Phase 2: Header Forensics & Raw EML Parsing",
    desc: "Offline raw-EML parser, Received-header stack reconstruction, and timestamp anomaly detection under active development.",
    live: true,
  },
  {
    n: "03",
    tag: "NEXT",
    tagRight: "PHASE 2 UPCOMING",
    title: "Phase 2: Origin IP Extraction & Geolocation",
    desc: "ipExtract.js walks the hop chain to isolate probable origin IP; geoIntel.js queries Country/ASN/ISP and flags VPN/Tor/Hosting infrastructure.",
  },
  {
    n: "04",
    tag: "LATER",
    tagRight: "PHASE 3 ROADMAP",
    title: "Phase 3: Multi-User Case Management & Attribution",
    desc: "Cross-scan store correlating recurring domains, IPs, and ASNs to flag distributed threat campaigns across organizational clusters.",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Archit Shrivastava",
    role: "Team Lead & Backend Architecture",
    domain: "Extension Engine Lead",
    bio: "Engineered the browser extension pipeline, Unicode UTS #39 confusables, on-device TF-IDF classifier, Proof-of-Action assurance, and raw EML forensic parser."
  },
  {
    name: "Arpit Agnihotri",
    role: "Frontend Lead & QA Architecture",
    domain: "Extension & Web Platform Integration",
    bio: "Architected the companion web platform, interactive 3D cyber membrane, SOC telemetry dashboard, zero-token bridge, and full-stack integration testing."
  },
  {
    name: "Areeba Alam",
    role: "UI / UX Design & Site Experience",
    domain: "Visual Design & User Flow",
    bio: "Crafted the cybersecurity user experience, in-inbox overlay aesthetics, responsive web architecture, and design consistency across browser and dashboard."
  },
  {
    name: "Aprajita Mall",
    role: "Research & Threat Intelligence",
    domain: "Security Heuristics & Analysis",
    bio: "Conducted deep research on email authentication standards (SPF/DKIM/DMARC), BEC social-engineering patterns, and homoglyph attack taxonomies."
  },
  {
    name: "Arnav Chauhan",
    role: "Product Management & Presentation",
    domain: "SIH Presentation & Delivery",
    bio: "Manages product specifications, hackathon demonstration scripting, judge communication narratives, and end-to-end user journeys."
  },
  {
    name: "Neha Gupta",
    role: "Product Management & Presentation",
    domain: "Documentation & Compliance",
    bio: "Oversees hackathon compliance, evaluation metrics, presentation visual alignment, and product requirements synchronization."
  }
];

const BOUNDARY = [
  { icon: "🔒", title: "Local First", desc: "Message content and analysis stay inside the browser — nothing is uploaded to a remote server for scoring." },
  { icon: "🌐", title: "Domain Only", desc: "DNS and RDAP receive public domain lookups only — never message bodies or attachments." },
  { icon: "🔔", title: "Opt-In Headers", desc: "Deeper provider metadata (Gmail/Outlook OAuth) is an explicit, revocable user choice." },
  { icon: "🗂️", title: "Evidence-Ready Logs", desc: "Local-only privacy activity log capped at 100 entries, recording lookups without personal data." },
];

function barColor(pct) {
  if (pct >= 80) return "bg-mint";
  if (pct >= 20) return "bg-amber";
  return "bg-rose";
}

export function ScorecardAndGovernance() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-20 max-w-7xl mx-auto px-6 sm:px-8 py-12">
      {/* 1. Problem Statement Section */}
      <section id="problem" className="bg-panel border border-line rounded-lg p-6 sm:p-10 space-y-6 scroll-mt-20">
        <div className="flex items-center gap-2 mono text-xs tracking-widest text-mint mb-2">
          <span className="w-6 h-px bg-current inline-block" />
          SMART INDIA HACKATHON 2026 · PROBLEM STATEMENT ID: 26106
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Anti-Phishing Email Gateway &amp; Intelligence System
        </h2>
        <div className="mono text-xs text-mintdim">
          Organization: AICTE Cyber Security Cell · Theme: Blockchain &amp; Cybersecurity · Category: Software
        </div>
        <p className="text-muted text-base leading-relaxed max-w-3xl">
          Modern phishing attacks bypass conventional gateway filters through display-name impersonation, homoglyph character confusion, and business email compromise (BEC). A.E.G.I.S. introduces an on-device protective membrane directly inside Gmail and Outlook Web, computing cryptographic trust scores and enforcing Proof-of-Action authorization with <strong>zero external telemetry storage</strong>.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-line">
          <div className="bg-panel2 p-4 rounded border border-line">
            <div className="mono text-[10px] text-muted">CHALLENGE STATEMENT</div>
            <div className="text-sm font-semibold text-white mt-1">High-Precision Client-Side Defense</div>
            <div className="text-xs text-muted mt-0.5">Detect phishing before user actions without cloud MX rerouting</div>
          </div>
          <div className="bg-panel2 p-4 rounded border border-line">
            <div className="mono text-[10px] text-muted">CORE INNOVATION</div>
            <div className="text-sm font-semibold text-mint mt-1">Proof-of-Action Assurance</div>
            <div className="text-xs text-muted mt-0.5">Refuses to treat authentication as authorization for wires and credentials</div>
          </div>
          <div className="bg-panel2 p-4 rounded border border-line">
            <div className="mono text-[10px] text-muted">PRIVACY GUARANTEE</div>
            <div className="text-sm font-semibold text-white mt-1">Zero Remote Data Retention</div>
            <div className="text-xs text-muted mt-0.5">100% on-device model inference and local storage</div>
          </div>
        </div>
      </section>

      {/* 2. Project Scorecard */}
      <section id="coverage" className="space-y-6 scroll-mt-20">
        <div>
          <div className="mono text-xs text-mint tracking-widest uppercase mb-2">PROJECT SCORECARD · HONEST PROGRESS</div>
          <h2 className="text-3xl font-bold text-white">Project Scorecard</h2>
          <p className="text-muted text-sm max-w-2xl mt-1">
            Features currently completed and running versus upcoming Phase 2 and Phase 3 capabilities.
          </p>
        </div>

        <div className="bg-panel border border-line rounded-lg p-6 sm:p-8 space-y-6">
          <div className="space-y-5">
            {COVERAGE.map((c, i) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm gap-4">
                  <div>
                    <span className="text-white font-medium">{c.label}</span>
                    <span className="mono text-[10px] text-muted ml-2">[{c.phase}]</span>
                  </div>
                  <span className="mono text-mint font-bold shrink-0">{c.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-line overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor(c.pct)} transition-[width] duration-700 ease-out`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-line flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="mono text-xs text-muted tracking-widest block">OVERALL MULTI-PHASE ROADMAP PROGRESS</span>
              <span className="text-xs text-mintdim">Phase 1: 100% Shipped · Phase 2: Active RC · Phase 3: Planned</span>
            </div>
            <span className="text-3xl font-bold text-mint mono">~48%</span>
          </div>
        </div>
      </section>

      {/* 3. Privacy & Security */}
      <section id="boundary" className="space-y-6 scroll-mt-20">
        <div>
          <div className="mono text-xs text-mint tracking-widest uppercase mb-2">PRIVACY &amp; SECURITY GUARANTEE</div>
          <h2 className="text-3xl font-bold text-white">Privacy &amp; Security</h2>
          <p className="text-muted text-sm max-w-2xl mt-1">
            100% on-device processing: your email contents and tokens never leave your browser.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-panel border border-line rounded-lg p-6 space-y-4">
            <div className="mono text-xs text-mint uppercase font-semibold">Architectural Safeguards</div>
            <div className="space-y-4">
              {BOUNDARY.map((b) => (
                <div key={b.title} className="flex items-start gap-3.5">
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <div className="font-semibold text-white text-sm">{b.title}</div>
                    <div className="text-xs text-muted mt-0.5">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-panel2 border border-line rounded-lg p-6 space-y-4">
            <div className="mono text-xs text-rose uppercase font-semibold">What A.E.G.I.S. Does NOT Do</div>
            <ul className="space-y-3 text-xs text-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-rose font-bold">✕</span>
                <span>Never transmits message bodies, subjects, or attachments to an external scoring server</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose font-bold">✕</span>
                <span>Never stores cross-user databases or remote cloud audit honeypots</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose font-bold">✕</span>
                <span>No advertising trackers, telemetry analytics resale, or behavioral profiling</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose font-bold">✕</span>
                <span>Zero persistent OAuth refresh-tokens saved; permissions are user-revocable</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Project Roadmap */}
      <section id="roadmap" className="space-y-6 scroll-mt-20">
        <div>
          <div className="mono text-xs text-mint tracking-widest uppercase mb-2">PLANNED MILESTONES</div>
          <h2 className="text-3xl font-bold text-white">Project Roadmap</h2>
          <p className="text-muted text-sm max-w-2xl mt-1">
            Delivery milestones across Phase 1 Shipped, Phase 2 RC, and Phase 3 Future.
          </p>
        </div>

        <div className="space-y-4">
          {ROADMAP.map((r, i) => (
            <div key={r.n} className="bg-panel border border-line rounded-lg p-5 flex items-start gap-4 sm:gap-6">
              <div className={`w-10 h-10 rounded mono text-xs flex items-center justify-center font-bold shrink-0 ${
                r.live ? "bg-mint text-ink" : "bg-panel2 border border-line text-muted"
              }`}>
                {r.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <h3 className="text-base font-semibold text-white">{r.title}</h3>
                  <span className={`mono text-[10px] px-2 py-0.5 rounded ${
                    r.live ? "bg-mint/10 text-mint border border-mint/40" : "bg-panel2 text-muted border border-line"
                  }`}>
                    {r.tagRight}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Team Members */}
      <section id="team" className="space-y-6 scroll-mt-20">
        <div>
          <div className="mono text-xs text-mint tracking-widest uppercase mb-2">SIH 2026 CONTRIBUTORS</div>
          <h2 className="text-3xl font-bold text-white">Team Members</h2>
          <p className="text-muted text-sm max-w-2xl mt-1">
            The 6 engineering, design, threat research, and strategy contributors behind A.E.G.I.S.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="bg-panel border border-line rounded-lg p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{member.name}</h3>
                <span className="mono text-[9px] text-mint bg-panel2 px-2 py-0.5 rounded border border-line">
                  {member.domain}
                </span>
              </div>
              <div className="mono text-[11px] text-muted">{member.role}</div>
              <p className="text-xs text-muted leading-relaxed pt-1 border-t border-line/60">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Installation Guide */}
      <section id="help" className="bg-panel border border-line rounded-lg p-6 sm:p-8 space-y-6 scroll-mt-20">
        <div className="mono text-xs text-mint uppercase tracking-widest">SETUP &amp; TESTING INSTRUCTIONS</div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-line pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Installation Guide</h2>
            <p className="text-muted text-xs mt-1">
              Step-by-step instructions to load and test the unpacked extension in Chrome or Edge.
            </p>
          </div>
          <span className="mono text-xs bg-panel2 border border-mint/40 text-mint px-3 py-1 rounded shrink-0 self-start md:self-auto">
            RC v0.41.0 (SIH 26106 Phase 1 Final)
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-panel2 p-4 rounded border border-line space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-mint">1.</span> Load Unpacked Extension
            </div>
            <p className="text-muted leading-relaxed">
              Open Chrome or Edge, navigate to <code className="text-mint mono">chrome://extensions</code>, enable <strong>Developer Mode</strong> toggle (top right), click <strong>Load unpacked</strong>, and select:
            </p>
            <div className="mono text-[10px] text-white bg-panel p-2 rounded border border-line break-all select-all">
              C:\SIH_club\AEGIS_v0.41.0_Phase1_Final_RC
            </div>
          </div>

          <div className="bg-panel2 p-4 rounded border border-line space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-mint">2.</span> Launch Companion Site
            </div>
            <p className="text-muted leading-relaxed">
              In your terminal, run development server inside the web application directory:
            </p>
            <div className="mono text-[10px] text-muted bg-panel p-2 rounded space-y-1">
              <div><code className="text-mint mono">cd c:\SIH_club\ARGUS\aegis-site</code></div>
              <div><code className="text-white mono">npm run dev</code></div>
              <div className="text-mint pt-1 font-semibold">URL: http://localhost:5173</div>
            </div>
          </div>

          <div className="bg-panel2 p-4 rounded border border-line space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-mint">3.</span> Zero-Token Local Bridge
            </div>
            <p className="text-muted leading-relaxed">
              Open Gmail or Outlook in one tab, and dashboard in another. The SOC feed connects to the extension background worker via runtime messaging:
            </p>
            <div className="mono text-[10px] text-mint bg-panel p-2 rounded border border-mint/30">
              ID: feblkjonnopmmcojjidcnakbpdpkmajh
            </div>
          </div>

          <div className="bg-panel2 p-4 rounded border border-line space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-mint">4.</span> Athena Managed AI Gateway
            </div>
            <p className="text-muted leading-relaxed">
              Deployable serverless proxy (<code className="text-mint mono">/api/athena</code>) keeps Gemini keys securely on the server. Extension operates in managed mode with <strong>zero keys required</strong> from users.
            </p>
            <div className="mono text-[10px] text-mint bg-panel p-2 rounded border border-mint/30">
              Auto-Discovery &amp; Offline Fallback
            </div>
          </div>
        </div>

        {/* In-Depth Testing & Troubleshooting Matrix */}
        <div className="bg-panel2 border border-line rounded-lg p-5 space-y-4">
          <div className="mono text-xs font-semibold text-white flex items-center gap-2">
            <span>🛠️</span> Extension Verification &amp; Testing Checklist
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="font-semibold text-mint flex items-center gap-1.5">
                <span>✓</span> Testing with Live Gmail
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted text-[11px]">
                <li>Open any email in your Gmail tab (<code className="text-white mono">mail.google.com</code>).</li>
                <li>Click the <strong>A.E.G.I.S.</strong> shield icon in your browser toolbar to execute on-device scoring.</li>
                <li>Navigate to the <strong>SOC Dashboard</strong> or <strong>Live Simulator</strong> tab and click &quot;Sync from Extension&quot;.</li>
                <li>The newly opened email appears at the top of the cumulative session feed with <code className="text-mint mono">[● ACTIVE IN GMAIL]</code> while preserving all prior scans.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-mint flex items-center gap-1.5">
                <span>✓</span> Testing with Outlook Web
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted text-[11px]">
                <li>Open Outlook Web (<code className="text-white mono">outlook.live.com</code> or <code className="text-white mono">outlook.office.com</code>).</li>
                <li>Open any message containing links or attachments.</li>
                <li>Click the A.E.G.I.S. extension icon to trigger cross-provider parity extraction.</li>
                <li>Telemetry is processed 100% in browser memory with zero email contents sent over the network.</li>
              </ol>
            </div>
          </div>

          <div className="border-t border-line/60 pt-3 text-[11px] text-muted flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong className="text-white">Troubleshooting Bridge Connection:</strong> If the status displays &ldquo;STANDALONE SOC MODE&rdquo;, ensure Developer Mode is active on <code className="text-mint mono">chrome://extensions</code> and click the reload icon ↻ on the A.E.G.I.S. card.
            </div>
            <div className="mono text-[10px] text-mint">
              100% CLIENT-SIDE ENFORCEMENT
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
