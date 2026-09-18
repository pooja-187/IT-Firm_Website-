'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { ZoomParallax } from "@/components/ui/zoom-parallax";

export default function DefaultDemo() {
	const images = [
		{
			src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Modern architecture building',
		},
		{
			src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Urban cityscape at sunset',
		},
		{
			src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Abstract geometric pattern',
		},
		{
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Mountain landscape',
		},
		{
			src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Minimalist design elements',
		},
		{
			src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Ocean waves and beach',
		},
		{
			src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Forest trees and sunlight',
		},
	];

	return (
		<main className="min-h-screen w-full relative">
			{/* Sticky/Overlaid heading on top of the parallax */}
			<div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-center h-screen text-center px-6">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]',
						'blur-[30px]',
					)}
				/>
				<h1 className="text-center text-4xl font-bold">
					Services crafted for Ambitious brands
				</h1>
			</div>
			<ZoomParallax images={images} />
		</main>
	);
}

import { Component as ParallaxScrollFeatureSection } from "@/components/ui/parallax-scroll-feature-section";

export function DemoOne() {
  return <ParallaxScrollFeatureSection />;
}

import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

export function AnimatedTextCycleDemo() {
  return (
    <div className="p-4 max-w-[500px]">
        <h1 className="text-4xl font-light text-left text-muted-foreground">
            Your <AnimatedTextCycle 
                words={[
                    "business",
                    "team",
                    "workflow",
                    "future",
                    "productivity",
                    "projects",
                    "analytics",
                    "dashboard",
                    "platform"
                ]}
                interval={3000}
                className={"text-foreground font-semi-bold"} 
            /> deserves better tools
        </h1>
    </div>
  );
}

import { MagicText } from "@/components/ui/magic-text";

const Demo = () => {
  return (
    <>
      <div className="relative flex items-center justify-center pb-[30rem] mt-[70rem] w-full px-6">
        <MagicText
          text="Hi there! I'm preet, creator of HextaUI. Thank you so much of all the support and love you've shown me. I hope you enjoy using HextaUI as much as I enjoyed creating it."
          className="max-w-3xl mx-auto flex flex-wrap justify-center text-center leading-normal"
          wordClassName="text-white text-3xl font-semibold mt-[12px] mr-2"
        />
      </div>
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white/50 font-mono tracking-widest uppercase text-xs">Scroll Down 👇</p>
    </>
  );
};

export { Demo };

