"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

/**
 * Isolated Kill Switch for controlled A/B performance testing:
 * Set to true  -> restore original ContainerScroll 3D tilt + work video.
 * Set to false -> static header only, zero animation, zero video download.
 */
export const ENABLE_WORK_DEVICE_TILT = true;

interface WorkDeviceTiltProps {
  titleComponent: React.ReactNode;
}

export function WorkDeviceTilt({ titleComponent }: WorkDeviceTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [0.92, 0.88];
  };

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [20, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : scaleDimensions()
  );
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -100]
  );

  if (!ENABLE_WORK_DEVICE_TILT) {
    return null;
  }

  return (
    <div
      className="h-[32rem] sm:h-[38rem] md:h-[50rem] lg:h-[54rem] flex flex-col items-center justify-start relative p-0 pt-0"
      ref={containerRef}
    >
      <div
        className="pt-0 pb-4 md:pb-8 w-full relative"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          style={{ translateY: translate }}
          className="max-w-4xl mx-auto text-center"
        >
          {titleComponent}
        </motion.div>

        <DeviceCard rotate={rotate} translate={translate} scale={scale}>
          <video
            ref={videoRef}
            key="/videos/work_video_dynamic.mp4"
            src="/videos/work_video_dynamic.mp4"
            className="w-full h-full object-cover rounded-2xl"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <source src="/videos/work_video_dynamic.mp4" type="video/mp4" />
          </video>
        </DeviceCard>
      </div>
    </div>
  );
}

function DeviceCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        willChange: "transform",
        isolation: "isolate",
        boxShadow:
          "0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 0 3px rgba(38, 38, 38, 1), 0 0 0 5px rgba(64, 64, 64, 1), 0 20px 40px rgba(0, 0, 0, 0.7), 0 45px 80px rgba(0, 0, 0, 0.6)",
      }}
      className="max-w-3xl lg:max-w-4xl -mt-2 sm:-mt-6 md:-mt-10 mx-auto h-[14rem] sm:h-[22rem] md:h-[28rem] lg:h-[32rem] w-full relative bg-neutral-950 p-[12px] md:p-[14px] lg:p-[16px] rounded-[24px] md:rounded-[36px] shadow-2xl overflow-visible"
    >
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0d0d0d] ring-1 ring-zinc-800/40 z-30 flex items-center justify-center opacity-80">
        <div className="w-[2px] h-[2px] rounded-full bg-blue-900/60" />
      </div>

      <div
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        className="relative h-full w-full overflow-hidden rounded-[20px] md:rounded-[24px] bg-zinc-950 border border-white/[0.05]"
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] z-20" />
        {children}
      </div>
    </motion.div>
  );
}
