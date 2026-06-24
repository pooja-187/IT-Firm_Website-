"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  Activity, 
  Smartphone, 
  Layers, 
  Check, 
  Search, 
  Globe,
  Sliders,
  DollarSign,
  Briefcase,
  Users,
  ShoppingCart,
  Eye,
  Calendar,
  Heart,
  Plus
} from "lucide-react";

// CountUp micro-component for counting up figures in metrics cards
const CountUp = ({ value, prefix = "", suffix = "", duration = 2.5 }: { value: number; prefix?: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = Math.floor(value * 0.75);
    const end = value;
    if (start === end) return;
    
    const totalMiliseconds = duration * 1000;
    const intervalTime = 16; // ~60fps
    const totalSteps = totalMiliseconds / intervalTime;
    const increment = (end - start) / totalSteps;

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export default function EcosystemShowcase() {
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse mapping for 3D Parallax Drift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax layers transform mapping
  const layer1X = useTransform(smoothMouseX, (x) => x * 0.8);
  const layer1Y = useTransform(smoothMouseY, (y) => y * 0.8);
  const layer2X = useTransform(smoothMouseX, (x) => x * -1.2);
  const layer2Y = useTransform(smoothMouseY, (y) => y * -1.2);
  const layer3X = useTransform(smoothMouseX, (x) => x * 1.6);
  const layer3Y = useTransform(smoothMouseY, (y) => y * 1.6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % 7);
    }, 9000); // 9 seconds per case study scene
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25; // range roughly -15 to 15
    const y = (e.clientY - rect.top - rect.height / 2) / 25; // range roughly -15 to 15
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const sceneLabels = [
    "01 / SaaS Web",
    "02 / Dashboard",
    "03 / Food iOS",
    "04 / MedTech",
    "05 / Lifestyle",
    "06 / E-Comm",
    "07 / CRM Hub"
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[30rem] md:min-h-[42rem] bg-black rounded-[36px] overflow-hidden border border-white/[0.08] flex flex-col justify-between p-4 md:p-8 select-none group/ecosystem shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_24px_60px_rgba(0,0,0,0.8)]"
    >
      {/* DEEP AMBIENT GLOW BACKDROP */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute -top-[10%] -left-[10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
            filter: "blur(70px)"
          }}
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-[10%] -right-[10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
          animate={{
            scale: [1.08, 0.92, 1.08],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* TOP METADATA BAR */}
      <div className="relative w-full flex items-center justify-between z-10 text-[9px] font-sans tracking-[0.2em] text-white/30 uppercase border-b border-white/[0.04] pb-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
          <span>Case Study Showcase</span>
        </div>
        <div className="hidden sm:block font-medium text-white/40">
          MANZIO PRODUCTS DECK
        </div>
        <div>
          <span>SYSTEM v2.5 // LIVE</span>
        </div>
      </div>

      {/* GRAPHIC CANVAS VIEWPORT */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden py-2 z-10">
        <AnimatePresence mode="wait">
          
          {/* SCENE 1: SaaS landing page with auto-gliding mouse */}
          {currentScene === 0 && (
            <motion.div
              key="scene-saas-web"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              {/* Minimal light browser mock */}
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-full md:w-[92%] bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-2xl relative text-zinc-900"
              >
                {/* Browser Title Bar */}
                <div className="w-full bg-[#f4f4f5] border-b border-zinc-200 py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="w-1/2 bg-white border border-zinc-200 py-0.5 rounded-md text-[9px] text-zinc-400 text-center font-sans tracking-wide truncate">
                    linear.studio/home
                  </div>
                  <div className="w-6" />
                </div>

                {/* SaaS Landing Page Interior */}
                <div className="bg-white p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[18rem] md:min-h-[22rem] font-sans">
                  
                  {/* Subtle Grid backing */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                  {/* Top Pill badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-[9px] text-purple-600 font-bold uppercase tracking-wider mb-4">
                    <Globe className="w-3 h-3 text-purple-500 animate-spin" style={{ animationDuration: "12s" }} />
                    <span>Linear Integration Launch</span>
                  </div>

                  <h2 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight mb-4 max-w-xl text-zinc-950">
                    Constructing Software Products <br />
                    Real People Rely On.
                  </h2>

                  <p className="text-zinc-500 text-xs max-w-md mb-8 leading-relaxed">
                    We pair high-end visual design systems with optimized database structures to engineer fast, resilient, and beautiful SaaS systems for global enterprises.
                  </p>

                  {/* Primary CTA with animated state */}
                  <div className="flex items-center gap-4 relative">
                    <motion.span 
                      animate={{
                        backgroundColor: ["#18181b", "#7c3aed", "#18181b"],
                        boxShadow: ["0 0px 0px rgba(0,0,0,0)", "0 4px 16px rgba(124,58,237,0.3)", "0 0px 0px rgba(0,0,0,0)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="px-6 py-2.5 text-[10px] font-bold text-white bg-zinc-900 rounded-full uppercase tracking-wider shadow-lg pointer-events-none"
                    >
                      Initialize Sandbox
                    </motion.span>
                    <span className="px-5 py-2.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-full uppercase tracking-wider pointer-events-none">
                      Read Blueprint
                    </span>
                  </div>

                  {/* Animated Mock cursor gliding to primary button */}
                  <motion.div 
                    initial={{ x: 120, y: 150 }}
                    animate={{ x: -60, y: 12 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 4.5,
                      ease: "easeInOut",
                    }}
                    className="absolute pointer-events-none z-50 flex flex-col items-start gap-1"
                  >
                    <svg className="w-4 h-4 text-zinc-950 drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M 0,0 L 16,5 L 8.5,8.5 L 0,16 Z" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 2: Highly Detailed Light Customer Dashboard */}
          {currentScene === 1 && (
            <motion.div
              key="scene-dashboard-detail"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-full md:w-[90%] bg-zinc-50 border border-zinc-200 rounded-2xl p-4 md:p-6 shadow-2xl relative text-zinc-900 font-sans"
              >
                {/* Dashboard top header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/60">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">Internal Metrics</span>
                    <h3 className="text-sm font-bold text-zinc-900 mt-0.5">Astra Financial Center</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-600 text-[9px] rounded-md font-semibold">
                    <Activity className="w-3 h-3 text-purple-500 animate-pulse" />
                    <span>Real-time Live Sync</span>
                  </div>
                </div>

                {/* Dashboard metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">Monthly Recurring</span>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                      <CountUp value={48250} prefix="$" />
                    </h3>
                    <span className="text-[9px] text-emerald-600 font-semibold block mt-1">▲ +12% target yield</span>
                  </div>
                  <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">Active users</span>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                      <CountUp value={12840} suffix=" users" />
                    </h3>
                    <span className="text-[9px] text-emerald-600 font-semibold block mt-1">▲ 99.98% retention</span>
                  </div>
                  <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">API response time</span>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                      <CountUp value={8} suffix=" ms" />
                    </h3>
                    <span className="text-[9px] text-purple-600 font-semibold block mt-1">▲ Optimized query lines</span>
                  </div>
                </div>

                {/* Self-drawing line chart representation */}
                <div className="w-full h-32 md:h-36 bg-white border border-zinc-200 rounded-xl relative p-2 overflow-hidden flex items-end">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="lightPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path 
                      d="M 0,90 C 20,80 30,50 50,40 C 70,30 80,10 100,5 L 100,100 Z" 
                      fill="url(#lightPurpleGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    />
                    <motion.path 
                      d="M 0,90 C 20,80 30,50 50,40 C 70,30 80,10 100,5" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                  
                  <div className="absolute top-4 left-6 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    Annual yield scaling curve
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 3: Food Delivery Application (iOS Screen Mockup) */}
          {currentScene === 2 && (
            <motion.div
              key="scene-food-ios"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              {/* iPhone Mockup Frame */}
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-[16rem] md:w-[20rem] bg-zinc-950 border-4 border-zinc-800 rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden"
              >
                {/* iPhone Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-30" />
                
                {/* Embedded food delivery mockup image */}
                <div className="relative w-full aspect-[9/18] rounded-[2rem] overflow-hidden bg-white">
                  <Image
                    src="/projects/food_app_mockup.png"
                    alt="Food Delivery Application UI Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 30vw"
                    priority
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none z-20" />
                </div>
              </motion.div>

              {/* Floating review card */}
              <motion.div 
                style={{ x: layer2X, y: layer2Y }}
                className="absolute bottom-10 right-4 md:right-16 bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xl hidden sm:flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[7px] uppercase tracking-wider text-zinc-400 font-bold block">Mobile Checkout</span>
                  <span className="text-[10px] font-bold text-zinc-900 block mt-0.5">3.2k Monthly Orders</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 4: MedTech Patient Dashboard (Tablet Mockup) */}
          {currentScene === 3 && (
            <motion.div
              key="scene-medtech"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-[90%] md:w-[85%] bg-zinc-950 border-4 border-zinc-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden"
              >
                {/* Embedded healthcare image mockup */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/projects/healthcare_mockup.png"
                    alt="Clinical Medical Dashboard UI Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-20" />
                </div>
              </motion.div>

              {/* Floating diagnostic health stats card */}
              <motion.div 
                style={{ x: layer2X, y: layer2Y }}
                className="absolute top-8 left-4 md:left-12 bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xl hidden sm:flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <Heart className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[7px] uppercase tracking-wider text-zinc-400 font-bold block">MedTech Portal</span>
                  <span className="text-[10px] font-bold text-zinc-900 block mt-0.5">HIPAA Compliant Nodes</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 5: User Interacting with Product (Lifestyle Photo) */}
          {currentScene === 4 && (
            <motion.div
              key="scene-lifestyle"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-full md:w-[85%] bg-zinc-950 border-4 border-zinc-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden"
              >
                {/* Embedded lifestyle phone use image */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/projects/lifestyle_phone_use.png"
                    alt="Hand holding phone application lifestyle photo mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-20" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 6: Minimal Luxury E-commerce Experience */}
          {currentScene === 5 && (
            <motion.div
              key="scene-ecommerce"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-full md:w-[90%] bg-zinc-950 border-4 border-zinc-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden"
              >
                {/* Embedded luxury e-commerce catalog mockup */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/projects/ecommerce_mockup.png"
                    alt="Minimalist E-commerce product catalog UI Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-20" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 7: Enterprise CRM / Task Workspace */}
          {currentScene === 6 && (
            <motion.div
              key="scene-enterprise-crm"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl h-full flex items-center justify-center"
            >
              <motion.div 
                style={{ x: layer1X, y: layer1Y }}
                className="w-full md:w-[90%] bg-zinc-950 border-4 border-zinc-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden"
              >
                {/* Embedded enterprise Kanban dashboard mockup */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/projects/enterprise_crm.png"
                    alt="Enterprise Kanban CRM workspace UI Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-20" />
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM SCENE CONTROL NAVIGATION BAR */}
      <div className="relative w-full z-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.04] pt-5 gap-4">
        {/* Navigation tabs selector */}
        <div className="flex items-center gap-2 md:gap-3.5 order-2 sm:order-1 flex-wrap justify-center">
          {sceneLabels.map((label, idx) => {
            const isActive = currentScene === idx;
            return (
              <button
                key={label}
                onClick={() => setCurrentScene(idx)}
                className={`relative flex items-center justify-center p-1 font-sans text-[8px] uppercase tracking-widest font-bold transition-all duration-300 ${
                  isActive ? "text-purple-400" : "text-white/30 hover:text-white/60"
                }`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="activeRealSceneIndicator"
                    className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="hidden md:inline">{label}</span>
                <span className="inline md:hidden w-2 h-2 rounded-full border border-white/20 bg-white/5 active:bg-purple-500" />
              </button>
            );
          })}
        </div>

        {/* Cinematic slogan indicator */}
        <div className="flex items-center gap-1.5 order-1 sm:order-2">
          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/50 bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-1">
            DESIGN + ENGINEERING + REAL PRODUCTS
          </span>
        </div>
      </div>
    </div>
  );
}
