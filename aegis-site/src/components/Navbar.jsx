import { useState, useEffect, useRef } from "react";

function ShieldMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar({ activeView, setActiveView, isExtensionLinked, theme = "dark", setTheme = () => {} }) {
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
    { id: "home", label: "Home" },
    { id: "architecture", label: "Architecture & AI" },
    { id: "dashboard", label: "SOC Dashboard", badge: true },
    { id: "simulator", label: "Live Simulator", icon: "⚡" },
  ];

  const exploreLinks = [
    { id: "problem", label: "Problem Statement", sub: "SIH 26106 · AICTE Cyber Security" },
    { id: "coverage", label: "Project Scorecard", sub: "Features completed vs upcoming" },
    { id: "boundary", label: "Privacy & Security", sub: "100% on-device · Zero data stored" },
    { id: "roadmap", label: "Project Roadmap", sub: "Phase 1, Phase 2, and Phase 3 plans" },
    { id: "team", label: "Team Members", sub: "All 6 contributors & roles" },
    { id: "help", label: "Installation Guide", sub: "How to test the extension locally" },
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
            onClick={() => {
              setActiveView("home");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (document.documentElement) document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
              if (document.body) document.body.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            title="Return to Home Overview / Scroll to Top"
          >
            <span className="w-9 h-9 rounded-md border border-mint/40 flex items-center justify-center text-mint bg-panel shadow-sm group-hover:border-mint transition-colors">
              <ShieldMark />
            </span>
            <div>
              <div className="font-semibold tracking-wider text-sm text-white flex items-center gap-1.5">
                <span>A.E.G.I.S.</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-mint/10 text-mint border border-mint/30 mono">v0.41</span>
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

        {/* Right Area: Theme Toggle, Explore Dropdown & Connection Badge */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-9 h-9 rounded-md border border-line bg-panel hover:bg-panel2 flex items-center justify-center text-muted hover:text-white transition-all active:scale-95 shadow-sm"
            title={theme === "light" ? "Switch to Dark Mode (Obsidian / Mint)" : "Switch to Light Mode (Clean Slate / Emerald)"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mint">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Explore Dropdown */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`mono text-xs px-3 py-1.5 rounded border transition-all flex items-center gap-1.5 ${
                dropdownOpen
                  ? "border-mint text-mint bg-panel2"
                  : "border-line text-muted hover:text-white bg-panel hover:bg-panel2"
              }`}
            >
              <span>Explore</span>
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
            onClick={() => setActiveView(activeView === "dashboard" ? "home" : "dashboard")}
            className="hidden sm:flex items-center gap-2 bg-mint text-ink font-semibold text-xs px-4 py-2 rounded hover:bg-mintdim active:scale-[0.97] transition-all shrink-0"
          >
            {activeView === "dashboard" ? "Home Overview →" : "Open SOC Dashboard →"}
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
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] text-muted tracking-wider uppercase">Primary Views:</span>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="mono text-[11px] text-mint flex items-center gap-1.5 px-2 py-1 rounded bg-panel border border-line"
            >
              <span>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
            </button>
          </div>

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
            <div className="mono text-[10px] text-muted tracking-wider uppercase mb-2">Explore:</div>
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
