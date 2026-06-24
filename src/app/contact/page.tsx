"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Send, CheckCircle2, Sparkles } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";

const PROJECT_TYPES = [
  "Web Development",
  "UI/UX Design",
  "Mobile Apps",
  "Full Stack Systems",
  "AI & Automation",
  "Branding & Motion"
];

const BUDGET_RANGES = [
  "<$5k",
  "$5k - $15k",
  "$15k - $50k",
  "$50k+"
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Web Development",
    budget: "$15k - $50k",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Mouse spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Button
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const btnSpringY = useSpring(btnY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distX = e.clientX - btnCenterX;
      const distY = e.clientY - btnCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 150) {
        btnX.set(distX * 0.2);
        btnY.set(distY * 0.2);
      } else {
        btnX.set(0);
        btnY.set(0);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError("");
    }
  };

  const selectProjectType = (type: string) => {
    setFormData(prev => ({ ...prev, projectType: type }));
  };

  const selectBudget = (range: string) => {
    setFormData(prev => ({ ...prev, budget: range }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid secure email address.");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (accessKey) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New Project Ingestion Protocol from ${formData.name}`,
            from_name: "Manzio Website Portal",
            to: "info@manziostudio.com",
            name: formData.name,
            email: formData.email,
            projectType: formData.projectType,
            budget: formData.budget,
            message: formData.message
          })
        });

        const result = await response.json();
        if (result.success) {
          setSubmitted(true);
          setFormData({
            name: "",
            email: "",
            projectType: "Web Development",
            budget: "$15k - $50k",
            message: ""
          });
        } else {
          setEmailError(result.message || "Failed to transmit parameters. Please try again or email us directly.");
        }
      } catch (err) {
        setEmailError("Network transmission error. Please check your connection or email us directly.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Fallback/Simulate premium server ingestion for dev/local testing without env key
      console.warn("Web3Forms Access Key not detected (NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY). Falling back to mock submission.");
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          projectType: "Web Development",
          budget: "$15k - $50k",
          message: ""
        });
      }, 1800);
    }
  };

  const bgSpotlight = useMotionTemplate`radial-gradient(550px circle at ${smoothX}px ${smoothY}px, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.02) 45%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        btnX.set(0);
        btnY.set(0);
      }}
      className="relative w-full text-white pt-36 pb-32 overflow-hidden z-10 select-none min-h-screen"
      style={{ backgroundColor: "#050505" }}
    >
      {/* INTERACTIVE MOUSE SPOTLIGHT */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-700 ease-out"
        style={{
          background: bgSpotlight,
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-20">
        <div
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.07) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.05) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <AppContainer>
        <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 md:px-8 gap-16 lg:gap-24 relative z-10">
          
          {/* LEFT: INTRO TEXT BLOCK */}
          <div className="flex flex-col lg:w-5/12 justify-center">
            {/* Breadcrumbs Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-xs font-normal text-white/30 mb-6 font-sans tracking-wide"
            >
              <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-white/60">Contact</span>
            </motion.div>

            {/* Micro Top Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.02] px-3.5 py-1 backdrop-blur-md mb-6 w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Let's Talk
              </span>
            </motion.div>

            {/* Giant Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white leading-[1.1] tracking-tight mb-8 text-left"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "clamp(34px, 5vw, 64px)",
                fontWeight: 700,
              }}
            >
              Let's Build<br />
              Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold drop-shadow-[0_0_15px_rgba(168,85,247,0.22)]">
                Obsessive.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/50 text-[15px] sm:text-base leading-relaxed max-w-lg mb-6 text-pretty"
            >
              Have a digital system or cinematic experience you want to engineer? Fill out the portal parameters and our core engineering unit will synchronize with you within 24 hours.
            </motion.p>

            {/* Premium cinematic Talk with Assistant button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <Link
                href="/chat"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 h-11 text-[11px] font-semibold text-white tracking-widest uppercase transition-all duration-300 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#a855f7]/40 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(124,58,237,0.15)] w-fit cursor-pointer"
              >
                {/* Shiny glass highlight */}
                <span className="absolute inset-0 bg-gradient-to-b from-white/12 via-white/3 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  Talk with Assistant
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>

            {/* Quick Contacts */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6 text-[13.5px] border-t border-white/[0.05] pt-10"
            >
              <div>
                <span className="text-white/30 block mb-1 uppercase tracking-[0.12em] text-[10px] font-semibold">General Inquiries</span>
                <a href="mailto:info@manziostudio.com" className="text-white hover:text-purple-400 transition-colors duration-300 font-medium">
                  info@manziostudio.com
                </a>
              </div>
              <div>
                <span className="text-white/30 block mb-1 uppercase tracking-[0.12em] text-[10px] font-semibold">Studio Hub</span>
                <span className="text-white/60">Kerala, India &middot; Distributed globally</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: CONTACT FORM MODULE */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-7/12 w-full relative"
          >
            {submitted ? (
              // Success Screen
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-[#07070a]/45 backdrop-blur-xl border border-purple-500/20 rounded-[2.2rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 text-purple-400 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-4 font-sans tracking-tight">Transmission Received</h3>
                <p className="text-white/50 text-[14px] leading-relaxed max-w-md mb-8">
                  Your project coordinates have been securely ingested into the Manzio core pipeline. An engineering officer will connect with you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold uppercase tracking-widest text-purple-400 hover:text-white transition-colors duration-300 border-b border-purple-400/20 hover:border-white"
                >
                  Submit Another Ingestion
                </button>
              </motion.div>
            ) : (
              // Form Interface
              <form 
                onSubmit={handleSubmit}
                className="w-full bg-[#07070a]/45 backdrop-blur-xl border border-white/[0.05] hover:border-purple-500/25 rounded-[2.2rem] p-8 sm:p-10 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-8 relative overflow-hidden"
              >
                {/* Subtle top inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none rounded-[2.2rem]" />
                
                {/* 1. Project Type Selector */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">1. Select Project Coordinates</span>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {PROJECT_TYPES.map((type) => {
                      const selected = formData.projectType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => selectProjectType(type)}
                          className={`px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wide border transition-all duration-300 ${
                            selected
                              ? "bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.12)]"
                              : "bg-[#050507]/60 border-white/[0.05] text-white/50 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Budget Selector */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">2. Anticipated Investment</span>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {BUDGET_RANGES.map((range) => {
                      const selected = formData.budget === range;
                      return (
                        <button
                          key={range}
                          type="button"
                          onClick={() => selectBudget(range)}
                          className={`px-5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wide border transition-all duration-300 ${
                            selected
                              ? "bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.12)]"
                              : "bg-[#050507]/60 border-white/[0.05] text-white/50 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Text inputs */}
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">3. Parameters & Scope</span>
                  
                  {/* Name field */}
                  <div className="relative group/input w-full">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Ident Name / Company Name"
                      className="w-full bg-[#050507]/60 border border-white/[0.05] group-hover/input:border-white/10 focus:border-purple-500/40 rounded-xl px-5 py-3.5 text-[13.5px] outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.06),inset_0_1px_1px_rgba(255,255,255,0.02)] text-white placeholder-white/25 placeholder:font-normal font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div className="relative group/input w-full flex flex-col gap-1.5">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Secure Email Address"
                      className={`w-full bg-[#050507]/60 border ${emailError ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.05] group-hover/input:border-white/10 focus:border-purple-500/40'} rounded-xl px-5 py-3.5 text-[13.5px] outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.06),inset_0_1px_1px_rgba(255,255,255,0.02)] text-white placeholder-white/25 placeholder:font-normal font-sans`}
                    />
                    {emailError && (
                      <span className="text-[11.5px] text-red-400 font-sans pl-1">
                        {emailError}
                      </span>
                    )}
                  </div>

                  {/* Message field */}
                  <div className="relative group/input w-full">
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Outline project bounds, features, and desired timeline..."
                      className="w-full bg-[#050507]/60 border border-white/[0.05] group-hover/input:border-white/10 focus:border-purple-500/40 rounded-xl px-5 py-3.5 text-[13.5px] outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.06),inset_0_1px_1px_rgba(255,255,255,0.02)] text-white placeholder-white/25 placeholder:font-normal font-sans resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-4 flex flex-col items-center">
                  <motion.button
                    ref={buttonRef}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      x: btnSpringX,
                      y: btnSpringY
                    }}
                    className="relative group/btn w-full flex items-center justify-center rounded-xl overflow-hidden cursor-pointer shadow-[0_8px_30px_-6px_rgba(139,92,246,0.18)] hover:shadow-[0_12px_40px_-4px_rgba(139,92,246,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans py-4 font-semibold text-[13.5px] uppercase tracking-[0.15em] border border-white/10"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Uploading Parameters...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Initialize Protocol</span>
                        <Send className="w-3.5 h-3.5 text-white/80 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </AppContainer>
    </div>
  );
}
