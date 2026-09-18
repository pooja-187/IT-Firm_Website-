"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { apiService } from "@/utils/api";
import { cn } from "@/utils/cn";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  featured: boolean;
  metrics: { value: string; label: string }[];
  mood: {
    accent: string;
    glow: string;
    bg: string;
    text: string;
    gradientGlow: string;
  };
}

const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "mock-1",
    title: "DMC Automation",
    category: "AI",
    description: "Advanced Destination Management Software designed to streamline travel operations, automate bookings, and enhance business intelligence for Travinno.",
    longDescription: "We engineered a next-generation AI-driven automation platform for Travinno, transforming complex, labor-intensive destination management workflows into zero-latency operations. The system coordinates vendor matching, dynamic booking adjustments, and predictive pricing models in real-time.",
    imageUrl: "/projects/dmc_automation.png",
    technologies: ["AI Core", "Automation", "Python Nodes", "Next.js"],
    featured: true,
    metrics: [
      { value: "99.9% Uptime", label: "Enterprise SLA" },
      { value: "+180% Velocity", label: "Operations Speed" }
    ],
    mood: {
      accent: "from-[#3b82f6] to-[#8b5cf6]",
      glow: "rgba(59, 130, 246, 0.15)",
      bg: "bg-[#3b82f6]",
      text: "text-[#3b82f6]",
      gradientGlow: "from-blue-500/10 via-purple-500/5 to-transparent"
    }
  },
  {
    id: "mock-2",
    title: "Explore World",
    category: "UI/UX",
    description: "A dynamic travel portal empowering suppliers to sell directly to customers through a seamless, technology-driven marketplace.",
    longDescription: "Re-imagining B2B and B2C travel commerce. We structured an intuitive multi-tenant marketplace allowing global travel partners to list, manage, and distribute experiences with immediate settlement pipelines.",
    imageUrl: "/projects/explore_world.png",
    technologies: ["Marketplace", "React App", "Stripe API", "UI/UX"],
    featured: false,
    metrics: [
      { value: "40k MAU", label: "Active Users" },
      { value: "+32% Bookings", label: "Conversion Lift" }
    ],
    mood: {
      accent: "from-[#a855f7] to-[#f59e0b]",
      glow: "rgba(168, 85, 247, 0.15)",
      bg: "bg-[#a855f7]",
      text: "text-[#a855f7]",
      gradientGlow: "from-purple-500/10 via-amber-500/5 to-transparent"
    }
  },
  {
    id: "mock-3",
    title: "Hyat Holidays",
    category: "WEBSITES",
    description: "A modern consumer-focused travel website designed to inspire journeys, simplify bookings, and deliver seamless holiday experiences.",
    longDescription: "A high-conversion design system engineered for luxury hospitality. Hyat Holidays pairs cinematic travel content with booking APIs, resulting in an immersive editorial canvas that converts browsing into itineraries.",
    imageUrl: "/projects/hyat_holidays.png",
    technologies: ["Next.js", "TailwindCSS", "PostgreSQL", "Animations"],
    featured: true,
    metrics: [
      { value: "2.3x Sales", label: "Conversion Rate" },
      { value: "+140% Retention", label: "Return Customers" }
    ],
    mood: {
      accent: "from-[#db2777] to-[#ec4899]",
      glow: "rgba(219, 39, 119, 0.15)",
      bg: "bg-[#db2777]",
      text: "text-[#db2777]",
      gradientGlow: "from-pink-500/10 via-rose-500/5 to-transparent"
    }
  },
  {
    id: "mock-4",
    title: "Aurala System",
    category: "MOBILE",
    description: "A sleek and engaging travel website crafted to deliver seamless holiday discovery, real-time bookings, and a smooth digital experience.",
    longDescription: "A premium mobile wellness application designed to lower stress levels. Built with high-fidelity React Native interfaces, custom audio spatial rendering pipelines, and slow-pulse layout breathing elements.",
    imageUrl: "/projects/aurala.png",
    technologies: ["React Native", "Expo Core", "Web Audio API", "Siri Shortcuts"],
    featured: false,
    metrics: [
      { value: "120k Users", label: "App Store Installs" },
      { value: "4.9 Rating", label: "Global Feedback" }
    ],
    mood: {
      accent: "from-[#8b5cf6] to-[#4f46e5]",
      glow: "rgba(139, 92, 246, 0.15)",
      bg: "bg-[#8b5cf6]",
      text: "text-[#8b5cf6]",
      gradientGlow: "from-violet-500/10 via-indigo-500/5 to-transparent"
    }
  },
  {
    id: "mock-5",
    title: "TriptoGoa Portal",
    category: "BRANDING",
    description: "A vibrant travel website designed to showcase Goa experiences, simplify holiday bookings, and deliver a seamless user journey.",
    longDescription: "A complete visual identity and digital platform rebuild. We designed custom interactive itineraries, mapped local vendor locations, and built a blazing fast booking node tailored for domestic tourism hubs.",
    imageUrl: "/projects/triptogoa.png",
    technologies: ["Brand System", "Next.js Static", "Framer Motion", "Geo API"],
    featured: true,
    metrics: [
      { value: "3.5x Bookings", label: "Monthly Growth" },
      { value: "+85% Retention", label: "Customer Loyalty" }
    ],
    mood: {
      accent: "from-[#f59e0b] to-[#db2777]",
      glow: "rgba(245, 158, 11, 0.15)",
      bg: "bg-[#f59e0b]",
      text: "text-[#f59e0b]",
      gradientGlow: "from-amber-500/10 via-pink-500/5 to-transparent"
    }
  },
  {
    id: "mock-6",
    title: "Uknowtrip App",
    category: "FULL STACK",
    description: "A smart and intuitive travel website designed to help customers discover destinations, explore curated packages, and book their trips with ease.",
    longDescription: "A full-stack custom booking platform. It handles real-time seat availability checks, caches search routes via Redis, and integrates multi-currency payment gates in a gorgeous, minimal luxury interface.",
    imageUrl: "/projects/uknowtrip.png",
    technologies: ["Django REST", "React Frontend", "Redis Cache", "Docker"],
    featured: false,
    metrics: [
      { value: "50k MAU", label: "Active Travelers" },
      { value: "+45% Bookings", label: "Checkout Conversions" }
    ],
    mood: {
      accent: "from-[#10b981] to-[#3b82f6]",
      glow: "rgba(16, 185, 129, 0.15)",
      bg: "bg-[#10b981]",
      text: "text-[#10b981]",
      gradientGlow: "from-emerald-500/10 via-blue-500/5 to-transparent"
    }
  }
];

