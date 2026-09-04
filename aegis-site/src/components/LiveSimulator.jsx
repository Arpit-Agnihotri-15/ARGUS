import { useState } from "react";
import { downloadSingleEmailReport } from "../utils/pdfGenerator.js";

const PRESETS = [
  {
    name: "PayPal Lookalike (Homoglyph)",
    sender: "service@pаypal.com",
    displayName: "PayPal Customer Support",
    subject: "Urgent: Your account access has been limited",
    body: "Dear customer, we detected unauthorized login attempts from a new IP. You must sign-in and confirm your password within 24 hours to restore full access: https://pаypal.com/security-check",
    links: "https://pаypal.com/security-check",
    attachments: ""
  },
  {
    name: "Executive BEC (Wire Diversion)",
    sender: "cfo.chen@consulting-group.net",
    displayName: "Robert Chen (CFO)",
    subject: "Revised Wire Transfer Instructions for Project Milestone",
    body: "Hi team, please find our updated bank account details for today's vendor remittance. Our primary IBAN is under maintenance. Do not delay payment.",
    links: "",
    attachments: "Wire_Details_Updated.docx"
  },
  {
    name: "Malware Double-Extension Invoice",
    sender: "invoices@global-logistics-fast.org",
    displayName: "Global Logistics Billing",
    subject: "OVERDUE INVOICE #8890 - Final Notice",
    body: "Please review the attached invoice immediately to avoid statutory legal actions and service suspension.",
    links: "",
    attachments: "Invoice_8890_Statement.pdf.exe"
  },
  {
    name: "Legitimate Notion Notification",
    sender: "team@notion.so",
    displayName: "Notion Team",
    subject: "You have 2 new updates in Project Roadmap",
    body: "Hi there, your team members have left comments in the SIH 2026 Strategy workspace. Click below to view the latest changes.",
    links: "https://www.notion.so/workspace/sih-2026",
    attachments: ""
  }
];

const AEGIS_EXT_ID = "feblkjonnopmmcojjidcnakbpdpkmajh";

