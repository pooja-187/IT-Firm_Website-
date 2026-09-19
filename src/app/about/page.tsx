"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { AppContainer } from "@/components/ui/AppContainer";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { HeroSplineBackground } from "@/components/ui/galaxy-interactive-hero-section";
import { MagicText } from "@/components/ui/magic-text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, Sparkles, Award, Users, TrendingUp, ArrowRight, Target, Eye, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "top" | "center" | "bottom" }
>(({ className, variant = "top", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute w-full pointer-events-none select-none z-0",
      variant === "top" && "top-0",
      variant === "center" && "top-[50%]",
      variant === "bottom" && "bottom-0",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.06)_10%,_rgba(168,85,247,0)_60%)] sm:h-[512px] blur-3xl",
        variant === "center" && "-translate-y-1/2"
      )}
    />
    <div
      className={cn(
        "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.04)_10%,_rgba(236,72,153,0)_60%)] sm:h-[256px] blur-2xl",
        variant === "center" && "-translate-y-1/2"
      )}
    />
  </div>
));
Glow.displayName = "Glow";

interface GradientTextProps {
  className?: string;
  children: React.ReactNode;
}

function GradientText({
  className,
  children,
}: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        "relative inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-bold",
        className
      )}
    >
      {children}
    </motion.span>
  );
}

interface MissionVisionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const MissionVisionCard = ({ icon, title, description, delay = 0 }: MissionVisionCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / rect.height) * 3;
      const rotateY = (x / rect.width) * 3;

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="w-full"
    >
      <Card
        className="relative overflow-hidden border border-white/[0.18] bg-[#0c0c12]/40 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/45 rounded-3xl"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {/* Edge Glow Spotlight inside Card */}
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
            animate={{
              opacity: isHovered ? 0.15 : 0,
            }}
            style={{
              background: `
                radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.4) 0%, transparent 60%),
                radial-gradient(circle at 0% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 60%)
              `,
              filter: "blur(40px)",
            }}
          />

          <CardContent className="relative p-8 flex flex-col gap-5">
            {/* Animated Icon Box */}
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 shadow-[0_4px_12px_-2px_rgba(168,85,247,0.1)]"
              animate={{
                scale: isHovered ? 1.05 : 1,
                boxShadow: isHovered
                  ? "0 8px 24px -4px rgba(168, 85, 247, 0.3)"
                  : "0 4px 12px -2px rgba(168, 85, 247, 0.1)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-purple-400">{icon}</div>
            </motion.div>

            <div className="flex flex-col gap-2.5">
              <h3 
                className="text-2xl font-semibold tracking-tight text-white"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {title}
              </h3>
              <p className="text-white/60 leading-relaxed text-sm sm:text-[14.5px] font-normal tracking-wide text-pretty">
                {description}
              </p>
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};

interface StickyPanelProps {
  children: React.ReactNode;
  zIndex: number;
  noFadeOut?: boolean;
}

const zIndexMap: Record<number, string> = {
  20: "z-20",
  30: "z-30",
  40: "z-40",
  50: "z-50",
  60: "z-60",
  70: "z-70",
};

const StickyPanel = ({ children, zIndex, noFadeOut = false }: StickyPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this stuck panel relative to the viewport
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start start", "end start"]
  });

  // Smoothly transform scale, blur, and brightness during overlap transition (delayed start for readability)
  const scale = useTransform(scrollYProgress, [0, 0.75, 0.98], noFadeOut ? [1, 1, 1] : [1, 1, 0.98]);
  const brightness = useTransform(scrollYProgress, [0, 0.75, 0.98], noFadeOut ? [1, 1, 1] : [1, 1, 0.5]);
  const blurVal = useTransform(scrollYProgress, [0, 0.75, 0.98], noFadeOut ? [0, 0, 0] : [0, 0, 4]);

  const filter = useMotionTemplate`brightness(${brightness}) blur(${blurVal}px)`;

  return (
    <motion.div
      ref={panelRef}
      style={{
        scale,
        filter,
        opacity: 1, // Force solid opacity to behave like sheets of paper
        zIndex: zIndex,
      }}
      className={`sticky top-[8vh] sm:top-[10vh] w-full rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.95)] border-t border-white/[0.08] border-x border-white/[0.03] border-b border-white/[0.03] bg-[#07070a] overflow-hidden ${zIndexMap[zIndex] || "z-10"}`}
    >
      {children}
    </motion.div>
  );
};

