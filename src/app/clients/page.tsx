"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";
import { apiService, Partner } from "@/utils/api";
import { cn } from "@/utils/cn";

// Exact 12 premium clients from the admin panel / homepage seeds
const MOCK_CLIENTS = [
  { id: 1,  name: "Open Visas",                 type: "ENTERPRISE & SAAS", glowColor: "rgba(168, 85, 247, 0.12)" },
  { id: 2,  name: "Fortune Dentals",            type: "ENTERPRISE & SAAS", glowColor: "rgba(139, 92, 246, 0.12)" },
  { id: 3,  name: "Hotel Passion",              type: "TRAVEL & TOURISM",   glowColor: "rgba(236, 72, 153, 0.12)" },
  { id: 4,  name: "Laundremaison",              type: "ENTERPRISE & SAAS", glowColor: "rgba(16, 185, 129, 0.12)" },
  { id: 5,  name: "Mangalam Travel and Tours",  type: "TRAVEL & TOURISM",   glowColor: "rgba(59, 130, 246, 0.12)" },
  { id: 6,  name: "Travinno",                   type: "AI & AUTOMATION",   glowColor: "rgba(59, 130, 246, 0.12)" },
  { id: 7,  name: "Mangalam Holidays",          type: "TRAVEL & TOURISM",   glowColor: "rgba(236, 72, 153, 0.12)" },
  { id: 8,  name: "Open Nurses",                type: "ENTERPRISE & SAAS", glowColor: "rgba(16, 185, 129, 0.12)" },
  { id: 9,  name: "Fazo",                       type: "ENTERPRISE & SAAS", glowColor: "rgba(168, 85, 247, 0.12)" },
  { id: 10, name: "UKnowTrip",                  type: "TRAVEL & TOURISM",   glowColor: "rgba(168, 85, 247, 0.12)" },
  { id: 11, name: "Hack The Skill",             type: "ENTERPRISE & SAAS", glowColor: "rgba(245, 158, 11, 0.12)" },
  { id: 12, name: "Eucalia Glamps",             type: "TRAVEL & TOURISM",   glowColor: "rgba(59, 130, 246, 0.12)" }
];

const SECTOR_FILTERS = [
  "ALL",
  "TRAVEL & TOURISM",
  "AI & AUTOMATION",
  "ENTERPRISE & SAAS"
];

// Helper to normalize backend types dynamically
function normalizeClientType(partner: Partner) {
  const normalizedType = partner.type ? partner.type.toUpperCase() : "ENTERPRISE & SAAS";
  
  let type = "ENTERPRISE & SAAS";
  if (normalizedType.includes("TRAVEL") || normalizedType.includes("TOUR")) {
    type = "TRAVEL & TOURISM";
  } else if (normalizedType.includes("AI") || normalizedType.includes("AUTOMATION") || normalizedType.includes("MACHINE")) {
    type = "AI & AUTOMATION";
  }

  let glowColor = "rgba(139, 92, 246, 0.12)";
  if (type === "AI & AUTOMATION") {
    glowColor = "rgba(59, 130, 246, 0.12)";
  } else if (type === "TRAVEL & TOURISM") {
    glowColor = "rgba(236, 72, 153, 0.12)";
  }

  return {
    ...partner,
    type,
    glowColor
  };
}

