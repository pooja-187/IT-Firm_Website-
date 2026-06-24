"use client" 

import * as React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/utils/cn"
 
export interface MagicTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  wordClassName?: string;
}
 
interface WordProps {
  children: string;
  progress: any;
  range: number[];
  className?: string;
}
 
const Word: React.FC<WordProps> = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0, 1]);
 
  return (
    <span className={cn("relative select-text", className)}>
      <span className="absolute opacity-20 pointer-events-none select-none">{children}</span>
      <motion.span style={{ opacity: opacity }} className="select-text">{children}</motion.span>
    </span>
  );
};
 
export const MagicText: React.FC<MagicTextProps> = ({ text, className = "", wordClassName = "", ...props }) => {
  const container = useRef(null);
 
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });
  const words = text.split(" ");
 
  return (
    <p ref={container} className={cn("flex flex-wrap justify-center text-center leading-[0.5] p-4", className)} {...props}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
 
        return (
          <Word 
            key={i} 
            progress={scrollYProgress} 
            range={[start, end]} 
            className={wordClassName || "mt-[12px] mr-1 text-3xl font-semibold"}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};
