"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Clock, ArrowUpRight, X, BookOpen, Sparkles, Calendar } from "lucide-react";
import Image from "next/image";
import { apiService, Blog } from "@/utils/api";
import Link from "next/link";
import { getAllBlogs, slugify } from "@/data/blogData";

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>(getAllBlogs);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  
  // Spotlight tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px 0px" });

  // Track scroll progress on entry and exit to enable cinematic fade transitions
  const { scrollYProgress: enterScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: exitScroll } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });

  const enterOpacity = useTransform(enterScroll, [0, 0.3], [0.75, 1]);
  const exitOpacity = useTransform(exitScroll, [0.15, 0.85], [1, 0]);

  const contentOpacity = useTransform(
    [enterOpacity, exitOpacity],
    ([o1, o2]: number[]) => o1 * o2
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      try {
        const fetchedBlogs = await apiService.getBlogs();
        if (isMounted && fetchedBlogs && fetchedBlogs.length > 0) {
          setBlogs(fetchedBlogs);
        }
      } catch (err) {
        console.warn("Keeping central static blogs dataset for BlogSection:", err);
      }
    }
    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotation timer logic (cycles index every 3 seconds, pauses on hover/pause state or when offscreen)
  useEffect(() => {
    if (!isInView || isPaused || blogs.length <= 1) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % blogs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isInView, isPaused, blogs.length]);

  // Extract the active featured blog
  const featuredBlog = blogs[activeIndex] || blogs[0];

  // Format Date beautifully
  const formattedDate = new Date(featuredBlog.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Premium Fallback Image for the featured layout
  const renderFeaturedFallback = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#180e29] via-[#090514] to-black flex items-center justify-center p-8 overflow-hidden z-0 select-none">
      {/* Decorative Cyber Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      {/* Abstract luxury rotating rings */}
      <div className="absolute w-[280px] h-[280px] border border-dashed border-purple-500/10 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center">
        <div className="w-[200px] h-[200px] border border-dashed border-pink-500/5 rounded-full" />
      </div>
      
      <BookOpen className="w-20 h-20 text-purple-500/20 absolute" />
      
      {/* Cyber Coordinates Monogram */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[8px] font-mono text-purple-400/20 uppercase tracking-widest">
        <span>CORE INDEX: SYS_01</span>
        <span>JOURNAL ONLINE</span>
        <span>KERALA, IND</span>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative w-full pt-8 pb-20 sm:pt-10 sm:pb-28 bg-black z-30 overflow-hidden"
    >
      {/* Cybernetic Dotted Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-brand-purple/2 blur-[140px] pointer-events-none" />
      </div>

      <motion.div 
        style={{ opacity: contentOpacity }}
        className="relative w-full max-w-6xl mx-auto px-6 md:px-8 z-10"
      >
        
        {/* Cinematic Header Block */}
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
                Insights
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
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]">
              Insights
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-[1.6] max-w-lg font-normal tracking-wide mt-1"
          >
            Decoupled architecture, micro-animation paradigms, and Kerala’s digital journal.
          </motion.p>
        </div>

        {/* ─── ULTRA-PREMIUM ROTATING FEATURED CONTAINER ─── */}
        <Link
          href={`/blog/${slugify(featuredBlog.title)}`}
          className="block w-full"
        >
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full rounded-[2.5rem] p-[1.5px] overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/[0.04] hover:bg-transparent cursor-pointer shadow-[0_24px_80px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_28px_90px_-10px_rgba(139,92,246,0.22)]"
          >
          {/* Neon Conic-Spotlight Border Glow Tracer (Intensifies on Hover) */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.55), rgba(236, 72, 153, 0.28) 50%, transparent 80%)`,
              zIndex: 0,
            }}
          />

          {/* Symmetrical Glassmorphism Panel Body */}
          <div className="relative w-full rounded-[2.42rem] bg-[#070709]/92 backdrop-blur-2xl border border-white/5 overflow-hidden p-6 sm:p-8 md:p-10 z-10 flex flex-col justify-between">
            
            {/* Ambient Internal Spotlight Reflection */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
              style={{
                background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.035) 0%, transparent 85%)`
              }}
            />

            {/* Content Layout Grid (Oversized Image Dominance ~65-75% split) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center relative z-10">
              
              {/* Image Section (Dominates 8/12 = 66.6% on desktop) */}
              <div className="lg:col-span-8 w-full h-[240px] sm:h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-white/[0.03] shadow-inner relative group-hover:scale-[1.012] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none">
                
                {/* Framer Motion Blur-to-Focus Widescreen Image Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, filter: "blur(12px)", scale: 1.06 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(12px)", scale: 1.06 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {featuredBlog.images && featuredBlog.images.length > 0 ? (
                      <>
                        <Image
                          src={featuredBlog.images[0]}
                          alt={featuredBlog.title}
                          fill
                          unoptimized
                          className="object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-700 ease-out"
                          sizes="(max-width: 1024px) 100vw, 800px"
                          priority
                        />
                        {/* Cyber hologram mesh scanning layers */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_26px] z-10 pointer-events-none" />
                        <div className="absolute inset-x-6 top-6 bottom-6 border border-white/5 flex items-center justify-center z-10 pointer-events-none">
                          <div className="w-[90%] h-[90%] border border-white/[0.02]" />
                        </div>
                      </>
                    ) : (
                      renderFeaturedFallback()
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Elegant overlay vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />

              </div>

              {/* Text Section (Occupies 4/12 = 33.3% on desktop beside the image) */}
              <div className="lg:col-span-4 w-full h-full flex flex-col justify-end gap-8 min-h-[220px] md:min-h-[380px]">
                
                {/* Framer Motion Slide/Fade Text Content Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-3"
                  >
                    {/* Large Premium Apple-like Heading */}
                    <h3
                      className="text-white text-left font-semibold tracking-tight group-hover:text-purple-200 transition-colors duration-300 leading-[1.2] text-balance"
                      style={{
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "clamp(24px, 3.5vw, 36px)",
                        fontWeight: 600,
                      }}
                    >
                      {featuredBlog.title}
                    </h3>

                    {/* Meta details (Publish Date) */}
                    <div className="flex items-center gap-2.5 text-white/35 font-mono text-[9px] tracking-widest uppercase mb-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400/80" />
                      <span>{formattedDate.toUpperCase()}</span>
                    </div>

                    {/* Meta Description / Excerpt */}
                    <p className="text-white/40 leading-relaxed font-normal text-[13px] sm:text-[14px] group-hover:text-white/60 transition-colors duration-500 line-clamp-4 lg:line-clamp-6">
                      {featuredBlog.metaDescription || featuredBlog.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Footer Interaction & Indicators Row */}
                <div className="flex flex-col gap-5">
                  {/* Minimalistic Purple Link CTA */}
                  <div
                    className="group/btn flex items-center gap-1.5 text-sm text-[#a855f7] transition-colors duration-300 hover:text-purple-300 w-fit z-20 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300 text-[15px]">
                      →
                    </span>
                  </div>

                  {/* Elegant glowing progress indicators / navigation bar */}
                  <div className="flex items-center gap-2.5 select-none z-20 mt-2">
                    {blogs.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(idx);
                        }}
                        className="h-1.5 relative overflow-hidden rounded-full bg-white/10 transition-all duration-500 focus:outline-none"
                        style={{ width: idx === activeIndex ? "38px" : "8px" }}
                        title={`Go to slide ${idx + 1}`}
                      >
                        {/* Dynamic Growing Progress Overlay (Pauses on Hover) */}
                        {idx === activeIndex && (
                          <motion.div
                            key={`${activeIndex}-${isPaused}`}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: isPaused ? 999999 : 3, ease: "linear" }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </Link>

      </motion.div>

      {/* FULL-SCALE CINEMATIC READER MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#09090c] border border-white/10 p-6 md:p-10 select-text overflow-hidden shadow-2xl flex flex-col justify-between my-8 max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 hover:text-white transition-colors duration-300 z-50 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-grow pr-2 md:pr-4 scrollbar-thin">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[#a855f7]/70 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase mb-4 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5 MIN READ</span>
                  <span>&bull;</span>
                  <span>{new Date(selectedBlog.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</span>
                </div>

                {/* Article Header Image */}
                {selectedBlog.images && selectedBlog.images.length > 0 && (
                  <div className="relative w-full h-[220px] md:h-[300px] rounded-2xl overflow-hidden border border-white/5 mb-8 shadow-2xl">
                    <Image
                      src={selectedBlog.images[0]}
                      alt={selectedBlog.title}
                      fill
                      unoptimized
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Article Content */}
                <div className="flex flex-col gap-6">
                  <h2
                    className="text-white text-left leading-tight tracking-tight font-semibold text-balance"
                    style={{
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "clamp(22px, 3.8vw, 36px)",
                      fontWeight: 600,
                      textShadow: "0 0 20px rgba(255,255,255,0.02)"
                    }}
                  >
                    {selectedBlog.title}
                  </h2>

                  <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-white/50 font-normal tracking-wide italic border-l-2 border-purple-500/40 pl-4 py-1">
                    {selectedBlog.metaDescription}
                  </p>

                  <div className="w-full h-[1px] bg-white/[0.05]" />

                  <p className="text-[14px] sm:text-[15px] leading-[1.85] text-white/70 font-normal tracking-wide whitespace-pre-line">
                    {selectedBlog.description}
                  </p>
                </div>
              </div>

              {/* Reader Deck footer */}
              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono tracking-widest text-[#a855f7]/50 select-none">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400/70 animate-pulse" />
                  <span>MANZIO DIGITAL JOURNAL</span>
                </span>
                <span>SYSTEM SECURE</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default BlogSection;
