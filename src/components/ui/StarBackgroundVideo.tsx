"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * Isolated Kill Switch for controlled A/B performance testing:
 * Set to true to test original star background video loading and playback.
 * Set to false to immediately fall back to the 32.9KB poster + black background.
 */
export const ENABLE_STAR_BACKGROUND_VIDEO = true;

export function StarBackgroundVideo() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Viewport Preload Trigger via IntersectionObserver
  // The video element is NOT mounted and NO bytes are requested until
  // the section approaches within 600px of the viewport.
  useEffect(() => {
    if (!ENABLE_STAR_BACKGROUND_VIDEO) return;

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

    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          console.log("[StarVideo Timeline] Preload trigger intersected (~600px approach). Attaching video source...");
          setShouldLoadVideo(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "600px 0px 600px 0px" }
    );

    preloadObserver.observe(container);

    return () => {
      preloadObserver.disconnect();
    };
  }, []);

  // 2. Playback Control via Viewport IntersectionObserver
  // Automatically plays when actively visible in viewport;
  // pauses when scrolled out of view to conserve CPU/battery.
  useEffect(() => {
    if (!shouldLoadVideo) return;

    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        const video = videoRef.current;
        if (!video) return;

        if (isVisible) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay prevented; poster remains visible
            });
          }
        } else {
          video.pause();
        }
      },
      { rootMargin: "0px", threshold: 0.05 }
    );

    playbackObserver.observe(container);

    return () => {
      playbackObserver.disconnect();
    };
  }, [shouldLoadVideo]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black"
      style={{ zIndex: 0 }}
    >
      {/* Layer 0: Solid black base */}
      <div className="absolute inset-0 w-full h-full bg-black" />

      {/* Layer 1: High-fidelity static poster frame (32.9 KB)
          Available immediately on First Paint with zero blocking delay */}
      <img
        src="/videos/stars-poster.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Layer 2: Original 52.3 MB HTML5 Video element
          Mounted ONLY when section approaches within 600px of viewport;
          fades in seamlessly only after the first usable frame is decoding */}
      {ENABLE_STAR_BACKGROUND_VIDEO && shouldLoadVideo && (
        <video
          ref={videoRef}
          src="/videos/stars-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => {
            console.log("[StarVideo Timeline] Video onPlaying fired. Fading in over poster.");
            setIsVideoPlaying(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out pointer-events-none select-none ${
            isVideoPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
