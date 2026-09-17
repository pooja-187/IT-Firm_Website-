"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { cn } from "@/utils/cn";
import { Component as ParallaxScrollFeatureSection } from "@/components/ui/parallax-scroll-feature-section";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const PARALLAX_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1280&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Software engineering and development team collaborating",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Code editor and web development syntax",
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=1600&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Brand identity, typography and design system guidelines",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=900&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Full stack engineering and JavaScript application",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Digital marketing growth and analytics performance dashboard",
  },
  {
    src: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1280&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Frontend UI architecture and Vue React code",
  },
  {
    src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=600&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Python algorithms and machine learning code",
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full bg-[#050505] text-white overflow-x-clip">

      {/* ── HERO: ZoomParallax Showcase ── */}
      <section className="relative w-full">
        <ZoomParallax images={PARALLAX_IMAGES}>
          {/* Radial spotlight */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]",
              "blur-[30px]"
            )}
          />
          <h1 className="text-center text-4xl font-bold">
            Services crafted for Ambitious brands
          </h1>
        </ZoomParallax>
      </section>

      {/* ── TRANSITION TEXT CYCLE ── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#050505] px-6 text-center border-y border-white/[0.03]">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-400 mb-8 block">
            The Next Stage
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white/50 leading-tight tracking-tight" style={{ fontFamily: "Satoshi, sans-serif" }}>
            Your <AnimatedTextCycle 
                words={[
                    "business",
                    "team",
                    "workflow",
                    "future",
                    "productivity",
                    "projects",
                    "analytics",
                    "dashboard",
                    "platform"
                ]}
                interval={3000}
                className="text-purple-400 font-bold inline-block" 
            /> deserves better tools.
          </h2>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="relative w-full">
        <ParallaxScrollFeatureSection />
      </section>

      {/* ── CTA ── */}
      <section className="relative w-full py-36 md:py-52 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Pulsing ambient glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[400px] rounded-full pointer-events-none bg-purple-950/15 blur-[130px] -z-10"
        />

        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-400 mb-5 block"
        >
          Next Stage
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-5xl sm:text-6xl md:text-7xl tracking-tight font-bold mb-10"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Let&apos;s Build Something{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.25)] inline-block pb-2">
            Impossible.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/50 text-white font-medium shadow-[0_0_25px_rgba(168,85,247,0.12)] hover:shadow-[0_0_45px_rgba(168,85,247,0.28)] transition-all duration-300 group"
          >
            <span className="text-xs font-mono tracking-widest uppercase">
              Book Consultation
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
