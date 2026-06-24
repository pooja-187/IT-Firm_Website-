"use client";

import { useEffect, useRef } from "react";

// ─── Particle Type Definition ────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  parallaxScale: number;
  blurAmount: number;
  shimmerSpeed: number;
  shimmerOffset: number;
}

// ─── Layer Configuration ─────────────────────────────────────────────────────
// Distant, Mid, and Near layers designed to create atmospheric depth.
const FAR_LAYER_CONFIG = {
  count: 85,
  minSize: 0.6,
  maxSize: 1.1,
  minOpacity: 0.06,
  maxOpacity: 0.16,
  speedX: 0.012,
  speedY: 0.018,
  parallax: 0.04,
  blur: 0,
};

const MID_LAYER_CONFIG = {
  count: 50,
  minSize: 1.1,
  maxSize: 1.7,
  minOpacity: 0.12,
  maxOpacity: 0.28,
  speedX: 0.024,
  speedY: 0.035,
  parallax: 0.12,
  blur: 0,
};

const NEAR_LAYER_CONFIG = {
  count: 16,
  minSize: 1.7,
  maxSize: 2.8,
  minOpacity: 0.18,
  maxOpacity: 0.35,
  speedX: 0.045,
  speedY: 0.060,
  parallax: 0.35,
  blur: 1.5, // Subtle radial blur/glow to mimic a depth-of-field camera lens
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Public export ────────────────────────────────────────────────────────────
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    // High performance scroll velocity tracking
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let smoothScrollVelocity = 0;
    let ambientSpeedMultiplier = 1;

    // Detect if we are on mobile to scale count and preserve CPU/Battery
    const isMobile = width < 768;
    const countScale = isMobile ? 0.55 : 1.0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      // Scale canvas backings according to device pixel ratio for super crisp rendering
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-distribute existing particles within new canvas dimensions
      particles.forEach((p) => {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      });
    };

    const createParticles = () => {
      particles = [];

      const generateForLayer = (config: typeof FAR_LAYER_CONFIG) => {
        const scaledCount = Math.round(config.count * countScale);
        for (let i = 0; i < scaledCount; i++) {
          const size = lerp(config.minSize, config.maxSize, Math.random());
          const baseOpacity = lerp(config.minOpacity, config.maxOpacity, Math.random());
          
          // Random drift directions
          const vx = (Math.random() * 2 - 1) * config.speedX;
          const vy = (Math.random() * 2 - 1) * config.speedY;

          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size,
            vx,
            vy,
            baseOpacity,
            parallaxScale: config.parallax,
            blurAmount: config.blur ? lerp(0.4, config.blur, Math.random()) : 0,
            shimmerSpeed: lerp(0.0008, 0.0025, Math.random()),
            shimmerOffset: Math.random() * Math.PI * 2,
          });
        }
      };

      generateForLayer(FAR_LAYER_CONFIG);
      generateForLayer(MID_LAYER_CONFIG);
      generateForLayer(NEAR_LAYER_CONFIG);
    };

    // Initial setup
    handleResize();
    createParticles();

    window.addEventListener("resize", handleResize, { passive: true });

    // Main animation render loop (highly-optimized RAF)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Calculate instantaneous scroll delta
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // 2. Smoothly ease scroll velocity towards target delta (spring interpolation)
      // This creates a buttery acceleration and decelerating drift decay when scrolling stops
      smoothScrollVelocity += (deltaY - smoothScrollVelocity) * 0.075;

      // 3. Interpolate ambient drift speed multiplier based on scroll velocity
      const targetMultiplier = Math.min(10, Math.max(1, 1 + Math.abs(smoothScrollVelocity) * 0.08));
      ambientSpeedMultiplier += (targetMultiplier - ambientSpeedMultiplier) * 0.075;

      // 4. Update, Wrap & Draw Particles
      const now = Date.now();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Atmospheric floating drift + reactive scroll parallax displacement
        p.x += p.vx * ambientSpeedMultiplier;
        p.y += p.vy * ambientSpeedMultiplier - smoothScrollVelocity * p.parallaxScale;

        // Infinite viewport wrapping bounds
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Subtle shimmering luminance oscillation
        const shimmer = 0.82 + 0.18 * Math.sin(now * p.shimmerSpeed + p.shimmerOffset);
        const opacity = Math.min(1.0, Math.max(0.0, p.baseOpacity * shimmer));

        // Render circular dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);

        // Apply visual lens glow only to foreground particles to save performance
        if (p.blurAmount > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.85})`;
          ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
          ctx.shadowBlur = p.blurAmount * 2.2;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