export default function ClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // States
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Mouse spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Button
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const btnSpringY = useSpring(btnY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distX = e.clientX - btnCenterX;
      const distY = e.clientY - btnCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 150) {
        btnX.set(distX * 0.25);
        btnY.set(distY * 0.25);
      } else {
        btnX.set(0);
        btnY.set(0);
      }
    }
  };

  useEffect(() => {
    async function loadClients() {
      try {
        const fetchedPartners = await apiService.getPartners();
        if (fetchedPartners && fetchedPartners.length > 0) {
          const formatted = fetchedPartners.map((partner) => 
            normalizeClientType(partner)
          );
          setClientsList(formatted);
        } else {
          setClientsList(MOCK_CLIENTS);
        }
      } catch (err) {
        console.error("Failed to load partners, falling back to mocks", err);
        setClientsList(MOCK_CLIENTS);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  const filteredClients = activeFilter === "ALL"
    ? clientsList
    : clientsList.filter(c => c.type === activeFilter);

  const bgSpotlight = useMotionTemplate`radial-gradient(450px circle at ${smoothX}px ${smoothY}px, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.02) 45%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        btnX.set(0);
        btnY.set(0);
      }}
      className="relative w-full text-white pt-36 pb-32 overflow-hidden z-10 select-none min-h-screen"
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
        <div
          className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.015) 50%, transparent 85%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.05) 0%, transparent 85%)",
            filter: "blur(120px)",
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
            <span className="text-white/60">Clients</span>
          </motion.div>

          {/* Micro Top Label */}
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-400 font-sans block mb-4"
          >
            Our Network
          </motion.span>

          {/* Giant Header Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white tracking-tight max-w-none mb-8 text-left"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(34px, 5.5vw, 68px)",
              fontWeight: 700,
            }}
          >
            <span className="block mb-2 md:mb-3">Visionary Partners.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 font-bold drop-shadow-[0_0_15px_rgba(168,85,247,0.22)] pb-2">
              Realized at Scale.
            </span>
          </motion.h1>

          {/* Supporting Paragraph Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/60 text-base sm:text-lg leading-relaxed max-w-3xl font-normal tracking-wide mb-16 text-pretty"
          >
            We construct elite partnerships that bridge design obsession and full-stack software engineering. Ingesting active coordinates from our live admin system, we serve as the scaling foundation for forward-thinking global brands.
          </motion.p>

          {/* Sector Filters Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 mb-16 relative z-10"
          >
            {SECTOR_FILTERS.map((filter) => {
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

          {/* Core Minimalist Clients Grid (Matches Homepage Grid Exactly) */}
          {loading ? (
            <div className="w-full py-32 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.03,
                  }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full"
            >
              {filteredClients.map((client, i) => (
                <motion.div
                  key={client.id || i}
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }
                    }
                  }}
                  className="group relative flex items-stretch justify-stretch min-h-[95px] sm:min-h-[110px] rounded-xl p-[1.5px] overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 bg-white/[0.08] hover:bg-transparent hover:shadow-[0_12px_36px_rgba(91,46,255,0.06)]"
                >
                  {/* 1. Soft Ambient Rotating Glow Aura */}
                  <div
                    className="absolute top-1/2 left-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] aspect-square opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none rounded-full card-border-tracer"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)",
                      filter: "blur(14px)",
                    }}
                  />

                  {/* 2. Sharp Rotating Outline Tracer */}
                  <div
                    className="absolute top-1/2 left-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] aspect-square opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full card-border-tracer"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 20%, #5B2EFF 40%, #c084fc 49%, #ffffff 51%, #c084fc 53%, #FF66C4 62%, transparent 80%)",
                    }}
                  />

                  {/* Inner content wrapper covering the rotating center */}
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
              ))}
            </motion.div>
          )}

          {/* Bottom callout to trigger consultation */}
          <div className="w-full flex flex-col items-center justify-center mt-36 relative text-center">
            
            {/* Visual breathing nebula orb */}
            <div className="absolute w-[450px] h-[250px] rounded-full bg-purple-900/[0.08] blur-[80px] pointer-events-none -z-10 animate-pulse-slow" />
            
            <span className="text-[9px] font-extrabold tracking-[0.35em] text-[#a855f7]/70 uppercase mb-4 animate-pulse">
              Scale Your Operations
            </span>
            <h2 
              className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-8"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Ready to Join the Cohort?
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.a
                ref={buttonRef}
                href="/contact"
                style={{
                  x: btnSpringX,
                  y: btnSpringY
                }}
                className="group relative inline-flex items-center justify-center rounded-full cursor-pointer shadow-[0_12px_40px_-8px_rgba(139,92,246,0.15)] hover:shadow-[0_16px_48px_-6px_rgba(139,92,246,0.3)] transition-all duration-300"
              >
                <div className="relative z-10 bg-neutral-950 text-white rounded-full px-8 py-3.5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Start Your Project
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.a>
            </motion.div>
          </div>

        </div>
      </AppContainer>
    </div>
  );
}
