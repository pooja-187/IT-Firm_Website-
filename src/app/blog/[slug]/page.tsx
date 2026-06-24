"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User, MessageSquare } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";
import { apiService, Blog, Work } from "@/utils/api";
import { cn } from "@/utils/cn";

// Helper to convert blog titles to URL-safe slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [relatedProject, setRelatedProject] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlogData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all blogs from Django REST
        const allBlogs = await apiService.getBlogs();
        
        // 2. Find matching blog based on slugified title
        const currentBlog = allBlogs.find((b) => slugify(b.title) === slug);

        if (!currentBlog) {
          setError("The requested article could not be located in our archives.");
          setLoading(false);
          return;
        }

        setBlog(currentBlog);

        // 3. Select 3 related articles (excluding the current one)
        const others = allBlogs.filter((b) => b.id !== currentBlog.id).slice(0, 3);
        setRelatedBlogs(others);

        // 4. Fetch portfolio projects to bind related showcase project dynamically
        const fetchedProjects = await apiService.getWorks();
        if (fetchedProjects && fetchedProjects.length > 0) {
          // Bind first project as showcase or find category match
          const match = fetchedProjects.find(
            (p) => p.category.toLowerCase().includes(currentBlog.title.toLowerCase().substring(0, 4))
          );
          setRelatedProject(match || fetchedProjects[0]);
        }

      } catch (err: any) {
        console.error("Failed to load blog details:", err);
        setError("Unable to connect to the Manzio publishing server.");
      } finally {
        setLoading(false);
      }
    }

    loadBlogData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 border-2 border-purple-500/25 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="max-w-md text-center flex flex-col items-center z-10">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-red-400 uppercase font-sans mb-4">SYSTEM ERROR</span>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4" style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}>Article Not Found</h2>
          <p className="text-white/50 text-sm font-normal mb-8 leading-relaxed">{error || "The article is not currently active in our database."}</p>
          <button 
            onClick={() => router.push("/#blog")} 
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-semibold text-white tracking-widest uppercase transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Journal</span>
          </button>
        </div>
      </div>
    );
  }

  // Reading time extraction helper
  const wordsCount = blog.description ? blog.description.split(/\s+/).length : 120;
  const readingTime = Math.max(2, Math.ceil(wordsCount / 180));

  // Paragraph separator helper
  const paragraphs = blog.description ? blog.description.split(/\n+/).filter(p => p.trim()) : [];

  // Quote generator (Use the second or longest paragraph as an editorial highlight quote)
  const highlightQuote = paragraphs.length > 2 
    ? paragraphs[1].substring(0, 180) + "..." 
    : paragraphs[0]?.substring(0, 150) + "...";

  return (
    <div className="relative w-full bg-black text-white pt-36 pb-32 overflow-hidden select-none min-h-screen">
      

      <AppContainer>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Link 
              href="/#blog" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-purple-400 transition-colors duration-300 font-sans tracking-wide"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal</span>
            </Link>
          </motion.div>

          {/* 1. HERO SECTION */}
          <header className="mb-14 text-left">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-400 font-sans block mb-6"
            >
              Insights & Journal
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-bold leading-[1.1] tracking-tight mb-8 text-left"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "clamp(32px, 5.5vw, 62px)",
              }}
            >
              {blog.title}
            </motion.h1>

            {/* Subtle atmosphere descriptive line */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/60 font-normal text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mb-8"
            >
              Exploring visionary digital design systems, high-fidelity engineering models, and elegant brand experiences crafted at Manzio Studio.
            </motion.p>
          </header>

          {/* 2. FEATURED IMAGE FRAME */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden aspect-[21/9] rounded-[2.5rem] border border-white/[0.06] bg-[#07070a]/45 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-14 group"
          >
            {/* Ambient inner bloom glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none z-10" />
            
            {/* Parallax Image placement */}
            {blog.images && blog.images.length > 0 ? (
              <Image
                src={blog.images[0]}
                alt={blog.title}
                fill
                className="object-cover object-center transition-transform duration-[8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                sizes="(max-width: 1200px) 100vw, 1200vw"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-[#07070a] flex items-center justify-center">
                <span className="text-white/20 text-xs font-sans tracking-widest uppercase">No Visual Seeded</span>
              </div>
            )}

            {/* Coordinate telemetry overlays */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[8px] font-sans text-white/30 uppercase tracking-widest z-10 pointer-events-none">
              <span>LAT: 45.109N</span>
              <span>MANZIO JOURNAL OVERLAY</span>
              <span>LNG: 130.22E</span>
            </div>
          </motion.div>

          {/* 3. BLOG META INFO PILLES */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-16 border-b border-white/[0.04] pb-10"
          >
            <div className="px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-white/80 text-[10px] font-sans font-semibold tracking-wider uppercase flex items-center gap-2">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span>{blog.date}</span>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-white/80 text-[10px] font-sans font-semibold tracking-wider uppercase flex items-center gap-2">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>{readingTime} Min Read</span>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-white/80 text-[10px] font-sans font-semibold tracking-wider uppercase flex items-center gap-2">
              <User className="w-3 h-3 text-purple-400" />
              <span>Manzio Editorial</span>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-purple-500/5 border border-purple-500/15 text-purple-400 text-[10px] font-semibold font-sans tracking-wider uppercase ml-auto">
              Creative Strategy
            </div>
          </motion.div>

          {/* 4. EDITORIAL INTRO BLOCK (META DESCRIPTION) */}
          {blog.metaDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16 text-left max-w-4xl border-l-2 border-purple-500/30 pl-6 sm:pl-8 py-2"
            >
              <p 
                className="text-white/80 font-normal text-lg sm:text-xl md:text-2xl leading-relaxed text-pretty italic font-sans"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {blog.metaDescription}
              </p>
            </motion.div>
          )}

          {/* 5. MAIN ARTICLE CONTENT BODY */}
          <article className="max-w-3xl mx-auto mb-20 text-left">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.05 * (idx % 3), ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/60 font-normal text-base sm:text-[17px] leading-[1.8] sm:leading-[1.9] mb-8 tracking-wide font-sans text-pretty hover:text-white/85 transition-colors duration-500"
                >
                  {p}
                </motion.p>
              ))
            ) : (
              <p className="text-white/40 font-normal italic text-center py-10">No structured text content uploaded.</p>
            )}
          </article>

          {/* 6. CINEMATIC GLASS QUOTE SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative px-8 py-14 sm:px-14 sm:py-16 rounded-[2.5rem] bg-[#07070a]/40 backdrop-blur-xl border border-purple-500/22 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden mb-24 text-center group"
          >
            {/* Atmospheric Accent glow */}
            <div 
              className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-[1.2s] pointer-events-none -z-10"
              style={{
                background: "radial-gradient(500px circle at 50% 50%, rgba(139,92,246,0.12), transparent 70%)"
              }}
            />
            
            {/* Giant Quotation Mark */}
            <span className="absolute top-2 left-6 text-[160px] font-bold text-purple-500/5 leading-none select-none pointer-events-none font-serif">
              “
            </span>

            <p 
              className="text-white text-xl sm:text-2xl md:text-3xl font-normal italic leading-relaxed text-pretty max-w-2xl mx-auto mb-6 relative z-10 font-sans"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {highlightQuote}
            </p>
            
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400 font-sans block">
              — Highlight Principle / Manzio Studio Core
            </span>
          </motion.div>

          {/* 7. RELATED PORTFOLIO PROJECT CONNECTION CTA */}
          {relatedProject && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-28 text-left"
            >
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.25em] font-sans mb-8">
                Vision Applied / Integrated System
              </h3>
              
              <div className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-[2.5rem] bg-[#07070a]/40 backdrop-blur-xl border border-purple-500/22 hover:border-purple-500/45 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                
                {/* Image Frame */}
                <div className="md:col-span-6 relative overflow-hidden aspect-[16/10] rounded-[2rem] border border-white/[0.06] bg-[#07070a]/45 group-hover:border-purple-500/25 transition-all duration-500">
                  <Image
                    src={relatedProject.imageUrl || "/projects/dmc_automation.png"}
                    alt={relatedProject.title}
                    fill
                    className="object-cover object-center transition-transform duration-[5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.05]"
                    unoptimized
                  />
                </div>

                {/* Narrative Details */}
                <div className="md:col-span-6 flex flex-col justify-center items-start">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-purple-400 font-sans mb-3 block">
                    {relatedProject.category}
                  </span>
                  
                  <h4 
                    className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-4"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {relatedProject.title}
                  </h4>
                  
                  <p className="text-white/50 text-[13.5px] leading-relaxed font-normal mb-8 group-hover:text-white/70 transition-colors duration-500">
                    This cinematic system design strategy was fully implemented and deployed. Discover the mathematical alignments, spacing rules, and technical architectures in our case study documentation.
                  </p>

                  <Link
                    href="/work"
                    className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-[10px] font-semibold text-white tracking-widest uppercase transition-all duration-300 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 hover:border-purple-500/40"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </div>

              </div>
            </motion.section>
          )}

          {/* 8. RELATED ARTICLES ROW */}
          {relatedBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-28 text-left"
            >
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.25em] font-sans mb-8 border-b border-white/[0.04] pb-4">
                Keep Reading / Journal Archives
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((b) => {
                  const bSlug = slugify(b.title);
                  return (
                    <Link
                      key={b.id}
                      href={`/blog/${bSlug}`}
                      className="group relative flex flex-col gap-5 p-5 rounded-[2rem] bg-[#07070a]/40 border border-purple-500/22 hover:border-purple-500/45 transition-all duration-500 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(139,92,246,0.03)]"
                    >
                      {/* Image container */}
                      <div className="relative overflow-hidden aspect-[16/10] rounded-[1.5rem] border border-white/[0.06] bg-[#07070a]/45">
                        {b.images && b.images.length > 0 ? (
                          <Image
                            src={b.images[0]}
                            alt={b.title}
                            fill
                            className="object-cover object-center transition-transform duration-[5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.06]"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[#07070a]" />
                        )}
                      </div>

                      {/* Header Segment */}
                      <div className="flex flex-col items-start w-full">
                        <span className="text-[9px] font-normal text-white/40 uppercase tracking-widest font-sans mb-2 block">
                          {b.date}
                        </span>
                        
                        <h4 
                          className="text-white text-[16px] sm:text-[18px] font-semibold leading-tight group-hover:text-purple-300 transition-colors duration-500 line-clamp-2"
                          style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
                        >
                          {b.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* 9. FINAL CINEMATIC CTA SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative px-8 py-16 sm:px-16 sm:py-20 rounded-[3rem] bg-[#07070a]/40 border border-purple-500/22 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-center group"
          >
            {/* Atmospheric Accent Backing glow */}
            <div 
              className="absolute inset-0 opacity-30 group-hover:opacity-55 transition-opacity duration-[1.2s] pointer-events-none -z-10"
              style={{
                background: "radial-gradient(600px circle at 50% 50%, rgba(139,92,246,0.14), rgba(236,72,153,0.02) 50%, transparent 70%)"
              }}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400 font-sans block mb-6">
              Let's Co-Create
            </span>

            <h2 
              className="text-white text-3xl sm:text-4xl lg:text-[46px] font-semibold leading-tight tracking-tight mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 600 }}
            >
              Let's engineer your next digital experience.
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[11px] font-semibold text-white tracking-widest uppercase transition-all duration-300 bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/40 hover:border-purple-500/60 shadow-[0_4px_25px_rgba(168,85,247,0.12)] w-full sm:w-auto"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
              </Link>

              <Link
                href="/contact"
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[11px] font-semibold text-white/70 hover:text-white tracking-widest uppercase transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10 w-full sm:w-auto"
              >
                <span>Book Consultation</span>
              </Link>
            </div>
          </motion.section>

        </div>
      </AppContainer>
    </div>
  );
}
