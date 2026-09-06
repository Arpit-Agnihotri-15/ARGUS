import { useEffect, useRef, useState } from "react";

export function CyberGlobe3D({ className = "", isExtensionLinked = false, telemetry = null, theme = "dark" }) {
  const canvasRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });

  const isLight = theme === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 500;
      height = canvas.height = canvas.parentElement.clientHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    // Globe parameters
    const radius = Math.min(width, height) * 0.37;
    let rotX = 0.22;
    let rotY = 0;

    // Palette adaptation for theme
    const safeColor = isLight ? "#059669" : "#8ff7bd";
    const warnColor = isLight ? "#d97706" : "#f2c464";
    const dangerColor = isLight ? "#e11d48" : "#f28b82";

    // Threat nodes on the sphere (lat, lon, label, risk, color)
    const nodes = [
      { lat: 28.6139, lon: 77.209, label: "AICTE Node [IN]", risk: "VERIFIED", color: safeColor },
      { lat: 37.7749, lon: -122.4194, label: "Google Gmail MTA [US]", risk: "M1 AUTH", color: safeColor },
      { lat: 51.5074, lon: -0.1278, label: "Outlook Exchange [UK]", risk: "M1 AUTH", color: safeColor },
      { lat: 55.7558, lon: 37.6173, label: "Anon FastFlux Proxy [RU]", risk: "QUARANTINE", color: dangerColor },
      { lat: 1.3521, lon: 103.8198, label: "Cloudflare Secure DoH [SG]", risk: "SAFE", color: safeColor },
      { lat: 35.6762, lon: 139.6503, label: "Punycode Homoglyph [JP]", risk: "BLOCKED", color: warnColor },
      { lat: -33.8688, lon: 151.2093, label: "Edge Security Relay [AU]", risk: "SAFE", color: safeColor },
      { lat: 52.52, lon: 13.405, label: "Direct IP Mailer [DE]", risk: "SUSPICIOUS", color: warnColor }
    ];

    // Generate latitude/longitude ring points
    const ringCount = 9;
    const pointsPerRing = 48;
    const rings = [];

    for (let r = 1; r < ringCount; r++) {
      const phi = (Math.PI * r) / ringCount;
      const ring = [];
      for (let p = 0; p < pointsPerRing; p++) {
        const theta = (2 * Math.PI * p) / pointsPerRing;
        ring.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.cos(phi),
          z: radius * Math.sin(phi) * Math.sin(theta)
        });
      }
      rings.push(ring);
    }

    // Great circle arcs between nodes (threat packet paths)
    const arcs = [
      { from: 3, to: 0, progress: 0, speed: 0.007, color: dangerColor },
      { from: 5, to: 1, progress: 0.4, speed: 0.009, color: warnColor },
      { from: 1, to: 0, progress: 0.7, speed: 0.006, color: safeColor },
      { from: 4, to: 0, progress: 0.2, speed: 0.008, color: safeColor }
    ];

    // Coordinate conversion
    const latLonTo3D = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta)
      };
    };

    const nodePositions = nodes.map(n => ({
      ...n,
      ...latLonTo3D(n.lat, n.lon, radius)
    }));

    // Mouse tilt interactions
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / height) * 2 - 1;
      mouseRef.current.targetX = nx * 0.8;
      mouseRef.current.targetY = ny * 0.8;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotY += 0.0055;
      const currentRotX = rotX + mouseRef.current.y * 0.45;
      const currentRotY = rotY + mouseRef.current.x * 0.75;

      // 3D Rotation helper
      const project = (x, y, z) => {
        let x1 = x * Math.cos(currentRotY) + z * Math.sin(currentRotY);
        let z1 = -x * Math.sin(currentRotY) + z * Math.cos(currentRotY);
        let y2 = y * Math.cos(currentRotX) - z1 * Math.sin(currentRotX);
        let z2 = y * Math.sin(currentRotX) + z1 * Math.cos(currentRotX);

        const fov = 650;
        const scale = fov / (fov + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          z: z2,
          scale
        };
      };

      // 1. Anchored 3D Grounding Shadow beneath Sphere
      const floorY = cy + radius * 1.06;
      const floorGrad = ctx.createRadialGradient(cx, floorY, 10, cx, floorY, radius * 0.95);
      if (isLight) {
        floorGrad.addColorStop(0, "rgba(15, 23, 42, 0.16)");
        floorGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.06)");
        floorGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        floorGrad.addColorStop(0, "rgba(0, 0, 0, 0.6)");
        floorGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.2)");
        floorGrad.addColorStop(1, "rgba(5, 11, 9, 0)");
      }
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.ellipse(cx, floorY, radius * 0.92, radius * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ambient Cyber/Holographic Sphere Glow
      const globeBack = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.05,
        cx,
        cy,
        radius * 1.05
      );
      if (isLight) {
        globeBack.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        globeBack.addColorStop(0.4, "rgba(241, 245, 249, 0.8)");
        globeBack.addColorStop(0.85, "rgba(209, 250, 229, 0.4)");
        globeBack.addColorStop(1, "rgba(5, 150, 105, 0.15)");
      } else {
        globeBack.addColorStop(0, "rgba(143, 247, 189, 0.10)");
        globeBack.addColorStop(0.5, "rgba(15, 35, 28, 0.35)");
        globeBack.addColorStop(1, "rgba(5, 11, 9, 0.85)");
      }
      ctx.fillStyle = globeBack;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Outer Targeting Reticle Rings
      ctx.strokeStyle = isLight ? "rgba(5, 150, 105, 0.35)" : "rgba(143, 247, 189, 0.20)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.22, tick * 0.002, tick * 0.002 + Math.PI * 2);
      ctx.stroke();

      // Inner subtle reticle
      ctx.strokeStyle = isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(143, 247, 189, 0.08)";
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.12, -tick * 0.0015, -tick * 0.0015 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Draw Latitude Wireframe Rings
      rings.forEach((ring, idx) => {
        ctx.beginPath();
        let first = true;
        ring.forEach(pt => {
          const pr = project(pt.x, pt.y, pt.z);
          const isFront = pr.z <= 0;
          const alpha = isFront
            ? (1 - Math.abs(pr.z) / radius) * 0.55
            : 0.12;

          ctx.strokeStyle = isLight
            ? isFront
              ? `rgba(5, 150, 105, ${Math.max(0.15, alpha * 0.9)})`
              : "rgba(15, 23, 42, 0.08)"
            : isFront
              ? `rgba(143, 247, 189, ${Math.max(0.12, alpha)})`
              : "rgba(143, 247, 189, 0.04)";

          if (first) {
            ctx.moveTo(pr.px, pr.py);
            first = false;
          } else {
            ctx.lineTo(pr.px, pr.py);
          }
        });
        ctx.closePath();
        ctx.lineWidth = isLight && idx === 4 ? 1.5 : 1;
        ctx.stroke();
      });

      // 5. Draw Longitudinal Meridians
      const meridianCount = 12;
      for (let m = 0; m < meridianCount; m++) {
        const theta = (2 * Math.PI * m) / meridianCount;
        ctx.beginPath();
        let first = true;
        for (let r = 0; r <= ringCount; r++) {
          const phi = (Math.PI * r) / ringCount;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          const pr = project(x, y, z);
          const isFront = pr.z <= 0;
          const alpha = isFront
            ? (1 - Math.abs(pr.z) / radius) * 0.5
            : 0.10;

          ctx.strokeStyle = isLight
            ? isFront
              ? `rgba(5, 150, 105, ${Math.max(0.14, alpha * 0.85)})`
              : "rgba(15, 23, 42, 0.07)"
            : isFront
              ? `rgba(143, 247, 189, ${Math.max(0.10, alpha)})`
              : "rgba(143, 247, 189, 0.03)";

          if (first) {
            ctx.moveTo(pr.px, pr.py);
            first = false;
          } else {
            ctx.lineTo(pr.px, pr.py);
          }
        }
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 6. Draw High-Intensity Flowing Packet Arcs
      arcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        const p1 = nodePositions[arc.from];
        const p2 = nodePositions[arc.to];

        const midElev = 1.38;
        const t = arc.progress;
        const curX = p1.x * (1 - t) + p2.x * t;
        const curY = p1.y * (1 - t) + p2.y * t;
        const curZ = p1.z * (1 - t) + p2.z * t;
        const mag = Math.sqrt(curX * curX + curY * curY + curZ * curZ) || 1;
        const arcRadius = radius * (1 + Math.sin(t * Math.PI) * (midElev - 1));

        const ptX = (curX / mag) * arcRadius;
        const ptY = (curY / mag) * arcRadius;
        const ptZ = (curZ / mag) * arcRadius;

        const pr = project(ptX, ptY, ptZ);
        if (pr.z < radius * 0.85) {
          ctx.fillStyle = arc.color;
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = isLight ? 6 : 10;
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, (isLight ? 4.5 : 3.8) * pr.scale, 0, Math.PI * 2);
          ctx.fill();

          // Subtle tail particle
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(pr.px - 3, pr.py - 1, 2.5 * pr.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      });

      // 7. Draw Threat Telemetry Nodes with Crisp Multi-Ring Glow
      let hovered = null;
      nodePositions.forEach(node => {
        const pr = project(node.x, node.y, node.z);
        if (pr.z < radius * 0.9) {
          const depthAlpha = Math.max(0.25, (radius - pr.z) / (radius * 2));
          const nodeRadius = (isLight ? 5.5 : 5) * pr.scale;

          const pulse = (Math.sin(tick * 0.08 + node.lat) + 1) * 0.5;

          // Outer pulse ripple
          ctx.strokeStyle = node.color;
          ctx.lineWidth = isLight ? 1.5 : 1;
          ctx.globalAlpha = depthAlpha * (1 - pulse);
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, nodeRadius + pulse * 8, 0, Math.PI * 2);
          ctx.stroke();

          // Solid core node
          ctx.globalAlpha = depthAlpha;
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = isLight ? 6 : 8;
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, nodeRadius, 0, Math.PI * 2);
          ctx.fill();

          // In light mode, add crisp white inner highlight
          if (isLight) {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pr.px - 1.2, pr.py - 1.2, nodeRadius * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          const distToMouse = Math.hypot(
            pr.px - (mouseRef.current.targetX * 0.5 + 0.5) * width,
            pr.py - (mouseRef.current.targetY * 0.5 + 0.5) * height
          );
          if (distToMouse < 24) {
            hovered = { ...node, px: pr.px, py: pr.py };
          }
        }
      });

      if (hovered) {
        setActiveNode(hovered);
      } else if (tick % 60 === 0) {
        setActiveNode(null);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [isLight]);

  return (
    <div className={`relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyberpunk HUD Frame overlays - Top Left */}
      <div className={`absolute top-4 left-4 pointer-events-none mono text-[10px] flex flex-col gap-1 tracking-widest p-3 rounded-lg border backdrop-blur-md shadow-lg ${
        isLight
          ? "bg-white/95 border-slate-200 text-slate-700 shadow-slate-200/50"
          : "bg-panel/85 border-line text-muted"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isExtensionLinked ? "bg-mint animate-pulse" : "bg-amber"}`} />
          <span className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>
            {isExtensionLinked ? "MV3 EXTENSION LINKED" : "A.E.G.I.S. FORENSIC SPHERE"}
          </span>
          <span className={`text-[8px] px-1.5 py-0.2 rounded uppercase border font-bold ${
            isExtensionLinked
              ? isLight ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-mint/15 text-mint border-mint/40"
              : isLight ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-amber/15 text-amber border-amber/40"
          }`}>
            {isExtensionLinked ? "LIVE BRIDGE" : "STANDALONE"}
          </span>
        </div>
        <div className={isLight ? "text-slate-500 text-[9px]" : "text-muted text-[9px]"}>
          {isExtensionLinked ? "REAL-TIME MAILBOX TELEMETRY STREAM" : "RELAY TOPOLOGY · REAL-TIME INTERCEPT"}
        </div>
        <div className={isLight ? "text-slate-500 text-[9px]" : "text-muted text-[9px]"}>
          PROJECTION: GEODESIC ORBITAL
        </div>
      </div>

      {/* Cyberpunk HUD Frame overlays - Bottom Right */}
      <div className={`absolute bottom-4 right-4 pointer-events-none mono text-[10px] flex flex-col items-end gap-1 tracking-widest p-3 rounded-lg border backdrop-blur-md shadow-lg ${
        isLight
          ? "bg-white/95 border-slate-200 text-slate-700 shadow-slate-200/50"
          : "bg-panel/85 border-line text-muted"
      }`}>
        <div className={`text-[11px] font-semibold flex items-center gap-1.5 ${isLight ? "text-emerald-700" : "text-mint"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-emerald-600" : "bg-mint"}`} />
          <span>{isExtensionLinked ? "EXTENSION TELEMETRY: SYNCED" : "8 NODES SYNCHRONIZED"}</span>
        </div>
        <div>INSPECTION LATENCY: &lt; 0.8ms</div>
        <div className={`text-[9px] ${isLight ? "text-slate-500" : "text-muted"}`}>
          {isExtensionLinked ? "DATA RETENTION: 0 BYTES (LOCAL)" : "ROTATION: ACTIVE"}
        </div>
      </div>

      {/* Hover Node Tooltip */}
      {activeNode && (
        <div
          className={`absolute pointer-events-none mono text-[11px] px-3.5 py-2.5 rounded-md shadow-2xl backdrop-blur-md transition-all duration-150 z-20 border ${
            isLight
              ? "bg-white/95 border-slate-300 text-slate-800"
              : "bg-panel2 border-mint/50 text-white"
          }`}
          style={{
            left: `${Math.min(activeNode.px + 12, 280)}px`,
            top: `${Math.max(activeNode.py - 30, 20)}px`
          }}
        >
          <div className={`font-semibold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNode.color }} />
            {activeNode.label}
          </div>
          <div className={`text-[10px] mt-1 ${isLight ? "text-slate-500" : "text-muted"}`}>
            STATUS: <span style={{ color: activeNode.color }} className="font-bold">{activeNode.risk}</span>
          </div>
          <div className={`text-[9px] ${isLight ? "text-slate-400" : "text-muted"}`}>
            LAT: {activeNode.lat.toFixed(2)}° | LON: {activeNode.lon.toFixed(2)}°
          </div>
        </div>
      )}
    </div>
  );
}
