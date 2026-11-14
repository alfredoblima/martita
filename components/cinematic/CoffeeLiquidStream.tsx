"use client";

import React, { useEffect, useRef, useState } from "react";

interface Waypoint {
  xPct: number; // percentage of window width (0 to 1)
  yDoc: number; // absolute Y coordinate in document (pixels)
  width: number; // base thickness in pixels
  cremaPct: number; // crema ratio at this point (0 to 1)
  poolRadius?: number; // optional pooling radius (pixels)
}

interface PathPoint {
  x: number;
  y: number;
  width: number;
  cremaPct: number;
  poolRadius?: number;
  tangentX: number;
  tangentY: number;
  distance: number;
}

export function CoffeeLiquidStream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

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

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Build Waypoints dynamically mapped to real DOM section anchors
    const buildWaypoints = (): { main: Waypoint[]; tributary: Waypoint[] } => {
      const getTop = (id: string, fallback: number) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top + window.scrollY;
        }
        return fallback;
      };

      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        height * 6
      );

      const topoTop = getTop("topo", 0);
      const jornadaTop = getTop("jornada", height * 1.0);
      const essenciaTop = getTop("essencia", height * 2.2);
      const destaquesTop = getTop("destaques", height * 3.4);
      const gastrobarTop = getTop("gastrobar", height * 4.6);
      const galeriaTop = getTop("galeria", height * 5.8);
      const contatoTop = getTop("contato", docHeight - height * 0.9);

      const isMobile = width < 768;

      // Main Coffee River Path: An organic, winding S-curve corridor through negative space
      const main: Waypoint[] = [
        // 1. Hero: Emerges directly near the animated coffee cup
        {
          xPct: isMobile ? 0.76 : 0.72,
          yDoc: topoTop + height * 0.58,
          width: isMobile ? 18 : 28,
          cremaPct: 0.85,
        },
        // 2. Hero to Storytelling transition: Swells at table edge with gentle pool
        {
          xPct: isMobile ? 0.88 : 0.86,
          yDoc: topoTop + height * 0.92,
          width: isMobile ? 24 : 38,
          cremaPct: 0.75,
          poolRadius: isMobile ? 22 : 36,
        },
        // 3. Jornada (Storytelling): Hugs the right visual boundary
        {
          xPct: isMobile ? 0.92 : 0.89,
          yDoc: jornadaTop + height * 0.35,
          width: isMobile ? 20 : 32,
          cremaPct: 0.65,
        },
        // 4. Mid Jornada: Curves inward across the scene transition
        {
          xPct: isMobile ? 0.84 : 0.76,
          yDoc: jornadaTop + height * 0.82,
          width: isMobile ? 24 : 38,
          cremaPct: 0.6,
        },
        // 5. Flow across into Nossa Essência: Sweeps across the section bridge
        {
          xPct: isMobile ? 0.52 : 0.34,
          yDoc: essenciaTop + height * 0.16,
          width: isMobile ? 22 : 36,
          cremaPct: 0.7,
          poolRadius: isMobile ? 24 : 40,
        },
        // 6. Nossa Essência: Cascades down the left editorial gutter alongside photo mosaic
        {
          xPct: isMobile ? 0.12 : 0.15,
          yDoc: essenciaTop + height * 0.52,
          width: isMobile ? 24 : 40,
          cremaPct: 0.8,
        },
        // 7. Essência bottom: Organic accumulation pool before crossing to highlights
        {
          xPct: isMobile ? 0.24 : 0.28,
          yDoc: essenciaTop + height * 0.92,
          width: isMobile ? 26 : 44,
          cremaPct: 0.75,
          poolRadius: isMobile ? 26 : 46,
        },
        // 8. Enter Destaques (Queridinhos): Meanders into the right margin of the cards
        {
          xPct: isMobile ? 0.78 : 0.84,
          yDoc: destaquesTop + height * 0.22,
          width: isMobile ? 22 : 36,
          cremaPct: 0.7,
        },
        // 9. Destaques: Flows smoothly down the right perimeter
        {
          xPct: isMobile ? 0.88 : 0.87,
          yDoc: destaquesTop + height * 0.68,
          width: isMobile ? 24 : 38,
          cremaPct: 0.65,
        },
        // 10. Transition to Gastrobar: Curves boldly toward center-left as lighting turns into night
        {
          xPct: isMobile ? 0.48 : 0.38,
          yDoc: gastrobarTop + height * 0.14,
          width: isMobile ? 28 : 44,
          cremaPct: 0.85,
          poolRadius: isMobile ? 28 : 48,
        },
        // 11. Gastrobar: Glowing espresso cocktail hue down the evening experience
        {
          xPct: isMobile ? 0.14 : 0.16,
          yDoc: gastrobarTop + height * 0.64,
          width: isMobile ? 24 : 38,
          cremaPct: 0.7,
        },
        // 12. Enter Galeria: Sweeps across the section divider toward right frame
        {
          xPct: isMobile ? 0.74 : 0.82,
          yDoc: galeriaTop + height * 0.28,
          width: isMobile ? 22 : 36,
          cremaPct: 0.75,
        },
        // 13. Galeria: Meanders gracefully through the photography bento layout
        {
          xPct: isMobile ? 0.86 : 0.88,
          yDoc: galeriaTop + height * 0.76,
          width: isMobile ? 24 : 40,
          cremaPct: 0.7,
        },
        // 14. Contato / Rodapé: Culminates into a rich, velvety espresso crema swirl
        {
          xPct: isMobile ? 0.5 : 0.5,
          yDoc: contatoTop + height * 0.65,
          width: isMobile ? 32 : 54,
          cremaPct: 0.95,
          poolRadius: isMobile ? 36 : 60,
        },
      ];

      // Secondary Viscous Tributary: Branches off at Nossa Essência, trickles along edge, then merges back
      const tributary: Waypoint[] = [
        {
          xPct: isMobile ? 0.12 : 0.15,
          yDoc: essenciaTop + height * 0.52,
          width: isMobile ? 10 : 16,
          cremaPct: 0.6,
        },
        {
          xPct: isMobile ? 0.06 : 0.08,
          yDoc: essenciaTop + height * 0.68,
          width: isMobile ? 8 : 14,
          cremaPct: 0.55,
        },
        {
          xPct: isMobile ? 0.16 : 0.2,
          yDoc: essenciaTop + height * 0.84,
          width: isMobile ? 12 : 18,
          cremaPct: 0.65,
        },
        {
          xPct: isMobile ? 0.24 : 0.28,
          yDoc: essenciaTop + height * 0.92,
          width: isMobile ? 14 : 22,
          cremaPct: 0.7,
        },
      ];

      return { main, tributary };
    };

    // Interpolate points with Catmull-Rom spline
    const generateDensePath = (waypoints: Waypoint[]): PathPoint[] => {
      const dense: PathPoint[] = [];
      const stepsPerSegment = 36;

      for (let i = 0; i < waypoints.length - 1; i++) {
        const p0 = waypoints[Math.max(0, i - 1)];
        const p1 = waypoints[i];
        const p2 = waypoints[i + 1];
        const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];

        for (let t = 0; t < 1; t += 1 / stepsPerSegment) {
          const t2 = t * t;
          const t3 = t2 * t;

          const xPct =
            0.5 *
            (2 * p1.xPct +
              (-p0.xPct + p2.xPct) * t +
              (2 * p0.xPct - 5 * p1.xPct + 4 * p2.xPct - p3.xPct) * t2 +
              (-p0.xPct + 3 * p1.xPct - 3 * p2.xPct + p3.xPct) * t3);

          const yDoc =
            0.5 *
            (2 * p1.yDoc +
              (-p0.yDoc + p2.yDoc) * t +
              (2 * p0.yDoc - 5 * p1.yDoc + 4 * p2.yDoc - p3.yDoc) * t2 +
              (-p0.yDoc + 3 * p1.yDoc - 3 * p2.yDoc + p3.yDoc) * t3);

          const widthVal = p1.width + (p2.width - p1.width) * t;
          const cremaVal = p1.cremaPct + (p2.cremaPct - p1.cremaPct) * t;
          const poolVal =
            p1.poolRadius && p2.poolRadius
              ? p1.poolRadius + (p2.poolRadius - p1.poolRadius) * t
              : p1.poolRadius || undefined;

          dense.push({
            x: xPct * width,
            y: yDoc,
            width: widthVal,
            cremaPct: cremaVal,
            poolRadius: poolVal,
            tangentX: 0,
            tangentY: 1,
            distance: 0,
          });
        }
      }

      // Calculate unit tangents and cumulative arc length
      let totalDist = 0;
      for (let i = 0; i < dense.length; i++) {
        const next = dense[Math.min(dense.length - 1, i + 1)];
        const prev = dense[Math.max(0, i - 1)];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dense[i].tangentX = dx / len;
        dense[i].tangentY = dy / len;

        if (i > 0) {
          totalDist += Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y);
        }
        dense[i].distance = totalDist;
      }

      return dense;
    };

    let { main: mainWps, tributary: tribWps } = buildWaypoints();
    let mainDense = generateDensePath(mainWps);
    let tribDense = generateDensePath(tribWps);

    const recomputePaths = () => {
      const w = buildWaypoints();
      mainWps = w.main;
      tribWps = w.tributary;
      mainDense = generateDensePath(mainWps);
      tribDense = generateDensePath(tribWps);
    };

    window.addEventListener("resize", recomputePaths);

    // Dynamic scroll physics with spring damping
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let scrollVelocity = 0;
    let time = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Micro satellite droplets drifting alongside
    const satelliteDroplets = Array.from({ length: 18 }, (_, i) => ({
      t: (i / 18) * 0.94,
      side: i % 2 === 0 ? 1 : -1,
      distanceOffset: 14 + (i % 4) * 9,
      radius: 2.2 + (i % 3) * 1.7,
      speed: 0.0003 + (i % 5) * 0.00015,
      wobblePhase: i * 1.4,
    }));

    // Helper: Render an individual stream path with full 3D fluid shading
    const drawStreamPath = (
      points: PathPoint[],
      maxHeadY: number,
      viewportTop: number,
      isTributary = false
    ) => {
      // Find head index based on max allowed flow Y
      let headIndex = 0;
      for (let i = 0; i < points.length; i++) {
        if (points[i].y <= maxHeadY) {
          headIndex = i;
        } else {
          break;
        }
      }

      if (headIndex < 2) return;

      // Filter visible segment
      const bufferMargin = 120;
      let startIdx = 0;
      for (let i = 0; i < headIndex; i++) {
        if (points[i].y >= viewportTop - bufferMargin) {
          startIdx = Math.max(0, i - 2);
          break;
        }
      }

      const active = points.slice(startIdx, headIndex + 1);
      if (active.length < 2) return;

      const leftBoundary: { x: number; y: number }[] = [];
      const rightBoundary: { x: number; y: number }[] = [];

      for (let i = 0; i < active.length; i++) {
        const p = active[i];
        const screenY = p.y - viewportTop;

        // Viscous harmonic surface wave
        const ripple =
          Math.sin(time * 2.8 + i * 0.2) * 2.5 +
          Math.cos(time * 1.8 + i * 0.35) * 1.5;

        // Taper smoothly at the leading tip
        const headTaper =
          i > active.length - 10
            ? Math.sin(((active.length - 1 - i) / 10) * (Math.PI / 2))
            : 1;

        const currentWidth = (p.width + ripple) * Math.max(0.2, headTaper);

        const nx = -p.tangentY;
        const ny = p.tangentX;

        leftBoundary.push({
          x: p.x + nx * (currentWidth / 2),
          y: screenY + ny * (currentWidth / 2),
        });

        rightBoundary.push({
          x: p.x - nx * (currentWidth / 2),
          y: screenY - ny * (currentWidth / 2),
        });
      }

      // PASS 1: AMBIENT SHADOW
      ctx.save();
      ctx.shadowColor = "rgba(16, 11, 8, 0.28)";
      ctx.shadowBlur = isTributary ? 8 : 14;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 6;

      ctx.beginPath();
      ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
      for (let i = 1; i < leftBoundary.length; i++) {
        ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
      }
      for (let i = rightBoundary.length - 1; i >= 0; i--) {
        ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(18, 12, 9, 0.4)";
      ctx.fill();
      ctx.restore();

      // PASS 2: DEEP ESPRESSO BODY & SHADING
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

      const midPt = active[Math.floor(active.length / 2)];
      const bodyGrad = ctx.createLinearGradient(
        midPt.x - 30,
        midPt.y - viewportTop - 30,
        midPt.x + 30,
        midPt.y - viewportTop + 30
      );
      bodyGrad.addColorStop(0, "#19110D"); // Dark roast core
      bodyGrad.addColorStop(0.35, "#2C1D16"); // Espresso brown
      bodyGrad.addColorStop(0.7, "#3D251A"); // Amber translucency
      bodyGrad.addColorStop(1, "#19110D");

      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // PASS 3: GOLDEN CREMA RIM (#CFB583 / #E77759)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
      for (let i = 1; i < leftBoundary.length; i++) {
        ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
      }
      ctx.strokeStyle = "rgba(207, 181, 131, 0.72)";
      ctx.lineWidth = isTributary ? 1.5 : 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightBoundary[0].x, rightBoundary[0].y);
      for (let i = 1; i < rightBoundary.length; i++) {
        ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
      }
      ctx.strokeStyle = "rgba(231, 119, 89, 0.42)";
      ctx.lineWidth = isTributary ? 1.2 : 2.0;
      ctx.stroke();
      ctx.restore();

      // PASS 4: SPECULAR WET HIGHLIGHT
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < active.length; i++) {
        const p = active[i];
        const screenY = p.y - viewportTop;
        const nx = -p.tangentY;
        const ny = p.tangentX;
        const hx = p.x + nx * (p.width * 0.24);
        const hy = screenY + ny * (p.width * 0.24);

        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.strokeStyle = "rgba(255, 252, 245, 0.55)";
      ctx.lineWidth = isTributary ? 1.4 : 2.2;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      // PASS 5: ADVANCING TEARDROP MENISCUS HEAD
      if (headIndex === active[active.length - 1].distance ? points.length - 1 : headIndex) {
        const headPoint = active[active.length - 1];
        const headScreenY = headPoint.y - viewportTop;
        const stretch = Math.min(22, Math.abs(scrollVelocity) * 1.6);
        const headRadius = (headPoint.width * 0.55 + 3) * (1 + stretch * 0.04);

        ctx.save();
        ctx.translate(headPoint.x, headScreenY);
        const angle = Math.atan2(headPoint.tangentY, headPoint.tangentX);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.arc(0, 0, headRadius, -Math.PI / 2, Math.PI / 2);
        ctx.bezierCurveTo(
          headRadius * 0.6,
          headRadius * 0.9,
          headRadius + stretch,
          headRadius * 0.3,
          headRadius + stretch,
          0
        );
        ctx.bezierCurveTo(
          headRadius + stretch,
          -headRadius * 0.3,
          headRadius * 0.6,
          -headRadius * 0.9,
          0,
          -headRadius
        );
        ctx.closePath();

        const headGrad = ctx.createRadialGradient(
          stretch * 0.5,
          -headRadius * 0.3,
          1,
          0,
          0,
          headRadius + stretch
        );
        headGrad.addColorStop(0, "#4A2B1D");
        headGrad.addColorStop(0.45, "#2C1D16");
        headGrad.addColorStop(0.85, "#19110D");
        headGrad.addColorStop(1, "rgba(207, 181, 131, 0.85)");

        ctx.fillStyle = headGrad;
        ctx.shadowColor = "rgba(18, 12, 9, 0.4)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.fill();

        // Glistening highlight on the droplet head
        ctx.beginPath();
        ctx.arc(
          stretch * 0.2,
          -headRadius * 0.35,
          headRadius * 0.32,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    };

    // Main 60fps render loop
    const render = () => {
      time += 0.025;

      const diff = targetScrollY - smoothScrollY;
      scrollVelocity = diff * 0.08;
      smoothScrollY += scrollVelocity;

      const viewportTop = smoothScrollY;
      const viewportBottom = smoothScrollY + height;

      // The flow head leads the viewport smoothly by 25% of viewport height
      const flowHeadY = viewportBottom - height * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Primary Espresso River
      drawStreamPath(mainDense, flowHeadY, viewportTop, false);

      // 2. Draw Viscous Tributary (Nossa Essência side branch)
      drawStreamPath(tribDense, flowHeadY, viewportTop, true);

      // 3. Draw Pooling Eddies at key waypoint pools
      for (let i = 0; i < mainWps.length; i++) {
        const wp = mainWps[i];
        if (wp.poolRadius && wp.yDoc <= flowHeadY) {
          const screenY = wp.yDoc - viewportTop;
          if (screenY >= -wp.poolRadius && screenY <= height + wp.poolRadius) {
            const poolX = wp.xPct * width;
            const r = wp.poolRadius + Math.sin(time * 2 + i) * 3;

            ctx.save();
            ctx.beginPath();
            ctx.arc(poolX, screenY, r, 0, Math.PI * 2);
            const poolGrad = ctx.createRadialGradient(poolX, screenY, 1, poolX, screenY, r);
            poolGrad.addColorStop(0, "rgba(25, 17, 13, 0.95)");
            poolGrad.addColorStop(0.65, "rgba(44, 29, 22, 0.85)");
            poolGrad.addColorStop(0.9, "rgba(207, 181, 131, 0.45)");
            poolGrad.addColorStop(1, "rgba(207, 181, 131, 0)");
            ctx.fillStyle = poolGrad;
            ctx.shadowColor = "rgba(18, 12, 9, 0.3)";
            ctx.shadowBlur = 12;
            ctx.fill();

            // Concentric crema ripple
            ctx.beginPath();
            ctx.arc(poolX, screenY, r * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(207, 181, 131, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 4. Draw Satellite Droplets
      for (let i = 0; i < satelliteDroplets.length; i++) {
        const d = satelliteDroplets[i];
        d.t = (d.t + d.speed) % 1;

        // Determine max point based on current flow
        let maxIdx = 0;
        for (let j = 0; j < mainDense.length; j++) {
          if (mainDense[j].y <= flowHeadY) maxIdx = j;
          else break;
        }

        const pathIdx = Math.floor(d.t * maxIdx);
        if (pathIdx >= 0 && pathIdx < mainDense.length) {
          const pt = mainDense[pathIdx];
          const screenY = pt.y - viewportTop;

          if (screenY >= -20 && screenY <= height + 20) {
            const nx = -pt.tangentY;
            const ny = pt.tangentX;
            const wobble = Math.sin(time * 3 + d.wobblePhase) * 3;

            const dropX = pt.x + nx * (d.side * (pt.width / 2 + d.distanceOffset + wobble));
            const dropY = screenY + ny * (d.side * (pt.width / 2 + d.distanceOffset + wobble));

            ctx.save();
            ctx.beginPath();
            ctx.arc(dropX, dropY, d.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#241712";
            ctx.shadowColor = "rgba(20, 14, 10, 0.3)";
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 2;
            ctx.fill();

            // Tiny golden crema rim
            ctx.strokeStyle = "rgba(207, 181, 131, 0.65)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Specular reflection
            ctx.beginPath();
            ctx.arc(
              dropX - d.radius * 0.3,
              dropY - d.radius * 0.3,
              d.radius * 0.35,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 5. Culminating Latte Art Swirl at Footer (when scrolled near bottom)
      const lastPoint = mainDense[mainDense.length - 1];
      if (lastPoint && lastPoint.y <= flowHeadY + 50) {
        const screenY = lastPoint.y - viewportTop;
        if (screenY >= -80 && screenY <= height + 80) {
          const swirlRadius = 45;
          ctx.save();
          ctx.translate(lastPoint.x, screenY);
          ctx.rotate(time * 0.4);

          for (let petal = 0; petal < 6; petal++) {
            ctx.rotate((Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.ellipse(
              swirlRadius * 0.4,
              0,
              swirlRadius * 0.35,
              swirlRadius * 0.18,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(207, 181, 131, 0.35)";
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", recomputePaths);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{
        width: "100vw",
        height: "100vh",
      }}
      aria-hidden="true"
    />
  );
}
