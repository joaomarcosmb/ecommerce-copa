import { useEffect, useState } from "react";

import { infoSlides, type InfoSlide } from "@/components/ecommerce-showcase/data";

type InfoSlidesState = {
  data: InfoSlide[];
  isLoading: boolean;
  error: Error | null;
};

export function useInfoSlides(): InfoSlidesState {
  const [state, setState] = useState<InfoSlidesState>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: replace with fetch("/api/info-slides").then(r => r.json())
    Promise.resolve(infoSlides)
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((error) => setState({ data: [], isLoading: false, error }));
  }, []);

  return state;
}
