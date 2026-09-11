
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("A.E.G.I.S. View Caught Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto my-12 p-6 bg-panel border border-rose/50 rounded-xl space-y-4 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-lg text-rose">View Rendering Interrupted</h3>
              <p className="text-xs text-muted">A client runtime error was caught safely by the A.E.G.I.S. Error Boundary.</p>
            </div>
          </div>
          <div className="p-3 bg-black/50 border border-line rounded mono text-xs text-rose/90 overflow-x-auto">
            {String(this.state.error?.message || this.state.error || "Unknown runtime exception")}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (typeof window !== "undefined") window.location.href = "/?view=home";
              }}
              className="bg-mint text-ink font-bold px-4 py-2 rounded text-xs hover:bg-mintdim transition-all cursor-pointer"
            >
              Reset to Home View →
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mono text-xs border border-line bg-panel2 px-3 py-2 rounded hover:text-white text-muted transition-colors cursor-pointer"
            >
              Retry Rendering
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { CyberGlobe3D } from "./components/CyberGlobe3D.jsx";
import { SocDashboard } from "./components/SocDashboard.jsx";
import { InteractiveAiCharts } from "./components/InteractiveAiCharts.jsx";
import { MembraneTopologyChart } from "./components/MembraneTopologyChart.jsx";
import { ScorecardAndGovernance } from "./components/ScorecardAndGovernance.jsx";
import { ThreatDetonationChamber } from "./components/ThreatDetonationChamber.jsx";
import { ConfusableInspector } from "./components/ConfusableInspector.jsx";

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

/* -------------------------------------------------------------------------
 * Home View (Hero + Detonation Chamber + Confusable Inspector + Pillars + Launch)
 * ---------------------------------------------------------------------- */

