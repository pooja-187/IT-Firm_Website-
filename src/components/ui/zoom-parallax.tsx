'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
	children?: React.ReactNode;
}

export function ZoomParallax({ images, children }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Center image zooms smoothly to 5.5x (137.5vw x 137.5vh) so it completely fills 100% of the screen by 0.5 progress,
	// and holds full screen from 0.5 to 0.92 before unpinning downwards.
	const centerScale = useTransform(scrollYProgress, [0, 0.5, 0.92, 1], [1, 5.5, 5.5, 5.5]);

	// Surrounding images scale outwards and fade out before center image fills the screen
	const scale5 = useTransform(scrollYProgress, [0, 0.5], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 0.5], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 0.5], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 0.5], [1, 9]);

	const outerOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.6, 0]);
	const ringOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

	const scales = [centerScale, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{/* Sticky overlaid heading - remains fully visible without fading in or out */}
				{children && (
					<div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
						{children}
					</div>
				)}

				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];
					const isCenter = index === 0;

					return (
						<motion.div
							key={index}
							style={{
								scale,
								opacity: isCenter ? 1 : outerOpacity,
							}}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${isCenter ? 'z-10' : 'z-0'} ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
						>
							<div
								className={`relative h-[25vh] w-[25vw] overflow-hidden ${
									isCenter
										? 'rounded-2xl'
										: 'rounded-xl ring-1 ring-white/10 shadow-2xl opacity-90'
								}`}
							>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
								{isCenter && (
									<>
										<motion.div
											style={{ opacity: ringOpacity }}
											className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-purple-500/70 shadow-[0_0_60px_rgba(168,85,247,0.45)]"
										/>
										<motion.div
											style={{ opacity: ringOpacity }}
											className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
										/>
									</>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
