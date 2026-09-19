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
    // Determine if the current device is touch-primary / mobile
    const isTouchOnly =
      window.matchMedia("(pointer: coarse) and (hover: none)").matches ||
      (("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
        window.innerWidth < 1024);

    // Scroll to top on refresh only on desktop where Lenis manages scroll
    if (!isTouchOnly) {
      window.history.scrollRestoration = "manual";
    }

    let rafId: number | null = null;
    let lenis: Lenis | null = null;

    // Only instantiate Lenis on desktop / mouse-driven environments
    if (!isTouchOnly) {
      lenis = new Lenis({
        duration: 1.45,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium cubic easing
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.02,
        syncTouch: false,
      });

      lenisRef.current = lenis;

      // Connect Lenis to the requestAnimationFrame loop
      const raf = (time: number) => {
        if (lenis) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      };

      rafId = requestAnimationFrame(raf);
    }

    // Helper for smooth scrolling to elements (works for both Lenis and native mobile)
    const scrollToElement = (element: HTMLElement, duration = 1.6) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: -20, duration });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Intercept anchor clicks for same-page smooth scroll on desktop only
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
          scrollToElement(targetElement, 1.6);
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
            scrollToElement(targetElement, 1.6);
          }
        }
      }
    };

    if (!isTouchOnly) {
      document.addEventListener("click", handleAnchorClick, { passive: false });
    }

    // Clean up on component unmount
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (!isTouchOnly) {
        document.removeEventListener("click", handleAnchorClick);
      }
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // Handle scrolling to hash when route/path changes (cross-page scroll anchor matching)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);

      // Delay slightly to let the route change finish mounting and rendering
      const timeoutId = setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetElement, {
              offset: -20,
              duration: 1.8,
            });
          } else {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 400);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return <>{children}</>;
}
