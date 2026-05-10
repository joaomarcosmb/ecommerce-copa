import { useCallback, useEffect, useRef, useState } from "react";

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
  const isPausedRef = useRef(false);
  const { data: slides } = useHeroSlides();

  const startAutoplay = useCallback((carouselApi: CarouselApi) => {
    const id = window.setInterval(() => {
      if (!isPausedRef.current) carouselApi.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));

    const stop = startAutoplay(api);

    const onVisibilityChange = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [api, startAutoplay]);

  return (
    <section
      className="relative h-175.5 w-full overflow-hidden"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative h-175.5 pl-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-black/50" />
              {/* TODO: Review mobile layout for this section */}
              <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-30">
                <div className="max-w-lg">
                  <H1 className="font-big-shoulders font-bold text-white">
                    {slide.title}
                  </H1>
                  <P className="mt-4 text-white/90">{slide.subtitle}</P>
                  <Button size="lg" className="mt-8" asChild>
                    <a href={slide.link}>{slide.cta}</a>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3"
          role="tablist"
          aria-label="Slides do banner"
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

        <CarouselPrevious
          className="left-8 top-1/2 size-8 -translate-y-1/2 cursor-pointer bg-transparent text-primary-foreground transition-colors hover:bg-white/30"
          aria-label="Banner anterior"
        />
        <CarouselNext
          className="right-8 top-1/2 size-8 -translate-y-1/2 cursor-pointer bg-transparent text-primary-foreground transition-colors hover:bg-white/30"
          aria-label="Próximo banner"
        />
      </Carousel>
    </section>
  );
}