const FILTERS = ["ALL", "WEBSITES", "AI", "UI/UX", "MOBILE", "FULL STACK", "BRANDING"];

function getProjectAtmosphericProperties(categoryName: string, index: number) {
  const cat = categoryName.toLowerCase();

  if (cat.includes("ai") || cat.includes("automation") || cat.includes("data") || cat.includes("intelligence")) {
    return {
      accent: "from-[#3b82f6] to-[#8b5cf6]",
      glow: "rgba(59, 130, 246, 0.12)",
      bg: "bg-[#3b82f6]",
      text: "text-[#3b82f6]",
      gradientGlow: "from-blue-500/10 via-purple-500/5 to-transparent",
      metrics: [
        { value: "99.9% Uptime", label: "Enterprise SLA" },
        { value: "+180% Velocity", label: "Operations Speed" }
      ]
    };
  }

  if (cat.includes("ui") || cat.includes("ux") || cat.includes("design") || cat.includes("interface")) {
    return {
      accent: "from-[#a855f7] to-[#f59e0b]",
      glow: "rgba(168, 85, 247, 0.12)",
      bg: "bg-[#a855f7]",
      text: "text-[#a855f7]",
      gradientGlow: "from-purple-500/10 via-amber-500/5 to-transparent",
      metrics: [
        { value: "40k MAU", label: "Active Users" },
        { value: "+32% Bookings", label: "Conversion Lift" }
      ]
    };
  }

  if (cat.includes("brand") || cat.includes("motion") || cat.includes("logo") || cat.includes("identity")) {
    return {
      accent: "from-[#db2777] to-[#ec4899]",
      glow: "rgba(219, 39, 119, 0.12)",
      bg: "bg-[#db2777]",
      text: "text-[#db2777]",
      gradientGlow: "from-pink-500/10 via-rose-500/5 to-transparent",
      metrics: [
        { value: "3.5x Bookings", label: "Monthly Growth" },
        { value: "+85% Retention", label: "Customer Loyalty" }
      ]
    };
  }

  // Default Full Stack / Web
  const moods = [
    {
      accent: "from-[#8b5cf6] to-[#4f46e5]",
      glow: "rgba(139, 92, 246, 0.12)",
      bg: "bg-[#8b5cf6]",
      text: "text-[#8b5cf6]",
      gradientGlow: "from-violet-500/10 via-indigo-500/5 to-transparent",
      metrics: [
        { value: "2.3x Sales", label: "Conversion Rate" },
        { value: "+140% Retention", label: "Return Customers" }
      ]
    },
    {
      accent: "from-[#10b981] to-[#3b82f6]",
      glow: "rgba(16, 185, 129, 0.12)",
      bg: "bg-[#10b981]",
      text: "text-[#10b981]",
      gradientGlow: "from-emerald-500/10 via-blue-500/5 to-transparent",
      metrics: [
        { value: "50k MAU", label: "Active Travelers" },
        { value: "+45% Bookings", label: "Checkout Conversions" }
      ]
    }
  ];
  return moods[index % moods.length];
}

