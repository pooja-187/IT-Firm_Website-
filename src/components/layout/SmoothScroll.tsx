"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on refresh
    window.history.scrollRestoration = "manual";

    // Initialize Lenis with custom smooth scrolling settings
    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium cubic easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.02,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis to the requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Intercept anchor clicks for same-page smooth scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Same-page anchor scroll
      if (href.startsWith("#")) {
        const id = href.substring(1);
        const targetElement = document.getElementById(id);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -20, duration: 1.6 });
        }
      } 
      // Cross-page anchor scroll on the same domain
      else if (href.includes("/#")) {
        const [path, hash] = href.split("/#");
        const currentPath = window.location.pathname;
        if (currentPath === path || (currentPath === "/" && path === "")) {
          const targetElement = document.getElementById(hash);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement, { offset: -20, duration: 1.6 });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // Handle scrolling to hash when route/path changes (cross-page scroll anchor matching)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && lenisRef.current) {
      const targetId = hash.substring(1);
      
      // Delay slightly to let the route change finish mounting and rendering
      const timeoutId = setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement && lenisRef.current) {
          lenisRef.current.scrollTo(targetElement, { offset: -20, duration: 1.8 });
        }
      }, 400);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return <>{children}</>;
}
