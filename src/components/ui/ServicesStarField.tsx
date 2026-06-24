"use client";

import { useEffect, useRef } from "react";

// ─── Star specification ───────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  z: number;          // Depth plane: 0 (far) → 1 (near)
  size: number;       // Rendered pixel radius
  baseOpacity: number;
  speed: number;      // Base vertical drift speed
  parallax: number;   // Scroll parallax multiplier for this star
  colorR: number;     // White → slight cool tint variation
  colorG: number;
  colorB: number;
  shimmerPhase: number; // Random phase offset for opacity shimmer
  shimmerSpeed: number;
}

// ─── Layer thresholds (z 0→1: distant→near) ──────────────────────────────────
const TOTAL_STARS = 140;

// Distribution: 60% far, 28% mid, 12% near
const FAR_SHARE  = 0.60;
const MID_SHARE  = 0.28;
// NEAR = remainder (0.12)

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function ServicesStarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let stars: Star[] = [];
    let W = window.innerWidth;
    let H = window.innerHeight;
    const DPR = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× for perf

    // ── Scroll velocity state ──────────────────────────────────────────────────
    let lastScrollY = window.scrollY;
    let rawVelocity  = 0;   // px/frame (raw)
    let smoothVel    = 0;   // smoothed velocity (spring)

    // ── Resize handler ────────────────────────────────────────────────────────
    const applySize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    applySize();

    // ── Star factory ──────────────────────────────────────────────────────────
    const makeStar = (overrideY?: number): Star => {
      const r = Math.random();

      // Assign depth layer
      let z: number;
      if (r < FAR_SHARE) {
        z = Math.random() * 0.33;           // 0 – 0.33  (distant)
      } else if (r < FAR_SHARE + MID_SHARE) {
        z = 0.33 + Math.random() * 0.34;    // 0.33 – 0.67 (mid)
      } else {
        z = 0.67 + Math.random() * 0.33;    // 0.67 – 1.0 (near)
      }

      // Physical size: 0.5px (far) → 2.5px (near)
      const size = lerp(0.5, 2.5, z * z);  // quadratic so near stars pop more

      // Opacity: 0.15 (far) → 0.90 (near)
      const baseOpacity = lerp(0.15, 0.90, Math.pow(z, 0.7));

      // Drift speed: slow far, faster near
      const speed = lerp(0.08, 0.45, z);

      // Parallax factor for scroll reaction (near stars move MORE)
      const parallax = lerp(0.04, 1.0, z * z);

      // Subtle cool-white color variation
      // Far: pure white; near: very slight blue-white shimmer
      const blueShift = Math.random() * z * 0.12;
      const colorR = 1.0;
      const colorG = 1.0 - blueShift * 0.05;
      const colorB = 1.0 + blueShift * 0.1;  // slight blue cast for near stars

      return {
        x: Math.random() * W,
        y: overrideY !== undefined ? overrideY : Math.random() * H,
        z,
        size,
        baseOpacity,
        speed,
        parallax,
        colorR: clamp(colorR, 0, 1),
        colorG: clamp(colorG, 0, 1),
        colorB: clamp(colorB, 0, 1),
        shimmerPhase: Math.random() * Math.PI * 2,
        shimmerSpeed: lerp(0.0006, 0.002, Math.random()),
      };
    };

    // ── Populate stars ────────────────────────────────────────────────────────
    const populate = () => {
      stars = [];
      for (let i = 0; i < TOTAL_STARS; i++) {
        stars.push(makeStar());
      }
    };
    populate();

    // ── Resize listener ───────────────────────────────────────────────────────
    const onResize = () => {
      applySize();
      // Re-scatter x positions; keep relative y
      stars.forEach(s => { s.x = Math.random() * W; });
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────────
    let now = performance.now();

    const render = (ts: number) => {
      const dt = Math.min((ts - now) / 16.67, 3); // normalise to 60fps; cap for tab bg
      now = ts;

      // ── 1. Scroll velocity calc ──────────────────────────────────────────
      const curScrollY = window.scrollY;
      rawVelocity = Math.abs(curScrollY - lastScrollY);
      lastScrollY  = curScrollY;

      // Spring interpolation — slow rise, smooth fall
      const targetVel = rawVelocity;
      smoothVel += (targetVel - smoothVel) * 0.10 * dt;

      // Clamp so extreme fast scrolls stay bounded
      smoothVel = clamp(smoothVel, 0, 80);

      // ── 2. Clear using fade trail for motion blur atmosphere ─────────────
      // Instead of full clear, paint a translucent black rect each frame.
      // This leaves brief afterimages on fast-moving stars → organic streak/blur.
      const trailAlpha = lerp(0.85, 0.55, clamp(smoothVel / 30, 0, 1));
      ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // ── 3. Update & draw each star ────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Vertical movement: base drift + scroll parallax boost
        const scrollBoost = smoothVel * s.parallax * 0.55;
        const dy = (s.speed + scrollBoost) * dt;
        s.y -= dy;

        // Wrap to bottom when off top edge
        if (s.y < -10) {
          const ns = makeStar(H + 10);
          stars[i] = ns;
          continue;
        }

        // ── Shimmer ────────────────────────────────────────────────────────
        const shimmer = 0.80 + 0.20 * Math.sin(ts * s.shimmerSpeed + s.shimmerPhase);
        const opacity = clamp(s.baseOpacity * shimmer, 0, 1);

        // ── Streak magnitude ───────────────────────────────────────────────
        // Streak length grows with scroll speed and parallax (near streaks more).
        const streakLen = smoothVel * s.parallax * 0.70;

        const r = Math.round(s.colorR * 255);
        const g = Math.round(s.colorG * 255);
        const b = Math.round(clamp(s.colorB, 0, 1) * 255);
        const colorStr = `${r},${g},${b}`;

        if (streakLen > 1.2 && smoothVel > 1.5) {
          // ── STREAK MODE: elongated capsule along Y axis ──────────────────
          const halfW = s.size * 0.5;
          const streakOpacity = opacity * 0.92;

          // Linear gradient from bright head (top) to transparent tail (bottom)
          const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + streakLen);
          grad.addColorStop(0, `rgba(${colorStr},${streakOpacity})`);
          grad.addColorStop(1, `rgba(${colorStr},0)`);

          ctx.beginPath();
          // Capsule: round top cap, straight sides, tapered bottom
          ctx.moveTo(s.x - halfW, s.y);
          ctx.arc(s.x, s.y, halfW, Math.PI, 0);  // top round cap
          ctx.lineTo(s.x + halfW, s.y + streakLen);
          ctx.lineTo(s.x - halfW, s.y + streakLen);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // ── DOT MODE: circular star ────────────────────────────────────
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);

          if (s.z > 0.55) {
            // Near stars: soft white/blue-white glow halo
            ctx.shadowColor = `rgba(${colorStr},0.55)`;
            ctx.shadowBlur  = s.size * 3.5;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = `rgba(${colorStr},${opacity})`;
          ctx.fill();
          ctx.shadowBlur = 0; // always reset
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
