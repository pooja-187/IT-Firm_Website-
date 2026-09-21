"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, animate, useMotionValue, useSpring, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Phone, Search, Layout, Code2, Rocket, TrendingUp, Sparkles } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";
import { HeroBackgroundVideo } from "@/components/ui/HeroBackgroundVideo";
import { StarBackgroundVideo } from "@/components/ui/StarBackgroundVideo";
import { apiService } from "@/utils/api";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic Below-the-fold Code Splitting
const ProjectShowcase = dynamic(() => import("@/components/ui/ProjectShowcase").then((mod) => mod.ProjectShowcase), { ssr: false });
const WhyChooseManzio = dynamic(() => import("@/components/ui/WhyChooseManzio").then((mod) => mod.WhyChooseManzio), { ssr: false });
const FAQSection = dynamic(() => import("@/components/ui/FAQSection").then((mod) => mod.FAQSection), { ssr: false });
const BlogSection = dynamic(() => import("@/components/ui/BlogSection").then((mod) => mod.BlogSection), { ssr: false });
const LaunchConversation = dynamic(() => import("@/components/ui/LaunchConversation").then((mod) => mod.LaunchConversation), { ssr: false });

const STATS = [
  { number: 8,   suffix: "+",  label: "Years Building" },
  { number: 350, suffix: "+",  label: "Projects Shipped"  },
  { number: 250, suffix: "+",  label: "Global Clients"   },
  { number: 24,  suffix: "/7", label: "Active Support"     },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description: "Research · Goals · Market",
    details: "In-depth discovery session to map your business objectives, target audience, and competitive landscape.",
    icon: Search,
    timelineTitle: "Free call",
    timelineDesc: "30 min",
    journeyLabel: "Week 0",
    journeyPhase: "Discovery",
    journeyPercent: 5,
  },
  {
    step: "02",
    title: "Design",
    description: "UI · UX · Wireframe",
    details: "Crafting modern, intuitive user interfaces and wireframes with extreme visual hierarchy and layout precision.",
    icon: Layout,
    timelineTitle: "Proposal",
    timelineDesc: "48 hrs",
    journeyLabel: "Week 1",
    journeyPhase: "Design",
    journeyPercent: 28,
  },
  {
    step: "03",
    title: "Develop",
    description: "Build · Test · Iterate",
    details: "Engineering clean, production-ready code with responsive layouts, fast rendering engines, and robust performance.",
    icon: Code2,
    timelineTitle: "Sprint",
    timelineDesc: "Week 1",
    journeyLabel: "Month 1",
    journeyPhase: "Live product",
    journeyPercent: 50,
  },
  {
    step: "04",
    title: "Launch",
    description: "Deploy · Optimise · Go Live",
    details: "Deploying your application using modern cloud pipelines, optimizing speed, SEO, and global delivery systems.",
    icon: Rocket,
    timelineTitle: "Live",
    timelineDesc: "Month 1",
    journeyLabel: "Month 3",
    journeyPhase: "Scale up",
    journeyPercent: 73,
  },
  {
    step: "05",
    title: "Grow",
    description: "Scale · Track · Compound",
    details: "Continuous performance scaling, user experience auditing, analytics tracking, and compounding long-term growth.",
    icon: TrendingUp,
    timelineTitle: "Compound",
    timelineDesc: "Month 3+",
    journeyLabel: "Month 6+",
    journeyPhase: "Full growth",
    journeyPercent: 95,
  },
];

const SERVICES = [
  {
    number: "01",
    title: "Software Development",
    heading: "Engineering Excellence",
    description: "Building scalable, high-performance digital products engineered for speed, reliability, and future growth.",
    glowColor: "rgba(139,92,246,0.07)",
  },
  {
    number: "02",
    title: "UI/UX Designing",
    heading: "Design that Converts",
    description: "Crafting intuitive user experiences and visually refined interfaces that elevate modern digital products.",
    glowColor: "rgba(236,72,153,0.07)",
  },
  {
    number: "03",
    title: "Web Development",
    heading: "Built for the Web",
    description: "Creating responsive, immersive, and conversion-focused websites with premium frontend experiences.",
    glowColor: "rgba(59,130,246,0.07)",
  },
  {
    number: "04",
    title: "Digital Marketing",
    heading: "Growth at Scale",
    description: "Helping brands grow through strategic campaigns, performance marketing, and cinematic digital storytelling.",
    glowColor: "rgba(16,185,129,0.07)",
  },
  {
    number: "05",
    title: "Branding",
    heading: "Identity that Endures",
    description: "Designing memorable brand identities that create trust, recognition, and lasting market impact.",
    glowColor: "rgba(245,158,11,0.07)",
  },
];



const CLIENTS = [
  "Travinno",
  "Mangalam Travel and Tours",
  "Mangalam Holidays",
  "Open Visas",
  "Laundremaison",
  "Hotel Passion",
  "Open Nurses",
  "Fazo",
  "Fortune Dentals",
  "UKnowTrip",
  "Hack The Skill",
  "Eucalia Glamps"
];

function AnimatedNumber({ value, delayIndex }: { value: number; delayIndex: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "50px" });

  useEffect(() => {
    if (inView) {
      const delayTimeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1], // cinematic cubic-bezier
          onUpdate(v) {
            if (ref.current) {
              ref.current.textContent = Math.round(v).toString();
            }
          },
        });
        return () => controls.stop();
      }, delayIndex * 400);

      return () => clearTimeout(delayTimeout);
    }
  }, [inView, value, delayIndex]);

  return <span ref={ref}>0</span>;
}

interface StatsGlowTrailProps {
  parentRef: React.RefObject<HTMLElement | null>;
  inView: boolean;
}

