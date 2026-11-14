"use client";

import React, { useEffect, useRef } from "react";

interface SectionDef {
  id: string;
  stageId?: string;
  subPoints: number[];
}

interface PathPoint {
  x: number;
  y: number;
  width: number;
  tangentX: number;
  tangentY: number;
}

const SECTION_DEFS: SectionDef[] = [
  { id: "topo", stageId: "topo", subPoints: [0.0, 0.25, 0.55, 0.85] },
  { id: "jornada", stageId: "jornada-stage", subPoints: [0.05, 0.35, 0.65, 0.92] },
  { id: "essencia", stageId: "essencia", subPoints: [0.08, 0.38, 0.68, 0.94] },
  { id: "destaques", stageId: "destaques", subPoints: [0.08, 0.38, 0.68, 0.94] },
  { id: "gastrobar", stageId: "gastrobar", subPoints: [0.08, 0.38, 0.68, 0.94] },
  { id: "galeria", stageId: "galeria", subPoints: [0.08, 0.38, 0.68, 0.94] },
  { id: "contato", stageId: "contato", subPoints: [0.08, 0.35, 0.65, 0.95] },
];

export function CoffeeLiquidStream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    // Satellite micro-droplets anchored to sections
    interface Droplet {
      sectionIdx: number;
      localRatio: number;
      speed: number;
      side: number;
      radius: number;
      offset: number;
    }

    const droplets: Droplet[] = Array.from({ length: 14 }, (_, i) => ({
      sectionIdx: i % SECTION_DEFS.length,
      localRatio: (i * 0.17) % 1,
      speed: 0.0006 + (i % 4) * 0.0003,
      side: i % 2 === 0 ? 1 : -1,
      radius: 1.4 + (i % 3) * 0.6,
      offset: 5 + (i % 3) * 3,
    }));

    // Main 60fps render loop
    const render = () => {
      time += 0.022;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      // Fixed to outer margin: desktop ~24px from right, mobile ~12px from right
      const baseMarginRight = isMobile ? 12 : 24;
      const baseWidth = isMobile ? 7.5 : 13.5;

      // 1. Collect live on-screen waypoints directly from DOM section positions
      interface RawWaypoint {
        x: number;
        y: number;
        width: number;
        isEnd?: boolean;
      }

      const rawWaypoints: RawWaypoint[] = [];

      for (let sIdx = 0; sIdx < SECTION_DEFS.length; sIdx++) {
        const def = SECTION_DEFS[sIdx];
        let el = def.stageId ? document.getElementById(def.stageId) : null;
        if (!el || el.offsetHeight === 0) {
          el = document.getElementById(def.id);
        }

        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const secHeight = rect.height || height;

        for (let pIdx = 0; pIdx < def.subPoints.length; pIdx++) {
          const ratio = def.subPoints[pIdx];
          const screenY = rect.top + ratio * secHeight;

          // Organic subtle fluid wave along the right margin
          const wave =
            Math.sin(time * 1.4 + sIdx * 1.5 + pIdx * 0.9) * (isMobile ? 1.8 : 3.2) +
            Math.cos(time * 0.9 + sIdx * 2.1) * (isMobile ? 1.0 : 1.8);

          const x = width - baseMarginRight + wave;

          // Gentle natural thickness variations
          const widthVariation =
            Math.sin(time * 1.8 + sIdx * 2.0 + pIdx) * (isMobile ? 1.0 : 1.8);
          const currentWidth = Math.max(
            isMobile ? 5 : 9,
            baseWidth + widthVariation
          );

          const isLastPoint =
            sIdx === SECTION_DEFS.length - 1 &&
            pIdx === def.subPoints.length - 1;

          rawWaypoints.push({
            x,
            y: screenY,
            width: currentWidth,
            isEnd: isLastPoint,
          });
        }
      }

      if (rawWaypoints.length < 2) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Filter waypoints around the visible viewport (+ buffer margin)
      const buffer = 140;
      let minIdx = 0;
      let maxIdx = rawWaypoints.length - 1;

      for (let i = 0; i < rawWaypoints.length; i++) {
        if (rawWaypoints[i].y >= -buffer) {
          minIdx = Math.max(0, i - 1);
          break;
        }
      }

      for (let i = rawWaypoints.length - 1; i >= 0; i--) {
        if (rawWaypoints[i].y <= height + buffer) {
          maxIdx = Math.min(rawWaypoints.length - 1, i + 1);
          break;
        }
      }

      const visibleWps = rawWaypoints.slice(minIdx, maxIdx + 1);

      if (visibleWps.length >= 2) {
        // 3. Interpolate waypoints into dense, ultra-smooth Catmull-Rom spline
        const dense: PathPoint[] = [];
        const stepsPerSegment = 24;

        for (let i = 0; i < visibleWps.length - 1; i++) {
          const p0 = visibleWps[Math.max(0, i - 1)];
          const p1 = visibleWps[i];
          const p2 = visibleWps[i + 1];
          const p3 = visibleWps[Math.min(visibleWps.length - 1, i + 2)];

          for (let t = 0; t < 1; t += 1 / stepsPerSegment) {
            const t2 = t * t;
            const t3 = t2 * t;

            const px =
              0.5 *
              (2 * p1.x +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

            const py =
              0.5 *
              (2 * p1.y +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

            const pw = p1.width + (p2.width - p1.width) * t;

            dense.push({
              x: px,
              y: py,
              width: pw,
              tangentX: 0,
              tangentY: 1,
            });
          }
        }

        // Add final point
        const lastWp = visibleWps[visibleWps.length - 1];
        dense.push({
          x: lastWp.x,
          y: lastWp.y,
          width: lastWp.width,
          tangentX: 0,
          tangentY: 1,
        });

        // Compute normals and tangents
        for (let i = 0; i < dense.length; i++) {
          const next = dense[Math.min(dense.length - 1, i + 1)];
          const prev = dense[Math.max(0, i - 1)];
          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.hypot(dx, dy) || 1;
          dense[i].tangentX = dx / len;
          dense[i].tangentY = dy / len;
        }

        // 4. Build boundaries with micro-viscous surface tension
        const leftBoundary: { x: number; y: number }[] = [];
        const rightBoundary: { x: number; y: number }[] = [];

        for (let i = 0; i < dense.length; i++) {
          const pt = dense[i];
          const nx = -pt.tangentY;
          const ny = pt.tangentX;

          // Very subtle harmonic micro-ripple (high viscosity espresso)
          const ripple = Math.sin(time * 2.4 + i * 0.35) * (isMobile ? 0.4 : 0.7);
          const halfW = Math.max(2, (pt.width + ripple) * 0.5);

          leftBoundary.push({
            x: pt.x + nx * halfW,
            y: pt.y + ny * halfW,
          });

          rightBoundary.push({
            x: pt.x - nx * halfW,
            y: pt.y - ny * halfW,
          });
        }

        // --- RENDER PASSES: PHOTOREALISTIC ESPRESSO LIQUID ---

        // PASS 1: SOFT AMBIENT CONTACT SHADOW
        ctx.save();
        ctx.shadowColor = "rgba(10, 6, 4, 0.32)";
        ctx.shadowBlur = isMobile ? 5 : 8;
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = 3;

        ctx.beginPath();
        ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
        for (let i = 1; i < leftBoundary.length; i++) {
          ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
        }
        for (let i = rightBoundary.length - 1; i >= 0; i--) {
          ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(14, 8, 5, 0.45)";
        ctx.fill();
        ctx.restore();

        // PASS 2: DEEP ROAST ESPRESSO CORE
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
        for (let i = 1; i < leftBoundary.length; i++) {
          ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
        }
        for (let i = rightBoundary.length - 1; i >= 0; i--) {
          ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
        }
        ctx.closePath();

        // Linear gradient across stream axis for realistic cylindrical liquid volume
        const midIdx = Math.floor(dense.length / 2);
        const midPt = dense[midIdx];
        const bodyGrad = ctx.createLinearGradient(
          midPt.x - 12,
          midPt.y,
          midPt.x + 12,
          midPt.y
        );
        bodyGrad.addColorStop(0, "#130905"); // Deep dark roasted outer rim
        bodyGrad.addColorStop(0.28, "#251209"); // Rich espresso core
        bodyGrad.addColorStop(0.68, "#3d1b0d"); // Warm amber translucent depth
        bodyGrad.addColorStop(1, "#150a06");

        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.restore();

        // PASS 3: DELICATE GOLDEN CREMA BOUNDARY (#CFB583 / #E77759)
        ctx.save();
        // Inner gold crema edge
        ctx.beginPath();
        ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
        for (let i = 1; i < leftBoundary.length; i++) {
          ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
        }
        ctx.strokeStyle = "rgba(207, 181, 131, 0.82)"; // Martita Gold
        ctx.lineWidth = isMobile ? 0.9 : 1.3;
        ctx.stroke();

        // Outer warm caramel edge
        ctx.beginPath();
        ctx.moveTo(rightBoundary[0].x, rightBoundary[0].y);
        for (let i = 1; i < rightBoundary.length; i++) {
          ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
        }
        ctx.strokeStyle = "rgba(231, 119, 89, 0.55)"; // Martita Coral
        ctx.lineWidth = isMobile ? 0.7 : 1.0;
        ctx.stroke();
        ctx.restore();

        // PASS 4: GLISTENING SPECULAR SURFACE HIGHLIGHT
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < dense.length; i++) {
          const pt = dense[i];
          const nx = -pt.tangentY;
          const ny = pt.tangentX;
          const hx = pt.x + nx * (pt.width * 0.22);
          const hy = pt.y + ny * (pt.width * 0.22);

          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.strokeStyle = "rgba(255, 252, 242, 0.75)";
        ctx.lineWidth = isMobile ? 0.7 : 1.0;
        ctx.shadowColor = "rgba(255, 248, 230, 0.65)";
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.restore();

        // PASS 5: FOOTER TERMINATION MENISCUS (TINY DELICATE CREMA BEAD)
        const endWp = rawWaypoints[rawWaypoints.length - 1];
        if (endWp && endWp.y >= -20 && endWp.y <= height + 40) {
          ctx.save();
          const bulbRadius = isMobile ? 6 : 9;
          ctx.beginPath();
          ctx.arc(endWp.x, endWp.y, bulbRadius, 0, Math.PI * 2);
          const bulbGrad = ctx.createRadialGradient(
            endWp.x - 2,
            endWp.y - 2,
            1,
            endWp.x,
            endWp.y,
            bulbRadius
          );
          bulbGrad.addColorStop(0, "#482112");
          bulbGrad.addColorStop(0.5, "#251209");
          bulbGrad.addColorStop(0.85, "#130905");
          bulbGrad.addColorStop(1, "rgba(207, 181, 131, 0.8)");
          ctx.fillStyle = bulbGrad;
          ctx.shadowColor = "rgba(10, 6, 4, 0.4)";
          ctx.shadowBlur = 6;
          ctx.fill();

          // Specular gleam on bulb
          ctx.beginPath();
          ctx.arc(endWp.x - 2, endWp.y - 2, bulbRadius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fill();
          ctx.restore();
        }
      }

      // 5. Section-anchored micro-droplets
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        d.localRatio = (d.localRatio + d.speed) % 1;

        const def = SECTION_DEFS[d.sectionIdx];
        let el = def.stageId ? document.getElementById(def.stageId) : null;
        if (!el || el.offsetHeight === 0) {
          el = document.getElementById(def.id);
        }

        if (el) {
          const rect = el.getBoundingClientRect();
          const secHeight = rect.height || height;
          const dropY = rect.top + d.localRatio * secHeight;

          if (dropY >= -20 && dropY <= height + 20) {
            const dropX =
              width -
              baseMarginRight +
              d.side * (baseWidth * 0.5 + d.offset);

            ctx.save();
            ctx.beginPath();
            ctx.arc(dropX, dropY, d.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#180D07";
            ctx.shadowColor = "rgba(10, 6, 4, 0.35)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 1.5;
            ctx.fill();

            // Tiny golden crema rim on droplet
            ctx.strokeStyle = "rgba(207, 181, 131, 0.85)";
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Specular pinprick
            ctx.beginPath();
            ctx.arc(
              dropX - d.radius * 0.3,
              dropY - d.radius * 0.3,
              d.radius * 0.32,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 35,
        width: "100vw",
        height: "100vh",
      }}
      aria-hidden="true"
    />
  );
}
