"use client";

import React, { useEffect, useRef, useState } from "react";

interface Waypoint {
  xPct: number; // percentage of window width (0 to 1)
  yDoc: number; // absolute Y coordinate in document (pixels)
  width: number; // thickness in pixels
  poolRadius?: number; // accumulation pool radius
}

interface PathPoint {
  x: number;
  y: number;
  width: number;
  cremaPct?: number;
  poolRadius?: number;
  tangentX: number;
  tangentY: number;
  distance: number;
}

export function CoffeeLiquidStream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("CoffeeLiquidStream: canvas ref not found");
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      console.warn("CoffeeLiquidStream: 2d context not available");
      return;
    }

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

    // Compute waypoints dynamically matching actual section heights
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
        height * 7
      );

      const topoTop = getTop("topo", 0);
      const jornadaTop = getTop("jornada", height * 1.0);
      const essenciaTop = getTop("essencia", height * 2.5);
      const destaquesTop = getTop("destaques", height * 3.8);
      const gastrobarTop = getTop("gastrobar", height * 5.0);
      const galeriaTop = getTop("galeria", height * 6.2);
      const contatoTop = getTop("contato", docHeight - height * 0.95);

      const isMobile = width < 768;

      // Primary continuous espresso river (prominent, thick, connecting all sections)
      const main: Waypoint[] = [
        // 1. Hero: Starts directly under the coffee cup (col-span-6 right side)
        {
          xPct: isMobile ? 0.65 : 0.68,
          yDoc: topoTop + height * 0.42,
          width: isMobile ? 36 : 56,
        },
        // 2. Hero to Jornada transition: Plunges downwards and pools before crossing
        {
          xPct: isMobile ? 0.78 : 0.75,
          yDoc: topoTop + height * 0.88,
          width: isMobile ? 44 : 72,
          poolRadius: isMobile ? 36 : 64,
        },
        // 3. Enter Jornada (Storytelling): Sweeps across the top of the scene
        {
          xPct: isMobile ? 0.86 : 0.82,
          yDoc: jornadaTop + height * 0.35,
          width: isMobile ? 38 : 60,
        },
        // 4. Mid Jornada: Curves inward across the scene transition
        {
          xPct: isMobile ? 0.74 : 0.62,
          yDoc: jornadaTop + height * 0.85,
          width: isMobile ? 42 : 68,
          poolRadius: isMobile ? 34 : 58,
        },
        // 5. Transition to Nossa Essência: Sweeps across the section bridge
        {
          xPct: isMobile ? 0.42 : 0.28,
          yDoc: essenciaTop + height * 0.16,
          width: isMobile ? 40 : 64,
        },
        // 6. Nossa Essência: Cascades down the left editorial gutter alongside photos
        {
          xPct: isMobile ? 0.14 : 0.15,
          yDoc: essenciaTop + height * 0.54,
          width: isMobile ? 42 : 70,
        },
        // 7. Essência bottom: Organic accumulation pool before crossing to highlights
        {
          xPct: isMobile ? 0.28 : 0.32,
          yDoc: essenciaTop + height * 0.92,
          width: isMobile ? 46 : 76,
          poolRadius: isMobile ? 40 : 70,
        },
        // 8. Enter Destaques (Queridinhos): Cascades across toward right margin
        {
          xPct: isMobile ? 0.76 : 0.82,
          yDoc: destaquesTop + height * 0.22,
          width: isMobile ? 38 : 62,
        },
        // 9. Destaques: Flows down right perimeter of product cards
        {
          xPct: isMobile ? 0.88 : 0.86,
          yDoc: destaquesTop + height * 0.68,
          width: isMobile ? 42 : 68,
        },
        // 10. Transition to Gastrobar: Bold curve inward as scene turns to night
        {
          xPct: isMobile ? 0.48 : 0.36,
          yDoc: gastrobarTop + height * 0.15,
          width: isMobile ? 46 : 78,
          poolRadius: isMobile ? 42 : 74,
        },
        // 11. Gastrobar: Deep espresso amber glow through the nightlife section
        {
          xPct: isMobile ? 0.14 : 0.16,
          yDoc: gastrobarTop + height * 0.65,
          width: isMobile ? 40 : 64,
        },
        // 12. Enter Galeria: Sweeps across the section divider toward right frame
        {
          xPct: isMobile ? 0.72 : 0.80,
          yDoc: galeriaTop + height * 0.28,
          width: isMobile ? 38 : 62,
        },
        // 13. Galeria: Meanders down photo gallery
        {
          xPct: isMobile ? 0.85 : 0.86,
          yDoc: galeriaTop + height * 0.75,
          width: isMobile ? 42 : 70,
        },
        // 14. Contato / Rodapé: Culminates into a rich, velvety espresso crema swirl
        {
          xPct: 0.5,
          yDoc: contatoTop + height * 0.65,
          width: isMobile ? 54 : 96,
          poolRadius: isMobile ? 54 : 96,
        },
      ];

      // Secondary Viscous Tributary: Branches at Nossa Essência, trickles along edge, then merges back
      const tributary: Waypoint[] = [
        {
          xPct: isMobile ? 0.14 : 0.15,
          yDoc: essenciaTop + height * 0.54,
          width: isMobile ? 20 : 32,
        },
        {
          xPct: isMobile ? 0.06 : 0.07,
          yDoc: essenciaTop + height * 0.7,
          width: isMobile ? 16 : 26,
        },
        {
          xPct: isMobile ? 0.2 : 0.22,
          yDoc: essenciaTop + height * 0.86,
          width: isMobile ? 22 : 36,
        },
        {
          xPct: isMobile ? 0.28 : 0.32,
          yDoc: essenciaTop + height * 0.92,
          width: isMobile ? 26 : 44,
        },
      ];

      return { main, tributary };
    };

    // Interpolate waypoints into dense, ultra-smooth Catmull-Rom path
    const generateDensePath = (waypoints: Waypoint[]): PathPoint[] => {
      const dense: PathPoint[] = [];
      const stepsPerSegment = 38;

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
          const poolVal =
            p1.poolRadius && p2.poolRadius
              ? p1.poolRadius + (p2.poolRadius - p1.poolRadius) * t
              : p1.poolRadius || undefined;

          dense.push({
            x: xPct * width,
            y: yDoc,
            width: widthVal,
            cremaPct: 0.8,
            poolRadius: poolVal,
            tangentX: 0,
            tangentY: 1,
            distance: 0,
          });
        }
      }

      // Compute tangents and cumulative distances
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

    // Scroll tracking with smooth spring physics
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let scrollVelocity = 0;
    let time = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Satellite droplets
    const satelliteDroplets = Array.from({ length: 22 }, (_, i) => ({
      t: (i / 22) * 0.95,
      side: i % 2 === 0 ? 1 : -1,
      distanceOffset: 20 + (i % 4) * 12,
      radius: 3.5 + (i % 3) * 2.4,
      speed: 0.0004 + (i % 5) * 0.0002,
      wobblePhase: i * 1.35,
    }));

    // Draw single stream path with multi-pass photorealistic 3D liquid rendering
    const drawStreamPath = (
      points: PathPoint[],
      maxHeadY: number,
      viewportTop: number,
      isTributary = false
    ) => {
      let headIndex = 0;
      for (let i = 0; i < points.length; i++) {
        if (points[i].y <= maxHeadY) {
          headIndex = i;
        } else {
          break;
        }
      }

      // Ensure that at least the initial segment is always visible from top
      headIndex = Math.max(isTributary ? 0 : 8, headIndex);
      if (headIndex < 2) return;

      const bufferMargin = 160;
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

        // Viscous harmonic surface ripple
        const ripple =
          Math.sin(time * 2.8 + i * 0.24) * 4.2 +
          Math.cos(time * 1.9 + i * 0.42) * 2.8;

        const headTaper =
          i > active.length - 12
            ? Math.sin(((active.length - 1 - i) / 12) * (Math.PI / 2))
            : 1;

        const currentWidth = (p.width + ripple) * Math.max(0.3, headTaper);

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

      // PASS 1: AMBIENT 3D DROP SHADOW
      ctx.save();
      ctx.shadowColor = "rgba(10, 6, 4, 0.55)";
      ctx.shadowBlur = isTributary ? 14 : 26;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 10;

      ctx.beginPath();
      ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
      for (let i = 1; i < leftBoundary.length; i++) {
        ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
      }
      for (let i = rightBoundary.length - 1; i >= 0; i--) {
        ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(14, 8, 5, 0.6)";
      ctx.fill();
      ctx.restore();

      // PASS 2: DEEP ESPRESSO ROAST CORE (RICH BODY)
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
        midPt.x - 50,
        midPt.y - viewportTop - 50,
        midPt.x + 50,
        midPt.y - viewportTop + 50
      );
      bodyGrad.addColorStop(0, "#100805"); // Deep roasted dark core
      bodyGrad.addColorStop(0.3, "#22130C"); // Espresso dark roast
      bodyGrad.addColorStop(0.68, "#381E13"); // Amber undertone
      bodyGrad.addColorStop(1, "#100805");

      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // PASS 3: GOLDEN CREMA BOUNDARY LAYER (#CFB583 / #E77759)
      ctx.save();
      // Outer Gold Crema Rim
      ctx.beginPath();
      ctx.moveTo(leftBoundary[0].x, leftBoundary[0].y);
      for (let i = 1; i < leftBoundary.length; i++) {
        ctx.lineTo(leftBoundary[i].x, leftBoundary[i].y);
      }
      ctx.strokeStyle = "rgba(207, 181, 131, 0.95)"; // Martita Gold
      ctx.lineWidth = isTributary ? 2.5 : 4.5;
      ctx.stroke();

      // Inner Coral / Caramel Rim
      ctx.beginPath();
      ctx.moveTo(rightBoundary[0].x, rightBoundary[0].y);
      for (let i = 1; i < rightBoundary.length; i++) {
        ctx.lineTo(rightBoundary[i].x, rightBoundary[i].y);
      }
      ctx.strokeStyle = "rgba(231, 119, 89, 0.75)"; // Martita Coral
      ctx.lineWidth = isTributary ? 2.0 : 3.5;
      ctx.stroke();
      ctx.restore();

      // PASS 4: SPECULAR WET RIDGE HIGHLIGHT (GLISTENING SURFACE)
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < active.length; i++) {
        const p = active[i];
        const screenY = p.y - viewportTop;
        const nx = -p.tangentY;
        const ny = p.tangentX;
        const hx = p.x + nx * (p.width * 0.28);
        const hy = screenY + ny * (p.width * 0.28);

        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.strokeStyle = "rgba(255, 252, 245, 0.85)";
      ctx.lineWidth = isTributary ? 2.2 : 3.8;
      ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // PASS 5: ADVANCING DROPLET BULB (LEADING MENISCUS)
      const headPoint = active[active.length - 1];
      const headScreenY = headPoint.y - viewportTop;
      const stretch = Math.min(32, Math.abs(scrollVelocity) * 2.2);
      const headRadius = (headPoint.width * 0.6 + 5) * (1 + stretch * 0.04);

      ctx.save();
      ctx.translate(headPoint.x, headScreenY);
      const angle = Math.atan2(headPoint.tangentY, headPoint.tangentX);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.arc(0, 0, headRadius, -Math.PI / 2, Math.PI / 2);
      ctx.bezierCurveTo(
        headRadius * 0.6,
        headRadius * 0.95,
        headRadius + stretch,
        headRadius * 0.35,
        headRadius + stretch,
        0
      );
      ctx.bezierCurveTo(
        headRadius + stretch,
        -headRadius * 0.35,
        headRadius * 0.6,
        -headRadius * 0.95,
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
      headGrad.addColorStop(0, "#4E2818");
      headGrad.addColorStop(0.42, "#26140B");
      headGrad.addColorStop(0.82, "#120905");
      headGrad.addColorStop(1, "rgba(207, 181, 131, 0.98)");

      ctx.fillStyle = headGrad;
      ctx.shadowColor = "rgba(10, 6, 4, 0.65)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fill();

      // Specular shine on bulb
      ctx.beginPath();
      ctx.arc(
        stretch * 0.25,
        -headRadius * 0.38,
        headRadius * 0.36,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.shadowColor = "rgba(255, 255, 255, 1)";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    // Main 60fps render loop
    const render = () => {
      time += 0.026;
      targetScrollY = window.scrollY;

      const diff = targetScrollY - smoothScrollY;
      scrollVelocity = diff * 0.08;
      smoothScrollY += scrollVelocity;

      const viewportTop = smoothScrollY;
      const viewportBottom = smoothScrollY + height;

      // Flow head leads the viewport so as user scrolls, coffee actively pours ahead
      const flowHeadY = viewportBottom + height * 0.25;

      ctx.clearRect(0, 0, width, height);

      // 1. Primary Espresso River
      drawStreamPath(mainDense, flowHeadY, viewportTop, false);

      // 2. Secondary Viscous Tributary (Nossa Essência)
      drawStreamPath(tribDense, flowHeadY, viewportTop, true);

      // 3. Pooling Eddies at key transition zones
      for (let i = 0; i < mainWps.length; i++) {
        const wp = mainWps[i];
        if (wp.poolRadius && wp.yDoc <= flowHeadY) {
          const screenY = wp.yDoc - viewportTop;
          if (screenY >= -wp.poolRadius && screenY <= height + wp.poolRadius) {
            const poolX = wp.xPct * width;
            const r = wp.poolRadius + Math.sin(time * 2.2 + i) * 4;

            ctx.save();
            ctx.beginPath();
            ctx.arc(poolX, screenY, r, 0, Math.PI * 2);
            const poolGrad = ctx.createRadialGradient(poolX, screenY, 1, poolX, screenY, r);
            poolGrad.addColorStop(0, "rgba(18, 10, 6, 0.98)");
            poolGrad.addColorStop(0.55, "rgba(38, 22, 14, 0.92)");
            poolGrad.addColorStop(0.85, "rgba(207, 181, 131, 0.75)");
            poolGrad.addColorStop(1, "rgba(207, 181, 131, 0)");
            ctx.fillStyle = poolGrad;
            ctx.shadowColor = "rgba(12, 7, 4, 0.55)";
            ctx.shadowBlur = 20;
            ctx.fill();

            // Concentric crema ripple
            ctx.beginPath();
            ctx.arc(poolX, screenY, r * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(207, 181, 131, 0.65)";
            ctx.lineWidth = 2.2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(poolX, screenY, r * 0.38, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(231, 119, 89, 0.45)";
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 4. Secondary Satellite Droplets
      for (let i = 0; i < satelliteDroplets.length; i++) {
        const d = satelliteDroplets[i];
        d.t = (d.t + d.speed) % 1;

        let maxIdx = 0;
        for (let j = 0; j < mainDense.length; j++) {
          if (mainDense[j].y <= flowHeadY) maxIdx = j;
          else break;
        }

        const pathIdx = Math.floor(d.t * maxIdx);
        if (pathIdx >= 0 && pathIdx < mainDense.length) {
          const pt = mainDense[pathIdx];
          const screenY = pt.y - viewportTop;

          if (screenY >= -30 && screenY <= height + 30) {
            const nx = -pt.tangentY;
            const ny = pt.tangentX;
            const wobble = Math.sin(time * 3 + d.wobblePhase) * 4;

            const dropX = pt.x + nx * (d.side * (pt.width / 2 + d.distanceOffset + wobble));
            const dropY = screenY + ny * (d.side * (pt.width / 2 + d.distanceOffset + wobble));

            ctx.save();
            ctx.beginPath();
            ctx.arc(dropX, dropY, d.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#1A0E08";
            ctx.shadowColor = "rgba(12, 7, 4, 0.45)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;
            ctx.fill();

            ctx.strokeStyle = "rgba(207, 181, 131, 0.9)";
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Specular spark on droplet
            ctx.beginPath();
            ctx.arc(
              dropX - d.radius * 0.32,
              dropY - d.radius * 0.32,
              d.radius * 0.38,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 5. Culminating Latte Art Swirl at Footer
      const lastPoint = mainDense[mainDense.length - 1];
      if (lastPoint && lastPoint.y <= flowHeadY + 60) {
        const screenY = lastPoint.y - viewportTop;
        if (screenY >= -120 && screenY <= height + 120) {
          const swirlRadius = 75;
          ctx.save();
          ctx.translate(lastPoint.x, screenY);
          ctx.rotate(time * 0.35);

          for (let petal = 0; petal < 6; petal++) {
            ctx.rotate((Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.ellipse(
              swirlRadius * 0.44,
              0,
              swirlRadius * 0.4,
              swirlRadius * 0.22,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(207, 181, 131, 0.45)";
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 45,
        width: "100vw",
        height: "100vh",
      }}
      aria-hidden="true"
    />
  );
}
