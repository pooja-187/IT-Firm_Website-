"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Sparkles, Send, ArrowRight, CornerDownLeft, Bot, User, CheckCircle2, Home, ArrowUp, RefreshCw } from "lucide-react";
import { AppContainer } from "@/components/ui/AppContainer";

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

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  type?: "text" | "recommendation" | "form" | "success";
  recommendation?: {
    techStack: string[];
    focus: string;
    timeline: string;
    suggestion: string;
  };
  options?: string[];
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Conversation Engine States
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); 
  // 0: Welcome / Starter options, 1: Category Selected (Stage Q), 2: Stage Selected (Feature Q), 3: Feature Selected (AI recommendation), 4: Lead Form, 5: Success Ingest
  
  const [category, setCategory] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [feature, setFeature] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");

  // Lead Capture Form States
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize greeting bubble
  useEffect(() => {
    setIsTyping(true);
    const welcomeTimer = setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: "welcome-1",
          sender: "ai",
          text: "Welcome to Manzio Creative Studio. I am your custom AI digital strategist.",
        },
        {
          id: "welcome-2",
          sender: "ai",
          text: "Let's align your project coordinates. Choose what you are planning to build below or type your custom idea directly in our chat feed.",
          options: STARTER_CATEGORIES
        }
      ]);
    }, 1000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  // Autoscroll to bottom of container
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Starter Category Choice
  const handleCategorySelect = (selectedCat: string) => {
    setCategory(selectedCat);
    
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `I am planning to build a ${selectedCat}.`
    };
    setMessages(prev => {
      // Strip options from previous messages to keep UI clean
      const cleaned = prev.map(m => ({ ...m, options: undefined }));
      return [...cleaned, userMsg];
    });
    
    setCurrentStep(1);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = FLOW_DATA[selectedCat].q1;
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponse,
        options: FLOW_DATA[selectedCat].options1
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  // Handle Step 1 Choice (Stage / Objective)
  const handleStageSelect = (selectedStage: string) => {
    setStage(selectedStage);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `We are currently in the stage of: ${selectedStage}.`
    };
    setMessages(prev => {
      const cleaned = prev.map(m => ({ ...m, options: undefined }));
      return [...cleaned, userMsg];
    });
    
    setCurrentStep(2);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (!category) return;
      const aiResponse = FLOW_DATA[category].q2;
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponse,
        options: FLOW_DATA[category].options2
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  // Handle Step 2 Choice (Feature / Aesthetic)
  const handleFeatureSelect = (selectedFeature: string) => {
    setFeature(selectedFeature);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `Our primary focal parameter is: ${selectedFeature}.`
    };
    setMessages(prev => {
      const cleaned = prev.map(m => ({ ...m, options: undefined }));
      return [...cleaned, userMsg];
    });
    
    setCurrentStep(3);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (!category) return;
      const rec = FLOW_DATA[category].recommendation;
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Understood. Based on your project parameters, our engineering unit has formulated a custom strategic roadmap blueprint for your scope.`,
        type: "recommendation",
        recommendation: rec,
        options: ["Book a Call", "Get Proposal", "Schedule Consultation"]
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  // Handle CTA Button Selection
  const handleCtaClick = (ctaLabel: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `I want to proceed with: ${ctaLabel}.`
    };
    setMessages(prev => {
      const cleaned = prev.map(m => ({ ...m, options: undefined }));
      return [...cleaned, userMsg];
    });
    
    setCurrentStep(4);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Excellent choice. Let's initialize your strategy session parameters inside our scoping directory. Please enter your name and secure email in the ingestion form below.`,
        type: "form"
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1100);
  };

  // Handle Inline Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Transmission securely received. Your strategic parameters have been cataloged under ID: MNZ-${Math.floor(1000 + Math.random() * 9000)}. Our engineering unit will synchronize with you at ${leadEmail} within 24 hours.`,
        type: "success"
      };
      setMessages(prev => {
        const cleaned = prev.map(m => ({ ...m, type: m.type === "form" ? "text" : m.type }));
        return [...cleaned, aiMsg];
      });
    }, 1600);
  };

  // Reset entire conversation
  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Scoping session reset. Choose what you are planning to build below or type your custom idea directly."
      },
      {
        id: `welcome-2-${Date.now()}`,
        sender: "ai",
        text: "Let's align your project coordinates. Select what you are planning to build to initiate the scoping protocol.",
        options: STARTER_CATEGORIES
      }
    ]);
    setCurrentStep(0);
    setCategory(null);
    setStage(null);
    setFeature(null);
    setLeadName("");
    setLeadEmail("");
  };

  // Intelligent Client-Side NLP message routing
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = userInput.trim();
    if (!query) return;

    // Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query
    };
    
    setMessages(prev => {
      const cleaned = prev.map(m => ({ ...m, options: undefined }));
      return [...cleaned, userMsg];
    });
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const normalizedQuery = query.toLowerCase();

      // FAQ Routes
      if (normalizedQuery.includes("pricing") || normalizedQuery.includes("cost") || normalizedQuery.includes("price") || normalizedQuery.includes("rate") || normalizedQuery.includes("charge")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "At Manzio, every digital asset is custom-designed and engineered. Investments are tailored to scope depth, timeline, and feature complexity. If you scope your project coordinates with me by choosing a starting category below, I can generate a tailored stack recommendation, timeline, and technical advice immediately!",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      if (normalizedQuery.includes("service") || normalizedQuery.includes("do you do") || normalizedQuery.includes("capabilities") || normalizedQuery.includes("offer") || normalizedQuery.includes("expert")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Manzio is a high-fidelity creative studio specializing in: Software Development, UI/UX Designing, Web Development, Digital Marketing, and Branding. We fuse cinematic design systems with robust, high-performance clean code. Would you like to map out a custom strategy for one of these capabilities?",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      if (normalizedQuery.includes("process") || normalizedQuery.includes("how you work") || normalizedQuery.includes("step") || normalizedQuery.includes("method")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Our studio operates across 5 visual phases: 01 Discover (Scoping & strategy), 02 Design (UI/UX systems), 03 Develop (Scalable Next.js frontends & secure backends), 04 Launch (Production bundler deployment), and 05 Grow (Compound growth marketing). Select a category below and we can begin discovery right here!",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      if (normalizedQuery.includes("portfolio") || normalizedQuery.includes("work") || normalizedQuery.includes("case study") || normalizedQuery.includes("clients") || normalizedQuery.includes("shipped")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "We have shipped over 350+ projects globally for brands like Travinno, Open Visas, Laundremaison, and Eucalia Glamps. We focus on blazing fast load speeds, smooth transitions, and sleek typography. Let's design yours next! What category best matches your vision?",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      if (normalizedQuery.includes("who are you") || normalizedQuery.includes("about yourself") || normalizedQuery.includes("identity") || normalizedQuery.includes("what are you")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "I am your custom Manzio Assistant. My protocol is to help you explore project parameters, provide high-fidelity technical advice, and synchronize your scope requirements directly with our technical directors. What are we building today?",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi") || normalizedQuery.includes("hey") || normalizedQuery.includes("greetings")) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Greetings. I am Manzio's digital strategist. I'm here to analyze your ideas and map out a custom strategic roadmap. What are you looking to build today? Select a category below or describe it in your own words.",
          options: STARTER_CATEGORIES
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(0);
        return;
      }

      // Keyword matching for Scoping Flow transitions
      if (normalizedQuery.includes("saas") || normalizedQuery.includes("platform") || normalizedQuery.includes("software")) {
        handleCategorySelect("SaaS Platform");
        return;
      }
      if (normalizedQuery.includes("website") || normalizedQuery.includes("landing") || normalizedQuery.includes("web page")) {
        handleCategorySelect("Startup Website");
        return;
      }
      if (normalizedQuery.includes("mobile") || normalizedQuery.includes("app") || normalizedQuery.includes("ios") || normalizedQuery.includes("android")) {
        handleCategorySelect("Mobile Application");
        return;
      }
      if (normalizedQuery.includes("ai") || normalizedQuery.includes("generative") || normalizedQuery.includes("gpt") || normalizedQuery.includes("llm")) {
        handleCategorySelect("AI Product");
        return;
      }
      if (normalizedQuery.includes("ecom") || normalizedQuery.includes("store") || normalizedQuery.includes("shop") || normalizedQuery.includes("stripe") || normalizedQuery.includes("buy")) {
        handleCategorySelect("Ecommerce Platform");
        return;
      }
      if (normalizedQuery.includes("branding") || normalizedQuery.includes("logo") || normalizedQuery.includes("identity")) {
        handleCategorySelect("Branding System");
        return;
      }
      if (normalizedQuery.includes("dashboard") || normalizedQuery.includes("portal") || normalizedQuery.includes("internal tool")) {
        handleCategorySelect("Enterprise Dashboard");
        return;
      }

      // Step-based custom message fallback or matching
      if (currentStep === 1 && category) {
        // Match option text if typed
        const opt = FLOW_DATA[category].options1.find(o => normalizedQuery.includes(o.toLowerCase()));
        if (opt) {
          handleStageSelect(opt);
          return;
        }
      } else if (currentStep === 2 && category) {
        const opt = FLOW_DATA[category].options2.find(o => normalizedQuery.includes(o.toLowerCase()));
        if (opt) {
          handleFeatureSelect(opt);
          return;
        }
      } else if (currentStep === 3) {
        const match = ["call", "proposal", "consultation"].find(w => normalizedQuery.includes(w));
        if (match) {
          const opt = match === "call" ? "Book a Call" : match === "proposal" ? "Get Proposal" : "Schedule Consultation";
          handleCtaClick(opt);
          return;
        }
      }

      // Final Dynamic Fallback
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "That sounds like a fascinating digital objective. To construct a highly accurate strategic blueprint, let's align on your category coordinates. Please select your project type below or describe your key feature focus in detail:",
        options: STARTER_CATEGORIES
      };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentStep(0);
    }, 1300);
  };

  const isInitialWelcome = messages.length <= 2 && currentStep === 0 && !isTyping;

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white overflow-hidden flex items-center justify-center font-sans select-none p-0 sm:p-4 md:p-6 lg:p-8">
      {/* ── 1. Fractal Noise Background Overlay ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.012] mix-blend-overlay select-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ── 2. Cinematic Dimmed Atmosphere Glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div
          className="absolute top-[5%] right-[5%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            filter: "blur(130px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[5%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.03) 0%, transparent 70%)",
            filter: "blur(130px)",
          }}
        />
      </div>

      {/* ── 3. Centered Assistant Container (ChatGPT styled) ── */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full sm:w-[90%] md:w-[82%] max-w-5xl h-screen sm:h-[82vh] bg-[#070709]/95 backdrop-blur-xl sm:border border-white/[0.04] sm:border-purple-500/15 sm:rounded-[24px] shadow-[0_0_60px_rgba(139,92,246,0.12)] shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
      >
        {/* Subtle inner top glow highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none rounded-[24px]" />

        {/* ── CONTAINER TOP HEADER ── */}
        <header className="relative z-10 w-full h-[68px] px-6 sm:px-8 border-b border-white/[0.04] flex items-center justify-between bg-[#08080a]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {/* Pulsing indicator light */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/90 font-display">
              Manzio Assistant
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-sans hidden sm:inline border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded-full">
              Online Active
            </span>
          </div>

          <Link
            href="/"
            aria-label="Close Assistant"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white transition-all duration-300 hover:border-purple-500/20 hover:bg-purple-500/5 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </Link>
        </header>

        {/* ── CHAT CONTAINER VIEWPORT ── */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto px-6 py-6 sm:px-12 sm:py-8 flex flex-col justify-between"
        >
          <div className="w-full flex-grow flex flex-col">
            <AnimatePresence mode="wait">
              {isInitialWelcome ? (
                // ── VERTICALLY CENTERED WELCOME SCREEN EXPERIENCE ──
                <motion.div
                  key="welcome-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-grow flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-4 sm:py-6"
                >
                  <h1 
                    className="text-white tracking-tight leading-[1.1] text-balance mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    style={{
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "clamp(28px, 4vw, 52px)",
                      fontWeight: 700
                    }}
                  >
                    What are you building?
                  </h1>

                  <p className="text-neutral-400 text-[13px] sm:text-[14.5px] leading-relaxed max-w-lg mb-8">
                    Tell us about your vision, and we’ll guide you toward the right digital solution and performance parameters.
                  </p>

                  {/* SELECTABLE CATEGORY CHIPS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                    {STARTER_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="px-5 py-4 rounded-xl text-left bg-[#121216]/40 border border-white/[0.03] hover:border-purple-500/25 text-neutral-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] cursor-pointer group flex flex-col justify-between h-[90px]"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80 group-hover:text-purple-300">
                          {`0${idx + 1}`}
                        </span>
                        <div className="flex items-center justify-between w-full mt-1.5">
                          <span className="text-[12px] font-semibold font-sans tracking-wide">
                            {cat}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // ── IMMERSIVE CONVERSATIONAL MESSAGE FEED STREAM ──
                <motion.div
                  key="chat-stream"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 sm:space-y-8 pb-4"
                >
                  {messages.map((msg, index) => {
                    const isAi = msg.sender === "ai";
                    const isLastMsg = index === messages.length - 1;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex gap-4 w-full ${isAi ? "justify-start" : "justify-end"}`}
                      >
                        {isAi && (
                          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex flex-col max-w-[85%] sm:max-w-[70%] gap-3">
                          {/* Text Message Bubble */}
                          <div
                            className={`rounded-2xl px-5 py-3.5 border text-[13.5px] sm:text-[14px] leading-relaxed shadow-md ${
                              isAi
                                ? "bg-white/[0.02] border-white/[0.03] text-neutral-200"
                                : "bg-purple-500/[0.04] border-purple-500/20 text-purple-300"
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* INLINE ROADMAP RECOMMENDATION CARD */}
                          {msg.type === "recommendation" && msg.recommendation && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="rounded-2xl p-5 sm:p-6 bg-[#0a0a0f] border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.08)] flex flex-col gap-4 mt-1"
                            >
                              <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
                                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                                  Custom Strategic Roadmap
                                </span>
                              </div>

                              {/* Tech Stack */}
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-500">
                                  Suggested Tech Stack
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                                  {msg.recommendation.techStack.map((tech) => (
                                    <div key={tech} className="flex items-start gap-1.5 text-neutral-300 text-[12px] sm:text-[12.5px]">
                                      <span className="text-purple-400 mt-1 shrink-0 select-none">▪</span>
                                      <span>{tech}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Focus & Timeline */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-500">
                                    Core Performance Focus
                                  </span>
                                  <span className="text-neutral-300 text-[12px] sm:text-[12.5px] leading-relaxed">
                                    {msg.recommendation.focus}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-500">
                                    Estimated Timeline
                                  </span>
                                  <span className="text-purple-400 font-semibold text-[12.5px] sm:text-[13px] leading-relaxed">
                                    {msg.recommendation.timeline}
                                  </span>
                                </div>
                              </div>

                              {/* Strategic Suggestion */}
                              <div className="flex flex-col gap-0.5 pt-3 border-t border-white/[0.04]">
                                <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-500">
                                  Strategic Guidance
                                </span>
                                <span className="text-neutral-300 text-[12px] leading-relaxed italic">
                                  {msg.recommendation.suggestion}
                                </span>
                              </div>
                            </motion.div>
                          )}

                          {/* INLINE INGESTION FORM CARD */}
                          {msg.type === "form" && (
                            <motion.form
                              onSubmit={handleFormSubmit}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="rounded-2xl p-5 bg-[#0a0a0f] border border-white/[0.05] shadow-lg flex flex-col gap-3.5 mt-1 w-full"
                            >
                              <input
                                type="text"
                                required
                                disabled={isSubmitting || currentStep === 5}
                                value={leadName}
                                onChange={(e) => setLeadName(e.target.value)}
                                placeholder="Your Name / Identity"
                                className="w-full bg-black/40 border border-white/[0.05] focus:border-purple-500/40 rounded-xl px-4 py-3 text-[13px] outline-none text-white placeholder-white/20 font-sans transition-all duration-300 disabled:opacity-50"
                              />

                              <input
                                type="email"
                                required
                                disabled={isSubmitting || currentStep === 5}
                                value={leadEmail}
                                onChange={(e) => setLeadEmail(e.target.value)}
                                placeholder="Secure Email Address"
                                className="w-full bg-black/40 border border-white/[0.05] focus:border-purple-500/40 rounded-xl px-4 py-3 text-[13px] outline-none text-white placeholder-white/20 font-sans transition-all duration-300 disabled:opacity-50"
                              />

                              <button
                                type="submit"
                                disabled={isSubmitting || currentStep === 5}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans py-3 rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.18)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Syncing Coordinates...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Initialize Strategy Session</span>
                                    <CornerDownLeft className="w-3.5 h-3.5 text-white/80" />
                                  </>
                                )}
                              </button>
                            </motion.form>
                          )}

                          {/* INLINE SUCCESS TRIGGER */}
                          {msg.type === "success" && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-2xl p-5 bg-purple-500/[0.02] border border-purple-500/25 shadow-md flex flex-col items-center text-center gap-3.5 mt-1"
                            >
                              <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-md shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold text-[13px] uppercase tracking-wider mb-1">Scoping Completed</h4>
                                <p className="text-neutral-400 text-[12px] leading-relaxed max-w-sm">
                                  An engineering director is now synchronized. You can close this strategist deck or restart to scope a secondary idea.
                                </p>
                              </div>
                              <div className="flex gap-2.5 mt-1">
                                <button
                                  onClick={resetChat}
                                  className="text-[10px] font-bold uppercase tracking-widest text-purple-400 hover:text-white transition-colors duration-300 cursor-pointer border border-purple-400/20 rounded-full px-3.5 py-1.5 hover:bg-purple-500/5"
                                >
                                  Restart Scoping
                                </button>
                                <Link
                                  href="/"
                                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer border border-white/10 rounded-full px-3.5 py-1.5 hover:bg-white/5"
                                >
                                  Return Home
                                </Link>
                              </div>
                            </motion.div>
                          )}

                          {/* ── INLINE DYNAMIC OPTIONS CHIPS RENDERING ── */}
                          {isLastMsg && msg.options && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              className="flex flex-wrap gap-2 mt-2 w-full justify-start"
                            >
                              {msg.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    if (currentStep === 0) {
                                      handleCategorySelect(opt);
                                    } else if (currentStep === 1) {
                                      handleStageSelect(opt);
                                    } else if (currentStep === 2) {
                                      handleFeatureSelect(opt);
                                    } else if (currentStep === 3) {
                                      handleCtaClick(opt);
                                    }
                                  }}
                                  className="px-4 py-2 rounded-xl bg-[#121216]/50 border border-white/[0.03] hover:border-purple-500/25 hover:bg-purple-500/[0.03] text-neutral-300 hover:text-white transition-all duration-300 text-[11.5px] sm:text-xs font-semibold tracking-wide cursor-pointer flex-grow sm:flex-grow-0"
                                >
                                  {opt}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        {!isAi && (
                          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 shadow-sm shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* 3-Dot Bouncing Typing Bubble */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 w-full justify-start animate-pulse"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="rounded-2xl px-5 py-3 border border-white/[0.03] bg-white/[0.01] backdrop-blur-md shadow-md flex items-center gap-1.5 max-w-[90px] h-[46px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── CHAT BOTTOM INPUT CONTAINER (ChatGPT Styled) ── */}
        <footer className="relative z-10 w-full px-6 pb-6 pt-2 sm:px-8 sm:pb-8 shrink-0 bg-transparent">
          <div className="w-full max-w-3xl mx-auto">
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-center rounded-2xl border border-white/[0.05] focus-within:border-purple-500/35 bg-[#0e0e12]/80 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-all duration-300 px-4 py-2.5 sm:py-3.5"
            >
              <input
                ref={inputRef}
                type="text"
                disabled={currentStep >= 4}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  currentStep >= 4 
                    ? "Scoping ingestion active..." 
                    : "Ask custom questions or describe your ideas directly..."
                }
                className="flex-grow bg-transparent text-[13px] sm:text-[14.5px] outline-none text-white placeholder-white/20 font-sans pr-12 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!userInput.trim() || currentStep >= 4}
                className={`absolute right-3 p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  userInput.trim() && currentStep < 4
                    ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105"
                    : "bg-white/[0.02] text-neutral-600 border border-white/5"
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