const STORIES = [
  { label: "01 QUANTUM RESOLUTION", text: "Processing layout frames with sub-millisecond rendering precision to keep visual flows completely seamless." },
  { label: "02 NEON DIFFUSION", text: "Breathing ambient purple haze atmospheres into deep viewport backgrounds for cinematic spatial focus." },
  { label: "03 INTEGRATED MONOGRAM", text: "Representing absolute developer studio credentials throughout all metadata structures." },
  { label: "04 INTENTIONAL PERFORMANCE", text: "Optimizing full-stack django REST nodes for instant loading and elite server reaction speeds." },
  { label: "05 SENSORY FEEDBACK", text: "Crafting custom responsive interaction states that elevate customer brand trust instantly." },
  { label: "06 SPATIAL PHYSICS", text: "Interacting with micro-depth dimensions and rotational axes for immersive digital dimensions." },
  { label: "07 CYBERNETIC GRID", text: "Weaving structural grid patterns to anchor vectors and layout columns cleanly on all viewport bounds." },
  { label: "08 SHINY GLASSMORPHISM", text: "Casting internal spotlight reflections across glass panels with clean border tracer shadows." },
  { label: "09 MAGNETIC TRANSLATIONS", text: "Calculating magnetic attraction vectors to pull UI elements to the user's cursor dynamically." }
];

interface Star {
  id: number;
  width: number;
  height: number;
  top: string;
  left: string;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const isSection4InView = useInView(section4Ref, { once: false, amount: 0.15 });

  const { scrollYProgress: section4ScrollYProgress } = useScroll({
    target: section4Ref,
    offset: ["start end", "end start"],
  });

  const section4Y1 = useTransform(section4ScrollYProgress, [0, 1], [0, -60]);
  const section4Y2 = useTransform(section4ScrollYProgress, [0, 1], [0, 60]);
  const section4Rotate1 = useTransform(section4ScrollYProgress, [0, 1], [0, 15]);