function HomeView({ setActiveView, isExtensionLinked, telemetry, theme }) {
  return (
    <div className="space-y-20">
      {/* Hero Section with Prominent 3D Cyber Threat Sphere linked to Extension */}
      <section className="relative bg-fade bg-grid overflow-hidden border-b border-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-20 sm:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>SIH 2026 · PROBLEM STATEMENT 26106 · AICTE CYBER SECURITY CELL</Eyebrow>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
              Trust what <br />
              <span className="text-mint">you're reading.</span>
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
              A.E.G.I.S. is an on-device, privacy-first email threat detection and forensic intelligence membrane.
              Combines packaged ML classification, Proof-of-Action authorization, and zero-remote-storage telemetry.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setActiveView("dashboard")}
                className="bg-mint text-ink font-semibold px-5 py-3 rounded hover:bg-mintdim active:scale-[0.97] transition-all flex items-center gap-2 text-sm shadow-md"
              >
                Open SOC Dashboard <span>→</span>
              </button>
              <button
                onClick={() => setActiveView("architecture")}
                className="mono text-xs border border-line px-4 py-3 rounded text-muted hover:text-white bg-panel2 transition-all shadow-sm"
              >
                Explore AI &amp; Architecture
              </button>
              <button
                onClick={() => {
                  setActiveView("scorecard");
                  if (typeof window !== "undefined") window.location.hash = "casestudy";
                  setTimeout(() => {
                    const el = document.getElementById("casestudy");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 80);
                }}
                className="mono text-xs border border-mint/40 px-4 py-3 rounded text-mint hover:text-white bg-mint/5 hover:bg-mint/15 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>UCSC AiTM Case Study</span>
                <span className="text-[10px]">↗</span>
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

          {/* Right Hero Column: Dedicated Interactive 3D Threat Sphere */}
          <div className="lg:col-span-6 w-full">
            <div className="w-full bg-panel/80 border border-line rounded-xl p-2 backdrop-blur shadow-2xl relative overflow-hidden">
              <CyberGlobe3D
                isExtensionLinked={isExtensionLinked}
                telemetry={telemetry}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Centerpiece: Live Cyber Threat Detonation Chamber */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <ThreatDetonationChamber />
      </section>

      {/* Interactive Confusable & Lookalike Inspector (UTS #39 Homoglyph Engine) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <ConfusableInspector theme={theme} />
      </section>

      {/* Foundational Architecture Pillars (Problem Statement ID 26106) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
        <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
              FOUNDATIONAL ARCHITECTURE · PROBLEM STATEMENT ID 26106
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Core Architectural Pillars of the A.E.G.I.S. Membrane
            </h2>
            <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Designed from first principles to eliminate cloud data harvesting, intercept advanced social engineering in-flight, and deliver auditable cryptographic trust for zero-trust corporate and government inboxes.
            </p>
          </div>
          <div className="mono text-xs px-3 py-1.5 rounded border border-mint/40 bg-mint/10 text-mint font-semibold shrink-0 self-start md:self-auto">
            100% ON-DEVICE ENFORCEMENT
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-mint bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 01</span>
              <span className="text-xs text-muted mono">&lt;0.45ms Latency</span>
            </div>
            <h3 className="text-base font-bold text-white">Client-Side Machine Learning</h3>
            <p className="text-muted text-xs leading-relaxed">
              12,000-feature TF-IDF model runs directly inside the Chromium background service worker with zero cloud data transmission, guaranteeing total privacy under the DPDP Act.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-mint">
              <span>✓ 0 Cloud Tokens</span>
              <span>·</span>
              <span>Sublinear TF-IDF</span>
            </div>
          </div>

          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-amber bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 02</span>
              <span className="text-xs text-muted mono">Zero Blind Trust</span>
            </div>
            <h3 className="text-base font-bold text-white">Proof-of-Action (PoA) Assurance</h3>
            <p className="text-muted text-xs leading-relaxed">
              Refuses to treat sender authentication as authorization. High-impact operations (wire transfers, credentials, PII) trigger verify-first dual-channel enforcement.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-amber">
              <span>✓ Auth ≠ Authorization</span>
              <span>·</span>
              <span>Out-of-Band Phone Gate</span>
            </div>
          </div>

          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-rose bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 03</span>
              <span className="text-xs text-muted mono">100% Catch Rate</span>
            </div>
            <h3 className="text-base font-bold text-white">Deterministic UTS #39 Radar</h3>
            <p className="text-muted text-xs leading-relaxed">
              Pre-compiled Unicode skeleton mapping instantly resolves Cyrillic/Greek homoglyphs and Punycode lookalikes spoofing legitimate corporate domains without DNS latency.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-rose">
              <span>✓ Skeleton Normalizer</span>
              <span>·</span>
              <span>Punycode Intercept</span>
            </div>
          </div>

          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-mint bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 04</span>
              <span className="text-xs text-muted mono">Zero 1-Click Exploits</span>
            </div>
            <h3 className="text-base font-bold text-white">Reversible Soft-Quarantine</h3>
            <p className="text-muted text-xs leading-relaxed">
              Shields unverified hyperlinks, defangs embedded scripts, and renders exploded safety previews directly inside the user's inbox without altering the underlying mail server.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-mint">
              <span>✓ In-Inbox Overlays</span>
              <span>·</span>
              <span>1-Click Safe Unlock</span>
            </div>
          </div>

          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-amber bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 05</span>
              <span className="text-xs text-muted mono">Local P2P Mirror</span>
            </div>
            <h3 className="text-base font-bold text-white">Zero-Token SOC Companion</h3>
            <p className="text-muted text-xs leading-relaxed">
              Instant MV3 <code className="text-mint mono">externally_connectable</code> bridge feeds real-time threat telemetry directly to this dashboard and mobile mirror without external databases.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-amber">
              <span>✓ Scannable QR Code</span>
              <span>·</span>
              <span>Zero Cloud Retention</span>
            </div>
          </div>

          <div className="bg-panel border border-line p-6 rounded-xl space-y-3 shadow-md hover:border-mint/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] text-mint bg-panel2 border border-line px-2 py-0.5 rounded font-bold">PILLAR 06</span>
              <span className="text-xs text-muted mono">Legal Grade</span>
            </div>
            <h3 className="text-base font-bold text-white">Cryptographic Evidence Passports</h3>
            <p className="text-muted text-xs leading-relaxed">
              Generates deterministic SHA-256 evidence hashes and downloadable forensic PDF dossiers for every inspected message, providing court-admissible audit trails for incident response.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 mono text-[10px] text-mint">
              <span>✓ SHA-256 Audit Seal</span>
              <span>·</span>
              <span>Exportable Dossier PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-12">
        <div className="bg-panel2 border border-mint/40 rounded-xl p-8 flex items-center justify-between flex-wrap gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="mono text-xs text-mint tracking-wider uppercase">READY TO EVALUATE?</div>
            <h3 className="text-2xl font-bold text-white">Test Live Threats Against Real Inbox Mails</h3>
            <p className="text-muted text-sm">
              Launch the SOC Live Dashboard to inspect real-time mailbox threat telemetry, or explore the on-device AI architecture.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveView("dashboard")}
              className="bg-mint text-ink font-bold px-5 py-2.5 rounded text-xs hover:bg-mintdim transition-colors shadow-md"
            >
              Open SOC Dashboard →
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
        <p className="text-muted text-base max-w-2xl mt-2 leading-relaxed">
          A.E.G.I.S. is strictly modular. The pipeline evaluates sender authenticity, domain intelligence, Unicode homoglyphs, machine learning language tone, and Proof-of-Action authorization in ~4.5 milliseconds.
        </p>
      </div>

      {/* 1. 6-Layer Membrane Inspection Pipeline with Live Intercept Cascade Simulator */}
      <MembraneTopologyChart />

      {/* 2. Interactive Real-Time ML Token Scorer Sandbox & Security Posture Sensitivity Profiles */}
      <InteractiveAiCharts />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Main Application Coordinator
 * ---------------------------------------------------------------------- */

export default function App() {
  // Initialize activeView from URL query parameter, hash, or localStorage so Ctrl+R stays on current page
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== "undefined") {
      const validViews = ["home", "architecture", "dashboard", "scorecard"];
      const urlParams = new URLSearchParams(window.location.search);
      const queryView = urlParams.get("view");
      if (queryView && validViews.includes(queryView)) return queryView;

      const hash = window.location.hash.replace("#", "").trim();
      if (hash && validViews.includes(hash)) return hash;

      const saved = localStorage.getItem("aegis_active_view");
      if (saved && validViews.includes(saved)) return saved;
    }
    return "home";
  });

  const [isExtensionLinked, setIsExtensionLinked] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const lastAppTelemetryFingerprintRef = useRef("");

  // Dark / Light Mode theme state with default dark theme
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aegis_theme") || "dark";
    }
    return "dark";
  });

  // Keep URL query param and localStorage synchronized with activeView
  useEffect(() => {
    try {
      localStorage.setItem("aegis_active_view", activeView);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (activeView === "home") {
          url.searchParams.delete("view");
        } else {
          url.searchParams.set("view", activeView);
        }
        window.history.replaceState(null, "", url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : "") + url.hash);
      }
    } catch {}
  }, [activeView]);

  useEffect(() => {
    try {
      localStorage.setItem("aegis_theme", theme);
      if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    } catch {
      // safe fallback
    }
  }, [theme]);

  // Probe extension presence periodically and retrieve telemetry
  useEffect(() => {
    const probe = () => {
      if (typeof window !== "undefined" && window.chrome?.runtime?.sendMessage) {
        try {
          window.chrome.runtime.sendMessage(AEGIS_EXT_ID, { type: "PING" }, (res) => {
            if (res && res.ok) {
              setIsExtensionLinked(true);
              // Fetch telemetry if available
              window.chrome.runtime.sendMessage(AEGIS_EXT_ID, { type: "GET_TELEMETRY" }, (telRes) => {
                if (telRes && telRes.ok) {
                  const fp = JSON.stringify(telRes.telemetry || telRes);
                  if (fp !== lastAppTelemetryFingerprintRef.current) {
                    lastAppTelemetryFingerprintRef.current = fp;
                    setTelemetry(telRes);
                  }
                }
              });
            } else {
              setIsExtensionLinked(false);
            }
          });
        } catch {
          setIsExtensionLinked(false);
        }
      }
    };
    probe();
    const interval = setInterval(probe, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-mint selection:text-ink font-sans flex flex-col justify-between transition-colors duration-200">
      {/* Universal De-Congested Navbar with Theme Toggle */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isExtensionLinked={isExtensionLinked}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Primary Dynamic View Content */}
      <main className="flex-1">
        <ErrorBoundary>
        {activeView === "home" && (
          <HomeView
            setActiveView={setActiveView}
            isExtensionLinked={isExtensionLinked}
            telemetry={telemetry}
            theme={theme}
          />
        )}
        {activeView === "architecture" && <ArchitectureView />}
        {activeView === "dashboard" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <SocDashboard />
          </div>
        )}
                {activeView === "scorecard" && <ScorecardAndGovernance />}
              </ErrorBoundary>
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-line bg-panel py-8 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between flex-wrap gap-4 text-xs text-muted">
          <div>
            <span className="font-semibold text-white">A.E.G.I.S.</span> · Anti-Phishing Email Gateway &amp; Intelligence System
            <span className="mono text-[10px] text-mint block sm:inline sm:ml-2">
              Smart India Hackathon 2026 · Problem Statement ID: 26106 (AICTE)
            </span>
          </div>

          <div className="flex items-center gap-4 mono text-[11px]">
            <button onClick={() => setActiveView("scorecard")} className="hover:text-mint transition-colors">
              Phase Scorecard (~65%)
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
