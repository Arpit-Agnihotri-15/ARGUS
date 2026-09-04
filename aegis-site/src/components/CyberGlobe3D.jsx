import { useEffect, useRef, useState } from "react";

export function CyberGlobe3D({ className = "" }) {
  const canvasRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });

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
    const radius = Math.min(width, height) * 0.38;
    let rotX = 0.25;
    let rotY = 0;

    // Synthetic threat nodes on the sphere (lat, lon, label, risk)
    const nodes = [
      { lat: 28.6139, lon: 77.209, label: "AICTE Node [IN]", risk: "SAFE", color: "#8ff7bd" },
      { lat: 37.7749, lon: -122.4194, label: "Google MTA [US]", risk: "VERIFIED", color: "#8ff7bd" },
      { lat: 51.5074, lon: -0.1278, label: "Relay Hop [UK]", risk: "NEUTRAL", color: "#8ff7bd" },
      { lat: 55.7558, lon: 37.6173, label: "Anon Proxy [RU]", risk: "QUARANTINE", color: "#f28b82" },
      { lat: 1.3521, lon: 103.8198, label: "Cloudflare DoH [SG]", risk: "SAFE", color: "#8ff7bd" },
      { lat: 35.6762, lon: 139.6503, label: "FastFlux Host [JP]", risk: "SUSPICIOUS", color: "#f2c464" },
      { lat: -33.8688, lon: 151.2093, label: "Edge Node [AU]", risk: "SAFE", color: "#8ff7bd" },
      { lat: 52.52, lon: 13.405, label: "Hosting ASN [DE]", risk: "WARNING", color: "#f2c464" }
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
      { from: 3, to: 0, progress: 0, speed: 0.007, color: "#f28b82" },
      { from: 5, to: 1, progress: 0.4, speed: 0.009, color: "#f2c464" },
      { from: 1, to: 0, progress: 0.7, speed: 0.006, color: "#8ff7bd" },
      { from: 4, to: 0, progress: 0.2, speed: 0.008, color: "#8ff7bd" }
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

      rotY += 0.006;
      const currentRotX = rotX + mouseRef.current.y * 0.5;
      const currentRotY = rotY + mouseRef.current.x * 0.8;

      // 3D Rotation helper
      const project = (x, y, z) => {
        // Rotate Y
        let x1 = x * Math.cos(currentRotY) + z * Math.sin(currentRotY);
        let z1 = -x * Math.sin(currentRotY) + z * Math.cos(currentRotY);
        // Rotate X
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

      // Draw background ambient cyber glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
      glow.addColorStop(0, "rgba(143, 247, 189, 0.08)");
      glow.addColorStop(0.5, "rgba(15, 35, 28, 0.25)");
      glow.addColorStop(1, "rgba(5, 11, 9, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Outer targeting reticle ring
      ctx.strokeStyle = "rgba(143, 247, 189, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, tick * 0.002, tick * 0.002 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw latitude wireframe rings
      rings.forEach(ring => {
        ctx.beginPath();
        let first = true;
        ring.forEach(pt => {
          const pr = project(pt.x, pt.y, pt.z);
          const alpha = pr.z > 0 ? (1 - pr.z / radius) * 0.35 : 0.08;
          ctx.strokeStyle = `rgba(143, 247, 189, ${Math.max(0.04, alpha)})`;
          if (first) {
            ctx.moveTo(pr.px, pr.py);
            first = false;
          } else {
            ctx.lineTo(pr.px, pr.py);
          }
        });
        ctx.closePath();
        ctx.stroke();
      });

      // Draw longitudinal meridians
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
          const alpha = pr.z > 0 ? (1 - pr.z / radius) * 0.3 : 0.06;
          ctx.strokeStyle = `rgba(143, 247, 189, ${Math.max(0.03, alpha)})`;
          if (first) {
            ctx.moveTo(pr.px, pr.py);
            first = false;
          } else {
            ctx.lineTo(pr.px, pr.py);
          }
        }
        ctx.stroke();
      }

      // Draw packet paths (arcs)
      arcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        const p1 = nodePositions[arc.from];
        const p2 = nodePositions[arc.to];

        const midElev = 1.35;
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
        if (pr.z < radius * 0.8) {
          ctx.fillStyle = arc.color;
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, 3.5 * pr.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw threat telemetry nodes
      let hovered = null;
      nodePositions.forEach(node => {
        const pr = project(node.x, node.y, node.z);
        if (pr.z < radius * 0.9) {
          const depthAlpha = Math.max(0.2, (radius - pr.z) / (radius * 2));
          const nodeRadius = 5 * pr.scale;

          const pulse = (Math.sin(tick * 0.08 + node.lat) + 1) * 0.5;
          ctx.strokeStyle = node.color;
          ctx.globalAlpha = depthAlpha * (1 - pulse);
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, nodeRadius + pulse * 7, 0, Math.PI * 2);
          ctx.stroke();

          ctx.globalAlpha = depthAlpha;
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pr.px, pr.py, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
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
  }, []);

  return (
    <div className={`relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyberpunk HUD Frame overlays */}
      <div className="absolute top-4 left-4 pointer-events-none mono text-[10px] text-mint/80 flex flex-col gap-1 tracking-widest bg-panel/60 p-2.5 rounded border border-line backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span>A.E.G.I.S. FORENSIC SPHERE</span>
        </div>
        <div className="text-muted text-[9px]">RELAY TOPOLOGY · REAL-TIME INTERCEPT</div>
        <div className="text-muted text-[9px]">PROJECTION: GEODESIC ORBITAL</div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none mono text-[10px] text-muted flex flex-col items-end gap-1 tracking-widest bg-panel/60 p-2.5 rounded border border-line backdrop-blur-sm">
        <div className="text-mint text-[11px]">8 NODES SYNCHRONIZED</div>
        <div>SCAN LATENCY: &lt; 0.8ms</div>
        <div className="text-[9px] text-mintdim">ROTATION: ACTIVE</div>
      </div>

      {/* Hover Node Tooltip */}
      {activeNode && (
        <div
          className="absolute pointer-events-none mono text-[11px] bg-panel2 border border-mint/50 px-3 py-2 rounded-md shadow-2xl backdrop-blur-md transition-all duration-150 z-20"
          style={{
            left: `${Math.min(activeNode.px + 12, 280)}px`,
            top: `${Math.max(activeNode.py - 30, 20)}px`
          }}
        >
          <div className="font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeNode.color }} />
            {activeNode.label}
          </div>
          <div className="text-[10px] text-muted mt-1">STATUS: <span style={{ color: activeNode.color }}>{activeNode.risk}</span></div>
          <div className="text-[9px] text-muted/80">LAT: {activeNode.lat.toFixed(2)}° | LON: {activeNode.lon.toFixed(2)}°</div>
        </div>
      )}
    </div>
  );
}