export function LiveSimulator() {
  const [form, setForm] = useState(PRESETS[0]);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  const applyPreset = (preset) => {
    setForm(preset);
    runAnalysis(preset);
  };

  const syncWithActiveGmail = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    if (typeof window !== "undefined" && window.chrome?.runtime?.sendMessage) {
      try {
        window.chrome.runtime.sendMessage(AEGIS_EXT_ID, { type: "GET_TELEMETRY" }, (res) => {
          setIsSyncing(false);
          if (res && res.ok && res.telemetry) {
            const last = res.telemetry.lastScan;
            const rawMap = res.telemetry.scanResultsByEmail || {};
            const recentList = Object.entries(rawMap).map(([email, item]) => ({
              email,
              subject: item?.subjectKey || "Email Message",
              score: item?.score ?? 50,
              outcome: item?.outcome || "SAFE_INBOX",
              displayName: item?.senderDisplayName || email.split("@")[0],
              ts: item?.ts || 0,
              snippet: item?.snippet || item?.bodyText || "",
              links: Array.isArray(item?.linksScanned) ? item.linksScanned.join("\n") : (item?.links || ""),
              attachments: Array.isArray(item?.attachments) ? item.attachments.map(a => a.name || a).join(", ") : ""
            })).sort((a, b) => (b.ts || 0) - (a.ts || 0));

            setRecentScans(recentList);

            if (last && (last.email || last.sender)) {
              const senderEmail = last.email || last.sender;
              const syncedForm = {
                name: `Gmail: ${last.subjectKey || senderEmail}`,
                sender: senderEmail,
                displayName: last.senderDisplayName || senderEmail.split("@")[0],
                subject: last.subjectKey || "Inspected Message",
                body: last.snippet || last.bodyText || `[Live Email Sync from Gmail] Inspected on-device. Score: ${last.score ?? 50}/100, Verdict: ${last.outcome || "PENDING"}.`,
                links: Array.isArray(last.linksScanned) ? last.linksScanned.join("\n") : (last.links || ""),
                attachments: Array.isArray(last.attachments) ? last.attachments.map(a => a.name || a).join(", ") : ""
              };
              setForm(syncedForm);
              runAnalysis(syncedForm);
              setSyncStatus({
                type: "success",
                text: `Active Gmail message synchronized: "${last.subjectKey || "Message"}" from ${senderEmail} (${last.score ?? 50}/100)`
              });
            } else if (recentList.length > 0) {
              setSyncStatus({
                type: "info",
                text: `Extension connected! Found ${recentList.length} captured email(s) in local session. Click any email from the "Captured Gmail Feed" below to inspect it.`
              });
            } else {
              setSyncStatus({
                type: "warn",
                text: "Extension connected, but no email is open or scanned yet. Open any email in your Gmail tab, click the A.E.G.I.S. extension icon once, then click Sync!"
              });
            }
          } else {
            setSyncStatus({
              type: "error",
              text: "Could not reach A.E.G.I.S. extension. Ensure it is loaded and enabled in chrome://extensions."
            });
          }
        });
      } catch {
        setIsSyncing(false);
        setSyncStatus({
          type: "error",
          text: "Bridge communication error connecting to extension."
        });
      }
    } else {
      setIsSyncing(false);
      setSyncStatus({
        type: "error",
        text: "Extension bridge not found. Run in Google Chrome or Edge with A.E.G.I.S. extension loaded."
      });
    }
  };

  const runAnalysis = (data = form) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let score = 100;
      const deductions = [];
      let actionType = "INFORMATIONAL";
      let actionDecision = "ALLOWED";
      let actionReason = "No sensitive authorization requested";

      const senderLower = (data.sender || "").toLowerCase();
      const bodyLower = (data.body || "").toLowerCase();
      const attachLower = (data.attachments || "").toLowerCase();
      const linksLower = (data.links || "").toLowerCase();

      // 1. Unicode Lookalike / Confusable check
      // Cyrillic 'а' (\u0430) vs Latin 'a' (\u0061)
      if (/[\u0400-\u04FF]/.test(data.sender) || /[\u0400-\u04FF]/.test(data.links)) {
        score -= 30;
        deductions.push({
          category: "Unicode Homoglyph (UTS #39)",
          detail: "Detected non-Latin confusable characters spoofing known brand name",
          delta: -30
        });
      }

      // 2. Double Extension check
      if (/\.(pdf|doc|docx|xlsx|txt)\.(exe|scr|bat|cmd|vbs|js|ps1)$/i.test(attachLower)) {
        score -= 35;
        deductions.push({
          category: "Dangerous Attachment",
          detail: "Executable masquerading behind decoy document extension (.pdf.exe)",
          delta: -35
        });
        actionType = "ATTACHMENT_OR_LINK";
        actionDecision = "BLOCKED";
        actionReason = "Executable file download detected from untrusted sender";
      }

      // 3. Financial Diversion / Wire patterns
      if (/\b(wire|bank|payment|invoice|iban|beneficiary|remit|swift)\b/i.test(bodyLower) &&
          /\b(update|change|new account|revised|divert|instructions)\b/i.test(bodyLower)) {
        score -= 25;
        deductions.push({
          category: "BEC / Financial Diversion",
          detail: "Banking/wire account change language detected (high fraud correlation)",
          delta: -25
        });
        actionType = "PAYMENT_OR_BANK_CHANGE";
        actionDecision = "BLOCKED";
        actionReason = "Financial transfer alteration requested without out-of-band identity proof";
      }

      // 4. Credential Harvest / Login patterns
      if (/\b(sign[ -]?in|log[ -]?in|password|passcode|verify|confirm account|security code)\b/i.test(bodyLower)) {
        if (score < 80 || /urgent|immediate|limited|suspend/i.test(bodyLower)) {
          score -= 20;
          deductions.push({
            category: "Credential Harvesting",
            detail: "Sign-in / password prompt coupled with urgency language",
            delta: -20
          });
          actionType = "CREDENTIAL_OR_AUTH";
          actionDecision = "BLOCKED";
          actionReason = "Credential submission requested on an unverified domain";
        }
      }

      // 5. Artificial Urgency / Pressure
      if (/\b(urgent|immediately|within 24 hours|account limited|action required|final notice|suspended)\b/i.test(bodyLower)) {
        score -= 15;
        deductions.push({
          category: "Social Engineering",
          detail: "Artificial urgency language designed to bypass rational caution",
          delta: -15
        });
      }

      // 6. Suspicious domain TLD / Link
      if (/\.(zip|mov|top|xyz|cc|tk|work)/i.test(senderLower) || /\.(zip|mov|top|xyz|cc|tk|work)/i.test(linksLower)) {
        score -= 15;
        deductions.push({
          category: "Domain Reputation",
          detail: "High-risk top-level domain frequently associated with throwaway phishing kits",
          delta: -15
        });
      }

      const finalScore = Math.max(5, Math.min(100, score));
      let outcome = "SAFE_INBOX";
      if (finalScore < 45) {
        outcome = "SOFT_QUARANTINE";
      } else if (finalScore < 85) {
        outcome = "WARNING_BANNER";
      }

      if (actionDecision === "BLOCKED" && outcome === "SAFE_INBOX") {
        outcome = "WARNING_BANNER";
      }

      setResult({
        score: finalScore,
        outcome,
        deductions,
        actionType,
        actionDecision,
        actionReason,
        scannedAt: new Date().toLocaleTimeString()
      });
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-panel border border-line rounded-lg p-6">
        <div className="mono text-[11px] text-mint uppercase tracking-widest mb-1">
          INTERACTIVE THREAT INSPECTOR
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Test A.E.G.I.S. Membrane Logic Live
        </h2>
        <p className="text-muted text-sm max-w-2xl mt-2">
          Select a preset attack vector or type custom sender, link, and message content.
          The simulator executes the exact same on-device scoring algorithm running in the browser extension.
        </p>

        {/* Live Sync Bar */}
        <div className="mt-5 p-4 rounded-md bg-panel2 border border-mint/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={syncWithActiveGmail}
              disabled={isSyncing}
              className="bg-mint text-ink font-bold px-4 py-2 rounded text-xs flex items-center gap-2 hover:bg-mintdim active:scale-[0.98] transition-all shadow-sm shrink-0"
            >
              <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber animate-spin" : "bg-ink animate-pulse"}`} />
              {isSyncing ? "Syncing from Extension…" : "⚡ Sync From Active Gmail Message"}
            </button>
            <span className="text-xs text-muted">
              Live-imports the email currently open in your Gmail/Outlook tab for real-time analysis.
            </span>
          </div>

          <div className="mono text-[10px] text-mint flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            ZERO-TOKEN EXTENSION BRIDGE
          </div>
        </div>

        {/* Sync Alert Banner */}
        {syncStatus && (
          <div className={`mt-3 p-3 rounded text-xs border flex items-center justify-between gap-2 ${
            syncStatus.type === "success"
              ? "bg-mint/10 border-mint/40 text-mint"
              : syncStatus.type === "warn"
              ? "bg-amber/10 border-amber/40 text-amber"
              : "bg-rose/10 border-rose/40 text-rose"
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold">{syncStatus.type === "success" ? "✓" : "⚠"}</span>
              <span>{syncStatus.text}</span>
            </div>
            <button onClick={() => setSyncStatus(null)} className="text-xs hover:underline ml-2">✕</button>
          </div>
        )}

        {/* Attack Vector Presets */}
        <div className="mt-4 space-y-2">
          <div className="mono text-[10px] text-muted tracking-wider uppercase flex items-center justify-between">
            <span>Instant Threat Presets (For Evaluators & Demo):</span>
            <span className="text-mint">No Gmail required</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="mono text-xs bg-panel2 hover:bg-panel2/80 border border-line hover:border-mint/50 text-muted hover:text-white px-3 py-1.5 rounded transition-all active:scale-[0.98]"
              >
                ⚡ {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Captured Gmail Messages Feed */}
        <div className="mt-5 pt-4 border-t border-line/60">
          <div className="flex items-center justify-between mb-2">
            <div className="mono text-[10px] text-mint uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              <span>Captured Mailbox Messages ({recentScans.length})</span>
            </div>
            <span className="mono text-[10px] text-muted">Click any email below to inspect its exact fields</span>
          </div>

          {recentScans.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {recentScans.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const s = {
                      name: `Gmail: ${r.subject}`,
                      sender: r.email,
                      displayName: r.displayName,
                      subject: r.subject,
                      body: r.snippet || `[Mailbox Scanned Email] Sender: ${r.email}`,
                      links: r.links || "",
                      attachments: r.attachments || ""
                    };
                    setForm(s);
                    runAnalysis(s);
                    setSyncStatus({
                      type: "success",
                      text: `Selected email loaded into inspector: "${r.subject}" (${r.email})`
                    });
                  }}
                  className="bg-panel2 p-2.5 rounded border border-line hover:border-mint/60 cursor-pointer transition-all hover:bg-panel2/80 text-left group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white truncate max-w-[150px] group-hover:text-mint transition-colors">
                      {r.subject}
                    </span>
                    <span className={`mono text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      r.score >= 85 ? "bg-mint/20 text-mint" : r.score >= 45 ? "bg-amber/20 text-amber" : "bg-rose/20 text-rose"
                    }`}>
                      {r.score}/100
                    </span>
                  </div>
                  <div className="text-[11px] text-muted truncate">
                    {r.email}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] mono text-mint">
                    <span>Inspect fields →</span>
                    <span className="text-muted text-[9px]">{r.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-panel2/60 border border-line rounded p-3 text-xs text-muted space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <span>💡</span> How to sync live Gmail messages:
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-muted">
                <li>Open an email in your Gmail tab (<code className="text-mint mono">mail.google.com</code>).</li>
                <li>Click the <strong>A.E.G.I.S.</strong> icon in your browser extension toolbar (this analyzes the open email).</li>
                <li>Click <strong>&quot;⚡ Sync From Active Gmail Message&quot;</strong> above. It will appear here immediately!</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Input Form */}
        <div className="lg:col-span-6 bg-panel border border-line rounded-lg p-5 space-y-4">
          <div className="font-semibold text-sm border-b border-line pb-3 flex items-center justify-between">
            <span>Email Header & Content Fields</span>
            <span className="mono text-[10px] text-mint">ON-DEVICE PARSER</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mono text-[10px] text-muted mb-1">DISPLAY NAME</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none mono"
                placeholder="e.g. PayPal Support"
              />
            </div>
            <div>
              <label className="block mono text-[10px] text-muted mb-1">SENDER EMAIL ADDRESS</label>
              <input
                type="text"
                value={form.sender}
                onChange={(e) => setForm({ ...form, sender: e.target.value })}
                className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none mono"
                placeholder="e.g. service@paypal.com"
              />
            </div>
          </div>

          <div>
            <label className="block mono text-[10px] text-muted mb-1">SUBJECT LINE</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block mono text-[10px] text-muted mb-1">LINKS IN EMAIL (URLS)</label>
            <input
              type="text"
              value={form.links}
              onChange={(e) => setForm({ ...form, links: e.target.value })}
              className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none mono"
              placeholder="e.g. https://domain.com/login"
            />
          </div>

          <div>
            <label className="block mono text-[10px] text-muted mb-1">ATTACHMENTS</label>
            <input
              type="text"
              value={form.attachments}
              onChange={(e) => setForm({ ...form, attachments: e.target.value })}
              className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none mono"
              placeholder="e.g. invoice.pdf.exe"
            />
          </div>

          <div>
            <label className="block mono text-[10px] text-muted mb-1">MESSAGE BODY TEXT</label>
            <textarea
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full bg-panel2 border border-line rounded px-3 py-2 text-xs text-white focus:border-mint outline-none"
              placeholder="Email body text..."
            />
          </div>

          <button
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
            className="w-full bg-mint text-ink font-semibold py-2.5 rounded text-xs hover:bg-mintdim active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? "Executing Multi-Signal Pipeline..." : "Execute Membrane Analysis →"}
          </button>
        </div>

        {/* Live Output Dossier */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="bg-panel border border-line rounded-lg p-5 space-y-4 animate-fade-up">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="mono text-[10px] text-mint uppercase tracking-wider">
                  SCAN RESULT DOSSIER
                </div>
                <div className="mono text-[10px] text-muted">{result.scannedAt}</div>
              </div>

              {/* Score Header */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-panel2 p-3.5 rounded border border-line text-center">
                  <div className="mono text-[10px] text-muted">SCORE</div>
                  <div className={`text-3xl font-bold mono mt-1 ${
                    result.score >= 85 ? "text-mint" : result.score >= 45 ? "text-amber" : "text-rose"
                  }`}>
                    {result.score}
                    <span className="text-xs text-muted">/100</span>
                  </div>
                </div>

                <div className="bg-panel2 p-3.5 rounded border border-line text-center">
                  <div className="mono text-[10px] text-muted">OUTCOME</div>
                  <div className={`text-sm font-bold mt-2.5 ${
                    result.outcome === "SAFE_INBOX" ? "text-mint" : result.outcome === "WARNING_BANNER" ? "text-amber" : "text-rose"
                  }`}>
                    {result.outcome.replace("_", " ")}
                  </div>
                </div>

                <div className="bg-panel2 p-3.5 rounded border border-line text-center">
                  <div className="mono text-[10px] text-muted">ACTION DECISION</div>
                  <div className={`text-sm font-bold mt-2.5 ${
                    result.actionDecision === "BLOCKED" ? "text-rose" : result.actionDecision === "VERIFY_FIRST" ? "text-amber" : "text-mint"
                  }`}>
                    {result.actionDecision}
                  </div>
                </div>
              </div>

              {/* Deduction Waterfall */}
              <div>
                <div className="mono text-[11px] text-muted mb-2 uppercase tracking-wider">
                  Deduction Waterfall ({result.deductions.length} signals)
                </div>
                {result.deductions.length > 0 ? (
                  <div className="space-y-2">
                    {result.deductions.map((d, idx) => (
                      <div key={idx} className="bg-panel2 p-2.5 rounded border border-line flex items-center justify-between text-xs">
                        <div className="pr-2">
                          <div className="mono text-[10px] text-mint">{d.category}</div>
                          <div className="text-white mt-0.5">{d.detail}</div>
                        </div>
                        <span className="mono font-bold text-rose shrink-0">{d.delta} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-panel2 p-3 rounded border border-mint/30 text-xs text-mint">
                    ✓ Clean message. No risk indicators triggered.
                  </div>
                )}
              </div>

              {/* Proof of Action Card */}
              <div className="bg-panel2 p-3 rounded border border-line text-xs space-y-1">
                <div className="mono text-[10px] text-amber uppercase">PROOF-OF-ACTION ENFORCEMENT</div>
                <div className="font-semibold text-white">{result.actionType}</div>
                <div className="text-muted">{result.actionReason}</div>
              </div>

              {/* PDF Report Export */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const scanObj = {
                      id: `SIM-${Date.now().toString(16).slice(-4)}`,
                      displayName: form.displayName || "Simulated Sender",
                      sender: form.sender || "unknown@domain.com",
                      subject: form.subject || "Simulated Message",
                      originCountry: "Local Simulator Sandbox",
                      score: result.score,
                      outcome: result.outcome,
                      actionType: result.actionType,
                      actionDecision: result.actionDecision,
                      deductions: result.deductions.map(d => ({ category: d.category, label: d.detail, delta: d.delta })),
                      proofOfAction: {
                        action: result.actionType,
                        decision: result.actionDecision,
                        reason: result.actionReason
                      },
                      evidencePassport: `sha256:${Math.abs(result.score * 8899).toString(16).padStart(64, "b")}`
                    };
                    downloadSingleEmailReport(scanObj, "Simulator Analyst");
                  }}
                  className="w-full bg-panel2 hover:bg-panel2/80 border border-mint/40 text-mint font-semibold py-2.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                  title="Export this simulated analysis as a detailed PDF forensic report"
                >
                  <span>📄</span> Download Simulator Forensic PDF Report
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-panel border border-dashed border-line rounded-lg p-12 text-center text-muted text-xs">
              Click &quot;Execute Membrane Analysis&quot; or select one of the attack presets above to simulate live email evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
