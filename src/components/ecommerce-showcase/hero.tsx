import { useCallback, useEffect, useRef, useState } from "react";

import { Pause, Play } from "lucide-react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { useHeroSlides } from "@/hooks/use-hero-slides";
import { H1, P } from "../typography";
import { Button } from "@/components/ui/button";

const AUTOPLAY_INTERVAL_MS = 8000;

export function HeroSection() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const isPausedRef = useRef(false);
	const { data: slides } = useHeroSlides();

	const startAutoplay = useCallback((carouselApi: CarouselApi) => {
		const id = window.setInterval(() => {
			if (!isPausedRef.current) carouselApi?.scrollNext();
		}, AUTOPLAY_INTERVAL_MS);
		return () => window.clearInterval(id);
	}, []);

	useEffect(() => {
		isPausedRef.current = isPaused;
	}, [isPaused]);

	useEffect(() => {
		if (!api) return;

		setCurrent(api.selectedScrollSnap());
		api.on("select", () => setCurrent(api.selectedScrollSnap()));

		const stop = startAutoplay(api);

		const onVisibilityChange = () => {
			isPausedRef.current = document.hidden || isPaused;
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			stop();
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [api, startAutoplay, isPaused]);

	return (
		<section
			className="relative h-[68vh] min-h-100 w-full overflow-hidden sm:h-150 lg:h-175.5"
			onMouseEnter={() => {
				isPausedRef.current = true;
			}}
			onMouseLeave={() => {
				isPausedRef.current = isPaused;
			}}
		>
			<Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
				<CarouselContent className="ml-0 h-full">
					{slides.map((slide, index) => (
						<CarouselItem
							key={slide.id}
							className="relative h-[68vh] min-h-100 pl-0 sm:h-150 lg:h-175.5"
						>
							<img
								src={slide.image}
								alt={slide.title}
								className="absolute inset-0 h-full w-full object-cover"
								loading={index === 0 ? "eager" : "lazy"}
								fetchPriority={index === 0 ? "high" : "auto"}
							/>
							<div className="absolute inset-0 bg-black/50" />
							<div className="relative z-10 flex h-full items-center px-10 sm:px-10 lg:px-30">
								<div className="w-full max-w-lg">
									<H1 className="font-big-shoulders text-[32px] leading-9 font-bold text-white sm:text-5xl sm:leading-[1.1] lg:text-[57px] lg:leading-16">
										{slide.title}
									</H1>
									<P className="mt-3 text-white/90 sm:mt-4">{slide.subtitle}</P>
									<Button size="lg" className="mt-6 sm:mt-8" asChild>
										<a href={slide.link}>{slide.cta}</a>
									</Button>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<div
					role="tablist"
					aria-label="Slides do banner"
					className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3"
				>
					{slides.map((slide, i) => (
						<button
							key={slide.id}
							type="button"
							role="tab"
							onClick={() => api?.scrollTo(i)}
							aria-label={`Ir para banner ${i + 1}: ${slide.title}`}
							aria-selected={i === current}
							className={`rounded-full transition-all ${i === current ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/50 hover:bg-white/75"}`}
						/>
					))}
				</div>

				<button
					type="button"
					onClick={() => setIsPaused((p) => !p)}
					aria-label={
						isPaused
							? "Retomar apresentação automática"
							: "Pausar apresentação automática"
					}
					aria-pressed={isPaused}
					className="absolute bottom-5 right-8 z-10 flex size-7 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
				>
					{isPaused ? (
						<Play className="size-4 fill-current" aria-hidden="true" />
					) : (
						<Pause className="size-4 fill-current" aria-hidden="true" />
					)}
				</button>

				<CarouselPrevious
					className="left-8 top-1/2 hidden size-8 -translate-y-1/2 cursor-pointer bg-transparent text-primary-foreground transition-colors hover:bg-white/30 sm:flex"
					aria-label="Banner anterior"
				/>
				<CarouselNext
					className="right-8 top-1/2 hidden size-8 -translate-y-1/2 cursor-pointer bg-transparent text-primary-foreground transition-colors hover:bg-white/30 sm:flex"
					aria-label="Próximo banner"
				/>
			</Carousel>
		</section>
	);
}
