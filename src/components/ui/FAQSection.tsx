"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { apiService } from "@/utils/api";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ DATA CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface FAQItem {
  id?: number | string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What services does Manzio provide?",
    answer: "Manzio delivers full-stack development, cinematic web experiences, UI/UX design, branding, mobile applications, and scalable digital platforms for modern businesses."
  },
  {
    question: "Does Manzio build custom websites?",
    answer: "Yes. Every website and platform is custom-crafted to match the client’s business goals, brand identity, scalability needs, and user experience expectations."
  },
  {
    question: "Can Manzio develop mobile applications?",
    answer: "Manzio builds high-performance Android, iOS, and cross-platform mobile applications engineered for scalability, speed, and seamless user experiences."
  },
  {
    question: "Does Manzio provide UI/UX design services?",
    answer: "Yes. Manzio creates cinematic user interfaces and modern digital experiences focused on engagement, usability, and premium visual storytelling."
  },
  {
    question: "What technologies does Manzio use?",
    answer: "Manzio works with modern technologies including React, Next.js, Node.js, Django, Flutter, GSAP, Framer Motion, and scalable cloud-based architectures."
  },
  {
    question: "Can Manzio build scalable business platforms?",
    answer: "Yes. Manzio develops scalable digital ecosystems including SaaS platforms, eCommerce systems, admin dashboards, booking systems, and enterprise solutions."
  },
  {
    question: "Does Manzio offer long-term support and maintenance?",
    answer: "Yes. Manzio provides continuous support, optimization, upgrades, and long-term technical partnerships for digital products and platforms."
  },
  {
    question: "Why choose Manzio over traditional agencies?",
    answer: "Manzio combines cinematic storytelling, futuristic design systems, full-stack engineering, and scalable innovation to craft immersive digital experiences that stand apart."
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDIVIDUAL FAQ CARD SUB-COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface FAQCardProps {
  item: FAQItem;
  index: number;
}

function FAQCard({ item, index }: FAQCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const isExpanded = isHovered || isClicked;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full rounded-2xl p-[1px] overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none cursor-pointer ${
        isExpanded
          ? "bg-transparent shadow-[0_15px_45px_rgba(139,92,246,0.12)]"
          : "bg-white/[0.04] hover:bg-transparent"
      }`}
    >
      {/* 1. Sharp Outer Border Spotlight Tracer on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.45), rgba(236, 72, 153, 0.18) 50%, transparent 100%)`
        }}
      />

      {/* 2. Inner Card body Container */}
      <div
        className={`relative w-full h-full rounded-[15px] p-6 md:p-7 backdrop-blur-2xl transition-all duration-500 z-10 overflow-hidden ${
          isExpanded
            ? "bg-[#09090c]/90 border border-purple-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
            : "bg-[#060608]/75 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
        }`}
      >
        {/* Dynamic Card Internal Radial Spotlight Reflection */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), transparent 80%)`
          }}
        />

        {/* Content layout */}
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className={`font-mono text-[12px] sm:text-[13px] mt-[3px] tracking-wider shrink-0 transition-colors duration-300 ${
                isExpanded ? "text-purple-400" : "text-white/30 group-hover:text-purple-400/70"
              }`}>
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span
                className={`text-[14px] md:text-[15.5px] font-medium tracking-wide transition-colors duration-300 leading-snug ${
                  isExpanded ? "text-white" : "text-white/70 group-hover:text-white/95"
                }`}
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {item.question}
              </span>
            </div>

            {/* Toggle Circle/Plus Icon */}
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-500 shrink-0 ${
                isExpanded
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.25)]"
                  : "bg-white/[0.02] border-white/5 text-white/40 group-hover:text-white/70 group-hover:border-white/20"
              }`}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2]" />
              </motion.div>
            </div>
          </div>

          {/* Collapsible Answer */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -6, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="pt-5 border-t border-white/[0.04] mt-4"
                >
                  <p className="text-[13px] md:text-[14px] leading-relaxed text-white/50 font-normal tracking-wide">
                    {item.answer}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN FAQ SECTION COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_ITEMS);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    async function loadFAQs() {
      try {
        const fetchedFaqs = await apiService.getFAQs();
        if (fetchedFaqs && fetchedFaqs.length > 0) {
          setFaqs(fetchedFaqs);
        }
      } catch (err) {
        console.error("Failed to load FAQs, falling back to mock FAQs", err);
      }
    }
    loadFAQs();
  }, []);

  // Generate structured FAQ Schema data for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full pt-12 pb-20 sm:pt-16 sm:pb-28 bg-black z-30 overflow-hidden"
    >
      {/* Schema injection for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* ── 1. Cosmic Floating Background Particle Noise ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        {/* Dotted Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.008) 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />

        {/* Ambient Nebula Purple Glow (Organic Slow breathing) */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.08, 0.14, 0.08],
            x: [0, 10, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[140px] pointer-events-none"
        />

        {/* Ambient Nebula Violet Glow (Opposite corner) */}
        <motion.div
          animate={{
            scale: [1.1, 0.95, 1.1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-700/5 blur-[140px] pointer-events-none"
        />
      </div>

      {/* ── 2. Content Layout Container ── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative w-full max-w-6xl mx-auto px-6 md:px-8 z-10"
      >
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
                Knowledge Base
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
            Need{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.12)]">
              Answers?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-[1.6] max-w-lg font-normal tracking-wide mt-1"
          >
            Everything you need to know before building with Manzio.
          </motion.p>
        </div>

        {/* ── 3. Staggered FAQ Grid (Spacious, narrower centered grid configuration) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl mx-auto items-start mt-16 md:mt-24 w-full">
          {faqs.map((item, index) => (
            <FAQCard key={item.id || index} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
