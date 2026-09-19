"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import Link from "next/link";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TRADITIONAL_BULLETS = [
  "Generic templates and repetitive strategies",
  "Inconsistent execution and delayed delivery",
  "Minimal long-term innovation focus",
  "Limited cinematic brand storytelling",
  "Standard websites with outdated experiences"
];

const MANZIO_BULLETS = [
  "Cinematic digital experiences engineered for growth",
  "End-to-end full-stack experiences crafted for future growth.",
  "Elite creative + development collaboration",
  "Immersive storytelling with futuristic execution",
  "Long-term innovation-focused partnerships"
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDEPENDENT 3D PANEL SUB-COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface PanelProps {
  title: string;
  isPremium: boolean;
  bullets: string[];
  accentColor: string;
  glowColor: string;
  index: number;
}

function WhyChoosePanel({ title, isPremium, bullets, accentColor, glowColor, index }: PanelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch =
      (typeof window !== "undefined" &&
        (window.matchMedia("(pointer: coarse)").matches ||
         ("ontouchstart" in window || navigator.maxTouchPoints > 0))) ||
      window.innerWidth < 768;
    setIsTouchDevice(isTouch);
  }, []);

  // Motion values for 3D Parallax Tilt (desktop only)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for buttery smooth rotational interpolation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable pointer-based 3D tilt on touch devices
    if (isTouchDevice) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Track cursor for internal radial spotlight
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });

    // Calculate rotation coordinates (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    const normX = (e.clientX - rect.left - width / 2) / width;
    const normY = (e.clientY - rect.top - height / 2) / height;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt coordinates to center smoothly
    x.set(0);
    y.set(0);
  };

  const panelContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: isTouchDevice ? 0 : rotateX,
        rotateY: isTouchDevice ? 0 : rotateY,
        transformStyle: isTouchDevice ? undefined : "preserve-3d",
      }}
      className={`group relative w-full rounded-[2.2rem] p-[1.2px] overflow-hidden transition-all duration-[600ms] ease-out select-none ${
        isPremium 
          ? "bg-white/[0.04] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] cursor-pointer" 
          : "bg-white/[0.02] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.9)] opacity-70 hover:opacity-90 cursor-default"
      }`}
    >
      {/* 1. Static Ambient Background Glow (Default state, visible at rest) */}
      <div
        className="absolute inset-[-15px] opacity-100 group-hover:opacity-0 transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.3rem]"
        style={{
          background: isPremium
            ? "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.02) 40%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 65%)",
          filter: "blur(25px)",
          zIndex: 0,
        }}
      />

      {/* 2. Static Ambient Background Glow (Hover intensified state) */}
      <div
        className="absolute inset-[-15px] opacity-0 group-hover:opacity-100 transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.3rem]"
        style={{
          background: isPremium
            ? "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(236, 72, 153, 0.06) 50%, transparent 80%)"
            : "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.22) 0%, transparent 75%)",
          filter: "blur(30px)",
          zIndex: 0,
        }}
      />

      {/* 3. Interactive Cursor Spotlight (Hover state only, follows cursor) */}
      <div
        className="absolute inset-[-15px] opacity-0 group-hover:opacity-100 transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.3rem]"
        style={{
          background: isPremium
            ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.16) 0%, rgba(236, 72, 153, 0.03) 50%, transparent 100%)`
            : `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.14) 0%, transparent 100%)`,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />

      {/* 4. Static Border Base (Default state, visible at rest) */}
      <div
        className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.2rem]"
        style={{
          background: isPremium
            ? "linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(236, 72, 153, 0.1) 100%)"
            : "linear-gradient(135deg, rgba(239, 68, 68, 0.28) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(239, 68, 68, 0.08) 100%)",
          zIndex: 0,
        }}
      />

      {/* 5. Static Border Base (Hover intensified state) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.2rem]"
        style={{
          background: isPremium
            ? "linear-gradient(135deg, rgba(168, 85, 247, 0.45) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(236, 72, 153, 0.22) 100%)"
            : "linear-gradient(135deg, rgba(239, 68, 68, 0.45) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(239, 68, 68, 0.18) 100%)",
          zIndex: 0,
        }}
      />

      {/* 6. Sharp Dynamic Border Tracer (Hover state only, follows cursor) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-[500ms] ease-out pointer-events-none rounded-[2.2rem]"
        style={{
          background: isPremium 
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.22) 50%, transparent 100%)`
            : `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0.18) 50%, transparent 100%)`,
          zIndex: 0,
        }}
      />

      {/* 6.5. Rotating Border Tracer Glow & Outline (Hover active, ambient rest) */}
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] aspect-square opacity-[0.06] group-hover:opacity-45 transition-opacity duration-500 pointer-events-none rounded-full card-border-tracer"
        style={{
          background: isPremium
            ? "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)"
            : "conic-gradient(from 0deg, transparent 20%, #b91c1c 40%, #ef4444 49%, #f97316 51%, #ef4444 53%, #dc2626 62%, transparent 80%)",
          filter: "blur(14px)",
          zIndex: 0,
          animationDuration: isPremium ? "4.5s" : "7s",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] aspect-square opacity-[0.08] group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full card-border-tracer"
        style={{
          background: isPremium
            ? "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)"
            : "conic-gradient(from 0deg, transparent 20%, #b91c1c 40%, #ef4444 49%, #f97316 51%, #ef4444 53%, #dc2626 62%, transparent 80%)",
          zIndex: 0,
          animationDuration: isPremium ? "4.5s" : "7s",
        }}
      />

      {/* 7. Card Body Container */}
      <div 
        style={{ transform: isTouchDevice ? undefined : "translateZ(10px)" }}
        className={`relative w-full h-full rounded-[2.1rem] px-8 py-10 overflow-hidden md:backdrop-blur-2xl why-choose-card-body z-10 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-500 ${
          isPremium ? "bg-[#09090b]/95 md:bg-[#09090b]/85" : "bg-[#060608]/95 md:bg-[#060608]/75"
        }`}
      >
        {/* Subtle internal glass gloss reflection highlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] pointer-events-none"
          style={{
            background: isPremium 
              ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.025) 0%, transparent 80%)`
              : `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.03) 0%, transparent 80%)`,
          }}
        />

        {/* Panel Header */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase font-sans px-3 py-1 rounded-full ${
              isPremium 
                ? "bg-purple-500/10 border border-purple-500/20 text-purple-400" 
                : "bg-white/[0.03] border border-white/5 text-neutral-400"
            }`}>
              {isPremium ? "Elite Partner" : "Standard Agency"}
            </span>
            {isPremium && (
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
            )}
          </div>

          <h3 className={`text-[26px] font-semibold tracking-tight leading-snug ${
            isPremium ? "text-white" : "text-white/70"
          }`}
          style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}>
            {title}
          </h3>
          
          <div className="w-12 h-[1px] bg-white/10 mt-1" />
        </div>

        {/* Bullet Points list */}
        <div className="relative z-10 flex flex-col gap-6 mt-10">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-4 group/item">
              
              {/* Bullet Indicator Pill */}
              <div className={`mt-1 h-5 w-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors duration-300 ${
                isPremium 
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.15)] group-hover:border-purple-400"
                  : "bg-amber-600/5 border-amber-600/10 text-amber-600/40"
              }`}>
                {isPremium ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                )}
              </div>

              {/* Text Description */}
              <p className={`text-[13.5px] leading-relaxed font-normal tracking-wide transition-colors duration-300 ${
                isPremium 
                  ? "text-white/80 group-hover:text-white" 
                  : "text-white/40 group-hover:text-white/60"
              }`}>
                {bullet}
              </p>

            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (isPremium) {
    return (
      <Link href="/about" className="block w-full">
        {panelContent}
      </Link>
    );
  }

  return panelContent;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPARISON SECTION COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function WhyChooseManzio() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress to enable a very soft opacity fade transition on entry
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Track scroll progress on exit as the user scrolls down to the FAQ section
  const { scrollYProgress: exitScroll } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });

  const enterOpacity = useTransform(scrollYProgress, [0, 0.3], [0.75, 1]);
  const exitOpacity = useTransform(exitScroll, [0.2, 1.0], [1, 0]);

  const sectionOpacity = useTransform(
    [enterOpacity, exitOpacity],
    ([o1, o2]: number[]) => o1 * o2
  );

  return (
    <section 
      ref={sectionRef}
      className="relative w-full pt-10 pb-16 sm:pb-20 bg-black z-30 overflow-hidden"
    >
      
      {/* ── 1. Cosmic Floating Background Particle Noise ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Floating Orb 1 */}
        <motion.div
          animate={{
            y: [0, -60, 0],
            x: [0, 30, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/10 w-2.5 h-2.5 rounded-full bg-purple-500 blur-[2px]"
        />

        {/* Floating Orb 2 */}
        <motion.div
          animate={{
            y: [0, 45, 0],
            x: [0, -25, 0],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/10 w-3 h-3 rounded-full bg-pink-500 blur-[2px]"
        />

        {/* Floating Orb 3 */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -40, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-blue-500 blur-[1px]"
        />

        {/* Floating Orb 4 */}
        <motion.div
          animate={{
            y: [0, 50, 0],
            x: [0, 40, 0],
            opacity: [0.07, 0.14, 0.07],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-purple-400 blur-[2px]"
        />
      </div>

      {/* ── 2. Cinematic Section Wrapper ── */}
      <motion.div 
        style={{ opacity: sectionOpacity }} 
        className="relative w-full max-w-6xl mx-auto px-6 z-10"
      >
        
        {/* Centered Typography Heading Header */}
        <div className="text-center mb-16 md:mb-20 flex flex-col items-center gap-3">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-3.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60 font-sans">
                Vanguard
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(30px, 4.5vw, 52px)",
              fontWeight: 700,
            }}
          >
            <span style={{ fontWeight: 700 }}>Why Choose </span>
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]"
            >
              Manzio.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-[1.6] max-w-lg font-normal tracking-wide mt-0.5"
          >
            Where cinematic strategy meets scalable digital innovation.
          </motion.p>
        </div>

        {/* ── 3. Dual Holographic Panels Comparison Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch perspective-[1500px]">
          
          {/* LEFT PANEL: Traditional Agencies (Muted appearance, orange/gray indicators) */}
          <WhyChoosePanel
            title="Traditional Agencies"
            isPremium={false}
            bullets={TRADITIONAL_BULLETS}
            accentColor="from-neutral-500 to-neutral-700"
            glowColor="rgba(255, 255, 255, 0.02)"
            index={0}
          />

          {/* RIGHT PANEL: Working With Manzio (Glowing, purple ambient glows) */}
          <WhyChoosePanel
            title="Working With Manzio"
            isPremium={true}
            bullets={MANZIO_BULLETS}
            accentColor="from-[#8b5cf6] to-[#ec4899]"
            glowColor="rgba(139, 92, 246, 0.12)"
            index={1}
          />

        </div>

      </motion.div>
    </section>
  );
}
