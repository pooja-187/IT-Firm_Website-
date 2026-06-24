import React from 'react';

interface Project {
  title: string;
  imageUrl: string;
}

interface ImageAutoSliderProps {
  projects?: Project[];
}

export const ImageAutoSlider = ({ projects: customProjects }: ImageAutoSliderProps) => {
  // Mock fallback projects
  const defaultProjects: Project[] = [
    { 
      title: "DMC Automation", 
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&q=80" 
    },
    { 
      title: "Explore World", 
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop&q=80" 
    },
    { 
      title: "Hyat Holidays", 
      imageUrl: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=800&fit=crop&q=80" 
    },
    { 
      title: "Aurala System", 
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=800&fit=crop&q=80" 
    },
    { 
      title: "TriptoGoa Portal", 
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop&q=80" 
    },
    { 
      title: "Uknowtrip App", 
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&q=80" 
    }
  ];

  const projects = customProjects && customProjects.length > 0 ? customProjects : defaultProjects;
  const duplicatedProjects = [...projects, ...projects];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .image-item:hover {
          transform: scale(1.03);
          filter: brightness(1.08);
          border-color: rgba(168, 85, 247, 0.25);
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden flex items-center justify-center bg-transparent py-12 z-10">
        {/* Scrolling images container */}
        <div className="relative w-full flex items-center justify-center py-4">
          <div className="scroll-container w-full max-w-none">
            <div className="infinite-scroll flex gap-8 w-max">
              {duplicatedProjects.map((project, index) => (
                <div key={index} className="flex flex-col items-center group">
                  {/* Rectangular Widescreen Card */}
                  <div
                    className="image-item flex-shrink-0 w-72 h-44 sm:w-96 sm:h-60 lg:w-[440px] lg:h-[275px] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.05]"
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Website Name */}
                  <div className="mt-4 text-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] md:text-xs font-semibold font-mono uppercase tracking-[0.25em] text-white">
                      {project.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
