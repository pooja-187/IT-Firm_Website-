"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Landmark, Compass, Palette, Smile, Code2 } from "lucide-react";
import Image from "next/image";
import { apiService } from "@/utils/api";
import Link from "next/link";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DUMMY DATA STRUCTURE (Easy to replace with API data in future)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  accentColor: string;
  glowColor: string;
  // Beautiful dynamic thumbnail mockup renderer
  renderThumbnail: () => React.ReactNode;
}

const PROJECTS: Project[] = [
  {
    id: "travinno",
    title: "Travinno",
    category: "Luxury Travel Tech",
    description: "Sleek, immersive itinerary planner for elite global travelers.",
    accentColor: "from-[#8b5cf6] to-[#ec4899]", // Purple to Pink
    glowColor: "rgba(139, 92, 246, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#120b24] via-[#090611] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle geometric radar glow lines */}
        <div className="absolute w-[180px] h-[180px] border border-purple-500/10 rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-[280px] h-[280px] border border-pink-500/5 rounded-full" />
        
        {/* Compass / Navigation grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <Compass className="w-14 h-14 text-purple-400/50 absolute" />
        
        {/* Futuristic coordinates UI element */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-purple-400/40 uppercase tracking-widest">
          <span>LAT: 45.109N</span>
          <span>SYSTEM ONLINE</span>
          <span>LNG: 130.22E</span>
        </div>
      </div>
    ),
  },
  {
    id: "open-visas",
    title: "Open Visas",
    category: "Immigration & Visa SaaS",
    description: "Automated global mobility systems and digital visa routing.",
    accentColor: "from-[#3b82f6] to-[#8b5cf6]", // Blue to Purple
    glowColor: "rgba(59, 130, 246, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1424] via-[#060a12] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Security shielding rings */}
        <div className="absolute w-[220px] h-[100px] border border-blue-500/10 rounded-[100%] rotate-[20deg]" />
        <div className="absolute w-[220px] h-[100px] border border-purple-500/10 rounded-[100%] rotate-[-20deg]" />
        
        <ShieldCheck className="w-14 h-14 text-blue-400/50 absolute" />
        
        {/* UI mock passport chip element */}
        <div className="absolute top-4 left-4 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-mono text-blue-300 tracking-wider">
          ENCRYPTED GATEWAY
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-blue-400/40 uppercase tracking-widest">
          <span>ROOT LEVEL ACCESS</span>
          <span>99.8% VERIFIED</span>
        </div>
      </div>
    ),
  },
  {
    id: "hotel-passion",
    title: "Hotel Passion",
    category: "Hospitality & Design",
    description: "Boutique booking interfaces tailored for luxury lifestyle resorts.",
    accentColor: "from-[#f59e0b] to-[#ec4899]", // Amber to Pink
    glowColor: "rgba(245, 158, 11, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#24130b] via-[#100704] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Fine-line luxury architectural grid */}
        <div className="absolute inset-x-6 top-8 bottom-8 border border-amber-500/10 flex items-center justify-center">
          <div className="w-[85%] h-[85%] border border-pink-500/5 flex items-center justify-center">
            <Landmark className="w-14 h-14 text-amber-500/40" />
          </div>
        </div>
        
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[8px] font-mono text-amber-500/40 uppercase tracking-widest">
          <span>AMBER SUITES</span>
          <span>★ ★ ★ ★ ★</span>
          <span>EST. 2026</span>
        </div>
      </div>
    ),
  },
  {
    id: "mangalam-holidays",
    title: "Mangalam Holidays",
    category: "Experiential Tourism",
    description: "Premium digital curation of bespoke travel escapades.",
    accentColor: "from-[#10b981] to-[#3b82f6]", // Emerald to Blue
    glowColor: "rgba(16, 185, 129, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b2416] via-[#041009] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Sine wave travel topology curves */}
        <div className="absolute inset-x-0 bottom-4 h-24 opacity-20">
          <svg className="w-full h-full text-emerald-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,80 Q25,50 50,70 T100,50 L100,100 L0,100 Z" fill="currentColor" />
            <path d="M0,60 Q30,80 60,50 T100,70 L100,100 L0,100 Z" fill="rgba(16, 185, 129, 0.1)" />
          </svg>
        </div>
        
        <div className="absolute top-16 w-24 h-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <Compass className="w-8 h-8 text-emerald-400/40" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-emerald-400/40 uppercase tracking-widest">
          <span>TERRAIN MODEL</span>
          <span>ECO-CRUISE V.02</span>
        </div>
      </div>
    ),
  },
  {
    id: "fazo",
    title: "Fazo",
    category: "Avant-garde Fashion",
    description: "3D virtual try-ons and immersive next-gen digital apparel.",
    accentColor: "from-[#ec4899] to-[#8b5cf6]", // Pink to Purple
    glowColor: "rgba(236, 72, 153, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#240b18] via-[#11050c] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Abstract typographic & shape wireframe layout */}
        <div className="absolute w-[200px] h-[200px] border border-pink-500/10 rotate-45 flex items-center justify-center">
          <div className="w-[140px] h-[140px] border border-purple-500/10 flex items-center justify-center">
            <Palette className="w-12 h-12 text-pink-500/40 -rotate-45" />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 text-[9px] font-mono text-pink-400/40 border border-pink-500/20 px-2 py-0.5 rounded uppercase">
          HAUTE COUTURE
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-pink-400/30 uppercase tracking-widest">
          <span>COLLECTION 2026</span>
          <span>SYSTEM VIRTUAL</span>
        </div>
      </div>
    ),
  },
  {
    id: "fortune-dentals",
    title: "Fortune Dentals",
    category: "Premium Healthcare",
    description: "Advanced surgical aesthetic consultations and biotech clinical tech.",
    accentColor: "from-[#06b6d4] to-[#3b82f6]", // Cyan to Blue
    glowColor: "rgba(6, 182, 212, 0.15)",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#061f24] via-[#030d10] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Biotech molecular mesh or waves */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#06b6d4_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/10 flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="w-4 h-4 rounded-full bg-cyan-500/20 absolute -top-2" />
        </div>
        
        <Smile className="w-14 h-14 text-cyan-400/50 absolute" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-cyan-400/40 uppercase tracking-widest">
          <span>HEALTH ENGINE</span>
          <span>SECURE BIOMETRIC</span>
        </div>
      </div>
    ),
  },
];

