import { useState } from "react";

function Eyebrow({ children, color = "text-mint" }) {
  return (
    <div className={`flex items-center gap-2 mono text-xs tracking-widest ${color} mb-6`}>
      <span className="w-6 h-px bg-current inline-block" />
      {children}
    </div>
  );
}

function Nav() {
  const links = ["Command center", "Overview", "Architecture", "Roadmap"];
  const [active, setActive] = useState("Command center");
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-ink/80 border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <a href="#hero" className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-md border border-mint/40 flex items-center justify-center text-mint">
            {/* shield icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <div className="font-semibold tracking-wide leading-none">A.E.G.I.S.</div>
            <div className="mono text-[10px] text-muted tracking-widest">ANTI-PHISHING INTELLIGENCE</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setActive(l)}
              className={`text-sm pb-1 border-b ${
                active === l ? "text-white border-white" : "text-muted border-transparent hover:text-white"
              } transition-colors`}
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-2 mono text-[11px] text-muted tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
            CONCEPT BUILD
          </span>
          <a
            href="#roadmap"
            className="flex items-center gap-2 bg-mint text-ink font-semibold text-sm px-4 py-2 rounded-sm hover:bg-mintdim transition-colors"
          >
            Future scope <span>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function EmailPreviewCard() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3 mono text-[11px] text-muted tracking-widest">
        <span className="flex items-center gap-2 text-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse" /> LIVE CONCEPT PREVIEW
        </span>
        <span>LOCAL ANALYSIS &nbsp; M1 / IDENTITY</span>
      </div>
      <div className="bg-panel border border-line rounded-md p-5">
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
              <div className="font-semibold text-sm">Notion updates</div>
              <div className="text-xs text-muted">hello@notion.so</div>
            </div>
          </div>
          <span className="mono text-[10px] bg-mint/15 text-mint px-2 py-1 rounded">SAFE</span>
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
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Read the latest product notes</span>
          <span>→</span>
        </div>
      </div>

      <div className="absolute -bottom-8 -right-8 hidden lg:block bg-panel2 border border-line rounded-md p-4 w-52 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-mint leading-none">94</div>
          <div className="text-[10px] text-muted mono">/100</div>
          <div>
            <div className="text-sm font-semibold">Safe to engage</div>
          </div>
        </div>
        <div className="text-xs text-muted mt-2">No risk signals found in this message.</div>
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1.5 flex-1 rounded bg-mint/70" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="command-center" className="relative bg-fade bg-grid bg-grid overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>PRIVACY-FIRST EMAIL DEFENSE / 01</Eyebrow>
          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
            Trust what <br />
            <span className="text-mint">you're reading.</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">
            A.E.G.I.S. makes phishing risk explainable — right where the decision happens. No black
            boxes. No silent verdicts. Just evidence before you click.
          </p>
          <div className="flex items-center gap-6 mb-8">
            <a href="#overview" className="bg-mint text-ink font-semibold px-5 py-3 rounded-sm hover:bg-mintdim transition-colors flex items-center gap-2">
              Explore the system <span>→</span>
            </a>
            <a href="#boundary" className="text-sm border-b border-white/40 pb-1 flex items-center gap-1">
              Why this matters <span>⌄</span>
            </a>
          </div>
          <div className="flex items-center gap-6 mono text-[11px] text-muted tracking-widest">
            <span className="flex items-center gap-2">
              <span className="text-mint">◆</span> ON-DEVICE ANALYSIS
            </span>
            <span className="flex items-center gap-2">
              <span className="text-mint">🔒</span> CONTENT NEVER UPLOADED
            </span>
          </div>
        </div>
        <EmailPreviewCard />
      </div>
    </section>
  );
}

const MEMBRANES = [
  { id: "M0", icon: "🫆", title: "Trusted sender", desc: "Known contacts stay in control while every message is still checked." },
  { id: "M1", icon: "✅", title: "Identity & auth", desc: "SPF, DMARC, display-name and Reply-To mismatches surface in plain language." },
  { id: "M2", icon: "🌐", title: "Link intelligence", desc: "Lookalikes, redirects, punycode and young domains are exposed before action." },
  { id: "M3", icon: "🔍", title: "Content + files", desc: "Urgency cues and risky filename tricks become visible, not invisible verdicts." },
  { id: "M4", icon: "🎯", title: "User control", desc: "Reversible trust, zones and a Protected Click guard keep the final call with you." },
];

const STATS = [
  { value: "0–100", label: "EXPLAINABLE SCORE" },
  { value: "2", label: "WEBMAIL SURFACES" },
  { value: "0", label: "MESSAGE BODIES UPLOADED" },
  { value: "3", label: "CLEAR OUTCOMES" },
];

function Overview() {
  return (
    <section id="overview" className="max-w-7xl mx-auto px-8 py-28">
      <Eyebrow>SYSTEM OVERVIEW / 02</Eyebrow>
      <h2 className="text-5xl font-semibold leading-tight mb-6">
        A clearer layer <br /> <span className="text-mint">of protection.</span>
      </h2>
      <p className="text-muted text-lg max-w-2xl mb-16">
        A.E.G.I.S. is an explainable, multi-signal phishing intelligence engine. It lives at the
        edge of a decision — private by default, useful by design.
      </p>

      <div className="grid md:grid-cols-3 gap-px bg-line mb-16">
        {MEMBRANES.map((m) => (
          <div key={m.id} className="bg-ink p-6 flex flex-col gap-6">
            <span className="w-11 h-11 rounded-md bg-panel border border-line flex items-center justify-center text-xl">
              {m.icon}
            </span>
            <div>
              <div className="mono text-[11px] text-muted mb-1">MEMBRANE {m.id.slice(1)}</div>
              <div className="font-semibold text-lg mb-2">{m.title}</div>
              <p className="text-sm text-muted">{m.desc}</p>
            </div>
            <div className="flex items-center justify-between mono text-[10px] text-mint tracking-widest border-t border-line pt-4 mt-auto">
              ACTIVE LAYER <span>✓</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-panel p-6">
            <div className="text-3xl font-bold text-mint mb-1">{s.value}</div>
            <div className="mono text-[10px] text-muted tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-panel2 border border-line rounded-md px-6 py-4 mb-8 flex items-center gap-3 text-sm">
        <span className="text-mint">✦</span>
        <span>
          <strong>Not a black box.</strong>{" "}
          <span className="text-muted">
            Every deduction is named, weighted and visible — from a young domain to a suspicious
            attachment filename.
          </span>
        </span>
      </div>

      <a href="#architecture" className="inline-flex items-center gap-2 bg-mint text-ink font-semibold px-5 py-3 rounded-sm hover:bg-mintdim transition-colors">
        Trace the decision path <span>→</span>
      </a>
    </section>
  );
}

const PIPELINE = [
  { id: "M0", title: "Trusted sender", sub: "Local sender history", icon: "🫆", detail: "No reputation penalty. This evidence remains visible in the final score breakdown.", tag: "VERIFIED" },
  { id: "M1", title: "Identity + auth", sub: "SPF / DMARC posture", icon: "✅", detail: "Authentication mismatches are named in plain language, not hidden in headers.", tag: "VERIFIED" },
  { id: "M2", title: "Domain intelligence", sub: "DNS + RDAP lookups", icon: "🌐", detail: "Only the public domain is queried — never message content.", tag: "VERIFIED" },
  { id: "M3", title: "Content + links", sub: "Local pattern checks", icon: "🔍", detail: "Urgency language and risky link patterns are checked entirely on-device.", tag: "VERIFIED" },
  { id: "M4", title: "Decision layer", sub: "Weighted evidence", icon: "🎯", detail: "All membrane evidence rolls into one traceable, explainable score.", tag: "VERIFIED" },
];

const BOUNDARY = [
  { icon: "🔒", title: "Local first", desc: "Message content and analysis stay inside the browser." },
  { icon: "🌐", title: "Domain only", desc: "DNS and RDAP receive public domain lookups only." },
  { icon: "🔔", title: "Opt-in headers", desc: "Provider metadata is an explicit future-scope choice." },
];

function Architecture() {
  const [selected, setSelected] = useState(PIPELINE[0]);
  return (
    <section id="architecture" className="max-w-7xl mx-auto px-8 py-28">
      <Eyebrow>SYSTEM TOPOLOGY / 03</Eyebrow>
      <h2 className="text-5xl font-semibold leading-tight mb-6">
        A membrane for <br /> <span className="text-mint">every signal.</span>
      </h2>
      <p className="text-muted text-lg max-w-2xl mb-16">
        The concept is deliberately layered. Each membrane contributes evidence to one transparent
        decision — without sending message content beyond the browser.
      </p>

      <div className="bg-panel border border-line rounded-md p-6 mb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="mono text-[11px] text-mint tracking-widest mb-1">LIVE CONCEPT MAP</div>
            <div className="font-semibold text-lg">Explainable scan pipeline</div>
          </div>
          <span className="mono text-[10px] border border-line rounded px-3 py-1.5 flex items-center gap-2 text-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" /> ALL SYSTEMS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {PIPELINE.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`text-left p-4 rounded-md border transition-colors ${
                selected.id === p.id ? "border-mint bg-panel2" : "border-line hover:border-mint/40"
              }`}
            >
              <div className="mono text-[11px] text-mint mb-6">{p.id}</div>
              <div className="font-semibold text-sm mb-1">{p.title}</div>
              <div className="text-xs text-muted">{p.sub}</div>
            </button>
          ))}
        </div>

        <div className="border-t border-line pt-6 flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-md bg-panel2 border border-line flex items-center justify-center text-lg">
              {selected.icon}
            </span>
            <div>
              <div className="mono text-[10px] text-muted mb-1">SELECTED MEMBRANE / {selected.id}</div>
              <div className="font-semibold mb-1">{selected.title}</div>
              <p className="text-sm text-muted max-w-xl">{selected.detail}</p>
            </div>
          </div>
          <span className="mono text-[10px] text-mint tracking-widest whitespace-nowrap">{selected.tag}</span>
        </div>
      </div>

      <div id="boundary" className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>THE BOUNDARY</Eyebrow>
          <h3 className="text-4xl font-semibold leading-tight">
            Private by <br /> <span className="text-mint">architecture.</span>
          </h3>
        </div>
        <div className="divide-y divide-line border-t border-b border-line">
          {BOUNDARY.map((b) => (
            <div key={b.title} className="flex items-start gap-4 py-6">
              <span className="text-mint text-xl">{b.icon}</span>
              <div>
                <div className="font-semibold mb-1">{b.title}</div>
                <p className="text-sm text-muted">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const DECISION_CARDS = [
  { id: "M0", title: "Trusted sender", desc: "Known contacts stay in control while every message is still checked.", icon: "🫆" },
  { id: "M1", title: "Identity & auth", desc: "SPF, DMARC, display-name and Reply-To mismatches surface in plain language.", icon: "✅" },
  { id: "M2", title: "Link intelligence", desc: "Lookalikes, redirects, punycode and young domains are exposed before action.", icon: "🌐" },
  { id: "M3", title: "Content + files", desc: "Urgency cues and risky filename tricks become visible, not invisible verdicts.", icon: "🔍" },
];

const PROCESS_STEPS = [
  { n: "01", title: "Email opened", desc: "The message enters the local inspection boundary." },
  { n: "02", title: "Signals collected", desc: "Identity, domain, link and file checks run together." },
  { n: "03", title: "Score computed", desc: "Evidence rolls into a traceable 0–100 trust score." },
  { n: "04", title: "Action explained", desc: "Safe, Warning or Quarantine appears before the click." },
];

function DecisionPath() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="grid md:grid-cols-4 gap-px bg-line mb-24">
        {DECISION_CARDS.map((c) => (
          <div key={c.id} className="bg-panel p-6 hover:bg-panel2 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-10">
              <span className="mono text-xs text-mint">{c.id}</span>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className="font-semibold mb-2">{c.title}</div>
            <p className="text-sm text-muted mb-8">{c.desc}</p>
            <span className="text-muted">↗</span>
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between mb-16">
        <div>
          <Eyebrow>THE DECISION PATH / 03</Eyebrow>
          <h2 className="text-5xl font-semibold">
            From open to <span className="text-mint">understood.</span>
          </h2>
        </div>
        <a href="#architecture" className="text-sm border-b border-white/40 pb-1 whitespace-nowrap hidden md:flex items-center gap-1">
          See full architecture <span>→</span>
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {PROCESS_STEPS.map((s) => (
          <div key={s.n}>
            <div className="mono text-xs text-mint mb-3">{s.n}</div>
            <div className="h-px bg-white/70 mb-6" />
            <div className="font-semibold mb-2">{s.title}</div>
            <p className="text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-8">
      <div className="bg-panel2 border border-line rounded-md px-10 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Eyebrow>BUILT FOR THE MOMENT BEFORE ACTION</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
            Security that respects <br /> <span className="text-mint">your judgment.</span>
          </h2>
        </div>
        <a href="#roadmap" className="bg-mint text-ink font-semibold px-6 py-3 rounded-sm hover:bg-mintdim transition-colors flex items-center gap-2 whitespace-nowrap">
          View future scope <span>→</span>
        </a>
      </div>
    </section>
  );
}

const ROADMAP = [
  { n: "01", tag: "NOW", tagRight: "FOUNDATION", title: "Explainable trust score", desc: "Sender, domain, content, link and attachment signals roll into clear Safe, Warning and Soft Quarantine outcomes." },
  { n: "02", tag: "NEXT", tagRight: "FUTURE SCOPE", title: "Origin trace", desc: "Received-header parsing, originating IP extraction and infrastructure context add a deeper view of message provenance." },
  { n: "03", tag: "LATER", tagRight: "FUTURE SCOPE", title: "Provider metadata", desc: "Opt-in header enrichment adds provider-reported signals on top of the local-first analysis." },
  { n: "04", tag: "LATER", tagRight: "FUTURE SCOPE", title: "Team visibility", desc: "Aggregate, anonymized trends across a workspace, without ever centralizing message content." },
];

function Roadmap() {
  return (
    <section id="roadmap" className="max-w-7xl mx-auto px-8 py-28">
      <Eyebrow>TRAJECTORY / 04</Eyebrow>
      <h2 className="text-5xl font-semibold leading-tight mb-6">
        The next signal <br /> <span className="text-mint">is already forming.</span>
      </h2>
      <p className="text-muted text-lg max-w-2xl mb-16">
        A.E.G.I.S. is designed to grow carefully: more context, not more collection. The roadmap
        keeps privacy and explainability as non-negotiable constraints.
      </p>

      <div className="space-y-0">
        {ROADMAP.map((r, i) => (
          <div key={r.n} className="flex gap-8">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 border border-line text-mint mono text-sm flex items-center justify-center rounded-sm">
                {r.n}
              </div>
              {i < ROADMAP.length - 1 && <div className="w-px flex-1 bg-line" />}
            </div>
            <div className="pb-16 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="mono text-[11px] text-mint tracking-widest">{r.tag}</span>
                <span className="mono text-[10px] text-muted tracking-widest">{r.tagRight}</span>
              </div>
              <div className="text-2xl font-semibold mb-3">{r.title}</div>
              <p className="text-muted max-w-xl">{r.desc}</p>
              {i === 0 && <div className="h-px bg-mint w-40 mt-6" />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md border border-mint/40 flex items-center justify-center text-mint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="text-muted text-sm">
            <span className="text-white font-semibold">A.E.G.I.S.</span> &nbsp;© 2026 A.E.G.I.S. •
            explainable phishing intelligence
          </span>
        </div>
        <span className="mono text-[11px] text-muted tracking-widest flex items-center gap-2">
          no extension linkage <span>🛡</span>
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="hero" className="min-h-screen">
      <Nav />
      <Hero />
      <Overview />
      <Architecture />
      <DecisionPath />
      <CtaBanner />
      <Roadmap />
      <Footer />
    </div>
  );
}
