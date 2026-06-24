"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

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

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[50rem] md:h-[65rem] flex flex-col items-center justify-start relative p-2 md:p-6 pt-4 md:pt-10"
      ref={containerRef}
    >
      <div
        className="py-4 md:py-10 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        // Apple iPad Pro photorealistic multi-level chassis bevels & drop shadows
        boxShadow:
          "0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 0 3px rgba(38, 38, 38, 1), 0 0 0 5px rgba(64, 64, 64, 1), 0 20px 40px rgba(0, 0, 0, 0.7), 0 45px 80px rgba(0, 0, 0, 0.6)",
      }}
      // Sleek landscape iPad Pro thin borders, rounded corners, and space grey backdrop
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full relative bg-neutral-950 p-[12px] md:p-[16px] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-visible"
    >
      {/* Front Camera Sensor Dot */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0d0d0d] ring-1 ring-zinc-800/40 z-30 flex items-center justify-center opacity-80">
        <div className="w-[2px] h-[2px] rounded-full bg-blue-900/60" />
      </div>

      {/* Screen container frame with nested aspect curves */}
      <div className="relative h-full w-full overflow-hidden rounded-[20px] md:rounded-[24px] bg-zinc-950 border border-white/[0.05]">
        {/* Subtle glass glossy reflections sweep overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] mix-blend-overlay z-20" />
        {children}
      </div>
    </motion.div>
  );
};
