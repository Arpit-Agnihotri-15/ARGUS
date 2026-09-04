import { useState, useEffect, useRef } from "react";

function ShieldMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar({ activeView, setActiveView, isExtensionLinked }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const navViews = [
    { id: "showcase", label: "Showcase" },
    { id: "architecture", label: "Architecture & AI" },
    { id: "dashboard", label: "SOC Dashboard", badge: true },
    { id: "simulator", label: "Live Simulator", icon: "⚡" },
  ];

  const exploreLinks = [
    { id: "problem", label: "Problem Statement (SIH 26106)", sub: "AICTE Cyber Security Cell" },
    { id: "coverage", label: "Honest Phase Scorecard (~48%)", sub: "Phase 1 Completed vs Phase 2 RC" },
    { id: "boundary", label: "Privacy & Zero-Storage", sub: "100% on-device architecture" },
    { id: "roadmap", label: "Development Roadmap", sub: "Milestones 00 through 04" },
    { id: "team", label: "Hackathon Team", sub: "All 6 contributing members" },
    { id: "help", label: "Help & Installation Guide", sub: "Load unpacked extension" },
  ];

  const handleExploreClick = (id) => {
    setActiveView("scorecard");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink/90 border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => { setActiveView("showcase"); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <span className="w-9 h-9 rounded-md border border-mint/40 flex items-center justify-center text-mint bg-panel shadow-sm">
              <ShieldMark />
            </span>
            <div>
              <div className="font-semibold tracking-wider text-sm text-white flex items-center gap-1.5">
                <span>A.E.G.I.S.</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-mint/10 text-mint border border-mint/30 mono">v0.38</span>
              </div>
              <div className="mono text-[9px] text-muted tracking-widest mt-0.5">CYBER MEMBRANE</div>
            </div>
          </button>

          {/* Center: Clean, uncluttered view tabs */}
          <nav className="hidden md:flex items-center bg-panel border border-line p-1 rounded-md mono text-xs">
            {navViews.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeView === v.id
                    ? "bg-mint text-ink font-bold shadow-sm"
                    : "text-muted hover:text-white"
                }`}
              >
                {v.badge && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeView === v.id ? "bg-ink" : "bg-mint"} animate-pulse`} />
                )}
                {v.icon && <span>{v.icon}</span>}
                <span>{v.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Area: Explore Dropdown & Connection Badge */}
        <div className="flex items-center gap-3">
          {/* Explore & Docs Dropdown */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`mono text-xs px-3 py-1.5 rounded border transition-all flex items-center gap-1.5 ${
                dropdownOpen
                  ? "border-mint text-mint bg-panel2"
                  : "border-line text-muted hover:text-white bg-panel hover:bg-panel2"
              }`}
            >
              <span>Explore &amp; Docs</span>
              <span className="text-[10px]">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-panel2 border border-line rounded-lg shadow-2xl p-2 z-50 animate-fade-up">
                <div className="mono text-[9px] text-muted px-3 py-1.5 uppercase tracking-wider border-b border-line mb-1">
                  Governance &amp; Reference
                </div>
                {exploreLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleExploreClick(item.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-panel transition-colors flex flex-col group"
                  >
                    <span className="text-xs font-medium text-white group-hover:text-mint transition-colors">
                      {item.label}
                    </span>
                    <span className="mono text-[10px] text-muted">{item.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick CTA Button */}
          <button
            onClick={() => setActiveView(activeView === "dashboard" ? "showcase" : "dashboard")}
            className="hidden sm:flex items-center gap-2 bg-mint text-ink font-semibold text-xs px-4 py-2 rounded hover:bg-mintdim active:scale-[0.97] transition-all shrink-0"
          >
            {activeView === "dashboard" ? "Showcase Overview →" : "Open SOC Dashboard →"}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-md border border-line flex items-center justify-center text-white"
            aria-label="Toggle Menu"
          >
            <div className="relative w-4 h-3">
              <span className={`absolute left-0 top-0 w-4 h-px bg-current transition-transform ${mobileMenuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 bottom-0 w-4 h-px bg-current transition-transform ${mobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-panel2 border-b border-line px-6 py-4 space-y-4 animate-fade-up">
          <div className="mono text-[10px] text-muted tracking-wider uppercase mb-2">Primary Views:</div>
          <div className="grid grid-cols-2 gap-2">
            {navViews.map((v) => (
              <button
                key={v.id}
                onClick={() => { setActiveView(v.id); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded text-left mono text-xs flex items-center gap-2 ${
                  activeView === v.id
                    ? "bg-mint text-ink font-bold"
                    : "bg-panel border border-line text-white"
                }`}
              >
                {v.badge && <span className="w-1.5 h-1.5 rounded-full bg-mint" />}
                {v.icon && <span>{v.icon}</span>}
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-line pt-3">
            <div className="mono text-[10px] text-muted tracking-wider uppercase mb-2">Documentation &amp; Team:</div>
            <div className="space-y-1">
              {exploreLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleExploreClick(item.id)}
                  className="w-full text-left p-2 rounded text-xs text-muted hover:text-white hover:bg-panel flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="mono text-[10px] text-mint">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
