"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * Isolated Kill Switch for controlled A/B performance testing:
 * Set to true to test video loading and playback.
 * Set to false to immediately fall back to the 44KB poster + black background.
 */
export const ENABLE_HERO_VIDEO = true;

export function HeroBackgroundVideo() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ENABLE_HERO_VIDEO) return;

    // Check accessibility: user prefers reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Check network constraints: Save-Data or slow 2G
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const conn = (navigator as unknown as {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      if (
        conn?.saveData ||
        conn?.effectiveType === "slow-2g" ||
        conn?.effectiveType === "2g"
      ) {
        return;
      }
    }

    // Schedule video initialization strictly during browser idle / safe time
    // so it NEVER contends with initial layout, FCP, or React hydration
    const scheduleLoad = () => {
      setShouldLoadVideo(true);
    };

    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as unknown as {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback(scheduleLoad, { timeout: 2500 });
    } else {
      // Fallback for Safari and browsers without requestIdleCallback
      timerId = setTimeout(scheduleLoad, 800);
    }

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        (window as unknown as {
          cancelIdleCallback: (id: number) => void;
        }).cancelIdleCallback(idleId);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  // When shouldLoadVideo becomes true, attempt smooth autoplay
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy; keep poster without error
        });
      }
    }
  }, [shouldLoadVideo]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none bg-black">
      {/* Layer 0: Solid black base to prevent any flash of unstyled content */}
      <div className="absolute inset-0 w-full h-full bg-black" />

      {/* Layer 1: High-fidelity static poster frame (44.3 KB)
          Available immediately on First Paint with zero blocking delay */}
      <img
        src="/videos/hero-poster.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Layer 2: HTML5 Video element
          Source attached only after idle schedule; fades in only after first frame decodes */}
      {ENABLE_HERO_VIDEO && shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setIsVideoPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out pointer-events-none select-none ${
            isVideoPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
