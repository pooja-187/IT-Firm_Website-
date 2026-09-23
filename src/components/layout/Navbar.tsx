"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useScroll as useFramerScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";
import { useScroll } from "@/hooks/useScroll";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Clients", href: "/clients" },
];


export function Navbar() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined" && (window as any).__isNavOpen) {
      return true;
    }
    return false;
  });
  const [activeLink, setActiveLink] = useState("Home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const isScrolled = useScroll(20);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__reactNavHydrated = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__isNavOpen = isOpen;
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    if (pathname === "/about") {
      setActiveLink("About Us");
    } else if (pathname === "/services") {
      setActiveLink("Services");
    } else if (pathname === "/work") {
      setActiveLink("Work");
    } else if (pathname.startsWith("/blog")) {
      setActiveLink("Blog");
    } else if (pathname === "/clients") {
      setActiveLink("Clients");
    } else if (pathname === "/") {
      setActiveLink("Home");
    }
  }, [pathname]);

  const lastToggleRef = React.useRef(0);
  const toggleMenu = (e?: React.SyntheticEvent) => {
    if (e) {
      if (e.type === "pointerdown" || e.type === "touchstart") {
        e.preventDefault();
      }
    }
    const now = Date.now();
    if (now - lastToggleRef.current < 150) return;
    lastToggleRef.current = now;
    setIsOpen((prev) => !prev);
  };

  // Responsive device tracker with lazy initial check to avoid mount re-render
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion Scroll-Linked Spring Animation Engine
  const { scrollY } = useFramerScroll();
  const rawProgress = useTransform(scrollY, [0, 150], [0, 1]);
  const progress = useSpring(rawProgress, { stiffness: 90, damping: 20 });

  // Spring-Linked Style Transformations
  const width = useTransform(progress, [0, 1], ["95%", "80%"]);
  const py = useTransform(progress, [0, 1], ["14px", "8px"]);
  const px = useTransform(progress, [0, 1], ["24px", "14px"]);
  
  // Backdrop blur amount mapping
  const blurVal = useTransform(progress, [0, 1], [14, 22]);
  const backdropFilter = useMotionTemplate`blur(${blurVal}px)`;
  
  // Border gradient alpha mapping
  const borderAlpha = useTransform(progress, [0, 1], [0.10, 0.18]);
  const border = useMotionTemplate`1px solid rgba(180,120,255,${borderAlpha})`;

  // Outer ambient shadow depth variables mapping
  const shadowAlphaPurple = useTransform(progress, [0, 1], [0.12, 0.22]);
  const shadowAlphaBlack = useTransform(progress, [0, 1], [0.65, 0.85]);
  const shadowAlphaGlow = useTransform(progress, [0, 1], [0.04, 0.10]);
  const boxHeightOffset = useTransform(progress, [0, 1], [24, 16]);
  const boxBlur = useTransform(progress, [0, 1], [60, 40]);
  const boxShadow = useMotionTemplate`0 ${boxHeightOffset}px ${boxBlur}px -15px rgba(139,92,246,${shadowAlphaPurple}), 0 20px 50px rgba(0,0,0,${shadowAlphaBlack}), 0 0 40px -10px rgba(180,120,255,${shadowAlphaGlow}), inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 1px rgba(0,0,0,0.85)`;

  // Inner element proportional scaling
  const logoScale = useTransform(progress, [0, 1], [1, 0.93]);
  const ctaScale = useTransform(progress, [0, 1], [1, 0.94]);
  const linksGap = useTransform(progress, [0, 1], ["24px", "14px"]);

  // Synchronized Logo Transition Interpolations
  const fullLogoOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const fullLogoScale = useTransform(progress, [0, 0.55], [1, 0.92]);
  const fullLogoBlur = useTransform(progress, [0, 0.55], [0, 4]);
  const fullLogoFilter = useMotionTemplate`blur(${fullLogoBlur}px)`;

  const monoLogoOpacity = useTransform(progress, [0.45, 1], [0, 1]);
  const monoLogoScale = useTransform(progress, [0.45, 1], [0.85, 1]);
  const monoLogoBlur = useTransform(progress, [0.45, 1], [4, 0]);
  const monoLogoFilter = useMotionTemplate`blur(${monoLogoBlur}px)`;

  // Non-layout-thrashing scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Framer Motion Animation Variants for mobile menu overlay, drawer list, and individual links
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.18,
        ease: "easeOut" as const,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  } as const;

  const drawerVariants = {
    closed: {
      opacity: 0,
      y: -12,
      scale: 0.99,
      transition: {
        duration: 0.15,
        ease: "easeOut" as const,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  } as const;

  const linkVariants = {
    closed: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.1,
        ease: "easeOut" as const,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  } as const;

  const footerVariants = {
    closed: {
      opacity: 0,
      y: 8,
      transition: {
        duration: 0.1,
        ease: "easeOut" as const,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        delay: 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  } as const;

  const navStyle = isMobile
    ? {
        width: "95%",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        background: `linear-gradient(
          90deg,
          rgba(8,8,10,0.92) 0%,
          rgba(30,30,35,0.82) 35%,
          rgba(55,35,85,0.18) 50%,
          rgba(30,30,35,0.82) 65%,
          rgba(8,8,10,0.92) 100%
        )`,
        border: "1px solid rgba(180,120,255,0.12)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 16px 40px -15px rgba(139,92,246,0.15), 0 20px 50px rgba(0,0,0,0.7)",
      }
    : {
        width,
        paddingTop: py,
        paddingBottom: py,
        paddingLeft: px,
        paddingRight: px,
        background: `linear-gradient(
          90deg,
          rgba(8,8,10,0.92) 0%,
          rgba(30,30,35,0.82) 35%,
          rgba(55,35,85,0.18) 50%,
          rgba(30,30,35,0.82) 65%,
          rgba(8,8,10,0.92) 100%
        )`,
        border,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        boxShadow,
      };

  if (pathname === "/chat") return null;

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out flex justify-center",
          isScrolled ? "pt-3 md:pt-4" : "pt-6 md:pt-8"
        )}
      >
        {/* Main Floating Navbar Pill */}
        <motion.nav
          className="rounded-full flex items-center justify-between relative"
          style={navStyle}
        >
          {/* Subtle glow layer behind the pill */}
          <div className="absolute inset-0 rounded-full opacity-40 blur-xl pointer-events-none transition-all duration-500 -z-10 bg-gradient-to-r from-brand-purple/0 via-brand-pink/5 to-brand-purple/0 group-hover:via-brand-pink/10" />

          {/* Left: Brand Logo */}
          <motion.div
            style={{ scale: isMobile ? 1 : logoScale, originX: 0 }}
            className="flex items-center z-10 w-[140px] md:w-[160px]"
          >
            <Link
              href="/"
              onClick={() => setActiveLink("Home")}
              className="relative flex items-center w-full h-[18px] md:h-[22px]"
            >
              {/* Full Branding Logo */}
              <motion.div
                style={{
                  opacity: isMobile ? 1 : fullLogoOpacity,
                  scale: isMobile ? 1 : fullLogoScale,
                  filter: isMobile ? "none" : fullLogoFilter,
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 origin-left flex items-center pointer-events-none"
              >
                <Image
                  src="/logo.png?v=3"
                  alt="Manzio Creative Studio"
                  width={100}
                  height={30}
                  className="h-[18px] md:h-[22px] w-auto object-contain"
                  style={{ width: "auto" }}
                  unoptimized
                  priority
                />
              </motion.div>

              {/* Minimal Monogram Logo */}
              <motion.div
                style={{
                  opacity: isMobile ? 0 : monoLogoOpacity,
                  scale: isMobile ? 1 : monoLogoScale,
                  filter: isMobile ? "none" : monoLogoFilter,
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 origin-left flex items-center pointer-events-none"
              >
                <Image
                  src="/monogram.png"
                  alt="Manzio Monogram Logo"
                  width={22}
                  height={22}
                  className="h-[18px] md:h-[22px] w-auto object-contain"
                  style={{ width: "auto" }}
                  unoptimized
                  priority
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Center: Interactive Desktop Links */}
          <motion.div 
            className="hidden lg:flex items-center relative"
            style={{ gap: linksGap }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.label;
              const isHovered = hoveredLink === link.label;
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveLink(link.label)}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 rounded-full whitespace-nowrap",
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  )}
                >
                  {/* Sliding active capsule background */}
                  {isActive && (
                    <motion.span
                      layoutId="navbarActiveTab"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/5 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Subtle hover background highlight */}
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="navbarHoverTab"
                      className="absolute inset-0 rounded-full bg-white/[0.04] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </motion.div>

          {/* Right: Glow CTA button */}
          <motion.div 
            style={{ scale: ctaScale, originX: 1 }}
            className="hidden md:flex items-center justify-end w-[140px] md:w-[160px]"
          >
            <Link
              href="/contact"
              className="group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-full px-4 h-9 text-[11px] font-semibold text-white tracking-widest uppercase transition-all duration-300 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#a855f7]/40 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(124,58,237,0.15)]"
            >
              {/* Shiny Glass Reflection (Top Highlight) */}
              <span className="absolute inset-0 z-0 bg-gradient-to-b from-white/12 via-white/5 to-transparent pointer-events-none" />
              
              {/* Glow backdrop drop-shadow */}
              <span className="absolute inset-0 bg-brand-purple/15 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-all duration-500 -z-10" />

              {/* Interactive glowing gradient overlay on hover */}
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-[#7c3aed]/10 to-[#db2777]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10 flex items-center gap-1">
                {"Let's Talk"}
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>

          {/* Mobile Drawer Trigger Menu Button with 0ms Touch Response */}
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onPointerDown={toggleMenu}
            onClick={toggleMenu}
            aria-label="Toggle navigation drawer"
            style={{ touchAction: "manipulation" }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 lg:hidden hover:border-brand-purple/60 hover:bg-neutral-900 cursor-pointer select-none relative z-[60]",
              isOpen && "border-brand-pink/50 bg-black/60"
            )}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </motion.nav>
      </div>

      {/* Futuristic Responsive Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              touchAction: "pan-y",
              transform: "translate3d(0,0,0)",
              willChange: "opacity, transform",
            }}
            className="fixed inset-0 z-50 bg-[#060608]/95 backdrop-blur-md pt-16 pb-8 px-6 flex flex-col justify-between lg:hidden overflow-y-auto overscroll-contain"
          >
            {/* Ambient visual background glow for mobile */}
            <div
              className="absolute top-[20%] left-1/2 -translate-x-1/2 h-[260px] w-[260px] rounded-full pointer-events-none -z-10"
              style={{
                background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.06) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-[10%] right-[-10%] h-[200px] w-[200px] rounded-full pointer-events-none -z-10"
              style={{
                background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.16) 0%, rgba(236, 72, 153, 0.05) 45%, transparent 70%)",
              }}
            />

            <div className="flex flex-col gap-6 mt-0">
              <motion.div
                variants={drawerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-3.5"
              >
                {/* Back button header */}
                <motion.div variants={linkVariants} className="pb-2 border-b border-white/[0.06] flex items-center justify-between">
                  <button
                    type="button"
                    onPointerDown={toggleMenu}
                    onClick={toggleMenu}
                    className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 hover:text-white transition-all duration-300 py-1.5 px-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-brand-purple/40 backdrop-blur-md cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-white/60 group-hover:text-brand-purple group-hover:-translate-x-0.5 transition-all duration-300" />
                    <span>Back</span>
                  </button>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium">Navigation</span>
                </motion.div>

                {NAV_LINKS.map((link) => {
                  const isActive = activeLink === link.label;
                  return (
                    <motion.div key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => {
                          setActiveLink(link.label);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "group flex items-center justify-between text-2xl font-medium tracking-wide py-1 transition-all",
                          isActive 
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink font-semibold" 
                            : "text-text-secondary hover:text-white"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_#ec4899]" />}
                          {link.label}
                        </span>
                        <ArrowUpRight className="h-5 w-5 text-neutral-700 opacity-60 group-hover:text-brand-purple group-hover:opacity-100 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Mobile Drawer Footer Contacts */}
            <motion.div
              variants={footerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col gap-6 border-t border-neutral-900 pt-6"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted">
                  {"Kerala’s Leading Software Builders"}
                </span>
                <a
                  href="mailto:info@manziostudio.com"
                  className="text-base font-semibold text-white hover:text-brand-purple transition-colors"
                >
                  info@manziostudio.com
                </a>
              </div>
              
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink py-3 text-center text-sm font-semibold text-white shadow-[0_8px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_10px_25px_rgba(139,92,246,0.35)] transition-all"
              >
                {"Let's Talk"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
