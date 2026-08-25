import { useEffect, useState } from "react";
import { Reveal } from "./useReveal.jsx";

/* -------------------------------------------------------------------------
 * Shared bits
 * ---------------------------------------------------------------------- */

function Eyebrow({ children, color = "text-mint" }) {
  return (
    <div className={`flex items-center gap-2 mono text-xs tracking-widest ${color} mb-6`}>
      <span className="w-6 h-px bg-current inline-block" />
      {children}
    </div>
  );
}

function ShieldMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Nav — fixed header with a real mobile menu and scroll-spy active state
 * ---------------------------------------------------------------------- */

const NAV_LINKS = [
  { id: "problem", label: "Problem" },
  { id: "overview", label: "How it works" },
  { id: "architecture", label: "Architecture" },
  { id: "ai-model", label: "AI Model" },
  { id: "coverage", label: "Coverage" },
  { id: "boundary", label: "Privacy" },
  { id: "roadmap", label: "Roadmap" },
];

function Nav() {
  const [active, setActive] = useState("problem");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActive(top.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-ink/80 border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-4">
        <a href="#hero" className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-md border border-mint/40 flex items-center justify-center text-mint">
            <ShieldMark />
          </span>
          <div>
            <div className="font-semibold tracking-wide leading-none">A.E.G.I.S.</div>
            <div className="mono text-[10px] text-muted tracking-widest">ANTI-PHISHING INTELLIGENCE</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`text-sm pb-1 border-b transition-colors ${
                active === l.id ? "text-white border-white" : "text-muted border-transparent hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:flex items-center gap-2 mono text-[11px] text-muted tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse-soft" />
            CONCEPT BUILD
          </span>
          <a
            href="#roadmap"
            className="hidden sm:flex items-center gap-2 bg-mint text-ink font-semibold text-sm px-4 py-2 rounded-sm hover:bg-mintdim active:scale-[0.97] transition-all"
          >
            Future scope <span>→</span>
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden w-9 h-9 rounded-md border border-line flex items-center justify-center text-white"
          >
            <div className="relative w-4 h-3">
              <span className={`absolute left-0 top-0 w-4 h-px bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 bottom-0 w-4 h-px bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-line bg-ink transition-[max-height] duration-300 ease-out ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`py-3 text-sm border-b border-line last:border-b-0 ${active === l.id ? "text-mint" : "text-muted"}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#roadmap"
            onClick={() => setOpen(false)}
            className="mt-3 mb-2 flex items-center justify-center gap-2 bg-mint text-ink font-semibold text-sm px-4 py-2.5 rounded-sm"
          >
            Future scope <span>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
 * Hero
 * ---------------------------------------------------------------------- */

function EmailPreviewCard() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3 mono text-[11px] text-muted tracking-widest">
        <span className="flex items-center gap-2 text-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse-soft" /> LIVE CONCEPT PREVIEW
        </span>
        <span className="hidden sm:inline">LOCAL ANALYSIS &nbsp; M1 / IDENTITY</span>
      </div>
      <div className="bg-panel border border-line rounded-md p-5 hover:border-line2 transition-colors">
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

      <div className="absolute -bottom-8 -right-8 hidden lg:block bg-panel2 border border-line rounded-md p-4 w-52 shadow-xl hover:-translate-y-1 transition-transform">
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
    <section id="hero" className="relative bg-fade bg-grid overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>SIH 2026 · PROBLEM STATEMENT 26106 · CYBER SECURITY CELL</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
            Trust what <br />
            <span className="text-mint">you're reading.</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">
            A.E.G.I.S. makes phishing risk explainable — right where the decision happens. No black
            boxes. No silent verdicts. Just evidence before you click.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
            <a href="#overview" className="bg-mint text-ink font-semibold px-5 py-3 rounded-sm hover:bg-mintdim active:scale-[0.97] transition-all flex items-center gap-2">
              Explore the system <span>→</span>
            </a>
            <a href="#boundary" className="text-sm border-b border-white/40 pb-1 flex items-center gap-1 hover:border-white transition-colors">
              Why this matters <span>⌄</span>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mono text-[11px] text-muted tracking-widest">
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

/* -------------------------------------------------------------------------
 * Problem — plain-language framing of PRD Sections 1 & 2
 * ---------------------------------------------------------------------- */

const PROBLEM_POINTS = [
  {
    icon: "🎭",
    title: "Attacks evolved past filters",
    desc: "AI-written language, domain lookalikes and disposable relay infrastructure now slip past static blacklists and rule-based spam filters.",
  },
  {
    icon: "🧩",
    title: "Verdicts without evidence",
    desc: "When a filter does flag something, it rarely says why. Users are left to trust a binary decision they can't inspect or verify.",
  },
  {
    icon: "🕳️",
    title: "No forensic trail",
    desc: "Even when a fraudulent email is identified, most tools can't reconstruct where it came from — no header/relay analysis, no origin trace, no graph-based correlation between senders, IPs and campaigns.",
  },
];

function Problem() {
  return (
    <section id="problem" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <Eyebrow>THE PROBLEM / 00</Eyebrow>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          Email security that blocks, <br className="hidden sm:block" />
          <span className="text-mint">but rarely explains.</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-16">
          Email remains one of the most exploited channels for phishing, impersonation, business email
          compromise and credential theft — across government, education, banking and enterprise. Traditional
          controls weren't built for how convincing this fraud has become.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-px bg-line">
        {PROBLEM_POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 90} className="bg-ink p-6">
            <span className="w-11 h-11 rounded-md bg-panel border border-line flex items-center justify-center text-xl mb-6">
              {p.icon}
            </span>
            <div className="font-semibold text-lg mb-2">{p.title}</div>
            <p className="text-sm text-muted">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Overview — membranes (mapped to real lib/*.js modules) + headline stats
 * ---------------------------------------------------------------------- */

const MEMBRANES = [
  { id: "M0", icon: "🫆", title: "Trusted sender", module: "background.js", desc: "Known contacts stay in control while every message is still checked — trust is reversible, not permanent." },
  { id: "M1", icon: "✅", title: "Identity & auth", module: "senderIdentity.js · doh.js", desc: "SPF/DMARC posture, display-name spoofing and Reply-To mismatches surface in plain language today — DKIM signature validation and Return-Path/Message-ID relay-anomaly checks are the next layer, see Roadmap." },
  { id: "M2", icon: "🌐", title: "Lookalike & link intel", module: "confusables.js · linkAnalysis.js", desc: "Homoglyph domains, redirects, punycode and young/lookalike domains are exposed before you click." },
  { id: "M3", icon: "🔍", title: "Content + attachments", module: "attachmentAnalysis.js", desc: "Social-engineering language and risky filename tricks (double extensions) become visible signals, not invisible verdicts." },
  { id: "M4", icon: "🎯", title: "Explainable score", module: "trustScore.js", desc: "Every membrane's evidence rolls into one weighted, traceable 0–100 score — Safe, Warning or Soft Quarantine." },
];

const STATS = [
  { value: "0–100", label: "EXPLAINABLE SCORE" },
  { value: "2", label: "WEBMAIL SURFACES" },
  { value: "0", label: "MESSAGE BODIES UPLOADED" },
  { value: "3", label: "CLEAR OUTCOMES" },
];

function Overview() {
  return (
    <section id="overview" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <Eyebrow>SYSTEM OVERVIEW / 01</Eyebrow>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          A clearer layer <br /> <span className="text-mint">of protection.</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-16">
          A.E.G.I.S. is an explainable, multi-signal phishing intelligence engine. It lives at the
          edge of a decision — private by default, useful by design — and every membrane below is
          implemented and running in the current build.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-px bg-line mb-16">
        {MEMBRANES.map((m, i) => (
          <Reveal key={m.id} delay={i * 70} className="bg-ink p-6 flex flex-col gap-6">
            <span className="w-11 h-11 rounded-md bg-panel border border-line flex items-center justify-center text-xl">
              {m.icon}
            </span>
            <div>
              <div className="mono text-[11px] text-muted mb-1">MEMBRANE {m.id.slice(1)}</div>
              <div className="font-semibold text-lg mb-2">{m.title}</div>
              <p className="text-sm text-muted mb-3">{m.desc}</p>
              <div className="mono text-[10px] text-mintdim/80 truncate">{m.module}</div>
            </div>
            <div className="flex items-center justify-between mono text-[10px] text-mint tracking-widest border-t border-line pt-4 mt-auto">
              IMPLEMENTED <span>✓</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-panel p-6 hover:bg-panel2 transition-colors">
            <div className="text-3xl font-bold text-mint mb-1">{s.value}</div>
            <div className="mono text-[10px] text-muted tracking-widest">{s.label}</div>
          </div>
        ))}
      </Reveal>

      <Reveal className="bg-panel2 border border-line rounded-md px-6 py-4 mb-8 flex items-start sm:items-center gap-3 text-sm">
        <span className="text-mint">✦</span>
        <span>
          <strong>Not a black box.</strong>{" "}
          <span className="text-muted">
            Every deduction is named, weighted and visible — from a young domain to a suspicious
            attachment filename.
          </span>
        </span>
      </Reveal>

      <a href="#architecture" className="inline-flex items-center gap-2 bg-mint text-ink font-semibold px-5 py-3 rounded-sm hover:bg-mintdim active:scale-[0.97] transition-all">
        Trace the decision path <span>→</span>
      </a>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Architecture — interactive pipeline explorer
 * ---------------------------------------------------------------------- */

const PIPELINE = [
  { id: "M0", title: "Trusted sender", sub: "Local sender history", icon: "🫆", detail: "No reputation penalty for known contacts. This evidence stays visible in the final score breakdown rather than silently skipping checks.", tag: "IMPLEMENTED", module: "background.js" },
  { id: "M1", title: "Identity + auth", sub: "SPF / DMARC posture", icon: "✅", detail: "Authentication mismatches and display-name spoofing are named in plain language, not left buried in raw headers. Deeper protocol forensics — DKIM signature validation, Return-Path/Message-ID anomalies, forged relay detection — are scoped as the next header-module milestone.", tag: "IMPLEMENTED", module: "senderIdentity.js · doh.js" },
  { id: "M2", title: "Domain intelligence", sub: "DNS + RDAP lookups", icon: "🌐", detail: "Only the public sender domain is queried against DNS and RDAP for registration age — never message content.", tag: "IMPLEMENTED", module: "rdap.js" },
  { id: "M3", title: "Content + links", sub: "Local pattern checks", icon: "🔍", detail: "Urgency language, lookalike domains and risky link/attachment patterns are checked entirely on-device.", tag: "IMPLEMENTED", module: "linkAnalysis.js · confusables.js" },
  { id: "M4", title: "Decision layer", sub: "Weighted evidence", icon: "🎯", detail: "All membrane evidence rolls into one traceable, explainable score with a Safe / Warning / Soft Quarantine verdict.", tag: "IMPLEMENTED", module: "trustScore.js" },
];

function Architecture() {
  const [selected, setSelected] = useState(PIPELINE[0]);
  return (
    <section id="architecture" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <Eyebrow>SYSTEM TOPOLOGY / 02</Eyebrow>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          A membrane for <br /> <span className="text-mint">every signal.</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-16">
          The concept is deliberately layered. Each membrane contributes evidence to one transparent
          decision — without sending message content beyond the browser.
        </p>
      </Reveal>

      <Reveal className="bg-panel border border-line rounded-md p-5 sm:p-6 mb-20 sm:mb-24">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <div className="mono text-[11px] text-mint tracking-widest mb-1">LIVE CONCEPT MAP</div>
            <div className="font-semibold text-lg">Explainable scan pipeline</div>
          </div>
          <span className="mono text-[10px] border border-line rounded px-3 py-1.5 flex items-center gap-2 text-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse-soft" /> ALL SYSTEMS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {PIPELINE.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`text-left p-4 rounded-md border transition-all ${
                selected.id === p.id ? "border-mint bg-panel2" : "border-line hover:border-mint/40 hover:bg-panel2/60"
              }`}
            >
              <div className="mono text-[11px] text-mint mb-6">{p.id}</div>
              <div className="font-semibold text-sm mb-1">{p.title}</div>
              <div className="text-xs text-muted">{p.sub}</div>
            </button>
          ))}
        </div>

        <div className="border-t border-line pt-6 flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-md bg-panel2 border border-line flex items-center justify-center text-lg shrink-0">
              {selected.icon}
            </span>
            <div>
              <div className="mono text-[10px] text-muted mb-1">SELECTED MEMBRANE / {selected.id}</div>
              <div className="font-semibold mb-1">{selected.title}</div>
              <p className="text-sm text-muted max-w-xl mb-2">{selected.detail}</p>
              <div className="mono text-[10px] text-mintdim/80">{selected.module}</div>
            </div>
          </div>
          <span className="mono text-[10px] text-mint tracking-widest whitespace-nowrap">{selected.tag}</span>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * AI Model — the NLP/ML classification layer called for explicitly in the
 * problem statement's "Fraudulent Email Detection Engine" component. Kept
 * clearly labeled as planned/hybrid rather than implying a trained model
 * ships today — the deterministic rule engine (trustScore.js) is what's
 * actually live; this section is the honest architecture for what's next.
 * ---------------------------------------------------------------------- */

const AI_CLASSES = [
  { label: "Legitimate", tone: "text-mint" },
  { label: "Suspicious", tone: "text-amber" },
  { label: "Impersonated", tone: "text-amber" },
  { label: "Phishing", tone: "text-rose" },
  { label: "Fraud-related", tone: "text-rose" },
];

const AI_FEATURES = [
  {
    icon: "🧠",
    title: "NLP content classification",
    desc: "A compact semantic model reads subject/body text for urgency cues, impersonation language and reworded social-engineering phrasing — catching phishing language that doesn't match a fixed keyword list.",
  },
  {
    icon: "💼",
    title: "BEC pattern recognition",
    desc: "Trained sub-patterns for business email compromise: payment-redirection requests, fake invoices, executive impersonation and credential-harvesting prompts, labeled explicitly rather than folded into a generic score.",
  },
  {
    icon: "🕸️",
    title: "Graph-based attribution",
    desc: "Sender domains, IPs, ASNs, reply chains and aliases are modeled as a graph so repeated infrastructure and campaign-level clusters become visible, not just isolated per-email verdicts.",
  },
  {
    icon: "📊",
    title: "Confidence, not certainty",
    desc: "Every model output ships as a probability with a confidence band — high/medium/low — the same honesty standard already applied to geolocation and attribution.",
  },
];

function AIModel() {
  return (
    <section id="ai-model" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Eyebrow color="text-amber">AI / ML CLASSIFICATION LAYER</Eyebrow>
          <span className="mono text-[10px] border border-dashed border-amber/60 text-amber rounded px-2.5 py-1">
            PLANNED — SEE ROADMAP
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          Explainable rules today, <br /> <span className="text-mint">a trained model next.</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-6">
          The problem statement calls for AI/ML models that classify each email as legitimate,
          suspicious, impersonated, phishing, or fraud-related. Today's trust score is a deterministic,
          weighted rule engine — fully explainable, but not itself a trained classifier. The next layer
          adds an NLP/ML model on top, without giving up that explainability.
        </p>
      </Reveal>

      <Reveal className="bg-panel border border-line rounded-md p-6 sm:p-8 mb-10">
        <div className="mono text-[11px] text-muted tracking-widest mb-5">MODEL OUTPUT — FIVE-WAY CLASSIFICATION</div>
        <div className="flex flex-wrap gap-3 mb-6">
          {AI_CLASSES.map((c) => (
            <span key={c.label} className={`mono text-xs border border-line rounded-full px-4 py-1.5 ${c.tone}`}>
              {c.label}
            </span>
          ))}
        </div>
        <div className="text-sm text-muted max-w-2xl">
          Each classification is written back into the score as one more named, weighted signal — the
          same pattern used for SPF posture or domain age — so a model verdict never appears as an
          unexplained black-box label.
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-px bg-line">
        {AI_FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 80} className="bg-ink p-6">
            <span className="w-11 h-11 rounded-md bg-panel border border-line flex items-center justify-center text-xl mb-5">
              {f.icon}
            </span>
            <div className="font-semibold text-lg mb-2">{f.title}</div>
            <p className="text-sm text-muted">{f.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-10 bg-panel2 border border-line rounded-md px-6 py-5 flex items-start gap-3 text-sm">
        <span className="text-amber">✦</span>
        <span>
          <strong>Why this stays honest, not marketing:</strong>{" "}
          <span className="text-muted">
            The Coverage section below scores "AI/ML-based classification" at 0% today — the rule
            engine it will sit on top of is what's actually shipped. See{" "}
            <a href="#roadmap" className="text-mint border-b border-mint/40 hover:border-mint">Roadmap</a> for
            the build sequence.
          </span>
        </span>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Coverage — honest current-state percentages, straight from the PRD.
 * This is the section that keeps the whole site honest: nothing here is
 * allowed to imply a roadmap item is live today.
 * ---------------------------------------------------------------------- */

const COVERAGE = [
  { label: "Fraudulent email detection engine (rule-based)", pct: 75 },
  { label: "AI/ML-based content classification (NLP)", pct: 0 },
  { label: "Email header & protocol analysis", pct: 50 },
  { label: "Origin traceability & geolocation", pct: 5 },
  { label: "Identity correlation & attribution (graph-based)", pct: 0 },
  { label: "Alerting, dashboard & forensic reporting", pct: 40 },
  { label: "Privacy, legal & compliance safeguards", pct: 80 },
];

function barColor(pct) {
  if (pct >= 60) return "bg-mint";
  if (pct >= 20) return "bg-amber";
  return "bg-rose";
}

function Coverage() {
  return (
    <section id="coverage" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <Eyebrow>HONEST COVERAGE / 03</Eyebrow>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          What's built <span className="text-mint">today</span>, <br className="hidden sm:block" />
          measured against the problem statement.
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-14">
          Every claim on this site should be traceable to an implemented module or a clearly labeled
          roadmap item — never blurred together. This is that scorecard, mapped directly to Problem
          Statement 26106's stated components.
        </p>
      </Reveal>

      <Reveal className="bg-panel border border-line rounded-md p-6 sm:p-8">
        <div className="space-y-7">
          {COVERAGE.map((c, i) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-2 text-sm gap-4">
                <span>{c.label}</span>
                <span className="mono text-mint shrink-0">{c.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-line overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor(c.pct)} transition-[width] duration-700 ease-out`}
                  style={{ width: `${c.pct}%`, transitionDelay: `${i * 60}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-line flex items-center justify-between flex-wrap gap-3">
          <span className="mono text-xs text-muted tracking-widest">OVERALL, TODAY</span>
          <span className="text-3xl font-bold text-mint">~40%</span>
        </div>
        <p className="text-sm text-muted mt-4">
          Targeting ~85–90% once the AI/ML classifier, deeper header forensics, origin tracing and
          attribution ship — see <a href="#roadmap" className="text-mint border-b border-mint/40 hover:border-mint">Roadmap</a>.
          The AI/ML row is tracked separately from the detection engine's rule-based score above it, so
          it doesn't change the officially reported ~40% overall figure by itself.
        </p>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Boundary / Privacy — what happens locally vs. what leaves the device
 * ---------------------------------------------------------------------- */

const BOUNDARY = [
  { icon: "🔒", title: "Local first", desc: "Message content and analysis stay inside the browser — nothing is uploaded to a server for scoring." },
  { icon: "🌐", title: "Domain only", desc: "DNS and RDAP receive public domain lookups only — never the sender's message body or attachments." },
  { icon: "🔔", title: "Opt-in headers", desc: "Deeper provider metadata (Gmail OAuth) is an explicit, revocable user choice — never default-on." },
  { icon: "🗂️", title: "Evidence-ready logs", desc: "Structured, timestamped metadata logging is designed to support chain-of-custody and configurable retention/masking for institutional review — not a legal chain-of-custody artifact by itself." },
];

const NOT_DO = [
  "Never sends message bodies or attachments to a server",
  "Never shares data across users or organizations",
  "No advertising trackers, no analytics resale, no cross-site tracking",
  "No permission beyond what's declared in the manifest — reviewed per release",
];

function Boundary() {
  return (
    <section id="boundary" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <Reveal>
          <Eyebrow>THE BOUNDARY / 04</Eyebrow>
          <h3 className="text-4xl font-semibold leading-tight mb-8">
            Private by <br /> <span className="text-mint">architecture.</span>
          </h3>
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
        </Reveal>

        <Reveal delay={100} className="bg-panel2 border border-line rounded-md p-6 sm:p-8">
          <div className="mono text-[11px] text-mint tracking-widest mb-4">WHAT A.E.G.I.S. DOES NOT DO</div>
          <ul className="space-y-4">
            {NOT_DO.map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-mint mt-0.5">✕</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Limitations — honest disclosures, deliberately styled differently
 * (dashed/muted) so it reads as distinct from feature claims.
 * ---------------------------------------------------------------------- */

const LIMITATIONS = [
  { title: "Geolocation is approximate", desc: "IP geolocation is typically city-level at best and can mislead for VPN/CDN-fronted infrastructure — surfaced as a confidence label, not an absolute claim, once shipped." },
  { title: "Header tracing can be evaded", desc: "An attacker who fully controls their outbound relay can defeat header-chain tracing. Origin results are framed as \"probable origin,\" never certainty." },
  { title: "Attribution is local-device-scoped", desc: "Campaign correlation runs against this device's own scan history only — there's no shared cross-organization threat-intel feed in the hackathon build." },
  { title: "Outlook has less header depth", desc: "Outlook Web currently exposes less header detail than Gmail's OAuth metadata path. This is a documented gap, not a hidden one." },
];

function Limitations() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20 sm:pb-28">
      <Reveal>
        <Eyebrow color="text-muted">HONEST DISCLOSURES</Eyebrow>
        <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Known limitations, stated up front.</h3>
        <p className="text-muted text-base max-w-2xl mb-10">
          Most hackathon sites hide their limitations. This one owns them — the same discipline the
          product applies to its own scoring.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-5">
        {LIMITATIONS.map((l, i) => (
          <Reveal
            key={l.title}
            delay={i * 70}
            className="border border-dashed border-line rounded-md p-6 hover:border-line2 transition-colors"
          >
            <div className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full border border-muted inline-block" />
              {l.title}
            </div>
            <p className="text-sm text-muted">{l.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Decision path — 4 steps, unchanged in spirit, just polished
 * ---------------------------------------------------------------------- */

const PROCESS_STEPS = [
  { n: "01", title: "Email opened", desc: "The message enters the local inspection boundary." },
  { n: "02", title: "Signals collected", desc: "Identity, domain, link and file checks run together." },
  { n: "03", title: "Score computed", desc: "Evidence rolls into a traceable 0–100 trust score." },
  { n: "04", title: "Action explained", desc: "Safe, Warning or Quarantine appears before the click." },
];

function DecisionPath() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <Reveal className="flex items-start justify-between mb-16 flex-wrap gap-6">
        <div>
          <Eyebrow>THE DECISION PATH / 05</Eyebrow>
          <h2 className="text-4xl sm:text-5xl font-semibold">
            From open to <span className="text-mint">understood.</span>
          </h2>
        </div>
        <a href="#architecture" className="text-sm border-b border-white/40 pb-1 whitespace-nowrap hidden md:flex items-center gap-1 hover:border-white transition-colors">
          See full architecture <span>→</span>
        </a>
      </Reveal>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {PROCESS_STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 80}>
            <div className="mono text-xs text-mint mb-3">{s.n}</div>
            <div className="h-px bg-white/70 mb-6" />
            <div className="font-semibold mb-2">{s.title}</div>
            <p className="text-sm text-muted">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8">
      <Reveal className="bg-panel2 border border-line rounded-md px-6 sm:px-10 py-10 sm:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Eyebrow>BUILT FOR THE MOMENT BEFORE ACTION</Eyebrow>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Security that respects <br /> <span className="text-mint">your judgment.</span>
          </h2>
        </div>
        <a href="#roadmap" className="bg-mint text-ink font-semibold px-6 py-3 rounded-sm hover:bg-mintdim active:scale-[0.97] transition-all flex items-center gap-2 whitespace-nowrap">
          View future scope <span>→</span>
        </a>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Roadmap — grounded directly in the Implementation Document's sprint plan.
 * Item 0 is visually distinct (solid/live) from items 1-3 (outlined/future).
 * ---------------------------------------------------------------------- */

const ROADMAP = [
  {
    n: "00",
    tag: "LIVE",
    tagRight: "IMPLEMENTED",
    title: "Detection & validation engine",
    desc: "Sender identity, SPF/DMARC posture, domain-age intelligence, link and attachment analysis, and the weighted explainable trust score — all running in the current build.",
    live: true,
  },
  {
    n: "01",
    tag: "NEXT",
    tagRight: "FUTURE SCOPE",
    title: "AI/ML classification layer",
    desc: "An NLP/ML model classifying each email as legitimate, suspicious, impersonated, phishing or fraud-related, plus explicit BEC sub-patterns (payment redirection, fake invoices, executive impersonation) — feeding into the score as a labeled signal, not a black box. See the AI Model section above.",
  },
  {
    n: "02",
    tag: "NEXT",
    tagRight: "FUTURE SCOPE",
    title: "Deeper header & protocol forensics",
    desc: "DKIM signature validation, Return-Path and Message-ID anomaly checks, and detection of forged sender fields or manipulated relay paths — extending today's SPF/DMARC posture checks.",
  },
  {
    n: "03",
    tag: "LATER",
    tagRight: "FUTURE SCOPE",
    title: "Origin trace",
    desc: "headerChain.js parses the Received-header stack; ipExtract.js walks the hops to isolate the most likely originating IP, with a confidence label.",
  },
  {
    n: "04",
    tag: "LATER",
    tagRight: "FUTURE SCOPE",
    title: "Geolocation & graph-based attribution",
    desc: "geoIntel.js geolocates the origin IP and flags VPN/proxy/TOR/hosting infrastructure; attribution.js models domains, IPs, ASNs and reply chains as a graph to correlate campaigns, with a searchable case-management view for grouping related fraud attempts.",
  },
];

function Roadmap() {
  return (
    <section id="roadmap" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <Eyebrow>TRAJECTORY / 06</Eyebrow>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          The next signal <br /> <span className="text-mint">is already forming.</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-16">
          A.E.G.I.S. is designed to grow carefully: more context, not more collection. The roadmap
          keeps privacy and explainability as non-negotiable constraints, and mirrors the sprint plan
          in the project's own Implementation Document.
        </p>
      </Reveal>

      <div className="space-y-0">
        {ROADMAP.map((r, i) => (
          <Reveal key={r.n} delay={i * 90} className="flex gap-6 sm:gap-8">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 mono text-sm flex items-center justify-center rounded-sm ${
                  r.live ? "bg-mint text-ink border border-mint" : "border border-dashed border-line text-mint"
                }`}
              >
                {r.n}
              </div>
              {i < ROADMAP.length - 1 && <div className="w-px flex-1 bg-line" />}
            </div>
            <div className="pb-14 sm:pb-16 flex-1">
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <span className={`mono text-[11px] tracking-widest ${r.live ? "text-mint" : "text-amber"}`}>{r.tag}</span>
                <span className="mono text-[10px] text-muted tracking-widest">{r.tagRight}</span>
              </div>
              <div className="text-xl sm:text-2xl font-semibold mb-3">{r.title}</div>
              <p className="text-muted max-w-xl">{r.desc}</p>
              {r.live && <div className="h-px bg-mint w-40 mt-6" />}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Footer
 * ---------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md border border-mint/40 flex items-center justify-center text-mint">
            <ShieldMark size={16} />
          </span>
          <span className="text-muted text-sm text-center md:text-left">
            <span className="text-white font-semibold">A.E.G.I.S.</span> &nbsp;© 2026 Team A.E.G.I.S. •
            explainable phishing intelligence
          </span>
        </div>
        <span className="mono text-[11px] text-muted tracking-widest text-center">
          SIH 2026 · PS 26106 · AICTE Cyber Security Cell
        </span>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------
 * App
 * ---------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Problem />
      <Overview />
      <Architecture />
      <AIModel />
      <Coverage />
      <Boundary />
      <Limitations />
      <DecisionPath />
      <CtaBanner />
      <Roadmap />
      <Footer />
    </div>
  );
}
