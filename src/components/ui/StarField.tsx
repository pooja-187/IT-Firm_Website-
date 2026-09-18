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
  isGlowing: boolean;
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
  glow: false,
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
  glow: false,
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
  glow: true, // Subtle radial glow to mimic depth-of-field camera lens focus
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Pre-render a reusable glowing star sprite onto an offscreen canvas (zero per-frame CPU Gaussian blurs)
function createGlowSprite(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const sprite = document.createElement("canvas");
  const size = 32;
  sprite.width = size;
  sprite.height = size;
  const sCtx = sprite.getContext("2d");
  if (!sCtx) return null;

  const half = size / 2;
  const gradient = sCtx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
  gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.25)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  sCtx.fillStyle = gradient;
  sCtx.beginPath();
  sCtx.arc(half, half, half, 0, Math.PI * 2);
  sCtx.fill();
  return sprite;
}

// ─── Public export ────────────────────────────────────────────────────────────
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Cache pre-rendered glow sprite
    const glowSprite = createGlowSprite();

    let animationFrameId: number | null = null;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;
    let isRunning = false;

    // High performance scroll velocity tracking via passive event listener (zero RAF layout thrashing)
    let currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastScrollY = currentScrollY;
    let smoothScrollVelocity = 0;
    let ambientSpeedMultiplier = 1;

    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Detect if we are on mobile to scale count and preserve CPU/Battery
    const isMobile = width < 768;
    const countScale = isMobile ? 0.45 : 1.0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Cap DPR to 1.5 to maintain razor-sharp stars while avoiding multi-million pixel fill-rate penalties
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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
            isGlowing: config.glow,
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

    // Main animation render loop (highly-optimized RAF with zero shadowBlur CPU penalties)
    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate instantaneous scroll delta from passive listener
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

        // Render glowing near particles via pre-rendered hardware-accelerated sprite
        if (p.isGlowing && glowSprite) {
          const drawSize = p.size * 3.8;
          ctx.globalAlpha = opacity;
          ctx.drawImage(
            glowSprite,
            p.x - drawSize / 2,
            p.y - drawSize / 2,
            drawSize,
            drawSize
          );
        } else {
          // Render standard circular star dot (zero state changes/saves)
          ctx.globalAlpha = opacity;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        currentScrollY = window.scrollY;
        lastScrollY = currentScrollY;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Tab visibility handling: pause animation when browser tab is inactive to preserve 100% CPU/Battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    // Resize listener with passive flag
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start render loop
    startLoop();

    // Clean up
    return () => {
      stopLoop();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
