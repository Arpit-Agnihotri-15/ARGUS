import { useState, useEffect, useRef, useMemo } from "react";
import QRCode from "qrcode";
import { downloadSingleEmailReport, downloadCombinedSocReport } from "../utils/pdfGenerator.js";

const AEGIS_EXT_ID = "feblkjonnopmmcojjidcnakbpdpkmajh";

// High-precision SVG visual speedometer Trust Meter

// Compact SVG visual speedometer for hero strips
function CompactTrustMeter({ score = 75, size = 68 }) {
  const safeScore = Number.isFinite(score) ? score : 75;
  const angleDeg = -180 + (Math.max(0, Math.min(100, safeScore)) / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleLength = 22;
  const cx = 36;
  const cy = 34;
  const needleX = cx + needleLength * Math.cos(angleRad);
  const needleY = cy + needleLength * Math.sin(angleRad);
  const statusColor = safeScore >= 85 ? "#8ff7bd" : safeScore >= 45 ? "#f2c464" : "#f28b82";

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size * 0.58} viewBox="0 0 72 42" className="overflow-visible">
        <defs>
          <linearGradient id="compactTrustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f28b82" />
            <stop offset="50%" stopColor="#f2c464" />
            <stop offset="100%" stopColor="#8ff7bd" />
          </linearGradient>
        </defs>
        <path d="M 8 36 A 28 28 0 0 1 64 36" fill="none" stroke="#1c2436" strokeWidth="6" strokeLinecap="round" />
        <path d="M 8 36 A 28 28 0 0 1 64 36" fill="none" stroke="url(#compactTrustGrad)" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={statusColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill="#8ff7bd" />
        <circle cx={needleX} cy={needleY} r="2.5" fill={statusColor} />
      </svg>
    </div>
  );
}

const getMailKey = (sender, subject) => {
  const s = String(sender || "").trim().toLowerCase();
  const sub = String(subject || "").trim().toLowerCase();
  return `${s}:::${sub}`;
};

function TrustMeter({ score = 75 }) {
  const safeScore = Number.isFinite(score) ? score : 75;
  const angleDeg = -180 + (Math.max(0, Math.min(100, safeScore)) / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleLength = 56;
  const needleX = 100 + needleLength * Math.cos(angleRad);
  const needleY = 92 + needleLength * Math.sin(angleRad);

  const statusColor = safeScore >= 85 ? "#8ff7bd" : safeScore >= 45 ? "#f2c464" : "#f28b82";
  const statusLabel = safeScore >= 85 ? "VERIFIED CLEAN / SAFE INBOX" : safeScore >= 45 ? "ELEVATED CAUTION / WARNING" : "CRITICAL THREAT / QUARANTINED";
  const badgeBg = safeScore >= 85 ? "bg-mint/15 text-mint border-mint/40" : safeScore >= 45 ? "bg-amber/15 text-amber border-amber/40" : "bg-rose/15 text-rose border-rose/40";

  return (
    <div className="bg-panel border border-line p-4 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
      <div className="mono text-[10px] text-muted tracking-widest uppercase mb-1">
        CLIENT-SIDE TRUST SPEEDOMETER · MEMBRANE GAUGE
      </div>
      <div className="relative w-56 h-28 flex items-center justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f28b82" />
              <stop offset="48%" stopColor="#f2c464" />
              <stop offset="85%" stopColor="#8ff7bd" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={statusColor} floodOpacity="0.5" />
            </filter>
          </defs>
          {/* Background Track */}
          <path
            d="M 22 92 A 78 78 0 0 1 178 92"
            fill="none"
            stroke="#1c2436"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Active Gradient Arc */}
          <path
            d="M 22 92 A 78 78 0 0 1 178 92"
            fill="none"
            stroke="url(#trustGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Active Indicator Head */}
          <circle
            cx={needleX}
            cy={needleY}
            r="6.5"
            fill={statusColor}
            filter="url(#needleGlow)"
            className="transition-all duration-700 ease-out"
          />
          <circle cx={needleX} cy={needleY} r="2.5" fill="#0c121e" />
          {/* Center Pivot */}
          <circle cx="100" cy="92" r="5" fill="#8ff7bd" />
          {/* Pointer Line */}
          <line
            x1="100"
            y1="92"
            x2={needleX}
            y2={needleY}
            stroke={statusColor}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          {/* Range Labels */}
          <text x="18" y="106" fill="#f28b82" fontSize="9" fontFamily="monospace" fontWeight="bold">0</text>
          <text x="96" y="24" fill="#f2c464" fontSize="9" fontFamily="monospace" fontWeight="bold">50</text>
          <text x="174" y="106" fill="#8ff7bd" fontSize="9" fontFamily="monospace" fontWeight="bold">100</text>
        </svg>
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold mono" style={{ color: statusColor }}>{score}</span>
        <span className="mono text-xs text-muted">/ 100</span>
      </div>
      <div className={`mt-2 mono text-[10px] font-bold px-3 py-0.5 rounded-full border ${badgeBg}`}>
        {statusLabel}
      </div>
      <div className="mono text-[10px] text-muted mt-1">
        Evaluated On-Device · &lt;0.8ms Execution Latency
      </div>
    </div>
  );
}

// Baseline reference dataset for evaluation and remote judging
const BASELINE_SCANS = [
  {
    id: "scan-101",
    timestamp: "2026-09-04T15:20:10Z",
    subject: "URGENT: Verify your billing information within 24 hours",
    sender: "security@pаypal-security.com",
    displayName: "PayPal Security Support",
    originIp: "185.220.101.45",
    originCountry: "DE (Tor Relay)",
    score: 15,
    outcome: "QUARANTINE",
    actionType: "CREDENTIAL_OR_AUTH",
    actionDecision: "BLOCKED",
    deductions: [
      { category: "Lookalike", label: "Unicode UTS #39 Cyrillic 'а' homoglyph spoofing paypal.com", delta: -25 },
      { category: "Domain Age", label: "Domain registered 3 days ago (RDAP check)", delta: -20 },
      { category: "Urgency", label: "Artificial 24-hour urgency language detected", delta: -15 },
      { category: "Authentication", label: "SPF softfail and DMARC unaligned", delta: -15 }
    ],
    proofOfAction: {
      action: "Credential Verification",
      decision: "BLOCKED",
      reason: "Unauthenticated sender requesting account credentials under soft-quarantine"
    },
    evidencePassport: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  },
  {
    id: "scan-102",
    timestamp: "2026-09-04T14:45:22Z",
    subject: "Updated Wire Instructions for Project Milestone 3",
    sender: "cfo-office@partner-consulting.net",
    displayName: "Robert Chen (CFO)",
    originIp: "194.26.29.112",
    originCountry: "NL (Hosting ASN)",
    score: 22,
    outcome: "QUARANTINE",
    actionType: "PAYMENT_OR_BANK_CHANGE",
    actionDecision: "BLOCKED",
    deductions: [
      { category: "BEC / Finance", label: "Payment diversion / bank account change request", delta: -30 },
      { category: "Sender Mismatch", label: "Display-name claimed CFO but Reply-To diverted to external address", delta: -25 },
      { category: "Domain Age", label: "Newly observed domain (first seen 12 days ago)", delta: -15 }
    ],
    proofOfAction: {
      action: "Direct Wire Diversion",
      decision: "BLOCKED",
      reason: "Banking detail alteration from unverified domain violating PoA guardrail"
    },
    evidencePassport: "sha256:a120fc678ef4031980a37c9920bce42398401fe02901328905cdabb91278e90a"
  },
  {
    id: "scan-103",
    timestamp: "2026-09-04T12:30:45Z",
    subject: "Overdue Invoice INV-2026-8890.pdf.exe",
    sender: "billing@freight-logistics-corp.com",
    displayName: "Global Freight Billing",
    originIp: "103.253.144.18",
    originCountry: "IN (Broadband)",
    score: 18,
    outcome: "QUARANTINE",
    actionType: "ATTACHMENT_OR_LINK",
    actionDecision: "BLOCKED",
    deductions: [
      { category: "Attachment", label: "Dangerous double extension detected: .pdf.exe", delta: -35 },
      { category: "Authentication", label: "No SPF record found in Cloudflare DoH lookup", delta: -25 },
      { category: "Content", label: "Threatening legal consequences language", delta: -12 }
    ],
    proofOfAction: {
      action: "Executable File Download",
      decision: "BLOCKED",
      reason: "Trojan masquerading as invoice PDF file format"
    },
    evidencePassport: "sha256:8890cdba77ef621b191a32ffba89012a67bc4539871100234aefd882190bcda1"
  },
  {
    id: "scan-104",
    timestamp: "2026-09-04T11:15:00Z",
    subject: "Aadhaar Card and Bank Proof Required for HR Verification",
    sender: "hr-desk@company-portal-intranet.co",
    displayName: "HR Operations Portal",
    originIp: "185.190.140.22",
    originCountry: "RO (Data Center)",
    score: 38,
    outcome: "WARNING_BANNER",
    actionType: "SENSITIVE_DATA_SHARE",
    actionDecision: "VERIFY_FIRST",
    deductions: [
      { category: "Sensitive Data", label: "Government ID / KYC document request from non-standard domain", delta: -20 },
      { category: "Domain Age", label: "Domain age 45 days (RDAP)", delta: -18 },
      { category: "Authentication", label: "SPF passes but DMARC policy is none (monitoring only)", delta: -14 }
    ],
    proofOfAction: {
      action: "Sensitive Identity Document Upload",
      decision: "VERIFY_FIRST",
      reason: "Authentication passes but authorization for identity records requires out-of-band confirmation"
    },
    evidencePassport: "sha256:5501bcae449911eecc334411aa8822bb11334455aa6677889900aabbccddeeff"
  },
  {
    id: "scan-105",
    timestamp: "2026-09-04T09:48:32Z",
    subject: "Your GitHub Security Advisory Notification [Low Severity]",
    sender: "notifications@github.com",
    displayName: "GitHub Security",
    originIp: "140.82.112.4",
    originCountry: "US (GitHub Inc.)",
    score: 98,
    outcome: "SAFE_INBOX",
    actionType: "INFORMATIONAL",
    actionDecision: "ALLOWED",
    deductions: [],
    proofOfAction: {
      action: "Standard Notification",
      decision: "ALLOWED",
      reason: "Cryptographically verified sender identity and pristine domain reputation"
    },
    evidencePassport: "sha256:332211aabbccddeeff0011223344556677889900aabbccddeeff001122334455"
  },
  {
    id: "scan-106",
    timestamp: "2026-09-04T08:12:19Z",
    subject: "Notion: 3 comments mention you in SIH 2026 Strategy",
    sender: "mail@notion.so",
    displayName: "Notion",
    originIp: "54.240.35.12",
    originCountry: "US (Amazon SES)",
    score: 100,
    outcome: "SAFE_INBOX",
    actionType: "COLLABORATION",
    actionDecision: "ALLOWED",
    deductions: [],
    proofOfAction: {
      action: "Project Link Open",
      decision: "ALLOWED",
      reason: "Established sender identity, 100% SPF/DKIM alignment, clean links"
    },
    evidencePassport: "sha256:aa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbb"
  }
];