function normalizeCategoryForFilter(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes("website") || c.includes("web dev") || c.includes("web development")) return "WEBSITES";
  if (c.includes("ai") || c.includes("artificial") || c.includes("automation")) return "AI";
  if (c.includes("ui/ux") || c.includes("design") || c.includes("interface")) return "UI/UX";
  if (c.includes("mobile") || c.includes("app") || c.includes("ios") || c.includes("android")) return "MOBILE";
  if (c.includes("full stack") || c.includes("system") || c.includes("backend") || c.includes("database")) return "FULL STACK";
  if (c.includes("brand") || c.includes("motion") || c.includes("graphic")) return "BRANDING";
  return "UI/UX"; // Default fallback
}

function splitTitleIntoTwoLines(title: string): React.ReactNode {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;

  // If exactly 2 words, split 1-1
  if (words.length === 2) {
    return (
      <>
        {words[0]}
        <br />
        {words[1]}
      </>
    );
  }

  // If exactly 3 words, e.g. "Cinematic Motion Ad", split 1-2
  if (words.length === 3) {
    return (
      <>
        {words[0]}
        <br />
        {words[1]} {words[2]}
      </>
    );
  }

  // For 4 or more words, calculate the character-length balanced split point
  let bestIndex = 1;
  let minDiff = Infinity;

  for (let i = 1; i < words.length; i++) {
    const firstLine = words.slice(0, i).join(" ");
    const secondLine = words.slice(i).join(" ");
    const diff = Math.abs(firstLine.length - secondLine.length);
    if (diff < minDiff) {
      minDiff = diff;
      bestIndex = i;
    }
  }

  const firstLine = words.slice(0, bestIndex).join(" ");
  const secondLine = words.slice(bestIndex).join(" ");

  return (
    <>
      {firstLine}
      <br />
      {secondLine}
    </>
  );
}

