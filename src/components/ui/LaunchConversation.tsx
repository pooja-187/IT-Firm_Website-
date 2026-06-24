"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";

export function LaunchConversation() {
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Mouse spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth light reflection
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);

  // Magnetic Button coordinates
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const buttonSpringX = useSpring(buttonX, { stiffness: 120, damping: 15 });
  const buttonSpringY = useSpring(buttonY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Spotlight follows cursor inside container
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Magnetic pull for CTA button
    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distanceX = e.clientX - btnCenterX;
      const distanceY = e.clientY - btnCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < 180) {
        const pullFactor = 0.25;
        const maxPull = 30;
        buttonX.set(Math.min(Math.max(distanceX * pullFactor, -maxPull), maxPull));
        buttonY.set(Math.min(Math.max(distanceY * pullFactor, -maxPull), maxPull));
      } else {
        buttonX.set(0);
        buttonY.set(0);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsContainerHovered(false);
    setIsHovered(false);
    buttonX.set(0);
    buttonY.set(0);
  };

  // Spotlight radial gradient background
  const bgSpotlight = useMotionTemplate`radial-gradient(500px circle at ${smoothX}px ${smoothY}px, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.03) 45%, transparent 100%)`;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-16 pb-28 sm:pt-20 sm:pb-36 bg-black z-30 overflow-hidden flex flex-col items-center justify-center border-t border-white/[0.03]"
    >
      {/* 1. Cybernetic Subtle Dotted Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] select-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* 2. Interactive Spotlight Gradient (follows cursor) */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-700 ease-out"
        style={{
          background: bgSpotlight,
          opacity: isContainerHovered ? 1 : 0
        }}
      />

      {/* 3. Deep Atmospheric Breathing Glow Nebula (Static organic pulse behind) */}
      <motion.div
        className="absolute w-[600px] h-[350px] rounded-full pointer-events-none -z-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.015) 40%, transparent 70%)",
          filter: "blur(60px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 4. Subtle Floating Cinematic Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/40 blur-[1px]"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + (i * 13) % 80}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <AppContainer>
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-6 sm:px-8 gap-8 sm:gap-10">
          
          {/* Sub-header Sparkle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
              Gateway to Compounding
            </span>
          </motion.div>

          {/* Massive Cinematic Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-center leading-[1.1] tracking-tight font-bold text-balance max-w-3xl"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(36px, 5.8vw, 76px)",
              fontWeight: 700,
              textShadow: "0 0 40px rgba(255,255,255,0.015)"
            }}
          >
            Let's Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 font-bold drop-shadow-[0_0_15px_rgba(168,85,247,0.18)]">
              Impossible.
            </span>
          </motion.h2>

          {/* Supported subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/45 text-[14px] sm:text-[16px] leading-[1.65] max-w-lg font-normal tracking-wide"
          >
            Engineering cinematic digital experiences for ambitious brands.
          </motion.p>

          {/* Premium Magnetic CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4"
          >
            <motion.a
              ref={buttonRef}
              href="/contact"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                x: buttonSpringX,
                y: buttonSpringY,
              }}
              className="group relative inline-flex items-center justify-center rounded-full cursor-pointer shadow-[0_12px_40px_-8px_rgba(139,92,246,0.15)] hover:shadow-[0_16px_48px_-6px_rgba(139,92,246,0.3)] transition-all duration-300"
            >
              {/* Inner Button Body */}
              <div className="relative z-10 bg-neutral-950 text-white rounded-full px-8 py-3.5 sm:px-10 sm:py-4.5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-2">
                <span className="text-[14px] md:text-[15.5px] font-semibold tracking-wide">
                  Start the Conversation
                </span>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </motion.a>
          </motion.div>

        </div>
      </AppContainer>
    </section>
  );
}
