import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { CyberGlobe3D } from "./components/CyberGlobe3D.jsx";
import { SocDashboard } from "./components/SocDashboard.jsx";
import { LiveSimulator } from "./components/LiveSimulator.jsx";
import { InteractiveAiCharts } from "./components/InteractiveAiCharts.jsx";
import { MembraneTopologyChart } from "./components/MembraneTopologyChart.jsx";
import { ScorecardAndGovernance } from "./components/ScorecardAndGovernance.jsx";
import { ThreatDetonationChamber } from "./components/ThreatDetonationChamber.jsx";

const AEGIS_EXT_ID = "feblkjonnopmmcojjidcnakbpdpkmajh";

/* -------------------------------------------------------------------------
 * Shared UI Helpers
 * ---------------------------------------------------------------------- */

function Eyebrow({ children, color = "text-mint" }) {
  return (
    <div className={`flex items-center gap-2 mono text-xs tracking-widest ${color} mb-4`}>
      <span className="w-6 h-px bg-current inline-block" />
      {children}
    </div>
  );
}

function EmailPreviewCard() {
  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3 mono text-[11px] text-muted tracking-widest">
        <span className="flex items-center gap-2 text-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse-soft" /> LIVE MEMBRANE INTERCEPT
        </span>
        <span className="hidden sm:inline">PROMPT ACTION · M1 AUTH</span>
      </div>
      <div className="bg-panel border border-line rounded-md p-5 hover:border-line2 transition-colors shadow-lg">
        <div className="flex items-center gap-2 mono text-[11px] text-muted mb-4">
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="ml-2">inbox / message-preview</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-mint/20 border border-mint/40 text-mint flex items-center justify-center font-semibold">
              N
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Notion updates</div>
              <div className="text-xs text-muted">hello@notion.so</div>
            </div>
          </div>
          <span className="mono text-[10px] bg-mint/15 text-mint border border-mint/30 px-2 py-0.5 rounded">SAFE</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 rounded bg-white/10 w-full" />
          <div className="h-2 rounded bg-white/10 w-4/5" />
          <div className="h-2 rounded bg-white/10 w-3/5" />
        </div>
        <div className="mt-5 flex items-center justify-between bg-mint/10 border border-mint/30 rounded-md px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-mint">Looks like a familiar sender</div>
            <div className="text-xs text-muted">SPF + DMARC posture verified • domain established</div>
          </div>
          <span className="text-mint">→</span>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 hidden lg:block bg-panel2 border border-line rounded-md p-4 w-52 shadow-2xl hover:-translate-y-1 transition-transform">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-mint leading-none">98</div>
          <div className="text-[10px] text-muted mono">/100</div>
          <div>
            <div className="text-sm font-semibold text-white">Safe to engage</div>
          </div>
        </div>
        <div className="text-xs text-muted mt-2">Zero risk signals found in this message.</div>
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1.5 flex-1 rounded bg-mint/70" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Showcase View (Hero + Problem + Threat Vectors)
 * ---------------------------------------------------------------------- */

function ShowcaseView({ setActiveView }) {
  const [heroMode, setHeroMode] = useState("3d");

  return (
    <div className="space-y-20">
      {/* Hero Section with 3D Cyber Threat Sphere */}
      <section className="relative bg-fade bg-grid overflow-hidden border-b border-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-20 sm:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>SIH 2026 · PROBLEM STATEMENT 26106 · AICTE CYBER SECURITY CELL</Eyebrow>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
              Trust what <br />
              <span className="text-mint">you're reading.</span>
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
              A.E.G.I.S. is a privacy-first email threat detection and forensic intelligence platform.
              Combines on-device ML classification, UTS #39 confusable detection, Proof-of-Action assurance,
              and real-time SOC telemetry.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setActiveView("dashboard")}
                className="bg-mint text-ink font-semibold px-5 py-3 rounded hover:bg-mintdim active:scale-[0.97] transition-all flex items-center gap-2 text-sm"
              >
                Open SOC Dashboard <span>→</span>
              </button>
              <button
                onClick={() => setActiveView("simulator")}
                className="mono text-xs border border-line hover:border-mint/50 bg-panel px-4 py-3 rounded text-white hover:bg-panel2 transition-all flex items-center gap-1.5"
              >
                ⚡ Test Live Simulator
              </button>
              <button
                onClick={() => setActiveView("architecture")}
                className="mono text-xs border border-line px-4 py-3 rounded text-muted hover:text-white bg-panel2 transition-all"
              >
                Explore AI &amp; Membranes
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mono text-[11px] text-muted tracking-widest pt-2">
              <span className="flex items-center gap-2">
                <span className="text-mint">◆</span> ZERO-TOKEN BRIDGE
              </span>
              <span className="flex items-center gap-2">
                <span className="text-mint">🔒</span> 100% CLIENT-SIDE
              </span>
              <span className="flex items-center gap-2">
                <span className="text-mint">⚡</span> &lt; 0.8ms LATENCY
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="flex items-center bg-panel border border-line rounded p-1 mb-4 mono text-[11px]">
              <button
                onClick={() => setHeroMode("3d")}
                className={`px-3 py-1 rounded transition-colors ${heroMode === "3d" ? "bg-mint text-ink font-semibold" : "text-muted"}`}
              >
                3D Cyber Threat Sphere
              </button>
              <button
                onClick={() => setHeroMode("email")}
                className={`px-3 py-1 rounded transition-colors ${heroMode === "email" ? "bg-mint text-ink font-semibold" : "text-muted"}`}
              >
                Email In-Box Membrane
              </button>
            </div>

            {heroMode === "3d" ? (
              <div className="w-full bg-panel/80 border border-line rounded-lg p-2 backdrop-blur shadow-2xl">
                <CyberGlobe3D />
              </div>
            ) : (
              <div className="w-full py-4">
                <EmailPreviewCard />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Centerpiece: Live Cyber Threat Detonation Chamber */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <ThreatDetonationChamber />
      </section>

      {/* Core Defense Pillars */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-panel border border-line p-6 rounded-lg space-y-2">
            <div className="mono text-xs text-mint uppercase">PILLAR 01</div>
            <h3 className="text-lg font-bold text-white">On-Device Machine Learning</h3>
            <p className="text-muted text-xs leading-relaxed">
              12,000-feature TF-IDF + Logistic Regression model runs in the browser extension service worker without transmitting email text to external LLMs.
            </p>
          </div>
          <div className="bg-panel border border-line p-6 rounded-lg space-y-2">
            <div className="mono text-xs text-mint uppercase">PILLAR 02</div>
            <h3 className="text-lg font-bold text-white">Proof-of-Action Assurance</h3>
            <p className="text-muted text-xs leading-relaxed">
              Refuses to treat authentication as authorization. High-impact operations (wire transfers, credentials, PII) trigger verify-first enforcement.
            </p>
          </div>
          <div className="bg-panel border border-line p-6 rounded-lg space-y-2">
            <div className="mono text-xs text-mint uppercase">PILLAR 03</div>
            <h3 className="text-lg font-bold text-white">Zero-Token SOC Companion</h3>
            <p className="text-muted text-xs leading-relaxed">
              Instant MV3 <code className="text-mint mono">externally_connectable</code> bridge securely feeds browser telemetry to this dashboard without manual token copy-pasting.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive AI Model & UTS #39 Confusable Playground */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Eyebrow>INTERACTIVE MODEL &amp; HOMOGLYPH PLAYGROUND</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              UTS #39 Confusable Engine &amp; On-Device ML Weights
            </h2>
            <p className="text-muted text-sm max-w-2xl mt-1">
              Test any character or brand name against the UTS #39 Unicode skeleton mapper,
              adjust the ML decision threshold, and inspect the feature weight distribution.
            </p>
          </div>
          <button
            onClick={() => setActiveView("architecture")}
            className="mono text-xs text-mint hover:underline font-semibold shrink-0"
          >
            Full Architecture View →
          </button>
        </div>
        <InteractiveAiCharts />
      </section>

      {/* 6-Membrane Pipeline Topology & Latency Waterfall */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Eyebrow>DETERMINISTIC DEFENSE PIPELINE</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              6-Layer In-Flight Intercept Waterfall (&lt; 4.5ms)
            </h2>
            <p className="text-muted text-sm max-w-2xl mt-1">
              Every email is screened across 6 independent on-device verification membranes before user interaction.
            </p>
          </div>
          <button
            onClick={() => setActiveView("architecture")}
            className="mono text-xs text-mint hover:underline font-semibold shrink-0"
          >
            Inspect Latencies →
          </button>
        </div>
        <MembraneTopologyChart />
      </section>

      {/* Quick Launch Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-12">
        <div className="bg-panel2 border border-mint/40 rounded-xl p-8 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="mono text-xs text-mint tracking-wider uppercase">READY TO EVALUATE?</div>
            <h3 className="text-2xl font-bold text-white">Test Live Threats Against Real Inbox Mails</h3>
            <p className="text-muted text-sm">
              Launch the SOC Live Dashboard to inspect real-time mailbox threat telemetry, or open the Live Simulator to test live Gmail messages against the on-device engine.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveView("dashboard")}
              className="bg-mint text-ink font-bold px-5 py-2.5 rounded text-xs hover:bg-mintdim transition-colors"
            >
              Open SOC Dashboard →
            </button>
            <button
              onClick={() => setActiveView("simulator")}
              className="mono text-xs border border-line bg-panel hover:bg-panel2 text-white px-4 py-2.5 rounded transition-colors"
            >
              ⚡ Live Simulator Sandbox
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Architecture & AI View
 * ---------------------------------------------------------------------- */

function ArchitectureView() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-16">
      <div>
        <Eyebrow>SYSTEM ARCHITECTURE &amp; AI MEMBRANE</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Deterministic Defense-in-Depth <br />
          <span className="text-mint">with Packaged On-Device ML.</span>
        </h2>
        <p className="text-muted text-base max-w-2xl mt-2">
          A.E.G.I.S. is strictly modular. The pipeline evaluates sender authenticity, domain intelligence, Unicode homoglyphs, machine learning language tone, and Proof-of-Action authorization in ~4.5 milliseconds.
        </p>
      </div>

      {/* 1. Membrane Pipeline Topology & Latencies */}
      <MembraneTopologyChart />

      {/* 2. Interactive AI Model, Threshold Slider, and UTS #39 Confusables */}
      <InteractiveAiCharts />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Main Application Coordinator
 * ---------------------------------------------------------------------- */

export default function App() {
  const [activeView, setActiveView] = useState("showcase"); // "showcase" | "architecture" | "dashboard" | "simulator" | "scorecard"
  const [isExtensionLinked, setIsExtensionLinked] = useState(false);

  // Probe extension presence periodically
  useEffect(() => {
    const probe = () => {
      if (typeof window !== "undefined" && window.chrome?.runtime?.sendMessage) {
        try {
          window.chrome.runtime.sendMessage(AEGIS_EXT_ID, { type: "PING" }, (res) => {
            if (res && res.ok) setIsExtensionLinked(true);
            else setIsExtensionLinked(false);
          });
        } catch {
          setIsExtensionLinked(false);
        }
      }
    };
    probe();
    const interval = setInterval(probe, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-mint selection:text-ink font-sans flex flex-col justify-between">
      {/* Universal De-Congested Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isExtensionLinked={isExtensionLinked}
      />

      {/* Primary Dynamic View Content */}
      <main className="flex-1">
        {activeView === "showcase" && <ShowcaseView setActiveView={setActiveView} />}
        {activeView === "architecture" && <ArchitectureView />}
        {activeView === "dashboard" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <SocDashboard />
          </div>
        )}
        {activeView === "simulator" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <LiveSimulator />
          </div>
        )}
        {activeView === "scorecard" && <ScorecardAndGovernance />}
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-line bg-panel py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between flex-wrap gap-4 text-xs text-muted">
          <div>
            <span className="font-semibold text-white">A.E.G.I.S.</span> · Anti-Phishing Email Gateway &amp; Intelligence System
            <span className="mono text-[10px] text-mint block sm:inline sm:ml-2">
              Smart India Hackathon 2026 · Problem Statement ID: 26106 (AICTE)
            </span>
          </div>

          <div className="flex items-center gap-4 mono text-[11px]">
            <button onClick={() => setActiveView("scorecard")} className="hover:text-mint transition-colors">
              Phase Scorecard (~48%)
            </button>
            <button onClick={() => setActiveView("scorecard")} className="hover:text-mint transition-colors">
              Team &amp; Governance
            </button>
            <button onClick={() => setActiveView("dashboard")} className="text-mint hover:underline">
              Live SOC Feed →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