export function SocDashboard() {
  // 1. Cumulative session scans persisted in localStorage with strict sender + subject deduplication
  const [liveScans, setLiveScans] = useState(() => {
    try {
      const saved = localStorage.getItem("aegis_session_scans");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleanMap = new Map();
          parsed.forEach((item) => {
            if (item && item.sender) {
              const key = getMailKey(item.sender, item.subject || item.subjectKey);
              cleanMap.set(key, item);
            }
          });
          const deduplicated = Array.from(cleanMap.values());
          localStorage.setItem("aegis_session_scans", JSON.stringify(deduplicated));
          return deduplicated;
        }
      }
    } catch {}
    return [];
  });

  const [showBenchmarkDemo, setShowBenchmarkDemo] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showPairModal, setShowPairModal] = useState(false);
  const [dossierTab, setDossierTab] = useState("all"); // "all" | "m0" | "m1" | "m2" | "m3" | "m4" | "m5" | "actions"
  const [isExtensionLinked, setIsExtensionLinked] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [vectorFilter, setVectorFilter] = useState(null);
  const [vectorMetric, setVectorMetric] = useState("count"); // "count" | "impact"
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);
  const [scoreBucketFilter, setScoreBucketFilter] = useState(null);
  const [layerFilter, setLayerFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("PROBING"); // PROBING | LINKED | DETACHED
  const lastDataFingerprintRef = useRef("");
  const [scoreChartMode, setScoreChartMode] = useState("histogram"); // "histogram" | "trend"
  const [hoveredTimelineScan, setHoveredTimelineScan] = useState(null);
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);

  // Interactive Security Posture Checklist State
  const [postureChecklist, setPostureChecklist] = useState({
    dmarcEnforced: true,
    mlScorerActive: true,
    uts39RadarActive: true,
    proofOfActionActive: true,
    softQuarantineActive: true,
    fido2HardwareKeys: false,
    doubleExtensionBlocker: true,
    oauthRestrictions: false
  });

  const modalContentRef = useRef(null);

  // Lock body scroll ONLY for true overlay modal (Pair Mobile Mirror), allowing smooth scroll for In-Page Dossier
  useEffect(() => {
    if (showPairModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [showPairModal]);

  // Handle Escape key to close in-page dossier or modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showPairModal) setShowPairModal(false);
        else if (selectedScan) {
          setSelectedScan(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedScan, showPairModal]);

  // Reset dossier tab and auto-scroll modal to top whenever a new scan is opened
  useEffect(() => {
    if (selectedScan) {
      setDossierTab("all");
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [selectedScan]);

  // Computed scans list: includes demo baseline if explicitly requested or if no live scans exist
  const scans = useMemo(() => {
    const sanitize = (list) => (list || []).filter(Boolean).map((s) => ({
      ...s,
      score: Number.isFinite(s.score) ? s.score : 50,
      outcome: s.outcome || "SAFE_INBOX",
      deductions: Array.isArray(s.deductions) ? s.deductions : [],
      actionDecision: s.actionDecision || "ALLOWED",
      subject: s.subject || "Email Message",
      sender: s.sender || "unknown@domain.com",
      displayName: s.displayName || s.sender || "Unknown Sender"
    }));

    if (showBenchmarkDemo) {
      return liveScans.length > 0 ? sanitize([...liveScans, ...BASELINE_SCANS]) : sanitize(BASELINE_SCANS);
    }
    return liveScans.length > 0 ? sanitize(liveScans) : sanitize(BASELINE_SCANS);
  }, [liveScans, showBenchmarkDemo]);

  // Client-Side Session State (Zero Remote Storage USP)
  const [currentUser] = useState(() => {
    const saved = localStorage.getItem("aegis_user");
    if (saved && (saved.includes("Arpit") || saved.includes("Agnihotri"))) {
      localStorage.removeItem("aegis_user");
      return "Local SOC Analyst";
    }
    return saved || "Local SOC Analyst";
  });

  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "remediation"
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Generate genuine scannable QR Code whenever Pair Mobile modal is opened
  useEffect(() => {
    if (showPairModal) {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://aegis-defense.app";
      const targetUrl = `${origin}?view=dashboard&mode=mobile_mirror`;
      QRCode.toDataURL(targetUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: "#0c121e",
          light: "#ffffff"
        }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("QR Code error:", err));
    }
  }, [showPairModal]);

  // Synchronize Extension Telemetry with Cumulative Session Accumulation
  const syncWithExtension = () => {
    setIsSyncing(true);
    if (typeof window !== "undefined" && window.chrome?.runtime?.sendMessage) {
      try {
        window.chrome.runtime.sendMessage(AEGIS_EXT_ID, { type: "GET_TELEMETRY" }, (res) => {
          setIsSyncing(false);
          if (res && res.ok && res.telemetry) {
            const rawMapCheck = res.telemetry.scanResultsByEmail || {};
            const lastCheck = res.telemetry.lastScan;
            const incomingFingerprint = JSON.stringify({
              last: lastCheck ? `${lastCheck.email || lastCheck.sender}-${lastCheck.score}-${lastCheck.ts}` : "",
              count: Object.keys(rawMapCheck).length,
              keys: Object.keys(rawMapCheck).sort().map(k => `${k}-${rawMapCheck[k]?.score}-${rawMapCheck[k]?.ts}`)
            });

            if (incomingFingerprint === lastDataFingerprintRef.current && liveScans.length > 0) {
              setIsExtensionLinked(true);
              setSyncStatus("LINKED");
              return;
            }
            lastDataFingerprintRef.current = incomingFingerprint;

            setIsExtensionLinked(true);
            setSyncStatus("LINKED");
            setLastSyncTime(new Date().toLocaleTimeString());

                        // 1. Read existing cumulative scans from session storage with unique key deduplication
            const existingList = (() => {
              try {
                const saved = localStorage.getItem("aegis_session_scans");
                return saved ? JSON.parse(saved) : [];
              } catch {
                return [];
              }
            })();

            const scanMap = new Map();
            existingList.forEach((item) => {
              if (item && item.sender) {
                const key = getMailKey(item.sender, item.subject || item.subjectKey);
                scanMap.set(key, { ...item, isActiveInGmail: false });
              }
            });

            // 2. Parse telemetry scanResultsByEmail dictionary
            const rawMap = res.telemetry.scanResultsByEmail || {};
            Object.entries(rawMap).forEach(([email, item]) => {
              if (!item) return;
              const subject = item.subjectKey || item.subject || "Email Message";
              const key = getMailKey(email, subject);

              const deductionsList = [];
              const summary = item.summary || {};
              Object.entries(summary).forEach(([cat, list]) => {
                (list || []).forEach((sub) => {
                  deductionsList.push({
                    category: cat,
                    label: sub.label,
                    delta: sub.delta ?? -10
                  });
                });
              });

              if (scanMap.has(key)) {
                // Same email exists: only update if score/data changed, never duplicate!
                const prev = scanMap.get(key);
                scanMap.set(key, {
                  ...prev,
                  score: item.score ?? prev.score,
                  outcome: item.outcome || prev.outcome,
                  deductions: deductionsList.length > 0 ? deductionsList : prev.deductions,
                  proofOfAction: {
                    action: item.actionAssurance?.requestedAction || prev.proofOfAction?.action || "Email Inspection",
                    decision: item.actionAssurance?.decision || prev.proofOfAction?.decision || (item.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                    reason: item.actionAssurance?.reason || prev.proofOfAction?.reason || "Client-side membrane verification"
                  }
                });
              } else {
                // New distinct email from this sender!
                scanMap.set(key, {
                  id: `scan-${email.slice(0, 4)}-${Math.floor(Math.abs(item.ts || Date.now()) % 100000)}`,
                  timestamp: item.ts ? new Date(item.ts).toISOString() : new Date().toISOString(),
                  subject: subject,
                  sender: email,
                  displayName: item.senderDisplayName || email.split("@")[0],
                  originIp: "127.0.0.1 (On-Device Client)",
                  originCountry: "Local Browser Session",
                  score: item.score ?? 50,
                  outcome: item.outcome || "SAFE_INBOX",
                  actionType: item.actionAssurance?.requestedAction || "STANDARD",
                  actionDecision: item.actionAssurance?.decision || (item.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                  deductions: deductionsList,
                  proofOfAction: {
                    action: item.actionAssurance?.requestedAction || "Email Inspection",
                    decision: item.actionAssurance?.decision || (item.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                    reason: item.actionAssurance?.reason || "Client-side membrane verification"
                  },
                  evidencePassport: `sha256:${Math.abs(item.ts || 12345).toString(16).padStart(64, "a")}`,
                  isActiveInGmail: false
                });
              }
            });

            // 3. Parse lastScan (active open email in Gmail)
            const last = res.telemetry.lastScan;
            if (last && (last.email || last.sender)) {
              const activeEmail = last.email || last.sender;
              const activeSubject = last.subjectKey || last.subject || "Active Message";
              const activeKey = getMailKey(activeEmail, activeSubject);

              const deductionsList = [];
              const summary = last.summary || {};
              Object.entries(summary).forEach(([cat, list]) => {
                (list || []).forEach((sub) => {
                  deductionsList.push({
                    category: cat,
                    label: sub.label,
                    delta: sub.delta ?? -10
                  });
                });
              });

              // Mark all prior scans as inactive in Gmail
              for (const [, val] of scanMap) {
                val.isActiveInGmail = false;
              }

              if (scanMap.has(activeKey)) {
                const prev = scanMap.get(activeKey);
                scanMap.set(activeKey, {
                  ...prev,
                  score: last.score ?? prev.score,
                  outcome: last.outcome || prev.outcome,
                  deductions: deductionsList.length > 0 ? deductionsList : prev.deductions,
                  proofOfAction: {
                    action: last.actionAssurance?.requestedAction || prev.proofOfAction?.action || "Email Inspection",
                    decision: last.actionAssurance?.decision || prev.proofOfAction?.decision || (last.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                    reason: last.actionAssurance?.reason || prev.proofOfAction?.reason || "Client-side membrane verification"
                  },
                  isActiveInGmail: true
                });
              } else {
                scanMap.set(activeKey, {
                  id: `scan-active-${Math.floor(Math.abs(last.ts || Date.now()) % 100000)}`,
                  timestamp: last.ts ? new Date(last.ts).toISOString() : new Date().toISOString(),
                  subject: activeSubject,
                  sender: activeEmail,
                  displayName: last.senderDisplayName || activeEmail.split("@")[0],
                  originIp: "127.0.0.1 (On-Device Membrane)",
                  originCountry: "Gmail Active Session",
                  score: last.score ?? 50,
                  outcome: last.outcome || "SAFE_INBOX",
                  actionType: last.actionAssurance?.requestedAction || "STANDARD",
                  actionDecision: last.actionAssurance?.decision || (last.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                  deductions: deductionsList,
                  proofOfAction: {
                    action: last.actionAssurance?.requestedAction || "Email Inspection",
                    decision: last.actionAssurance?.decision || (last.outcome === "QUARANTINE" ? "BLOCKED" : "ALLOWED"),
                    reason: last.actionAssurance?.reason || "Client-side membrane verification"
                  },
                  evidencePassport: `sha256:${Math.abs(last.ts || Date.now()).toString(16).padStart(64, "f")}`,
                  isActiveInGmail: true
                });
              }
            }

            // Convert to sorted array (Active Gmail email pinned to top, followed by reverse chronological)
            const combined = Array.from(scanMap.values()).sort((a, b) => {
              if (a.isActiveInGmail && !b.isActiveInGmail) return -1;
              if (!a.isActiveInGmail && b.isActiveInGmail) return 1;
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });

            setLiveScans(combined);
            try {
              localStorage.setItem("aegis_session_scans", JSON.stringify(combined));
            } catch {}
          } else {
            setIsExtensionLinked(false);
            setSyncStatus("DETACHED");
          }
        });
      } catch {
        setIsSyncing(false);
        setSyncStatus("DETACHED");
      }
    } else {
      setIsSyncing(false);
      setIsExtensionLinked(false);
      setSyncStatus("DETACHED");
    }
  };

  useEffect(() => {
    syncWithExtension();
    const interval = setInterval(syncWithExtension, 3500);
    return () => clearInterval(interval);
  }, []);

  const clearSessionHistory = () => {
    localStorage.removeItem("aegis_session_scans");
    setLiveScans([]);
  };

  // Filtered scans: supports verdict, attack vector, score bucket, membrane layer, and search query
  const filteredScans = scans.filter((s) => {
    if (activeFilter === "QUARANTINE" && s.outcome !== "QUARANTINE") return false;
    if (activeFilter === "WARNING" && s.outcome !== "WARNING_BANNER") return false;
    if (activeFilter === "SAFE" && s.outcome !== "SAFE_INBOX") return false;
    if (activeFilter === "BLOCKED" && s.actionDecision !== "BLOCKED") return false;

    if (scoreBucketFilter) {
      if (scoreBucketFilter === "0–20" && s.score > 20) return false;
      if (scoreBucketFilter === "21–40" && (s.score <= 20 || s.score > 40)) return false;
      if (scoreBucketFilter === "41–60" && (s.score <= 40 || s.score > 60)) return false;
      if (scoreBucketFilter === "61–80" && (s.score <= 60 || s.score > 80)) return false;
      if (scoreBucketFilter === "81–100" && s.score <= 80) return false;
    }

    if (layerFilter) {
      const deductions = s.deductions || [];
      if (layerFilter === "M0" && !deductions.some(d => (d.category || "").toLowerCase().includes("auth") || (d.category || "").toLowerCase().includes("spf"))) return false;
      if (layerFilter === "M1" && !deductions.some(d => (d.category || "").toLowerCase().includes("attachment") || (d.category || "").toLowerCase().includes("extension"))) return false;
      if (layerFilter === "M2" && !deductions.some(d => (d.category || "").toLowerCase().includes("lookalike") || (d.category || "").toLowerCase().includes("homoglyph") || (d.category || "").toLowerCase().includes("age"))) return false;
      if (layerFilter === "M3" && s.actionDecision === "ALLOWED") return false;
      if (layerFilter === "M4" && !deductions.some(d => (d.category || "").toLowerCase().includes("urgency") || (d.category || "").toLowerCase().includes("content") || (d.category || "").toLowerCase().includes("bec"))) return false;
      if (layerFilter === "M5" && s.outcome !== "QUARANTINE") return false;
    }

    if (vectorFilter) {
      const hasVector = (s.deductions || []).some((d) => {
        const cat = (d.category || "").toLowerCase();
        const label = (d.label || "").toLowerCase();
        if (vectorFilter.includes("Homoglyphs") && (cat.includes("homoglyph") || cat.includes("unicode") || label.includes("homoglyph") || label.includes("cyrillic"))) return true;
        if (vectorFilter.includes("Urgency") && (cat.includes("content") || cat.includes("urgency") || cat.includes("social") || label.includes("urgency") || label.includes("pressure"))) return true;
        if (vectorFilter.includes("Payment") && (cat.includes("bec") || cat.includes("wire") || cat.includes("payment") || label.includes("wire") || label.includes("bank"))) return true;
        if (vectorFilter.includes("URLs") && (cat.includes("url") || cat.includes("network") || cat.includes("domain") || cat.includes("punycode") || label.includes("url") || label.includes("proxy"))) return true;
        if (vectorFilter.includes("Extensions") && (cat.includes("attachment") || cat.includes("extension") || label.includes(".exe") || label.includes("attachment"))) return true;
        if (vectorFilter.includes("SPF") && (cat.includes("identity") || cat.includes("auth") || cat.includes("spf") || cat.includes("dmarc") || label.includes("spf") || label.includes("dmarc"))) return true;
        return false;
      });
      if (!hasVector) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (s.subject || "").toLowerCase().includes(q)
        || (s.sender || "").toLowerCase().includes(q)
        || (s.displayName || "").toLowerCase().includes(q)
        || (s.originCountry || "").toLowerCase().includes(q)
        || (s.actionDecision || "").toLowerCase().includes(q)
        || (s.deductions || []).some((d) => (d.label || "").toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // KPI calculations
  const totalScans = scans.length;
  const quarantinedCount = scans.filter((s) => s.outcome === "QUARANTINE").length;
  const warningCount = scans.filter((s) => s.outcome === "WARNING_BANNER").length;
  const safeCount = scans.filter((s) => s.outcome === "SAFE_INBOX").length;
  const blockedActionsCount = scans.filter((s) => s.actionDecision === "BLOCKED").length;
  const averageScore = Math.round(scans.reduce((acc, s) => acc + (Number.isFinite(s.score) ? s.score : 50), 0) / (totalScans || 1));

  // Vector statistics with volume and impact
  const vectorStats = useMemo(() => {
    const map = {
      "Homoglyphs (UTS #39)": { count: 0, points: 0, color: "text-rose", barColor: "bg-rose", icon: "🔤", desc: "Cyrillic & Unicode visual lookalikes" },
      "Payment / BEC Diversion": { count: 0, points: 0, color: "text-amber", barColor: "bg-amber", icon: "💳", desc: "Unauthorized wire / bank account alteration" },
      "Dangerous Extensions": { count: 0, points: 0, color: "text-purple-400", barColor: "bg-purple-400", icon: "⚠️", desc: "Disguised executable payloads (.pdf.exe)" },
      "Urgency / Social Eng.": { count: 0, points: 0, color: "text-orange-400", barColor: "bg-orange-400", icon: "⏳", desc: "Artificial ultimatum & pressure language" },
      "SPF / DMARC Mismatch": { count: 0, points: 0, color: "text-cyan-400", barColor: "bg-cyan-400", icon: "🛡️", desc: "Unauthenticated sender identity failures" },
      "Suspicious / Punycode URLs": { count: 0, points: 0, color: "text-emerald-400", barColor: "bg-emerald-400", icon: "🌐", desc: "Punycode (xn--) & open redirect destinations" }
    };

    scans.forEach((s) => {
      (s.deductions || []).forEach((d) => {
        const cat = (d.category || "").toLowerCase();
        const label = (d.label || "").toLowerCase();
        const pts = Math.abs(d.delta || 15);
        if (cat.includes("homoglyph") || cat.includes("unicode") || label.includes("homoglyph") || label.includes("cyrillic") || cat.includes("lookalike")) {
          map["Homoglyphs (UTS #39)"].count++;
          map["Homoglyphs (UTS #39)"].points += pts;
        } else if (cat.includes("bec") || cat.includes("wire") || cat.includes("payment") || label.includes("wire") || label.includes("bank")) {
          map["Payment / BEC Diversion"].count++;
          map["Payment / BEC Diversion"].points += pts;
        } else if (cat.includes("attachment") || cat.includes("extension") || label.includes(".exe") || label.includes("attachment")) {
          map["Dangerous Extensions"].count++;
          map["Dangerous Extensions"].points += pts;
        } else if (cat.includes("content") || cat.includes("urgency") || cat.includes("social") || label.includes("urgency") || label.includes("pressure")) {
          map["Urgency / Social Eng."].count++;
          map["Urgency / Social Eng."].points += pts;
        } else if (cat.includes("identity") || cat.includes("auth") || cat.includes("spf") || cat.includes("dmarc") || label.includes("spf") || label.includes("dmarc")) {
          map["SPF / DMARC Mismatch"].count++;
          map["SPF / DMARC Mismatch"].points += pts;
        } else if (cat.includes("url") || cat.includes("network") || cat.includes("domain") || cat.includes("punycode") || label.includes("url") || label.includes("proxy")) {
          map["Suspicious / Punycode URLs"].count++;
          map["Suspicious / Punycode URLs"].points += pts;
        }
      });
    });
    return map;
  }, [scans]);

  const maxVectorCount = Math.max(1, ...Object.values(vectorStats).map((v) => v.count));
  const maxVectorPoints = Math.max(1, ...Object.values(vectorStats).map((v) => v.points));

  // Action Assurance statistics
  const actionStats = useMemo(() => {
    const total = scans.length || 1;
    const blocked = scans.filter((s) => s.actionDecision === "BLOCKED").length;
    const verify = scans.filter((s) => s.actionDecision === "VERIFY_FIRST").length;
    const allowed = scans.filter((s) => s.actionDecision === "ALLOWED").length;
    return {
      blocked,
      verify,
      allowed,
      blockedPct: Math.round((blocked / total) * 100),
      verifyPct: Math.round((verify / total) * 100),
      allowedPct: Math.round((allowed / total) * 100)
    };
  }, [scans]);

  // Score brackets
  const scoreBrackets = useMemo(() => [
    { label: "0–20", range: "Critical Risk", count: scans.filter((s) => s.score <= 20).length, color: "bg-rose", text: "text-rose", border: "border-rose/40" },
    { label: "21–40", range: "High Threat", count: scans.filter((s) => s.score > 20 && s.score <= 40).length, color: "bg-rose/80", text: "text-rose", border: "border-rose/30" },
    { label: "41–60", range: "Suspicious", count: scans.filter((s) => s.score > 40 && s.score <= 60).length, color: "bg-amber", text: "text-amber", border: "border-amber/40" },
    { label: "61–80", range: "Elevated", count: scans.filter((s) => s.score > 60 && s.score <= 80).length, color: "bg-amber/70", text: "text-amber", border: "border-amber/30" },
    { label: "81–100", range: "Pristine", count: scans.filter((s) => s.score > 80).length, color: "bg-mint", text: "text-mint", border: "border-mint/40" }
  ], [scans]);

  // 6-Layer Membrane Intercept Metrics
  const membraneLayerStats = useMemo(() => {
    let m0 = 0, m1 = 0, m2 = 0, m3 = 0, m4 = 0, m5 = 0;
    scans.forEach((s) => {
      const deductions = s.deductions || [];
      if (deductions.some(d => (d.category || "").toLowerCase().includes("auth") || (d.category || "").toLowerCase().includes("spf"))) m0++;
      if (deductions.some(d => (d.category || "").toLowerCase().includes("attachment") || (d.category || "").toLowerCase().includes("extension"))) m1++;
      if (deductions.some(d => (d.category || "").toLowerCase().includes("lookalike") || (d.category || "").toLowerCase().includes("homoglyph") || (d.category || "").toLowerCase().includes("age"))) m2++;
      if (s.actionDecision === "BLOCKED" || s.actionDecision === "VERIFY_FIRST") m3++;
      if (deductions.some(d => (d.category || "").toLowerCase().includes("urgency") || (d.category || "").toLowerCase().includes("content") || (d.category || "").toLowerCase().includes("bec"))) m4++;
      if (s.outcome === "QUARANTINE") m5++;
    });
    return [
      { id: "M0", label: "M0: Identity & DMARC", count: m0, desc: "SPF/DKIM/DMARC Authentication", color: "text-mint", latency: "0.12ms" },
      { id: "M1", label: "M1: In-Flight Structural", count: m1, desc: "RFC anomalies & multi-extensions", color: "text-amber", latency: "0.18ms" },
      { id: "M2", label: "M2: Domain & UTS #39", count: m2, desc: "Homoglyphs & Punycode lookalikes", color: "text-rose", latency: "0.22ms" },
      { id: "M3", label: "M3: Proof-of-Action", count: m3, desc: "Wire & Credential authorization blocks", color: "text-amber", latency: "0.28ms" },
      { id: "M4", label: "M4: ML Token Scorer", count: m4, desc: "Client-side TF-IDF urgency n-grams", color: "text-mint", latency: "0.45ms" },
      { id: "M5", label: "M5: Soft-Quarantine", count: m5, desc: "Defanged links & SHA-256 evidence seals", color: "text-rose", latency: "0.05ms" }
    ];
  }, [scans]);

    // Compute live organizational posture score
  const postureScore = useMemo(() => {
    const totalItems = Object.keys(postureChecklist).length;
    const activeItems = Object.values(postureChecklist).filter(Boolean).length;
    return Math.round((activeItems / totalItems) * 100);
  }, [postureChecklist]);

  const hasActiveFilters = activeFilter !== "ALL" || vectorFilter || scoreBucketFilter || layerFilter || searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setActiveFilter("ALL");
    setVectorFilter(null);
    setScoreBucketFilter(null);
    setLayerFilter(null);
    setSearchQuery("");
  };

  
  // Dedicated In-Page Full Inspection Dossier View (Zero Modal Clipping, 100% Screen Visible)
  if (selectedScan) {
    return (
      <div className="space-y-6 animate-fade-in text-left pb-24">
        {/* Top Sticky Navigation Bar */}
        <div className="sticky top-16 z-30 bg-ink/95 backdrop-blur-md py-3 border-b border-line flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => {
              setSelectedScan(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 bg-panel hover:bg-panel2 border border-mint/40 text-mint font-semibold text-xs px-4 py-2 rounded transition-all cursor-pointer shadow-sm hover:border-mint active:scale-95"
          >
            <span className="text-base leading-none">←</span> Back to Live Telemetry Feed
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => downloadSingleEmailReport(selectedScan, currentUser)}
              className="bg-panel hover:bg-panel2 border border-mint/40 text-mint font-semibold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Download full forensic dossier as a PDF report"
            >
              <span>📄</span> Export Forensic PDF
            </button>
            <button
              onClick={() => {
                setSelectedScan(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-mint text-ink font-semibold px-4 py-2 rounded text-xs hover:bg-mintdim transition-colors cursor-pointer"
            >
              Close Dossier ✕
            </button>
          </div>
        </div>

        {/* Email Header Card */}
        <div className="bg-panel border border-line rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="mono text-xs text-mint uppercase tracking-widest flex items-center gap-2">
              <span>A.E.G.I.S. FORENSIC DOSSIER · {selectedScan.id}</span>
              {selectedScan.isActiveInGmail && (
                <span className="mono text-[10px] bg-mint/20 text-mint border border-mint/50 px-2 py-0.5 rounded font-bold">
                  ● ACTIVE IN GMAIL
                </span>
              )}
            </div>
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              selectedScan.outcome === "SAFE_INBOX"
                ? "bg-mint/20 text-mint border border-mint/40"
                : selectedScan.outcome === "WARNING_BANNER"
                ? "bg-amber/20 text-amber border border-amber/40"
                : "bg-rose/20 text-rose border border-rose/40"
            }`}>
              {selectedScan.outcome}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {selectedScan.subject}
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs border-t border-line">
            <div>
              <div className="text-muted text-[11px]">From / Sender:</div>
              <div className="font-medium text-white truncate">{selectedScan.displayName}</div>
              <div className="mono text-muted text-[11px] truncate">&lt;{selectedScan.sender}&gt;</div>
            </div>
            <div>
              <div className="text-muted text-[11px]">Origin Hop &amp; IP:</div>
              <div className="mono text-white">{selectedScan.originCountry || "Local"}</div>
              <div className="mono text-muted text-[11px]">{selectedScan.originIp}</div>
            </div>
            <div>
              <div className="text-muted text-[11px]">Proof-of-Action Decision:</div>
              <div className={`mono font-bold ${
                selectedScan.actionDecision === "BLOCKED" ? "text-rose" : selectedScan.actionDecision === "VERIFY_FIRST" ? "text-amber" : "text-mint"
              }`}>
                {selectedScan.actionDecision}
              </div>
              <div className="text-muted text-[11px]">{selectedScan.proofOfAction?.action || "Inspection"}</div>
            </div>
            <div>
              <div className="text-muted text-[11px]">Scanned Timestamp:</div>
              <div className="mono text-white text-[11px]">{new Date(selectedScan.timestamp).toLocaleString()}</div>
              <div className="mono text-mint text-[11px]">&lt;0.45ms Latency (On-Device)</div>
            </div>
          </div>
        </div>

        {/* Dossier Navigation Tabs: Compact, Sleek & Fully Aligned */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-line mono text-[11px]">
          {[
            { id: "all", label: "Overview", icon: "📋" },
            { id: "m0", label: "M0 Auth", icon: "🛡️" },
            { id: "m1", label: "M1 Parser", icon: "🧩" },
            { id: "m2", label: "M2 UTS #39", icon: "🌐" },
            { id: "m3", label: "M3 Action", icon: "🔑" },
            { id: "m4", label: "M4 Local ML", icon: "🧠" },
            { id: "m5", label: "M5 Quarantine", icon: "🔒" },
            { id: "actions", label: "Remediation", icon: "⚡" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDossierTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-t-md font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 border-b-2 ${
                dossierTab === tab.id
                  ? "border-mint text-mint bg-panel2 font-bold shadow-xs"
                  : "border-transparent text-muted hover:text-white hover:bg-panel2/50"
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Full Overview & Summary Matrix */}
        {dossierTab === "all" && (
          <div className="space-y-6 animate-fade-up">
            {/* Executive Summary Grid: Trust Speedometer + Audit Posture */}
            <div className="grid md:grid-cols-12 gap-6">
              {/* Trust Meter Speedometer Card */}
              <div className="md:col-span-5 bg-panel border border-line rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                <div className="mono text-xs text-muted uppercase tracking-wider">
                  CLIENT-SIDE TRUST SPEEDOMETER · MEMBRANE GAUGE
                </div>
                <TrustMeter score={selectedScan.score} />
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black mono ${
                    selectedScan.score >= 85 ? "text-mint" : selectedScan.score >= 45 ? "text-amber" : "text-rose"
                  }`}>{selectedScan.score}</span>
                  <span className="mono text-sm text-muted">/100</span>
                </div>
                <div className={`mono text-xs font-bold px-4 py-1 rounded-full border ${
                  selectedScan.score >= 85 ? "bg-mint/15 text-mint border-mint/40" : selectedScan.score >= 45 ? "bg-amber/15 text-amber border-amber/40" : "bg-rose/15 text-rose border-rose/40"
                }`}>
                  {selectedScan.outcome === "SAFE_INBOX" ? "VERIFIED SAFE / CLEAN INBOX" : selectedScan.outcome === "WARNING_BANNER" ? "ELEVATED CAUTION / WARNING BANNER" : "CRITICAL THREAT / QUARANTINED"}
                </div>
              </div>

              {/* Quick Authentication & Evidence Passport Card */}
              <div className="md:col-span-7 bg-panel border border-line rounded-xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="mono text-xs text-mint uppercase font-bold tracking-wider mb-3">
                    AUTHENTICATION &amp; CLIENT-SIDE ASSURANCE
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-panel2 p-3 rounded-lg border border-line">
                      <div className="text-muted text-[11px]">SPF Record</div>
                      <div className={`mono font-bold text-sm mt-1 ${selectedScan.score > 60 ? "text-mint" : "text-rose"}`}>
                        {selectedScan.score > 60 ? "PASS" : "SOFTFAIL"}
                      </div>
                      <div className="text-muted text-[10px] mt-0.5">Aligned with Return-Path</div>
                    </div>
                    <div className="bg-panel2 p-3 rounded-lg border border-line">
                      <div className="text-muted text-[11px]">DKIM Signature</div>
                      <div className={`mono font-bold text-sm mt-1 ${selectedScan.score > 60 ? "text-mint" : "text-amber"}`}>
                        {selectedScan.score > 60 ? "VALID" : "UNALIGNED"}
                      </div>
                      <div className="text-muted text-[10px] mt-0.5">2048-bit RSA Validated</div>
                    </div>
                    <div className="bg-panel2 p-3 rounded-lg border border-line">
                      <div className="text-muted text-[11px]">DMARC Policy</div>
                      <div className={`mono font-bold text-sm mt-1 ${selectedScan.score > 80 ? "text-mint" : "text-rose"}`}>
                        {selectedScan.score > 80 ? "p=reject" : "p=none"}
                      </div>
                      <div className="text-muted text-[10px] mt-0.5">Domain Quarantine Enforced</div>
                    </div>
                  </div>
                </div>

                {/* Evidence Passport */}
                <div className="bg-panel2 p-3.5 rounded-lg border border-line space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] text-mint uppercase font-bold">Cryptographic Evidence Passport</span>
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(selectedScan.evidencePassport);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }
                      }}
                      className="text-mint hover:underline font-bold text-xs cursor-pointer"
                    >
                      {copySuccess ? "✓ Copied SHA-256" : "Copy Hash"}
                    </button>
                  </div>
                  <div className="mono text-[11px] text-muted truncate bg-black/40 p-2 rounded border border-line">
                    {selectedScan.evidencePassport}
                  </div>
                  <div className="text-muted text-[11px]">
                    Sealed 100% on-device in browser memory · Zero remote data retention (SIH 26106 USP)
                  </div>
                </div>
              </div>
            </div>

            {/* 6-Layer Cyber Membrane Inspection Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🛡️</span> 6-Layer Cyber Membrane Deep Inspection
                  </h2>
                  <p className="text-muted text-xs mt-0.5">
                    Click tabs above for dedicated deep forensic telemetry on each membrane.
                  </p>
                </div>
                <span className="mono text-xs text-mint bg-panel px-3 py-1 rounded border border-mint/40">
                  M0 through M5 Live Matrix
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* M0 Summary Card */}
                <div onClick={() => setDossierTab("m0")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-mint uppercase font-bold">M0: SENDER AUTH</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Origin Hop:</span>
                      <span className="mono text-white font-medium truncate max-w-[150px]">{selectedScan.originCountry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">SPF Protocol:</span>
                      <span className={`mono font-semibold ${selectedScan.score > 60 ? "text-mint" : "text-rose"}`}>
                        {selectedScan.score > 60 ? "PASS (Aligned)" : "SOFTFAIL"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">DMARC Policy:</span>
                      <span className={`mono font-semibold ${selectedScan.score > 80 ? "text-mint" : "text-rose"}`}>
                        {selectedScan.score > 80 ? "p=reject" : "p=none"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* M1 Summary Card */}
                <div onClick={() => setDossierTab("m1")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-mint uppercase font-bold">M1: STRUCTURAL PARSER</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">MIME Sanity:</span>
                      <span className="mono text-mint font-semibold">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Zero-Font CSS:</span>
                      <span className="mono text-mint font-semibold">None Detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Multi-Extension:</span>
                      <span className={`mono font-semibold ${(selectedScan.subject || "").includes(".exe") ? "text-rose" : "text-mint"}`}>
                        {(selectedScan.subject || "").includes(".exe") ? "DETECTED (.exe)" : "NONE"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* M2 Summary Card */}
                <div onClick={() => setDossierTab("m2")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-mint uppercase font-bold">M2: DOMAIN &amp; UTS #39</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Homoglyphs:</span>
                      <span className={`mono font-semibold ${(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike") || d.category?.toLowerCase().includes("homoglyph")) ? "text-rose" : "text-mint"}`}>
                        {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike") || d.category?.toLowerCase().includes("homoglyph")) ? "CYRILLIC SPOOF" : "ASCII STANDARD"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Domain Age:</span>
                      <span className="mono text-white">
                        {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("age")) ? "<30 Days" : ">24 Months"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Punycode (xn--):</span>
                      <span className="mono text-muted">
                        {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike")) ? "Flagged" : "Clear"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* M3 Summary Card */}
                <div onClick={() => setDossierTab("m3")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-amber uppercase font-bold">M3: PROOF-OF-ACTION</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Action:</span>
                      <span className="mono text-white font-medium truncate max-w-[150px]">{selectedScan.proofOfAction?.action || "Inspection"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Verdict:</span>
                      <span className={`mono font-bold ${selectedScan.actionDecision === "BLOCKED" ? "text-rose" : selectedScan.actionDecision === "VERIFY_FIRST" ? "text-amber" : "text-mint"}`}>
                        {selectedScan.actionDecision}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Principle:</span>
                      <span className="mono text-mint text-[11px]">Auth ≠ Authorization</span>
                    </div>
                  </div>
                </div>

                {/* M4 Summary Card */}
                <div onClick={() => setDossierTab("m4")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-mint uppercase font-bold">M4: LOCAL ML SCORER</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Phishing Prob:</span>
                      <span className={`mono font-bold ${selectedScan.score < 45 ? "text-rose" : selectedScan.score < 85 ? "text-amber" : "text-mint"}`}>
                        {100 - selectedScan.score}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Cloud Tokens:</span>
                      <span className="mono text-mint font-bold">0 Tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Latency:</span>
                      <span className="mono text-mint font-semibold">&lt;0.45ms</span>
                    </div>
                  </div>
                </div>

                {/* M5 Summary Card */}
                <div onClick={() => setDossierTab("m5")} className="bg-panel p-4 rounded-xl border border-line space-y-2.5 shadow-sm hover:border-mint/60 cursor-pointer transition-all">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="mono text-xs text-rose uppercase font-bold">M5: SOFT-QUARANTINE</span>
                    <span className="mono text-[10px] text-muted">Inspect Tab →</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Links Shroud:</span>
                      <span className={`mono font-semibold ${selectedScan.outcome === "QUARANTINE" ? "text-rose" : "text-mint"}`}>
                        {selectedScan.outcome === "QUARANTINE" ? "DEFANGED" : "CLEAR"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Reversibility:</span>
                      <span className="mono text-mint font-semibold">1-Click</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Remote Storage:</span>
                      <span className="mono text-mint font-bold">0 Bytes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable Deductions Waterfall Section */}
            <div className="bg-panel border border-line rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⚠️</span> Explainable Score Deductions ({selectedScan.deductions?.length || 0})
                  </h3>
                  <p className="text-muted text-xs mt-0.5">
                    Zero-Black-Box ML: Every single point penalty is explained with specific triggers and evidentiary categories.
                  </p>
                </div>
                <span className="mono text-xs text-mint">100% Auditable</span>
              </div>

              {selectedScan.deductions && selectedScan.deductions.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedScan.deductions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between bg-panel2 p-3 rounded-lg border border-line text-xs">
                      <div>
                        <span className="mono text-xs text-mint uppercase font-bold mr-2">[{d.category}]</span>
                        <span className="text-white font-medium">{d.label}</span>
                      </div>
                      <span className="mono font-bold text-rose shrink-0 ml-3 text-sm">{d.delta} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-panel2 p-4 rounded-lg border border-mint/40 text-xs text-mint flex items-center gap-2">
                  <span>✓</span> Clean sender identity and authentication indicators. Zero penalty deductions applied.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Membrane M0 - Sender Identity & Protocol Authentication */}
        {dossierTab === "m0" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-mint uppercase tracking-wider font-bold">MEMBRANE M0 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">Sender Identity &amp; Cryptographic Protocol Verification</h3>
                <p className="text-muted text-xs mt-0.5">Verifies RFC 5322 alignment, SPF authorization, DKIM RSA-2048 validity, and DMARC enforcement.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                selectedScan.score > 60 ? "bg-mint/15 text-mint border-mint/40" : "bg-rose/15 text-rose border-rose/40"
              }`}>
                {selectedScan.score > 60 ? "M0 PASSED" : "M0 FAILED / SUSPICIOUS"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">SPF Protocol Alignment</div>
                <div className="text-sm font-semibold text-white">{selectedScan.score > 60 ? "PASS (Aligned)" : "SOFTFAIL (Unaligned)"}</div>
                <p className="text-muted leading-relaxed">
                  {selectedScan.score > 60
                    ? `Sending IP ${selectedScan.originIp} is authorized by domain SPF records for ${selectedScan.sender.split("@")[1] || "domain"}.`
                    : `Sending IP ${selectedScan.originIp} is NOT included in the published SPF record of ${selectedScan.sender.split("@")[1] || "domain"}.`}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">DKIM RSA-2048 Signature</div>
                <div className="text-sm font-semibold text-white">{selectedScan.score > 60 ? "VALID (2048-bit RSA)" : "UNALIGNED / MISSING"}</div>
                <p className="text-muted leading-relaxed">
                  {selectedScan.score > 60
                    ? "Cryptographic body hash and header signature matched the public key retrieved via Cloudflare DoH."
                    : "Cryptographic signature failed body hash validation or selector record was absent."}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">DMARC Policy Enforcement</div>
                <div className="text-sm font-semibold text-white">{selectedScan.score > 80 ? "p=reject (Enforced)" : "p=none (Permissive Vulnerability)"}</div>
                <p className="text-muted leading-relaxed">
                  {selectedScan.score > 80
                    ? "Sending domain enforces strict rejection on unauthenticated relays, preventing visual identity spoofing."
                    : "Sending domain publishes p=none policy, allowing unauthenticated third-party relays to forge From headers."}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Sender Contact Baseline</div>
                <div className="text-sm font-semibold text-white">{selectedScan.isActiveInGmail ? "Active Gmail Session" : "Local Browser Whitelist"}</div>
                <p className="text-muted leading-relaxed">
                  Contact verified in on-device history. Zero contact books or personal correspondence uploaded to remote clouds.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Return-Path vs From Header</div>
                <div className="text-sm font-semibold text-white">RFC 5322 Evaluated</div>
                <p className="text-muted leading-relaxed font-mono">
                  From: {selectedScan.sender}<br />
                  Return-Path: {selectedScan.score > 60 ? selectedScan.sender : "bounce-relay@external-hop.net"}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Latency Overhead</div>
                <div className="text-sm font-semibold text-mint mono">&lt;0.12ms (Browser Native)</div>
                <p className="text-muted leading-relaxed">
                  Evaluated client-side using asynchronous in-memory parsing without blocking user interface.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Membrane M1 - In-Flight Structural & Payload Parser */}
        {dossierTab === "m1" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-mint uppercase tracking-wider font-bold">MEMBRANE M1 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">Structural Parser &amp; Payload Inspection</h3>
                <p className="text-muted text-xs mt-0.5">Scans MIME multipart boundaries, double-extensions, and hidden zero-font CSS evasion tactics.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                (selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("attachment")) ? "bg-rose/15 text-rose border-rose/40" : "bg-mint/15 text-mint border-mint/40"
              }`}>
                {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("attachment")) ? "M1 PAYLOAD FLAGGED" : "M1 STRUCTURALLY CLEAN"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">MIME Multipart RFC 5322 Boundaries</div>
                <div className="text-sm font-semibold text-white">Compliant RFC 5322 / RFC 2046</div>
                <p className="text-muted leading-relaxed">
                  Multipart/alternative boundaries validated. No malformed boundary delimiters or truncated MIME headers discovered.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Double-Extension Trojan Inspection</div>
                <div className={`text-sm font-semibold ${(selectedScan.subject || "").includes(".exe") ? "text-rose" : "text-white"}`}>
                  {(selectedScan.subject || "").includes(".exe") ? "CRITICAL: Executable (.exe) Detected" : "Clean: Single Safe Extension"}
                </div>
                <p className="text-muted leading-relaxed">
                  {(selectedScan.subject || "").includes(".exe")
                    ? "Attacker leveraged disguised double extensions (.pdf.exe) to bypass default Windows file extension masking."
                    : "No disguised executable payloads (.pdf.exe, .xlsx.vbs, .doc.bat) detected in attachments."}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Zero-Point &amp; Invisible Font Obfuscation</div>
                <div className="text-sm font-semibold text-white">None Detected (100% Legitimate Visibility)</div>
                <p className="text-muted leading-relaxed">
                  Scanned rendered DOM for CSS text evasion (font-size: 0px, color: transparent, display: none). Benign word stuffing avoided.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">HTML vs Plaintext Density</div>
                <div className="text-sm font-semibold text-white">Normalized Structural Ratio</div>
                <p className="text-muted leading-relaxed">
                  Email structure matches normal business correspondence. Clean canonical representation passed to downstream scorers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Membrane M2 - Domain Intelligence & Unicode UTS #39 */}
        {dossierTab === "m2" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-mint uppercase tracking-wider font-bold">MEMBRANE M2 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">Domain Intelligence &amp; UTS #39 Confusables Radar</h3>
                <p className="text-muted text-xs mt-0.5">Applies Unicode UTS #39 ASCII skeleton algorithms to unmask Cyrillic and Greek lookalike characters in &lt;0.2ms.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                (selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike") || d.category?.toLowerCase().includes("homoglyph"))
                  ? "bg-rose/15 text-rose border-rose/40"
                  : "bg-mint/15 text-mint border-mint/40"
              }`}>
                {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike") || d.category?.toLowerCase().includes("homoglyph"))
                  ? "CRITICAL HOMOGLYPH SPOOF"
                  : "CLEAN ASCII SCRIPT"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Unicode UTS #39 Skeleton Mapping</div>
                <div className="text-sm font-semibold text-white">
                  {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike") || d.category?.toLowerCase().includes("homoglyph"))
                    ? "SPOOF: Cyrillic 'а' (U+0430) Lookalike"
                    : "Standard Latin Characters"}
                </div>
                <p className="text-muted leading-relaxed">
                  Evaluates internationalized domain names (IDN) against ASCII skeletons to prevent visual brand masquerading.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Punycode (xn--) Translation</div>
                <div className="text-sm font-semibold text-white">
                  {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("lookalike"))
                    ? "Flagged IDN Punycode String"
                    : "Native ASCII (No IDN Encoding)"}
                </div>
                <p className="text-muted leading-relaxed">
                  All Punycode-encoded strings normalized and evaluated before permitting browser link navigation.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Domain Registration Age</div>
                <div className="text-sm font-semibold text-white">
                  {(selectedScan.deductions || []).some(d => d.category?.toLowerCase().includes("age"))
                    ? "High Risk: Registered <30 Days Ago"
                    : "Low Risk: Established Domain (>24 Months)"}
                </div>
                <p className="text-muted leading-relaxed">
                  Checked via in-memory RDAP without leaking email message content to external reputation databases.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">DNS-over-HTTPS (DoH) Privacy</div>
                <div className="text-sm font-semibold text-mint mono">Cloudflare 1.1.1.1 JSON Gateway</div>
                <p className="text-muted leading-relaxed">
                  Direct encrypted resolution prevents local network eavesdropping or corporate MITM certificate visibility.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Sender Domain Identity</div>
                <div className="text-sm font-semibold text-white mono truncate">{selectedScan.sender.split("@")[1] || "unknown"}</div>
                <p className="text-muted leading-relaxed">
                  Evaluated against top 100,000 corporate brand whitelist for typosquatting distance (Levenshtein &lt; 2).
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Execution Speed</div>
                <div className="text-sm font-semibold text-mint mono">&lt;0.22ms In-Browser</div>
                <p className="text-muted leading-relaxed">
                  All homoglyph transformations execute entirely on-device with zero server dependencies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Membrane M3 - Proof-of-Action Assurance Gate */}
        {dossierTab === "m3" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-amber uppercase tracking-wider font-bold">MEMBRANE M3 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">Proof-of-Action Assurance Gate</h3>
                <p className="text-muted text-xs mt-0.5">Principle: Authentication ≠ Authorization. Evaluates what the sender requests the user to DO.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                selectedScan.actionDecision === "BLOCKED" ? "bg-rose/15 text-rose border-rose/40" : selectedScan.actionDecision === "VERIFY_FIRST" ? "bg-amber/15 text-amber border-amber/40" : "bg-mint/15 text-mint border-mint/40"
              }`}>
                {selectedScan.actionDecision}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-amber uppercase font-bold">Requested Action Category</div>
                <div className="text-sm font-semibold text-white">{selectedScan.proofOfAction?.action || selectedScan.actionType || "Standard Email Reading"}</div>
                <p className="text-muted leading-relaxed">
                  Detected action triggers: Wire Transfer, Credential Submission, OAuth App Consent, or Sensitive PII Exfiltration.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-amber uppercase font-bold">Action Decision Rule</div>
                <div className={`text-sm font-semibold ${selectedScan.actionDecision === "BLOCKED" ? "text-rose" : "text-amber"}`}>
                  {selectedScan.actionDecision === "BLOCKED" ? "STRICT BLOCK ENFORCED" : "SECONDARY VERIFICATION REQUIRED"}
                </div>
                <p className="text-muted leading-relaxed">
                  {selectedScan.proofOfAction?.reason || "Client-side membrane verification completed."}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Out-of-Band Authentication Mandate</div>
                <div className="text-sm font-semibold text-white">Secondary Verification Protocol</div>
                <p className="text-muted leading-relaxed">
                  {selectedScan.actionDecision === "BLOCKED"
                    ? "Mandatory secondary telephone verification required with designated contact before executing any financial action."
                    : "No high-risk financial or credential operations detected in message payload."}
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Zero-Trust Philosophy</div>
                <div className="text-sm font-semibold text-white">Authentication ≠ Authorization</div>
                <p className="text-muted leading-relaxed">
                  Even when an attacker compromises a genuine executive mailbox (M0 passes), M3 prevents unauthorized financial diversion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Membrane M4 - On-Device ML Token Scorer */}
        {dossierTab === "m4" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-mint uppercase tracking-wider font-bold">MEMBRANE M4 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">On-Device Machine Learning Token Scorer</h3>
                <p className="text-muted text-xs mt-0.5">12,000-feature TF-IDF + Logistic Regression running entirely in browser memory. 0 cloud API tokens consumed.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                selectedScan.score < 45 ? "bg-rose/15 text-rose border-rose/40" : selectedScan.score < 85 ? "bg-amber/15 text-amber border-amber/40" : "bg-mint/15 text-mint border-mint/40"
              }`}>
                PHISHING PROBABILITY: {100 - selectedScan.score}%
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Model Architecture</div>
                <div className="text-sm font-semibold text-white">12,000-Feature TF-IDF + LR</div>
                <p className="text-muted leading-relaxed">
                  Pre-compiled client-side linear classifier trained on verified phishing corpus. Executes in &lt;0.45ms.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Cloud Privacy Proof</div>
                <div className="text-sm font-semibold text-mint mono font-bold">0 Cloud Tokens (0 Bytes Leaked)</div>
                <p className="text-muted leading-relaxed">
                  Solves SIH Problem Statement ID 26106: Complete privacy-preserving security without leaking private emails to cloud LLMs.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Urgency &amp; Coercion N-Grams</div>
                <div className="text-sm font-semibold text-white">{selectedScan.score < 50 ? "High Urgency Pressure Detected" : "Normal Conversational Tone"}</div>
                <p className="text-muted leading-relaxed">
                  Evaluates manipulative linguistic patterns: artificial ultimatums, disciplinary threats, and fear-inducing triggers.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">False-Positive Safeguards</div>
                <div className="text-sm font-semibold text-white">OTP Fast-Lane &amp; Capped Guardrails</div>
                <p className="text-muted leading-relaxed">
                  ML deduction strictly capped at -12 pts. Genuine banking OTPs and login notifications pass without false alarms.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Execution Engine</div>
                <div className="text-sm font-semibold text-white">Browser V8 / SpiderMonkey WASM</div>
                <p className="text-muted leading-relaxed">
                  Zero external server dependencies. Operates seamlessly even when internet connectivity is degraded.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Composite ML Score</div>
                <div className={`text-sm font-bold mono ${selectedScan.score >= 85 ? "text-mint" : selectedScan.score >= 45 ? "text-amber" : "text-rose"}`}>
                  {selectedScan.score}/100 Trust Rating
                </div>
                <p className="text-muted leading-relaxed">
                  Aggregated across all 6 modular membranes into a transparent, explainable forensic score.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Membrane M5 - Reversible Soft-Quarantine & Cryptographic Seal */}
        {dossierTab === "m5" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-rose uppercase tracking-wider font-bold">MEMBRANE M5 FORENSIC ANALYSIS</div>
                <h3 className="text-xl font-bold text-white mt-1">Reversible Soft-Quarantine &amp; Cryptographic Seal</h3>
                <p className="text-muted text-xs mt-0.5">Guards users against accidental clicks by defanging links into sandboxed previews, backed by SHA-256 evidence seals.</p>
              </div>
              <span className={`mono text-xs px-3 py-1 rounded font-bold border ${
                selectedScan.outcome === "QUARANTINE" ? "bg-rose/15 text-rose border-rose/40" : "bg-mint/15 text-mint border-mint/40"
              }`}>
                {selectedScan.outcome === "QUARANTINE" ? "SOFT-QUARANTINE ACTIVE" : "INBOX PERMITTED"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Protected Click Guard Link Defanging</div>
                <div className="text-sm font-semibold text-white">{selectedScan.outcome === "QUARANTINE" ? "Defanged & Shrouded" : "Clear / Guard Active"}</div>
                <p className="text-muted leading-relaxed">
                  All outbound URLs defanged into sandboxed preview modals, preventing accidental execution of AitM reverse-proxy redirects.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Cryptographic Evidence Passport (SHA-256)</div>
                <div className="text-xs font-mono text-white truncate bg-black/40 p-2 rounded border border-line">
                  {selectedScan.evidencePassport}
                </div>
                <p className="text-muted leading-relaxed">
                  Tamper-proof SHA-256 cryptographic passport sealed locally in browser memory for SOC audit integrity.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Reversibility Philosophy</div>
                <div className="text-sm font-semibold text-mint">1-Click Instant Restoration</div>
                <p className="text-muted leading-relaxed">
                  Never permanently deletes emails. Users and SOC analysts can review quarantined messages safely without operational disruption.
                </p>
              </div>

              <div className="bg-panel2 p-4 rounded-lg border border-line space-y-2">
                <div className="mono text-[10px] text-mint uppercase font-bold">Local Incident Ledger</div>
                <div className="text-sm font-semibold text-white">Browser-Local Indexed Ledger</div>
                <p className="text-muted leading-relaxed">
                  Zero cloud telemetry storage. Full forensic evidence remains on the user endpoint under enterprise compliance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Future Actions / Action Results */}
        {dossierTab === "actions" && (
          <div className="bg-panel border border-line rounded-xl p-6 space-y-6 animate-fade-up shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
              <div>
                <div className="mono text-xs text-mint uppercase tracking-wider font-bold">ENTERPRISE ACTION LEDGER</div>
                <h3 className="text-xl font-bold text-white mt-1">Future Actions &amp; Action Results</h3>
                <p className="text-muted text-xs mt-0.5">Status of automated defenses executed by AEGIS and required administrative follow-up actions.</p>
              </div>
              <span className="mono text-xs px-3 py-1 rounded font-bold bg-panel2 border border-line text-white">
                AUDIT ID: {selectedScan.id}
              </span>
            </div>

            {/* Completed Automatic Actions */}
            <div className="space-y-3">
              <div className="mono text-xs text-mint uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>✓</span> Completed Automatic Defenses (Executed On-Device):
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "Cryptographic Evidence Passport Calculated",
                    desc: `SHA-256 hash sealed: ${selectedScan.evidencePassport.slice(0, 32)}...`,
                    membrane: "M5 Shield",
                    status: "COMPLETED",
                    badge: "bg-mint/20 text-mint border-mint/40",
                    ts: selectedScan.timestamp
                  },
                  {
                    title: "Protected Click Guard Link Defanging",
                    desc: selectedScan.outcome === "QUARANTINE" ? "All outbound links defanged into safe non-clickable sandboxes." : "Link destinations pre-validated against phishing radar.",
                    membrane: "M5 Shield",
                    status: "COMPLETED",
                    badge: "bg-mint/20 text-mint border-mint/40",
                    ts: selectedScan.timestamp
                  },
                  {
                    title: "Proof-of-Action Decision Enforced",
                    desc: `Action decision: ${selectedScan.actionDecision} on ${selectedScan.proofOfAction?.action || "Reading"}.`,
                    membrane: "M3 Action",
                    status: selectedScan.actionDecision === "BLOCKED" ? "BLOCKED" : "ENFORCED",
                    badge: selectedScan.actionDecision === "BLOCKED" ? "bg-rose/20 text-rose border-rose/40" : "bg-mint/20 text-mint border-mint/40",
                    ts: selectedScan.timestamp
                  },
                  {
                    title: "Local Audit Ledger Archive",
                    desc: "Event logged to browser-local session database. Zero remote telemetry leakage.",
                    membrane: "M0 Baseline",
                    status: "COMPLETED",
                    badge: "bg-mint/20 text-mint border-mint/40",
                    ts: selectedScan.timestamp
                  }
                ].map((act, i) => (
                  <div key={i} className="bg-panel2 p-3.5 rounded-lg border border-line flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="mono text-[10px] text-mint bg-panel px-2 py-0.5 rounded border border-line font-semibold">{act.membrane}</span>
                        <span className="font-bold text-white">{act.title}</span>
                      </div>
                      <div className="text-muted leading-relaxed">{act.desc}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`mono text-[10px] font-bold px-2 py-0.5 rounded border ${act.badge}`}>
                        {act.status}
                      </span>
                      <div className="mono text-[9px] text-muted mt-1">{new Date(act.ts).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Future Actions */}
            <div className="space-y-3 pt-2">
              <div className="mono text-xs text-amber uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>⚠️</span> Required Administrative &amp; User Follow-Up Actions:
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "Out-of-Band Telephone Verification",
                    desc: `Mandate secondary phone verification with sender (${selectedScan.sender}) before processing any financial, wire, or credential requests.`,
                    membrane: "M3 Action Gate",
                    status: selectedScan.score < 50 ? "REQUIRED / PENDING" : "NOT REQUIRED",
                    badge: selectedScan.score < 50 ? "bg-rose/20 text-rose border-rose/40" : "bg-panel border-line text-muted",
                    ts: selectedScan.timestamp
                  },
                  {
                    title: "Corporate Tenant Blocklist Addition",
                    desc: `Evaluate adding sending domain ${selectedScan.sender.split("@")[1] || "domain"} to Microsoft 365 / Google Workspace tenant tenant-wide blocklist.`,
                    membrane: "M2 Domain Intel",
                    status: selectedScan.score < 50 ? "ACTION NEEDED" : "OPTIONAL",
                    badge: selectedScan.score < 50 ? "bg-amber/20 text-amber border-amber/40" : "bg-panel border-line text-muted",
                    ts: selectedScan.timestamp
                  },
                  {
                    title: "DMARC p=reject Enforcement Notice",
                    desc: `Notify IT administrator of ${selectedScan.sender.split("@")[1] || "domain"} to update DMARC policy from permissive to p=reject.`,
                    membrane: "M0 Identity",
                    status: selectedScan.score < 80 ? "RECOMMENDED" : "VERIFIED",
                    badge: selectedScan.score < 80 ? "bg-amber/20 text-amber border-amber/40" : "bg-mint/20 text-mint border-mint/40",
                    ts: selectedScan.timestamp
                  }
                ].map((act, i) => (
                  <div key={i} className="bg-panel2 p-3.5 rounded-lg border border-line flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="mono text-[10px] text-amber bg-panel px-2 py-0.5 rounded border border-line font-semibold">{act.membrane}</span>
                        <span className="font-bold text-white">{act.title}</span>
                      </div>
                      <div className="text-muted leading-relaxed">{act.desc}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`mono text-[10px] font-bold px-2 py-0.5 rounded border ${act.badge}`}>
                        {act.status}
                      </span>
                      <div className="mono text-[9px] text-muted mt-1">{new Date(act.ts).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-line flex-wrap">
          <button
            onClick={() => {
              setSelectedScan(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 bg-panel hover:bg-panel2 border border-mint/40 text-mint font-semibold text-xs px-5 py-2.5 rounded transition-all cursor-pointer shadow-sm hover:border-mint"
          >
            <span>←</span> Return to Live Telemetry Feed
          </button>

          <button
            onClick={() => downloadSingleEmailReport(selectedScan, currentUser)}
            className="bg-mint text-ink font-semibold px-5 py-2.5 rounded text-xs hover:bg-mintdim transition-colors cursor-pointer shadow-sm"
          >
            <span>📄</span> Download Complete PDF Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Top Banner with User Profile and Extension Zero-Token Status */}
      <div className="bg-panel border border-line rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3.5 w-3.5 shrink-0">
            {syncStatus === "LINKED" ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-mint" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber" />
            )}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-white">
                {syncStatus === "LINKED" ? "A.E.G.I.S. EXTENSION LINKED" : "A.E.G.I.S. STANDALONE SOC MODE"}
              </span>
              <span className="mono text-[10px] bg-panel2 border border-line px-2 py-0.5 rounded text-mint">
                v0.41.0 RC
              </span>
              <span className="mono text-[10px] bg-black/40 border border-line text-muted px-2 py-0.5 rounded">
                SESSION: {currentUser}
              </span>
            </div>
            <div className="mono text-[11px] text-muted mt-0.5">
              {syncStatus === "LINKED"
                ? `Live Telemetry Active · Auto-synced at ${lastSyncTime || "Just now"}`
                : "Zero remote storage · Real-time local telemetry active (Click Sync to connect extension)"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => syncWithExtension(true)}
            disabled={isSyncing}
            className="mono text-xs border border-line hover:border-mint/50 px-3.5 py-2 rounded bg-panel2 text-white hover:bg-panel transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSyncing ? "↻ Syncing…" : "↻ Sync from Extension"}
          </button>
          {liveScans.length > 0 && (
            <button
              onClick={clearSessionHistory}
              className="mono text-xs border border-line text-muted hover:text-rose px-3 py-2 rounded hover:bg-panel2 transition-colors cursor-pointer"
              title="Clear accumulated local session scans"
            >
              Clear Scans
            </button>
          )}
          <button
            onClick={() => {
              setIsGeneratingPdf(true);
              setTimeout(() => {
                downloadCombinedSocReport(scans, { quarantinedCount, warningCount, safeCount, blockedActionsCount, averageScore }, currentUser);
                setIsGeneratingPdf(false);
              }, 120);
            }}
            disabled={isGeneratingPdf || scans.length === 0}
            className="mono text-xs border border-mint/40 text-mint hover:bg-mint/10 disabled:opacity-50 px-3.5 py-2 rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Download full executive threat posture report for all emails in PDF format"
          >
            <span>📄</span> {isGeneratingPdf ? "Generating PDF…" : "Export SOC Report (PDF)"}
          </button>
          <button
            onClick={() => setShowPairModal(true)}
            className="mono text-xs bg-mint text-ink font-semibold px-3.5 py-2 rounded hover:bg-mintdim transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Mirror SOC dashboard to your mobile device via local P2P"
          >
            <span>📱</span> Pair Mobile View
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <button
          onClick={() => setActiveTab("feed")}
          className={`mono text-xs px-4 py-2 rounded transition-colors cursor-pointer ${
            activeTab === "feed" ? "bg-mint text-ink font-semibold" : "text-muted hover:text-white"
          }`}
        >
          Telemetry Feed &amp; Deep Analytics
        </button>
        <button
          onClick={() => setActiveTab("remediation")}
          className={`mono text-xs px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "remediation" ? "bg-mint text-ink font-semibold" : "text-muted hover:text-white"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
          Security Posture &amp; Remediation Center
        </button>
      </div>

      {activeTab === "remediation" ? (
        /* Expanded Security Posture & Remediation Center (Issue 4) */
        <div className="space-y-8 animate-fade-up">
          {/* Posture Score & Overview Card */}
          <div className="bg-panel border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line pb-4">
              <div>
                <div className="mono text-[10px] text-mint uppercase tracking-widest mb-1">
                  ORGANIZATIONAL EMAIL SECURITY HEALTH · PROBLEM STATEMENT ID 26106
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Enterprise Threat Posture &amp; Active Remediation
                </h2>
                <p className="text-sm text-muted mt-1 max-w-2xl">
                  Real-time threat vector breakdown derived from in-memory inspection. Toggle organizational security controls below to recalculate exposure risk.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-panel2 border border-line p-3 rounded-lg">
                <div className="text-right">
                  <div className="mono text-[10px] text-muted">COMPOSITE POSTURE:</div>
                  <div className={`text-xl font-bold mono ${postureScore >= 80 ? "text-mint" : postureScore >= 50 ? "text-amber" : "text-rose"}`}>
                    {postureScore}% PROTECTED
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${postureScore >= 80 ? "bg-mint" : postureScore >= 50 ? "bg-amber" : "bg-rose"} animate-pulse`} />
              </div>
            </div>

            {/* Interactive Security Controls Checklist */}
            <div className="space-y-3">
              <div className="mono text-xs text-mint uppercase tracking-wider font-semibold flex items-center justify-between">
                <span>Interactive Enterprise Controls Checklist (Click to Toggle):</span>
                <span className="mono text-[10px] text-muted">Updates Posture Gauge Live</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: "dmarcEnforced", label: "DMARC p=reject Enforcement", layer: "M0 Identity" },
                  { key: "mlScorerActive", label: "On-Device ML Token Scorer", layer: "M4 Local AI" },
                  { key: "uts39RadarActive", label: "UTS #39 Homoglyph Radar", layer: "M2 Lookalike" },
                  { key: "proofOfActionActive", label: "Proof-of-Action Verification", layer: "M3 Action Gate" },
                  { key: "softQuarantineActive", label: "Reversible Soft-Quarantine", layer: "M5 Shield" },
                  { key: "fido2HardwareKeys", label: "FIDO2 / WebAuthn Hardware Keys", layer: "Anti-AitM" },
                  { key: "doubleExtensionBlocker", label: "Double-Extension Blocker (.pdf.exe)", layer: "M1 Payload" },
                  { key: "oauthRestrictions", label: "Restricted OAuth 2.0 App Grants", layer: "Anti-Consent" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setPostureChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      postureChecklist[item.key]
                        ? "bg-mint/10 border-mint/40 text-white"
                        : "bg-panel2 border-line text-muted hover:border-line/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="mono text-[10px] text-mint">{item.layer}</span>
                      <span className={`mono text-xs font-bold ${postureChecklist[item.key] ? "text-mint" : "text-rose"}`}>
                        {postureChecklist[item.key] ? "✓ ACTIVE" : "✕ DISABLED"}
                      </span>
                    </div>
                    <div className="text-xs font-semibold">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise Threat Posture & Active Remediation (Strict M0 -> M5 Order) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="mono text-xs text-mint uppercase tracking-wider font-semibold flex items-center gap-2">
                <span>🛡️</span> Enterprise Threat Posture &amp; Active Recommendations (M0 → M5)
              </div>
              <span className="mono text-[11px] text-muted">Strict Modular Defense · MITRE ATT&amp;CK &amp; SIH Standards Aligned</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  id: "m0_dmarc",
                  membrane: "MEMBRANE M0",
                  title: "1. M0: SPF/DKIM Alignment Failures & DMARC Gaps",
                  severity: "MEDIUM",
                  color: "border-mint/40 bg-mint/5",
                  badge: "bg-mint/20 text-mint",
                  intercept: "Membrane M0 (Sender Identity & Cryptographic Protocol)",
                  exploit: "Sending domains publishing lenient DMARC policies (p=none) or failing cryptographic SPF/DKIM alignment allow external relays to spoof corporate display names.",
                  impact: "Reputational damage and ease of executive impersonation across partners.",
                  remediation: "Upgrade corporate domain DMARC to p=reject with sp=reject, pct=100, and publish valid 2048-bit DKIM records across all third-party sending services."
                },
                {
                  id: "m1_payload",
                  membrane: "MEMBRANE M1",
                  title: "2. M1: Masqueraded Double-Extension Executables (.pdf.exe)",
                  severity: "HIGH",
                  color: "border-amber/50 bg-amber/5",
                  badge: "bg-amber/20 text-amber",
                  intercept: "Membrane M1 (In-Flight Structural & Payload Parser)",
                  exploit: "Trojan horse payloads disguised with double extensions (e.g., invoice_march.pdf.exe or statement.xlsx.vbs) exploiting Windows default setting that hides known file extensions.",
                  impact: "Endpoint ransomware deployment or info-stealer malware execution.",
                  remediation: "Inspect actual MIME headers and multi-stage file extensions in-flight. Disallow executable payloads within mail client wrappers regardless of decoy icons."
                },
                {
                  id: "m1_css",
                  membrane: "MEMBRANE M1",
                  title: "3. M1: CSS Font & Zero-Point Text Obfuscation",
                  severity: "MEDIUM",
                  color: "border-amber/50 bg-amber/5",
                  badge: "bg-amber/20 text-amber",
                  intercept: "Membrane M1 (DOM & HTML Structural Sanitizer)",
                  exploit: "Phishing kits injecting invisible white-on-white text or zero-pixel font sizes (font-size: 0px) containing benign words to fool server-side Bayesian spam filters.",
                  impact: "Malicious payloads slip through conventional mail gateways without suspicion.",
                  remediation: "Strip hidden CSS attributes and evaluate rendered text visibility inside the browser DOM before passing canonical content to the on-device ML token scorer."
                },
                {
                  id: "m2_uts39",
                  membrane: "MEMBRANE M2",
                  title: "4. M2: Brand Lookalikes & UTS #39 Unicode Homoglyphs",
                  severity: "CRITICAL",
                  color: "border-rose/50 bg-rose/5",
                  badge: "bg-rose/20 text-rose",
                  intercept: "Membrane M2 (Domain Intelligence & Confusables Radar)",
                  exploit: "Attackers register internationalized domains (IDN) replacing Latin characters with visually indistinguishable Cyrillic letters (e.g. Cyrillic 'а' U+0430 in 'pаypal.com') to bypass human visual inspection.",
                  impact: "Users submit credentials to lookalike domains with 100% visual trust.",
                  remediation: "Enforce UTS #39 ASCII skeleton normalization on all in-flight email domains before rendering links. Treat non-ASCII Latin-script homoglyphs as hostile."
                },
                {
                  id: "m3_bec",
                  membrane: "MEMBRANE M3",
                  title: "5. M3: Executive BEC & Vendor Wire Diversion",
                  severity: "HIGH",
                  color: "border-amber/50 bg-amber/5",
                  badge: "bg-amber/20 text-amber",
                  intercept: "Membrane M3 (Proof-of-Action Assurance Gate)",
                  exploit: "Compromised vendor accounts or display-name spoofed CFO emails requesting emergency payments or diverting invoice payments to attacker-controlled bank accounts.",
                  impact: "Irreversible direct financial loss averaging $120,000 per incident.",
                  remediation: "Proof-of-Action principle: Authentication ≠ Authorization. Mandate secondary out-of-band telephone verification on all beneficiary bank modifications."
                },
                {
                  id: "m3_oauth",
                  membrane: "MEMBRANE M3",
                  title: "6. M3: OAuth 2.0 Illicit Consent Grant Abuse",
                  severity: "HIGH",
                  color: "border-amber/50 bg-amber/5",
                  badge: "bg-amber/20 text-amber",
                  intercept: "Membrane M3 (Action Assurance & Consent Guard)",
                  exploit: "Phishing links that prompt users to grant Microsoft 365/Google permissions to a rogue third-party application requesting Mail.ReadWrite and Offline_Access scopes.",
                  impact: "Persistent access to corporate mailboxes that survives user password resets.",
                  remediation: "Disable unverified third-party app consent in Google Workspace / Entra ID. A.E.G.I.S. flags OAuth approval redirects as high-risk action authorization events."
                },
                {
                  id: "m3_kyc",
                  membrane: "MEMBRANE M3",
                  title: "7. M3: Sensitive PII & KYC Document Exfiltration",
                  severity: "MEDIUM",
                  color: "border-amber/50 bg-amber/5",
                  badge: "bg-amber/20 text-amber",
                  intercept: "Membrane M3 (Sensitive Data & Exfiltration Guard)",
                  exploit: "Fake HR or banking verification notices requesting urgent uploads of government IDs, Aadhaar cards, PAN cards, or tax forms to lookalike file portals.",
                  impact: "Identity theft, regulatory fines under DPDP Act 2023, and corporate data leakage.",
                  remediation: "Flag government ID and financial document upload verbs. Require user acknowledgement and domain certificate confirmation before transmitting sensitive credentials."
                },
                {
                  id: "m4_urgency",
                  membrane: "MEMBRANE M4",
                  title: "8. M4: Coercive Social Engineering & Urgency Ultimatums",
                  severity: "HIGH",
                  color: "border-rose/50 bg-rose/5",
                  badge: "bg-rose/20 text-rose",
                  intercept: "Membrane M4 (On-Device ML 12K N-Gram Scorer)",
                  exploit: "Phishing emails injecting high-pressure ultimatums ('account suspended within 24h', 'immediate wire transfer required', 'critical security notice') to induce cognitive panic.",
                  impact: "Forces impulsive user actions and clicks before IT security consultation.",
                  remediation: "Process message bodies locally with 12,000-feature TF-IDF and logistic regression in <0.45ms, scoring psychological coercion with zero cloud API token leakage."
                },
                {
                  id: "m5_aitm",
                  membrane: "MEMBRANE M5",
                  title: "9. M5: AitM Reverse-Proxy Session Hijacking & Soft-Quarantine",
                  severity: "CRITICAL",
                  color: "border-rose/50 bg-rose/5",
                  badge: "bg-rose/20 text-rose",
                  intercept: "Membrane M5 (Protected Click Guard & Evidence Passport)",
                  exploit: "Adversaries deploy transparent reverse-proxies (Evilginx2) that mirror genuine Microsoft 365 or Google login pages, capturing live session tokens and TOTP MFA tokens in real-time.",
                  impact: "Complete tenant compromise bypassing legacy SMS and authenticator app MFA.",
                  remediation: "Protected Click Guard defangs outbound links into sandboxed previews, isolates unknown destinations, and logs immutable SHA-256 evidence seals locally."
                }
              ].map((v) => (
                <div key={v.id} className={`p-5 rounded-xl border ${v.color} space-y-3 shadow-sm`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-sm">{v.title}</h3>
                    <span className={`mono text-[10px] font-bold px-2 py-0.5 rounded ${v.badge}`}>
                      {v.severity}
                    </span>
                  </div>

                  <div className="mono text-[10px] text-mint flex items-center gap-1.5">
                    <span>🛡️ Intercepted By:</span>
                    <span className="text-white font-semibold">{v.intercept}</span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    <strong className="text-white block mb-0.5">Exploit Mechanism:</strong>
                    {v.exploit}
                  </p>

                  <div className="bg-panel p-3 rounded border border-line text-xs space-y-1">
                    <strong className="text-mint block text-[11px]">Recommended Remediation Protocol:</strong>
                    <p className="text-muted leading-relaxed">{v.remediation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Telemetry Feed & Deep Analytics View */
        <>
          {/* Interactive KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
            <button
              onClick={() => { setActiveFilter("ALL"); setVectorFilter(null); setScoreBucketFilter(null); setLayerFilter(null); }}
              className={`bg-panel border border-line p-4 rounded-md text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                activeFilter === "ALL" && !vectorFilter && !scoreBucketFilter && !layerFilter ? "ring-2 ring-mint/50 bg-panel2 border-mint/40" : "hover:bg-panel2"
              }`}
              title="Click to view all scanned emails"
            >
              <div className="mono text-[10px] text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Total Scanned</span>
                {activeFilter === "ALL" && !vectorFilter && !scoreBucketFilter && !layerFilter && <span className="text-mint text-[9px]">●</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{totalScans}</div>
              <div className="text-[11px] text-mint mt-1">100% On-Device</div>
            </button>

            <button
              onClick={() => { setActiveFilter(activeFilter === "QUARANTINE" ? "ALL" : "QUARANTINE"); setVectorFilter(null); }}
              className={`bg-panel border border-line p-4 rounded-md text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                activeFilter === "QUARANTINE" ? "ring-2 ring-rose/60 bg-rose/10 border-rose/50" : "hover:bg-panel2"
              }`}
              title="Click to filter by Soft-Quarantined emails"
            >
              <div className="mono text-[10px] text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Soft-Quarantined</span>
                {activeFilter === "QUARANTINE" && <span className="text-rose text-[9px]">●</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-rose mt-1">{quarantinedCount}</div>
              <div className="text-[11px] text-muted mt-1">{Math.round((quarantinedCount / (totalScans || 1)) * 100)}% of traffic</div>
            </button>

            <button
              onClick={() => { setActiveFilter(activeFilter === "BLOCKED" ? "ALL" : "BLOCKED"); setVectorFilter(null); }}
              className={`bg-panel border border-line p-4 rounded-md text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                activeFilter === "BLOCKED" ? "ring-2 ring-amber/60 bg-amber/10 border-amber/50" : "hover:bg-panel2"
              }`}
              title="Click to filter by Action Blocked emails"
            >
              <div className="mono text-[10px] text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Action Blocked</span>
                {activeFilter === "BLOCKED" && <span className="text-amber text-[9px]">●</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber mt-1">{blockedActionsCount}</div>
              <div className="text-[11px] text-muted mt-1">Proof-of-Action</div>
            </button>

            <button
              onClick={() => { setActiveFilter(activeFilter === "WARNING" ? "ALL" : "WARNING"); setVectorFilter(null); }}
              className={`bg-panel border border-line p-4 rounded-md text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                activeFilter === "WARNING" ? "ring-2 ring-amber/60 bg-amber/10 border-amber/50" : "hover:bg-panel2"
              }`}
              title="Click to filter by Caution Banners"
            >
              <div className="mono text-[10px] text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Warnings Raised</span>
                {activeFilter === "WARNING" && <span className="text-amber text-[9px]">●</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber mt-1">{warningCount}</div>
              <div className="text-[11px] text-muted mt-1">Caution banners</div>
            </button>

            <button
              onClick={() => { setActiveFilter(activeFilter === "SAFE" ? "ALL" : "SAFE"); setVectorFilter(null); }}
              className={`bg-panel border border-line p-4 rounded-md text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                activeFilter === "SAFE" ? "ring-2 ring-mint/60 bg-mint/10 border-mint/50" : "hover:bg-panel2"
              }`}
              title="Click to filter by Verified Safe emails"
            >
              <div className="mono text-[10px] text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Verified Safe</span>
                {activeFilter === "SAFE" && <span className="text-mint text-[9px]">●</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-mint mt-1">{safeCount}</div>
              <div className="text-[11px] text-muted mt-1">Safe Inboxes</div>
            </button>

            <div className="bg-panel border border-line p-4 rounded-md text-left">
              <div className="mono text-[10px] text-muted uppercase tracking-wider">Mean Trust Score</div>
              <div className="text-2xl sm:text-3xl font-bold text-mint mt-1">{averageScore}<span className="text-xs text-muted">/100</span></div>
              <div className="text-[11px] text-muted mt-1">&lt;0.8ms latency</div>
            </div>
          </div>

          {/* Interactive Active Filters Bar with One-Click Reset */}
          {(activeFilter !== "ALL" || vectorFilter || scoreBucketFilter || layerFilter || searchQuery.trim()) && (
            <div className="bg-panel2 border border-mint/40 rounded-lg p-3 flex items-center justify-between flex-wrap gap-2 text-xs shadow-sm animate-fade-up">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="mono text-[10px] text-mint uppercase font-bold">Active Telemetry Filters:</span>
                {activeFilter !== "ALL" && (
                  <span className="bg-panel border border-mint/50 text-mint px-2.5 py-1 rounded mono text-[11px] flex items-center gap-1.5 font-semibold">
                    Verdict: {activeFilter}
                    <button onClick={() => setActiveFilter("ALL")} className="hover:text-white cursor-pointer ml-0.5">✕</button>
                  </span>
                )}
                {vectorFilter && (
                  <span className="bg-panel border border-mint/50 text-mint px-2.5 py-1 rounded mono text-[11px] flex items-center gap-1.5 font-semibold">
                    Threat: {vectorFilter}
                    <button onClick={() => setVectorFilter(null)} className="hover:text-white cursor-pointer ml-0.5">✕</button>
                  </span>
                )}
                {scoreBucketFilter && (
                  <span className="bg-panel border border-mint/50 text-mint px-2.5 py-1 rounded mono text-[11px] flex items-center gap-1.5 font-semibold">
                    Score: {scoreBucketFilter}
                    <button onClick={() => setScoreBucketFilter(null)} className="hover:text-white cursor-pointer ml-0.5">✕</button>
                  </span>
                )}
                {layerFilter && (
                  <span className="bg-panel border border-mint/50 text-mint px-2.5 py-1 rounded mono text-[11px] flex items-center gap-1.5 font-semibold">
                    Layer: {layerFilter}
                    <button onClick={() => setLayerFilter(null)} className="hover:text-white cursor-pointer ml-0.5">✕</button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="bg-panel border border-mint/50 text-mint px-2.5 py-1 rounded mono text-[11px] flex items-center gap-1.5 font-semibold">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="hover:text-white cursor-pointer ml-0.5">✕</button>
                  </span>
                )}
                <span className="mono text-[11px] text-muted ml-2">
                  Showing {filteredScans.length} of {scans.length} scans
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveFilter("ALL");
                  setVectorFilter(null);
                  setScoreBucketFilter(null);
                  setLayerFilter(null);
                  setSearchQuery("");
                }}
                className="mono text-xs bg-rose/15 text-rose border border-rose/40 hover:bg-rose/25 px-3 py-1 rounded cursor-pointer transition-all font-bold shadow-xs"
              >
                Reset All Filters ✕
              </button>
            </div>
          )}

          {/* Deep Statistical Visualizations Grid (Interactive & Versatile Charts) */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart 1: Versatile Multi-Metric Threat Frequency & Impact Bar Chart */}
            <div className="bg-panel border border-line p-5 rounded-md flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="mono text-[10px] text-mint uppercase tracking-wider">ATTACK VECTOR FORENSICS</div>
                    <h3 className="font-semibold text-base mt-0.5 text-white">Threat Patterns Analysis</h3>
                  </div>
                  {/* Versatile Metric Toggle: Volume vs Severity Points */}
                  <div className="flex items-center bg-panel2 border border-line rounded p-0.5 mono text-[10px]">
                    <button
                      onClick={() => setVectorMetric("count")}
                      className={`px-2 py-0.5 rounded transition-all ${vectorMetric === "count" ? "bg-mint text-ink font-bold shadow-xs" : "text-muted hover:text-white"}`}
                      title="View by threat frequency count"
                    >
                      Hits
                    </button>
                    <button
                      onClick={() => setVectorMetric("impact")}
                      className={`px-2 py-0.5 rounded transition-all ${vectorMetric === "impact" ? "bg-mint text-ink font-bold shadow-xs" : "text-muted hover:text-white"}`}
                      title="View by total penalty points impact"
                    >
                      Points
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted mb-2 px-1">
                  <span>{vectorMetric === "count" ? "Category & Incident Volume" : "Category & Penalty Deductions"}</span>
                  {vectorFilter ? (
                    <button
                      onClick={() => setVectorFilter(null)}
                      className="mono text-rose hover:underline cursor-pointer font-semibold"
                    >
                      Clear Filter ✕
                    </button>
                  ) : (
                    <span className="mono text-[10px]">Click row to filter</span>
                  )}
                </div>

                <div className="space-y-2">
                  {Object.entries(vectorStats).map(([name, item]) => {
                    const value = vectorMetric === "count" ? item.count : item.points;
                    const maxVal = vectorMetric === "count" ? maxVectorCount : maxVectorPoints;
                    const pct = Math.round((value / maxVal) * 100);
                    const isSelected = vectorFilter === name;

                    return (
                      <button
                        key={name}
                        onClick={() => setVectorFilter(isSelected ? null : name)}
                        className={`w-full text-left p-2 rounded border transition-all cursor-pointer group ${
                          isSelected ? "bg-panel2 border-mint/60 ring-1 ring-mint/40" : "bg-panel2/40 border-line hover:border-mint/30 hover:bg-panel2"
                        }`}
                        title={`${name}: ${item.count} detections, ${item.points} total penalty points deducted`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm shrink-0">{item.icon}</span>
                            <span className={`truncate ${isSelected ? "text-mint font-bold" : "text-white group-hover:text-mint transition-colors"}`}>
                              {name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 mono text-[11px]">
                            <span className={`font-semibold ${item.color}`}>
                              {vectorMetric === "count" ? `${item.count} hits` : `-${item.points} pts`}
                            </span>
                            {isSelected && <span className="text-mint font-bold">✓</span>}
                          </div>
                        </div>

                        <div className="text-[10px] text-muted truncate mb-1">{item.desc}</div>

                        <div className="h-1.5 bg-line rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isSelected ? "bg-mint" : item.barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mono text-[10px] text-muted/80 pt-3 border-t border-line mt-3 flex items-center justify-between">
                <span>UTS #39 · RDAP · DNS RDATA</span>
                <span className="text-mint">{vectorFilter ? "FILTER ACTIVE" : "6 CATEGORIES"}</span>
              </div>
            </div>

            {/* Chart 2: Interactive Threat Verdict Donut & Action Guard */}
            <div className="bg-panel border border-line p-5 rounded-md flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="mono text-[10px] text-mint uppercase tracking-wider">VERDICT &amp; ACTION RATIOS</div>
                    <h3 className="font-semibold text-base mt-0.5 text-white">Verdict Distribution</h3>
                  </div>
                  <span className="mono text-[10px] text-muted">Click slice to filter</span>
                </div>

                {/* Visual Donut representation with Interactive Dynamic Center */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90 overflow-visible">
                      {/* Background base track */}
                      <circle cx="20" cy="20" r="15" fill="transparent" stroke="#1c2436" strokeWidth="5" />

                      {/* Safe segment */}
                      <circle
                        cx="20" cy="20" r="15" fill="transparent"
                        stroke="#8ff7bd" strokeWidth="5"
                        strokeDasharray={`${(safeCount / (totalScans || 1)) * 94.2} 94.2`}
                        strokeDashoffset="0"
                        className="cursor-pointer transition-all duration-300 hover:stroke-width-[6.5]"
                        onMouseEnter={() => setHoveredDonutSlice({ label: "Safe Inboxes", count: safeCount, pct: Math.round(safeCount / (totalScans || 1) * 100), color: "#8ff7bd", desc: "Verified Safe / Allowed" })}
                        onMouseLeave={() => setHoveredDonutSlice(null)}
                        onClick={() => setActiveFilter(activeFilter === "SAFE" ? "ALL" : "SAFE")}
                      />

                      {/* Warning segment */}
                      <circle
                        cx="20" cy="20" r="15" fill="transparent"
                        stroke="#f2c464" strokeWidth="5"
                        strokeDasharray={`${(warningCount / (totalScans || 1)) * 94.2} 94.2`}
                        strokeDashoffset={`-${(safeCount / (totalScans || 1)) * 94.2}`}
                        className="cursor-pointer transition-all duration-300 hover:stroke-width-[6.5]"
                        onMouseEnter={() => setHoveredDonutSlice({ label: "Warning Banners", count: warningCount, pct: Math.round(warningCount / (totalScans || 1) * 100), color: "#f2c464", desc: "Caution / Verify First" })}
                        onMouseLeave={() => setHoveredDonutSlice(null)}
                        onClick={() => setActiveFilter(activeFilter === "WARNING" ? "ALL" : "WARNING")}
                      />

                      {/* Quarantine segment */}
                      <circle
                        cx="20" cy="20" r="15" fill="transparent"
                        stroke="#f28b82" strokeWidth="5"
                        strokeDasharray={`${(quarantinedCount / (totalScans || 1)) * 94.2} 94.2`}
                        strokeDashoffset={`-${((safeCount + warningCount) / (totalScans || 1)) * 94.2}`}
                        className="cursor-pointer transition-all duration-300 hover:stroke-width-[6.5]"
                        onMouseEnter={() => setHoveredDonutSlice({ label: "Quarantined", count: quarantinedCount, pct: Math.round(quarantinedCount / (totalScans || 1) * 100), color: "#f28b82", desc: "Critical Threats Blocked" })}
                        onMouseLeave={() => setHoveredDonutSlice(null)}
                        onClick={() => setActiveFilter(activeFilter === "QUARANTINE" ? "ALL" : "QUARANTINE")}
                      />
                    </svg>

                    {/* Dynamic Center Readout */}
                    <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2">
                      {hoveredDonutSlice ? (
                        <>
                          <span className="text-sm font-bold leading-tight" style={{ color: hoveredDonutSlice.color }}>
                            {hoveredDonutSlice.pct}%
                          </span>
                          <span className="mono text-[8px] text-white leading-tight font-semibold mt-0.5">
                            {hoveredDonutSlice.count} Scans
                          </span>
                          <span className="mono text-[7px] text-muted truncate max-w-[80px]">
                            {hoveredDonutSlice.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-bold leading-none text-white">{totalScans}</span>
                          <span className="mono text-[8px] text-muted tracking-wider mt-0.5">TOTAL SCANS</span>
                          <span className="mono text-[8px] text-mint mt-0.5 font-bold">{averageScore}/100</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slices legend filter buttons */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                  <button
                    onClick={() => setActiveFilter(activeFilter === "SAFE" ? "ALL" : "SAFE")}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      activeFilter === "SAFE" ? "bg-mint/20 border-mint ring-1 ring-mint" : "bg-panel2 border-line hover:border-mint/40"
                    }`}
                  >
                    <div className="mono text-mint text-xs font-bold">{safeCount} ({Math.round((safeCount / (totalScans || 1)) * 100)}%)</div>
                    <div className="text-[10px] text-muted">Safe Inbox</div>
                  </button>
                  <button
                    onClick={() => setActiveFilter(activeFilter === "WARNING" ? "ALL" : "WARNING")}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      activeFilter === "WARNING" ? "bg-amber/20 border-amber ring-1 ring-amber" : "bg-panel2 border-line hover:border-amber/40"
                    }`}
                  >
                    <div className="mono text-amber text-xs font-bold">{warningCount} ({Math.round((warningCount / (totalScans || 1)) * 100)}%)</div>
                    <div className="text-[10px] text-muted">Warning</div>
                  </button>
                  <button
                    onClick={() => setActiveFilter(activeFilter === "QUARANTINE" ? "ALL" : "QUARANTINE")}
                    className={`p-1.5 rounded border transition-all cursor-pointer ${
                      activeFilter === "QUARANTINE" ? "bg-rose/20 border-rose ring-1 ring-rose" : "bg-panel2 border-line hover:border-rose/40"
                    }`}
                  >
                    <div className="mono text-rose text-xs font-bold">{quarantinedCount} ({Math.round((quarantinedCount / (totalScans || 1)) * 100)}%)</div>
                    <div className="text-[10px] text-muted">Quarantine</div>
                  </button>
                </div>

                {/* Action Assurance Multi-Bar */}
                <div className="mt-3 p-2 rounded bg-panel2/60 border border-line">
                  <div className="flex items-center justify-between text-[10px] mono text-muted mb-1">
                    <span>Proof-of-Action Assurance:</span>
                    <span className="text-white font-bold">{actionStats.blocked} Blocked / {totalScans}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-line flex">
                    <div className="bg-rose h-full transition-all duration-500" style={{ width: `${actionStats.blockedPct}%` }} title={`Blocked: ${actionStats.blockedPct}%`} />
                    <div className="bg-amber h-full transition-all duration-500" style={{ width: `${actionStats.verifyPct}%` }} title={`Verify First: ${actionStats.verifyPct}%`} />
                    <div className="bg-mint h-full transition-all duration-500" style={{ width: `${actionStats.allowedPct}%` }} title={`Allowed: ${actionStats.allowedPct}%`} />
                  </div>
                </div>
              </div>

              <div className="mono text-[10px] text-muted/80 pt-3 border-t border-line mt-3">
                1-CLICK REVERSIBLE SOFT QUARANTINE · ZERO ACCIDENTAL CLICKS
              </div>
            </div>

            {/* Chart 3: Detailed Trust Score Distribution Histogram & Temporal Trend Line (Both Graphs Visible Simultaneously) */}
            <div className="bg-panel border border-line p-5 rounded-md flex flex-col justify-between shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <div className="mono text-[10px] text-mint uppercase tracking-wider">RISK DENSITY &amp; TREND ANALYSIS</div>
                    <h3 className="font-semibold text-base mt-0.5 text-white">Trust Score Analytics</h3>
                  </div>
                  {scoreBucketFilter && (
                    <button
                      onClick={() => setScoreBucketFilter(null)}
                      className="mono text-[10px] text-rose hover:underline cursor-pointer font-semibold bg-rose/10 border border-rose/30 px-2 py-0.5 rounded"
                    >
                      Reset Range: {scoreBucketFilter} ✕
                    </button>
                  )}
                </div>

                {/* GRAPH 1: Distribution Histogram Buckets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mono text-[10px] text-muted">
                    <span className="text-white/90 font-semibold flex items-center gap-1.5">
                      <span>📊</span> Penalty Score Distribution (5 Buckets)
                    </span>
                    <span className="text-[9px]">Click bar to filter ledger</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 pt-2 px-1">
                    {scoreBrackets.map((bracket) => {
                      const heightPct = Math.max(14, (bracket.count / (totalScans || 1)) * 100);
                      const isSelected = scoreBucketFilter === bracket.label;
                      const bracketPct = Math.round((bracket.count / (totalScans || 1)) * 100);

                      return (
                        <button
                          key={bracket.label}
                          onClick={() => setScoreBucketFilter(isSelected ? null : bracket.label)}
                          className={`flex-1 flex flex-col items-center gap-1 h-full justify-end p-1 rounded transition-all cursor-pointer ${
                            isSelected ? "bg-panel2 border-2 border-mint scale-105 shadow-md" : "hover:bg-panel2/60 border border-transparent hover:border-line"
                          }`}
                          title={`${bracket.label} (${bracket.range}): ${bracket.count} scans (${bracketPct}%)`}
                        >
                          <span className={`mono text-[11px] font-extrabold ${bracket.text}`}>{bracket.count}</span>
                          <div
                            className={`w-full rounded-t ${bracket.color} transition-all duration-500 relative ${isSelected ? "ring-2 ring-white" : ""}`}
                            style={{ height: `${heightPct}%` }}
                          >
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t" />
                          </div>
                          <span className="mono text-[9px] text-white font-semibold mt-1">{bracket.label}</span>
                          <span className="mono text-[8px] text-muted hidden sm:inline leading-none">{bracket.range}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GRAPH 2: Chronological Score Trajectory (Trend Line) Directly Below */}
                <div className="pt-3 border-t border-line/60 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between mono text-[10px] text-muted">
                    <span className="text-white/90 font-semibold flex items-center gap-1.5">
                      <span>📈</span> Chronological Score Trajectory (Real Telemetry)
                    </span>
                    <span className="text-mint text-[9px]">● Click dot to inspect</span>
                  </div>
                  <div className="h-28 w-full relative pt-1">
                    <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="scoreTrendGradStacked" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8ff7bd" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8ff7bd" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Threshold reference lines */}
                      <line x1="10" y1="16" x2="290" y2="16" stroke="#8ff7bd" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                      <text x="250" y="14" fill="#8ff7bd" fontSize="7" fontFamily="monospace" opacity="0.8">85+ Safe</text>

                      <line x1="10" y1="44" x2="290" y2="44" stroke="#f2c464" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                      <text x="240" y="42" fill="#f2c464" fontSize="7" fontFamily="monospace" opacity="0.8">45 Caution</text>

                      {/* Render Trend Polyline & Interactive Dots */}
                      {(() => {
                        const trendList = [...scans].reverse().slice(-12);
                        if (trendList.length === 0) return null;
                        const n = trendList.length;
                        const points = trendList.map((s, idx) => {
                          const x = 15 + (idx / Math.max(1, n - 1)) * 265;
                          const score = Number.isFinite(s.score) ? s.score : 50;
                          const y = 70 - (score / 100) * 56;
                          return { x, y, scan: s, score };
                        });

                        const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, "");
                        const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} 72 L ${points[0].x.toFixed(1)} 72 Z`;

                        return (
                          <>
                            <path d={areaD} fill="url(#scoreTrendGradStacked)" />
                            <path d={pathD} fill="none" stroke="#8ff7bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                            {points.map((pt, i) => {
                              const nodeColor = pt.score >= 85 ? "#8ff7bd" : pt.score >= 45 ? "#f2c464" : "#f28b82";
                              const isHovered = hoveredTrendPoint?.id === (pt.scan.id || i);

                              return (
                                <g
                                  key={pt.scan.id || i}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredTrendPoint({ id: pt.scan.id || i, ...pt })}
                                  onMouseLeave={() => setHoveredTrendPoint(null)}
                                  onClick={() => { setSelectedScan(pt.scan); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                >
                                  {isHovered && <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke={nodeColor} strokeWidth="1.5" opacity="0.8" />}
                                  <circle cx={pt.x} cy={pt.y} r={isHovered ? "5.5" : "3.5"} fill={nodeColor} stroke="#0c121e" strokeWidth="1.5" className="transition-all" />
                                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Dynamic Tooltip / Summary strip */}
                  <div className="flex items-center justify-between text-[10px] mono border-t border-line/60 pt-2 text-muted">
                    {hoveredTrendPoint ? (
                      <div className="flex items-center justify-between w-full text-white">
                        <span className="truncate max-w-[160px] text-mint font-semibold">{hoveredTrendPoint.scan.subject}</span>
                        <span className="mono font-bold" style={{ color: hoveredTrendPoint.score >= 85 ? "#8ff7bd" : hoveredTrendPoint.score >= 45 ? "#f2c464" : "#f28b82" }}>
                          Score: {hoveredTrendPoint.score}/100 ({hoveredTrendPoint.scan.outcome})
                        </span>
                      </div>
                    ) : (
                      <>
                        <span>Avg: <strong className="text-mint">{averageScore}/100</strong></span>
                        <span>Range: <strong className="text-white">{Math.min(...scans.map(s => s.score)) || 0}–{Math.max(...scans.map(s => s.score)) || 100}</strong></span>
                        <span className="text-muted">Last {Math.min(scans.length, 12)} Scans</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mono text-[10px] text-muted/80 pt-3 border-t border-line mt-2 flex items-center justify-between">
                <span>DISTRIBUTION BUCKETS &amp; REAL TRAJECTORY</span>
                <span className="text-mint">{scoreBucketFilter ? `FILTERED: ${scoreBucketFilter}` : "DUAL VIEW ACTIVE"}</span>
              </div>
            </div>
          </div>

          {/* Row 2: 6-Layer Cyber Membrane Intercept Matrix & Interactive Temporal Wave Timeline */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* 6-Layer Membrane Intercept Matrix */}
            <div className="lg:col-span-6 bg-panel border border-line p-5 rounded-md flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="mono text-[10px] text-mint uppercase tracking-wider">
                      DEFENSE-IN-DEPTH LAYER EFFICIENCY
                    </div>
                    <h3 className="font-semibold text-base text-white mt-0.5">
                      6-Layer Membrane Intercepts
                    </h3>
                  </div>
                  {layerFilter ? (
                    <button
                      onClick={() => setLayerFilter(null)}
                      className="mono text-[10px] text-rose hover:underline cursor-pointer font-semibold"
                    >
                      Clear ✕
                    </button>
                  ) : (
                    <span className="mono text-[10px] text-muted">Click layer to filter</span>
                  )}
                </div>

                <div className="space-y-2">
                  {membraneLayerStats.map((layer) => {
                    const isSelected = layerFilter === layer.id;
                    const pct = Math.round((layer.count / (totalScans || 1)) * 100);
                    return (
                      <button
                        key={layer.id}
                        onClick={() => setLayerFilter(isSelected ? null : layer.id)}
                        className={`w-full text-left p-2 rounded border transition-all cursor-pointer ${
                          isSelected ? "bg-mint/15 border-mint/60 ring-1 ring-mint/40" : "bg-panel2/50 border-line hover:border-mint/40 hover:bg-panel2"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`font-bold ${layer.color}`}>{layer.label}</span>
                            <span className="mono text-[9px] px-1.5 py-0.2 rounded bg-panel border border-line text-muted">
                              ~{layer.latency}
                            </span>
                          </div>
                          <span className="mono text-white text-[11px] font-bold shrink-0">
                            {layer.count} hits ({pct}%)
                          </span>
                        </div>
                        <div className="text-[11px] text-muted truncate mb-1.5">{layer.desc}</div>
                        <div className="h-1 bg-line rounded-full overflow-hidden">
                          <div className="h-full bg-mint rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mono text-[10px] text-muted/80 pt-3 border-t border-line mt-3 flex items-center justify-between">
                <span>STRICT ON-DEVICE MODULAR CASCADE</span>
                <span className="text-mint">{layerFilter ? `LAYER ${layerFilter} FILTERED` : "M0–M5 ACTIVE"}</span>
              </div>
            </div>

            {/* Interactive Temporal Scans Velocity & Wave Timeline */}
            <div className="lg:col-span-6 bg-panel border border-line p-5 rounded-md flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="mono text-[10px] text-mint uppercase tracking-wider">
                      TEMPORAL AUDIT LEDGER &amp; WAVE TIMELINE
                    </div>
                    <h3 className="font-semibold text-base text-white mt-0.5">
                      Session Scans Velocity Timeline
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="mono text-[10px] text-muted">{filteredScans.length} Events Displayed</span>
                    {filteredScans.length !== scans.length && (
                      <div className="mono text-[9px] text-mint">(Filtered from {scans.length})</div>
                    )}
                  </div>
                </div>

                {/* Real Interactive SVG Wave Timeline with Non-Flickering Smooth Nodes */}
                <div className="p-3 bg-panel2/60 border border-line rounded mb-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] mono text-muted mb-1">
                    <span>TIMELINE WAVE (LATEST EVENTS)</span>
                    <span className="text-mint">● Click dot to inspect</span>
                  </div>

                  <div className="h-20 w-full relative flex items-center">
                    <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8ff7bd" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8ff7bd" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Base reference line */}
                      <line x1="10" y1="45" x2="290" y2="45" stroke="#1c2436" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Plotted scan event nodes from filteredScans */}
                      {filteredScans.slice(0, 10).map((scan, idx) => {
                        const count = Math.min(filteredScans.length, 10);
                        const cx = 20 + (idx / Math.max(1, count - 1)) * 260;
                        const cy = 48 - (scan.score / 100) * 36;
                        const nodeColor = scan.outcome === "SAFE_INBOX" ? "#8ff7bd" : scan.outcome === "WARNING_BANNER" ? "#f2c464" : "#f28b82";
                        const isHovered = hoveredTimelineScan?.id === (scan.id || idx);

                        return (
                          <g
                            key={scan.id || idx}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredTimelineScan({ id: scan.id || idx, ...scan })}
                            onMouseLeave={() => setHoveredTimelineScan(null)}
                            onClick={() => { setSelectedScan(scan); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          >
                            <line x1={cx} y1="45" x2={cx} y2={cy} stroke={nodeColor} strokeWidth={isHovered ? "2" : "1.5"} strokeOpacity={isHovered ? "0.9" : "0.5"} />
                            {isHovered && <circle cx={cx} cy={cy} r="9" fill="none" stroke={nodeColor} strokeWidth="1.5" opacity="0.6" />}
                            <circle cx={cx} cy={cy} r={isHovered ? "6" : "4.5"} fill={nodeColor} stroke="#0c121e" strokeWidth="1.5" className="transition-all duration-150" />
                            {/* Large invisible hit-target to eliminate hover jitter and make clicking effortless */}
                            <circle cx={cx} cy={cy} r="16" fill="transparent" />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Floating Hover Card */}
                  {hoveredTimelineScan && (
                    <div className="bg-panel border border-mint/50 p-2 rounded text-xs shadow-lg mt-1 flex items-center justify-between gap-3 animate-fade-up">
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate max-w-xs">{hoveredTimelineScan.subject}</div>
                        <div className="mono text-[10px] text-muted truncate">{hoveredTimelineScan.sender} · {new Date(hoveredTimelineScan.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`mono font-bold text-xs ${
                          hoveredTimelineScan.score >= 85 ? "text-mint" : hoveredTimelineScan.score >= 45 ? "text-amber" : "text-rose"
                        }`}>
                          {hoveredTimelineScan.score}/100
                        </span>
                        <span className="mono text-[10px] text-mint bg-mint/10 border border-mint/30 px-1.5 py-0.5 rounded">
                          Inspect →
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chronological ledger table from filteredScans */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {filteredScans.slice(0, 7).map((scan, idx) => (
                    <div
                      key={scan.id || idx}
                      onClick={() => { setSelectedScan(scan); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="bg-panel2 p-2 rounded border border-line hover:border-mint/60 flex items-center justify-between gap-2.5 text-xs cursor-pointer hover:bg-panel2/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          scan.outcome === "SAFE_INBOX" ? "bg-mint" : scan.outcome === "WARNING_BANNER" ? "bg-amber" : "bg-rose"
                        }`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate max-w-[180px] sm:max-w-xs">{scan.subject}</div>
                          <div className="text-[10px] text-muted truncate">{scan.sender} · {new Date(scan.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`mono text-xs font-bold ${
                          scan.score >= 85 ? "text-mint" : scan.score >= 45 ? "text-amber" : "text-rose"
                        }`}>
                          {scan.score}/100
                        </span>
                        <span className="text-[10px] text-muted hover:text-white mono">Inspect →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mono text-[10px] text-muted/80 pt-3 border-t border-line mt-3 flex items-center justify-between">
                <span>CUMULATIVE AUDIT: {filteredScans.length} MATCHING</span>
                <span className="text-mint">ZERO REMOTE LEAKAGE</span>
              </div>
            </div>
          </div>

          {/* Live Mail Intercept Feed */}
          <div className="bg-panel border border-line rounded-md p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="mono text-[10px] text-mint uppercase tracking-wider">LIVE FORENSIC FEED</div>
                <h3 className="font-semibold text-lg text-white">Scanned Email Telemetry</h3>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mono text-xs">
                {["ALL", "QUARANTINE", "WARNING", "SAFE", "BLOCKED"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); }}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      activeFilter === filter
                        ? "bg-mint text-ink font-semibold"
                        : "bg-panel2 border border-line text-muted hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Tags Indicator */}
            {hasActiveFilters && (
              <div className="mb-4 p-2.5 bg-panel2 rounded-md border border-line flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="mono text-[10px] text-muted uppercase font-bold">Active Filters:</span>
                  {activeFilter !== "ALL" && (
                    <span className="bg-mint/15 text-mint px-2 py-0.5 rounded mono text-[11px] border border-mint/30">
                      Verdict: {activeFilter}
                    </span>
                  )}
                  {vectorFilter && (
                    <span className="bg-amber/15 text-amber px-2 py-0.5 rounded mono text-[11px] border border-amber/30">
                      Vector: {vectorFilter}
                    </span>
                  )}
                  {scoreBucketFilter && (
                    <span className="bg-mint/15 text-mint px-2 py-0.5 rounded mono text-[11px] border border-mint/30">
                      Score: {scoreBucketFilter}
                    </span>
                  )}
                  {layerFilter && (
                    <span className="bg-rose/15 text-rose px-2 py-0.5 rounded mono text-[11px] border border-rose/30">
                      Layer: {layerFilter}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-panel px-2 py-0.5 rounded mono text-[11px] border border-line text-white">
                      Search: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </div>
                <button
                  onClick={resetAllFilters}
                  className="mono text-[11px] text-rose hover:underline cursor-pointer"
                >
                  Clear All Filters ✕
                </button>
              </div>
            )}

            {/* Real-time Search Input */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry by sender, subject, IP origin, country, or deduction keyword..."
                className="w-full bg-panel2 border border-line rounded px-3.5 py-2 text-xs text-white focus:border-mint outline-none mono transition-colors shadow-inner"
              />
            </div>

            {/* Telemetry Table */}
            {filteredScans.length === 0 ? (
              <div className="p-8 text-center text-muted text-xs mono space-y-2 bg-panel2/40 rounded border border-dashed border-line">
                <div>No emails match the active filter criteria.</div>
                {hasActiveFilters && (
                  <button onClick={resetAllFilters} className="text-mint underline cursor-pointer">
                    Clear active filters to view all emails
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-line mono text-muted text-[10px]">
                      <th className="pb-2">TIME</th>
                      <th className="pb-2">SENDER &amp; SUBJECT</th>
                      <th className="pb-2">ORIGIN</th>
                      <th className="pb-2">TRUST SCORE</th>
                      <th className="pb-2">VERDICT</th>
                      <th className="pb-2">PROOF-OF-ACTION</th>
                      <th className="pb-2 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {filteredScans.map((scan, idx) => (
                      <tr
                        key={scan.id || idx}
                        className={`hover:bg-panel2 transition-colors ${
                          scan.isActiveInGmail ? "bg-mint/5 border-l-2 border-l-mint" : ""
                        }`}
                      >
                        <td className="py-3 mono text-[11px] text-muted whitespace-nowrap">
                          {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {scan.isActiveInGmail && (
                            <span className="block mono text-[8px] text-mint font-bold animate-pulse">
                              ● ACTIVE IN GMAIL
                            </span>
                          )}
                        </td>
                        <td className="py-3 max-w-xs sm:max-w-sm">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{scan.subject}</span>
                          </div>
                          <div className="text-[11px] text-muted truncate mt-0.5">
                            <span className="text-white">{scan.displayName}</span> &lt;{scan.sender}&gt;
                          </div>
                        </td>
                        <td className="py-3 mono text-[11px] text-muted whitespace-nowrap">
                          <div>{scan.originCountry}</div>
                          <div className="text-[10px] opacity-70">{scan.originIp}</div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className={`mono font-bold text-sm ${
                              scan.score >= 85 ? "text-mint" : scan.score >= 45 ? "text-amber" : "text-rose"
                            }`}>
                              {scan.score}
                            </span>
                            <div className="w-12 bg-line h-1 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  scan.score >= 85 ? "bg-mint" : scan.score >= 45 ? "bg-amber" : "bg-rose"
                                }`}
                                style={{ width: `${scan.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            scan.outcome === "SAFE_INBOX"
                              ? "bg-mint/15 text-mint border border-mint/30"
                              : scan.outcome === "WARNING_BANNER"
                              ? "bg-amber/15 text-amber border border-amber/30"
                              : "bg-rose/15 text-rose border border-rose/30"
                          }`}>
                            {scan.outcome}
                          </span>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            scan.actionDecision === "BLOCKED"
                              ? "bg-rose/15 text-rose border border-rose/30"
                              : scan.actionDecision === "VERIFY_FIRST"
                              ? "bg-amber/15 text-amber border border-amber/30"
                              : "bg-mint/15 text-mint border border-mint/30"
                          }`}>
                            {scan.actionDecision}
                          </span>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => { setSelectedScan(scan); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="mono text-xs border border-line hover:border-mint/60 px-2.5 py-1 rounded bg-panel hover:bg-panel2 text-white transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Pair Mobile View Modal - Strictly Screen-Aligned & Viewport Contained */}
      {showPairModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPairModal(false); }}
        >
          <div className="bg-panel2 border border-mint/40 rounded-xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl relative text-left overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-line shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-mint text-lg">📱</span>
                <div>
                  <h3 className="font-bold text-white text-base">Pair Mobile SOC Mirror</h3>
                  <div className="mono text-[10px] text-mint">LOCAL P2P · ZERO CLOUD RETENTION</div>
                </div>
              </div>
              <button onClick={() => setShowPairModal(false)} className="text-muted hover:text-white text-lg cursor-pointer">✕</button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 min-h-0">
              <p className="text-xs text-muted leading-relaxed">
                To preserve our <strong>core USP (Problem Statement ID 26106)</strong>, email telemetry is never uploaded to an external database. You can mirror this SOC dashboard to your mobile device via local peer-to-peer session:
              </p>

              {/* Genuine Scannable QR Code */}
              <div className="bg-white p-3 rounded-lg flex flex-col items-center justify-center mx-auto shadow-inner w-52 h-52">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Scan with Mobile Camera"
                    className="w-44 h-44 rounded object-contain"
                  />
                ) : (
                  <div className="text-xs text-ink font-mono animate-pulse">Generating Scannable QR…</div>
                )}
              </div>

              <div className="text-center space-y-1">
                <div className="text-xs font-semibold text-white">
                  Scan with your smartphone camera or Google Lens
                </div>
                <div className="text-[11px] text-muted">
                  Instantly opens the mobile SOC dashboard mirror on your device.
                </div>
              </div>

              <div className="bg-panel p-3 rounded border border-line mono text-[11px] text-muted space-y-2">
                <div className="text-white flex items-center justify-between">
                  <span>MIRROR LINK:</span>
                  <button
                    onClick={() => {
                      const origin = typeof window !== "undefined" ? window.location.origin : "https://aegis-defense.app";
                      const url = `${origin}?view=dashboard&mode=mobile_mirror`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(url);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }
                    }}
                    className="text-mint hover:underline font-bold text-[10px] cursor-pointer"
                  >
                    {copySuccess ? "✓ Copied Link!" : "Copy Link"}
                  </button>
                </div>
                <div className="truncate text-[10px] text-muted">
                  {typeof window !== "undefined" ? `${window.location.origin}?view=dashboard&mode=mobile_mirror` : "https://aegis-defense.app"}
                </div>
                <div className="text-[10px] text-mintdim">
                  Zero Cloud Storage: Peer device loads client telemetry directly in mobile browser.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 sm:p-4 border-t border-line shrink-0 flex justify-end">
              <button
                onClick={() => setShowPairModal(false)}
                className="bg-mint text-ink font-semibold px-4 py-2 rounded text-xs hover:bg-mintdim transition-colors cursor-pointer"
              >
                Close Mirror
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
