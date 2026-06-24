"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingDeck() {
  const pathname = usePathname();

  if (pathname === "/chat") return null;
  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 flex flex-col gap-3 sm:gap-4 z-50">
      <motion.a
        href="tel:+919495929458"
        aria-label="Call Us"
        animate={{
          scale: [1, 1.025, 1],
          boxShadow: [
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 12px 0px rgba(59,130,246,0.08)",
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 20px 4px rgba(59,130,246,0.22)",
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 12px 0px rgba(59,130,246,0.08)",
          ],
          borderColor: [
            "rgba(255,255,255,0.03)",
            "rgba(59,130,246,0.2)",
            "rgba(255,255,255,0.03)"
          ]
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.7), 0 0 25px 6px rgba(59,130,246,0.35)",
          borderColor: "rgba(59,130,246,0.45)",
          color: "#60a5fa"
        }}
        transition={{
          scale: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          boxShadow: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          borderColor: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          default: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }}
        className="w-9 h-9 sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-xl bg-black/45 sm:bg-black/60 border border-white/5 text-neutral-400 hover:text-white transition-colors duration-300 shadow-2xl backdrop-blur-md cursor-pointer"
      >
        <Phone className="w-4 h-4 sm:w-[19px] sm:h-[19px]" />
      </motion.a>

      {/* WhatsApp Icon */}
      <motion.a
        href="https://wa.me/919495929458"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Chat"
        animate={{
          scale: [1, 1.025, 1],
          boxShadow: [
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 12px 0px rgba(34,197,94,0.08)",
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 16px 2px rgba(34,197,94,0.22)",
            "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 12px 0px rgba(34,197,94,0.08)",
          ],
          borderColor: [
            "rgba(255,255,255,0.03)",
            "rgba(34,197,94,0.2)",
            "rgba(255,255,255,0.03)"
          ]
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.7), 0 0 25px 6px rgba(34,197,94,0.35)",
          borderColor: "rgba(34,197,94,0.45)",
          color: "#4ade80"
        }}
        transition={{
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          boxShadow: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          borderColor: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          default: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }}
        className="w-9 h-9 sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-xl bg-black/45 sm:bg-black/60 border border-white/5 text-neutral-400 hover:text-white transition-colors duration-300 shadow-2xl backdrop-blur-md cursor-pointer"
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 sm:w-[19px] sm:h-[19px]"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
      </motion.a>
    </div>
  );
}
export default FloatingDeck;
