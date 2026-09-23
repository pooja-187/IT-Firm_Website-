import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppContainer } from "@/components/ui/AppContainer";
import { StarField } from "@/components/ui/StarField";
import { FloatingDeck } from "@/components/ui/FloatingDeck";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Manzio Creative Studio | Immersive Digital Design & Brand Experiences",
  description: "Manzio is a high-fidelity digital creative studio crafting cinematic web platforms, sleek user interfaces, and luxury brand design systems.",
  keywords: ["Manzio", "Creative Studio", "Digital Design", "Web Development", "Cinematic Web", "Luxury Brand Design", "Framer Motion", "Next.js"],
  authors: [{ name: "Manzio Studio Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Manzio Creative Studio | Immersive Digital Design",
    description: "Cinematic, motion-first digital design and high-fidelity product creation.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if(typeof navigator!=="undefined"&&/Android/i.test(navigator.userAgent)){document.documentElement.classList.add("is-android");}
              window.__isNavOpen=false;
              window.__reactNavHydrated=false;
              window.__toggleMobileNav=function(e){
                if(e&&(e.type==='pointerdown'||e.type==='touchstart'))e.preventDefault();
                window.__isNavOpen=!window.__isNavOpen;
                var drawer=document.getElementById('mobile-nav-drawer');
                var btn=document.getElementById('mobile-nav-toggle-btn');
                if(drawer){
                  if(window.__isNavOpen){
                    drawer.style.display='flex';
                    drawer.style.opacity='1';
                    drawer.style.visibility='visible';
                    drawer.style.pointerEvents='auto';
                    document.documentElement.style.overflow='hidden';
                  }else{
                    drawer.style.display='none';
                    drawer.style.opacity='0';
                    drawer.style.visibility='hidden';
                    drawer.style.pointerEvents='none';
                    document.documentElement.style.overflow='';
                  }
                }
                if(btn){
                  btn.setAttribute('aria-expanded',window.__isNavOpen?'true':'false');
                }
              };
              document.addEventListener('pointerdown',function(e){
                var t=e.target;
                if(t&&t.closest&&t.closest('#mobile-nav-toggle-btn')){
                  if(!window.__reactNavHydrated){
                    window.__toggleMobileNav(e);
                  }
                }
              },{passive:false});
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col text-text-primary" style={{ backgroundColor: '#050505' }}>

        {/* FULL-VIEWPORT ATMOSPHERIC BACKGROUND — fixed, spans edge-to-edge regardless of container width */}
        <div className="fixed inset-0 pointer-events-none select-none" style={{ zIndex: 0 }}>
          {/* Left glow: purple, bottom-left corner — Mobile: zero-blur radial gradient; Desktop: original styling */}
          <div
            className="block md:hidden absolute pointer-events-none android-hide-underlay"
            style={{
              width: '100vw',
              height: '100vh',
              left: '-20vw',
              bottom: '-30vh',
              background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)',
            }}
          />
          <div
            className="hidden md:block absolute rounded-full"
            style={{
              width: '1400px',
              height: '1400px',
              left: '-700px',
              bottom: '-900px',
              backgroundColor: '#7c3aed',
              opacity: 0.18,
              filter: 'blur(320px)',
            }}
          />
          {/* Right glow: deep pink, bottom-right corner — Mobile: zero-blur radial gradient; Desktop: original styling */}
          <div
            className="block md:hidden absolute pointer-events-none android-hide-underlay"
            style={{
              width: '100vw',
              height: '100vh',
              right: '-20vw',
              bottom: '-30vh',
              background: 'radial-gradient(circle at center, rgba(190, 24, 93, 0.14) 0%, rgba(190, 24, 93, 0.06) 40%, transparent 70%)',
            }}
          />
          <div
            className="hidden md:block absolute rounded-full"
            style={{
              width: '1500px',
              height: '1500px',
              right: '-750px',
              bottom: '-950px',
              backgroundColor: '#be185d',
              opacity: 0.14,
              filter: 'blur(340px)',
            }}
          />
          {/* ── Cinematic starfield (fixed, full-viewport, scroll-parallax) ── */}
          <StarField />
          {/* Top vignette: keep header area deep black */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.4) 40%, transparent 65%)',
            }}
          />
        </div>

        <SmoothScroll>
          <div className="relative flex flex-col min-h-screen w-full android-root-scroller" style={{ zIndex: 1 }}>
            {/* Seamless floating navbar container overlaying the hero section */}
            <div className="fixed top-0 left-0 right-0 z-50 w-full">
              <AppContainer>
                <Navbar />
              </AppContainer>
            </div>
            <main className="flex-grow w-full">
              {children}
            </main>
          </div>
          <Footer />
        </SmoothScroll>
        <FloatingDeck />
      </body>
    </html>
  );
}

