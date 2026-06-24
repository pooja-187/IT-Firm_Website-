"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, ArrowRight, CornerDownLeft, Bot, CheckCircle2, ChevronRight } from "lucide-react";

// Contextual conversation branching data tree
const FLOW_DATA: Record<string, {
  q1: string;
  options1: string[];
  q2: string;
  options2: string[];
  recommendation: {
    techStack: string[];
    focus: string;
    timeline: string;
    suggestion: string;
  }
}> = {
  "Startup Website": {
    q1: "A startup's digital presence must instantly captivate and convert. What is the primary objective of your new website?",
    options1: ["Brand Awareness & Impact", "Lead Generation", "Product Showcase & Demos", "Investor Pitch Readiness"],
    q2: "Fascinating. Visual storytelling and fast page loading are critical. What aesthetic direction best aligns with your brand?",
    options2: ["Ultra-Minimalist & Clean", "Dark Mode & High-Fidelity Motion", "Corporate & Boldly Informative", "Vibrant & Interactive"],
    recommendation: {
      techStack: ["Next.js frontend framework", "Framer Motion animation libraries", "Tailwind CSS utilities", "Headless CMS (Sanity / Storyblok)"],
      focus: "Fast visual load speeds, seamless viewport animations, and sharp Satoshi/Inter typography grids.",
      timeline: "4 to 6 weeks",
      suggestion: "Optimize landing page bundle weights to maintain Google Lighthouse performance metrics above 95."
    }
  },
  "SaaS Platform": {
    q1: "Excellent choice. Creating a SaaS platform requires a scalable and highly responsive strategy. What stage of development are you currently in?",
    options1: ["Just an Idea", "MVP Planning", "Scaling Existing Product", "Redesigning Current Platform"],
    q2: "Understood. Speed-to-market and visual differentiation are critical. What is your primary feature focus?",
    options2: ["User Dashboards & Analytics", "AI Integrations & APIs", "Subscription & Payments", "Real-Time Collaboration"],
    recommendation: {
      techStack: ["Next.js (React) frontend framework", "FastAPI or Django (Python) backend", "PostgreSQL database with Redis caching", "Vercel or AWS cloud deployment"],
      focus: "Responsive user dashboards, clean database schemas, and modular API structures.",
      timeline: "8 to 12 weeks for a production-ready MVP release",
      suggestion: "Focus purely on core user value first. Get analytics in early to track user retention."
    }
  },
  "Mobile Application": {
    q1: "Crafting a premium mobile app requires smooth performance and native responsiveness. Which target platform is your priority?",
    options1: ["iOS & Android (Cross-Platform)", "iOS Native", "Android Native", "Progressive Web App (PWA)"],
    q2: "Excellent. Let's talk about the visual identity. What type of interface aesthetics are you aiming for?",
    options2: ["Fluid Micro-Animations & Dark Mode", "Minimalist Clean Light Mode", "Complex Data & Dashboard Heavy", "Custom Brand-Centric UI"],
    recommendation: {
      techStack: ["React Native (Expo framework)", "Tailwind CSS / NativeWind styling", "Node.js / FastAPI backend API", "PostgreSQL with Supabase integration"],
      focus: "Sleek screen transition timings, responsive touch controls, and resilient local data caching.",
      timeline: "10 to 14 weeks",
      suggestion: "Use Expo Go to distribute live interactive mockups during your early team validation rounds."
    }
  },
  "AI Product": {
    q1: "Developing an AI-driven product demands robust processing capabilities and an intuitive user interface. What type of AI technology is central to your vision?",
    options1: ["Generative AI & LLMs", "Predictive Analytics & ML Models", "Computer Vision & Processing", "Custom API Integrations"],
    q2: "Understood. The bridge between AI power and user experience is crucial. How will your users primarily interact with the AI?",
    options2: ["Conversational Interface / Chat", "Dashboard & Insights Panels", "Automated Background Workflows", "API Integrations & SDKs"],
    recommendation: {
      techStack: ["Python backend (FastAPI / PyTorch)", "Next.js (React) web app", "Vercel AI SDK integration", "Pinecone / pgvector vector databases", "OpenAI / Anthropic APIs"],
      focus: "Optimizing API latency, rendering fast text streaming responses, and displaying responsive visual parameters.",
      timeline: "10 to 16 weeks",
      suggestion: "Design high-fidelity loading micro-animations and stream text outputs to keep users engaged during latency."
    }
  },
  "Ecommerce Platform": {
    q1: "A premium ecommerce ecosystem must balance bulletproof transaction security with beautiful product presentation. What scale of inventory are you planning?",
    options1: ["Boutique Curated Store (1-50 products)", "Mid-Size Catalog (50-500 products)", "Enterprise Marketplace (500+ products)", "Digital Goods & Subscriptions"],
    q2: "Perfect. To support this scale, what is your preferred storefront integration system?",
    options2: ["Headless Commerce (Shopify API)", "Custom Built Cart & Checkout", "SaaS Platforms (Shopify/WooCommerce)", "Substack or Subscription Engine"],
    recommendation: {
      techStack: ["Next.js Headless storefront framework", "Shopify Storefront GraphQL API", "Stripe payment gateway", "Tailwind CSS"],
      focus: "Fast static site generation for lists, frictionless stripe checkout streams, and secure inventory syncs.",
      timeline: "8 to 12 weeks",
      suggestion: "Decoupling store presentation (headless) ensures peak load performance even during flash sale spikes."
    }
  },
  "Branding System": {
    q1: "A premium brand identity communicates trust, vision, and visual excellence. What is the scope of branding needed?",
    options1: ["Complete Identity (Logo, Colors, Fonts, Assets)", "Visual & Interactive Styleguides", "Logo & Logo Mark Refinement", "Brand Strategy & Positioning"],
    q2: "Excellent. Let's align on the emotional tone. How should your brand feel to the audience?",
    options2: ["Futuristic, Tech-Driven & Bold", "Elegant, High-End & Editorial", "Clean, Friendly & Accessible", "Organic, Human & Grounded"],
    recommendation: {
      techStack: ["Vector brand manuals", "Modular digital Figma style guides", "Premium font families (Satoshi/Outfit)", "Custom motion guidelines"],
      focus: "Unified visual spacing rules, high-contrast digital logo marks, and beautiful typographical structures.",
      timeline: "3 to 5 weeks",
      suggestion: "Build custom micro-animated logo assets to let your brand mark react organically on web loading screens."
    }
  },
  "Enterprise Dashboard": {
    q1: "Enterprise systems must make complex data digestible, ultra-fast, and secure. What is the primary data requirement?",
    options1: ["Real-Time Data Streams & Websockets", "Heavy Interactive Charts & Reports", "User Access Controls & Permissions", "Multi-Source API Aggregations"],
    q2: "Got it. Let's talk about scalability. How many concurrent users do you expect to support?",
    options2: ["Internal Team (<100 users)", "Growing Organization (100-5000 users)", "Global Enterprise (5000+ users)", "Undecided"],
    recommendation: {
      techStack: ["React / Next.js frontend framework", "shadcn/ui + Tailwind CSS components", "Go / Rust microservices backend", "ClickHouse or PostgreSQL databases"],
      focus: "Zero-latency data sorting, optimized dashboard grid caching, and highly strict secure access scopes.",
      timeline: "12 to 18 weeks",
      suggestion: "Utilize canvas-based charting libraries (e.g. Recharts or D3) to maintain fast rendering of dense graphs."
    }
  },
  "Something Else": {
    q1: "A unique vision requires a custom strategy. What is the primary domain of your idea?",
    options1: ["FinTech & Web3", "HealthTech & Med", "Creative / Portfolio Showcase", "IoT & Hardware Integration"],
    q2: "Intriguing. Let's talk about target timeline. When are you looking to launch this custom solution?",
    options2: ["ASAP (<1 month)", "Standard Strategy (2-4 months)", "Long-term Development (6+ months)", "Just researching"],
    recommendation: {
      techStack: ["Tailored stack selection based on consultation parameters", "Custom system architecture diagrams", "Technical API blueprints"],
      focus: "In-depth scoping workshops, custom data integrations, and modular proof-of-concept components.",
      timeline: "Calculated dynamically during interactive scoping sessions",
      suggestion: "Schedule a scoping workshop with our technical directors to map out a clear feature roadmap and project blueprint."
    }
  }
};

