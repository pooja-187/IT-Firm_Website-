"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Clock, ArrowUpRight, BookOpen, Sparkles, Calendar, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AppContainer } from "@/components/ui/AppContainer";
import { apiService, Blog } from "@/utils/api";
import { cn } from "@/utils/cn";
import HalideTopoHero from "@/components/ui/halide-topo-hero";

// Curated High-Fidelity Fallback Blog Data
const MOCK_BLOGS: Blog[] = [
  {
    id: 1,
    title: "Scaling Modern Web Applications in 2026",
    date: "2026-05-18",
    metaDescription: "A comprehensive guide to scaling high-traffic Next.js and Django platforms.",
    description: "Building high-performance digital ecosystems requires decoupling your frontend and backend. Using Next.js for Server-Side Rendering (SSR) paired with a robust Django REST API on SQLite/PostgreSQL gives developer efficiency and scalability. In this guide, we dive deep into database index tuning, server caching layers (like Redis), CDN distribution strategies, and custom asset pipeline handling that keeps your applications lighting fast globally.",
    images: []
  },
  {
    id: 2,
    title: "The Art of Cinematic UI/UX Design",
    date: "2026-05-12",
    metaDescription: "Learn how micro-animations and HSL colors elevate modern SaaS dashboards.",
    description: "Design is not just what it looks like; it's how it feels and flows. Integrating GSAP, smooth CSS gradients, glassmorphism layers, and responsive column feeds creates trust and a premium feel. We explore HSL color tailoring, the psychology behind 3D rotational tilt cards, micro-interactions, and using spring-based motion curves instead of simple linear animations to create software that feels truly premium and alive.",
    images: []
  }
];

// Helper to convert blog titles to URL-safe slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>(MOCK_BLOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Mouse spotlight tracker coordinates (follows cursor inside page)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress on entry for parallax backgrounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const fetchedBlogs = await apiService.getBlogs();
        if (fetchedBlogs && fetchedBlogs.length > 0) {
          setBlogs(fetchedBlogs);
        }
      } catch (err) {
        console.error("Failed to load blog posts, keeping local defaults", err);
      }
    }
    loadBlogs();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const bgSpotlight = useMotionTemplate`radial-gradient(550px circle at ${smoothX}px ${smoothY}px, rgba(147, 51, 234, 0.08) 0%, rgba(236, 72, 153, 0.01) 45%, transparent 100%)`;

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gridBlogs = filteredBlogs;

  // Premium fallback image for blog cards
  const renderFallbackImage = (title: string, index: number) => {
    const isOdd = index % 2 !== 0;
    return (
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden z-0 select-none",
        isOdd ? "bg-gradient-to-br from-[#180e29] via-[#090514] to-black" : "bg-gradient-to-br from-[#0c0e1a] via-[#05060f] to-black"
      )}>
        {/* Cyber grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Luxury circular design */}
        <div className="absolute w-[220px] h-[220px] border border-dashed border-purple-500/10 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
          <div className="w-[150px] h-[150px] border border-dashed border-pink-500/5 rounded-full" />
        </div>
        
        <BookOpen className="w-14 h-14 text-purple-500/20 absolute" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[7px] font-mono text-purple-400/15 uppercase tracking-widest">
          <span>ARCHIVE SYSTEM</span>
          <span>MANZIO DIGITAL JOURNAL</span>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black text-white overflow-hidden z-10 pb-32 select-none min-h-screen"
    >
      {/* ── 2. CYBER DOT GRID TEXTURE OVERLAY ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] select-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      {/* ── HERO: Halide Topographic 3D Parallax ── */}
      <HalideTopoHero />

      {/* ── SEARCH BAR ── */}
      <div id="articles" className="flex justify-center px-6 py-14 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md mobile-visible"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/30" />
          </div>
          <input
            type="text"
            placeholder="Search articles, case studies, technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.15] text-white placeholder-white/30 text-xs tracking-wider font-normal focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all duration-300 backdrop-blur-md shadow-lg"
          />
        </motion.div>
      </div>

      {/* ── 5. MAIN CONTENT / ARTICLES LIST SEGMENT ── */}
      <AppContainer>
        <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8">
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              MAIN ARTICLES CONTAINER
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {loading && blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-purple-500/25 border-t-purple-500 rounded-full animate-spin mb-4" />
              <span className="text-[10px] uppercase tracking-widest text-white/40">Syncing archives...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <span className="text-[10px] font-mono text-purple-400/60 tracking-widest uppercase mb-4">NO ARCHIVES FOUND</span>
              <p className="text-white/40 font-normal text-sm max-w-md leading-relaxed">
                We couldn't locate any journal entries matching "{searchQuery}". Try searching for other technologies or topics.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-16 md:gap-24 relative z-20">
              


              {/* B. ARCHIVES GRID */}
              {gridBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridBlogs.map((blog, idx) => {
                    const wordCount = blog.description ? blog.description.split(/\s+/).length : 120;
                    const minRead = Math.max(2, Math.ceil(wordCount / 180));
                    
                    return (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.7, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href={`/blog/${slugify(blog.title)}`}
                          className="group relative flex flex-col h-full rounded-[2rem] p-[1.2px] overflow-hidden bg-white/[0.02] hover:bg-transparent transition-all duration-700 shadow-[0_12px_36px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.12)] border border-white/[0.04] hover:border-purple-500/20"
                        >
                          {/* Card Glass Layer */}
                          <div className="relative flex flex-col h-full rounded-[1.92rem] bg-[#07070a]/92 backdrop-blur-xl p-5 z-10 flex-grow">
                            
                            {/* Accent Glow behind image */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(220px_circle_at_center,rgba(168,85,247,0.04),transparent_100%)]" />

                            {/* Card Image Frame - with Cinematic zoom-IN hover animation */}
                            <div className="relative overflow-hidden aspect-[16/10] rounded-[1.5rem] border border-white/[0.05] bg-[#07070a]/40 mb-5 select-none">
                              <div className="absolute inset-0 w-full h-full overflow-hidden">
                                {blog.images && blog.images.length > 0 ? (
                                  <Image
                                    src={blog.images[0]}
                                    alt={blog.title}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-[6s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.06]"
                                    unoptimized
                                  />
                                ) : (
                                  renderFallbackImage(blog.title, idx + 1)
                                )}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none z-10" />
                            </div>

                            {/* Card Meta segment */}
                            <div className="flex items-center gap-3 text-white/50 font-semibold text-[9px] tracking-wider uppercase mb-3.5 font-sans">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-purple-400/70" />
                                <span>{blog.date}</span>
                              </span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-purple-400/70" />
                                <span>{minRead} MIN READ</span>
                              </span>
                            </div>

                            {/* Card Heading - elegant Serif font inside box */}
                            <h3 
                              className="text-white text-[18px] sm:text-[20px] font-semibold leading-snug tracking-wide group-hover:text-purple-200 transition-colors duration-500 line-clamp-2 mb-3"
                              style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
                            >
                              {blog.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-white/40 leading-relaxed font-normal text-[12.5px] sm:text-[13px] line-clamp-3 mb-6 flex-grow">
                              {blog.metaDescription || blog.description}
                            </p>

                            {/* Card Footer CTA */}
                            <div className="border-t border-white/[0.04] pt-4 mt-auto flex items-center justify-between">
                              <span className="text-[9px] font-semibold text-white/40 tracking-wider uppercase font-sans">
                                JOURNAL ENTRY
                              </span>
                              <span className="text-[11px] font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300 flex items-center gap-1">
                                <span>View</span>
                                <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </div>

                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      </AppContainer>
    </div>
  );
}
