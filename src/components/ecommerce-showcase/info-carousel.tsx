import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { infoSlides } from "./data";

const INFO_AUTOPLAY_INTERVAL_MS = 4500;

export function InfoCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = window.setInterval(() => {
      api.scrollNext();
    }, INFO_AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [api]);

  return (
    <section className="border-b border-slate-200 bg-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full px-12 sm:px-14"
          aria-label="Informações e destaques da loja"
        >
          <CarouselContent className="ml-0">
            {infoSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="mx-auto flex w-full max-w-4xl items-center justify-center gap-3 rounded-full bg-none px-4 py-2 text-center sm:px-8">
                  <Badge variant={slide.badgeVariant}>{slide.badge}</Badge>
                  <p className="font-['Poppins',sans-serif] text-[13px] text-slate-700">
                    {slide.text}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-2 top-1/2 size-8 -translate-y-1/2 text-slate-700 hover:bg-transparent cursor-pointer"
            aria-label="Informação anterior"
          />
          <CarouselNext
            className="right-2 top-1/2 size-8 -translate-y-1/2 text-slate-700 hover:bg-transparent cursor-pointer"
            aria-label="Próxima informação"
          />
        </Carousel>
      </div>
    </section>
  );
}