const STARTER_CATEGORIES = Object.keys(FLOW_DATA);

interface AIStrategistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIStrategistModal({ isOpen, onClose }: AIStrategistModalProps) {
  // Conversation Engine States
  const [currentStep, setCurrentStep] = useState<number>(0); 
  // 0: Welcome, 1: Category Selected (Stage Question), 2: Stage Selected (Feature Question), 3: Feature Selected (AI Recommendation), 4: Final CTA Form Active, 5: Submitted Ingestion
  
  const [category, setCategory] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [feature, setFeature] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Lead Capture Form States
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock scroll on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Starter Category Choice
  const handleCategorySelect = (selectedCat: string) => {
    setCategory(selectedCat);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(1);
    }, 850);
  };

  // Handle Step 1 Choice (Stage / Objective)
  const handleStageSelect = (selectedStage: string) => {
    setStage(selectedStage);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(2);
    }, 850);
  };

  // Handle Step 2 Choice (Feature / Aesthetic)
  const handleFeatureSelect = (selectedFeature: string) => {
    setFeature(selectedFeature);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(3);
    }, 1100);
  };

  // Handle CTA Button Selection
  const handleCtaClick = (ctaLabel: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(4);
    }, 700);
  };

  // Handle Inline Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5);
    }, 1500);
  };

  // Reset entire conversation
  const resetChat = () => {
    setCurrentStep(0);
    setCategory(null);
    setStage(null);
    setFeature(null);
    setLeadName("");
    setLeadEmail("");
  };

  // Framer Motion Animation Variants for clean slides
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const slideTransition = {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 w-full h-full bg-black/95 z-[9999] flex flex-col overflow-hidden font-sans"
      >
        {/* ── 1. Fractal Noise Overlay ── */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay select-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* ── 2. Cinematic Radial Atmosphere Glows ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div
            className="absolute top-[-15%] right-[-15%] w-[1000px] h-[1000px] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
              filter: "blur(140px)",
            }}
          />
          <div
            className="absolute bottom-[-15%] left-[-15%] w-[1000px] h-[1000px] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.04) 0%, transparent 70%)",
              filter: "blur(140px)",
            }}
          />
        </div>

        {/* ── 3. Header Architecture ── */}
        <header className="relative z-10 w-full px-6 sm:px-12 py-5 sm:py-6 border-b border-white/[0.04] flex items-center justify-between backdrop-blur-md bg-black/30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Glowing cybernetic orb */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              Manzio AI
            </span>
          </div>

          <h2 className="text-white font-medium text-[13.5px] tracking-wider uppercase font-display hidden sm:block">
            Manzio AI Strategist
          </h2>

          <button
            onClick={onClose}
            aria-label="Close AI Strategist"
            className="flex items-center justify-center h-9 w-9 rounded-full border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* ── 4. Main Single Screen Content Wrapper ── */}
        <div className="relative z-10 flex-grow w-full overflow-hidden flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl px-6 py-6 flex flex-col justify-center items-center min-h-[calc(100vh-140px)] relative">
            <AnimatePresence mode="wait">
              {isTyping ? (
                // Immersive full-screen strategist thinking state
                <motion.div
                  key="strategist-typing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-5 text-center absolute"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-500/[0.02] border border-purple-500/10 flex items-center justify-center text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 animate-pulse">
                    {currentStep === 0 && "Ingesting coordinates..."}
                    {currentStep === 1 && "Formulating scoping query..."}
                    {currentStep === 2 && "Generating blueprint parameters..."}
                    {currentStep === 3 && "Initializing secure parameters..."}
                    {currentStep === 4 && "Locking consultation database..."}
                  </span>
                </motion.div>
              ) : (
                // Stateful Slide Wizard
                <>
                  {currentStep === 0 && (
                    // Screen 0: Starter Category Choice
                    <motion.div
                      key="step-welcome"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-4xl"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-500/[0.03] border border-purple-500/10 flex items-center justify-center mb-8 text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] shrink-0">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>

                      <h1 
                        className="text-white tracking-tight leading-[1.1] text-balance mb-5 max-w-3xl text-center"
                        style={{
                          fontFamily: "Satoshi, sans-serif",
                          fontSize: "clamp(34px, 5.2vw, 68px)",
                          fontWeight: 700
                        }}
                      >
                        What are you building?
                      </h1>

                      <p className="text-neutral-400 text-[14px] sm:text-[15.5px] leading-relaxed max-w-lg mb-12 text-center">
                        Tell us about your vision, and we’ll guide you toward the right digital system and technology parameters.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 w-full">
                        {STARTER_CATEGORIES.map((cat, idx) => (
                          <button
                            key={cat}
                            onClick={() => handleCategorySelect(cat)}
                            className="px-6 py-4 rounded-xl text-left bg-neutral-950/60 border border-white/[0.04] hover:border-purple-500/25 text-neutral-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] cursor-pointer group flex flex-col justify-between h-[105px]"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400/80 group-hover:text-purple-300">
                              {`0${idx + 1}`}
                            </span>
                            <div className="flex items-center justify-between w-full mt-2">
                              <span className="text-[12px] sm:text-[13px] font-semibold font-sans tracking-wide">
                                {cat}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && category && (
                    // Screen 1: Stage / Objective Question
                    <motion.div
                      key="step-q1"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-2xl text-center"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">
                        {category.toUpperCase()} &middot; PARAMETER 01
                      </span>

                      <h2 
                        className="text-white tracking-tight leading-[1.2] text-balance mb-10 max-w-xl font-display font-semibold"
                        style={{ fontSize: "clamp(24px, 3.5vw, 42px)" }}
                      >
                        {FLOW_DATA[category].q1}
                      </h2>

                      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full max-w-lg">
                        {FLOW_DATA[category].options1.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleStageSelect(opt)}
                            className="px-6 py-3.5 rounded-full bg-neutral-950/70 border border-white/[0.04] hover:border-purple-500/35 hover:bg-purple-500/5 text-neutral-300 hover:text-white transition-all duration-300 text-[12.5px] sm:text-[13px] font-semibold tracking-wide cursor-pointer flex-grow sm:flex-grow-0"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && category && (
                    // Screen 2: Feature / Aesthetic Question
                    <motion.div
                      key="step-q2"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-2xl text-center"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">
                        {category.toUpperCase()} &middot; {stage?.toUpperCase()} &middot; PARAMETER 02
                      </span>

                      <h2 
                        className="text-white tracking-tight leading-[1.2] text-balance mb-10 max-w-xl font-display font-semibold"
                        style={{ fontSize: "clamp(24px, 3.5vw, 42px)" }}
                      >
                        {FLOW_DATA[category].q2}
                      </h2>

                      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full max-w-lg">
                        {FLOW_DATA[category].options2.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleFeatureSelect(opt)}
                            className="px-6 py-3.5 rounded-full bg-neutral-950/70 border border-white/[0.04] hover:border-purple-500/35 hover:bg-purple-500/5 text-neutral-300 hover:text-white transition-all duration-300 text-[12.5px] sm:text-[13px] font-semibold tracking-wide cursor-pointer flex-grow sm:flex-grow-0"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && category && (
                    // Screen 3: Strategic Blueprint Output
                    <motion.div
                      key="step-rec"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-3xl text-left"
                    >
                      <div className="w-full bg-[#07070a]/60 border border-purple-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col gap-6 w-full max-w-2xl mx-auto">
                        <div className="flex items-center gap-2.5 border-b border-white/[0.05] pb-4">
                          <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                            Custom Strategic Blueprint
                          </span>
                        </div>

                        {/* Tech Stack List */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Suggested Stack Blueprint
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1.5">
                            {FLOW_DATA[category].recommendation.techStack.map((tech) => (
                              <div key={tech} className="flex items-start gap-2 text-neutral-300 text-[12.5px] sm:text-[13px]">
                                <span className="text-purple-400 mt-1 shrink-0 select-none">▪</span>
                                <span>{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Focus & Timeline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/[0.05]">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                              Core Performance Focus
                            </span>
                            <span className="text-neutral-300 text-[12.5px] sm:text-[13px] leading-relaxed">
                              {FLOW_DATA[category].recommendation.focus}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                              Estimated Timeline
                            </span>
                            <span className="text-purple-400 font-semibold text-[13px] sm:text-[13.5px] leading-relaxed">
                              {FLOW_DATA[category].recommendation.timeline}
                            </span>
                          </div>
                        </div>

                        {/* Advice */}
                        <div className="flex flex-col gap-1 pt-4 border-t border-white/[0.05]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Strategic Guidance
                          </span>
                          <span className="text-neutral-300 text-[12.5px] leading-relaxed italic">
                            {FLOW_DATA[category].recommendation.suggestion}
                          </span>
                        </div>
                      </div>

                      {/* Final CTA options */}
                      <div className="mt-8 flex flex-col items-center gap-4 w-full text-center">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Would you like to continue with our team?
                        </span>
                        <div className="flex flex-wrap gap-2.5 justify-center">
                          {["Book a Call", "Get Proposal", "Schedule Consultation"].map((cta) => (
                            <button
                              key={cta}
                              onClick={() => handleCtaClick(cta)}
                              className="px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 hover:border-purple-500/50 text-white transition-all duration-300 text-xs font-semibold tracking-wider uppercase cursor-pointer"
                            >
                              {cta}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    // Screen 4: Ingestion Parameters Form
                    <motion.div
                      key="step-form"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-md text-center"
                    >
                      <h2 
                        className="text-white tracking-tight leading-tight mb-3 font-display font-semibold"
                        style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
                      >
                        Initialize Protocol
                      </h2>

                      <p className="text-neutral-400 text-[13px] sm:text-[14px] leading-relaxed mb-8 max-w-sm">
                        Please enter your identity coordinates below to lock in your strategy session.
                      </p>

                      <form 
                        onSubmit={handleFormSubmit}
                        className="w-full flex flex-col gap-4"
                      >
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Your Name / Organization"
                          className="w-full bg-[#050507]/60 border border-white/[0.05] focus:border-purple-500/40 rounded-xl px-5 py-3.5 text-[13.5px] outline-none text-white placeholder-white/20 font-sans transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.06)]"
                        />

                        <input
                          type="email"
                          required
                          disabled={isSubmitting}
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="Secure Email Address"
                          className="w-full bg-[#050507]/60 border border-white/[0.05] focus:border-purple-500/40 rounded-xl px-5 py-3.5 text-[13.5px] outline-none text-white placeholder-white/20 font-sans transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.06)]"
                        />

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans py-4 rounded-xl font-semibold text-[13px] uppercase tracking-wider border border-white/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.22)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>Syncing Coordinates...</span>
                            </>
                          ) : (
                            <>
                              <span>Initialize Strategy Session</span>
                              <CornerDownLeft className="w-3.5 h-3.5 text-white/80" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    // Screen 5: Parameter Ingestion Success
                    <motion.div
                      key="step-success"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={slideTransition}
                      className="flex flex-col items-center w-full max-w-md text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_25px_rgba(139,92,246,0.15)] shrink-0">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>

                      <h2 
                        className="text-white tracking-tight leading-tight mb-4 font-display font-semibold"
                        style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
                      >
                        Transmission Scheduled
                      </h2>

                      <p className="text-neutral-400 text-[13.5px] leading-relaxed mb-8 max-w-sm">
                        Your strategic coordinates have been securely ingested. An engineering director will synchronize with you at <span className="text-white font-semibold">{leadEmail}</span> within 24 hours.
                      </p>

                      <div className="flex gap-4">
                        <button
                          onClick={resetChat}
                          className="px-5 py-2.5 rounded-full bg-[#07070a] border border-white/10 hover:border-purple-500/30 text-white font-semibold tracking-wider text-xs uppercase transition-all duration-300 cursor-pointer"
                        >
                          Restart Scoping
                        </button>
                        <button
                          onClick={onClose}
                          className="px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 text-white font-semibold tracking-wider text-xs uppercase transition-all duration-300 cursor-pointer"
                        >
                          Close Strategist
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
