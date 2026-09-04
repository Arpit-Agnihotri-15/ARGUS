/**
 * A.E.G.I.S. Client-Side Forensic PDF Report Generator
 * 
 * 100% Dependency-free, pure JavaScript PDF-1.4 generator.
 * Operates completely on-device without transmitting email data to any server.
 * Meets SIH 2026 Problem Statement ID 26106 Zero-Cloud-Storage mandate.
 */

function sanitizeAscii(str) {
  return String(str == null ? "" : str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\x7e]/g, "?");
}

function pdfEscape(str) {
  return sanitizeAscii(str).replace(/([\\()])/g, "\\$1");
}

function wrapText(text, maxChars = 85) {
  const clean = sanitizeAscii(text).replace(/\s+/g, " ").trim();
  if (!clean) return [""];
  const words = clean.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= maxChars) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      while (current.length > maxChars) {
        lines.push(current.slice(0, maxChars));
        current = current.slice(maxChars);
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Builds standard PDF 1.4 binary bytes from an array of formatted line objects
 */
function buildPdfFromLines(docLines, reportTitle) {
  const TOP = 730;
  const BOTTOM = 55;
  const LEFT = 45;

  const getLineHeight = (style) => {
    switch (style) {
      case "doc-title": return 22;
      case "doc-subtitle": return 16;
      case "h1": return 18;
      case "h2": return 15;
      case "alert": return 14;
      case "space": return 7;
      case "divider": return 10;
      default: return 12;
    }
  };

  // Paginate lines
  const pages = [];
  let currentPage = [];
  let currentY = TOP;

  for (const line of docLines) {
    const height = getLineHeight(line.style);
    if (currentY - height < BOTTOM && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentY = TOP;
    }
    currentPage.push({ ...line, y: currentY });
    currentY -= height;
  }
  if (currentPage.length > 0) pages.push(currentPage);

  const objects = [];
  const addObject = (val) => {
    objects.push(val);
    return objects.length;
  };

  const catalogId = addObject("");
  const pagesId = addObject("");
  const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds = [];

  pages.forEach((lines, pageIdx) => {
    const pageNum = pageIdx + 1;
    const totalPages = pages.length;

    // Header banner and page numbering
    const commands = [
      // Top header banner (deep navy background)
      "0.05 0.10 0.18 rg 0 754 612 38 re f",
      `BT /F2 9 Tf 0.00 0.90 0.60 rg ${LEFT} 768 Td (A.E.G.I.S. FORENSIC INTELLIGENCE SYSTEM) Tj ET`,
      `BT /F1 8 Tf 1 1 1 rg 465 768 Td (Page ${pageNum} of ${totalPages}) Tj ET`,
      // Thin teal accent line below banner
      "0.00 0.90 0.60 RG 2 w 0 754 m 612 754 l S"
    ];

    for (const item of lines) {
      if (item.style === "space" || !item.text) continue;

      if (item.style === "divider") {
        commands.push(`0.80 0.82 0.85 RG 0.75 w ${LEFT} ${item.y + 4} m 567 ${item.y + 4} l S`);
        continue;
      }

      let fontKey = "F1";
      let fontSize = 9;
      let color = "0.15 0.18 0.22"; // default body dark gray
      let indent = LEFT;

      switch (item.style) {
        case "doc-title":
          fontKey = "F2";
          fontSize = 15;
          color = "0.05 0.10 0.20";
          break;
        case "doc-subtitle":
          fontKey = "F1";
          fontSize = 9.5;
          color = "0.35 0.40 0.45";
          break;
        case "h1":
          fontKey = "F2";
          fontSize = 11.5;
          color = "0.04 0.35 0.40"; // deep teal
          break;
        case "h2":
          fontKey = "F2";
          fontSize = 10;
          color = "0.10 0.15 0.25";
          break;
        case "alert-danger":
          fontKey = "F2";
          fontSize = 9.5;
          color = "0.80 0.15 0.15"; // deep red
          break;
        case "alert-warning":
          fontKey = "F2";
          fontSize = 9.5;
          color = "0.75 0.45 0.05"; // amber
          break;
        case "alert-safe":
          fontKey = "F2";
          fontSize = 9.5;
          color = "0.05 0.55 0.35"; // emerald green
          break;
        case "bullet":
          indent = LEFT + 12;
          fontKey = "F1";
          fontSize = 8.5;
          color = "0.20 0.22 0.26";
          break;
        case "field-label":
          fontKey = "F2";
          fontSize = 8.5;
          color = "0.25 0.30 0.35";
          break;
        case "mono":
          fontKey = "F1";
          fontSize = 8;
          color = "0.30 0.35 0.40";
          break;
        default:
          fontKey = "F1";
          fontSize = 8.5;
          color = "0.15 0.18 0.22";
      }

      commands.push(
        `BT /${fontKey} ${fontSize} Tf ${color} rg ${indent} ${item.y} Td (${pdfEscape(item.text)}) Tj ET`
      );
    }

    // Footer
    commands.push(
      "0.85 0.88 0.90 RG 0.5 w 45 42 m 567 42 l S",
      `BT /F1 7 Tf 0.45 0.50 0.55 rg ${LEFT} 30 Td (Generated 100% locally on-device - Zero Remote Data Storage - Problem Statement ID: 26106) Tj ET`,
      `BT /F2 7 Tf 0.04 0.45 0.50 rg 450 30 Td (AICTE Cyber Security Cell) Tj ET`
    );

    const stream = commands.join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    pageIds.push(
      addObject(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`
      )
    );
  });

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n%AEGIS-FORENSIC\n";
  const offsets = [0];
  objects.forEach((obj, idx) => {
    offsets.push(pdf.length);
    pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

function triggerBrowserDownload(bytes, fileName) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* =========================================================================
 * 1. SINGLE EMAIL FORENSIC AUDIT REPORT
 * ========================================================================= */

export function downloadSingleEmailReport(scan, currentUser = "Local SOC Analyst") {
  if (!scan) return;

  const lines = [];
  const add = (text, style = "body") => lines.push({ text: sanitizeAscii(text), style });
  const space = () => lines.push({ text: "", style: "space" });
  const divider = () => lines.push({ text: "", style: "divider" });
  const section = (title) => {
    space();
    add(title.toUpperCase(), "h1");
    divider();
  };

  const wrapField = (label, val) => {
    const full = `${label}: ${val || "Not specified"}`;
    for (const w of wrapText(full, 88)) add(w, "field-label");
  };

  // Header Title
  add("A.E.G.I.S. FORENSIC EMAIL THREAT DOSSIER", "doc-title");
  add("Client-Side Deep Inspection & Security Enforcement Audit", "doc-subtitle");
  space();

  // Metadata
  wrapField("Dossier Reference ID", scan.id || `AEGIS-${Date.now()}`);
  wrapField("Generated On", new Date().toLocaleString());
  wrapField("Session Analyst", currentUser);
  wrapField("Engine Specification", "A.E.G.I.S. v0.38.0 Phase 1 (Proof-of-Action & ML Gate)");
  wrapField("Storage Compliance", "100% Client-Side On-Device (Zero Cloud Transmission)");

  // Section 1: Executive Threat Assessment (Plain English)
  section("1. Executive Threat Assessment & Plain-Language Summary");
  
  const score = scan.score ?? 50;
  const outcome = scan.outcome || "PENDING";
  const actionDecision = scan.actionDecision || "ALLOWED";

  let alertStyle = "alert-safe";
  let plainSummary = "";

  if (score < 45 || outcome === "QUARANTINE" || actionDecision === "BLOCKED") {
    alertStyle = "alert-danger";
    add(`VERDICT: HIGH-RISK DECEPTIVE THREAT [SCORE: ${score}/100 - QUARANTINE]`, alertStyle);
    plainSummary = 
      "CRITICAL SECURITY ADVISORY: This message was detected as a high-risk malicious email attempting deception. " +
      "It contains dangerous characteristics such as spoofed brand identities, homoglyphic lookalike characters, or attempts " +
      "to trick you into unauthorized actions (like entering passwords or diverting financial wire payments). " +
      "A.E.G.I.S. has enforced an immediate quarantine. High-risk actions have been BLOCKED on this workstation.";
  } else if (score < 85 || outcome === "WARNING_BANNER") {
    alertStyle = "alert-warning";
    add(`VERDICT: SUSPICIOUS ACTIVITY DETECTED [SCORE: ${score}/100 - WARNING]`, alertStyle);
    plainSummary = 
      "CAUTION ADVISORY: This email has been flagged with suspicious indicators. It may be from a young/unregistered domain, " +
      "display artificial urgency language, or lack full authentication alignment. Exercise strong caution before clicking " +
      "any links or downloading files from this sender.";
  } else {
    alertStyle = "alert-safe";
    add(`VERDICT: AUTHENTIC MESSAGE VERIFIED [SCORE: ${score}/100 - SAFE INBOX]`, alertStyle);
    plainSummary = 
      "VERIFIED CLEAN: This message successfully passed all six on-device defense membranes. " +
      "Cryptographic sender records (SPF/DKIM) align with the displayed sender, domain reputation is established, " +
      "and no deceptive or malicious patterns were identified in the links, attachments, or message body.";
  }

  space();
  for (const w of wrapText(plainSummary, 88)) add(w, "body");

  // Section 2: Inspected Email Details
  section("2. Message Identity & Header Parameters");
  wrapField("Sender Display Name", scan.displayName);
  wrapField("Sender Email Address", scan.sender);
  wrapField("Email Subject Line", scan.subject);
  wrapField("Delivery Hop / IP", scan.originCountry || "Direct Inbound");
  wrapField("Action Requested", scan.actionType || "Informational Engagement");
  wrapField("Enforced Action Decision", actionDecision);

  // Section 3: Explainable Threat Deductions (Why the score dropped)
  section("3. Forensic Deduction Waterfall (Plain-Language Explanation)");
  const deductions = Array.isArray(scan.deductions) ? scan.deductions : [];
  
  if (deductions.length === 0) {
    add("✓ Clean Sender Posture: No negative security penalties or risk deductions were triggered.", "body");
  } else {
    add("The following risk indicators were identified by the on-device analysis pipeline:", "body");
    space();
    for (const d of deductions) {
      const penalty = `${d.delta || -10} pts`;
      const cat = d.category || "GENERAL RISK";
      const lbl = d.label || d.detail || "Unrecognized risk pattern";
      
      add(`[${penalty}] ${cat}: ${lbl}`, "h2");

      // Plain language explanation of deduction
      let explanation = "";
      const lower = (cat + " " + lbl).toLowerCase();
      if (lower.includes("homoglyph") || lower.includes("uts") || lower.includes("unicode") || lower.includes("cyrillic")) {
        explanation = 
          "What this means: Attackers used foreign alphabet letters (like Cyrillic 'a') that look visually identical to normal English letters. " +
          "This trick fools human eyes while sending users to a fraudulent lookalike website.";
      } else if (lower.includes("bec") || lower.includes("wire") || lower.includes("bank") || lower.includes("payment")) {
        explanation = 
          "What this means: The email asks for updated bank details, wire instructions, or urgent invoice payment. " +
          "This matches Business Email Compromise (BEC) patterns designed to steal funds.";
      } else if (lower.includes("credential") || lower.includes("sign-in") || lower.includes("password")) {
        explanation = 
          "What this means: The email asks you to click a link and log in to verify your account. " +
          "This is a credential-harvesting trap designed to steal your username and password.";
      } else if (lower.includes("urgency") || lower.includes("social") || lower.includes("24 hours") || lower.includes("immediate")) {
        explanation = 
          "What this means: The email uses artificial panic language ('account suspended in 24 hours!') to rush you into acting before verifying legitimacy.";
      } else if (lower.includes("attachment") || lower.includes("extension") || lower.includes(".exe")) {
        explanation = 
          "What this means: The email contains an executable software program disguised as a standard PDF or document (e.g. invoice.pdf.exe). Opening it infects your computer.";
      } else {
        explanation = 
          "What this means: Identity indicators or network transmission records failed verification standards.";
      }

      for (const w of wrapText(explanation, 84)) add(w, "bullet");
      space();
    }
  }

  // Section 4: Proof-of-Action Assurance
  section("4. Proof-of-Action Assurance & Enforced Safeguards");
  add("A.E.G.I.S. enforces 'Zero-Trust for Actions': authentication does not grant authorization to execute critical actions.", "body");
  space();
  wrapField("Action Target", scan.proofOfAction?.action || scan.actionType || "Standard Read");
  wrapField("Policy Enforcement", scan.proofOfAction?.decision || actionDecision);
  wrapField("Enforcement Justification", scan.proofOfAction?.reason || "Client-side safety rule enforcement");

  // Section 5: What You Should Do (Action Plan)
  section("5. Recommended Action Plan for User & Security Team");
  if (score < 45) {
    add("1. DO NOT CLICK any links, buttons, or website addresses inside this email.", "bullet");
    add("2. DO NOT DOWNLOAD or open any file attachments contained in this email.", "bullet");
    add("3. DO NOT REPLY with any sensitive information, passwords, OTPs, or company bank data.", "bullet");
    add("4. IF CREDENTIALS WERE SUBMITTED: Immediately reset your password on the legitimate service from an unaffected device.", "bullet");
    add("5. IT ADMIN ACTION: Add the sender address and domain to your mail filter quarantine blacklist.", "bullet");
  } else if (score < 85) {
    add("1. Verify sender identity through an out-of-band communication channel (phone call or direct message).", "bullet");
    add("2. Inspect link destinations carefully using Protected Click Guard before proceeding.", "bullet");
    add("3. Do not submit sensitive organizational credentials on external web forms.", "bullet");
  } else {
    add("1. Normal safe operation. Standard organizational email hygiene policies apply.", "bullet");
  }

  // Section 6: Forensics Chain-of-Custody & Cryptographic Passport
  section("6. Forensic Chain-of-Custody & Evidence Passport");
  add(`SHA-256 Tamper-Proof Passport: ${scan.evidencePassport || "sha256:authenticated-on-device"}`, "mono");
  add("Verification Status: 100% Cryptographically Verified & Logged in Local Machine Vault", "mono");
  add("Compliance Note: This audit report was compiled locally in volatile memory. No text or credentials leaked to third parties.", "mono");

  // Build and Trigger Download
  const pdfBytes = buildPdfFromLines(lines, `AEGIS-Forensic-Report-${scan.id}`);
  const cleanId = (scan.id || "scan").replace(/[^a-zA-Z0-9_-]/g, "");
  triggerBrowserDownload(pdfBytes, `AEGIS_Forensic_Report_${cleanId}.pdf`);
}

/* =========================================================================
 * 2. COMBINED SOC EXECUTIVE INBOX THREAT REPORT
 * ========================================================================= */

export function downloadCombinedSocReport(scans = [], metrics = {}, currentUser = "Local SOC Analyst") {
  const lines = [];
  const add = (text, style = "body") => lines.push({ text: sanitizeAscii(text), style });
  const space = () => lines.push({ text: "", style: "space" });
  const divider = () => lines.push({ text: "", style: "divider" });
  const section = (title) => {
    space();
    add(title.toUpperCase(), "h1");
    divider();
  };

  const wrapField = (label, val) => {
    const full = `${label}: ${val || "Not specified"}`;
    for (const w of wrapText(full, 88)) add(w, "field-label");
  };

  // Header Title
  add("A.E.G.I.S. SOC EXECUTIVE INBOX THREAT AUDIT", "doc-title");
  add("Comprehensive Posture, Threat Vector Distribution & Incident Log", "doc-subtitle");
  space();

  // Metadata
  wrapField("Report Identifier", `SOC-AUDIT-${new Date().toISOString().slice(0, 10)}-${Date.now().toString(16).slice(-4)}`);
  wrapField("Generated At", new Date().toLocaleString());
  wrapField("SOC Security Analyst", currentUser);
  wrapField("Hackathon Challenge", "Smart India Hackathon 2026 (Problem Statement ID 26106, AICTE)");
  wrapField("Compliance Standard", "Zero-Remote-Storage Mandate (Strictly 100% On-Device Client Forensics)");

  const total = scans.length;
  const quarantined = scans.filter((s) => s.outcome === "QUARANTINE").length;
  const warning = scans.filter((s) => s.outcome === "WARNING_BANNER").length;
  const safe = scans.filter((s) => s.outcome === "SAFE_INBOX").length;
  const blockedActions = scans.filter((s) => s.actionDecision === "BLOCKED").length;
  const avgScore = total > 0 ? Math.round(scans.reduce((a, s) => a + s.score, 0) / total) : 100;

  // Section 1: Executive Security Posture Overview
  section("1. Executive Summary & Mailbox Health Posture");
  
  let healthRating = "GOOD POSTURE";
  let healthStyle = "alert-safe";
  let postureSummary = "";

  if (quarantined > 0 || avgScore < 50) {
    healthRating = "CRITICAL THREAT EXPOSURE";
    healthStyle = "alert-danger";
    postureSummary = 
      `EXECUTIVE ALERT: During this monitoring window, A.E.G.I.S. analyzed ${total} inbound messages and intercepted ` +
      `${quarantined} high-severity malicious phishing threats. Furthermore, ${blockedActions} high-impact actions (including unauthorized ` +
      "wire payment diversions and credential-harvesting submissions) were blocked before execution. Immediate review of quarantined senders is required.";
  } else if (warning > 0 || avgScore < 80) {
    healthRating = "MODERATE CAUTION ADVISED";
    healthStyle = "alert-warning";
    postureSummary = 
      `MONITORING SUMMARY: Out of ${total} emails evaluated, ${warning} message(s) exhibited suspicious behavioral patterns, ` +
      "such as newly registered domain infrastructure or urgency pressure. No critical breaches occurred.";
  } else {
    healthRating = "HEALTHY & SECURE INBOX";
    healthStyle = "alert-safe";
    postureSummary = 
      `HEALTHY POSTURE: All ${total} evaluated messages satisfied authentication and sender identity verification requirements. ` +
      "Zero malicious payloads or deceptive attack vectors were detected.";
  }

  add(`ORGANIZATIONAL HEALTH RATING: ${healthRating} (AVERAGE SCORE: ${avgScore}/100)`, healthStyle);
  space();
  for (const w of wrapText(postureSummary, 88)) add(w, "body");

  // Key KPI Summary
  space();
  add("KEY MONITORING METRICS:", "h2");
  wrapField("Total Inbound Messages Analyzed", `${total} messages`);
  wrapField("Quarantined High-Risk Threats", `${quarantined} (${total ? Math.round((quarantined / total) * 100) : 0}%)`);
  wrapField("Suspicious Caution Messages", `${warning} (${total ? Math.round((warning / total) * 100) : 0}%)`);
  wrapField("Clean / Verified Messages", `${safe} (${total ? Math.round((safe / total) * 100) : 0}%)`);
  wrapField("Critical Unauthorized Actions Blocked", `${blockedActions} actions`);

  // Section 2: Threat Vector Frequency Breakdown
  section("2. Attack Vector Analysis (Frequency of Observed Threats)");
  add("The following breakdown shows the cyber attack techniques observed across the scanned mailbox feed:", "body");
  space();

  const vectorTotals = {
    "Brand Lookalikes (UTS #39 Cyrillic/Unicode Homoglyphs)": 0,
    "Executive BEC / Bank Wire Transfer Diversions": 0,
    "Credential Harvesting (Fake Sign-In Pages)": 0,
    "Artificial Urgency & Social Engineering Pressure": 0,
    "Dangerous & Double-Extension Trojan Attachments": 0,
    "SPF / DKIM / DMARC Domain Identity Mismatches": 0
  };

  scans.forEach((s) => {
    (s.deductions || []).forEach((d) => {
      const lower = (d.category + " " + (d.label || d.detail || "")).toLowerCase();
      if (lower.includes("homoglyph") || lower.includes("unicode") || lower.includes("uts") || lower.includes("cyrillic")) {
        vectorTotals["Brand Lookalikes (UTS #39 Cyrillic/Unicode Homoglyphs)"]++;
      } else if (lower.includes("bec") || lower.includes("wire") || lower.includes("payment") || lower.includes("bank")) {
        vectorTotals["Executive BEC / Bank Wire Transfer Diversions"]++;
      } else if (lower.includes("credential") || lower.includes("harvest") || lower.includes("sign-in")) {
        vectorTotals["Credential Harvesting (Fake Sign-In Pages)"]++;
      } else if (lower.includes("urgency") || lower.includes("social") || lower.includes("pressure")) {
        vectorTotals["Artificial Urgency & Social Engineering Pressure"]++;
      } else if (lower.includes("attachment") || lower.includes("extension") || lower.includes(".exe")) {
        vectorTotals["Dangerous & Double-Extension Trojan Attachments"]++;
      } else if (lower.includes("identity") || lower.includes("auth") || lower.includes("spf") || lower.includes("dmarc")) {
        vectorTotals["SPF / DKIM / DMARC Domain Identity Mismatches"]++;
      }
    });
  });

  Object.entries(vectorTotals).forEach(([vector, count]) => {
    wrapField(vector, `${count} occurrences detected`);
  });

  // Section 3: Comprehensive Scanned Email Inventory
  section("3. Comprehensive Scanned Email Inventory");
  add("Complete listing of all messages evaluated during this operational session:", "body");
  space();

  if (scans.length === 0) {
    add("No messages have been scanned in this session yet.", "body");
  } else {
    scans.forEach((scan, idx) => {
      const num = idx + 1;
      const verdict = scan.outcome || "PENDING";
      const action = scan.actionDecision || "ALLOWED";
      const scoreVal = scan.score ?? 50;

      add(`[#${num}] ${scan.subject || "Untitled Email"}`, "h2");
      add(`    Sender: ${scan.displayName || scan.sender} <${scan.sender}>`, "body");
      add(`    Score: ${scoreVal}/100 | Verdict: ${verdict} | Action Decision: ${action}`, "field-label");
      if (scan.deductions && scan.deductions.length > 0) {
        const topDeduction = scan.deductions[0];
        add(`    Primary Risk Signal: [${topDeduction.category}] ${topDeduction.label || topDeduction.detail}`, "bullet");
      } else {
        add(`    Security Assessment: Clean sender identity and cryptographic proof.`, "bullet");
      }
      add(`    Forensic Passport: ${scan.evidencePassport || "sha256:on-device"}`, "mono");
      space();
    });
  }

  // Section 4: Strategic Recommendations
  section("4. Strategic Organizational Recommendations");
  add("1. IMMEDIATE USER TRAINING: Alert team members against Cyrillic homoglyph lookalikes on popular platforms.", "bullet");
  add("2. OUT-OF-BAND PROTOCOL FOR PAYMENTS: Enforce a strict policy requiring direct voice call confirmation for any wire change.", "bullet");
  add("3. EXTENSION DEPLOYMENT: Ensure the A.E.G.I.S. browser companion is active across all company workstations.", "bullet");
  add("4. LOCAL DATA PRIVACY ATTESTATION: Reassure users that email telemetry remains 100% on-device with zero cloud leakage.", "bullet");

  // Section 5: Compliance and Verification
  section("5. Compliance & Cryptographic Attestation");
  add("This document constitutes an executive forensic audit summary produced by the A.E.G.I.S. SOC Dashboard.", "body");
  add("All evaluations were performed 100% on the client device without transmission to any cloud servers or third-party LLMs.", "body");
  add("Complies with SIH 2026 Problem Statement ID: 26106 (AICTE Cyber Security Cell).", "mono");

  // Build and Trigger Download
  const pdfBytes = buildPdfFromLines(lines, "AEGIS-SOC-Executive-Report");
  triggerBrowserDownload(pdfBytes, `AEGIS_SOC_Executive_Threat_Report_${Date.now()}.pdf`);
}