function StatsGlowTrail({ parentRef, inView }: StatsGlowTrailProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch =
        (typeof window !== "undefined" &&
          (window.matchMedia("(pointer: coarse)").matches ||
           ("ontouchstart" in window || navigator.maxTouchPoints > 0))) ||
        window.innerWidth < 768;
      setIsTouchDevice(isTouch);
    };
    checkTouch();
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(0);

  // Smooth lazy springs for a trailing lag behind the cursor
  const springConfig = { stiffness: 45, damping: 20, mass: 0.9 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothScaleX = useSpring(scaleX, { stiffness: 85, damping: 14 });
  const smoothScaleY = useSpring(scaleY, { stiffness: 85, damping: 14 });
  const smoothRotate = useSpring(rotate, { stiffness: 120, damping: 18 });
  const smoothOpacity = useSpring(opacity, { stiffness: 90, damping: 20 });

  const lastPos = useRef({ x: 0, y: 0, time: 0 });
  const timeoutRef = useRef<any>(null);
  const sparklesRef = useRef<any[]>([]);
  const sparkleIdRef = useRef(0);

  useEffect(() => {
    if (!inView || isTouchDevice) return; // Completely freeze loop when out of viewport or on touch devices!

    const parent = parentRef.current;
    const canvas = canvasRef.current;
    if (!parent || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number | null = null;
    let width = parent.clientWidth;
    let height = parent.clientHeight;
    
    // Scale canvas backings according to device pixel ratio for super crisp glitter circles
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const handleResize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Main particle update and draw loop (EVENT-DRIVEN: sleeps when sparkles array is empty)
    const updateAndDrawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      const sparkles = sparklesRef.current;
      if (sparkles.length === 0) {
        animFrameId = null;
        return;
      }

      const now = Date.now();

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.life += 1.2; // increment frames lived

        if (p.life >= p.maxLife) {
          sparkles.splice(i, 1);
          continue;
        }

        // Apply friction and speed vectors
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.max(0, (1 - lifeRatio) * p.baseAlpha);
        
        // Shimmer scaling effect
        const shimmer = 0.72 + 0.28 * Math.sin(now * p.shimmerSpeed + p.id);
        const currentAlpha = Math.min(1.0, alpha * shimmer);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("ALPHA", currentAlpha.toString());
        ctx.fill();
      }

      if (sparkles.length > 0) {
        animFrameId = requestAnimationFrame(updateAndDrawParticles);
      } else {
        animFrameId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - lastPos.current.x;
      const dy = currentY - lastPos.current.y;
      const dt = e.timeStamp - lastPos.current.time;

      if (dt > 0) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = distance / dt; // pixels per ms

        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);

        // Calculate dynamic stretches for speed streaks
        const stretch = Math.min(3.2, 1 + speed * 0.62);
        const squash = Math.max(0.55, 1 - speed * 0.2);

        scaleX.set(stretch);
        scaleY.set(squash);
        rotate.set(angleDeg);

        // Set opacity: brighter on fast sweeps
        opacity.set(Math.min(0.85, 0.42 + speed * 0.22));

        // Spawn holographic sparkles on cursor movement
        const emitCount = Math.min(4, Math.floor(speed * 2.5));
        if (emitCount > 0) {
          const colors = [
            "rgba(168, 85, 247, ALPHA)", // bright purple
            "rgba(236, 72, 153, ALPHA)", // bright magenta
            "rgba(255, 255, 255, ALPHA)", // silver/glitter
            "rgba(192, 132, 252, ALPHA)", // light violet
          ];
          const glowColors = [
            "rgba(168, 85, 247, 0.6)",
            "rgba(236, 72, 153, 0.6)",
            "rgba(255, 255, 255, 0.8)",
            "rgba(192, 132, 252, 0.6)",
          ];

          for (let k = 0; k < emitCount; k++) {
            const randIdx = Math.floor(Math.random() * colors.length);
            const size = 0.8 + Math.random() * 2.2;
            
            // Spray particles outwards slightly behind the cursor direction
            const angle = Math.random() * Math.PI * 2;
            const force = 0.15 + Math.random() * 1.6;
            
            sparkleIdRef.current += 1;
            sparklesRef.current.push({
              id: sparkleIdRef.current,
              x: currentX - (dx * 0.3) + (Math.random() * 8 - 4),
              y: currentY - (dy * 0.3) + (Math.random() * 8 - 4),
              vx: (Math.cos(angle) * force) - (dx * 0.08), // trail velocity lag
              vy: (Math.sin(angle) * force) - (dy * 0.08),
              size,
              baseAlpha: 0.45 + Math.random() * 0.45,
              life: 0,
              maxLife: 28 + Math.random() * 32, // particle frame lifespan
              shimmerSpeed: 0.01 + Math.random() * 0.03,
              color: colors[randIdx],
              glowColor: glowColors[randIdx],
            });
          }

          if (animFrameId === null) {
            animFrameId = requestAnimationFrame(updateAndDrawParticles);
          }
        }
      }

      x.set(currentX);
      y.set(currentY);

      lastPos.current = { x: currentX, y: currentY, time: e.timeStamp };

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        scaleX.set(1);
        scaleY.set(1);
        opacity.set(0);
      }, 150);
    };

    const handleMouseLeave = () => {
      opacity.set(0);
      scaleX.set(1);
      scaleY.set(1);
    };

    parent.addEventListener("mousemove", handleMouseMove, { passive: true });
    parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [parentRef, x, y, scaleX, scaleY, rotate, opacity, inView, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Main Luminous Blurred Bloom Blob */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          rotate: smoothRotate,
          scaleX: smoothScaleX,
          scaleY: smoothScaleY,
          translateX: "-50%",
          translateY: "-50%",
          width: "380px",
          height: "260px",
          borderRadius: "50%",
          // Brighter, multi-stop radial gradient with magenta edge highlight for bloom bloom bloom
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.28) 0%, rgba(217, 70, 239, 0.14) 28%, rgba(139, 92, 246, 0.03) 55%, rgba(236, 72, 153, 0.01) 75%, transparent 90%)",
          filter: "blur(48px)", // soft, premium atmospheric glow dispersion
          opacity: smoothOpacity,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* 2. Glitter Sparkle Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 6, // slightly in front of main bloom
        }}
      />
    </>
  );
}

