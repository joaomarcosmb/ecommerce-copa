import { useCallback, useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useInfoSlides } from "@/hooks/use-info-slides";

const AUTOPLAY_INTERVAL_MS = 4500;

export function InfoCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const isPausedRef = useRef(false);
  const { data: slides } = useInfoSlides();

  const startAutoplay = useCallback((carouselApi: CarouselApi) => {
    const id = window.setInterval(() => {
      if (!isPausedRef.current) carouselApi.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!api) return;

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
      className="bg-slate-900"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full px-12 sm:px-14"
          aria-label="Informações e destaques da loja"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <p className="mx-auto flex w-full max-w-4xl items-center justify-center px-4 py-2 text-center font-sans text-[13px] text-primary-foreground sm:px-8">
                  {slide.text}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-2 top-1/2 size-8 -translate-y-1/2 cursor-pointer text-primary-foreground hover:bg-transparent"
            aria-label="Informação anterior"
          />
          <CarouselNext
            className="right-2 top-1/2 size-8 -translate-y-1/2 cursor-pointer text-primary-foreground hover:bg-transparent"
            aria-label="Próxima informação"
          />
        </Carousel>
      </div>
    </section>
  );
}
