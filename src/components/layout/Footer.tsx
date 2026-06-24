"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = {
  social: [
    { label: "Instagram", href: "https://www.instagram.com/manzio__/#" },
    { label: "Linkedin", href: "https://in.linkedin.com/company/manzio-creative-studio" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname === "/chat") return null;

  return (
    <footer className="relative w-full bg-gradient-to-b from-black via-[#03010a] to-[#070214] pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden border-t border-white/[0.02] z-30">
      
      {/* 1. Deep Atmospheric Purple Glow (Static luxury diffusion) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-purple-900/[0.07] blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-900/[0.04] blur-[110px] pointer-events-none -z-10" />

      {/* 2. Cybernetic Dotted Grid Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] select-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <Container size="xl" className="flex flex-col gap-0 relative z-10">
        
        {/* 3. Upper Footer - Exact Layout and Spacing from Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-12 items-start w-full pb-20 border-b border-white/[0.03]">
          
          {/* Column 1: Studio Terminal & Statement */}
          <div className="flex flex-col gap-5 lg:col-span-5 xl:col-span-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 block">
              STUDIO TERMINAL
            </span>
            <h2 
              className="text-white text-[26px] sm:text-[30px] md:text-[34px] leading-[1.25] tracking-tight max-w-lg"
              style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700 }}
            >
              Crafting digital experiences for the next generation.
            </h2>
            <p className="text-white/40 text-xs sm:text-[13px] leading-relaxed max-w-md font-normal tracking-wide mt-1">
              We design and construct high-fidelity digital interfaces, brand systems, and immersive web experiences for forward-thinking global brands.
            </p>
          </div>

          {/* Column 2: Connect */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 block">
              CONNECT
            </span>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-normal text-white/45 tracking-wide hover:text-white transition-colors duration-300 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Studio Base */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 block">
              STUDIO BASE
            </span>
            <div className="flex flex-col gap-5 text-[13px] font-normal text-white/40 tracking-wide leading-relaxed">
              <div>
                <span className="text-white/60 font-medium block">Kerala, India</span>
                <span className="text-[10px] text-white/35 font-sans tracking-wider uppercase block mt-1">DIGITAL ENGINEERING HUB</span>
              </div>
              <div>
                <span className="text-white/60 font-medium block">Distributed Studio</span>
                <span className="text-[10px] text-white/35 font-sans tracking-wider uppercase block mt-1">GLOBAL COLLABORATIVE UNIT</span>
              </div>
            </div>
          </div>

          {/* Column 4: General Inquiries */}
          <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-1 lg:text-right lg:items-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 block">
              GENERAL INQUIRIES
            </span>
            <a
              href="mailto:info@manziostudio.com"
              className="group inline-flex items-center gap-1 text-[13px] font-normal text-white/60 hover:text-white transition-colors duration-300"
            >
              <span className="border-b border-white/10 group-hover:border-white transition-colors duration-300">
                info@manziostudio.com
              </span>
              <span className="text-purple-400 font-sans text-[10px] ml-0.5">↗</span>
            </a>
          </div>

        </div>

        {/* 4. Editorial Lower Footer Metadata Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-12 text-[11px] font-sans text-white/30 tracking-widest">
          
          {/* Copyright info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>&copy; {currentYear} MANZIO STUDIO. ALL RIGHTS RESERVED.</span>
            <span className="hidden md:inline text-white/[0.08] font-normal">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">PRIVACY POLICY</Link>
            <span className="text-white/[0.08] font-normal">&bull;</span>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">TERMS OF SERVICE</Link>
          </div>

        </div>

      </Container>
    </footer>
  );
}
