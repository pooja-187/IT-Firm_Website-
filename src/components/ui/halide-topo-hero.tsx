"use client";

import React, { useEffect, useRef } from "react";

interface HalideTopoHeroProps {
  /** Slot rendered below the 3D canvas (e.g. search bar) */
  children?: React.ReactNode;
}

const HalideTopoHero: React.FC<HalideTopoHeroProps> = ({ children }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse Parallax Logic
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;

      // Rotate the 3D Canvas
      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      // Apply depth shift to layers
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 15;
        const moveX = x * (index + 1) * 0.2;
        const moveY = y * (index + 1) * 0.2;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    // Entrance Animation
    canvas.style.opacity = "0";
    canvas.style.transform = "rotateX(90deg) rotateZ(0deg) scale(0.8)";

    const timeout = setTimeout(() => {
      canvas.style.transition = "all 2.5s cubic-bezier(0.16, 1, 0.3, 1)";
      canvas.style.opacity = "1";
      canvas.style.transform = "rotateX(55deg) rotateZ(-25deg) scale(1)";
    }, 300);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <style>{`
        .halide-viewport {
          perspective: 2000px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .halide-canvas-3d {
          position: relative;
          width: 900px;
          height: 560px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .halide-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(224, 224, 224, 0.08);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .halide-layer-1 {
          background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.2) brightness(0.35);
        }
        .halide-layer-2 {
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.1) brightness(0.5);
          opacity: 0.5;
          mix-blend-mode: screen;
        }
        .halide-layer-3 {
          background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.3) brightness(0.6);
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        .halide-contours {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            transparent 40px,
            rgba(255, 255, 255, 0.04) 41px,
            transparent 42px
          );
          transform: translateZ(120px);
          pointer-events: none;
        }

        .halide-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: halide-flow 2s infinite ease-in-out;
        }

        @keyframes halide-flow {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50%       { transform: scaleY(1); transform-origin: top; }
          51%       { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      <div className="relative w-full overflow-hidden bg-[#0a0a0a]" style={{ minHeight: "100vh" }}>

        {/* SVG Grain Filter */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id="halide-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{ filter: "url(#halide-grain)", opacity: 0.12 }}
        />

        {/* ── INTERFACE OVERLAY ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            padding: "4rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto 1fr auto",
            fontFamily: "'Syncopate', 'Satoshi', sans-serif",
          }}
        >
          {/* Top-left brand monogram */}
          <div className="text-white/70 text-sm font-bold tracking-[0.2em] uppercase self-start">
            MANZIO_JOURNAL
          </div>

          {/* Top-right coordinates */}
          <div
            className="self-start text-right"
            style={{ fontFamily: "monospace", color: "#ff3c00", fontSize: "0.65rem", lineHeight: 1.7 }}
          >
            <div>LATITUDE: 34.0522° N</div>
            <div>FOCAL DEPTH: 80MM</div>
          </div>

          {/* Center hero title */}
          <h1
            className="text-white font-bold"
            style={{
              gridColumn: "1 / -1",
              alignSelf: "center",
              fontSize: "clamp(3rem, 9vw, 9rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              mixBlendMode: "difference",
            }}
          >
            THE<br />JOURNAL
          </h1>

          {/* Bottom strip */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              <p>[ ARCHIVE 2026 ]</p>
              <p>INSIGHTS &amp; ENGINEERING DEEP DIVES</p>
            </div>
            <a
              href="#articles"
              className="pointer-events-auto"
              style={{
                background: "#e0e0e0",
                color: "#0a0a0a",
                padding: "0.85rem 2rem",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)",
                transition: "0.3s",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#ff3c00";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#e0e0e0";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              EXPLORE ENTRIES
            </a>
          </div>
        </div>

        {/* ── 3D PARALLAX CANVAS ── */}
        <div className="halide-viewport" style={{ width: "100%", height: "100vh" }}>
          <div className="halide-canvas-3d" ref={canvasRef}>
            <div className="halide-layer halide-layer-1" ref={(el) => { if (el) layersRef.current[0] = el; }} />
            <div className="halide-layer halide-layer-2" ref={(el) => { if (el) layersRef.current[1] = el; }} />
            <div className="halide-layer halide-layer-3" ref={(el) => { if (el) layersRef.current[2] = el; }} />
            <div className="halide-contours" />
          </div>
        </div>

        {/* Scroll hint line */}
        <div className="halide-scroll-hint" />

        {/* Bottom fade into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, transparent, #000000)" }}
        />

        {/* Children slot (search bar etc.) */}
        {children && (
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-6">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default HalideTopoHero;