function getFallbackThumbnail(title: string, category: string) {
  const lowerCat = category.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (lowerCat.includes("travel") || lowerCat.includes("tourism") || lowerCat.includes("motion") || lowerTitle.includes("agency")) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#120b24] via-[#090611] to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute w-[180px] h-[180px] border border-purple-500/10 rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-[280px] h-[280px] border border-pink-500/5 rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        <Compass className="w-14 h-14 text-purple-400/50 absolute" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-purple-400/40 uppercase tracking-widest">
          <span>LAT: 45.109N</span>
          <span>SYSTEM ONLINE</span>
          <span>LNG: 130.22E</span>
        </div>
      </div>
    );
  }

  if (lowerCat.includes("visa") || lowerCat.includes("legal") || lowerCat.includes("security") || lowerCat.includes("immigrat")) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1424] via-[#060a12] to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute w-[220px] h-[100px] border border-blue-500/10 rounded-[100%] rotate-[20deg]" />
        <div className="absolute w-[220px] h-[100px] border border-purple-500/10 rounded-[100%] rotate-[-20deg]" />
        <ShieldCheck className="w-14 h-14 text-blue-400/50 absolute" />
        <div className="absolute top-4 left-4 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-mono text-blue-300 tracking-wider">
          ENCRYPTED GATEWAY
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-blue-400/40 uppercase tracking-widest">
          <span>ROOT LEVEL ACCESS</span>
          <span>99.8% VERIFIED</span>
        </div>
      </div>
    );
  }

  if (lowerCat.includes("hotel") || lowerCat.includes("hospitality") || lowerCat.includes("brand") || lowerCat.includes("corporate")) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#24130b] via-[#100704] to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-x-6 top-8 bottom-8 border border-amber-500/10 flex items-center justify-center">
          <div className="w-[85%] h-[85%] border border-pink-500/5 flex items-center justify-center">
            <Landmark className="w-14 h-14 text-amber-500/40" />
          </div>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[8px] font-mono text-amber-500/40 uppercase tracking-widest">
          <span>AMBER SUITES</span>
          <span>★ ★ ★ ★ ★</span>
          <span>EST. 2026</span>
        </div>
      </div>
    );
  }

  if (lowerCat.includes("design") || lowerCat.includes("fashion") || lowerCat.includes("apparel") || lowerCat.includes("art")) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#240b18] via-[#11050c] to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute w-[200px] h-[200px] border border-pink-500/10 rotate-45 flex items-center justify-center">
          <div className="w-[140px] h-[140px] border border-purple-500/10 flex items-center justify-center">
            <Palette className="w-12 h-12 text-pink-500/40 -rotate-45" />
          </div>
        </div>
        <div className="absolute top-4 right-4 text-[9px] font-mono text-pink-400/40 border border-pink-500/20 px-2 py-0.5 rounded uppercase">
          HAUTE COUTURE
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-pink-400/30 uppercase tracking-widest">
          <span>COLLECTION 2026</span>
          <span>SYSTEM VIRTUAL</span>
        </div>
      </div>
    );
  }

  if (lowerCat.includes("health") || lowerCat.includes("medical") || lowerCat.includes("clinic") || lowerCat.includes("dent")) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#061f24] via-[#030d10] to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#06b6d4_1px,transparent_1px)] bg-[size:10px_10px]" />
        <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/10 flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="w-4 h-4 rounded-full bg-cyan-500/20 absolute -top-2" />
        </div>
        <Smile className="w-14 h-14 text-cyan-400/50 absolute" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-cyan-400/40 uppercase tracking-widest">
          <span>HEALTH ENGINE</span>
          <span>SECURE BIOMETRIC</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-black flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
      <Code2 className="w-14 h-14 text-slate-400/40 absolute animate-pulse" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-slate-400/30 uppercase tracking-widest">
        <span>DEV PORTAL</span>
        <span>COMPILE SUCCESS</span>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROJECT CARD SUB-COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link href="/work" className="block w-full">
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full h-[400px] rounded-2xl p-[1px] overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/[0.04] hover:bg-transparent cursor-pointer"
      >
        {/* Dynamic Cursor Spotlight Outline Tracer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.45), transparent 60%)`,
          }}
        />

        {/* Outer Card Body */}
        <div className="relative w-full h-full rounded-[15px] bg-[#09090b]/80 border border-white/5 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-5 z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-500">
          
          {/* Dynamic Card Internal Radial Glow Spotlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, ${project.glowColor}, transparent 80%)`,
            }}
          />

          {/* Thumbnail Showcase Area (70% height aspect) */}
          <div className="relative w-full h-[270px] rounded-xl overflow-hidden border border-white/[0.03] shadow-inner mb-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
            {project.renderThumbnail()}
            
            {/* Subtle overlay gradients for luxury branding */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
            {/* Hover interactive CTA pill */}
            <div className="absolute top-3 right-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-[400ms] ease-out flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] text-white/90 tracking-wide font-sans z-20">
              <span>EXPLORE</span>
              <ArrowUpRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </div>

          {/* Card Typography Content (30% height aspect) */}
          <div className="relative z-10 flex flex-col justify-end">
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase bg-gradient-to-r ${project.accentColor} bg-clip-text text-fill-transparent text-transparent font-sans`}>
                {project.category}
              </span>
            </div>

            <h3 className="text-[17px] font-semibold text-white tracking-tight leading-snug transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-[11px] text-white/40 leading-relaxed font-normal mt-1 line-clamp-2 group-hover:text-white/60 transition-colors duration-500">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PROJECT SHOWCASE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ProjectShowcase() {
  const [isHovered, setIsHovered] = useState(false);
  const [containerMousePos, setContainerMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    async function loadProjects() {
      try {
        const fetchedWorks = await apiService.getWorks();
        if (fetchedWorks && fetchedWorks.length > 0) {
          const gradients = [
            { accentColor: "from-[#8b5cf6] to-[#ec4899]", glowColor: "rgba(139, 92, 246, 0.15)" },
            { accentColor: "from-[#3b82f6] to-[#8b5cf6]", glowColor: "rgba(59, 130, 246, 0.15)" },
            { accentColor: "from-[#f59e0b] to-[#ec4899]", glowColor: "rgba(245, 158, 11, 0.15)" },
            { accentColor: "from-[#10b981] to-[#3b82f6]", glowColor: "rgba(16, 185, 129, 0.15)" },
            { accentColor: "from-[#ec4899] to-[#8b5cf6]", glowColor: "rgba(236, 72, 153, 0.15)" },
            { accentColor: "from-[#06b6d4] to-[#3b82f6]", glowColor: "rgba(6, 182, 212, 0.15)" }
          ];

          const mappedProjects: Project[] = fetchedWorks.map((work, idx) => {
            const grad = gradients[idx % gradients.length];
            return {
              id: work.id.toString(),
              title: work.title,
              category: work.category,
              description: work.short_description || `High-fidelity digital experience designed and custom engineered for ${work.client || "global clients"}.`,
              accentColor: grad.accentColor,
              glowColor: grad.glowColor,
              renderThumbnail: () => {
                if (work.imageUrl) {
                  return (
                    <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10 pointer-events-none" />
                      <div className="absolute inset-x-6 top-8 bottom-8 border border-white/5 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-[85%] h-[85%] border border-white/[0.02]" />
                      </div>
                      <Image
                        src={work.imageUrl}
                        alt={work.title}
                        fill
                        unoptimized
                        className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[8px] font-sans text-white/30 uppercase tracking-widest z-10">
                        <span>LAT: 45.109N</span>
                        <span>{work.client ? work.client.toUpperCase() : "SYSTEM ONLINE"}</span>
                        <span>LNG: 130.22E</span>
                      </div>
                    </div>
                  );
                }
                return getFallbackThumbnail(work.title, work.category);
              }
            };
          });
          setProjectsList(mappedProjects);
        }
      } catch (err) {
        console.error("Failed to load projects, falling back to mock projects", err);
      }
    }
    loadProjects();
  }, []);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setContainerMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Track scroll progress of showcase section entering and leaving the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Showcase opacity fade-in as it enters, stays solid, then fades out as it exits to next section
  const showcaseOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.75, 0.95],
    [0, 1, 1, 0]
  );

  // Split projects into left and right lists dynamically
  const half = Math.ceil(projectsList.length / 2);
  const leftColumnProjects = projectsList.slice(0, half);
  const rightColumnProjects = projectsList.slice(half);

  // Double buffers arrays to enable mathematically perfect infinite loops
  const leftLoop = [...leftColumnProjects, ...leftColumnProjects];
  const rightLoop = [...rightColumnProjects, ...rightColumnProjects];

  return (
    <section ref={containerRef} className="relative w-full pb-14 sm:pb-20 bg-black z-30 overflow-hidden pt-10">
      <motion.div style={{ opacity: showcaseOpacity }} className="w-full relative z-10">

        <div className="relative w-full max-w-6xl mx-auto px-6">
        
        {/* Cinematic Section Heading */}
        <div className="text-center mb-16 md:mb-20 flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-3.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Showcase
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-center leading-[1.2] tracking-tight max-w-3xl text-pretty"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(30px, 4.5vw, 52px)",
            }}
          >
            <span style={{ fontWeight: 600 }}>Stories We </span>
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]"
            >
              Engineered.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-[1.6] max-w-lg font-normal tracking-wide mt-0.5"
          >
            Digital products crafted for ambitious brands.
          </motion.p>
        </div>

        {/* Large Rounded Rectangle Container Grid Portal */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleContainerMouseMove}
          className="group relative w-full rounded-[2.5rem] p-[1.2px] overflow-hidden bg-white/5 transition-all duration-700 ease-out shadow-[0_24px_80px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_28px_90px_-10px_rgba(0,0,0,0.95)]"
        >
          {/* 1. Diffused Ambient Glow (Blurred, behind) */}
          <div
            className="absolute inset-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none rounded-[2.6rem]"
            style={{
              background: `radial-gradient(450px circle at ${containerMousePos.x}px ${containerMousePos.y}px, rgba(139, 92, 246, 0.14) 0%, rgba(124, 58, 237, 0.08) 35%, rgba(236, 72, 153, 0.04) 65%, transparent 100%)`,
              filter: "blur(24px)",
              zIndex: 0,
            }}
          />

          {/* 2. Sharp Border Tracer (Visible in p-[1.2px] gap) */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none rounded-[2.5rem]"
            style={{
              background: `radial-gradient(350px circle at ${containerMousePos.x}px ${containerMousePos.y}px, rgba(139, 92, 246, 0.35) 0%, rgba(236, 72, 153, 0.16) 50%, transparent 100%)`,
              zIndex: 0,
            }}
          />

          {/* 3. Inner Panel Body (Layered on top of borders) */}
          <div className="relative w-full rounded-[2.42rem] p-1.5 md:p-2.5 overflow-hidden bg-[#060608]/92 backdrop-blur-2xl z-10 flex flex-col justify-between">
            
            {/* Ambient Internal spotlight reflection inside the panel glass */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
              style={{
                background: `radial-gradient(300px circle at ${containerMousePos.x}px ${containerMousePos.y}px, rgba(139, 92, 246, 0.015) 0%, transparent 80%)`
              }}
            />

          {/* Cinematic Fade Mask Overlays (Locks the cards in a holographic scrolling portal) */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-20" />

          {/* Scrolling Grid Wall Layout */}
          <div className="relative h-[650px] w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 z-10 overflow-hidden">
            
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                LEFT COLUMN (SCROLLS UPWARD INFINTELY)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="relative h-full overflow-hidden flex flex-col w-full">
              <motion.div
                animate={{
                  y: ["0%", "-50%"],
                }}
                transition={{
                  ease: "linear",
                  duration: isHovered ? 52 : 36, // Smoothly slows down scroll on showcase hover
                  repeat: Infinity,
                }}
                className="flex flex-col gap-6"
              >
                {leftLoop.map((project, i) => (
                  <ProjectCard key={`left-${project.id}-${i}`} project={project} />
                ))}
              </motion.div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                RIGHT COLUMN (SCROLLS DOWNWARD INFINTELY)
                - Desktop/Tablet: Separate moving down.
                - Mobile: Hidden/Collapsed so single centered is responsive.
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="relative h-full overflow-hidden hidden md:flex flex-col w-full">
              <motion.div
                animate={{
                  y: ["-50%", "0%"],
                }}
                transition={{
                  ease: "linear",
                  duration: isHovered ? 52 : 36, // Smoothly slows down scroll on showcase hover
                  repeat: Infinity,
                }}
                className="flex flex-col gap-6"
              >
                {rightLoop.map((project, i) => (
                  <ProjectCard key={`right-${project.id}-${i}`} project={project} />
                ))}
              </motion.div>
            </div>

          </div>
        </div> {/* Closes inner panel body */}
      </div> {/* Closes outer container div */}

      </div>
      </motion.div>
    </section>
  );
}
