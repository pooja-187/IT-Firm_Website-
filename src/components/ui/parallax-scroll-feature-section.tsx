'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { ArrowDown } from "lucide-react"
import { cn } from "@/utils/cn"

export interface ServiceSection {
    id: number;
    title: string;
    shortDescription: string;
    detailedOverview: string;
    capabilities: string[];
    technologies: string[];
    imageUrl: string;
    reverse: boolean;
}

const DEFAULT_SECTIONS: ServiceSection[] = [
    {
        id: 1,
        title: "SOFTWARE DEVELOPMENT",
        shortDescription: "We engineer scalable software products, enterprise platforms, and digital ecosystems built for long-term growth.",
        detailedOverview: "From startup MVPs to enterprise-grade platforms, we develop high-performance software solutions that combine reliability, scalability, and exceptional user experiences. Every system is architected for performance, security, and future expansion.",
        capabilities: [
            "Custom Software Development",
            "Enterprise Platforms",
            "SaaS Applications",
            "CRM & ERP Systems",
            "API Integrations",
            "Cloud-Native Solutions"
        ],
        technologies: ["Next.js", "React", "Node.js", "Django", "PostgreSQL", "AWS"],
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&q=80',
        reverse: false
    },
    {
        id: 2,
        title: "UI/UX DESIGN",
        shortDescription: "We craft intuitive digital experiences that transform complex ideas into elegant user journeys.",
        detailedOverview: "Our design process blends research, strategy, and creativity to create user experiences that are visually refined and highly functional. Every interface is designed to improve engagement, usability, and brand perception.",
        capabilities: [
            "User Experience Design",
            "User Interface Design",
            "Design Systems",
            "Wireframing & Prototyping",
            "Interaction Design",
            "Usability Testing"
        ],
        technologies: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "Framer", "Spline"],
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop&q=80',
        reverse: true
    },
    {
        id: 3,
        title: "MOBILE APP DEVELOPMENT",
        shortDescription: "We build fast, scalable mobile applications that deliver seamless experiences across devices.",
        detailedOverview: "From consumer apps to enterprise mobility solutions, we develop mobile experiences that prioritize performance, usability, and business growth. Every application is optimized for reliability and long-term scalability.",
        capabilities: [
            "iOS App Development",
            "Android App Development",
            "Cross-Platform Apps",
            "Enterprise Mobility",
            "App Modernization",
            "App Maintenance"
        ],
        technologies: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Supabase"],
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=800&fit=crop&q=80',
        reverse: false
    },
    {
        id: 4,
        title: "AI SOLUTIONS",
        shortDescription: "We develop intelligent systems that automate workflows, enhance decision-making, and unlock new opportunities.",
        detailedOverview: "Our AI solutions combine machine learning, generative AI, and automation technologies to help businesses operate smarter and scale faster. We create practical AI applications focused on real business outcomes.",
        capabilities: [
            "AI Assistants",
            "Generative AI Systems",
            "Workflow Automation",
            "Predictive Analytics",
            "Computer Vision",
            "AI Integration Services"
        ],
        technologies: ["OpenAI", "Gemini", "LangChain", "Python", "TensorFlow", "Pinecone"],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop&q=80',
        reverse: true
    },
    {
        id: 5,
        title: "BRANDING & IDENTITY",
        shortDescription: "We create memorable brands that communicate trust, clarity, and long-term market value.",
        detailedOverview: "A strong brand is more than a logo. We develop complete visual identities, messaging systems, and brand experiences that help businesses stand out and build meaningful connections with their audience.",
        capabilities: [
            "Brand Strategy",
            "Visual Identity Design",
            "Logo Design",
            "Brand Guidelines",
            "Marketing Assets",
            "Digital Brand Experiences"
        ],
        technologies: ["Illustrator", "Photoshop", "After Effects", "Figma", "InDesign", "Blender"],
        imageUrl: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=800&fit=crop&q=80',
        reverse: false
    }
]

export const Component = ({ sections = DEFAULT_SECTIONS }: { sections?: ServiceSection[] }) => {
    const sectionRefs = sections.map(() => useRef(null));
    
    const scrollYProgress = sections.map((_, index) => {
        return useScroll({
            target: sectionRefs[index],
            offset: ["start end", "center start"]
        }).scrollYProgress;
    });

    const opacityContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], [0, 1])
    );
    
    const clipProgresses = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
    );
    
    const translateContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 1], [-50, 0])
    );

  return (
    <div>
       <div className="flex flex-col md:px-0 px-6 max-w-7xl mx-auto w-full pb-24">
            {sections.map((section, index) => (
                <div 
                    key={section.id}
                    ref={sectionRefs[index]} 
                    className={`min-h-[85vh] py-16 md:py-24 flex flex-col md:flex-row items-center justify-center md:gap-32 gap-12 ${section.reverse ? 'md:flex-row-reverse' : ''}`}
                >
                    <motion.div style={{ y: translateContents[index] }} className="flex flex-col justify-center max-w-xl w-full">
                        <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-purple-400 mb-3 block">
                          {`0${index + 1} . ${section.title}`}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug mb-5" style={{ fontFamily: "Satoshi, sans-serif" }}>
                          {section.shortDescription}
                        </h3>
                        
                        <p className="text-white/50 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                          {section.detailedOverview}
                        </p>
                        
                        {/* Capabilities Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                          {section.capabilities.map((capability, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2 text-xs text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                              <span style={{ fontFamily: "Inter, sans-serif" }}>{capability}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Technologies Tags */}
                        <div className="flex flex-wrap gap-2">
                          {section.technologies.map((tech, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="text-[9px] font-semibold font-mono uppercase tracking-widest text-white/35 border border-white/[0.07] rounded-full px-3 py-1 hover:border-purple-500/25 hover:text-purple-300/60 transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        style={{ 
                            opacity: opacityContents[index],
                            clipPath: clipProgresses[index],
                        }}
                        className="relative flex items-center justify-center flex-shrink-0"
                    >
                        <img 
                            src={section.imageUrl} 
                            className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl border border-white/[0.08]" 
                            alt={`Section ${section.id}` }
                        />
                    </motion.div>
                </div>
            ))}
        </div>
    </div>
  );
};