  const stats = [
    { icon: <Award className="w-5 h-5 text-purple-400" />, value: "50+", label: "Projects Delivered" },
    { icon: <Users className="w-5 h-5 text-purple-400" />, value: "100%", label: "Client Commitment" },
    { icon: <TrendingUp className="w-5 h-5 text-purple-400" />, value: "98%", label: "Client Retention" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  // Mouse coordinates spotlight tracking (follows cursor inside Hero)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isScrollerPaused, setIsScrollerPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate 60 unique stars once on client-side mount for drifting and twinkling
    const generatedStars = [...Array(60)].map((_, i) => ({
      id: i,
      width: Math.random() * 2 + 0.6,
      height: Math.random() * 2 + 0.6,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      driftX: (Math.random() - 0.5) * 45,
      driftY: (Math.random() - 0.5) * 45,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  // Parallax spring calculations for background image
  const bgXOffset = useTransform(smoothX, [0, 1920], [-12, 12]);
  const bgYOffset = useTransform(smoothY, [0, 1080], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#050505] text-white overflow-hidden z-10 pb-20 select-none"
    >

      {/* ── 1. GLOBAL IMMERSIVE ATMOSPHERIC NEBULAS (Breathe & pulse) ── */}
      <motion.div
        className="absolute top-[30%] left-[10%] w-[700px] h-[550px] rounded-full pointer-events-none -z-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.01) 50%, transparent 80%)",
          filter: "blur(90px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-[65%] right-[5%] w-[800px] h-[650px] rounded-full pointer-events-none -z-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.03) 0%, rgba(147, 51, 234, 0.01) 50%, transparent 80%)",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1.08, 0.96, 1.08],
          opacity: [0.75, 0.95, 0.75],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Space Singularity Cinematic 100vh Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-20">

        {/* Galaxy Spline 3D Background */}
        <div className="absolute inset-0 w-full h-full z-0 select-none overflow-hidden">
          <HeroSplineBackground />
        </div>


        {/* Perfectly Centered Cinematic Typography */}
        <div className="relative z-30 max-w-4xl px-6 text-center select-text pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white tracking-[-0.03em] leading-[1.2] text-center pointer-events-auto"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(24px, 4.2vw, 48px)",
              textShadow: "0 0 30px rgba(255, 255, 255, 0.22), 0 0 60px rgba(139, 92, 246, 0.12)",
            }}
          >
            <span className="block text-white/90 font-bold tracking-[-0.03em] mb-2 text-[1.0em] sm:text-[1.05em]">Digital Experiences</span>
            <span className="block whitespace-nowrap text-white font-bold tracking-[-0.04em] pb-1 text-[1.6em] sm:text-[1.7em] leading-tight">Engineered With Obsession</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/60 font-sans font-normal tracking-[0.01em] text-xs sm:text-sm md:text-[15px] max-w-xl mx-auto mt-6 leading-relaxed select-text pointer-events-auto"
          >
            Backed by 8+ years of excellence, we build high-performance digital solutions that drive growth and innovation.
          </motion.p>
        </div>

      </section>

      {/* ── 2. CYBER DOT GRID TEXTURE OVERLAY ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] select-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <AppContainer>
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-12 space-y-[12vh] sm:space-y-[20vh]">
          <StickyPanel zIndex={20}>
            <section className="relative w-full py-12 sm:py-16 px-6 sm:px-12 md:px-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

                {[
                  { number: "08+", category: "Time on Matrix", desc: "Refining high-fidelity experiences" },
                  { number: "350+", category: "Production Index", desc: "Custom SAAS to immersive web" },
                  { number: "250+", category: "Global Network", desc: "Collaborations with visionary brands" },
                  { number: "24/7", category: "Support Frequency", desc: "Continuous technical maintenance" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden p-[1.2px] rounded-2xl cursor-pointer"
                  >
                    {/* Glassmorphic card body container */}
                    <div className="relative rounded-[15px] bg-[#070709]/92 backdrop-blur-xl border border-white/[0.15] group-hover:border-purple-500/40 p-6 md:p-7 flex flex-col justify-between min-h-[170px] z-10 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                      {/* Static purple background shade on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/[0.07] via-transparent to-transparent" />

                      {/* Internal Spotlight Reflex effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(180px_circle_at_center,rgba(168,85,247,0.05),transparent_100%)]" />

                      <div className="flex flex-col gap-1.5 relative z-10">
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
                          {stat.category}
                        </span>
                        <span
                          className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.18)] mt-2"
                          style={{ fontFamily: "Satoshi, sans-serif" }}
                        >
                          {stat.number}
                        </span>
                      </div>

                      <span className="text-xs text-white/40 tracking-wide font-normal mt-4 relative z-10">
                        {stat.desc}
                      </span>

                    </div>
                  </div>
                ))}

              </div>
            </section>
          </StickyPanel>


          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 3: STORYTELLING ("Built From Obsession")
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <StickyPanel zIndex={30}>
            <section className="relative w-full py-12 sm:py-16 md:py-20 px-6 sm:px-12 md:px-16 flex flex-col lg:grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">

              {/* Left Column: Title & Cyber Coordinates Badge */}
              <div className="lg:col-span-5 flex flex-col gap-6 w-full items-start">

                {/* Micro badge */}
                <div className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.01] px-3.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Core Genesis
                  </span>
                </div>

                <h2
                  className="text-white font-semibold text-3xl sm:text-4xl leading-[1.2] tracking-tight text-pretty"
                  style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
                >
                  Built From{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                    Obsession.
                  </span>
                </h2>

                {/* Decorative accent divider line */}
                <div className="w-16 h-[1.5px] bg-gradient-to-r from-purple-500 to-transparent" />

                <p className="text-white/40 text-xs sm:text-[13px] leading-relaxed max-w-sm font-normal tracking-wide mt-2">
                  We believe standard software engineering has lost its emotional center. We engineered Manzio to change that.
                </p>

              </div>

              {/* Right Column: Dynamic Cinematic Auto-Scrolling Feature System */}
              <div className="lg:col-span-7 w-full overflow-hidden relative h-[480px] sm:h-[520px] md:h-[600px] rounded-2xl border border-white/[0.03] bg-black/40">

                {/* Dynamic, responsive scrolling animation style */}
                <style>{`
                  @keyframes scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                  }
                  .animate-vertical-scroll {
                    animation: scroll-up 55s linear infinite;
                  }
                  @media (min-width: 768px) {
                    .animate-vertical-scroll {
                      animation: scroll-up 38s linear infinite;
                    }
                  }
                `}</style>

                {/* Seamless atmospheric masking gradients on top and bottom */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />

                <div className="absolute inset-0 p-4 overflow-hidden">
                  <div
                    className="animate-vertical-scroll flex flex-col gap-6"
                    style={{
                      animationPlayState: isScrollerPaused ? "paused" : "running",
                    }}
                  >
                    {/* First 9 Cards */}
                    {STORIES.map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden p-[1.2px] rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1 w-full"
                        onMouseEnter={() => setIsScrollerPaused(true)}
                        onMouseLeave={() => setIsScrollerPaused(false)}
                      >
                        {/* Card Body Container */}
                        <div className="relative rounded-[15px] bg-[#070709]/95 border border-white/[0.15] group-hover:border-purple-500/40 p-6 z-10 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.09)] group-hover:bg-[#09090c]/98">
                          {/* Static purple background shade on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/[0.07] via-transparent to-transparent" />

                          {/* Internal spotlight reflection on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(150px_circle_at_center,rgba(168,85,247,0.06),transparent_100%)]" />

                          <span className="text-[9.5px] font-mono text-purple-400/80 tracking-wider block mb-3 relative z-10">
                            {item.label}
                          </span>
                          <p className="text-[13px] sm:text-[14px] font-normal text-white/50 group-hover:text-white/80 transition-colors duration-300 leading-relaxed tracking-wide relative z-10">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Second 9 Cards (for seamless infinite loop) */}
                    {STORIES.map((item, idx) => (
                      <div
                        key={`dup-${idx}`}
                        className="group relative overflow-hidden p-[1.2px] rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1 w-full"
                        onMouseEnter={() => setIsScrollerPaused(true)}
                        onMouseLeave={() => setIsScrollerPaused(false)}
                      >
                        {/* Card Body Container */}
                        <div className="relative rounded-[15px] bg-[#070709]/95 border border-white/[0.15] group-hover:border-purple-500/40 p-6 z-10 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.09)] group-hover:bg-[#09090c]/98">
                          {/* Static purple background shade on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/[0.07] via-transparent to-transparent" />

                          {/* Internal spotlight reflection on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(150px_circle_at_center,rgba(168,85,247,0.06),transparent_100%)]" />

                          <span className="text-[9.5px] font-mono text-purple-400/80 tracking-wider block mb-3 relative z-10">
                            {item.label}
                          </span>
                          <p className="text-[13px] sm:text-[14px] font-normal text-white/50 group-hover:text-white/80 transition-colors duration-300 leading-relaxed tracking-wide relative z-10">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </section>
          </StickyPanel>


          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 4: REDESIGNED FOUNDER MESSAGE (Cinematic Leadership quote card, Stats & Careers Banner)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <StickyPanel zIndex={40}>
            <section 
              ref={section4Ref}
              className="relative w-full py-16 sm:py-20 md:py-24 px-6 sm:px-12 md:px-16 overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#07070a] via-[#0b0b0f] to-[#07070a]"
            >
              {/* Glowing Background Nebulas */}
              <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none"
                style={{ y: section4Y1, rotate: section4Rotate1 }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl pointer-events-none"
                style={{ y: section4Y2 }}
              />

              <motion.div
                className="w-full max-w-7xl relative z-10"
                initial="hidden"
                animate={isSection4InView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                {/* Header Badge & Title */}
                <motion.div className="flex flex-col items-center mb-16 text-center" variants={itemVariants}>
                  <Badge variant="outline" className="mb-4 gap-2 border-purple-500/10 bg-purple-500/[0.02]">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">Message from Leadership</span>
                  </Badge>
                  <h2 
                    className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent tracking-tight"
                    style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
                  >
                    A Word from Our Founder
                  </h2>
                  <motion.div
                    className="w-24 h-[1.5px] bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={isSection4InView ? { width: 96 } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
                  
                  {/* Left Column: Interactive Quote Card & Metrics Grid */}
                  <motion.div variants={itemVariants} className="lg:col-span-7 relative order-2 lg:order-1 flex flex-col gap-8 w-full">
                    <Card className="relative overflow-hidden border border-white/[0.18] bg-[#0c0c12]/60 backdrop-blur-md shadow-2xl rounded-[1.75rem]">
                      <CardContent className="p-8 md:p-10 flex flex-col gap-6">
                        <div className="flex items-start gap-4">
                          <Quote className="w-8 h-8 text-purple-400 flex-shrink-0 rotate-180" />
                          <p className="text-base sm:text-lg italic text-white/90 leading-relaxed font-medium">
                            "At Manzio Creative Studio, we believe design is not just about visuals—it’s about creating meaningful digital experiences that connect people and businesses."
                          </p>
                        </div>

                        <div className="space-y-4 text-white/70 text-sm sm:text-[15px] leading-relaxed tracking-wide">
                          <p>
                            Our goal is to bring innovation, precision, and strong strategic thinking to every project we work on. We don't just deliver solutions; we build long-term partnerships by understanding our clients' vision and transforming it into powerful digital outcomes.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
                          <div>
                            <h3 
                              className="text-lg font-semibold text-white tracking-tight"
                              style={{ fontFamily: "Satoshi, sans-serif" }}
                            >
                              Nashim Nazar
                            </h3>
                            <p className="text-xs text-purple-400 font-medium uppercase tracking-wider mt-0.5">
                              Founder & CEO, Manzio Creative Studio
                            </p>
                          </div>
                          <Button 
                            className="gap-2 group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full text-xs font-semibold px-5 py-2.5 h-auto cursor-pointer"
                            onClick={() => {
                              const el = document.getElementById("footer");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Get in Touch
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats Sub-Grid */}
                    <motion.div
                      className="grid grid-cols-3 gap-4 w-full"
                      variants={containerVariants}
                    >
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ y: -5, borderColor: "rgba(168,85,247,0.4)" }}
                          className="bg-[#0c0c12]/40 border border-white/[0.15] rounded-2xl p-4 text-center shadow-lg transition-all duration-300 backdrop-blur-sm"
                        >
                          <div className="flex justify-center mb-2">
                            {stat.icon}
                          </div>
                          <div 
                            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                            style={{ fontFamily: "Satoshi, sans-serif" }}
                          >
                            {stat.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/50 tracking-wide font-medium uppercase mt-1">
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Right Column: Large Founder Image Portrait */}
                  <motion.div variants={itemVariants} className="lg:col-span-5 relative order-1 lg:order-2 flex justify-center w-full group">
                    <div className="relative w-full max-w-sm sm:max-w-md">
                      
                      {/* Image container */}
                      <motion.div
                        className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={isSection4InView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        whileHover={{ scale: 1.015 }}
                      >
                        <div className="aspect-[3/4] relative">
                          <Image
                            src="/founder-portrait.jpg"
                            alt="Nashim Nazar - Founder & CEO, Manzio Creative Studio"
                            fill
                            className="object-cover object-center"
                            unoptimized
                            priority
                          />
                          {/* Vignette Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </motion.div>

                      {/* Parallax Outer Edge Lighting Frame */}
                      <motion.div
                        className="absolute inset-0 border border-purple-500/20 rounded-3xl -m-4 z-[-1] pointer-events-none"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={isSection4InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      />

                      {/* Accent blur points */}
                      <motion.div
                        className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl z-[-1]"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl z-[-1]"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom careers Glass CTA block */}
                <motion.div
                  variants={itemVariants}
                  className="mt-20 bg-gradient-to-r from-purple-500/[0.04] to-pink-500/[0.02] backdrop-blur-md border border-white/[0.16] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group/cta"
                >
                  {/* Subtle background tracer line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                  
                  <h3 
                    className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    Join Us on Our Journey
                  </h3>
                  <p className="text-white/50 mb-8 max-w-2xl mx-auto text-sm sm:text-[15px] leading-relaxed font-normal tracking-wide">
                    We are always looking for passionate creators, developers, and visionaries who share our drive for digital perfection. Let's craft the future of the internet together.
                  </p>
                  <Button 
                    size="lg" 
                    className="gap-2 group bg-white text-black hover:bg-white/90 rounded-full text-xs font-bold px-6 py-3 h-auto cursor-pointer"
                    onClick={() => {
                      const el = document.getElementById("footer");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explore Careers
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-black" />
                  </Button>
                </motion.div>
              </motion.div>

              <Glow variant="center" className="opacity-30" />
            </section>
          </StickyPanel>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 5: INTERACTIVE MISSION & VISION (3D Glassmorphic Cards & Core Values Carousel)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <StickyPanel zIndex={50}>
            <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#07070a] overflow-hidden flex flex-col items-center">
              {/* Glowing Background Nebulas */}
              <div className="absolute inset-0 opacity-35 pointer-events-none select-none z-0">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-purple-950/10 blur-[130px]"
                  style={{
                    background: "radial-gradient(circle at 20% 30%, rgba(172, 92, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)"
                  }}
                />
              </div>

              {/* Grid tracers overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

              <div className="relative w-full z-10 max-w-6xl mx-auto space-y-16">
                {/* Header Block */}
                <div className="text-center space-y-6 max-w-3xl mx-auto flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/10 bg-purple-500/[0.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">Our Purpose</span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-white text-4xl sm:text-5xl md:text-6xl tracking-tight font-bold"
                    style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700 }}
                  >
                    Driven by{" "}
                    <GradientText className="from-purple-400 via-pink-400 to-purple-400">
                      Vision
                    </GradientText>
                    , <br className="hidden md:block" />
                    Guided by{" "}
                    <GradientText className="from-pink-400 via-purple-400 to-pink-400">
                      Mission
                    </GradientText>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/50 text-[14px] sm:text-[16px] leading-relaxed max-w-xl font-normal tracking-wide mt-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We believe in creating exceptional experiences that transform the way people interact with technology, building a future where innovation meets purpose.
                  </motion.p>
                </div>

                {/* 3D Glassmorphic Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <MissionVisionCard
                    icon={<Target className="w-6 h-6" />}
                    title="Our Mission"
                    description="To empower businesses through strategic creativity, future-ready technology, and exceptional design quality. We combine deep strategic thinking with sub-millisecond execution to drive measurable growth and long-term success for our clients."
                    delay={0.15}
                  />

                  <MissionVisionCard
                    icon={<Eye className="w-6 h-6" />}
                    title="Our Vision"
                    description="To become India’s most trusted global creative and technology studio, recognized worldwide for excellence in digital design, scalable full-stack development, and intelligent branding that shapes the future of business."
                    delay={0.25}
                  />
                </div>

                {/* Core Values carousel tag block */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-center pt-8 flex justify-center w-full"
                >
                  <div className="inline-flex flex-col items-center gap-5 p-8 rounded-3xl bg-gradient-to-br from-purple-500/[0.03] to-pink-500/[0.01] border border-white/[0.15] max-w-2xl w-full backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">
                      Core Benchmarks
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["Innovation", "Precision", "Excellence", "Commitment", "Impact"].map(
                        (value, index) => (
                          <motion.span
                            key={value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.45 + index * 0.08 }}
                            className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.16] text-xs font-semibold text-white/70 hover:border-purple-500/40 hover:text-white transition-all duration-300 cursor-default select-none shadow-sm"
                          >
                            {value}
                          </motion.span>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>

              </div>
            </section>
          </StickyPanel>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 5: WHY WE BUILD (Typographical Statement with Breathing Glow)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <StickyPanel zIndex={60}>
            <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 md:px-16 flex flex-col items-center text-center justify-center">

              {/* Pulsing deep purple background nebula */}
              <motion.div
                className="absolute w-[600px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.015) 50%, transparent 80%)",
                  filter: "blur(90px)",
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 0.95, 0.7],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 mb-8">
                Why We Build
              </span>

              <MagicText
                text="We believe the internet is the ultimate canvas for human connection. Every platform we deploy is engineered to elevate standard interactions into moments of high sensory fidelity and lasting premium impressions."
                className="max-w-4xl mx-auto flex flex-wrap justify-center text-center select-text gap-x-[0.3em] gap-y-[0.1em]"
                wordClassName="text-white select-text"
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "clamp(24px, 4vw, 42px)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  textShadow: "0 0 30px rgba(255,255,255,0.01)"
                }}
              />

            </section>
          </StickyPanel>



          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 7: REDESIGNED STUDIO PRINCIPLES (Spacious 3-Column Outline Grid with Hover Spotlights)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <StickyPanel zIndex={70} noFadeOut>
            <section className="relative w-full py-20 sm:py-24 md:py-28 px-6 sm:px-12 md:px-16 flex flex-col items-center bg-[#07070a] overflow-hidden">
              
              {/* Header Block */}
              <div className="flex flex-col items-center text-center justify-center mb-20 gap-4 max-w-2xl">
                <div className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.01] px-3.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Core Genesis
                  </span>
                </div>
                <h2
                  className="text-white font-semibold text-4xl sm:text-5xl leading-snug tracking-tight mt-2"
                  style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
                >
                  Studio{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                    Principles.
                  </span>
                </h2>
                <p className="text-white/40 text-xs sm:text-[14px] leading-relaxed max-w-md font-normal mt-2 tracking-wide">
                  The architectural benchmarks that govern every line of code and visual vector we deploy.
                </p>
              </div>

              {/* Spacious 3-Column Glass Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {[
                  { icon: <Sparkles className="h-6 w-6" />, number: "01", name: "Innovations", desc: "We push boundaries with cutting-edge technology and creative solutions that set your brand apart in the digital landscape." },
                  { icon: <Target className="h-6 w-6" />, number: "02", name: "Results Driven", desc: "Every strategy is crafted with measurable outcomes in mind, ensuring your investment delivers tangible business growth." },
                  { icon: <Users className="h-6 w-6" />, number: "03", name: "Client Centric", desc: "Your vision guides our process. We collaborate closely to understand your goals and exceed your expectations." },
                  { icon: <TrendingUp className="h-6 w-6" />, number: "04", name: "Scalable Solutions", desc: "We build for tomorrow, creating flexible systems that grow with your business and adapt to market changes." },
                  { icon: <Zap className="h-6 w-6" />, number: "05", name: "Speed & Efficiency", desc: "Time is valuable. We deliver high-quality solutions with agile methodologies that keep your projects on track." },
                  { icon: <Award className="h-6 w-6" />, number: "06", name: "Excellence Always", desc: "Quality is non-negotiable. From design to deployment, we maintain the highest standards in every detail." },
                ].map((item, idx) => {
                  const isEnergized = activeCardIndex === idx;

                  return (
                    <div
                      key={item.number}
                      onClick={() => setActiveCardIndex(activeCardIndex === idx ? null : idx)}
                      className={`group relative overflow-hidden rounded-[1.75rem] border transition-all duration-500 ease-out cursor-pointer p-[1.2px] select-none ${isEnergized
                        ? "border-purple-500/55 bg-[#0d0d16]/75 shadow-[0_0_35px_rgba(168,85,247,0.18)] scale-[1.015] -translate-y-1"
                        : "border-white/[0.16] bg-[#07070a]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:scale-[1.01] hover:-translate-y-0.5 hover:border-purple-500/40"
                        }`}
                    >
                      {/* Atmospheric Glow behind card */}
                      <div
                        className={`absolute inset-0 rounded-[1.75rem] transition-all duration-500 pointer-events-none -z-10 blur-xl ${isEnergized
                          ? "opacity-90 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
                          : "opacity-0 bg-purple-500/5"
                          }`}
                      />

                      {/* Spotlight reflection */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isEnergized ? "opacity-100" : "opacity-0 group-hover:opacity-75"
                          }`}
                        style={{
                          background: "radial-gradient(180px circle at 50% 50%, rgba(168, 85, 247, 0.06) 0%, rgba(236, 72, 153, 0.02) 50%, transparent 100%)"
                        }}
                      />

                      {/* Glass Body with spacious padding */}
                      <div
                        className={`relative p-8 sm:p-10 min-h-[240px] transition-all duration-500 ease-out z-10 flex flex-col justify-between ${isEnergized ? "backdrop-blur-3xl bg-[#09090f]/85" : "backdrop-blur-xl bg-[#060609]/75"
                          }`}
                      >
                        <div className="flex flex-col items-start gap-5">
                          {/* Animated Icon Box */}
                          <div className={`p-3 rounded-xl transition-all duration-300 ${isEnergized ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-white/[0.04] text-purple-400 group-hover:bg-purple-500/10 group-hover:text-white"}`}>
                            {item.icon}
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[9px] text-purple-400/90 tracking-[0.25em] font-semibold">
                              {item.number} {item.name.toUpperCase()}
                            </span>
                            
                            <h3
                              className={`text-[20px] sm:text-[22px] font-semibold tracking-tight transition-colors duration-300 ${isEnergized ? "text-purple-300" : "text-white"}`}
                              style={{ fontFamily: "Satoshi, sans-serif" }}
                            >
                              {item.name}
                            </h3>
                            
                            <p
                              className={`text-xs sm:text-[13px] leading-relaxed font-normal mt-2 tracking-wide transition-colors duration-300 ${isEnergized ? "text-white/70" : "text-white/40"}`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-20 text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.16] shadow-sm">
                  <Award className="h-4.5 w-4.5 text-purple-400" />
                  <span className="text-[11px] font-medium tracking-wider text-white/70 uppercase">
                    Trusted by 500+ businesses worldwide
                  </span>
                </div>
              </motion.div>

            </section>
          </StickyPanel>


        </div>
      </AppContainer>
    </div>
  );
}