function ClientCard({ client }: { client: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }
        }
      }}
      className="group relative flex items-stretch justify-stretch min-h-[90px] sm:min-h-[105px] rounded-xl p-[1.5px] overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 bg-white/[0.08] hover:bg-transparent hover:shadow-[0_12px_36px_rgba(91,46,255,0.06)]"
    >
      <AnimatePresence>
        {isHovered && (
          <>
            {/* ── 1. Soft Ambient Rotating Glow Aura ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] aspect-square pointer-events-none rounded-full card-border-tracer"
              style={{
                background: "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)",
                filter: "blur(14px)",
              }}
            />

            {/* ── 2. Sharp Rotating Outline Tracer ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] aspect-square pointer-events-none rounded-full card-border-tracer"
              style={{
                background: "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)",
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Inner content wrapper ── */}
      <div className="relative w-full h-full rounded-[11px] bg-gradient-to-br from-[#0b0b0e] to-[#060608] flex items-center justify-center px-6 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-500 z-10">
        {/* Subtle inner purple ambient glow on hover */}
        <div
          className="absolute inset-0 rounded-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(91,46,255,0.05) 0%, transparent 80%)",
          }}
        />

        {client.logoUrl ? (
          <div className="relative w-full h-8 flex items-center justify-center select-none z-10">
            <Image
              src={client.logoUrl}
              alt={client.name}
              width={120}
              height={32}
              unoptimized
              className="object-contain max-h-8 filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-500 ease-out"
              sizes="(max-width: 768px) 120px, 150px"
            />
          </div>
        ) : (
          <span className="relative z-10 text-center tracking-[0.14em] text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-white/65 group-hover:text-white transition-colors duration-500 font-sans">
            {client.name.toUpperCase()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [stats, setStats] = useState(STATS);
  const [services, setServices] = useState(SERVICES);
  const [clients, setClients] = useState<any[]>(CLIENTS.map((c, idx) => ({ id: idx, name: c })));
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTouch =
        (typeof window !== "undefined" &&
          (window.matchMedia("(pointer: coarse)").matches ||
           ("ontouchstart" in window || navigator.maxTouchPoints > 0))) ||
        window.innerWidth < 768;
      setIsTouchDevice(isTouch);
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track active scrolling using a ref (zero React state updates on scroll, no root re-renders)
  const isUserScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiService.getStatistics();
        if (statsData && statsData.length > 0) {
          setStats(statsData);
        }
      } catch (err) {
        console.error("Failed to load statistics, falling back to mock data", err);
      }

      try {
        const servicesData = await apiService.getServices();
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }
      } catch (err) {
        console.error("Failed to load services, falling back to mock data", err);
      }

      try {
        const partnersData = await apiService.getPartners();
        if (partnersData && partnersData.length > 0) {
          const activePartners = partnersData.filter((p: any) => p.status === "active");
          if (activePartners.length > 0) {
            setClients(activePartners);
          }
        }
      } catch (err) {
        console.error("Failed to load partners, falling back to mock data", err);
      }
    }
    loadData();
  }, []);

  const [activeStep, setActiveStep] = useState<number | null>(0); // Initialize with first step active by default
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  // Mouse tracking motion values for the spotlight effect in the Development Process section
  const processContainerRef = useRef<HTMLDivElement>(null);
  const isProcessInView = useInView(processContainerRef, { margin: "200px 0px" });
  const processMouseX = useMotionValue(0);
  const processMouseY = useMotionValue(0);
  
  // Springs for buttery smooth mouse interpolation
  const processMouseXSpring = useSpring(processMouseX, { stiffness: 120, damping: 20 });
  const processMouseYSpring = useSpring(processMouseY, { stiffness: 120, damping: 20 });
  const [isProcessHovered, setIsProcessHovered] = useState(false);

  // Autoplay progression for the interactive process journey with custom dynamic timing
  useEffect(() => {
    // Autoplay is active only when in viewport and not hovered
    if (!isProcessInView || hoveredCardIdx !== null) return;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (document.hidden) return;
      // On touch devices, pause autoplay step transition while the user is actively scrolling
      if (isUserScrollingRef.current) {
        timeoutId = setTimeout(tick, 400);
        return;
      }
      setActiveStep((prev) => {
        const nextStep = prev === null ? 0 : (prev + 1) % 5;
        return nextStep;
      });
    };

    // GROW (index 4) pauses for 3 seconds before resetting to DISCOVER (index 0).
    // All other steps pause for 2 seconds before proceeding.
    const delay = activeStep === 4 ? 3000 : 2000;
    timeoutId = setTimeout(tick, delay);

    return () => clearTimeout(timeoutId);
  }, [isProcessInView, hoveredCardIdx, activeStep]);

  const handleProcessMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!processContainerRef.current) return;
    const rect = processContainerRef.current.getBoundingClientRect();
    processMouseX.set(e.clientX - rect.left);
    processMouseY.set(e.clientY - rect.top);
  };

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    setHoveredCardIdx(idx);
    const rect = e.currentTarget.getBoundingClientRect();
    (e.currentTarget as any)._cardRect = rect;
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    let rect = (e.currentTarget as any)._cardRect;
    if (!rect) {
      rect = e.currentTarget.getBoundingClientRect();
      (e.currentTarget as any)._cardRect = rect;
    }
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCardIdx(null);
    delete (e.currentTarget as any)._cardRect;
  };

  // Top-level unconditional definition of motion templates to strictly satisfy the Rules of Hooks
  const processBgTemplate = useMotionTemplate`radial-gradient(450px circle at ${processMouseXSpring}px ${processMouseYSpring}px, rgba(168, 85, 247, 0.07), rgba(236, 72, 153, 0.015) 40%, transparent 70%)`;
  
  const processBorderTemplate = useMotionTemplate`radial-gradient(450px circle at ${processMouseXSpring}px ${processMouseYSpring}px, black, transparent)`;

  // ─── Cinematic Services: sticky scroll tracking ───────────────────────
  const servicesRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  const statsSectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);

  // Viewport tracking variables:
  const isStatsInView = useInView(statsSectionRef, { once: false, margin: "200px" });
  const isServicesVisible = useInView(servicesRef, { once: false, margin: "0px" });

  // Track scroll progress of stats section exiting the viewport
  const { scrollYProgress: statsExitScrollYProgress } = useScroll({
    target: statsSectionRef,
    offset: ["end end", "end start"],
  });

  // Fade out stats section as it scrolls out of viewport down to the process section
  const statsOpacity = useTransform(statsExitScrollYProgress, [0.3, 0.95], [1, 0]);

  // Track scroll progress of services section entering the viewport
  const { scrollYProgress: servicesScrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "start start"],
  });

  // Smoothly interpolate opacity for the previous (process) section: 1 -> 0
  const processOpacity = useTransform(servicesScrollYProgress, [0, 0.75], [1, 0]);

  // Smoothly interpolate opacity for the services section itself: 0 -> 1
  const servicesOpacity = useTransform(servicesScrollYProgress, [0.25, 1], [0, 1]);

  // Track scroll progress of services section exiting the viewport
  const { scrollYProgress: servicesExitScrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["end end", "end start"],
  });

  // Smoothly interpolate exit opacity for the services section: 1 -> 0 as clients section becomes visible
  const servicesExitOpacity = useTransform(servicesExitScrollYProgress, [0, 0.6], [1, 0]);

  // Track sticky scroll progress of the services section from when it hits the top to when it exits the bottom
  const { scrollYProgress: servicesStickyScrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start start", "end end"],
  });

  // Combine both entering and exiting opacities to dynamically fade in and fade out
  const combinedOpacity = useTransform(
    [servicesOpacity, servicesExitOpacity],
    ([o1, o2]: number[]) => o1 * o2
  );

  // ─── Cinematic Showcase: scroll-linked transitions ─────────────────────
  const clientsRef = useRef<HTMLElement>(null);
  
  // Track scroll progress of clients section exiting the viewport
  const { scrollYProgress: clientsExitScrollYProgress } = useScroll({
    target: clientsRef,
    offset: ["end end", "end start"],
  });

  // Clients fade out and blur out as they scroll away
  const clientsOpacity = useTransform(clientsExitScrollYProgress, [0.35, 0.65, 0.88, 1.0], [1, 0.9, 0.4, 0]);
  const clientsBlurVal = useTransform(clientsExitScrollYProgress, [0.35, 0.65, 0.88, 1.0], [0, 1.5, 4.0, 8]);
  const clientsBlur = useMotionTemplate`blur(${clientsBlurVal}px)`;

  // Optimized scroll progress change listener eliminating all requestAnimationFrame measuring loops
  useEffect(() => {
    const unsubscribe = servicesStickyScrollYProgress.on("change", (progress) => {
      let index = Math.floor(progress * 5);
      index = Math.min(4, Math.max(0, index));
      setActiveService((prev) => (prev === index ? prev : index));
    });
    return () => unsubscribe();
  }, [servicesStickyScrollYProgress]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 60, damping: 18, mass: 0.8 },
    },
  } as const;

  return (
    <>
      {/* HERO SECTION */}
      {/* Section with fullscreen solid black background, subtle readability overlay, top vignette fade, and vertically centered hero content */}
      <section id="home" className="relative min-h-[100svh] md:min-h-screen w-full flex flex-col items-center justify-center select-none overflow-hidden">

        {/* HERO BACKGROUND VIDEO / POSTER (Controlled performance test) */}
        <HeroBackgroundVideo />

        {/* OVERLAYS */}
        {/* 2a. Base dimming readability mask - slightly darker on mobile for cinematic readability */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none select-none bg-black/55 sm:bg-black/45" 
        />
        {/* 2b. Smooth top fade blending behind the transparent navbar */}
        <div 
          className="absolute top-0 left-0 right-0 h-[280px] z-10 pointer-events-none select-none" 
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 18%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 100%)"
          }}
        />
        {/* 2c. Smooth bottom fade blending into the dark cinematic background */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[280px] z-10 pointer-events-none select-none" 
          style={{
            background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 18%, rgba(5,5,5,0.35) 40%, rgba(5,5,5,0) 100%)"
          }}
        />


        {/* CONTENT CONTAINER - pt shifted to prevent overlapping with floating navbar */}
        <AppContainer className="relative z-40 w-full pt-24 sm:pt-[12vh] pb-16 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center text-center px-6 sm:px-6"
          >

            {/* Sub-Header Badge */}
            <div
              className="mb-6 sm:mb-10 flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 md:px-5 md:py-2 backdrop-blur-md max-w-full overflow-hidden"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.22em] text-white/40 truncate text-center">
                {"Kerala’s Leading Software Builders"}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mb-6 sm:mb-8 md:mb-10 w-full max-w-[340px] sm:max-w-2xl md:max-w-[1100px] text-center text-balance"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.75rem, 5.2vw, 6.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 0 24px rgba(255,255,255,0.08), 0 0 80px rgba(180,120,255,0.08)",
              }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/80 block sm:inline">
                <span className="inline-block whitespace-nowrap">{"Kerala's "}</span>
                <span 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#d8b4fe] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_15px_rgba(168,85,247,0.25)] font-bold whitespace-nowrap"
                >
                  #1
                </span>
                <span className="inline-block whitespace-nowrap">{" UI/UX Design &"}</span>
              </span>
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/80 block sm:inline">
                <span className="inline-block whitespace-nowrap">{" Software Development"}</span>{" "}
                <span className="inline-block whitespace-nowrap">{"Studio"}</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mb-8 sm:mb-12 text-center font-normal px-4 max-w-[320px] sm:max-w-[640px] text-balance"
              style={{
                fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              We design, develop, and launch digital experiences that make an impact.
            </p>

            {/* CTA */}
            <div className="mb-2">
              <Link
                href="/chat"
                className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full px-5 py-2.5 text-[11px] sm:px-8 sm:py-3.5 sm:text-sm font-semibold text-white tracking-wider transition-all duration-500 bg-purple-600/25 hover:bg-purple-600/35 border border-purple-400/35 hover:border-purple-300/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(124,58,237,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                {/* Shiny Glass Reflection (Top Highlight) */}
                <span className="absolute inset-0 z-0 bg-gradient-to-b from-white/18 via-white/5 to-transparent pointer-events-none" />
                {/* Purple glow backdrop */}
                <span className="absolute inset-0 bg-brand-purple/30 rounded-full blur-md opacity-50 group-hover:opacity-95 transition-all duration-500 -z-10" />
                {/* Interactive glowing gradient overlay on hover */}
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Sliding Glass Sheen Effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  Talk with Assistant
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>

          </motion.div>
        </AppContainer>
      </section>

      {/* PREMIUM STATS STORYTELLING SECTION */}
      <section 
        ref={statsSectionRef}
        className="relative w-full pt-20 pb-16 sm:pt-28 sm:pb-22 bg-black z-30 overflow-hidden"
      >
        <motion.div style={{ opacity: statsOpacity }} className="w-full h-full">
          {/* Kinetic Purple Glow Trail Effect */}
          <StatsGlowTrail parentRef={statsSectionRef} inView={isStatsInView} />
        {/* Atmospheric Top-to-Bottom transition haze */}
        <div 
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none select-none z-10"
          style={{
            background: "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.8) 25%, rgba(5,5,5,0) 100%)"
          }}
        />

        {/* Atmospheric Bottom-to-Top transition haze */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none select-none z-10"
          style={{
            background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.8) 25%, rgba(5,5,5,0) 100%)"
          }}
        />

        {/* Subtle glowing violet/purple aura behind the stats panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none -z-10 android-stats-glow" />

        <AppContainer>
          {/* Centered Typography Heading */}
          <div className="text-center mb-16 md:mb-20 flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-3.5 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  Performance
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-center leading-[1.2] tracking-tight font-semibold max-w-3xl text-pretty mt-1"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "clamp(30px, 5vw, 52px)",
                fontWeight: 600,
                textShadow: "0 0 35px rgba(255,255,255,0.02)"
              }}
            >
              Crafted at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]">
                Scale
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/50 text-[13px] sm:text-[15px] leading-[1.6] max-w-lg font-normal tracking-wide mt-1"
            >
              Years of precision execution powering modern digital experiences.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.3, // sequential delay for children cards
                },
              },
            }}
            className="w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-0 max-w-[1100px] mx-auto w-full">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative flex flex-col items-center lg:px-6 w-full group"
                >
                  {/* Elegant vertical separator lines between stats on desktop (lg screen) */}
                  {index < stats.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                  )}

                  {/* Individual stat container with entry animations */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 55,
                          damping: 15,
                          mass: 1,
                        },
                      },
                    }}
                    className="flex flex-col items-center"
                  >
                    {/* Stat Number with live count-up */}
                    <div
                      className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/30 font-semibold tracking-tighter leading-none select-none flex items-baseline justify-center group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all duration-500"
                      style={{
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                        textShadow: "0 0 30px rgba(255,255,255,0.03), 0 0 80px rgba(139,92,246,0.03)",
                      }}
                    >
                      <AnimatedNumber value={stat.number} delayIndex={index} />
                      <span className="text-brand-purple font-semibold drop-shadow-[0_0_12px_rgba(139,92,246,0.3)] ml-0.5 select-none">
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Stat Label */}
                    <span className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-white/60 uppercase text-center group-hover:text-white/85 transition-colors duration-500">
                      {stat.label}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </AppContainer>
        </motion.div>
      </section>

      {/* PREMIUM OUR PROCESS SECTION */}
      <section
        ref={processSectionRef}
        className="relative w-full pt-16 pb-14 sm:pt-22 sm:pb-18 bg-black z-30 overflow-hidden"
      >
        <motion.div style={{ opacity: processOpacity }} className="w-full h-full">
        
        {/* Soft ambient violet corner glows */}
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple/2.5 blur-[130px] pointer-events-none -z-10 animate-pulse-slow android-process-glow-purple" />
        <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ec4899]/1.5 blur-[130px] pointer-events-none -z-10 android-process-glow-pink" />
        
        {/* Subtle radial center lighting mask */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none -z-10" />

        <AppContainer>
          <div className="w-full flex flex-col items-center text-center px-6 sm:px-12 mb-8">
            {/* Sub-Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-2 rounded-full border border-brand-purple/10 bg-brand-purple/[0.02] px-3.5 py-1 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Our Development Process
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mb-4 w-full max-w-2xl text-center text-balance font-semibold"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "clamp(1.5rem, 2.8vw, 2.3rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 0 30px rgba(255,255,255,0.01)",
              }}
            >
              From Concept to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]">
                Creation.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-xl text-center text-xs sm:text-[13px] leading-relaxed text-white/35"
            >
              A proven 5-step process to design and build digital products that are beautiful, scalable, and built for real-world business impact in Kerala and beyond.
            </motion.p>
          </div>

          {/* MAIN PROCESS CONTAINER CARD */}
          <motion.div
            ref={processContainerRef}
            onMouseMove={handleProcessMouseMove}
            onMouseEnter={() => setIsProcessHovered(true)}
            onMouseLeave={() => setIsProcessHovered(false)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
            className="w-full max-w-[1100px] mx-auto rounded-xl border border-white/10 bg-neutral-950/40 p-6 sm:p-8 backdrop-blur-2xl relative z-20 group overflow-hidden select-none shadow-[0_0_60px_-15px_rgba(139,92,246,0.14)]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }}
          >
            {/* Dynamic cursor-based spotlight glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-500 rounded-xl"
              style={{
                background: processBgTemplate,
                opacity: isProcessHovered ? 1 : 0
              }}
            />
            
            {/* Dynamic cursor-based border spotlight */}
            <motion.div
              className="absolute inset-0 pointer-events-none -z-10 rounded-xl border border-transparent transition-opacity duration-500"
              style={{
                WebkitMaskImage: processBorderTemplate,
                maskImage: processBorderTemplate,
                borderColor: "rgba(168, 85, 247, 0.25)",
                opacity: isProcessHovered ? 1 : 0
              }}
            />


            {/* Soft subtle purple gradients originating from the sides (edges) of the entire container box */}
            <div className="absolute inset-0 border border-brand-purple/[0.06] pointer-events-none rounded-xl z-0" />
            <div className="absolute inset-y-0 left-0 w-48 sm:w-64 bg-gradient-to-r from-brand-purple/[0.12] via-brand-purple/[0.03] to-transparent pointer-events-none rounded-l-xl z-0" />
            <div className="absolute inset-y-0 right-0 w-48 sm:w-64 bg-gradient-to-l from-brand-purple/[0.12] via-brand-purple/[0.03] to-transparent pointer-events-none rounded-r-xl z-0" />
            <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-brand-purple/[0.08] via-brand-purple/[0.02] to-transparent pointer-events-none rounded-t-xl z-0" />
            <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-brand-purple/[0.08] via-brand-purple/[0.02] to-transparent pointer-events-none rounded-b-xl z-0" />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />

            {/* Header row in container */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04] relative z-10">
              <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                CLIENT JOURNEY · OUR DEVELOPMENT PROCESS
              </span>
              <div className="flex items-center gap-1.5 text-[9.5px] font-semibold text-brand-purple uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Interactive Journey</span>
              </div>
            </div>

            {/* Step Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 mb-10 relative z-10">
              {PROCESS_STEPS.map((stepData, idx) => {
                const isActive = idx === activeStep;
                const isHovered = idx === hoveredCardIdx;
                const isAnyCardHovered = hoveredCardIdx !== null;
                const isHighlighted = isHovered || (!isAnyCardHovered && isActive);
                const isDimmed = isAnyCardHovered ? !isHovered : !isActive;
                
                return (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={(e) => handleCardMouseEnter(e, idx)}
                    onMouseLeave={handleCardMouseLeave}
                    onMouseMove={handleCardMouseMove}
                    animate={{
                      scale: isHovered ? 1.03 : isHighlighted ? 1.015 : 1.0,
                      y: isHovered ? -4 : isHighlighted ? -2 : 0,
                      opacity: isDimmed ? (isAnyCardHovered ? 0.45 : 0.6) : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className={`relative flex flex-col justify-center items-center rounded-md p-3.5 cursor-pointer overflow-hidden transition-all duration-300 border h-[90px] text-center select-none ${
                      isHovered 
                        ? 'bg-neutral-900/90 border-brand-purple/70 shadow-[0_8px_30px_rgba(139,92,246,0.25)]' 
                        : isActive 
                        ? 'bg-neutral-950/80 border-brand-purple shadow-[0_4px_20px_-4px_rgba(139,92,246,0.35)]' 
                        : 'bg-neutral-950/20 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Autoplay Soft Ambient Card Bloom (flows horizontally between steps) */}
                    {isActive && !isAnyCardHovered && (
                      <motion.div
                        layoutId={isTouchDevice ? undefined : "activeCardBloom"}
                        className="absolute inset-[-30px] pointer-events-none -z-20 rounded-md"
                        style={{
                          background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                      />
                    )}

                    {/* Soft transparent gradient inside active card */}
                    {isActive && !isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/[0.03] to-transparent pointer-events-none" />
                    )}

                    {/* Dynamic Card Spotlight Glow (follows mouse when hovered, centered when active in autoplay) */}
                    {(isHovered || (isActive && !isAnyCardHovered)) && (
                      <div 
                        className="absolute inset-0 pointer-events-none -z-10 mix-blend-screen transition-opacity duration-500"
                        style={{
                          background: isHovered
                            ? `radial-gradient(120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.05) 50%, transparent 100%)`
                            : `radial-gradient(150px circle at 50% 50%, rgba(168, 85, 247, 0.12), rgba(236, 72, 153, 0.03) 50%, transparent 100%)`
                        }}
                      />
                    )}
                    
                    <span className={`text-[8.5px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
                      isHovered || isActive ? 'text-brand-purple' : 'text-white/20'
                    }`}>
                      STEP {stepData.step}
                    </span>
                    
                    <h3 className={`text-[11.5px] sm:text-[12px] font-extrabold tracking-wider uppercase mt-1 transition-colors duration-300 ${
                      isHovered || isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {stepData.title}
                    </h3>
                    
                    {/* Description/sub-text (always present to preserve height/spacing but only visible/animated on active) */}
                    <div className="h-3.5 mt-1 overflow-hidden flex items-center justify-center">
                      {(isActive || isHovered) ? (
                        <motion.span 
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[8.5px] font-medium text-white/40 tracking-wider"
                        >
                          {stepData.description}
                        </motion.span>
                      ) : (
                        <span className="text-[8.5px] font-medium text-transparent tracking-wider select-none">
                          {stepData.description}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline Wrapper (Perfect Horizontal & Vertical Padding Symmetrical Alignment) */}
            <div className="relative px-8 sm:px-12 select-none z-10 hidden sm:block">
              
              {/* TIMELINE 1: PROCESS TIMELINE (Middle) */}
              <div className="relative w-full mb-12">
                {/* Horizontal Line stretching from col 1 center (10%) to col 5 center (90%) */}
                <div className="absolute top-1.5 left-[10%] right-[10%] h-[1px] bg-white/[0.08]" />
                



                {/* Grid matching the 5 card columns */}
                <div className="relative grid grid-cols-5">
                  {PROCESS_STEPS.map((stepData, idx) => {
                    const isActive = idx === activeStep;
                    const isHighlighted = idx === activeStep || idx === hoveredCardIdx;
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        onMouseEnter={() => setHoveredCardIdx(idx)}
                        onMouseLeave={() => setHoveredCardIdx(null)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        {/* Vertical Tick Crossing the Line (centered inside top-1.5) */}
                        <div className="h-3 relative flex items-center justify-center">
                          <div className={`w-[1px] h-3 transition-colors duration-305 ${
                            isHighlighted ? 'bg-brand-purple h-4 w-[1.5px]' : 'bg-white/20'
                          }`} />
                        </div>
                        
                        {/* Step Description Label below the Tick */}
                        <div className="mt-4 flex flex-col items-center text-center">
                          <span className={`text-[10px] sm:text-[10.5px] font-medium tracking-wide transition-colors duration-300 ${
                            isHighlighted ? 'text-white font-semibold' : 'text-white/35 group-hover:text-white/50'
                          }`}>
                            {stepData.timelineTitle} · {stepData.timelineDesc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TIMELINE 2: CLIENT JOURNEY TRACK (Bottom) */}
              <div className="relative w-full">
                
                {/* Horizontal Track stretching from col 1 center (10%) to col 5 center (90%) */}
                <div className="absolute top-1.5 left-[10%] right-[10%] h-[1px] bg-white/[0.08]" />

                {/* Grid matching the 5 card columns */}
                <div className="relative grid grid-cols-5">
                  {PROCESS_STEPS.map((stepData, idx) => {
                    const isActive = idx === activeStep;
                    const isHighlighted = idx === activeStep || idx === hoveredCardIdx;
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        onMouseEnter={() => setHoveredCardIdx(idx)}
                        onMouseLeave={() => setHoveredCardIdx(null)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        {/* Vertical Tick Crossing the Line (centered inside top-1.5) */}
                        <div className="h-3 relative flex items-center justify-center">
                          <div className={`w-[1px] h-3 transition-colors duration-305 ${
                            isHighlighted ? 'bg-brand-purple h-4 w-[1.5px]' : 'bg-white/20'
                          }`} />
                          
                          {/* Active Dot underneath/above the tick */}
                          {isHighlighted && (
                            <motion.div 
                              layoutId={isTouchDevice ? undefined : "activeOutcomeDot"}
                              className="absolute w-2 h-2 rounded-full bg-brand-purple border border-black shadow-[0_0_8px_rgba(139,92,246,0.6)] z-20"
                              style={{ top: '3px' }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </div>
                        
                        {/* Milestone Labels above the segmented progress bar */}
                        <div className="mt-4 flex flex-col items-center text-center">
                          <span className={`text-[9.5px] sm:text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                            isHighlighted ? 'text-white' : 'text-white/35 group-hover:text-white/50'
                          }`}>
                            {stepData.journeyLabel}
                          </span>
                          <span className={`text-[8.5px] uppercase tracking-wider mt-0.5 transition-colors duration-300 ${
                            isHighlighted ? 'text-brand-purple/80 font-semibold' : 'text-white/20'
                          }`}>
                            {stepData.journeyPhase}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SEGMENTED PROGRESS BAR - Aligned underneath with left label */}
                <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center gap-6">
                  {/* Left Label */}
                  <div className="flex flex-col shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#a855f7]/60">CLIENT OUTCOMES</span>
                    <span className="text-[9.5px] text-white/25">Interactive progress tracker</span>
                  </div>

                  {/* Segmented Progress Track */}
                  <div className="flex-grow grid grid-cols-5 gap-2 h-2.5">
                    {PROCESS_STEPS.map((step, idx) => {
                      const effectiveActiveIdx = hoveredCardIdx !== null ? hoveredCardIdx : activeStep;
                      const isPastOrActive = effectiveActiveIdx !== null && idx <= effectiveActiveIdx;
                      
                      // Highlight segments 4 and 5 in glowing gradients to represent growth compounding
                      const isGrowthSegment = idx >= 3; 

                      if (isGrowthSegment) {
                        return (
                          <div 
                            key={idx}
                            className={`h-full rounded-sm transition-all duration-700 relative overflow-hidden ${
                              isPastOrActive
                                ? 'bg-gradient-to-r from-brand-purple to-brand-pink opacity-100 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                                : 'bg-neutral-900 border border-white/5 opacity-30'
                            }`}
                          />
                        );
                      } else {
                        return (
                          <div 
                            key={idx}
                            className={`h-full rounded-sm transition-all duration-700 ${
                              isPastOrActive
                                ? 'bg-brand-purple/20 border border-brand-purple/40 shadow-[0_0_8px_rgba(124,58,237,0.15)]'
                                : 'bg-neutral-900 border border-white/5'
                            }`}
                          />
                        );
                      }
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom growth callout */}
            <div className="flex flex-col items-center justify-center mt-10 relative z-10">
              <span className="text-[9px] font-extrabold tracking-[0.35em] text-[#a855f7]/70 uppercase animate-pulse">
                COMPOUNDING STARTS HERE
              </span>
            </div>

          </motion.div>
        </AppContainer>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CINEMATIC SERVICES — Sticky Scroll Storytelling
          500vh scroll track · sticky viewport · 5 services
          ═══════════════════════════════════════════════════════ */}
      <div
        ref={servicesRef}
        id="services"
        className="relative w-full bg-black z-30"
        style={{ height: "300vh" }}
      >
        <div
          className="sticky top-0 w-full h-[100svh] overflow-hidden bg-black flex items-center justify-center"
        >
          <motion.div
            style={{ opacity: combinedOpacity }}
            className="relative w-full h-full flex items-center justify-center"
          >

            {/* ── Star Background Video / Poster (Controlled performance test) ──────────────── */}
            <StarBackgroundVideo />

            {/* ── Cinematic dark overlay (dims the video, keeps text readable) */}
            <div
              className="absolute inset-0 pointer-events-none select-none"
              style={{
                zIndex: 1,
                background: "rgba(0,0,0,0.62)",
              }}
            />

            {/* ── Subtle vignette edge darkening for cinematic framing ─── */}
            <div
              className="absolute inset-0 pointer-events-none select-none"
              style={{
                zIndex: 2,
                background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />

          {/* Ambient accent glow nebula — shifts color per service in center */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
            style={{
              zIndex: 3,
              background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${SERVICES[activeService]?.glowColor || "rgba(255,255,255,0.03)"} 0%, transparent 70%)`,
            }}
          />

          {/* ── Dark purple cinematic ambient glow — breathes slowly behind text on desktop, static feathered gradient on touch/mobile */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{
              zIndex: 4,
              ...(isTouchDevice
                ? {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }
                : {}),
            }}
            animate={
              isTouchDevice
                ? undefined
                : {
                    // Slow organic breathing: scale 1.0 → 1.18 → 1.0
                    scale: [1, 1.18, 1.05, 1.18, 1],
                    // Gentle positional drift: floats slightly in a loop
                    x: [0, 18, -12, 22, 0],
                    y: [0, -14, 20, -8, 0],
                    // Very subtle opacity breathing
                    opacity: [0.9, 1, 0.85, 1, 0.9],
                  }
            }
            transition={{
              duration: 18,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {/* Inner glow blob */}
            <div
              style={{
                width: isTouchDevice ? "380px" : "680px",
                height: isTouchDevice ? "280px" : "480px",
                borderRadius: "50%",
                background: isTouchDevice
                  ? "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.18) 0%, rgba(91,46,255,0.10) 25%, rgba(122,92,255,0.04) 50%, rgba(155,109,255,0.01) 75%, transparent 88%)"
                  : "radial-gradient(ellipse at 50% 50%, rgba(91,46,255,0.13) 0%, rgba(122,92,255,0.07) 38%, rgba(155,109,255,0.03) 62%, transparent 80%)",
                filter: isTouchDevice ? "none" : "blur(48px)",
                transform: isTouchDevice ? undefined : "translate(-50%, -50%)",
                position: isTouchDevice ? "relative" : "absolute",
                top: isTouchDevice ? undefined : "50%",
                left: isTouchDevice ? undefined : "50%",
              }}
            />
          </motion.div>

          {/* Cinematic Centered Typography Transition Flow */}
          <div className="relative w-full max-w-7xl mx-auto px-6 h-[400px] flex items-center justify-center text-center z-10">
            
            {services.map((service, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center px-4 select-none cursor-default transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeService === i 
                    ? "opacity-100 scale-100 blur-none pointer-events-auto z-10" 
                    : activeService > i 
                      ? "opacity-0 scale-105 blur-[8px] pointer-events-none" // scrolled past
                      : "opacity-0 scale-95 blur-[8px] pointer-events-none"  // not yet reached
                }`}
              >
                {/* Inner wrapper aligns title and description to the same left edge */}
                {/* On mobile: explicitly tightly bounded wrapper to force elegant text wrapping */}
                {/* On desktop: w-fit restores the original full-width alignment */}
                <div className="flex flex-col items-start w-[88vw] max-w-[340px] md:max-w-full md:w-fit">
                  <h2
                    className="text-white text-left leading-[1.05] tracking-tight font-semibold text-pretty"
                    style={{
                      fontFamily: "Satoshi, sans-serif",
                      // Increased minimum font to 48px to enforce a bold, editorial multi-line wrap on mobile
                      fontSize: "clamp(48px, 6.2vw, 84px)",
                      fontWeight: 600,
                    }}
                  >
                    {service.title}
                  </h2>

                  {/* On mobile: description takes full width of the tight 340px block */}
                  <div className="mt-8 md:mt-10 w-full md:max-w-[580px] flex flex-col items-start text-left">
                    <p className="text-white/70 text-[15px] sm:text-[15px] md:text-[16px] leading-[1.55] md:leading-[1.8] font-medium tracking-wide">
                      {service.description}
                    </p>

                    <Link href="/services" className="mt-6 md:mt-8 group flex items-center justify-start gap-2.5 bg-transparent border-none outline-none cursor-pointer">
                      <span className="text-white/70 font-semibold text-[13px] md:text-[14px] tracking-wide group-hover:text-white transition-colors duration-300">
                        Learn more
                      </span>
                      <span className="text-white/70 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 text-[15px]">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Interactive Progress Indicators (Pills) on the Right Edge */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (servicesRef.current) {
                    const sectionHeight = servicesRef.current.offsetHeight;
                    const viewportHeight = window.innerHeight;
                    const scrollTarget = servicesRef.current.offsetTop + (i * (sectionHeight - viewportHeight) / 4);
                    window.scrollTo({
                      top: scrollTarget,
                      behavior: "smooth"
                    });
                  }
                }}
                className="group relative flex items-center justify-end h-8 w-6 cursor-pointer focus:outline-none bg-transparent border-none"
                aria-label={`Scroll to ${services[i].title}`}
              >
                {/* Active indicator dot/pill */}
                <div
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: i === activeService ? "5px" : "3px",
                    height: i === activeService ? "22px" : "6px",
                    background: i === activeService ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)",
                    boxShadow: i === activeService ? "0 0 12px rgba(255,255,255,0.5)" : "none",
                  }}
                />
                {/* Hover label for UX premium detail */}
                <span className="absolute right-6 opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 text-[10px] font-mono tracking-widest text-white whitespace-nowrap hidden md:inline">
                  {services[i].title.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          {/* Fade-out to next section */}
          <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-20"
               style={{ background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PREMIUM CLIENTS SECTION — Luxury Minimalist Grid
          Staggered fade-up entry · rounded glassmorphism cards · subtle hover glows
          ═══════════════════════════════════════════════════════ */}
      <section ref={clientsRef} id="clients" className="relative w-full pt-10 pb-28 sm:pt-14 sm:pb-36 bg-black z-30 overflow-hidden">
        <motion.div style={{ opacity: clientsOpacity, filter: (isMobile || isTouchDevice) ? "none" : clientsBlur }} className="w-full">

        <div className="relative w-full max-w-6xl mx-auto px-6 z-10 text-center">
          {/* Subtle Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-3.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Trusted By
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-center leading-[1.25] md:leading-[1.18] font-semibold max-w-4xl mx-auto mb-20 tracking-tight text-pretty"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(24px, 4.2vw, 40px)",
              fontWeight: 600,
            }}
          >
            Helping ambitious brands scale through{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]">
              technology, strategy, and cinematic digital experiences.
            </span>
          </motion.h2>

          {/* Clients Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.04,
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full"
          >
            {clients.map((client, i) => (
              <ClientCard key={client.id || i} client={client} />
            ))}
          </motion.div>

          {/* "More Clients" CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 relative z-20 flex justify-center"
          >
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/25 hover:border-purple-500/50 text-white font-medium shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.22)] transition-all duration-300 group"
            >
              <span className="text-xs font-semibold tracking-widest uppercase font-sans">
                More Clients
              </span>
              <span className="text-[13px] group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </motion.div>
        </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PREMIUM SHOWCASE SECTION — Infinite Loop Showcase Wall
          Dual vertical scrolling columns · dark glassmorphism cards · cursor spotlights
          ═══════════════════════════════════════════════════════ */}
      <ProjectShowcase />

      {/* CINEMATIC INSIGHTS & JOURNAL SECTION */}
      <BlogSection />

      {/* ═══════════════════════════════════════════════════════
          VANGUARD COMPARISON SECTION — Why Choose Manzio
          Holographic comparison boards · 3D rotational tilt · check/cross bullets
          ═══════════════════════════════════════════════════════ */}
      <WhyChooseManzio />

      {/* FUTURISTIC KNOWLEDGE INTERFACE FAQ SECTION */}
      <FAQSection />

      {/* CINEMATIC CONVERSATION LAUNCH CTA SECTION */}
      <LaunchConversation />
    </>
  );
}