export default function WorkPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Mouse spotlight coordination variables
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const bgSpotlight = useMotionTemplate`radial-gradient(450px circle at ${smoothX}px ${smoothY}px, rgba(147, 51, 234, 0.12) 0%, rgba(236, 72, 153, 0.02) 45%, transparent 100%)`;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedWorks = await apiService.getWorks();
        if (fetchedWorks && fetchedWorks.length > 0) {
          const mapped = fetchedWorks.map((work, idx) => {
            let imgUrl = work.imageUrl;
            if (!imgUrl) {
              const fallbackImages = [
                "/projects/dmc_automation.png",
                "/projects/explore_world.png",
                "/projects/hyat_holidays.png",
                "/projects/aurala.png",
                "/projects/triptogoa.png",
                "/projects/uknowtrip.png",
              ];
              imgUrl = fallbackImages[idx % fallbackImages.length];
            }

            const rawCat = work.category || "UI/UX";
            const filterCat = normalizeCategoryForFilter(rawCat);

            // Fetch technical pill names dynamically
            let techs = ["Web App", "UI/UX", "System"];
            if (filterCat === "AI") techs = ["AI Core", "Automation", "Cognitive Core"];
            else if (filterCat === "WEBSITES") techs = ["Next.js", "Django", "SEO Compliance"];
            else if (filterCat === "UI/UX") techs = ["Figma", "Design Tokens", "Design System"];
            else if (filterCat === "MOBILE") techs = ["React Native", "iOS Native", "Android"];
            else if (filterCat === "FULL STACK") techs = ["Django REST", "PostgreSQL", "API Gateway"];
            else if (filterCat === "BRANDING") techs = ["Branding", "Motion", "Visual System"];

            const moodAndMetrics = getProjectAtmosphericProperties(filterCat, idx);

            const longDesc = work.featured_description || `We engineered a custom high-fidelity digital system for ${work.client || "our elite partner"}, optimizing core rendering paths and creating seamless full-stack data nodes. This showcase coordinates high-performance architectures, intuitive layouts, and robust backend integrations tailored for scale.`;

            let metrics = moodAndMetrics.metrics;
            if (work.is_featured && (work.featured_metric_1 || work.featured_metric_2 || work.featured_metric_3)) {
              const customMetrics = [];
              if (work.featured_metric_1) {
                const parts = work.featured_metric_1.trim().split(/\s+(.+)/);
                customMetrics.push({ value: parts[0], label: parts[1] || "Performance" });
              }
              if (work.featured_metric_2) {
                const parts = work.featured_metric_2.trim().split(/\s+(.+)/);
                customMetrics.push({ value: parts[0], label: parts[1] || "Growth" });
              }
              if (work.featured_metric_3) {
                const parts = work.featured_metric_3.trim().split(/\s+(.+)/);
                customMetrics.push({ value: parts[0], label: parts[1] || "Stability" });
              }
              if (customMetrics.length > 0) {
                metrics = customMetrics;
              }
            }

            let accent = moodAndMetrics.accent;
            let glow = moodAndMetrics.glow;
            if (work.featured_theme_color) {
              const customColor = work.featured_theme_color.trim();
              if (customColor.startsWith('from-') || customColor.startsWith('bg-')) {
                accent = customColor;
                const hexMatch = customColor.match(/#([a-f0-9]{3,6})/i);
                if (hexMatch) {
                  const hex = hexMatch[1];
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  glow = `rgba(${r}, ${g}, ${b}, 0.15)`;
                }
              }
            }

            return {
              id: work.id.toString(),
              title: work.title,
              category: filterCat,
              description: work.short_description || `High-fidelity digital experience designed and custom engineered for ${work.client || "global clients"}.`,
              longDescription: longDesc,
              imageUrl: imgUrl,
              technologies: techs,
              featured: work.is_featured === true || (work.is_featured !== undefined ? false : work.status === "active"),
              metrics: metrics,
              mood: {
                accent: accent,
                glow: glow,
                bg: moodAndMetrics.bg,
                text: moodAndMetrics.text,
                gradientGlow: moodAndMetrics.gradientGlow
              }
            };
          });
          setProjects(mapped);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        console.error("Failed fetching works, falling back to mock projects", err);
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === "ALL"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  // Dynamic Interleaving Logic: Featured (1) -> Normal (2) -> Featured (1) -> Normal (2)...
  const featuredList = filteredProjects.filter(p => p.featured);
  const normalList = filteredProjects.filter(p => !p.featured);

  const interleavedProjects: { project: ProjectItem; isFeaturedSection: boolean }[] = [];
  let featIdx = 0;
  let normIdx = 0;

  while (featIdx < featuredList.length || normIdx < normalList.length) {
    if (featIdx < featuredList.length) {
      interleavedProjects.push({
        project: featuredList[featIdx],
        isFeaturedSection: true
      });
      featIdx++;
    }

    let normalAdded = 0;
    while (normalAdded < 2 && normIdx < normalList.length) {
      interleavedProjects.push({
        project: normalList[normIdx],
        isFeaturedSection: false
      });
      normIdx++;
      normalAdded++;
    }

    // If no more featured, append remaining normal projects
    if (featIdx >= featuredList.length && normIdx < normalList.length) {
      while (normIdx < normalList.length) {
        interleavedProjects.push({
          project: normalList[normIdx],
          isFeaturedSection: false
        });
        normIdx++;
      }
    }
  }

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full text-white pt-36 pb-32 overflow-hidden z-10 select-none"
      style={{ backgroundColor: "#050505" }}
    >
      {/* INTERACTIVE MOUSE SPOTLIGHT */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-700 ease-out"
        style={{
          background: bgSpotlight,
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-20">
        <motion.div
          className="absolute top-[15%] left-[-15%] w-[900px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.08) 0%, rgba(236, 72, 153, 0.01) 50%, transparent 80%)",
            filter: "blur(120px)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-[25%] right-[-15%] w-[1000px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.06) 0%, rgba(236, 72, 153, 0.015) 50%, transparent 80%)",
            filter: "blur(140px)",
          }}
          animate={{
            scale: [1.08, 0.96, 1.08],
            opacity: [0.75, 0.95, 0.75],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <AppContainer>
        <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8">

          {/* Breadcrumbs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-xs font-normal text-white/30 mb-6 font-sans tracking-wide"
          >
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white/60">Work</span>
          </motion.div>

          {/* Container Scroll Animation with Admin Dashboard Image */}
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                {/* Micro Top Label */}
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-400 font-sans block mb-4"
                >
                  Selected Work
                </motion.span>

                {/* Giant Header Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white leading-[1.15] tracking-tight max-w-none mb-8 text-center"
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "clamp(34px, 5.5vw, 68px)",
                    fontWeight: 700,
                  }}
                >
                  Stories We{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_15px_rgba(168,85,247,0.22)]">
                    Engineered
                  </span>
                </motion.h1>

                {/* Supporting Paragraph Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/60 text-base sm:text-lg leading-relaxed max-w-3xl font-normal tracking-wide mb-8 text-center text-pretty"
                >
                  A curated archive of immersive digital systems, full-stack enterprise nodes, optimized platforms, and cinematic user interfaces developed for forward-thinking brands.
                </motion.p>
              </div>
            }
          >
            {/* Solid Black Area (Temporary Diagnostic Test) */}
            <div 
              className="w-full h-full bg-black rounded-2xl flex items-center justify-center border border-white/10"
              style={{ backgroundColor: "#000000" }}
            />
          </ContainerScroll>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 mb-20 relative z-10"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] font-sans transition-all duration-300 border whitespace-nowrap",
                    isActive
                      ? "bg-purple-500/20 text-white border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.22)]"
                      : "bg-[#07070a]/70 text-neutral-300 border-white/10 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5"
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </motion.div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="w-full py-32 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <ImageAutoSlider
              projects={filteredProjects.map((p) => ({
                title: p.title,
                imageUrl: p.imageUrl
              }))}
            />
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="w-full py-32 text-center flex flex-col items-center justify-center border border-white/[0.04] bg-[#07070a]/20 rounded-[2rem] backdrop-blur-md">
              <span className="text-white/40 font-sans text-xs uppercase tracking-widest mb-4">No Projects Found</span>
              <p className="text-white/60 font-normal max-w-sm">We are actively preparing new systems. Check back shortly.</p>
            </div>
          )}

        </div>
      </AppContainer>
    </div>
  );
}
